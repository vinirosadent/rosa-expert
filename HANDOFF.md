# Handoff — rosa.expert · Adding a News Article

**Project:** Static website for A/P Vinicius Rosa, NUS Faculty of Dentistry  
**Local folder:** `C:\Users\vinir\Google Drive\Claude Projects\rosa-expert`  
**GitHub:** https://github.com/vinirosadent/rosa-expert  

---

## Context for the next session

This is a multi-page static HTML site. All pages are built. The news section is data-driven: every news article page is identical boilerplate (`news/_template.html`) that reads its content from the `ARTICLES[]` array in `assets/js/data/news.js`.

**Adding a new article requires exactly 3 steps:**

1. Add an entry to `ARTICLES[]` in `news.js`
2. Copy `news/_template.html` as `news/[slug].html` (no code changes to the copy)
3. Confirm the matching `NEWS[]` card entry in `news.js` already has that `slug`

---

## What the user will paste in the next chat

The user will provide the **raw content** for a news article (likely n2–n9). They'll paste the article text and/or key facts.

Your job is to:
1. Structure it into the `ARTICLES[]` data model (see below)
2. Add the entry to `news.js` in the right place
3. Copy `_template.html` as `news/[slug].html`
4. Verify there are no JS syntax errors (the file must pass `node --check assets/js/data/news.js`)

---

## ARTICLES[] data model — fill every field

```js
{
  id: 'nX',                          // match NEWS[].id (n2, n3, etc.)
  slug: 'slug-from-news-array',      // match NEWS[].slug exactly
  category: 'press',                 // press | awards | appointments | institutional
  tone: 'teal',                      // blue | orange | teal
  source: 'Source Name',
  date: 'Month YYYY',
  readTime: 'X min read',
  headline: `Full headline here`,    // USE BACKTICKS — avoid quote escaping issues
  deck: `One-sentence standfirst`,   // USE BACKTICKS
  heroVariant: 'teal-banner',        // image | teal-banner | orange-banner | video | stat
  heroImage: null,                   // URL only if heroVariant is 'image'
  heroCaption: 'Caption text.',
  heroPhotoCredit: 'Source: Name.',
  body: [                            // USE DOUBLE QUOTES — apostrophes are fine inside
    "First paragraph...",
    "Second paragraph...",
    "Third paragraph...",            // ← pull-quote auto-injected after this one
    "Fourth paragraph...",
    // add as many as needed
  ],
  pullQuote: 'A striking sentence from the article.',
  tags: [
    { label: 'Tag Label', tone: 'blue' },   // tone: blue | orange | teal
  ],
  externalUrl: 'https://...',        // optional — original article URL
  externalCTA: 'Read on Source ↗',
  relatedIds: ['n1', 'n3'],          // 2–3 NEWS ids for "More from the newsroom"
}
```

**Hero variant guide:**
- `image` — requires a real photo URL in `heroImage`
- `teal-banner` — solid teal block (good for press/research)
- `orange-banner` — solid orange block (good for awards)
- `video` — 16:9 embed
- `stat` — large number/statistic display

**Tone guide (drives colour accents):**
- `blue` — press coverage, general news
- `orange` — awards, recognition
- `teal` — appointments, science, institutional

---

## Critical quote escaping rules

Previous sessions had syntax errors here. Always:
- `headline` and `deck` → **backtick template literals** `` `...` `` (they contain apostrophes and quotation marks)
- `body[]` paragraphs → **double-quoted strings** `"..."` (apostrophes are safe inside double quotes)
- Smart/curly quotes like `"` `"` are Unicode — they're fine in any string type

After editing `news.js`, always verify:
```bash
node --check assets/js/data/news.js
```
(Run this in the bash sandbox at `/sessions/.../mnt/rosa-expert/`)

---

## Existing NEWS[] entries (n1–n9) for reference

```
n1  straits-times-ai-models        press       blue    ARTICLES entry: DONE ✓
n2  iadr-innovation-award-2026     awards      orange  ARTICLES entry: pending
n3  editorial-board-jcp-2026       appointments teal   ARTICLES entry: pending
n4  iso-tc194-mirror-group         appointments teal   ARTICLES entry: pending
n5  top2pct-scientists-2025        awards      blue    ARTICLES entry: pending
n6  cna-talking-point-toothpaste   press       teal    ARTICLES entry: pending
n7  adm-board-member-2024          appointments orange  ARTICLES entry: pending
n8  tooth-tissue-bank-2024         press       blue    ARTICLES entry: pending
n9  orchids-launch-2022            institutional teal   ARTICLES entry: pending
```

When adding ARTICLES entries, insert them in the `ARTICLES[]` array in `news.js`, **before** the comment line `// ── ADD NEW ARTICLES BELOW ──`.

---

## GitHub status (check if still pending)

If the repo has not been pushed yet, the user needs to run these commands in PowerShell:

```powershell
Remove-Item -Recurse -Force "C:\Users\vinir\Google Drive\Claude Projects\rosa-expert\.git"
cd "C:\Users\vinir\Google Drive\Claude Projects\rosa-expert"
git init
git remote add origin https://github.com/vinirosadent/rosa-expert.git
git add .
git commit -m "Initial commit: complete rosa.expert static site"
git branch -M main
git push -u origin main
```

**Important:** Git must be run from Windows PowerShell — never from the bash sandbox (the Google Drive FUSE mount doesn't support git file locking).

After push: Settings → Pages → Source: main branch → add custom domain `rosa.expert`

---

## Design system quick reference

**Fonts:** DM Sans (UI/body) · Source Serif 4 (headlines)  
**Colours:** NUS Blue `#003D7C` · Orange `#EF7C00` · Teal `#178C8C`  
**CSS:** `assets/css/tokens.css` + `assets/css/components.css`  
**Containers:** `--container-base: 1080px` · `--container-narrow: 760px`  

**Subdirectory paths:** pages inside `news/` or `publications/` use `../assets/` (not `assets/`).  
`shared.js` detects subdirectory automatically via `/\/(news|publications)\//`.
