<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Blog articles live in `public.blog_posts`; anonymous readers see only published rows and the editor requires a server-verified admin role, because draft privacy and write access must not depend on browser state.
- The public blog uses server-function reads with the publishable client, while the protected editor uses authenticated RLS reads and writes, because public SSR must not use privileged credentials.
- Article bodies are Markdown rendered without raw HTML, because authoring should remain lightweight and safe.
