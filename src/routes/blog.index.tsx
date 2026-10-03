import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/blog.queries";
import { BlogCard } from "@/components/site/BlogCard";
import { BookCall } from "@/components/site/BookCall";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery()),
  errorComponent: () => <p className="mx-auto max-w-5xl px-6 py-28">The articles are temporarily unavailable. Please try again.</p>,
  notFoundComponent: () => <p>Page not found.</p>,
  head: () => ({ meta: [
    { title: "Blog | Faith M. Roberts — Go-to-market, Fundraising & African Startups" },
    { name: "description", content: "Practical perspectives on go-to-market strategy, investor readiness, fundraising and building across the African startup ecosystem." },
    { property: "og:title", content: "Blog | Faith M. Roberts" },
    { property: "og:description", content: "Ideas on go-to-market, fundraising and African startups from Faith M. Roberts." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://faithroberts.site/blog" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "https://faithroberts.site/blog" }] }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postsQuery());
  return <>
    <header className="border-b border-border bg-background"><nav aria-label="Blog navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 sm:px-8"><Link to="/" className="font-display text-lg font-bold">Faith M. <span className="text-gold">Roberts</span></Link><Link to="/" className="text-sm font-semibold text-blue">← Back to home</Link></nav></header>
    <main>
      <section className="border-b border-border bg-secondary py-20 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="text-sm font-bold uppercase text-gold">Perspectives</p><h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Ideas for founders building what comes next.</h1><p className="mt-6 max-w-2xl text-lg text-muted-foreground">On go-to-market, investor readiness, fundraising and the African startup ecosystem.</p></div></section>
      <section aria-label="Articles" className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{posts?.map(post => <BlogCard key={post.id} post={post} />)}</div>{!posts?.length && <div className="border-t border-border py-24 text-center"><h2 className="text-2xl font-bold">The first article is on its way.</h2><p className="mt-3 text-muted-foreground">More on building, growing and getting funded soon.</p></div>}</section>
    </main>
    <footer className="navy px-5 py-12 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><p className="font-display text-lg font-bold">Faith M. Roberts</p><p className="text-sm text-muted-foreground">Helping founders get seen, sold and funded.</p></div><BookCall location="blog" /></div></footer>
  </>;
}
