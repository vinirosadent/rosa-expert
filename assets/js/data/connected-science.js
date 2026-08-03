/* ============================================================
   connected-science.js — data source for connected-science.html
   ------------------------------------------------------------
   TODO: ALL ENTRIES BELOW ARE NEUTRAL PLACEHOLDERS.
   Nothing here is real content. Replace every field before the
   page goes live. Do not ship "Institution 01" to production.

   Shape:
     exchangeInstitutions[]      { institutionName, country, logo?, url?, displayOrder }
     collaborationInstitutions[] { institutionName, country, logo?, url?, displayOrder }
     stories[]                   { id, title, collaboratorName, collaboratorRole,
                                   institution, country, portrait?, imageAlt?,
                                   relationshipOrigin, workBuilt, publicationOutcome,
                                   whatContinues, publications[], secondaryImage?, caption? }

   Order is respected as written — the page never sorts.
   An institution MAY appear in both lists; that repetition is intentional.
   ============================================================ */

window.connectedScienceData = {

  /* ---- Exchange -------------------------------------------------- */
  exchangeLead:
    'Students, fellows and researchers have joined the lab in Singapore, bringing ' +
    'knowledge, expertise and new perspectives for a shared vision.',

  exchangeInstitutions: [
    /* Real list from Vinicius (2026-08-02), display order as given.
       Full English names carry the line; the acronym stays where it IS
       the recognisable brand.
       TODO: Temasek Polytechnic name flagged by Vinicius as "conferir".

       Crests are the OFFICIAL marks Vinicius supplied (2026-08-02), background-
       keyed and cropped to the ink only — never redrawn. Every crest renders
       at the SAME height (see .cs-inst-logo in connected-science.html, height
       anchored to UNESP's own crest per Vinicius, 2026-08-03); width is free,
       set by each file's own aspect ratio. No per-item sizing lives in this
       data anymore — a prior per-list bounding-box-area formula gave the same
       UNESP file two different sizes depending on which list it appeared in
       and read as a bug. */
    { institutionName: 'S\u00e3o Paulo State University (UNESP)', country: 'Brazil', logo: 'assets/connected-science/logos/crest/unesp-crest.png', url: null, displayOrder: 1 },
    { institutionName: 'Universitas Padjadjaran', country: 'Indonesia', logo: 'assets/connected-science/logos/crest/unpad-crest.png', url: null, displayOrder: 2 },
    { institutionName: 'Federal University of Pelotas (UFPel)', country: 'Brazil', logo: 'assets/connected-science/logos/crest/ufpel-crest.png', url: null, displayOrder: 3 },
    { institutionName: 'University of Campinas (UNICAMP)', country: 'Brazil', logo: 'assets/connected-science/logos/crest/unicamp-crest.png', url: null, displayOrder: 4 },
    { institutionName: 'Chulalongkorn University', country: 'Thailand', logo: 'assets/connected-science/logos/crest/chula-crest.png', url: null, displayOrder: 5 },
    { institutionName: 'Mahidol University', country: 'Thailand', logo: 'assets/connected-science/logos/crest/mahidol-crest.png', url: null, displayOrder: 6 },
    { institutionName: 'Nihon University', country: 'Japan', logo: 'assets/connected-science/logos/crest/nihon-crest.png', url: null, displayOrder: 7 },
    { institutionName: 'University of Otago', country: 'New Zealand', logo: 'assets/connected-science/logos/crest/otago-crest.png', url: null, displayOrder: 8 },
    { institutionName: 'Temasek Polytechnic', country: 'Singapore', logo: 'assets/connected-science/logos/crest/temasek-crest.png', url: null, displayOrder: 9 },
    { institutionName: 'Singapore Polytechnic', country: 'Singapore', logo: 'assets/connected-science/logos/crest/sp-crest.png', url: null, displayOrder: 10 },
    { institutionName: 'Nanyang Polytechnic', country: 'Singapore', logo: 'assets/connected-science/logos/crest/nyp-crest.png', url: null, displayOrder: 11 },
  ],

  /* ---- Collaborations -------------------------------------------- */
  collaborationsLead:
    'Some of these collaborations with institutions abroad span many years, ' +
    'producing joint publications and continued research.',

  collaborationInstitutions: [
    /* Real list from Vinicius (2026-08-02, Michigan added 2026-08-03),
       order as given. Chulalongkorn and Padjadjaran/UNESP crests are the
       same official files already used in Exchange — repetition across
       the two lists is intentional (see file header), and they now render
       at the SAME height there too (see the Exchange comment above —
       height is a single global CSS value, not a per-list computation).
       Manchester's source had a white backdrop outside the shield
       silhouette, keyed out by flood-fill from the corners; Jeonbuk's seal
       already carried a transparent background; Michigan's seal was the
       same white-square case as Manchester/Otago, same flood-fill
       treatment. Six items on a 3-column grid (.cs-inst-grid--collab)
       lands exactly 3+3 — no last-row centring needed, unlike the
       previous 5-item 3+2. */
    { institutionName: 'University of Manchester', country: 'United Kingdom', logo: 'assets/connected-science/logos/crest/manchester-crest.png', url: null, displayOrder: 1 },
    { institutionName: 'Chulalongkorn University', country: 'Thailand', logo: 'assets/connected-science/logos/crest/chula-crest.png', url: null, displayOrder: 2 },
    { institutionName: 'Jeonbuk National University', country: 'South Korea', logo: 'assets/connected-science/logos/crest/jeonbuk-crest.png', url: null, displayOrder: 3 },
    { institutionName: 'University of Michigan', country: 'United States', logo: 'assets/connected-science/logos/crest/michigan-crest.png', url: null, displayOrder: 4 },
    { institutionName: 'Universitas Padjadjaran', country: 'Indonesia', logo: 'assets/connected-science/logos/crest/unpad-crest.png', url: null, displayOrder: 5 },
    { institutionName: 'São Paulo State University (UNESP)', country: 'Brazil', logo: 'assets/connected-science/logos/crest/unesp-crest.png', url: null, displayOrder: 6 },
  ],

  /* ---- Work built together --------------------------------------- */
  storiesLead:
    'Selected stories of people, shared questions and scientific work that continued ' +
    'to develop across institutions.',

  stories: [
    /* TODO placeholder — replace with real people, with permission for any image. */
    {
      id: 'story-01',
      title: 'Story title',
      collaboratorName: 'Collaborator name',
      collaboratorRole: 'Role',
      institution: 'Institution',
      country: 'Country',
      portrait: null,              /* TODO: 'assets/connected-science/<file>.jpg' */
      imageAlt: '',
      relationshipOrigin: 'How the scientific relationship began. Placeholder text standing in for the real account, kept long enough to show how a paragraph of this length behaves beside the image column of the lead block.',
      workBuilt: 'What was built together. Placeholder text describing the shared methods, materials or models that the two groups developed.',
      publicationOutcome: 'The publication or result that came out of the work. Placeholder text.',
      whatContinues: 'What continues to be developed. Placeholder text.',
      publications: [
        /* { publicationTitle: '', journal: '', year: '', doi: '', externalURL: '' } */
      ],
      secondaryImage: null,
      caption: null,
    },
    {
      id: 'story-02',
      title: 'Story title',
      collaboratorName: 'Collaborator name',
      collaboratorRole: 'Role',
      institution: 'Institution',
      country: 'Country',
      portrait: null,
      imageAlt: '',
      relationshipOrigin: 'How the scientific relationship began. Placeholder text.',
      workBuilt: 'What was built together. Placeholder text.',
      publicationOutcome: '',
      whatContinues: 'What continues to be developed. Placeholder text.',
      publications: [],
      secondaryImage: null,
      caption: null,
    },
    {
      /* This third fixture deliberately has NO image, to verify the
         typographic fallback (no generic avatar is ever drawn). */
      id: 'story-03',
      title: 'Story title',
      collaboratorName: 'Collaborator name',
      collaboratorRole: 'Role',
      institution: 'Institution',
      country: 'Country',
      portrait: null,
      imageAlt: '',
      relationshipOrigin: 'How the scientific relationship began. Placeholder text.',
      workBuilt: 'What was built together. Placeholder text.',
      publicationOutcome: 'The publication or result. Placeholder text.',
      whatContinues: '',
      publications: [
        { publicationTitle: 'Publication title placeholder', journal: 'Journal', year: 'Year', doi: '', externalURL: '' },
      ],
      secondaryImage: null,
      caption: null,
    },
  ],
};
