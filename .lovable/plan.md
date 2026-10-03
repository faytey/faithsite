# FaithRoberts.site blog and launch plan

## What will change

- Replace every public `faithroberts.xyz` reference with `https://faithroberts.site`, including canonical, Open Graph URL, structured data, robots, and sitemap.
- Reduce the portrait only on desktop/wide layouts so the headline remains dominant; keep the current mobile presentation.
- Add a homepage Blog preview section and link it from the navigation.
- Add a public `/blog` page and crawlable `/blog/:slug` article pages, styled consistently with the current white, gold, blue, and navy design.
- Add a private sign-in page and protected blog editor where you can create, edit, preview, save drafts, publish, unpublish, and delete articles.
- Use “Faith M. Roberts” as the fixed author; no separate profile data will be stored.
- Publish the updated site, then start the connection flow for `faithroberts.site` so Lovable can provide or verify the required DNS setup.

## Blog experience

- Article fields: title, slug, summary, category, body, cover image URL, SEO title, SEO description, publish status, and publish date.
- Public pages show only published articles; drafts stay visible only inside the editor.
- Article pages include unique title, description, canonical URL, Open Graph/Twitter tags, Article structured data, readable typography, share links, and a return-to-blog path.
- The homepage displays the latest published articles with a clear link to the full blog.
- Empty states will look intentional before the first article is published.

## Security and data

- Store articles in Lovable Cloud with row-level access rules.
- Allow anonymous visitors to read published articles only.
- Restrict draft access and all create/update/delete actions to the signed-in editor account.
- Use secure server-side identity checks for every private blog action; the public article list uses a narrow read-only path.
- Enable email/password sign-in for the private editor, including password recovery. Public visitor signup will not be presented.

## Technical details

- Add the protected route layout plus `/auth`, `/reset-password`, `/editor`, `/blog`, and `/blog/$slug` routes using the existing TanStack routing pattern.
- Add shared blog data functions and focused public/editor components, reusing the current design tokens and controls.
- Extend the sitemap to include the blog index; published article metadata and canonical URLs will be generated per article.
- Update the project roadmap and architecture notes for the new public/private blog boundary.

## Verification and release

- Verify homepage, blog list, article page, sign-in, draft/publish workflow, metadata, and desktop/mobile layouts in the browser.
- Confirm the preview build is clean and run a security scan before publishing.
- Request publication and report the expected Lovable URL plus the custom-domain connection status and any DNS action still required.
