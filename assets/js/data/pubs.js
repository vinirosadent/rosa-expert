/* ============================================================
   data/pubs.js — Publications data
   category: 'bio' | 'regen' | 'ai'
   featured: true  →  shown in "Selected breakthroughs" cards
   doi: string     →  enables direct DOI link (optional)
   ============================================================ */

const PUBS = [
  /* ── FEATURED (breakthrough cards, max 8 shown) ─────────── */
  {
    title: 'pH prediction in commercial and experimental calcium silicate cements via material informatics',
    venue: 'Dental Materials', year: 2025,
    featured: true, category: 'ai', badge: 'Material informatics',
    doi: '10.1016/j.dental.2025.08.018',
    spotlight: 'publications/ph-prediction-calcium-silicate.html',
    thumb: 'assets/spotlights/ph-prediction-calcium-silicate/card.png',
    summary: 'A machine-learning study showing how early experimental measurements can predict long-term properties of calcium silicate cements, supporting faster and more rational biomaterial development.',
  },
  {
    title: 'Designing C3S cements with on-demand properties for precision endodontics',
    venue: 'Journal of Dental Research', year: 2023,
    featured: true, category: 'ai', badge: 'On-demand biomaterials',
    doi: '10.1177/00220345231198185',
    spotlight: 'publications/designing-c3s-cements-on-demand.html',
    thumb: 'assets/spotlights/designing-c3s-cements-on-demand/card.png',
    summary: 'A genetic-algorithm study demonstrating that endodontic cements can be computationally designed with tailor-made handling, chemical, mechanical and bioactive properties.',
  },
  {
    title: 'Guidance for evaluating biomaterials\' properties and biological potential for dental pulp tissue engineering and regeneration research',
    venue: 'Dental Materials', year: 2025,
    featured: true, category: 'ai', badge: 'Field guidance',
    summary: 'A field-shaping guidance paper defining how biomaterials for dental pulp regeneration should be evaluated, linking material properties to biological and translational performance.',
  },
  {
    title: 'Guidance on the assessment of biocompatibility of biomaterials: Fundamentals and testing considerations',
    venue: 'Dental Materials', year: 2024,
    featured: true, category: 'ai', badge: 'Research standards',
    doi: '10.1016/j.dental.2024.07.020',
    spotlight: 'publications/guidance-biocompatibility-assessment.html',
    thumb: 'assets/spotlights/guidance-biocompatibility-assessment/card.png',
    summary: 'A practical framework for stronger, more meaningful biocompatibility assessment in biomaterials research.',
  },
  {
    title: 'A critical analysis of research methods and biological experimental models to study pulp regeneration',
    venue: 'International Endodontic Journal', year: 2022,
    featured: true, category: 'ai', badge: 'Critical framework',
    summary: 'A conceptual and methodological analysis of how pulp regeneration research is designed, interpreted and translated, highlighting the need for more meaningful experimental models.',
  },
  {
    title: 'Functional odontoblastic-like cells from human iPSCs',
    venue: 'Journal of Dental Research', year: 2018,
    featured: true, category: 'regen', badge: 'First-in-field model',
    summary: 'A stem-cell-derived odontoblastic model that opened new possibilities for studying dentin–pulp regeneration and biomaterial bioactivity.',
  },
  {
    title: 'Cytotoxicity survey of commercial graphene materials from worldwide',
    venue: 'npj 2D Materials & Applications', year: 2022,
    featured: true, category: 'bio', badge: 'Safety benchmark',
    doi: '10.1038/s41699-022-00330-8',
    spotlight: 'publications/graphene-cytotoxicity-survey.html',
    thumb: 'assets/spotlights/graphene-cytotoxicity-survey/card.png',
    summary: 'A worldwide survey showing that commercial graphene materials are highly heterogeneous and that biological responses depend strongly on material quality, impurities and physicochemical features.',
  },
  {
    title: 'Graphene nanocoating: high quality and stability upon several stressors',
    venue: 'Journal of Dental Research', year: 2021,
    featured: true, category: 'bio', badge: 'Translational robustness',
    summary: 'A technology-validation study showing that graphene nanocoatings can maintain high quality and stability after multiple chemical, mechanical and biological stressors.',
  },

  /* ── 2025 ───────────────────────────────────────────────── */
  { title: 'Guidance on biomaterials for periodontal tissue regeneration: Fabrication methods, materials and biological considerations', venue: 'Dental Materials', year: 2025, category: 'ai' },
  { title: 'Guidance on the assessment of the functionality of biomaterials for periodontal tissue regeneration: Methodologies and testing procedures', venue: 'Dental Materials', year: 2025, category: 'ai' },
  { title: 'Graphene nanocoating on titanium maintains structural and antibiofilm properties post-sterilization', venue: 'Dental Materials', year: 2025, category: 'bio' },
  { title: 'Comparing silver diamine fluoride delivery methods using microbrush, dental floss and Super Floss on a tooth-to-tooth interproximal contact model', venue: 'Journal of Dentistry', year: 2025, category: 'bio' },

  /* ── 2024 ───────────────────────────────────────────────── */
  { title: 'Stearic acid nanoparticles increase acyclovir absorption by oral epithelial cells', venue: 'Dental Materials', year: 2024, category: 'bio' },
  { title: 'The global burden of plastics in oral health: prospects for circularity, sustainable materials development and practice', venue: 'RSC Sustainability', year: 2024, category: 'ai' },
  { title: 'Boron-containing coating yields enhanced antimicrobial and mechanical effects on translucent zirconia', venue: 'Dental Materials', year: 2024, category: 'bio' },
  { title: 'Development and characterization of nitazoxanide-loaded poly(epsilon-caprolactone) membrane for GTR/GBR applications', venue: 'Dental Materials', year: 2024, category: 'regen' },
  { title: 'Physico-mechanical properties and bonding performance of graphene-added orthodontic adhesives', venue: 'Journal of Functional Biomaterials', year: 2024, category: 'bio' },
  { title: 'Optical effects of graphene addition on adhesives for orthodontic lingual retainers', venue: 'European Journal of Oral Sciences', year: 2024, category: 'bio' },
  { title: 'Specimen shape and elution time affect the mineralization and differentiation potential of dental pulp stem cells to Biodentine', venue: 'Journal of Functional Biomaterials', year: 2024, category: 'regen' },

  /* ── 2023 ───────────────────────────────────────────────── */
  { title: 'Graphene oxide increases PMMA resistance to fatigue and strength degradation', venue: 'Dental Materials', year: 2023, category: 'bio' },
  { title: 'Mesenchymal stromal cell exosomes enhance dental pulp cell functions and promote pulp-dentin regeneration', venue: 'Biomaterials and Biosystems', year: 2023, category: 'regen' },
  { title: 'Biofabrication, biochemical profiling, and in vitro applications of salivary gland decellularized matrices via magnetic bioassembly platforms', venue: 'Cell and Tissue Research', year: 2023, category: 'regen' },
  { title: 'Salivary gland regeneration from salivary gland stem cells to three-dimensional bioprinting', venue: 'SLAS Technology', year: 2023, category: 'regen' },
  { title: 'Identifying potential immuno-oncology targets in salivary gland mucoepidermoid carcinoma based on inflammatory status and treatment response', venue: 'Journal of Oral Pathology and Medicine', year: 2023, category: 'regen' },
  { title: 'Effect of two graphene derivatives on Enterococcus faecalis biofilms and cytotoxicity', venue: 'Dental Materials Journal', year: 2023, category: 'bio' },

  /* ── 2022 ───────────────────────────────────────────────── */
  { title: 'Antimicrobial-free graphene nanocoating decreases fungal yeast-to-hyphal switching and maturation of cross-kingdom biofilms containing clinical and antibiotic-resistant bacteria', venue: 'Biomaterials and Biosystems', year: 2022, category: 'bio' },
  { title: 'Advanced scaffolds and strategies for dental pulp regeneration', venue: 'Dental Clinics of North America', year: 2022, category: 'regen' },
  { title: 'Characterization of silver diamine fluoride cytotoxicity using microfluidic tooth-on-a-chip and gingival equivalents', venue: 'Dental Materials', year: 2022, category: 'regen' },
  { title: 'Pandemic preparedness and response: a foldable tent to safely remove contaminated dental aerosols', venue: 'Applied Sciences', year: 2022, category: 'ai' },
  { title: 'RoBDEMAT: a risk of bias tool and guideline to support reporting of pre-clinical dental materials research and assessment of systematic reviews', venue: 'Journal of Dentistry', year: 2022, category: 'ai' },
  { title: 'SMART: silver diamine fluoride reduces microtensile bond strength of glass ionomer cement to sound and artificial caries-affected dentin', venue: 'Dental Materials Journal', year: 2022, category: 'bio' },

  /* ── 2021 ───────────────────────────────────────────────── */
  { title: 'Fighting viruses with materials science and artificial intelligence', venue: 'Dental Materials', year: 2021, category: 'ai' },
  { title: 'Persistent inhibition of Candida albicans biofilm and hyphae growth on titanium by graphene nanocoating', venue: 'Dental Materials', year: 2021, category: 'bio' },
  { title: 'Graphene nanocoating provides superb long-lasting corrosion protection to titanium alloy', venue: 'Dental Materials', year: 2021, category: 'bio' },
  { title: 'Pulsed electromagnetic fields synergize with graphene to enhance dental pulp stem cell-derived motor neurogenesis by targeting TRPC1 channel', venue: 'European Cells and Materials', year: 2021, category: 'regen' },
  { title: 'Two-photon fluorescence microscopy and applications in angiogenesis and related molecular events', venue: 'Tissue Engineering Part B: Reviews', year: 2021, category: 'ai' },
  { title: 'Characterization, antimicrobial effects, and cytocompatibility of a root canal sealer produced by pozzolan reaction between calcium hydroxide and silica', venue: 'Materials', year: 2021, category: 'bio' },
  { title: 'Mechanical properties and in vitro cytocompatibility of dense and porous Ti-6Al-4V ELI manufactured by selective laser melting technology for biomedical applications', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2021, category: 'bio' },

  /* ── 2020 ───────────────────────────────────────────────── */
  { title: 'Inhibiting corrosion of biomedical Ti-6Al-4V alloys with graphene nanocoating', venue: 'Journal of Dental Research', year: 2020, category: 'bio' },
  { title: 'Mechanisms of graphene influence on cell differentiation', venue: 'Materials Today Chemistry', year: 2020, category: 'bio' },
  { title: 'Biomechanics of alloplastic mandible reconstruction using biomaterials: The effect of implant design on stress concentration influences choice of material', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2020, category: 'bio' },
  { title: 'Effect of a calcium hydroxide-based intracanal medicament containing N-2-methyl pyrrolidone as a vehicle against Enterococcus faecalis biofilm', venue: 'Journal of Applied Oral Sciences', year: 2020, category: 'regen' },

  /* ── 2019 ───────────────────────────────────────────────── */
  { title: 'Comparative study of different induction protocols for neural differentiation of human dental pulp stem cell in vitro', venue: 'Archives of Oral Biology', year: 2019, category: 'regen' },
  { title: 'Taguchi methods to optimize the properties and bioactivity of 3D printed polycaprolactone/mineral trioxide aggregate scaffold: theoretical predictions and experimental validation', venue: 'Journal of Biomedical Materials Research Part B', year: 2019, category: 'ai' },

  /* ── 2015 ───────────────────────────────────────────────── */
  { title: 'Bioactivity, physical and chemical properties of MTA mixed with propylene glycol', venue: 'Journal of Applied Oral Sciences', year: 2015, category: 'regen' },

  /* ── 2014 ───────────────────────────────────────────────── */
  { title: 'Inducing pluripotency for disease modeling, drug development and craniofacial applications', venue: 'Expert Opinion on Biological Therapy', year: 2014, category: 'regen' },

  /* ── 2013 ───────────────────────────────────────────────── */
  { title: 'Dental pulp tissue engineering in full-length root canals', venue: 'Journal of Dental Research', year: 2013, category: 'regen' },

  /* ── 2012 ───────────────────────────────────────────────── */
  { title: 'Tissue engineering: from research to dental clinics', venue: 'Dental Materials', year: 2012, category: 'regen' },
];
