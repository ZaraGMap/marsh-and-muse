# Marsh &amp; Muse — marshmuse.com

The one-page brand site for **Marsh &amp; Muse** and *The Art of Slow Living: A Guided Journal*.

A fully static site — plain HTML, CSS, and a little vanilla JavaScript. No build step, no
dependencies, no CDN. Self-hosted brand fonts and local images, so it works offline and on any
host.

## Structure

```
website/
├── index.html      # the whole page
├── styles.css      # all styles (brand tokens + sections)
├── .nojekyll       # tell GitHub Pages to serve files as-is
├── assets/         # images (journal cover, lifestyle photo, dandelion)
└── fonts/          # DM Serif Display + Montserrat (self-hosted .ttf)
```

## Deploy to GitHub Pages

**Option A — serve from the repository root**

1. Move the contents of this `website/` folder to the root of a new repo
   (so `index.html` sits at the top level).
2. Push to GitHub.
3. Repo → **Settings → Pages** → *Source: Deploy from a branch* →
   Branch: `main`, Folder: `/ (root)` → **Save**.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

**Option B — serve from `/docs`**

1. Rename this folder to `docs/` and push it.
2. Settings → Pages → Branch: `main`, Folder: `/docs` → **Save**.

**Custom domain (marshmuse.com)**

1. Settings → Pages → *Custom domain* → enter `marshmuse.com` → Save
   (this writes a `CNAME` file).
2. At your DNS provider, point the apex `A` records to GitHub Pages IPs and add a
   `www` `CNAME` to `<username>.github.io`.
3. Tick **Enforce HTTPS** once the certificate provisions.

## Notes

- `.nojekyll` is included so GitHub Pages does not run the files through Jekyll —
  important because nothing here needs processing.
- The **7 Day Reset** form is front-end only (validates and confirms in the browser).
  To capture real signups, point the `<form>` at your provider — e.g. set
  `action="https://assets.mailerlite.com/..."` and `method="post"` in `index.html`,
  and remove the `e.preventDefault()` submit handler at the bottom of the file.
- The two product CTAs (`Get the Journal`) link to `#` — swap in the Amazon URL.

## Brand rules honoured

Two fonts only · "Slow Living" always italic · no bold Montserrat ·
Cream-on-Moss and Forest-on-Linen text only · generous white space ·
hairline borders · faint warm shadows · slow fade-up reveals.
