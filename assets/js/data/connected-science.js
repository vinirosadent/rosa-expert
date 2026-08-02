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
    'Students, fellows, researchers and staff have joined the lab in Singapore, ' +
    'bringing knowledge, methods and perspectives that become part of the work built here.',

  exchangeInstitutions: [
    /* TODO placeholder — replace with real institutions */
    { institutionName: 'Institution 01', country: 'Country', logo: null, url: null, displayOrder: 1 },
    { institutionName: 'Institution 02', country: 'Country', logo: null, url: null, displayOrder: 2 },
    { institutionName: 'Institution 03', country: 'Country', logo: null, url: null, displayOrder: 3 },
    { institutionName: 'Institution 04', country: 'Country', logo: null, url: null, displayOrder: 4 },
    { institutionName: 'Institution 05', country: 'Country', logo: null, url: null, displayOrder: 5 },
    { institutionName: 'Institution 06', country: 'Country', logo: null, url: null, displayOrder: 6 },
  ],

  /* ---- Collaborations -------------------------------------------- */
  collaborationsLead:
    'Long-standing scientific relationships across institutions bring together shared questions ' +
    'and complementary expertise, creating work that develops over time.',

  collaborationInstitutions: [
    /* TODO placeholder — replace with real institutions.
       Institution 02 is repeated on purpose: it exercises the case of one
       institution appearing in both areas. */
    { institutionName: 'Institution 07', country: 'Country', logo: null, url: null, displayOrder: 1 },
    { institutionName: 'Institution 02', country: 'Country', logo: null, url: null, displayOrder: 2 },
    { institutionName: 'Institution 08', country: 'Country', logo: null, url: null, displayOrder: 3 },
    { institutionName: 'Institution 09 with a deliberately long name for layout testing', country: 'Country', logo: null, url: null, displayOrder: 4 },
    { institutionName: 'Institution 10', country: 'Country', logo: null, url: null, displayOrder: 5 },
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
