/* ============================================================
   shared.js — Header & Footer renderer
   Include this script on every page. It auto-detects whether
   the page is in a subdirectory (news/, publications/) and
   adjusts all href/src paths accordingly.
   ============================================================ */

(function () {
  'use strict';

  /* ── Path prefix ─────────────────────────────────────────── */
  // Detect if we're inside a subdirectory.
  // Works for both file:// and http:// serving.
  const path = window.location.pathname;
  const isSubdir = /\/(news|publications|research)\//.test(path);
  const base = isSubdir ? '../' : '';

  /* ── Active nav item ──────────────────────────────────────── */
  // Match the current page to a nav label
  function getActivePage() {
    const p = path.toLowerCase();
    if (/\/who\.html/.test(p))          return 'who';
    if (/\/publications(\/|\.html)/.test(p)) return 'publications';
    if (/\/news(\/|\.html)/.test(p))    return 'news';
    if (/\/contact\.html/.test(p))      return 'contact';
    if (/\/research\/pulp-research-pillars\.html/.test(p)) return 'pillars';
    if (/\/research(\/|\.html)/.test(p)) return 'research';
    return 'home';
  }
  const activePage = getActivePage();

  /* ── SVG icons ────────────────────────────────────────────── */
  const ICONS = {
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    scopus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path></svg>',
  };

  /* ── Nav items definition ─────────────────────────────────── */
  const NAV = [
    { id: 'home',         label: 'Home',     href: base + 'index.html' },
    { id: 'who',          label: 'Who',      href: base + 'who.html' },
    { id: 'research',     label: 'Living Matter Engines', href: base + 'research/ai-living-lab.html' },
    { id: 'pillars',      label: 'Pulp Pillars', href: base + 'research/pulp-research-pillars.html' },
    { id: 'publications', label: 'To read',  href: base + 'publications.html' },
    { id: 'news',         label: 'News',     href: base + 'news.html' },
    { id: 'contact',      label: 'Contact',  href: base + 'contact.html' },
  ];

  /* ── Render header ────────────────────────────────────────── */
  function renderHeader() {
    const navItems = NAV.map(n => {
      const active = n.id === activePage;
      return `<a class="nav-link${active ? ' active' : ''}" href="${n.href}">${n.label}</a>`;
    }).join('');

    const html = `
<header>
  <div class="header-inner">
    <a class="logo" href="${base}index.html">
      <span class="logo-top">Vinicius</span>
      <span class="logo-bottom">ROSA</span>
    </a>
    <nav aria-label="Main navigation">
      ${navItems}
    </nav>
  </div>
</header>`;

    // Insert before #app or at top of body
    const app = document.getElementById('app');
    if (app) {
      app.insertAdjacentHTML('afterbegin', html);
    } else {
      document.body.insertAdjacentHTML('afterbegin', html);
    }
  }

  /* ── Render footer ────────────────────────────────────────── */
  function renderFooter() {
    const year = new Date().getFullYear();
    const html = `
<footer>
  <div class="footer-inner">
    <div>
      <a href="${base}index.html" style="text-decoration:none;line-height:1;display:inline-block;">
        <span class="footer-logo-top">Vinicius</span>
        <span class="footer-logo-bottom">ROSA</span>
      </a>
      <p class="footer-blurb">A/P Vinicius Rosa creates novel technologies for oral health, combining materials science, artificial intelligence, regenerative concepts and translational infrastructure.</p>
    </div>
    <div>
      <div class="footer-eyebrow">Contact</div>
      <p class="footer-address">National University of Singapore<br>Faculty of Dentistry<br>National University Centre for Oral Health Singapore<br>9 Lower Kent Ridge Road, Level 10<br>Singapore 119085</p>
      <a href="mailto:vini@nus.edu.sg" class="footer-email">vini@nus.edu.sg</a>
    </div>
    <div>
      <div class="footer-eyebrow">Elsewhere</div>
      <div class="footer-links">
<a href="https://www.linkedin.com/in/vinicius-rosa-a6613873/" class="footer-link" target="_blank" rel="noopener">
          ${ICONS.linkedin} LinkedIn
        </a>
        <a href="https://www.scopus.com/authid/detail.uri?authorId=56262848300" class="footer-link" target="_blank" rel="noopener">
          ${ICONS.scopus} Scopus
        </a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <span>© ${year} Vinicius Rosa · NUS Faculty of Dentistry</span>
      <span>Singapore</span>
    </div>
  </div>
</footer>`;

    const app = document.getElementById('app');
    if (app) {
      app.insertAdjacentHTML('beforeend', html);
    } else {
      document.body.insertAdjacentHTML('beforeend', html);
    }
  }

  /* ── Auto-render on DOM ready ─────────────────────────────── */
  function init() {
    renderHeader();
    renderFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Expose base path for other scripts ───────────────────── */
  window.SITE = { base };

})();
