/* ============================================================
   data/news.js — News items and full article data
   Add new articles to ARTICLES[]. Add cards to NEWS[].
   The NEWS id must match the ARTICLES id for linking to work.

   Current live pages are STATIC HTML in news/<slug>.html
   (content written directly in each file). NEWS[] below only
   drives the summary cards on the home page and /news.html, so
   every entry here must point to a real page that exists.
   ============================================================ */

/* ── News card items (summary cards across the site) ─────── */
/* The first item is the lead/featured story (home stack + news.html lead). */
const NEWS = [
  {
    id: 'n1',
    slug: 'straits-times-ai-models',
    source: 'The Straits Times',
    date: 'May 2026',
    tone: 'blue',         // blue | orange | teal
    headline: "The Straits Times features A/P Rosa's AI-enabled living laboratory models",
    category: 'press',    // press | awards | appointments | institutional
  },
  {
    id: 'n2',
    slug: 'iadr-innovation-award-2026',
    source: 'IADR',
    date: 'March 2026',
    tone: 'orange',
    headline: "A/P Rosa receives the 2026 IADR Innovation in Oral Care Award",
    category: 'awards',
    image: 'https://static.wixstatic.com/media/d8b7b0_0657c0ddf7f64489b6de910ea54c54fe~mv2.jpg/v1/fill/w_640,h_640,al_c,lg_1,q_85,enc_auto/rosa_new_edited_edited.jpg',
  },
  {
    id: 'n3',
    slug: 'iso-tc194-mirror-group',
    source: 'ISO / TC 194',
    date: '2026',
    tone: 'teal',
    headline: "A/P Rosa appointed to Singapore's National Mirror Working Group for ISO/TC 194",
    category: 'appointments',
  },
];

/* ── Full article data (one object per data-driven article page) ──
   The three current pages are static HTML and do NOT read from this
   array. Only add an object here when you build a data-driven page
   from a news template that renders itself from the slug. */
const ARTICLES = [];
