document.addEventListener("DOMContentLoaded", () => {
  const chapter = window.CHAPTER_01;
  const references = window.REFERENCES || [];

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const menuToggle = document.getElementById("menuToggle");
  const sidebarClose = document.getElementById("closeSidebar");
  const themeToggle = document.getElementById("themeToggle");
  const searchInput = document.getElementById("searchInput");
  const backToTop = document.getElementById("backToTop");

  const tocContainer = document.getElementById("tocContainer");
  const presentationContainer = document.getElementById("presentationContainer");
  const objectivesContainer = document.getElementById("objectivesContainer");
  const competenciesContainer = document.getElementById("competenciesContainer");
  const chapterTitle = document.getElementById("chapterTitle");
  const chapterIntro = document.getElementById("chapterIntro");
  const chapterContainer = document.getElementById("chapterContainer");
  const timelineContainer = document.getElementById("timelineContainer");
  const philosophyContainer = document.getElementById("philosophyContainer");
  const casesContainer = document.getElementById("casesContainer");
  const referencesContainer = document.getElementById("referencesContainer");
  const moduleCount = document.getElementById("moduleCount");
  const progressPercentage = document.getElementById("progressPercentage");
  const progressBarFill = document.getElementById("progressBarFill");
  const progressBar = document.querySelector(".progress-bar");

  const theme = localStorage.getItem("sip-theme") || "light";
  document.body.classList.toggle("dark-mode", theme === "dark");
  themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setTheme(next) {
    document.body.classList.toggle("dark-mode", next === "dark");
    localStorage.setItem("sip-theme", next);
    themeToggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    themeToggle.setAttribute("aria-label", next === "dark" ? "Activar modo claro" : "Activar modo oscuro");
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    sidebarOverlay.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebarPanel() {
    sidebar.classList.remove("is-open");
    sidebarOverlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function renderTOC() {
    const items = [
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

    tocContainer.innerHTML = items.map(([label, href]) => `
      <a href="${href}" class="toc-link">${label}</a>
    `).join("");

    sidebar.innerHTML = `
      <div class="sidebar__header">
        <h2>Índice</h2>
        <button id="closeSidebar" class="icon-button" type="button" aria-label="Cerrar menú lateral"><span aria-hidden="true">×</span></button>
      </div>
      <nav class="sidebar__nav" aria-label="Navegación del curso">
        ${items.map(([label, href]) => `<a href="${href}"><span>${label}</span><small>Ir</small></a>`).join("")}
      </nav>
    `;
  }

  function renderPresentation() {
    presentationContainer.innerHTML = chapter.presentation.map(p => `<article class="content-card"><p>${esc(p)}</p></article>`).join("");
  }

  function renderObjectives() {
    objectivesContainer.innerHTML = chapter.objectives.map(p => `<article class="objective-card"><p>${esc(p)}</p></article>`).join("");
  }

  function renderCompetencies() {
    competenciesContainer.innerHTML = chapter.competencies.map(p => `<article class="competency-card"><p>${esc(p)}</p></article>`).join("");
  }

  function renderChapter() {
    chapterTitle.textContent = chapter.title;
    chapterIntro.textContent = chapter.description;

    chapterContainer.innerHTML = chapter.sections.map(section => {
      if (section.type === "table") {
        return `
          <article class="content-card">
            <h3>${esc(section.title)}</h3>
            <table class="data-table">
              <thead>
                <tr>${section.headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${section.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </article>
        `;
      }
      if (section.type === "cards") {
        return `
          <article class="content-card">
            <h3>${esc(section.title)}</h3>
            <div class="content-grid content-grid--two">
              ${section.cards.map(card => `
                <div class="glossary-card">
                  <h4>${esc(card.title)}</h4>
                  <p>${esc(card.text)}</p>
                </div>
              `).join("")}
            </div>
          </article>
        `;
      }
      return `
        <article class="content-card">
          <h3>${esc(section.title)}</h3>
          ${section.content.map(p => `<p>${esc(p)}</p>`).join("")}
        </article>
      `;
    }).join("");
  }

  function renderTimeline() {
    timelineContainer.innerHTML = chapter.timeline.map(item => `
      <article class="timeline-card">
        <p class="case-badge">${esc(item.year)}</p>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>
    `).join("");
  }

  function renderPhilosophy() {
    philosophyContainer.innerHTML = chapter.philosophy.map(item => `
      <article class="glossary-card">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </article>
    `).join("");
  }

  function renderCases() {
    casesContainer.innerHTML = chapter.cases.map(item => `
      <article class="case-card">
        <p class="case-badge">${esc(item.level)}</p>
        <h3>${esc(item.title)}</h3>
        <p><strong>Enfoque:</strong> ${esc(item.focus)}</p>
        <p>${esc(item.vignette)}</p>
      </article>
    `).join("");
  }

  function renderReferences() {
    const refs = chapter.references.map(id => references.find(r => r.id === id)).filter(Boolean);
    referencesContainer.innerHTML = refs.map(ref => `
      <article class="reference-card">
        <h3>${esc(ref.type.toUpperCase())}</h3>
        <p>${esc(ref.apa)}</p>
        ${ref.url ? `<p><a href="${esc(ref.url)}" target="_blank" rel="noopener noreferrer">Abrir referencia</a></p>` : ""}
      </article>
    `).join("");
  }

  function updateProgress() {
    const sections = [...document.querySelectorAll(".panel")];
    let current = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.55) current = i + 1;
    });
    const percent = Math.round((current / sections.length) * 100);
    progressPercentage.textContent = `${percent}%`;
    progressBarFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));
  }

  function filterAll(query) {
    const q = query.trim().toLowerCase();
    const cards = document.querySelectorAll(".content-card, .objective-card, .competency-card, .timeline-card, .glossary-card, .case-card, .reference-card");
    cards.forEach(card => {
      card.style.display = !q || card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  }

  function showAssessment() {
    const modal = document.getElementById("assessmentModal");
    const content = document.getElementById("assessmentContent");
    const result = document.getElementById("assessmentResult");
    const title = document.getElementById("assessmentTitle");
    if (!window.renderAssessment) return;
    title.textContent = `Evaluación ${chapter.shortTitle}`;
    content.innerHTML = "";
    result.innerHTML = "";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    window.renderAssessment(content, result);
  }

  function hideAssessment() {
    const modal = document.getElementById("assessmentModal");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function init() {
    renderTOC();
    renderPresentation();
    renderObjectives();
    renderCompetencies();
    renderChapter();
    renderTimeline();
    renderPhilosophy();
    renderCases();
    renderReferences();

    moduleCount.textContent = chapter ? "1" : "0";

    menuToggle.addEventListener("click", openSidebar);
    sidebarOverlay.addEventListener("click", closeSidebarPanel);
    document.addEventListener("click", e => {
      const closeBtn = e.target.closest("#closeSidebar");
      if (closeBtn) closeSidebarPanel();
    });

    themeToggle.addEventListener("click", () => {
      const next = document.body.classList.contains("dark-mode") ? "light" : "dark";
      setTheme(next);
    });

    searchInput.addEventListener("input", e => filterAll(e.target.value));

    const openAssessment = document.getElementById("openAssessment");
    openAssessment.addEventListener("click", showAssessment);
    document.getElementById("closeAssessment").addEventListener("click", hideAssessment);
    document.getElementById("assessmentModal").addEventListener("click", e => {
      if (e.target.classList.contains("modal__backdrop")) hideAssessment();
    });

    window.addEventListener("scroll", () => {
      backToTop.hidden = window.scrollY < 500;
      updateProgress();
    });

    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeSidebarPanel();
        hideAssessment();
      }
    });

    updateProgress();
  }

  init();
});
