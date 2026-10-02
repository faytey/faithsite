import { useRef, useState } from "react";
import { BookCall } from "./BookCall";

const field =
  "mt-2 block w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground field-ring";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i} className="text-foreground">{p.slice(2, -2)}</strong> : p,
  );
}

function Plan({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length)
      out.push(
        <ul key={`u${out.length}`} className="mt-2 list-disc space-y-1.5 pl-5 marker:text-gold">
          {list.map((l, i) => <li key={i}>{inline(l)}</li>)}
        </ul>,
      );
    list = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const h = line.match(/^#{1,4}\s+(.*)/);
    const b = line.match(/^(?:[-*]|\d+\.)\s+(.*)/);
    if (h) { flush(); out.push(<h3 key={`h${out.length}`} className="mt-6 text-lg font-bold text-gold first:mt-0">{h[1]}</h3>); }
    else if (b) list.push(b[1]);
    else { flush(); out.push(<p key={`p${out.length}`} className="mt-2">{inline(line)}</p>); }
  }
  flush();
  return <div className="leading-relaxed text-muted-foreground">{out}</div>;
}

export function PlanBuilder() {
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if ((v.business?.trim().length ?? 0) < 20 || (v.traction?.trim().length ?? 0) < 5 || (v.goals?.trim().length ?? 0) < 10) {
      setStatus("error");
      setError("Please add a little more detail to each field so the plan can be specific.");
      return;
    }
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPlan("");
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Something went wrong generating your plan. Please try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        if (acc.includes("[[ERROR]]")) {
          setPlan(acc.replace(/\s*\[\[ERROR\]\][\s\S]*/, ""));
          throw new Error("The plan couldn't be completed. Please try again.");
        }
        setPlan(acc);
      }
      setStatus(acc.trim() ? "done" : "error");
      if (!acc.trim()) setError("No plan was returned. Please try again.");
    } catch (err) {
      if (ac.signal.aborted) { setStatus(plan ? "done" : "idle"); return; }
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 card-depth sm:p-8">
        <div>
          <label htmlFor="business" className="text-sm font-medium">What does your business do, and for whom?</label>
          <textarea id="business" name="business" rows={3} maxLength={1500} required className={field} placeholder="e.g. B2B payments software for SMEs in Ghana and Kenya" />
        </div>
        <div>
          <label htmlFor="stage" className="text-sm font-medium">Stage</label>
          <select id="stage" name="stage" className={field} defaultValue="Early revenue">
            {["Idea", "Building / pre-launch", "Early revenue", "Growing revenue", "Established business"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="traction" className="text-sm font-medium">Traction so far</label>
          <textarea id="traction" name="traction" rows={3} maxLength={1000} required className={field} placeholder="Customers, revenue, pilots, partnerships, waitlist" />
        </div>
        <div>
          <label htmlFor="goals" className="text-sm font-medium">Goals for the next 6 to 12 months</label>
          <textarea id="goals" name="goals" rows={3} maxLength={1000} required className={field} placeholder="e.g. 50 paying customers and a pre-seed raise" />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={status === "loading"} className="inline-flex min-h-12 items-center justify-center btn-shine rounded-full bg-primary px-6 font-semibold text-primary-foreground transition hover:bg-gold-light disabled:opacity-60">
            {status === "loading" ? "Building your plan…" : "Generate my action plan"}
          </button>
          {status === "loading" && (
            <button type="button" onClick={() => abortRef.current?.abort()} className="min-h-12 rounded-full border border-input px-5 text-sm">
              Stop
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Your answers are used only to generate this plan and are not saved. AI-generated guidance, not a guarantee of results.</p>
      </form>

      <div aria-live="polite" className="rounded-3xl border border-border bg-cream p-6 sm:p-8">
        {status === "idle" && !plan && (
          <p className="text-muted-foreground">Your personalised Seen, Sold and Funded plan will appear here.</p>
        )}
        {status === "loading" && !plan && <p className="animate-pulse text-muted-foreground">Reading your answers and drafting your plan…</p>}
        {plan && <Plan text={plan} />}
        {status === "error" && <p role="alert" className="mt-4 text-destructive">{error}</p>}
        {status === "done" && (
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">Want help putting this into action?</p>
            <BookCall location="action-plan" className="mt-3" />
          </div>
        )}
      </div>
    </div>
  );
}
