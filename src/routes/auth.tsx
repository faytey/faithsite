import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Editor sign in | Faith M. Roberts" },
      { name: "description", content: "Private sign in for the Faith M. Roberts blog editor." },
      { property: "og:title", content: "Editor sign in | Faith M. Roberts" },
      { property: "og:description", content: "Private sign in for the blog editor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const field = "mt-2 block w-full rounded-xl border border-input bg-card px-4 py-3 field-ring";

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setBusy(true); setMsg("");
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/editor" });
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/editor` } });
        if (error) throw error;
        setMsg("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setMsg("If that account exists, a reset link is on its way.");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-border bg-card p-8 card-depth">
        <Link to="/" className="font-display text-lg font-bold">Faith M. <span className="text-gold">Roberts</span></Link>
        <h1 className="text-2xl font-bold">{mode === "in" ? "Editor sign in" : mode === "up" ? "Create editor account" : "Reset password"}</h1>
        <div><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" name="email" type="email" required autoComplete="email" className={field} /></div>
        {mode !== "forgot" && <div><label htmlFor="password" className="text-sm font-medium">Password</label><input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} className={field} /></div>}
        <button disabled={busy} className="btn-shine min-h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}</button>
        <p role="status" aria-live="polite" className="min-h-5 text-sm">{msg}</p>
        <div className="flex flex-wrap justify-between gap-3 text-sm text-blue">
          {mode !== "in" && <button type="button" onClick={() => setMode("in")}>Back to sign in</button>}
          {mode === "in" && <button type="button" onClick={() => setMode("forgot")}>Forgot password?</button>}
          {mode === "in" && <button type="button" onClick={() => setMode("up")}>First time? Create account</button>}
        </div>
      </form>
    </main>
  );
}
