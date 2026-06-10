/* =====================================================================
   THE LONG FIELD — Marsh & Muse blog
   blog.js · the small engine that turns your Markdown posts into pages
   --------------------------------------------------------------------
   Content team: you should not need to touch this file either.
   It reads posts/manifest.json, loads each Markdown post, and renders
   the index and the individual article pages.
   ===================================================================== */

const LF = (() => {

  /* ---- read & parse a single .md file -------------------------------- */
  // Splits the "front matter" (the bit between the --- lines at the top)
  // from the article body, and parses each.
  function parsePost(raw, slug) {
    let meta = {}, body = raw;
    const m = raw.match(/^\uFEFF?---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (m) {
      meta = parseFrontMatter(m[1]);
      body = m[2];
    }
    meta.slug = slug;
    meta.bodyHtml = markdownToHtml(body.trim());
    return meta;
  }

  function parseFrontMatter(block) {
    const out = {};
    block.split('\n').forEach(line => {
      const i = line.indexOf(':');
      if (i === -1) return;
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      // strip optional surrounding quotes
      val = val.replace(/^["']|["']$/g, '');
      if (key) out[key] = val;
    });
    return out;
  }

  /* ---- a small, safe Markdown -> HTML converter ---------------------- */
  // Supports: ## h2, ### h3, > quotes, - / 1. lists, --- rules,
  // **bold**, *italic*, [links](url), and paragraphs.
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(text) {
    // escape first, then add the inline formatting
    let t = escapeHtml(text);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/—/g, '&mdash;');
    return t;
  }

  function markdownToHtml(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let i = 0;
    while (i < lines.length) {
      let line = lines[i];

      if (!line.trim()) { i++; continue; }

      // horizontal rule
      if (/^---+\s*$/.test(line)) { html.push('<hr>'); i++; continue; }

      // headings
      if (/^###\s+/.test(line)) { html.push('<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>'); i++; continue; }
      if (/^##\s+/.test(line))  { html.push('<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>'); i++; continue; }
      if (/^#\s+/.test(line))   { html.push('<h2>' + inline(line.replace(/^#\s+/, '')) + '</h2>'); i++; continue; }

      // blockquote (gather consecutive > lines)
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        html.push('<blockquote><p>' + inline(buf.join(' ')) + '</p></blockquote>');
        continue;
      }

      // unordered list
      if (/^[-*]\s+/.test(line)) {
        const buf = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          buf.push('<li>' + inline(lines[i].replace(/^[-*]\s+/, '')) + '</li>');
          i++;
        }
        html.push('<ul>' + buf.join('') + '</ul>');
        continue;
      }

      // ordered list
      if (/^\d+\.\s+/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          buf.push('<li>' + inline(lines[i].replace(/^\d+\.\s+/, '')) + '</li>');
          i++;
        }
        html.push('<ol>' + buf.join('') + '</ol>');
        continue;
      }

      // paragraph (gather until blank line)
      const buf = [];
      while (i < lines.length && lines[i].trim() &&
             !/^(#{1,3}\s|>\s?|[-*]\s+|\d+\.\s+|---+\s*$)/.test(lines[i])) {
        buf.push(lines[i].trim());
        i++;
      }
      html.push('<p>' + inline(buf.join(' ')) + '</p>');
    }
    return html.join('\n');
  }

  /* ---- dates --------------------------------------------------------- */
  function prettyDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  /* ---- loading ------------------------------------------------------- */
  async function loadManifest() {
    const res = await fetch('posts/manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('manifest');
    const data = await res.json();
    // accept either ["slug", ...] or { posts:[...] }
    const list = Array.isArray(data) ? data : (data.posts || []);
    return list.map(x => typeof x === 'string' ? x : x.slug).filter(Boolean);
  }

  async function loadPost(slug) {
    const res = await fetch('posts/' + slug + '.md', { cache: 'no-store' });
    if (!res.ok) throw new Error('post ' + slug);
    const raw = await res.text();
    return parsePost(raw, slug);
  }

  async function loadAll() {
    const slugs = await loadManifest();
    const posts = [];
    for (const slug of slugs) {
      try { posts.push(await loadPost(slug)); }
      catch (e) { console.warn('Could not load post:', slug, e); }
    }
    return posts;
  }

  return { parsePost, markdownToHtml, prettyDate, loadManifest, loadPost, loadAll, escapeHtml };
})();
