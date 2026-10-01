import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  business: z.string().trim().min(20).max(1500),
  traction: z.string().trim().min(5).max(1000),
  goals: z.string().trim().min(10).max(1000),
  stage: z.string().trim().max(60).optional().default(""),
});

const SYSTEM = `You are an assistant on the website of Faith M. Roberts, a growth and venture ecosystem strategist who helps founders across Africa and emerging markets get Seen (positioning, story, visibility), Sold (go-to-market, customers, partnerships) and Funded (investor readiness).
Write a concise, practical action plan for the founder based only on what they share. Use plain, confident English. Never promise funding, investor introductions or specific results. Never invent facts about their business.
Format in Markdown exactly like this:
## Where you are
2 sentences summarising their position and the biggest gap.
## Seen
3 to 4 bullet actions for the next 30 days.
## Sold
3 to 4 bullet actions.
## Funded
3 to 4 bullet actions (if fundraising is not a near-term goal, say what to prepare first).
## Your first step this week
One specific action.
Keep the whole plan under 400 words.`;

function json(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: { "Content-Type": "application/json" } });
}

export const Route = createFileRoute("/api/plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json(400, "Please fill in each field with a little more detail.");
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return json(500, "The plan builder isn't configured yet.");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { clientHash } = await import("@/lib/request-hash.server");
        const hash = clientHash(request.headers);
        const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count } = await supabaseAdmin
          .from("plan_requests")
          .select("id", { count: "exact", head: true })
          .eq("client_hash", hash)
          .gte("created_at", since);
        if ((count ?? 0) >= 5) return json(429, "You've generated several plans already. Please try again in an hour.");
        await supabaseAdmin.from("plan_requests").insert({ client_hash: hash });

        const d = parsed.data;
        const userText = `Business: ${d.business}\nStage: ${d.stage || "not specified"}\nTraction so far: ${d.traction}\nGoals: ${d.goals}`;

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              Authorization: `Bearer ${apiKey}`,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              stream: true,
              store: false,
              reasoning: { effort: "low" },
              instructions: SYSTEM,
              input: [{ role: "user", content: userText }],
            }),
          });
        } catch (e) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw e;
        }

        if (!upstream.ok || !upstream.body) {
          const body = await upstream.text().catch(() => "");
          console.error("plan gateway error", upstream.status, body.slice(0, 500));
          const msg =
            upstream.status === 429
              ? "The plan builder is busy right now. Please try again in a minute."
              : upstream.status === 402 || upstream.status === 403
                ? "The plan builder is temporarily unavailable."
                : "Something went wrong generating your plan. Please try again.";
          return json(upstream.status === 429 ? 429 : 502, msg);
        }

        await supabaseAdmin.from("site_events").insert({ event: "plan_generated", location: "action-plan" });

        // Convert the gateway's SSE events into a plain text stream of answer deltas.
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";
        const transform = new TransformStream<Uint8Array, Uint8Array>({
          transform(chunk, controller) {
            buffer += decoder.decode(chunk, { stream: true });
            const frames = buffer.split("\n\n");
            buffer = frames.pop() ?? "";
            for (const frame of frames) {
              const dataLine = frame.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("");
              if (!dataLine || dataLine === "[DONE]") continue;
              try {
                const evt = JSON.parse(dataLine);
                if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                  controller.enqueue(encoder.encode(evt.delta));
                } else if (evt.type === "response.failed" || evt.type === "error") {
                  controller.enqueue(encoder.encode("\n\n[[ERROR]]"));
                } else if (evt.type === "response.incomplete" && evt.response?.incomplete_details?.reason === "content_filter") {
                  controller.enqueue(encoder.encode("\n\n[[ERROR]]"));
                }
              } catch {
                /* ignore partial/non-JSON frames */
              }
            }
          },
        });

        return new Response(upstream.body.pipeThrough(transform), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});
