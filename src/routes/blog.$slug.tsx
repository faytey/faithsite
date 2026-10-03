import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postQuery } from "@/lib/blog.queries";
import { BookCall } from "@/components/site/BookCall";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found | Faith M. Roberts" }, { name: "robots", content: "noindex" }] };
    const post = loaderData;
    const title = post.seo_title || `${post.title} | Faith M. Roberts`;
    const desc = post.seo_description || post.excerpt;
    const url = `https://faithroberts.site/blog/${post.slug}`;
    return { meta: [
      { title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc },
      { property: "og:type", content: "article" }, { property: "og:url", content: url }, { name: "twitter:card", content: "summary_large_image" },
      ...(post.cover_image_url ? [{ property: "og:image", content: post.cover_image_url }, { name: "twitter:image", content: post.cover_image_url }] : []),
    ], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: desc, author: { "@type": "Person", name: "Faith M. Roberts" }, datePublished: post.published_at, dateModified: post.updated_at, mainEntityOfPage: url, ...(post.cover_image_url ? { image: post.cover_image_url } : {}) }) }] };
  },
  errorComponent: () => <p className="mx-auto max-w-3xl px-6 py-28">This article could not be loaded. Please try again.</p>,
  notFoundComponent: () => <main className="mx-auto max-w-3xl px-6 py-28"><h1 className="text-3xl font-bold">Article not found</h1><Link to="/blog" className="mt-5 inline-block text-blue">Return to the blog →</Link></main>,
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;
  return <>
    <header className="border-b border-border"><nav aria-label="Article navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8"><Link to="/" className="font-display text-lg font-bold">Faith M. <span className="text-gold">Roberts</span></Link><Link to="/blog" className="text-sm font-semibold text-blue">← All articles</Link></nav></header>
    <main><article>
      <header className="mx-auto max-w-3xl px-5 pb-12 pt-16 sm:px-8 sm:pt-24"><p className="text-sm font-bold uppercase text-gold">{post.category} <span aria-hidden="true">·</span> {post.published_at && new Date(post.published_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</p><h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1><p className="mt-7 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p><p className="mt-8 text-sm font-semibold">By Faith M. Roberts</p></header>
      {post.cover_image_url && <div className="mx-auto max-w-5xl px-5 sm:px-8"><img src={post.cover_image_url} alt="" className="aspect-[16/9] w-full object-cover" /></div>}
      <div className="blog-prose mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown></div>
    </article><div className="border-t border-border bg-secondary"><div className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-5 py-12 sm:px-8"><h2 className="text-2xl font-bold">Ready to move your business forward?</h2><BookCall location="article" /><Link to="/blog" className="font-semibold text-blue">← More articles</Link></div></div></main>
  </>;
}
