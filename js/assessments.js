window.renderAssessment = function renderAssessment(container, resultNode) {
  const chapter = window.CHAPTER_01;
  const question = chapter.cases[0];

  container.innerHTML = `
    <article class="assessment-card">
      <p class="case-badge">Capítulo 1</p>
      <h3>${question.title}</h3>
      <div class="assessment-card__details">
        <span><strong>Nivel:</strong> ${question.level}</span>
        <span><strong>Enfoque:</strong> ${question.focus}</span>
      </div>
      <div class="question-card">
        <p><strong>Pregunta:</strong> ${question.question}</p>
        <div class="question-options">
          ${question.options.map((opt, index) => `
            <label class="option">
              <input type="radio" name="assessmentAnswer" value="${index}">
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      </div>
      <div style="display:flex; gap:12px; margin-top:16px;">
        <button class="button button--primary" type="button" id="assessmentSubmit">Calificar</button>
        <button class="button button--secondary" type="button" id="assessmentReset">Reiniciar</button>
      </div>
    </article>
  `;

  const submit = container.querySelector("#assessmentSubmit");
  const reset = container.querySelector("#assessmentReset");

  submit.addEventListener("click", () => {
    const checked = container.querySelector('input[name="assessmentAnswer"]:checked');
    if (!checked) {
      resultNode.innerHTML = "<p>Selecciona una respuesta antes de calificar.</p>";
      return;
    }
    const selected = Number(checked.value);
    const ok = selected === question.answerIndex;
    resultNode.innerHTML = ok
      ? `<p><strong>Correcto.</strong> ${question.feedback}</p>`
      : `<p><strong>Incorrecto.</strong> ${question.feedback}</p>`;
  });

  reset.addEventListener("click", () => {
    container.querySelectorAll('input[name="assessmentAnswer"]').forEach(input => input.checked = false);
    resultNode.innerHTML = "";
  });
};
