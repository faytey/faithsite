import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const TOPICS = [
  "Seen (visibility)",
  "Sold (go-to-market)",
  "Funded (investor readiness)",
  "All three",
  "Advisory session",
  "Investor or fund enquiry",
  "Something else",
] as const;

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  topic: z.enum(TOPICS),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(200).optional().default(""), // honeypot
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    // Bots fill the hidden field; pretend success so they move on.
    if (data.website) return { ok: true as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { clientHash } = await import("./request-hash.server");
    const hash = clientHash(getRequest().headers);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("client_hash", hash)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) {
      return { ok: false as const, error: "Too many messages in a short time. Please try again in an hour." };
    }
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      full_name: data.fullName,
      email: data.email,
      company: data.company || null,
      topic: data.topic,
      message: data.message,
      client_hash: hash,
    });
    if (error) {
      console.error("contact insert failed", error);
      return { ok: false as const, error: "Your message couldn't be sent. Please try again or book a call." };
    }
    await supabaseAdmin.from("site_events").insert({ event: "contact_form_submit", location: "contact" });
    return { ok: true as const };
  });

const eventSchema = z.object({
  event: z.enum(["book_call_click", "contact_form_start"]),
  location: z.string().regex(/^[a-z0-9_-]{1,40}$/),
});

// Privacy-friendly: stores only the event name, the page section and a timestamp. No cookies, IPs or IDs.
export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => eventSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("site_events").insert(data);
    return { ok: true };
  });
