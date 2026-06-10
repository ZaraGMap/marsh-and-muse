# The Long Field — Marsh & Muse blog

A small, self-contained blog for GitHub Pages. No build step, no framework.
Posts are plain Markdown files; the pages render them in the browser.

## Drop-in

Copy this whole `blog/` folder into the website repository. Point the site's
"The Blog" navigation link at `blog/` (it serves `blog/index.html`).

## Structure

```
blog/
  index.html              The Long Field — blog index (lead + grid + Sunday note)
  post.html               Single-article template (reads ?p=<slug>)
  how-to-add-a-post.html  Plain-language guide for the content team — START HERE
  brand.css               Shared Marsh & Muse styling (don't edit)
  blog.js                 Markdown + front-matter engine (don't edit)
  assets/                 Dandelion marks + any post hero images
  posts/
    manifest.json         Ordered list of published posts (newest first)
    _TEMPLATE.md          Copy this to start a new post
    *.md                  One file per post
```

## Publishing a post (the short version)

1. Copy `posts/_TEMPLATE.md` to `posts/your-post-slug.md`.
2. Fill in the front-matter block and write the body in Markdown.
3. Add `"your-post-slug"` to the **top** of the list in `posts/manifest.json`.
4. Commit. GitHub Pages publishes it within a minute.

Full instructions, with pictures of each field, live in **how-to-add-a-post.html**.

## Notes

- Fonts load from Google Fonts (DM Serif Display + Montserrat).
- The pages use `fetch` to read the Markdown, so they must be served over
  http(s) — i.e. the live GitHub Pages site, or a local server. Double-clicking
  the files locally will not load posts (browser security). This is expected.
- New post promised every Sunday; until the next one lands, the index shows
  "Coming Sunday" placeholder cards so it never looks empty.
