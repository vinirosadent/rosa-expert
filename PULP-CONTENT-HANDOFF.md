# HANDOFF — Pulp Regeneration page · CONTENT building (for a fresh chat)

**Page:** `research/pulp-regeneration.html` on the rosa.expert site (A/P Vinicius Rosa, NUS Faculty of Dentistry).
**Status:** Fully built, styled, and integrated. Layout + design are DONE and approved. **Your job in the new chat is COPY/CONTENT only** — refine wording, simplify the still-technical sections toward the agreed voice, and (later) swap placeholder figures. **Do not redesign, restructure, or touch the CSS/JS beyond text.**
**Model note:** This chat was Opus; the new chat is Sonnet — so everything below is spelled out explicitly. Read §2 (rules) before editing anything.

---

## 1. What the page is
- A single self-contained file: `research/pulp-regeneration.html`. Sibling to `research/ai-living-lab.html`.
- **Look:** dark warm-charcoal `#120C0E` with a crimson/pink/amber "vascular" palette; fonts Playfair Display (headlines) + Inter (body) + IBM Plex Mono (labels); a scroll-linked animated vascular **canvas** background; scroll-reveal on sections.
- **Chrome = shared site system (identical to every site page):** it loads `../assets/css/tokens.css`, `../assets/css/components.css`, and `../assets/js/shared.js`, with all page content inside `<div id="app">`. That injects the global "Vinicius ROSA" header and the blue site footer, and sets the 1180px width. **Leave this wiring alone.**
- Images live in `research/assets/pulp/` (12 PNGs). They are **AI-generated placeholders** — fine for now; flag to the user before treating them as final; real histology/µCT/SEM come later.

---

## 2. CRITICAL RULES — read before you edit

### 2A. The Drive-mount NUL-corruption bug (this WILL bite you)
The Write/Edit file tools intermittently corrupt files on this Google Drive mount — they append NUL bytes or silently truncate. **The Read tool hides it (shows clean text).** So never trust a Write/Edit to the mount blind.

**Safe way to edit the page** — do string replacements with a Python script in the bash sandbox, write to `/tmp`, then `cp`:
```bash
cd <bash-mount>/rosa-expert          # e.g. /sessions/<id>/mnt/rosa-expert (session-specific!)
python3 <<'PY'
import io
f="research/pulp-regeneration.html"
t=io.open(f,encoding="utf-8").read()
reps=[
  ("EXACT OLD STRING","NEW STRING"),
]
miss=[o[:50] for o,_ in reps if o not in t]
for o,n in reps: t=t.replace(o,n,1)
if miss: print("MISS:",miss)          # if anything missed, DON'T ship — fix the old string
else:
    io.open(f,"w",encoding="utf-8").write(t)
    print("ok")
PY
# ALWAYS verify:
tr -cd '\000' < research/pulp-regeneration.html | wc -c     # must print 0
grep -c '</html>' research/pulp-regeneration.html           # must print 1
```
If a file ever shows NUL>0: `tr -d '\000' < FILE > /tmp/clean && cp /tmp/clean FILE` (NULs are appended/trailing, so stripping is lossless — but re-verify tag balance + `</html>`).

### 2B. CSS class names — never reuse the site's
The page loads the site CSS globally, so page-body classes must NOT collide with site classes. Five were renamed to a `vp*` namespace and MUST stay that way:
`.vpsec` (was .section), `.vpeye` (was .eyebrow), `.vpcard` (was .card), `.vpbtn` (was .btn), `.vpbiocap` (was .bio-body).
If you add any element, give it a unique class. **Never use** `.section .card .btn .eyebrow .container .bio-body .stat-*` (those belong to the site system and will restyle your content).

### 2C. Content integrity (project rule)
Don't invent data, numbers, links, dates, or citations. Only the **2 verified papers** in §5 may appear. Use placeholders and **ASK the user** when content is missing. Keep the science accurate.

---

## 3. VOICE & TONE (the whole point of the last round — keep it)
The user wants the page **grounded in regeneration**: elegant, warm, humble, plain-language, for a **general audience**.

**Do:** frame it as helping a tooth grow its own living pulp back, restoring blood supply and vitality "from within," using the tooth's own biology; position the lab as doing careful new work that helps people and advances science — **without over-claiming or putting anyone else down.**

**Avoid:** the word **"bioreactor"**; "innovation without limits"; "first / 1st globally"; "absolute innovators"; competition/"vs traditional" framing; and heavy jargon in prominent copy — **de novo, morphogenesis, lineage(-specific), iPSC-derived, spatiotemporal, anastomose, perfusion, hypoxia** (these can appear deeper down but should be introduced in plain words).

**Anchor examples already in the page (match this register):**
- H1: *"Helping the tooth grow its living pulp back."*
- Lead: *"When a tooth loses its pulp, it loses its blood supply and its ability to sense and protect itself. Our work is to grow that living tissue back inside the root — restoring the tooth from within, with its own biology, rather than simply sealing it."*
- Section 07 legend: *"A protected space → the tooth's own biology → living pulp restored."*
- Section 08 cards renamed to plain: "Dentin-building cells", "Blood-vessel cells", "Nerve-support cells".

Spelling: page uses **American** for the science term **"dentin"** (not "dentine"). Keep it consistent.

---

## 4. SECTION MAP + what still needs content work
Sections are numbered 01–13 in the visible eyebrow. Status legend: **[plain]** already rewritten in the new voice · **[tech]** still technical, candidate for simplification if the user wants.

| # | id | Eyebrow / H2 | Status | Notes for content |
|---|----|--------------|--------|-------------------|
| 01 | `#hero` | Manifesto — "Helping the tooth grow its *living pulp* back." | [plain] | Done. Rail legend + subnote + 2 CTAs rewritten. |
| — | (ticker) | — | REMOVED | Don't bring it back. |
| 02 | `#premise` | Premise — "Why a tooth needs its pulp *alive*." | [plain] | "The challenge" card + two "Our approach" cards. |
| 03 | `#sectional` | Sectional Logic — "Reading the canal from *dentin edge* to apex." | [tech] | 5 layer rows. Row 02 reworded; rest still technical ("directing polarity", "apical foramen", "hypoxic dead zones"). Candidate to simplify. Uses tooth-section.png. |
| — | (metrics band) | 6 numbers | [ok] | 28 d, 7 d, 5 factors, 3 germ layers, 15–20 mm, 2 scaffolds. "1st globally" was removed. Confirm these read humble. |
| 04 | `#materiality` | Materiality — "Matter in conversation with *life*." | [tech] | 6 image tiles (tex-*). Short captions. |
| 05 | `#protocol` | Reprogramming Protocol — "From a *banked cell* to tubular dentin." | [tech] | 6 steps, heavy jargon (iPSC, OCT4·SOX2·KLF4·LIN28·L-MYC, ALP·OCT4·TRA-1-60, DSPP·DMP1). **Prime candidate** for plain rewrite — ask user how technical to keep. |
| 06 | `#scaffolds` | Scaffold Systems — "The matrix decides *when* tissue forms." | [tech] | 3 cards: PLLA, Puramatrix, rhCollagen I + onset bars. |
| 07 | `#process` | How It Grows — "New tissue, grown *step by step*." | [plain] | Was "Active Bioreactor". 5 step tiles + legend, all rewritten. |
| 08 | `#lineage` | The Cells — "Three kinds of cell, one *living* tissue." | [plain] | 3 cards rewritten; marker lines kept as small detail. |
| 09 | `#characterization` | Characterization — "Judged by *coordinated* response…" | [tech] | 6 assay tiles. Candidate to simplify. |
| 10 | `#kinetics` | Kinetic Balance — "Degradation must meet *ingrowth*." | [tech] | Dual-curve SVG chart + caption. Candidate. |
| 11 | `#roadmap` | Roadmap — "From the bench toward the *chairside*." | [ok] | 5 rows Now/Next/Horizon. Mostly plain. |
| 12 | `#principles` | Key Spatial Principles — "Not a fill — a *living* thing." | [tech] | 6 dot-rows + pull-quote (footer now "Living tissue · Restored from within"). Row labels still jargony ("living architecture", "microchannels"). Candidate. |
| 13 | `#record` | Published Work — "Where this *began*." | [plain] | The **2 verified papers only** (see §5). Do NOT add more without PubMed verification. |
| — | footer | shared site footer | [ok] | Injected by shared.js. Don't hand-edit. |

**H2 accent pattern:** `<h2 class="h2">text <span class="ac">word</span> more.</h2>` — `.ac` = pink italic, `.ac-a` = amber italic. Keep one accented word per H2.

---

## 5. The ONLY publications allowed (verified on PubMed)
1. Xie H, Dubey N, Shim W, Ramachandra CJA, Min KS, Cao T, Rosa V. **"Functional Odontoblastic-Like Cells Derived from Human iPSCs."** *J Dent Res* 2018;97(1):77–83. DOI **10.1177/0022034517730026**.
2. Rosa V, Zhang Z, Grande RHM, Nör JE. **"Dental pulp tissue engineering in full-length human root canals."** *J Dent Res* 2013;92(11):970–5. DOI **10.1177/0022034513505772**.

The three "flagship" entries in the source `CONTENT.md` §Record were **deliberately excluded** (unpublished framing) — do not add them back. If the user wants more papers, verify each on PubMed first.

---

## 6. Where the source facts live (don't invent)
- Approved spec + all original copy/data: `Claude design/Research Program Pulp/` → `CONTENT.md` (verbatim copy & data arrays), `DESIGN_SPEC.md`, `TOKENS.md`, `BACKGROUND_ANIMATION.md`, 4 mood boards. Use `CONTENT.md` as the **fact source**, but the page's VOICE now intentionally departs from CONTENT.md's grander tone — **simplify, don't paste verbatim.**
- The two papers' abstracts (via PubMed) are the ground truth for what the science actually showed (SHED in Puramatrix/rhCollagen → pulp-like tissue + tubular dentin in full-length canals, 2013; DPSC→iPSC→odontoblast-like cells, tubular dentin at 28 d subcutaneously, 2018).

---

## 7. Suggested next content tasks (ask the user to pick)
1. **How far to simplify the [tech] sections** (03, 04, 05, 06, 09, 10, 12): full plain-language rewrite, or keep them as a "for the curious" technical layer below a plain intro? This is the main open decision.
2. Whether to **trim/merge** sections if the page feels long.
3. Real figures to replace the AI placeholder textures.
4. Optional: add a "Pulp" entry to the site nav / link a card from `research.html` (right now the shared nav highlights "Living Matter Engines" on this page and there's no dedicated Pulp item).

---

## 8. Verify-before-you-finish checklist (run in bash)
```bash
F=research/pulp-regeneration.html
tr -cd '\000' < $F | wc -c                       # 0
grep -c '</html>' $F                             # 1
grep -o '<section' $F | wc -l; grep -o '</section>' $F | wc -l   # equal (13/13)
grep -o '<div' $F | wc -l; grep -o '</div>' $F | wc -l           # equal
grep -oci 'bioreactor' $F                        # 0
grep -o 'assets/css/tokens.css\|assets/js/shared.js\|<div id="app">' $F   # all present
for a in $(grep -o 'assets/pulp/[A-Za-z0-9._-]*\.png' $F | sort -u); do test -f research/$a || echo "MISSING $a"; done
```
Then open the file in a browser to eyeball it (the vascular canvas only shows on a real page load).

---

## 9. Exact paths
- Page (canonical Windows path): `C:\Users\vinir\My Drive\Claude Projects\rosa-expert\research\pulp-regeneration.html`
- Assets: `...\rosa-expert\research\assets\pulp\`
- Shared chrome: `...\rosa-expert\assets\css\tokens.css`, `components.css`, `...\assets\js\shared.js`
- Source spec + mood boards: `...\rosa-expert\Claude design\Research Program Pulp\`
- In a NEW session the bash mount path is different (`/sessions/<new-id>/mnt/rosa-expert/…`) — request the `rosa-expert` folder first, then use bash for all edits per §2A.

*(This project also has persistent memory; the new chat should already carry a "Pulp Regeneration page" memory note summarizing the above.)*
