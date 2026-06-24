/* ============================================================
   data/news.js — News items and full article data
   Live pages are STATIC HTML in news/<slug>.html with an in-page
   EN/ES/PT/FR/中文 language toggle. NEWS[] drives the summary cards
   on the home page and /news.html — every entry points to a real
   page. Order = newest first; NEWS[0] is the featured/lead story.
   ============================================================ */

const NEWS = [
  { id:'n1', slug:'straits-times-ai-models', source:'The Straits Times', date:'May 2026', tone:'blue',
    headline:"The Straits Times features A/P Rosa's AI-enabled living laboratory models", category:'press' },
  { id:'n2', slug:'iadr-innovation-award-2026', source:'IADR', date:'March 2026', tone:'orange',
    headline:"A/P Rosa receives the 2026 IADR Innovation in Oral Care Award", category:'awards' },
  { id:'n3', slug:'iso-tc194-mirror-group', source:'ISO / TC 194', date:'2026', tone:'teal',
    headline:"A/P Rosa appointed to Singapore's National Mirror Working Group for ISO/TC 194", category:'appointments' },
  { id:'n4', slug:'top2pct-scientists-2026', source:'Stanford–Elsevier', date:'2026', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2026)", category:'awards' },
  { id:'n5', slug:'top2pct-scientists-2025', source:'Stanford–Elsevier', date:'September 2025', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2025)", category:'awards' },
  { id:'n6', slug:'adm-meet-the-fellows-2025', source:'Academy of Dental Materials', date:'March 2025', tone:'teal',
    headline:"A/P Rosa joins the inaugural Meet the Fellows session of the Academy of Dental Materials", category:'institutional' },
  { id:'n7', slug:'adm-board-member-2024', source:'Academy of Dental Materials', date:'October 2024', tone:'teal',
    headline:"A/P Rosa appointed to the Board of Directors of the Academy of Dental Materials", category:'appointments' },
  { id:'n8', slug:'straits-times-tooth-bank-2024', source:'The Straits Times', date:'July 2024', tone:'blue',
    headline:"The Straits Times: how Singapore's first Tooth Tissue Bank is advancing dental research", category:'press' },
  { id:'n9', slug:'top2pct-scientists-2024', source:'Stanford–Elsevier', date:'2024', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2024)", category:'awards' },
  { id:'n10', slug:'top2pct-scientists-2023', source:'Stanford–Elsevier', date:'October 2023', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2023)", category:'awards' },
  { id:'n11', slug:'top2pct-scientists-2022', source:'Stanford–Elsevier', date:'October 2022', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2022)", category:'awards' },
  { id:'n12', slug:'top2pct-scientists-2021', source:'Stanford–Elsevier', date:'July 2021', tone:'orange',
    headline:"A/P Rosa ranked among the world's top 2% most-cited scientists (2021)", category:'awards' },
  { id:'n13', slug:'dental-dart-aerosol-2020', source:'NUS Dentistry', date:'December 2020', tone:'teal',
    headline:"Dental DART: a protective tent for safer dentistry during the pandemic", category:'institutional' },
  { id:'n14', slug:'jdr-editorial-board-2018', source:'Journal of Dental Research', date:'2018', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of the Journal of Dental Research", category:'appointments' },
  { id:'n15', slug:'emergent-materials-associate-editor-2019', source:'Emergent Materials', date:'2019', tone:'teal',
    headline:"A/P Rosa appointed Associate Editor of Emergent Materials", category:'appointments' },
  { id:'n16', slug:'joe-scientific-advisory-board-2019', source:'Journal of Endodontics', date:'2019', tone:'teal',
    headline:"A/P Rosa joins the Scientific Advisory Board of the Journal of Endodontics", category:'appointments' },
  { id:'n17', slug:'dental-materials-editorial-board-2020', source:'Dental Materials', date:'2020', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of Dental Materials", category:'appointments' },
  { id:'n18', slug:'jada-fs-editorial-board-2020', source:'JADA Foundational Science', date:'2020', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of JADA Foundational Science", category:'appointments' },
  { id:'n19', slug:'journal-prosthodontics-associate-editor-2020', source:'Journal of Prosthodontics', date:'2020', tone:'teal',
    headline:"A/P Rosa appointed Associate Editor of the Journal of Prosthodontics", category:'appointments' },
  { id:'n20', slug:'ejos-editorial-board-2024', source:'European Journal of Oral Sciences', date:'2024', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of the European Journal of Oral Sciences", category:'appointments' },
  { id:'n21', slug:'discover-nano-editorial-board-2024', source:'Discover Nano', date:'2024', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of Discover Nano", category:'appointments' },
  { id:'n22', slug:'jcp-editorial-board-2026', source:'Journal of Clinical Periodontology', date:'2026', tone:'teal',
    headline:"A/P Rosa joins the Editorial Board of the Journal of Clinical Periodontology", category:'appointments' },
];

/* Static pages do not read from this array. */
const ARTICLES = [];
