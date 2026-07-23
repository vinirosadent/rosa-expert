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
    authors: 'Sabino C.F., Grymak A., Silikas N., Rosa V.',
    venue: 'Dental Materials', year: 2025,
    featured: true, category: 'ai', badge: 'Material informatics',
    doi: '10.1016/j.dental.2025.08.018',
    spotlight: 'publications/ph-prediction-calcium-silicate.html',
    thumb: 'assets/spotlights/ph-prediction-calcium-silicate/card.png',
    summary: 'A machine-learning study showing how early experimental measurements can predict long-term properties of calcium silicate cements, supporting faster and more rational biomaterial development.',
  },
  {
    title: 'Designing C3S cements with on-demand properties for precision endodontics',
    authors: 'Cahyanto A., Rath P., Teo T.X., Tong S.S., Malhotra R., Cavalcanti B.N., Lim L.Z., Min K.S., Ho D., Lu W.F., Rosa V.',
    venue: 'Journal of Dental Research', year: 2023,
    featured: true, category: 'ai', badge: 'On-demand biomaterials',
    doi: '10.1177/00220345231198185',
    spotlight: 'publications/designing-c3s-cements-on-demand.html',
    thumb: 'assets/spotlights/designing-c3s-cements-on-demand/card.png',
    summary: 'A genetic-algorithm study demonstrating that endodontic cements can be computationally designed with tailor-made handling, chemical, mechanical and bioactive properties.',
  },
  {
    title: 'Guidance for evaluating biomaterials\' properties and biological potential for dental pulp tissue engineering and regeneration research',
    authors: 'Rosa V., Cavalcanti B.N., Nör J.E., Tezvergil-Mutluay A., Silikas N., Bottino M.C., Kishen A., Soares D.G., Franca C.M., Cooper P.R., Duncan H.F., Ferracane J.L., Watts D.C.',
    venue: 'Dental Materials', year: 2025,
    featured: true, category: 'ai', badge: 'Field guidance',
    doi: '10.1016/j.dental.2024.12.003',
    spotlight: 'publications/guidance-pulp-regeneration.html',
    thumb: 'assets/spotlights/guidance-pulp-regeneration/card.png',
    summary: 'A field-shaping guidance paper defining how biomaterials for dental pulp regeneration should be evaluated, linking material properties to biological and translational performance.',
  },
  {
    title: 'Guidance on the assessment of biocompatibility of biomaterials: Fundamentals and testing considerations',
    authors: 'Rosa V., Silikas N., Yu B., Dubey N., Sriram G., Zinelis S., Lima A.F., Bottino M.C., Ferreira J.N., Schmalz G., Watts D.C.',
    venue: 'Dental Materials', year: 2024,
    featured: true, category: 'ai', badge: 'Research standards',
    doi: '10.1016/j.dental.2024.07.020',
    spotlight: 'publications/guidance-biocompatibility-assessment.html',
    thumb: 'assets/spotlights/guidance-biocompatibility-assessment/card.png',
    summary: 'A practical framework for stronger, more meaningful biocompatibility assessment in biomaterials research.',
  },
  {
    title: 'A critical analysis of research methods and biological experimental models to study pulp regeneration',
    authors: 'Rosa V., Sriram G., McDonald N., Cavalcanti B.N.',
    venue: 'International Endodontic Journal', year: 2022,
    doi: '10.1111/iej.13712',
    category: 'ai',
    summary: 'A conceptual and methodological analysis of how pulp regeneration research is designed, interpreted and translated, highlighting the need for more meaningful experimental models.',
  },
  {
    title: 'Functional odontoblastic-like cells from human iPSCs',
    authors: 'Xie H., Dubey N., Shim W., Ramachandra C.J.A., Min K.S., Cao T., Rosa V.',
    venue: 'Journal of Dental Research', year: 2018,
    featured: true, category: 'regen', badge: 'First-in-field model',
    doi: '10.1177/0022034517730026',
    spotlight: 'publications/odontoblastic-cells-ipsc.html',
    thumb: 'assets/spotlights/odontoblastic-cells-ipsc/card.png',
    summary: 'A stem-cell-derived odontoblastic model that opened new possibilities for studying dentin–pulp regeneration and biomaterial bioactivity.',
  },
  {
    title: 'Cytotoxicity survey of commercial graphene materials from worldwide',
    authors: 'Malhotra R., Halbig C.E., Sim Y.F., Lim C.T., Leong D.T., Neto A.H.C., Garaj S., Rosa V.',
    venue: 'npj 2D Materials & Applications', year: 2022,
    featured: true, category: 'bio', badge: 'Safety benchmark',
    doi: '10.1038/s41699-022-00330-8',
    spotlight: 'publications/graphene-cytotoxicity-survey.html',
    thumb: 'assets/spotlights/graphene-cytotoxicity-survey/card.png',
    summary: 'A worldwide survey showing that commercial graphene materials are highly heterogeneous and that biological responses depend strongly on material quality, impurities and physicochemical features.',
  },
  {
    title: 'Graphene nanocoating: high quality and stability upon several stressors',
    authors: 'Rosa V., Malhotra R., Agarwalla S.V., Morin J.L.P., Luong-Van E.K., Han Y.M., Chew R.J.J., Seneviratne C.J., Silikas N., Tan K.S., Nijhuis C.A., Castro Neto A.H.',
    venue: 'Journal of Dental Research', year: 2021,
    featured: true, category: 'bio', badge: 'Translational robustness',
    doi: '10.1177/00220345211024526',
    spotlight: 'publications/graphene-nanocoating-stressors.html',
    thumb: 'assets/spotlights/graphene-nanocoating-stressors/card.png',
    summary: 'A technology-validation study showing that graphene nanocoatings can maintain high quality and stability after multiple chemical, mechanical and biological stressors.',
  },

  /* ── 2025 ───────────────────────────────────────────────── */
  { title: 'From human dental pulp stem cells to functional cholinergic neurons: An optimized neurogenic differentiation protocol for new approach methodologies', authors: 'Sawutdeechaikul P., Pimpakan T., Van Phan T., Rosa V., Ferreira J.N.', venue: 'Journal of Dental Sciences', year: 2025, category: 'regen', doi: '10.1016/j.jds.2025.10.025' },
  { title: 'Guidance on biomaterials for periodontal tissue regeneration: Fabrication methods, materials and biological considerations', authors: 'Fischer N.G., de Souza Araújo I.J., Daghrery A., Yu B., Dal-Fabbro R., dos Reis-Prado A.H., Silikas N., Rosa V., Aparicio C., Watts D.C., Bottino M.C.', venue: 'Dental Materials', year: 2025, category: 'ai', doi: '10.1016/j.dental.2024.12.019' },
  { title: 'Guidance on the assessment of the functionality of biomaterials for periodontal tissue regeneration: Methodologies and testing procedures', authors: 'Daghrery A., Dal-Fabbro R., dos Reis-Prado A.H., de Souza Araújo I.J., Fischer N.G., Rosa V., Silikas N., Aparicio C., Watts D.C., Bottino M.C.', venue: 'Dental Materials', year: 2025, category: 'ai', doi: '10.1016/j.dental.2024.12.018' },
  { title: 'Graphene nanocoating on titanium maintains structural and antibiofilm properties post-sterilization', authors: 'Morin J.L.P., Dubey N., Luong-Van E.K., Yu B., Sabino C.F., Silikas N., Agarwalla S.V., Neto A.C., Rosa V.', venue: 'Dental Materials', year: 2025, category: 'bio', doi: '10.1016/j.dental.2024.10.009' },
  { title: 'Comparing silver diamine fluoride delivery methods using microbrush, dental floss and Super Floss on a tooth-to-tooth interproximal contact model', authors: 'Kwek V.Y.X., Hong C.H.L., Rosa V., Lum J.L., Hong K., Hu S.', venue: 'Journal of Dentistry', year: 2025, category: 'bio', doi: '10.1016/j.jdent.2025.105653' },

  /* ── 2024 ───────────────────────────────────────────────── */
  { title: 'Stearic acid nanoparticles increase acyclovir absorption by oral epithelial cells', authors: 'Rath P.P., Makkar H., Agarwalla S.V., Sriram G., Rosa V.', venue: 'Dental Materials', year: 2024, category: 'bio', doi: '10.1016/j.dental.2024.07.005' },
  { title: 'The global burden of plastics in oral health: prospects for circularity, sustainable materials development and practice', authors: 'Ong A., Teo J.Y.Q., Watts D.C., Silikas N., Lim J.Y.C., Rosa V.', venue: 'RSC Sustainability', year: 2024, category: 'ai', doi: '10.1039/D3SU00364G' },
  { title: 'Boron-containing coating yields enhanced antimicrobial and mechanical effects on translucent zirconia', authors: 'Sabino C.F., Agarwalla S.V., da Silva Rodrigues C., da Silva A.C., Campos T.M.B., Tan K.S., Rosa V., de Melo R.M.', venue: 'Dental Materials', year: 2024, category: 'bio', doi: '10.1016/j.dental.2023.10.011' },
  { title: 'Development and characterization of nitazoxanide-loaded poly(epsilon-caprolactone) membrane for GTR/GBR applications', authors: 'Arora V., Lin R.Y.-T., Tang Y.L., Tan K.S., Rosa V., Sriram G., Dubey N.', venue: 'Dental Materials', year: 2024, category: 'regen', doi: '10.1016/j.dental.2024.10.007' },
  { title: 'Physico-mechanical properties and bonding performance of graphene-added orthodontic adhesives', authors: 'Liu S., El-Angbawi A., Rosa V., Silikas N.', venue: 'Journal of Functional Biomaterials', year: 2024, category: 'bio', doi: '10.3390/jfb15080204' },
  { title: 'Optical effects of graphene addition on adhesives for orthodontic lingual retainers', authors: 'Liu S., El-Angbawi A., Ji R., Rosa V., Silikas N.', venue: 'European Journal of Oral Sciences', year: 2024, category: 'bio', doi: '10.1111/eos.12966' },
  { title: 'Specimen shape and elution time affect the mineralization and differentiation potential of dental pulp stem cells to Biodentine', authors: 'Phang V., Malhotra R., Chen N.N., Min K.-S., Yu V.S.H., Rosa V., Dubey N.', venue: 'Journal of Functional Biomaterials', year: 2024, category: 'regen', doi: '10.3390/jfb15010001' },

  /* ── 2023 ───────────────────────────────────────────────── */
  { title: 'Graphene oxide increases PMMA resistance to fatigue and strength degradation', authors: 'Cahyanto A., Martins M.V.S., Bianchi O., Sudhakaran D.P., Sililkas N., Echeverrigaray S.G., Rosa V.', venue: 'Dental Materials', year: 2023, category: 'bio', doi: '10.1016/j.dental.2023.06.009' },
  { title: 'Mesenchymal stromal cell exosomes enhance dental pulp cell functions and promote pulp-dentin regeneration', authors: 'Shi J., Teo K.Y.W., Zhang S., Lai R.C., Rosa V., Tong H.J., Duggal M.S., Lim S.K., Toh W.S.', venue: 'Biomaterials and Biosystems', year: 2023, category: 'regen', doi: '10.1016/j.bbiosy.2023.100078' },
  { title: 'Biofabrication, biochemical profiling, and in vitro applications of salivary gland decellularized matrices via magnetic bioassembly platforms', authors: 'Ahmed K., Rodboon T., Oo Y., Phan T., Chaisuparat R., Yodmuang S., Rosa V., Ferreira J.N.', venue: 'Cell and Tissue Research', year: 2023, category: 'regen', doi: '10.1007/s00441-022-03728-4' },
  { title: 'Salivary gland regeneration from salivary gland stem cells to three-dimensional bioprinting', authors: 'Phan T.V., Oo Y., Ahmed K., Rodboon T., Rosa V., Yodmuang S., Ferreira J.N.', venue: 'SLAS Technology', year: 2023, category: 'regen', doi: '10.1016/j.slast.2023.03.004' },
  { title: 'Identifying potential immuno-oncology targets in salivary gland mucoepidermoid carcinoma based on inflammatory status and treatment response', authors: 'Urumarudappa S.K.J., Tran V.N.T., Oo H.M., Suntiparpluacha M., Sampattavanich S., Rosa V., Ruangritchankul K., Ferreira J.N., Chaisuparat R.', venue: 'Journal of Oral Pathology and Medicine', year: 2023, category: 'regen', doi: '10.1111/jop.13488' },
  { title: 'Effect of two graphene derivatives on Enterococcus faecalis biofilms and cytotoxicity', authors: 'Kim M.-A., Rosa V., Min K.-S.', venue: 'Dental Materials Journal', year: 2023, category: 'bio', doi: '10.4012/dmj.2022-095' },

  /* ── 2022 ───────────────────────────────────────────────── */
  { title: '3D Printing—A Way Forward', authors: 'Sivaswamy V., Matinlinna J.P., Rosa V., Neelakantan P.', venue: 'Dental Implants and Oral Microbiome Dysbiosis: An Interdisciplinary Perspective', year: 2022, category: 'bio', doi: '10.1007/978-3-030-99014-5_6' },
  { title: 'Antimicrobial-free graphene nanocoating decreases fungal yeast-to-hyphal switching and maturation of cross-kingdom biofilms containing clinical and antibiotic-resistant bacteria', authors: 'Agarwalla S.V., Ellepola K., Sorokin V., Ihsan M., Silikas N., Neto A.C., Seneviratne C.J., Rosa V.', venue: 'Biomaterials and Biosystems', year: 2022, category: 'bio', doi: '10.1016/j.bbiosy.2022.100069' },
  { title: 'Advanced scaffolds and strategies for dental pulp regeneration', authors: 'Soares D.G., Rosa V.', venue: 'Dental Clinics of North America', year: 2022, category: 'regen', doi: '10.1016/j.cden.2022.05.010' },
  { title: 'Characterization of silver diamine fluoride cytotoxicity using microfluidic tooth-on-a-chip and gingival equivalents', authors: 'Hu S., Muniraj G., Mishra A., Hong K., Lum J.L., Hong C.H.L., Rosa V., Sriram G.', venue: 'Dental Materials', year: 2022, category: 'regen', doi: '10.1016/j.dental.2022.06.025' },
  { title: 'Pandemic preparedness and response: a foldable tent to safely remove contaminated dental aerosols', authors: 'Rosa V., Agarwalla S.V., Tan B.L., Choo S.Y., Sim Y.F., Boey F.Y.C., Anantharaman S., Duggal M.S., Tan K.S.', venue: 'Applied Sciences', year: 2022, category: 'ai', doi: '10.3390/app12157409' },
  { title: 'RoBDEMAT: a risk of bias tool and guideline to support reporting of pre-clinical dental materials research and assessment of systematic reviews', authors: 'Delgado A.H., Sauro S., Lima A.F., Loguercio A.D., Della Bona A., Mazzoni A., Collares F.M., Staxrud F., Ferracane J., Tsoi J., Amato J., Neuhaus K.W., Ceballos L., Breschi L., Hanning M., Melo M.A., Özcan M., Scotti N., Opdam N., Yamaguchi S., Paris S., Turkun L.S., Doméjean S., Rosa V., Palin W., Schwendicke F.', venue: 'Journal of Dentistry', year: 2022, category: 'ai', doi: '10.1016/j.jdent.2022.104350' },
  { title: 'SMART: silver diamine fluoride reduces microtensile bond strength of glass ionomer cement to sound and artificial caries-affected dentin', authors: 'Khor M.M.-Y., Rosa V., Sim C.J., Hong C.H.L., Hu S.', venue: 'Dental Materials Journal', year: 2022, category: 'bio', doi: '10.4012/dmj.2021-319' },

  /* ── 2021 ───────────────────────────────────────────────── */
  { title: 'Induced pluripotent stem cell-derived odontoblasts for disease modeling, drug development, and craniofacial applications', authors: 'Rosa V.', venue: 'Current Progress in iPSC-derived Cell Types', year: 2021, category: 'regen', doi: '10.1016/B978-0-12-823884-4.00013-4' },
  { title: 'Fighting viruses with materials science and artificial intelligence', authors: 'Rosa V., Ho D., Sabino-Silva R., Siqueira W.L., Silikas N.', venue: 'Dental Materials', year: 2021, category: 'ai', doi: '10.1016/j.dental.2020.12.004' },
  { title: 'Persistent inhibition of Candida albicans biofilm and hyphae growth on titanium by graphene nanocoating', authors: 'Agarwalla S.V., Ellepola K., Silikas N., Castro Neto A.H., Seneviratne C.J., Rosa V.', venue: 'Dental Materials', year: 2021, category: 'bio', doi: '10.1016/j.dental.2020.11.028' },
  { title: 'Graphene nanocoating provides superb long-lasting corrosion protection to titanium alloy', authors: 'Malhotra R., Han Y., Nijhuis C.A., Silikas N., Castro Neto A.H., Rosa V.', venue: 'Dental Materials', year: 2021, category: 'bio', doi: '10.1016/j.dental.2021.08.004' },
  { title: 'Pulsed electromagnetic fields synergize with graphene to enhance dental pulp stem cell-derived motor neurogenesis by targeting TRPC1 channel', authors: 'Madanagopal T.T., Tai Y.K., Lim S.H., Fong C.H.H., Cao T., Rosa V., Franco-Obregón A.', venue: 'European Cells and Materials', year: 2021, category: 'regen', doi: '10.22203/eCM.v041a16' },
  { title: 'Two-photon fluorescence microscopy and applications in angiogenesis and related molecular events', authors: 'Lee M., Kannan S., Muniraj G., Rosa V., Lu W.F., Fuh J.Y.H., Sriram G., Cao T.', venue: 'Tissue Engineering Part B: Reviews', year: 2021, category: 'ai', doi: '10.1089/ten.TEB.2021.0140' },
  { title: 'Characterization, antimicrobial effects, and cytocompatibility of a root canal sealer produced by pozzolan reaction between calcium hydroxide and silica', authors: 'Kim M.-A., Rosa V., Neelakantan P., Hwang Y.-C., Min K.-S.', venue: 'Materials', year: 2021, category: 'bio', doi: '10.3390/ma14112863' },
  { title: 'Mechanical properties and in vitro cytocompatibility of dense and porous Ti-6Al-4V ELI manufactured by selective laser melting technology for biomedical applications', authors: 'Suresh S., Sun C.-N., Tekumalla S., Rosa V., Ling Nai S.M., Wong R.C.W.', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2021, category: 'bio', doi: '10.1016/j.jmbbm.2021.104712' },

  /* ── 2020 ───────────────────────────────────────────────── */
  { title: 'Characterization of Enterococcus faecalis in different culture conditions', authors: 'Kim M.-A., Rosa V., Min K.-S.', venue: 'Scientific Reports', year: 2020, category: 'bio', doi: '10.1038/s41598-020-78998-5' },
  { title: 'Combined effect of melittin and DNase on Enterococcus faecalis biofilms and its susceptibility to sodium hypochlorite', authors: 'Ramaraj S., Kim M.-A., Rosa V., Neelakantan P., Shon W.-J., Min K.-S.', venue: 'Materials', year: 2020, category: 'bio', doi: '10.3390/MA13173740' },
  { title: 'Main and accessory canal filling quality of a premixed calcium silicate endodontic sealer according to different obturation techniques', authors: 'Ko S.-Y., Choi H.W., Jeong E.-D., Rosa V., Hwang Y.-C., Yu M.-K., Min K.-S.', venue: 'Materials', year: 2020, category: 'bio', doi: '10.3390/ma13194389' },
  { title: 'Novel materials and therapeutic strategies against the infection of implants', authors: 'Agarwalla S.V., Solomon A.P., Neelakantan P., Rosa V.', venue: 'Emergent Materials', year: 2020, category: 'bio', doi: '10.1007/s42247-020-00117-x' },
  { title: 'Osteogenic potential of graphene coated titanium is independent of transfer technique', authors: 'Dubey N., Morin J.L.P., Luong-Van E.K., Agarwalla S.V., Silikas N., Castro Neto A.H., Rosa V.', venue: 'Materialia', year: 2020, category: 'regen', doi: '10.1016/j.mtla.2020.100604' },
  { title: 'Polymer Nanocomposites Based on Poly(ε-caprolactone), Hydroxyapatite and Graphene Oxide', authors: 'Medeiros G.S., Muñoz P.A.R., de Oliveira C.F.P., da Silva L.C.E., Malhotra R., Gonçalves M.C., Rosa V., Fechine G.J.M.', venue: 'Journal of Polymers and the Environment', year: 2020, category: 'bio', doi: '10.1007/s10924-019-01613-w' },
  { title: 'Potential applications of graphene-based nanomaterials in biomedical, dental, and implant applications', authors: 'Rokaya D., Srimaneepong V., Thunyakitpisal P., Qin J., Rosa V., Sapkota J.', venue: 'Advances in Dental Implantology using Nanomaterials and Allied Technology Applications', year: 2020, category: 'bio', doi: '10.1007/978-3-030-52207-0_4' },
  { title: 'Sodium Hypochlorite Treatment Post-Etching Improves the Bond Strength of Resin-Based Sealant to Hypomineralized Enamel by Removing Surface Organic Content', authors: 'Yang Q.N., Rosa V., Hong C.H.L., Tan H.X.M., Hu S.', venue: 'Pediatric dentistry', year: 2020, category: 'bio' },
  { title: 'Inhibiting corrosion of biomedical Ti-6Al-4V alloys with graphene nanocoating', authors: 'Malhotra R., Han Y.M., Morin J.L.P., Luong-Van E.K., Chew R.J.J., Castro Neto A.H., Nijhuis C.A., Rosa V.', venue: 'Journal of Dental Research', year: 2020, category: 'bio', doi: '10.1177/0022034519897003' },
  { title: 'Mechanisms of graphene influence on cell differentiation', authors: 'Luong-Van E.K., Madanagopal T.T., Rosa V.', venue: 'Materials Today Chemistry', year: 2020, category: 'bio', doi: '10.1016/j.mtchem.2020.100250' },
  { title: 'Biomechanics of alloplastic mandible reconstruction using biomaterials: The effect of implant design on stress concentration influences choice of material', authors: 'Prasadh S., Suresh S., Hong K.L., Bhargav A., Rosa V., Wong R.C.W.', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2020, category: 'bio', doi: '10.1016/j.jmbbm.2019.103548' },
  { title: 'Effect of a calcium hydroxide-based intracanal medicament containing N-2-methyl pyrrolidone as a vehicle against Enterococcus faecalis biofilm', authors: 'Kim T., Kim M.-A., Hwang Y.-C., Rosa V., Del Fabbro M., Min K.-S.', venue: 'Journal of Applied Oral Sciences', year: 2020, category: 'regen', doi: '10.1590/1678-7757-2019-0516' },

  /* ── 2019 ───────────────────────────────────────────────── */
  { title: 'Antibiotics Used in Regenerative Endodontics Modify Immune Response of Macrophages to Bacterial Infection', authors: 'Tan E.E., Quah S.Y., Bergenholtz G., Rosa V., Hoon Yu V.S., Tan K.S.', venue: 'Journal of Endodontics', year: 2019, category: 'regen', doi: '10.1016/j.joen.2019.08.001' },
  { title: 'Graphene to improve the physicomechanical properties and bioactivity of the cements', authors: 'Rosa V., Rodríguez-Lozano F.J., Min K.', venue: 'Advanced Dental Biomaterials', year: 2019, category: 'bio', doi: '10.1016/B978-0-08-102476-8.00022-0' },
  { title: 'Graphene-induced osteogenic differentiation is mediated by the integrin/FAK axis', authors: 'Xie H., Cao T., Franco-Obregón A., Rosa V.', venue: 'International Journal of Molecular Sciences', year: 2019, category: 'regen', doi: '10.3390/ijms20030574' },
  { title: 'Hydrophobicity of graphene as a driving force for inhibiting biofilm formation of pathogenic bacteria and fungi', authors: 'Agarwalla S.V., Ellepola K., Costa M.C.F.D., Fechine G.J.M., Morin J.L.P., Castro Neto A.H., Seneviratne C.J., Rosa V.', venue: 'Dental Materials', year: 2019, category: 'bio', doi: '10.1016/j.dental.2018.09.016' },
  { title: 'Role of extracellular dna in enterococcus faecalis biofilm formation and its susceptibility to sodium hypochlorite', authors: 'Yu M.-K., Kim M.-A., Rosa V., Hwang Y.-C., Del Fabbro M., Sohn W.-J., Min K.-S.', venue: 'Journal of Applied Oral Science', year: 2019, category: 'bio', doi: '10.1590/1678-7757-2018-0699' },
  { title: 'Translucency, hardness and strength parameters of PMMA resin containing graphene-like material for CAD/CAM restorations', authors: 'Agarwalla S.V., Malhotra R., Rosa V.', venue: 'Journal of the Mechanical Behavior of Biomedical Materials', year: 2019, category: 'bio', doi: '10.1016/j.jmbbm.2019.103388' },
  { title: 'Comparative study of different induction protocols for neural differentiation of human dental pulp stem cell in vitro', authors: 'Madanagopal T.T., Franco-Obregón A., Rosa V.', venue: 'Archives of Oral Biology', year: 2019, category: 'regen', doi: '10.1016/j.archoralbio.2019.104572' },
  {
    title: 'Taguchi methods to optimize the properties and bioactivity of 3D printed polycaprolactone/mineral trioxide aggregate scaffold: theoretical predictions and experimental validation',
    authors: 'Bhargav A., Min K.-S., Wen Feng L., Fuh J.Y.H., Rosa V.',
    venue: 'Journal of Biomedical Materials Research Part B', year: 2020, category: 'ai',
    featured: true, badge: 'Design of experiments',
    doi: '10.1002/jbm.b.34417',
    spotlight: 'publications/taguchi-pcl-mta-scaffold.html',
    thumb: 'assets/spotlights/taguchi-pcl-mta-scaffold/card.png',
    summary: 'A Taguchi design-of-experiments approach optimized a 3D-printed PCL/MTA scaffold with a fraction of the experiments — revealing composition as the dominant factor for bioactivity.',
  },

  /* ── 2018 ── */
  { title: 'Applications of additive manufacturing in dentistry: A review', authors: 'Bhargav A., Sanjairaj V., Rosa V., Feng L.W., Fuh YH J.', venue: 'Journal of Biomedical Materials Research - Part B Applied Biomaterials', year: 2018, category: 'ai', doi: '10.1002/jbm.b.33961' },
  { title: 'Carbon nanocomposites for implant dentistry and bone tissue engineering', authors: 'Madanagopal T.T., Agarwalla S.V., Rosa V.', venue: 'Applications of Nanocomposite Materials in Dentistry', year: 2018, category: 'regen', doi: '10.1016/B978-0-12-813742-0.00003-1' },
  { title: 'Effect of staining beverages on color and translucency of CAD/CAM composites', authors: 'Quek S.H.Q., Yap A.U.J., Rosa V., Tan K.B.C., Teoh K.H.', venue: 'Journal of Esthetic and Restorative Dentistry', year: 2018, category: 'bio', doi: '10.1111/jerd.12359' },
  { title: 'Enhanced Skin Permeation of Anti-wrinkle Peptides via Molecular Modification', authors: 'Lim S.H., Sun Y., Madanagopal Thiruvallur T., Rosa V., Kang L.', venue: 'Scientific Reports', year: 2018, category: 'bio', doi: '10.1038/s41598-017-18454-z' },
  { title: 'Graphene onto medical grade titanium: an atom-thick multimodal coating that promotes osteoblast maturation and inhibits biofilm formation from distinct species', authors: 'Dubey N., Ellepola K., Decroix F.E.D., Morin J.L.P., Castro Neto A.H., Seneviratne C.J., Rosa V.', venue: 'Nanotoxicology', year: 2018, category: 'bio', doi: '10.1080/17435390.2018.1434911' },
  { title: 'Optimization of surface scaffold morphology and structure using Taguchi’s design of experiments', authors: 'Bhargav A., Rosa V., Feng L.W., Fuh J.Y.H.', venue: 'Frontiers in Biomedical Devices, BIOMED - 2018 Design of Medical Devices Conference, DMD 2018', year: 2018, category: 'ai', doi: '10.1115/DMD2018-6813' },
  { title: 'Root Canal Filling Quality of a Premixed Calcium Silicate Endodontic Sealer Applied Using Gutta-percha Cone-mediated Ultrasonic Activation', authors: 'Kim J.-A., Hwang Y.-C., Rosa V., Yu M.-K., Lee K.-W., Min K.-S.', venue: 'Journal of Endodontics', year: 2018, category: 'bio', doi: '10.1016/j.joen.2017.07.023' },
  { title: 'Thermo-setting glass ionomer cements promote variable biological responses of human dental pulp stem cells', authors: 'Collado-González M., Pecci-Lloret M.R., Tomás-Catalá C.J., García-Bernal D., Oñate-Sánchez R.E., Llena C., Forner L., Rosa V., Rodríguez-Lozano F.J.', venue: 'Dental Materials', year: 2018, category: 'regen', doi: '10.1016/j.dental.2018.03.015' },

  /* ── 2017 ── */
  { title: 'Behaviour of human dental pulp cells cultured in a collagen hydrogel scaffold cross-linked with cinnamaldehyde', authors: 'Kwon Y.S., Lee S.H., Hwang Y.C., Rosa V., Lee K.W., Min K.S.', venue: 'International Endodontic Journal', year: 2017, category: 'regen', doi: '10.1111/iej.12592' },
  { title: 'CVD graphene transfer procedure to the surface of stainless steel for stem cell proliferation', authors: 'Rodriguez C.L.C., Kessler F., Dubey N., Rosa V., Fechine G.J.M.', venue: 'Surface and Coatings Technology', year: 2017, category: 'regen', doi: '10.1016/j.surfcoat.2016.12.111' },
  { title: 'CVD-grown monolayer graphene induces osteogenic but not odontoblastic differentiation of dental pulp stem cells', authors: 'Xie H., Chua M., Islam I., Bentini R., Cao T., Viana-Gomes J.C., Castro Neto A.H., Rosa V.', venue: 'Dental Materials', year: 2017, category: 'regen', doi: '10.1016/j.dental.2016.09.030' },
  { title: 'Effect of needle diameter on scaffold morphology and strength in E-Jetted polycaprolactone scaffolds', authors: 'Bhargav A., Feng L.W., Rosa V., Fuh J.Y.H.', venue: 'ASME 2017 12th International Manufacturing Science and Engineering Conference, MSEC 2017 collocated with the JSME/ASME 2017 6th International Conference on Materials and Processing', year: 2017, category: 'bio', doi: '10.1115/MSEC20172989' },
  { title: 'Effects of Epigallocatechin Gallate, an Antibacterial Cross-linking Agent, on Proliferation and Differentiation of Human Dental Pulp Cells Cultured in Collagen Scaffolds', authors: 'Kwon Y.-S., Kim H.-J., Hwang Y.-C., Rosa V., Yu M.-K., Min K.-S.', venue: 'Journal of Endodontics', year: 2017, category: 'regen', doi: '10.1016/j.joen.2016.10.017' },
  { title: 'Graphene for the development of the next-generation of biocomposites for dental and medical applications', authors: 'Xie H., Cao T., Rodríguez-Lozano F.J., Luong-Van E.K., Rosa V.', venue: 'Dental Materials', year: 2017, category: 'bio', doi: '10.1016/j.dental.2017.04.008' },
  { title: 'Graphene nanosheets to improve physico-mechanical properties of bioactive calcium silicate cements', authors: 'Dubey N., Rajan S.S., Bello Y.D., Min K.-S., Rosa V.', venue: 'Materials', year: 2017, category: 'bio', doi: '10.3390/ma10060606' },
  { title: 'Graphene transfer to 3-dimensional surfaces: A vacuum-assisted dry transfer method', authors: 'Morin J.L.P., Dubey N., Decroix F.E.D., Luong-Van E.K., Neto A.H.C., Rosa V.', venue: '2D Materials', year: 2017, category: 'bio', doi: '10.1088/2053-1583/aa6530' },
  { title: 'Streptococcus mutans forms xylitol-resistant biofilm on excess adhesive flash in novel ex-vivo orthodontic bracket model', authors: 'Ho C.S.F., Ming Y., Foong K.W.C., Rosa V., Thuyen T., Seneviratne C.J.', venue: 'American Journal of Orthodontics and Dentofacial Orthopedics', year: 2017, category: 'bio', doi: '10.1016/j.ajodo.2016.09.017' },

  /* ── 2016 ── */
  { title: 'Dental Stem Cells for Pulp Regeneration', authors: 'Dubey N., Min K.-S., Rosa V.', venue: 'Stem Cell Biology and Regenerative Medicine', year: 2016, category: 'regen', doi: '10.1007/978-3-319-33299-4_8' },
  { title: 'Effects of chrondro-osseous regenerative compound associated with local treatments in the regeneration of bone defects around implants: an in vivo study', authors: 'Tonetto A., Lago P.W., Borba M., Rosa V.', venue: 'Clinical Oral Investigations', year: 2016, category: 'regen', doi: '10.1007/s00784-015-1509-1' },
  { title: 'Fabrication and evaluation of electrohydrodynamic jet 3D printed polycaprolactone/chitosan cell carriers using human embryonic stem cell-derived fibroblasts', authors: 'Wu Y., Sriram G., Fawzy A.S., Fuh J.Y.H., Rosa V., Cao T., Wong Y.S.', venue: 'Journal of Biomaterials Applications', year: 2016, category: 'regen', doi: '10.1177/0885328216652537' },
  { title: 'Fabrication of dentin-like scaffolds through combined 3D printing and bio-mineralisation', authors: 'Wu Y., Azmi D.F.B., Rosa V., Fawzy A.S., Fuh J.Y.H., Wong Y.S., Lu W.F.', venue: 'Cogent Engineering', year: 2016, category: 'regen', doi: '10.1080/23311916.2016.1222777' },
  { title: 'Graphene oxide-based substrate: physical and surface characterization, cytocompatibility and differentiation potential of dental pulp stem cells', authors: 'Rosa V., Xie H., Dubey N., Madanagopal T.T., Rajan S.S., Morin J.L.P., Islam I., Castro Neto A.H.', venue: 'Dental Materials', year: 2016, category: 'regen', doi: '10.1016/j.dental.2016.05.008' },
  { title: 'Graphene: An emerging carbon nanomaterial for bone tissue engineering', authors: 'Dubey N., Decroix F.E.D., Rosa V.', venue: 'Carbon Nanostructures', year: 2016, category: 'regen', doi: '10.1007/978-3-319-45639-3_5' },
  { title: 'In Vitro Osteogenic Potential of Green Fluorescent Protein Labelled Human Embryonic Stem Cell-Derived Osteoprogenitors', authors: 'Islam I., Sriram G., Li M., Zou Y., Li L., Handral H.K., Rosa V., Cao T.', venue: 'Stem Cells International', year: 2016, category: 'regen', doi: '10.1155/2016/1659275' },
  { title: 'Pluripotency of Stem Cells from Human Exfoliated Deciduous Teeth for Tissue Engineering', authors: 'Rosa V., Dubey N., Islam I., Min K.-S., Nör J.E.', venue: 'Stem Cells International', year: 2016, category: 'regen', doi: '10.1155/2016/5957806' },
  { title: 'Pluripotent stem cells: An in vitro model for nanotoxicity assessments', authors: 'Handral H.K., Tong H.J., Islam I., Sriram G., Rosa V., Cao T.', venue: 'Journal of Applied Toxicology', year: 2016, category: 'regen', doi: '10.1002/jat.3347' },
  { title: 'Reliability, failure probability, and strength of resin-based materials for CAD/CAM restorations', authors: 'Lim K., Yap A.U., Agarwalla S.V., Tan K.B., Rosa V.', venue: 'Journal of Applied Oral Science', year: 2016, category: 'bio', doi: '10.1590/1678-775720150561' },
  { title: 'Tooth discoloration induced by a novel mineral trioxide aggregate-based root canal sealer', authors: 'Lee D.-S., Lim M.-J., Choi Y., Rosa V., Hong C.-U., Min K.-S.', venue: 'European Journal of Dentistry', year: 2016, category: 'bio', doi: '10.4103/1305-7456.184165' },

  /* ── 2015 ───────────────────────────────────────────────── */
  { title: 'Fatigue stipulation of bulk-fill composites: An in vitro appraisal', authors: 'Vidhawan S.A., Yap A.U., Ornaghi B.P., Banas A., Banas K., Neo J.C., Pfeifer C.S., Rosa V.', venue: 'Dental Materials', year: 2015, category: 'bio', doi: '10.1016/j.dental.2015.06.006' },
  { title: 'Graphene: A Versatile Carbon-Based Material for Bone Tissue Engineering', authors: 'Dubey N., Bentini R., Islam I., Cao T., Castro Neto A.H., Rosa V.', venue: 'Stem Cells International', year: 2015, category: 'regen', doi: '10.1155/2015/804213' },
  { title: 'Modulation of Dental Pulp Stem Cell Odontogenesis in a Tunable PEG-Fibrinogen Hydrogel System', authors: 'Lu Q., Pandya M., Rufaihah A.J., Rosa V., Tong H.J., Seliktar D., Toh W.S.', venue: 'Stem Cells International', year: 2015, category: 'regen', doi: '10.1155/2015/525367' },
  {
    title: 'Two and three-dimensional graphene substrates to magnify osteogenic differentiation of periodontal ligament stem cells',
    authors: 'Xie H., Cao T., Gomes J.V., Castro Neto A.H., Rosa V.',
    venue: 'Carbon', year: 2015, category: 'bio',
    doi: '10.1016/j.carbon.2015.05.071',
    spotlight: 'publications/graphene-2d-3d-osteogenic.html',
    thumb: 'assets/spotlights/graphene-2d-3d-osteogenic/card.png',
  },
  { title: 'Bioactivity, physical and chemical properties of MTA mixed with propylene glycol', authors: 'Natu V.P., Dubey N., Loke G.C.L., Tan T.S., Ng W.H., Yong C.W., Cao T., Rosa V.', venue: 'Journal of Applied Oral Sciences', year: 2015, category: 'regen', doi: '10.1590/1678-775720150084' },

  /* ── 2014 ───────────────────────────────────────────────── */
  { title: 'Structural reinforcement and sealing ability of temporary fillings in premolar with class II mod cavities', authors: 'Bello Y.D., Barbizam J.V., Rosa V.', venue: 'The journal of contemporary dental practice', year: 2014, category: 'bio', doi: '10.5005/jp-journals-10024-1489' },
  { title: 'Inducing pluripotency for disease modeling, drug development and craniofacial applications', authors: 'Rosa V., Toh W.S., Cao T., Shim W.', venue: 'Expert Opinion on Biological Therapy', year: 2014, category: 'regen', doi: '10.1517/14712598.2014.915306' },

  /* ── 2013 ───────────────────────────────────────────────── */
  { title: 'What and where are the stem cells for Dentistry?', authors: 'Rosa V.', venue: 'Singapore dental journal', year: 2013, category: 'regen', doi: '10.1016/j.sdj.2013.11.003' },
  { title: 'Dental pulp tissue engineering in full-length root canals', authors: 'Rosa V., Zhang Z., Grande R.H.M., Nör J.E.', venue: 'Journal of Dental Research', year: 2013, category: 'regen', doi: '10.1177/0022034513505772' },

  /* ── 2012 ───────────────────────────────────────────────── */
  { title: 'Subcritical crack growth and in vitro lifetime prediction of resin composites with different filler distributions', authors: 'Ornaghi B.P., Meier M.M., Rosa V., Cesar P.F., Lohbauer U., Braga R.R.', venue: 'Dental Materials', year: 2012, category: 'bio', doi: '10.1016/j.dental.2012.05.001' },
  { title: 'Tissue engineering: from research to dental clinics', authors: 'Rosa V., Della Bona A., Cavalcanti B.N., Nör J.E.', venue: 'Dental Materials', year: 2012, category: 'regen', doi: '10.1016/j.dental.2011.11.025' },

  /* ── 2011 ── */
  { title: 'Effect of ion exchange on R-curve behavior of a dental porcelain', authors: 'Cesar P.F., Rosa V., Pinto M.M., Yoshimura H.N., Xu L.R.', venue: 'Journal of Materials Science', year: 2011, category: 'bio', doi: '10.1007/s10853-010-4858-9' },
  { title: 'Effect of Test Environment and Microstructure on the Flexural Strength of Dental Porcelains', authors: 'Rosa V., Cesar P.F., Pereira C.F.S., Pinto M.M., Yoshimura H.N.', venue: 'Journal of Prosthodontics', year: 2011, category: 'bio', doi: '10.1111/j.1532-849X.2011.00711.x' },
  { title: 'Regenerative endodontics in light of the stem cell paradigm', authors: 'Rosa V., Botero T.M., Nör J.E.', venue: 'International Dental Journal', year: 2011, category: 'regen', doi: '10.1111/j.1875-595X.2011.00026.x' },

  /* ── 2010 ── */
  { title: 'Are flowable resin-based composites a reliable material for metal orthodontic bracket bonding?', authors: 'Pick B., Rosa V., Azeredo T.R., Filho E.A.M.C., Miranda Júnior W.G.', venue: 'Journal of Contemporary Dental Practice', year: 2010, category: 'bio', doi: '10.5005/jcdp-11-4-17' },
  { title: 'Effect of ion-exchange temperature on mechanical properties of a dental porcelain', authors: 'Rosa V., Fredericci C., Moreira M.F., Yoshimura H.N., Cesar P.F.', venue: 'Ceramics International', year: 2010, category: 'bio', doi: '10.1016/j.ceramint.2010.05.007' },

  /* ── 2009 ── */
  { title: 'Effect of ion exchange on strength and slow crack growth of a dental porcelain', authors: 'Rosa V., Yoshimura H.N., Pinto M.M., Fredericci C., Cesar P.F.', venue: 'Dental Materials', year: 2009, category: 'bio', doi: '10.1016/j.dental.2008.12.009' },
  { title: 'Visual and instrumental agreement in dental shade selection: Three distinct observer populations and shade matching protocols', authors: 'Della Bona A., Barrett A.A., Rosa V., Pinzetta C.', venue: 'Dental Materials', year: 2009, category: 'bio', doi: '10.1016/j.dental.2008.09.006' },

  /* ── 2008 ── */
  { title: 'Influence of pH on slow crack growth of dental porcelains', authors: 'Pinto M.M., Cesar P.F., Rosa V., Yoshimura H.N.', venue: 'Dental Materials', year: 2008, category: 'bio', doi: '10.1016/j.dental.2007.10.001' },

  /* ── 2007 ── */
  { title: 'Effect of acid etching of glass ionomer cement surface on the microleakage of sandwich restorations', authors: 'Della Bona Á., Pinzetta C., Rosa V.', venue: 'Journal of Applied Oral Science', year: 2007, category: 'bio', doi: '10.1590/s1678-77572007000300014' },
  { title: 'Influence of shade and irradiation time on the hardness of composite resins', authors: 'Della Bona Á., Rosa V., Cecchetti D.', venue: 'Brazilian Dental Journal', year: 2007, category: 'bio', doi: '10.1590/S0103-64402007000300010' },
];
