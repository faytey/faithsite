import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { deletePost, editorPosts, savePost } from "@/lib/blog.functions";

export const Route = createFileRoute("/_authenticated/editor")({
  head: () => ({
    meta: [
      { title: "Blog editor | Faith M. Roberts" },
      { name: "description", content: "Private editor for writing and publishing articles." },
      { property: "og:title", content: "Blog editor | Faith M. Roberts" },
      { property: "og:description", content: "Private blog editor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Editor,
});

const CATS = ["Go-to-market", "Fundraising", "African startups"] as const;
type Draft = { id?: string; title: string; slug: string; excerpt: string; category: (typeof CATS)[number]; body: string; cover_image_url: string; seo_title: string; seo_description: string; published: boolean };
const empty: Draft = { title: "", slug: "", excerpt: "", category: "Go-to-market", body: "", cover_image_url: "", seo_title: "", seo_description: "", published: false };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 160);
const field = "mt-1 block w-full rounded-xl border border-input bg-card px-4 py-2.5 field-ring";

function Editor() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const list = useServerFn(editorPosts);
  const save = useServerFn(savePost);
  const del = useServerFn(deletePost);
  const posts = useQuery({ queryKey: ["blog", "editor"], queryFn: () => list(), retry: false });
  const [d, setD] = useState<Draft>(empty);
  const [preview, setPreview] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  async function submit(published: boolean) {
    setBusy(true); setMsg("");
    try {
      const r = await save({ data: { ...d, published, slug: d.slug || slugify(d.title) } });
      setD((p) => ({ ...p, id: r.id, published }));
      setMsg(published ? "Published." : "Saved as draft.");
      qc.invalidateQueries({ queryKey: ["blog"] });
    } catch (e) { setMsg(e instanceof Error ? e.message : "Could not save. Check all fields."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!d.id || !confirm("Delete this article permanently?")) return;
    await del({ data: { id: d.id } });
    setD(empty); setMsg("Deleted.");
    qc.invalidateQueries({ queryKey: ["blog"] });
  }

  if (posts.error) return <main className="mx-auto max-w-xl px-6 py-24"><h1 className="text-2xl font-bold">No editor access</h1><p className="mt-3 text-muted-foreground">{posts.error.message}</p><button className="mt-6 text-blue" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}>Sign out</button></main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="flex items-center justify-between"><Link to="/" className="font-display font-bold">Faith M. <span className="text-gold">Roberts</span></Link><button className="text-sm text-blue" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}>Sign out</button></div>
        <button onClick={() => { setD(empty); setMsg(""); }} className="mt-6 min-h-11 w-full rounded-full bg-primary font-semibold text-primary-foreground">+ New article</button>
        <ul className="mt-6 space-y-2">
          {posts.isLoading && <li className="text-sm text-muted-foreground">Loading…</li>}
          {posts.data?.length === 0 && <li className="text-sm text-muted-foreground">No articles yet.</li>}
          {posts.data?.map((p) => (
            <li key={p.id}><button onClick={() => { setD({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category as Draft["category"], body: p.body, cover_image_url: p.cover_image_url ?? "", seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "", published: p.published }); setMsg(""); }} className={`w-full rounded-xl border p-3 text-left text-sm ${d.id === p.id ? "border-primary bg-cream" : "border-border bg-card"}`}>
              <span className="block font-semibold">{p.title}</span>
              <span className={`text-xs ${p.published ? "text-success" : "text-muted-foreground"}`}>{p.published ? "Published" : "Draft"}</span>
            </button></li>
          ))}
        </ul>
      </aside>
      <section className="rounded-3xl border border-border bg-card p-6 card-depth sm:p-8">
        <div className="flex items-center justify-between gap-4"><h1 className="text-2xl font-bold">{d.id ? "Edit article" : "New article"}</h1><button onClick={() => setPreview((v) => !v)} className="text-sm font-semibold text-blue">{preview ? "Back to editing" : "Preview"}</button></div>
        {preview ? (
          <article className="mt-6"><p className="text-sm font-bold uppercase text-gold">{d.category}</p><h2 className="mt-3 text-4xl font-bold">{d.title || "Untitled"}</h2><p className="mt-4 text-lg text-muted-foreground">{d.excerpt}</p><div className="blog-prose mt-8"><ReactMarkdown remarkPlugins={[remarkGfm]}>{d.body}</ReactMarkdown></div></article>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium sm:col-span-2">Title<input value={d.title} onChange={(e) => { set("title", e.target.value); if (!d.id) set("slug", slugify(e.target.value)); }} className={field} /></label>
            <label className="text-sm font-medium">URL slug<input value={d.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={field} /></label>
            <label className="text-sm font-medium">Category<select value={d.category} onChange={(e) => set("category", e.target.value as Draft["category"])} className={field}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="text-sm font-medium sm:col-span-2">Summary (20–500 characters)<textarea rows={2} value={d.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={field} /></label>
            <label className="text-sm font-medium sm:col-span-2">Body (Markdown: ## heading, **bold**, - list)<textarea rows={16} value={d.body} onChange={(e) => set("body", e.target.value)} className={`${field} font-mono text-sm`} /></label>
            <label className="text-sm font-medium sm:col-span-2">Cover image URL (optional, https)<input value={d.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} className={field} /></label>
            <label className="text-sm font-medium">SEO title (optional)<input value={d.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={field} /></label>
            <label className="text-sm font-medium">SEO description (optional)<input value={d.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={field} /></label>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button disabled={busy} onClick={() => submit(false)} className="min-h-11 rounded-full border border-foreground px-6 font-semibold disabled:opacity-60">{d.published ? "Unpublish" : "Save draft"}</button>
          <button disabled={busy} onClick={() => submit(true)} className="btn-shine min-h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-60">{d.published ? "Update" : "Publish"}</button>
          {d.id && d.published && <Link to="/blog/$slug" params={{ slug: d.slug }} className="text-sm text-blue">View live →</Link>}
          {d.id && <button onClick={remove} className="ml-auto text-sm text-destructive">Delete</button>}
        </div>
        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm">{msg}</p>
      </section>
    </main>
  );
}
