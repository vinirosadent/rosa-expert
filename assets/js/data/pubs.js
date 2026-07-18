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
    doi: '10.1016/j.dental.2024.12.003',
    spotlight: 'publications/guidance-pulp-regeneration.html',
    thumb: 'assets/spotlights/guidance-pulp-regeneration/card.png',
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
    category: 'ai',
    summary: 'A conceptual and methodological analysis of how pulp regeneration research is designed, interpreted and translated, highlighting the need for more meaningful experimental models.',
  },
  {
    title: 'Functional odontoblastic-like cells from human iPSCs',
    venue: 'Journal of Dental Research', year: 2018,
    featured: true, category: 'regen', badge: 'First-in-field model',
    doi: '10.1177/0022034517730026',
    spotlight: 'publications/odontoblastic-cells-ipsc.html',
    thumb: 'assets/spotlights/odontoblastic-cells-ipsc/card.png',
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
    doi: '10.1177/00220345211024526',
    spotlight: 'publications/graphene-nanocoating-stressors.html',
    thumb: 'assets/spotlights/graphene-nanocoating-stressors/card.png',
    summary: 'A technology-validation study showing that graphene nanocoatings can maintain high quality and stability after multiple chemical, mechanical and biological stressors.',
  },

  /* ── 2025 ───────────────────────────────────────────────── */
  { title: 'From human dental pulp stem cells to functional cholinergic neurons: An optimized neurogenic differentiation protocol for new approach methodologies', venue: 'Journal of Dental Sciences', year: 2025, category: 'regen', doi: '10.1016/j.jds.2025.10.025' },
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
  { title: '3D Printing—A Way Forward', venue: 'Dental Implants and Oral Microbiome Dysbiosis: An Interdisciplinary Perspective', year: 2022, category: 'bio', doi: '10.1007/978-3-030-99014-5_6' },
  { title: 'Antimicrobial-free graphene nanocoating decreases fungal yeast-to-hyphal switching and maturation of cross-kingdom biofilms containing clinical and antibiotic-resistant bacteria', venue: 'Biomaterials and Biosystems', year: 2022, category: 'bio' },
  { title: 'Advanced scaffolds and strategies for dental pulp regeneration', venue: 'Dental Clinics of North America', year: 2022, category: 'regen' },
  { title: 'Characterization of silver diamine fluoride cytotoxicity using microfluidic tooth-on-a-chip and gingival equivalents', venue: 'Dental Materials', year: 2022, category: 'regen' },
  { title: 'Pandemic preparedness and response: a foldable tent to safely remove contaminated dental aerosols', venue: 'Applied Sciences', year: 2022, category: 'ai' },
  { title: 'RoBDEMAT: a risk of bias tool and guideline to support reporting of pre-clinical dental materials research and assessment of systematic reviews', venue: 'Journal of Dentistry', year: 2022, category: 'ai' },
  { title: 'SMART: silver diamine fluoride reduces microtensile bond strength of glass ionomer cement to sound and artificial caries-affected dentin', venue: 'Dental Materials Journal', year: 2022, category: 'bio' },

  /* ── 2021 ───────────────────────────────────────────────── */
  { title: 'Induced pluripotent stem cell-derived odontoblasts for disease modeling, drug development, and craniofacial applications', venue: 'Current Progress in iPSC-derived Cell Types', year: 2021, category: 'regen', doi: '10.1016/B978-0-12-823884-4.00013-4' },
  { title: 'Fighting viruses with materials science and artificial intelligence', venue: 'Dental Materials', year: 2021, category: 'ai' },
  { title: 'Persistent inhibition of Candida albicans biofilm and hyphae growth on titanium by graphene nanocoating', venue: 'Dental Materials', year: 2021, category: 'bio' },
  { title: 'Graphene nanocoating provides superb long-lasting corrosion protection to titanium alloy', venue: 'Dental Materials', year: 2021, category: 'bio' },
  { title: 'Pulsed electromagnetic fields synergize with graphene to enhance dental pulp stem cell-derived motor neurogenesis by targeting TRPC1 channel', venue: 'European Cells and Materials', year: 2021, category: 'regen' },
  { title: 'Two-photon fluorescence microscopy and applications in angiogenesis and related molecular events', venue: 'Tissue Engineering Part B: Reviews', year: 2021, category: 'ai' },
  { title: 'Characterization, antimicrobial effects, and cytocompatibility of a root canal sealer produced by pozzolan reaction between calcium hydroxide and silica', venue: 'Materials', year: 2021, category: 'bio' },
  { title: 'Mechanical properties and in vitro cytocompatibility of dense and porous Ti-6Al-4V ELI manufactured by selective laser melting technology for biomedical applications', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2021, category: 'bio' },

  /* ── 2020 ───────────────────────────────────────────────── */
  { title: 'Characterization of Enterococcus faecalis in different culture conditions', venue: 'Scientific Reports', year: 2020, category: 'bio', doi: '10.1038/s41598-020-78998-5' },
  { title: 'Combined effect of melittin and DNase on Enterococcus faecalis biofilms and its susceptibility to sodium hypochlorite', venue: 'Materials', year: 2020, category: 'bio', doi: '10.3390/MA13173740' },
  { title: 'Main and accessory canal filling quality of a premixed calcium silicate endodontic sealer according to different obturation techniques', venue: 'Materials', year: 2020, category: 'bio', doi: '10.3390/ma13194389' },
  { title: 'Novel materials and therapeutic strategies against the infection of implants', venue: 'Emergent Materials', year: 2020, category: 'bio', doi: '10.1007/s42247-020-00117-x' },
  { title: 'Osteogenic potential of graphene coated titanium is independent of transfer technique', venue: 'Materialia', year: 2020, category: 'regen', doi: '10.1016/j.mtla.2020.100604' },
  { title: 'Polymer Nanocomposites Based on Poly(ε-caprolactone), Hydroxyapatite and Graphene Oxide', venue: 'Journal of Polymers and the Environment', year: 2020, category: 'bio', doi: '10.1007/s10924-019-01613-w' },
  { title: 'Potential applications of graphene-based nanomaterials in biomedical, dental, and implant applications', venue: 'Advances in Dental Implantology using Nanomaterials and Allied Technology Applications', year: 2020, category: 'bio', doi: '10.1007/978-3-030-52207-0_4' },
  { title: 'Sodium Hypochlorite Treatment Post-Etching Improves the Bond Strength of Resin-Based Sealant to Hypomineralized Enamel by Removing Surface Organic Content', venue: 'Pediatric dentistry', year: 2020, category: 'bio' },
  { title: 'Inhibiting corrosion of biomedical Ti-6Al-4V alloys with graphene nanocoating', venue: 'Journal of Dental Research', year: 2020, category: 'bio' },
  { title: 'Mechanisms of graphene influence on cell differentiation', venue: 'Materials Today Chemistry', year: 2020, category: 'bio' },
  { title: 'Biomechanics of alloplastic mandible reconstruction using biomaterials: The effect of implant design on stress concentration influences choice of material', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2020, category: 'bio' },
  { title: 'Effect of a calcium hydroxide-based intracanal medicament containing N-2-methyl pyrrolidone as a vehicle against Enterococcus faecalis biofilm', venue: 'Journal of Applied Oral Sciences', year: 2020, category: 'regen' },

  /* ── 2019 ───────────────────────────────────────────────── */
  { title: 'Antibiotics Used in Regenerative Endodontics Modify Immune Response of Macrophages to Bacterial Infection', venue: 'Journal of Endodontics', year: 2019, category: 'regen', doi: '10.1016/j.joen.2019.08.001' },
  { title: 'Graphene to improve the physicomechanical properties and bioactivity of the cements', venue: 'Advanced Dental Biomaterials', year: 2019, category: 'bio', doi: '10.1016/B978-0-08-102476-8.00022-0' },
  { title: 'Graphene-induced osteogenic differentiation is mediated by the integrin/FAK axis', venue: 'International Journal of Molecular Sciences', year: 2019, category: 'regen', doi: '10.3390/ijms20030574' },
  { title: 'Hydrophobicity of graphene as a driving force for inhibiting biofilm formation of pathogenic bacteria and fungi', venue: 'Dental Materials', year: 2019, category: 'bio', doi: '10.1016/j.dental.2018.09.016' },
  { title: 'Role of extracellular dna in enterococcus faecalis biofilm formation and its susceptibility to sodium hypochlorite', venue: 'Journal of Applied Oral Science', year: 2019, category: 'bio', doi: '10.1590/1678-7757-2018-0699' },
  { title: 'Translucency, hardness and strength parameters of PMMA resin containing graphene-like material for CAD/CAM restorations', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2019, category: 'bio', doi: '10.1016/j.jmbbm.2019.103388' },
  { title: 'Comparative study of different induction protocols for neural differentiation of human dental pulp stem cell in vitro', venue: 'Archives of Oral Biology', year: 2019, category: 'regen' },
  {
    title: 'Taguchi methods to optimize the properties and bioactivity of 3D printed polycaprolactone/mineral trioxide aggregate scaffold: theoretical predictions and experimental validation',
    venue: 'Journal of Biomedical Materials Research Part B', year: 2020, category: 'ai',
    featured: true, badge: 'Design of experiments',
    doi: '10.1002/jbm.b.34417',
    spotlight: 'publications/taguchi-pcl-mta-scaffold.html',
    thumb: 'assets/spotlights/taguchi-pcl-mta-scaffold/card.png',
    summary: 'A Taguchi design-of-experiments approach optimized a 3D-printed PCL/MTA scaffold with a fraction of the experiments — revealing composition as the dominant factor for bioactivity.',
  },

  /* ── 2018 ── */
  { title: 'Applications of additive manufacturing in dentistry: A review', venue: 'Journal of Biomedical Materials Research - Part B Applied Biomaterials', year: 2018, category: 'ai', doi: '10.1002/jbm.b.33961' },
  { title: 'Carbon nanocomposites for implant dentistry and bone tissue engineering', venue: 'Applications of Nanocomposite Materials in Dentistry', year: 2018, category: 'regen', doi: '10.1016/B978-0-12-813742-0.00003-1' },
  { title: 'Effect of staining beverages on color and translucency of CAD/CAM composites', venue: 'Journal of Esthetic and Restorative Dentistry', year: 2018, category: 'bio', doi: '10.1111/jerd.12359' },
  { title: 'Enhanced Skin Permeation of Anti-wrinkle Peptides via Molecular Modification', venue: 'Scientific Reports', year: 2018, category: 'bio', doi: '10.1038/s41598-017-18454-z' },
  { title: 'Graphene onto medical grade titanium: an atom-thick multimodal coating that promotes osteoblast maturation and inhibits biofilm formation from distinct species', venue: 'Nanotoxicology', year: 2018, category: 'bio', doi: '10.1080/17435390.2018.1434911' },
  { title: 'Optimization of surface scaffold morphology and structure using Taguchi’s design of experiments', venue: 'Frontiers in Biomedical Devices, BIOMED - 2018 Design of Medical Devices Conference, DMD 2018', year: 2018, category: 'ai', doi: '10.1115/DMD2018-6813' },
  { title: 'Root Canal Filling Quality of a Premixed Calcium Silicate Endodontic Sealer Applied Using Gutta-percha Cone-mediated Ultrasonic Activation', venue: 'Journal of Endodontics', year: 2018, category: 'bio', doi: '10.1016/j.joen.2017.07.023' },
  { title: 'Thermo-setting glass ionomer cements promote variable biological responses of human dental pulp stem cells', venue: 'Dental Materials', year: 2018, category: 'regen', doi: '10.1016/j.dental.2018.03.015' },

  /* ── 2017 ── */
  { title: 'Behaviour of human dental pulp cells cultured in a collagen hydrogel scaffold cross-linked with cinnamaldehyde', venue: 'International Endodontic Journal', year: 2017, category: 'regen', doi: '10.1111/iej.12592' },
  { title: 'CVD graphene transfer procedure to the surface of stainless steel for stem cell proliferation', venue: 'Surface and Coatings Technology', year: 2017, category: 'regen', doi: '10.1016/j.surfcoat.2016.12.111' },
  { title: 'CVD-grown monolayer graphene induces osteogenic but not odontoblastic differentiation of dental pulp stem cells', venue: 'Dental Materials', year: 2017, category: 'regen', doi: '10.1016/j.dental.2016.09.030' },
  { title: 'Effect of needle diameter on scaffold morphology and strength in E-Jetted polycaprolactone scaffolds', venue: 'ASME 2017 12th International Manufacturing Science and Engineering Conference, MSEC 2017 collocated with the JSME/ASME 2017 6th International Conference on Materials and Processing', year: 2017, category: 'bio', doi: '10.1115/MSEC20172989' },
  { title: 'Effects of Epigallocatechin Gallate, an Antibacterial Cross-linking Agent, on Proliferation and Differentiation of Human Dental Pulp Cells Cultured in Collagen Scaffolds', venue: 'Journal of Endodontics', year: 2017, category: 'regen', doi: '10.1016/j.joen.2016.10.017' },
  { title: 'Graphene for the development of the next-generation of biocomposites for dental and medical applications', venue: 'Dental Materials', year: 2017, category: 'bio', doi: '10.1016/j.dental.2017.04.008' },
  { title: 'Graphene nanosheets to improve physico-mechanical properties of bioactive calcium silicate cements', venue: 'Materials', year: 2017, category: 'bio', doi: '10.3390/ma10060606' },
  { title: 'Graphene transfer to 3-dimensional surfaces: A vacuum-assisted dry transfer method', venue: '2D Materials', year: 2017, category: 'bio', doi: '10.1088/2053-1583/aa6530' },
  { title: 'Streptococcus mutans forms xylitol-resistant biofilm on excess adhesive flash in novel ex-vivo orthodontic bracket model', venue: 'American Journal of Orthodontics and Dentofacial Orthopedics', year: 2017, category: 'bio', doi: '10.1016/j.ajodo.2016.09.017' },

  /* ── 2016 ── */
  { title: 'Dental Stem Cells for Pulp Regeneration', venue: 'Stem Cell Biology and Regenerative Medicine', year: 2016, category: 'regen', doi: '10.1007/978-3-319-33299-4_8' },
  { title: 'Effects of chrondro-osseous regenerative compound associated with local treatments in the regeneration of bone defects around implants: an in vivo study', venue: 'Clinical Oral Investigations', year: 2016, category: 'regen', doi: '10.1007/s00784-015-1509-1' },
  { title: 'Fabrication and evaluation of electrohydrodynamic jet 3D printed polycaprolactone/chitosan cell carriers using human embryonic stem cell-derived fibroblasts', venue: 'Journal of Biomaterials Applications', year: 2016, category: 'regen', doi: '10.1177/0885328216652537' },
  { title: 'Fabrication of dentin-like scaffolds through combined 3D printing and bio-mineralisation', venue: 'Cogent Engineering', year: 2016, category: 'regen', doi: '10.1080/23311916.2016.1222777' },
  { title: 'Graphene oxide-based substrate: physical and surface characterization, cytocompatibility and differentiation potential of dental pulp stem cells', venue: 'Dental Materials', year: 2016, category: 'regen', doi: '10.1016/j.dental.2016.05.008' },
  { title: 'Graphene: An emerging carbon nanomaterial for bone tissue engineering', venue: 'Carbon Nanostructures', year: 2016, category: 'regen', doi: '10.1007/978-3-319-45639-3_5' },
  { title: 'In Vitro Osteogenic Potential of Green Fluorescent Protein Labelled Human Embryonic Stem Cell-Derived Osteoprogenitors', venue: 'Stem Cells International', year: 2016, category: 'regen', doi: '10.1155/2016/1659275' },
  { title: 'Pluripotency of Stem Cells from Human Exfoliated Deciduous Teeth for Tissue Engineering', venue: 'Stem Cells International', year: 2016, category: 'regen', doi: '10.1155/2016/5957806' },
  { title: 'Pluripotent stem cells: An in vitro model for nanotoxicity assessments', venue: 'Journal of Applied Toxicology', year: 2016, category: 'regen', doi: '10.1002/jat.3347' },
  { title: 'Reliability, failure probability, and strength of resin-based materials for CAD/CAM restorations', venue: 'Journal of Applied Oral Science', year: 2016, category: 'bio', doi: '10.1590/1678-775720150561' },
  { title: 'Tooth discoloration induced by a novel mineral trioxide aggregate-based root canal sealer', venue: 'European Journal of Dentistry', year: 2016, category: 'bio', doi: '10.4103/1305-7456.184165' },

  /* ── 2015 ───────────────────────────────────────────────── */
  { title: 'Fatigue stipulation of bulk-fill composites: An in vitro appraisal', venue: 'Dental Materials', year: 2015, category: 'bio', doi: '10.1016/j.dental.2015.06.006' },
  { title: 'Graphene: A Versatile Carbon-Based Material for Bone Tissue Engineering', venue: 'Stem Cells International', year: 2015, category: 'regen', doi: '10.1155/2015/804213' },
  { title: 'Modulation of Dental Pulp Stem Cell Odontogenesis in a Tunable PEG-Fibrinogen Hydrogel System', venue: 'Stem Cells International', year: 2015, category: 'regen', doi: '10.1155/2015/525367' },
  {
    title: 'Two and three-dimensional graphene substrates to magnify osteogenic differentiation of periodontal ligament stem cells',
    venue: 'Carbon', year: 2015, category: 'bio',
    doi: '10.1016/j.carbon.2015.05.071',
    spotlight: 'publications/graphene-2d-3d-osteogenic.html',
    thumb: 'assets/spotlights/graphene-2d-3d-osteogenic/card.png',
  },
  { title: 'Bioactivity, physical and chemical properties of MTA mixed with propylene glycol', venue: 'Journal of Applied Oral Sciences', year: 2015, category: 'regen' },

  /* ── 2014 ───────────────────────────────────────────────── */
  { title: 'Structural reinforcement and sealing ability of temporary fillings in premolar with class II mod cavities', venue: 'The journal of contemporary dental practice', year: 2014, category: 'bio', doi: '10.5005/jp-journals-10024-1489' },
  { title: 'Inducing pluripotency for disease modeling, drug development and craniofacial applications', venue: 'Expert Opinion on Biological Therapy', year: 2014, category: 'regen' },

  /* ── 2013 ───────────────────────────────────────────────── */
  { title: 'What and where are the stem cells for Dentistry?', venue: 'Singapore dental journal', year: 2013, category: 'regen', doi: '10.1016/j.sdj.2013.11.003' },
  { title: 'Dental pulp tissue engineering in full-length root canals', venue: 'Journal of Dental Research', year: 2013, category: 'regen' },

  /* ── 2012 ───────────────────────────────────────────────── */
  { title: 'Subcritical crack growth and in vitro lifetime prediction of resin composites with different filler distributions', venue: 'Dental Materials', year: 2012, category: 'bio', doi: '10.1016/j.dental.2012.05.001' },
  { title: 'Tissue engineering: from research to dental clinics', venue: 'Dental Materials', year: 2012, category: 'regen' },

  /* ── 2011 ── */
  { title: 'Effect of ion exchange on R-curve behavior of a dental porcelain', venue: 'Journal of Materials Science', year: 2011, category: 'bio', doi: '10.1007/s10853-010-4858-9' },
  { title: 'Effect of Test Environment and Microstructure on the Flexural Strength of Dental Porcelains', venue: 'Journal of Prosthodontics', year: 2011, category: 'bio', doi: '10.1111/j.1532-849X.2011.00711.x' },
  { title: 'Regenerative endodontics in light of the stem cell paradigm', venue: 'International Dental Journal', year: 2011, category: 'regen', doi: '10.1111/j.1875-595X.2011.00026.x' },

  /* ── 2010 ── */
  { title: 'Are flowable resin-based composites a reliable material for metal orthodontic bracket bonding?', venue: 'Journal of Contemporary Dental Practice', year: 2010, category: 'bio', doi: '10.5005/jcdp-11-4-17' },
  { title: 'Effect of ion-exchange temperature on mechanical properties of a dental porcelain', venue: 'Ceramics International', year: 2010, category: 'bio', doi: '10.1016/j.ceramint.2010.05.007' },

  /* ── 2009 ── */
  { title: 'Effect of ion exchange on strength and slow crack growth of a dental porcelain', venue: 'Dental Materials', year: 2009, category: 'bio', doi: '10.1016/j.dental.2008.12.009' },
  { title: 'Visual and instrumental agreement in dental shade selection: Three distinct observer populations and shade matching protocols', venue: 'Dental Materials', year: 2009, category: 'bio', doi: '10.1016/j.dental.2008.09.006' },

  /* ── 2008 ── */
  { title: 'Influence of pH on slow crack growth of dental porcelains', venue: 'Dental Materials', year: 2008, category: 'bio', doi: '10.1016/j.dental.2007.10.001' },

  /* ── 2007 ── */
  { title: 'Effect of acid etching of glass ionomer cement surface on the microleakage of sandwich restorations', venue: 'Journal of Applied Oral Science', year: 2007, category: 'bio', doi: '10.1590/s1678-77572007000300014' },
  { title: 'Influence of shade and irradiation time on the hardness of composite resins', venue: 'Brazilian Dental Journal', year: 2007, category: 'bio', doi: '10.1590/S0103-64402007000300010' },
];
