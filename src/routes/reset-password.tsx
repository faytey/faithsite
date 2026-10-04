import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Faith M. Roberts" },
      { name: "description", content: "Choose a new password for the blog editor." },
      { property: "og:title", content: "Set a new password | Faith M. Roberts" },
      { property: "og:description", content: "Choose a new password for the blog editor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    nav({ to: "/editor" });
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-border bg-card p-8 card-depth">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <label htmlFor="password" className="text-sm font-medium">New password</label>
        <input id="password" name="password" type="password" minLength={8} required autoComplete="new-password" className="block w-full rounded-xl border border-input bg-card px-4 py-3 field-ring" />
        <button className="min-h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground">Save password</button>
        <p role="status" aria-live="polite" className="text-sm text-destructive">{msg}</p>
      </form>
    </main>
  );
}
