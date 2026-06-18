/* ============================================================
   data/news.js — News items and full article data
   Add new articles to ARTICLES[]. Add cards to NEWS[].
   The NEWS id must match the ARTICLES id for linking to work.
   ============================================================ */

/* ── News card items (summary cards across the site) ─────── */
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
  },
  {
    id: 'n3',
    slug: 'editorial-board-jcp-2026',
    source: 'Journal of Clinical Periodontology',
    date: '2026',
    tone: 'teal',
    headline: "A/P Rosa joins the Editorial Board of the Journal of Clinical Periodontology",
    category: 'appointments',
  },
  {
    id: 'n4',
    slug: 'iso-tc194-mirror-group',
    source: 'ISO / TC 194',
    date: '2026',
    tone: 'teal',
    headline: "A/P Rosa appointed to Singapore's National Mirror Working Group for ISO/TC 194",
    category: 'appointments',
  },
  {
    id: 'n5',
    slug: 'top2pct-scientists-2025',
    source: 'Ranking',
    date: 'September 2025',
    tone: 'blue',
    headline: "A/P Rosa recognised again among the world's top 2% most-cited scientists",
    category: 'awards',
  },
  {
    id: 'n6',
    slug: 'cna-talking-point-toothpaste',
    source: 'Channel NewsAsia',
    date: '2025',
    tone: 'teal',
    headline: "A/P Rosa explains the science behind toothpaste on CNA Talking Point",
    category: 'press',
  },
  {
    id: 'n7',
    slug: 'adm-board-member-2024',
    source: 'Academy of Dental Materials',
    date: '2024',
    tone: 'orange',
    headline: "A/P Rosa appointed Board Member of the Academy of Dental Materials",
    category: 'appointments',
  },
  {
    id: 'n8',
    slug: 'tooth-tissue-bank-2024',
    source: 'The Straits Times',
    date: 'July 2024',
    tone: 'blue',
    headline: "Singapore's first Tooth Tissue Bank advances dental research",
    category: 'press',
  },
  {
    id: 'n9',
    slug: 'orchids-launch-2022',
    source: 'ORCHIDS',
    date: '2022',
    tone: 'teal',
    headline: "ORCHIDS launches to accelerate oral-health innovation",
    category: 'institutional',
  },
];

/* ── Full article data (one object per article page) ─────── */
// Add a new object here when you create a new news/slug.html page.
// Fields:
//   id          — must match NEWS[].id
//   slug        — must match NEWS[].slug and the filename (news/slug.html)
//   category    — press | awards | appointments | institutional
//   tone        — blue | orange | teal  (drives colour accents)
//   source      — publication / organisation name
//   date        — display date string
//   readTime    — e.g. "5 min read"
//   headline    — full article headline (can differ slightly from card)
//   deck        — italic subheading / standfirst
//   heroVariant — 'image' | 'teal-banner' | 'orange-banner' | 'video' | 'stat'
//   heroImage   — URL string (only for heroVariant:'image')
//   heroCaption — caption text shown under the hero
//   heroPhotoCredit — source credit appended to caption
//   body        — array of paragraph strings
//   pullQuote   — string shown as large pull-quote mid-article (optional)
//   tags        — array of { label, tone } objects
//   externalUrl — link to original article (optional)
//   externalCTA — text for the external link button
//   relatedIds  — array of NEWS ids to show in "More from the newsroom"

const ARTICLES = [
  {
    id: 'n1',
    slug: 'straits-times-ai-models',
    category: 'press',
    tone: 'blue',
    source: 'The Straits Times',
    date: 'May 2026',
    readTime: '5 min read',
    headline: `A/P Rosa's AI-enabled "living" laboratory models featured by The Straits Times`,
    deck: `Research developed at NUS Dentistry was highlighted by Singapore's national newspaper for its potential to make biomedical testing safer, faster, and more predictive.`,
    heroVariant: 'teal-banner',
    heroImage: null,
    heroCaption: 'Associate Professor Vinicius Rosa at the National University Centre for Oral Health Singapore.',
    heroPhotoCredit: 'Source: The Straits Times.',
    body: [
      "Associate Professor Vinicius Rosa's research on AI-enabled “living” laboratory models was featured in The Straits Times in May 2026, highlighting work developed by his team at the National University of Singapore Faculty of Dentistry.",
      "The article, titled “‘Living’ lab models by NUS Dentistry team could make developing medical treatments safer, faster”, presents the team's efforts to create advanced hydrogel-based systems that better replicate the behaviour of human tissues during biomedical testing.",
      "Traditional laboratory models rely on static cell culture systems that do not fully capture the complex, changing conditions found inside the human body. A/P Rosa's approach addresses this by developing dynamic biomaterial platforms that can evolve over time — allowing researchers to study how cells respond to changing biological environments such as inflammation, acidity, tissue degradation, and repair.",
      "A key aspect of the research is the integration of artificial intelligence with biomaterials design. Instead of relying on trial-and-error experimentation, the team uses AI models trained on real experimental data to guide the composition and properties of hydrogel systems. This allows biomaterials to be designed around predicted cell behaviour and specific biological conditions.",
      "Although the work was initially developed using dental pulp models, its potential extends well beyond dentistry. The same approach could be adapted to study other tissues — including gum, cartilage, bone, and disease-related environments such as cancer models.",
      "The Straits Times feature followed A/P Rosa's recognition with the 2026 IADR Innovation in Oral Care Award, which supports high-impact technologies, biomaterials, compounds, and devices with the potential to improve oral health at population level.",
      "Together, the national media coverage and international award reflect growing recognition of A/P Rosa's work at the interface of biomaterials science, artificial intelligence, and translational biomedical research.",
    ],
    pullQuote: 'We are not petri dishes.',
    tags: [
      { label: 'Media Feature',        tone: 'blue' },
      { label: 'Artificial Intelligence', tone: 'blue' },
      { label: 'Biomaterials',         tone: 'teal' },
      { label: 'Hydrogels',            tone: 'teal' },
      { label: 'NUS Dentistry',        tone: 'blue' },
    ],
    externalUrl: 'https://www.straitstimes.com/singapore/health/living-lab-models-by-nus-dentistry-researchers-could-make-developing-medical-treatments-safer-faster',
    externalCTA: 'Read the full feature on The Straits Times ↗',
    relatedIds: ['n2', 'n3', 'n4'],
  },
  // ── ADD NEW ARTICLES BELOW ──
  // {
  //   id: 'n2',
  //   slug: 'iadr-innovation-award-2026',
  //   category: 'awards',
  //   tone: 'orange',
  //   ...
 
  // },
];
