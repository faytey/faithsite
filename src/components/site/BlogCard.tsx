import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];
export function BlogCard({ post }: { post: Post }) {
  return <article className="group flex flex-col overflow-hidden border border-border bg-card shadow-card transition-shadow hover:shadow-lg">
    {post.cover_image_url && <Link to="/blog/$slug" params={{ slug: post.slug }} aria-label={`Read ${post.title}`}><img src={post.cover_image_url} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" /></Link>}
    <div className="flex flex-1 flex-col p-7">
      <p className="text-xs font-semibold uppercase text-gold">{post.category} <span aria-hidden="true">·</span> {post.published_at ? new Date(post.published_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : ""}</p>
      <h3 className="mt-4 text-xl font-bold leading-snug sm:text-2xl"><Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-blue">{post.title}</Link></h3>
      <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="mt-7 inline-flex items-center gap-2 font-semibold text-blue">Read article <ArrowUpRight size={17} aria-hidden="true" /></Link>
    </div>
  </article>;
}
