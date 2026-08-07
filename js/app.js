document.addEventListener("DOMContentLoaded", () => {
  const state = {
    chapter: window.CHAPTER_01 || null,
    references: window.REFERENCES || [],
    sidebarOpen: false,
    theme: localStorage.getItem("sip-theme") || "light"
  };

  const body = document.body;
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");
  const sidebarClose = document.getElementById("closeSidebar");
  const themeToggle = document.getElementById("themeToggle");
  const searchInput = document.getElementById("searchInput");
  const backToTop = document.getElementById("backToTop");

  const chapterTitle = document.getElementById("chapterTitle");
  const chapterIntro = document.getElementById("chapterIntro");
  const chapterContainer = document.getElementById("chapterContainer");
  const presentationContainer = document.getElementById("presentationContainer");
  const objectivesContainer = document.getElementById("objectivesContainer");
  const competenciesContainer = document.getElementById("competenciesContainer");
  const timelineContainer = document.getElementById("timelineContainer");
  const philosophyContainer = document.getElementById("philosophyContainer");
  const casesContainer = document.getElementById("casesContainer");
  const referencesContainer = document.getElementById("referencesContainer");
  const tocContainer = document.getElementById("tocContainer");
  const openAssessment = document.getElementById("openAssessment");
  const assessmentModal = document.getElementById("assessmentModal");
  const closeAssessment = document.getElementById("closeAssessment");
  const assessmentContent = document.getElementById("assessmentContent");
  const assessmentResult = document.getElementById("assessmentResult");
  const assessmentTitle = document.getElementById("assessmentTitle");
  const moduleCount = document.getElementById("moduleCount");
  const progressPercentage = document.getElementById("progressPercentage");
  const progressBarFill = document.getElementById("progressBarFill");
  const progressBar = document.querySelector(".progress-bar");

  function escapeHTML(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function applyTheme(theme) {
    body.classList.toggle("dark-mode", theme === "dark");
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
    localStorage.setItem("sip-theme", theme);
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    sidebarOverlay.hidden = false;
    state.sidebarOpen = true;
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebarPanel() {
    sidebar.classList.remove("is-open");
    sidebarOverlay.hidden = true;
    state.sidebarOpen = false;
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function renderPresentation() {
    if (!state.chapter) return;
    presentationContainer.innerHTML = state.chapter.presentation
      .map(item => `<article class="content-card"><p>${escapeHTML(item)}</p></article>`)
      .join("");
  }

  function renderObjectives() {
    if (!state.chapter) return;
    objectivesContainer.innerHTML = state.chapter.objectives
      .map(item => `<article class="objective-card"><p>${escapeHTML(item)}</p></article>`)
      .join("");
  }

  function renderCompetencies() {
    if (!state.chapter) return;
    competenciesContainer.innerHTML = state.chapter.competencies
      .map(item => `<article class="competency-card"><p>${escapeHTML(item)}</p></article>`)
      .join("");
  }

  function renderChapter() {
    if (!state.chapter) return;
    chapterTitle.textContent = state.chapter.title;
    chapterIntro.textContent = state.chapter.description;

    chapterContainer.innerHTML = state.chapter.sections.map(section => {
      if (section.type === "table") {
        const header = `<thead><tr>${section.headers.map(h => `<th>${escapeHTML(h)}</th>`).join("")}</tr></thead>`;
        const rows = `<tbody>${section.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
        return `
          <article class="content-card">
            <h3>${escapeHTML(section.title)}</h3>
            <div class="table-wrap">
              <table class="data-table">
                ${header}
                ${rows}
              </table>
            </div>
          </article>
        `;
      }

      if (section.type === "cards") {
        return `
          <article class="content-card">
            <h3>${escapeHTML(section.title)}</h3>
            <div class="content-grid content-grid--two">
              ${section.cards.map(card => `
                <div class="glossary-card">
                  <h4>${escapeHTML(card.title)}</h4>
                  <p>${escapeHTML(card.text)}</p>
                </div>
              `).join("")}
            </div>
          </article>
        `;
      }

      return `
        <article class="content-card">
          <h3>${escapeHTML(section.title)}</h3>
          ${section.content.map(p => `<p>${escapeHTML(p)}</p>`).join("")}
        </article>
      `;
    }).join("");
  }

  function renderTimeline() {
    if (!state.chapter) return;
    timelineContainer.innerHTML = state.chapter.timeline
      .map(item => `
        <article class="timeline-card">
          <p class="case-badge">${escapeHTML(item.year)}</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </article>
      `).join("");
  }

  function renderPhilosophy() {
    if (!state.chapter) return;
    philosophyContainer.innerHTML = state.chapter.philosophy
      .map(item => `
        <article class="glossary-card">
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </article>
      `).join("");
  }

  function renderCases() {
    if (!state.chapter) return;
    casesContainer.innerHTML = state.chapter.cases
      .map(item => `
        <article class="case-card" data-case-id="${escapeHTML(item.id)}">
          <p class="case-badge">${escapeHTML(item.level)}</p>
          <h3>${escapeHTML(item.title)}</h3>
          <p><strong>Enfoque:</strong> ${escapeHTML(item.focus)}</p>
          <p>${escapeHTML(item.vignette)}</p>
        </article>
      `).join("");
  }

  function renderReferences() {
    const refs = state.chapter.references
      .map(id => state.references.find(ref => ref.id === id))
      .filter(Boolean);

    referencesContainer.innerHTML = refs.map(ref => `
      <article class="reference-card">
        <h3>${escapeHTML(ref.type.toUpperCase())}</h3>
        <p>${escapeHTML(ref.apa)}</p>
        ${ref.url ? `<p><a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer">Abrir referencia</a></p>` : ""}
      </article>
    `).join("");
  }

  function renderTOC() {
    const links = [
      ["Portada", "#portada"],
      ["Presentación", "#presentacion"],
      ["Objetivos", "#objetivos"],
      ["Competencias", "#competencias"],
      ["Capítulo 1", "#capitulo-1"],
      ["Línea histórica", "#linea-historica"],
      ["Bases filosóficas", "#bases-filosoficas"],
      ["Casos clínicos", "#casos-clinicos"],
      ["Bibliografía", "#bibliografia"],
      ["Créditos", "#creditos"]
    ];

    tocContainer.innerHTML = links.map(([label, href]) => `
      <a class="sidebar__link" href="${href}"><span>${label}</span><small>Ir</small></a>
    `).join("");
  }

  function updateProgress() {
    const sections = document.querySelectorAll(".panel");
    const visible = Array.from(sections).filter(sec => {
      const rect = sec.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.6;
    }).length;

    const percent = Math.min(100, Math.round((visible / sections.length) * 100));
    progressPercentage.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));
  }

  function filterContent(query) {
    const q = query.trim().toLowerCase();
    const cards = document.querySelectorAll(".content-card, .objective-card, .competency-card, .timeline-card, .glossary-card, .case-card, .reference-card");

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? "" : "none";
    });
  }

  function openAssessmentModal() {
    if (!window.renderAssessment) return;
    assessmentTitle.textContent = `Evaluación ${state.chapter.shortTitle}`;
    assessmentContent.innerHTML = "";
    assessmentResult.innerHTML = "";
    assessmentModal.hidden = false;
    body.classList.add("modal-open");
    window.renderAssessment(assessmentContent, assessmentResult);
  }

  function closeAssessmentModal() {
    assessmentModal.hidden = true;
    body.classList.remove("modal-open");
  }

  function init() {
    applyTheme(state.theme);
    renderTOC();
    renderPresentation();
    renderObjectives();
    renderCompetencies();
    renderChapter();
    renderTimeline();
    renderPhilosophy();
    renderCases();
    renderReferences();
    updateProgress();

    moduleCount.textContent = String(state.chapter ? 1 : 0);

    menuToggle?.addEventListener("click", openSidebar);
    sidebarClose?.addEventListener("click", closeSidebarPanel);
    sidebarOverlay?.addEventListener("click", closeSidebarPanel);

    themeToggle?.addEventListener("click", () => {
      const next = body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(next);
    });

    searchInput?.addEventListener("input", e => filterContent(e.target.value));

    openAssessment?.addEventListener("click", openAssessmentModal);
    closeAssessment?.addEventListener("click", closeAssessmentModal);
    assessmentModal?.addEventListener("click", e => {
      if (e.target?.dataset?.closeModal !== undefined || e.target.classList.contains("modal__backdrop")) {
        closeAssessmentModal();
      }
    });

    window.addEventListener("scroll", () => {
      backToTop.hidden = window.scrollY < 600;
      updateProgress();
    });

    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeSidebarPanel();
        if (!assessmentModal.hidden) closeAssessmentModal();
      }
    });
  }

  init();
});
