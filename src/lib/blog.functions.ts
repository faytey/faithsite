import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const fields = "id,title,slug,excerpt,category,body,cover_image_url,seo_title,seo_description,published,published_at,created_at,updated_at";
function publicClient() {
  const url = process.env['SUPABASE_URL']!;
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
}

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient().from("blog_posts").select(fields).eq("published", true).order("published_at", { ascending: false }).limit(100);
  if (error) throw new Error("Articles could not be loaded.");
  return data;
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1).max(160) }).parse(data))
  .handler(async ({ data }) => {
    const { data: post, error } = await publicClient().from("blog_posts").select(fields).eq("slug", data.slug).eq("published", true).maybeSingle();
    if (error) throw new Error("Article could not be loaded.");
    return post;
  });

async function assertEditor(context: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Editor access has not been granted to this account.");
}

export const editorPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertEditor(context);
    const { data, error } = await context.supabase.from("blog_posts").select(fields).order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(180),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  excerpt: z.string().trim().min(20).max(500),
  category: z.enum(["Go-to-market", "Fundraising", "African startups"]),
  body: z.string().trim().min(30).max(100000),
  cover_image_url: z.union([z.string().url().startsWith("https://"), z.literal("")]),
  seo_title: z.string().trim().max(180),
  seo_description: z.string().trim().max(300),
  published: z.boolean(),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: z.infer<typeof postSchema>) => postSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    let publishedAt: string | null = null;
    if (data.id) {
      const { data: existing, error } = await context.supabase.from("blog_posts").select("published_at").eq("id", data.id).single();
      if (error || !existing) throw new Error("Article not found.");
      publishedAt = data.published ? (existing.published_at ?? new Date().toISOString()) : null;
    } else if (data.published) publishedAt = new Date().toISOString();
    const payload = {
      title: data.title, slug: data.slug, excerpt: data.excerpt, category: data.category,
      body: data.body, cover_image_url: data.cover_image_url || null,
      seo_title: data.seo_title || null, seo_description: data.seo_description || null,
      published: data.published, published_at: publishedAt, updated_at: new Date().toISOString(),
    };
    const query = data.id
      ? context.supabase.from("blog_posts").update(payload).eq("id", data.id)
      : context.supabase.from("blog_posts").insert(payload);
    const { data: saved, error } = await query.select("id").single();
    if (error || !saved) throw new Error(error?.code === "23505" ? "This article URL is already in use." : error?.message ?? "Could not save article.");
    return saved;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertEditor(context);
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
