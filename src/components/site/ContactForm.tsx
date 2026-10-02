import { useEffect, useRef, useState } from "react";
import { submitContact, TOPICS } from "@/lib/site.functions";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"fullName" | "email" | "message", string>>;

const field =
  "mt-2 block w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground field-ring";

export function ContactForm({ presetTopic }: { presetTopic?: string | undefined }) {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (presetTopic) setTopic(presetTopic);
  }, [presetTopic]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("contact_form_start", "contact");
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = Object.fromEntries(fd) as Record<string, string>;
    const errs: Errors = {};
    if (!v.fullName?.trim()) errs.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email?.trim() ?? "")) errs.email = "Please enter a valid email address.";
    if ((v.message?.trim().length ?? 0) < 20) errs.message = "Please write at least 20 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      (e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await submitContact({
        data: {
          fullName: v.fullName,
          email: v.email,
          company: v.company ?? "",
          topic: topic as (typeof TOPICS)[number],
          message: v.message,
          website: v.website ?? "",
        },
      });
      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setServerMsg(res.error);
      }
    } catch {
      setStatus("error");
      setServerMsg("Your message couldn't be sent. Please try again or book a call.");
    }
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-sm text-destructive">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onStart} className="space-y-5 rounded-3xl border border-border bg-card p-6 card-depth sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium">Full name <span aria-hidden="true" className="text-gold">*</span></label>
          <input id="fullName" name="fullName" autoComplete="name" required aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} className={field} />
          {err("fullName")}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email address <span aria-hidden="true" className="text-gold">*</span></label>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={field} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium">Company or project name <span className="text-muted-foreground">(optional)</span></label>
        <input id="company" name="company" autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="topic" className="text-sm font-medium">What do you need help with?</label>
        <select id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">Tell me what you're building and where you're stuck. <span aria-hidden="true" className="text-gold">*</span></label>
        <textarea id="message" name="message" rows={5} required minLength={20} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={field} />
        {err("message")}
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 w-full items-center justify-center btn-shine rounded-full bg-primary px-6 font-semibold text-primary-foreground transition hover:bg-gold-light disabled:opacity-60 sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <div aria-live="polite" role="status" className="min-h-6 text-sm">
        {status === "success" && <p className="flex items-center gap-2 text-success"><svg className="check-pop h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="var(--primary)" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="var(--navy)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>Thank you. I'll reply within 2 working days.</p>}
        {status === "error" && <p className="text-destructive">{serverMsg}</p>}
      </div>
      <p className="text-xs text-muted-foreground">Your details are used only to reply to your message.</p>
    </form>
  );
}
