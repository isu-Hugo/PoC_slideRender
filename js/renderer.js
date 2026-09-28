/**
 * Renderer.js - Responsável por transformar os dados do slide em HTML semântico e interativo.
 */

class SlideRenderer {
  constructor(viewportElement) {
    this.viewport = viewportElement;
  }

  render(slide, direction = 'next') {
    if (!slide) return;

    // Remove classes de animação anteriores
    const oldContent = this.viewport.querySelector('.slide-content');
    if (oldContent) {
      oldContent.remove();
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = `slide-content anim-${direction}`;

    switch (slide.layout) {
      case 'title':
        contentDiv.innerHTML = this.renderTitle(slide);
        break;
      case 'bullets':
        contentDiv.innerHTML = this.renderBullets(slide);
        break;
      case 'split':
        contentDiv.innerHTML = this.renderSplit(slide);
        break;
      case 'code':
        contentDiv.innerHTML = this.renderCode(slide);
        break;
      case 'quiz':
        contentDiv.innerHTML = this.renderQuiz(slide);
        this.attachQuizEvents(contentDiv, slide);
        break;
      case 'quote':
        contentDiv.innerHTML = this.renderQuote(slide);
        break;
      default:
        contentDiv.innerHTML = this.renderGeneric(slide);
    }

    this.viewport.appendChild(contentDiv);
    this.attachCopyCodeEvents(contentDiv);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  renderTitle(slide) {
    const badge = slide.badge ? `<div class="slide-badge">${this.escapeHtml(slide.badge)}</div>` : '';
    const subtitle = slide.subtitle ? `<p class="subtitle">${this.escapeHtml(slide.subtitle)}</p>` : '';
    
    return `
      <div class="layout-title">
        ${badge}
        <h1>${this.escapeHtml(slide.title)}</h1>
        ${subtitle}
        <div class="slide-meta-info">
          <span>${slide.author || ''}</span>
          ${slide.course ? `<span>• ${slide.course}</span>` : ''}
          ${slide.date ? `<span>• ${slide.date}</span>` : ''}
        </div>
      </div>
    `;
  }

  renderBullets(slide) {
    const items = (slide.items || []).map(item => `
      <div class="bullet-item">
        <span class="bullet-icon">✦</span>
        <span>${this.escapeHtml(item)}</span>
      </div>
    `).join('');

    return `
      <div class="slide-header">
        <h2>${this.escapeHtml(slide.title)}</h2>
        ${slide.subtitle ? `<p class="sub">${this.escapeHtml(slide.subtitle)}</p>` : ''}
      </div>
      <div class="bullet-list">
        ${items}
      </div>
    `;
  }

  renderSplit(slide) {
    const leftPoints = (slide.left?.points || []).map(pt => `<li>${this.escapeHtml(pt)}</li>`).join('');
    const rightPoints = (slide.right?.points || []).map(pt => `<li>${this.escapeHtml(pt)}</li>`).join('');

    return `
      <div class="slide-header">
        <h2>${this.escapeHtml(slide.title)}</h2>
      </div>
      <div class="split-grid">
        <div class="split-card">
          <div class="split-card-header">
            <h3>${this.escapeHtml(slide.left?.title || '')}</h3>
            ${slide.left?.tag ? `<span class="tag-badge">${this.escapeHtml(slide.left.tag)}</span>` : ''}
          </div>
          <ul class="split-points">
            ${leftPoints}
          </ul>
        </div>
        <div class="split-card">
          <div class="split-card-header">
            <h3>${this.escapeHtml(slide.right?.title || '')}</h3>
            ${slide.right?.tag ? `<span class="tag-badge">${this.escapeHtml(slide.right.tag)}</span>` : ''}
          </div>
          <ul class="split-points">
            ${rightPoints}
          </ul>
        </div>
      </div>
    `;
  }

  renderCode(slide) {
    const lang = slide.language || 'text';
    const explanation = slide.explanation ? `
      <div class="code-explanation">
        💡 <strong>Destaque pedagógico:</strong> ${this.escapeHtml(slide.explanation)}
      </div>
    ` : '';

    return `
      <div class="slide-header">
        <h2>${this.escapeHtml(slide.title)}</h2>
        ${slide.subtitle ? `<p class="sub">${this.escapeHtml(slide.subtitle)}</p>` : ''}
      </div>
      <div class="code-container">
        <div class="code-topbar">
          <div class="code-dots">
            <span class="code-dot dot-red"></span>
            <span class="code-dot dot-yellow"></span>
            <span class="code-dot dot-green"></span>
          </div>
          <span class="code-lang">${lang}</span>
          <button class="code-copy-btn" data-code="${encodeURIComponent(slide.code || '')}">
            📋 Copiar
          </button>
        </div>
        <pre class="code-block"><code>${this.escapeHtml(slide.code || '')}</code></pre>
      </div>
      ${explanation}
    `;
  }

  renderQuiz(slide) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const options = (slide.options || []).map((opt, i) => `
      <button class="quiz-opt-btn" data-index="${i}">
        <span class="opt-letter">${letters[i] || i + 1}</span>
        <span>${this.escapeHtml(opt)}</span>
      </button>
    `).join('');

    return `
      <div class="quiz-container">
        <div class="quiz-question-box">
          <h3>🎯 ${this.escapeHtml(slide.question)}</h3>
        </div>
        <div class="quiz-options">
          ${options}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
      </div>
    `;
  }

  renderQuote(slide) {
    return `
      <div class="quote-container">
        <div class="quote-mark">“</div>
        <div class="quote-text">${this.escapeHtml(slide.quote)}</div>
        <div class="quote-author">${this.escapeHtml(slide.author || '')}</div>
        ${slide.role ? `<div class="quote-role">${this.escapeHtml(slide.role)}</div>` : ''}
      </div>
    `;
  }

  renderGeneric(slide) {
    return `
      <div class="slide-header">
        <h2>${this.escapeHtml(slide.title || 'Slide')}</h2>
      </div>
      <p>${this.escapeHtml(slide.content || '')}</p>
    `;
  }

  attachQuizEvents(container, slide) {
    const buttons = container.querySelectorAll('.quiz-opt-btn');
    const feedbackEl = container.querySelector('#quizFeedback');
    const correctIndex = slide.answerIndex !== undefined ? slide.answerIndex : 0;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        
        // Desabilita botões após a resposta
        buttons.forEach(b => b.disabled = true);

        if (selectedIndex === correctIndex) {
          btn.classList.add('correct');
          feedbackEl.className = 'quiz-feedback show success';
          feedbackEl.innerHTML = `<strong>✨ Resposta Correta!</strong><br>${this.escapeHtml(slide.explanation || 'Excelente fixação do conteúdo!')}`;
        } else {
          btn.classList.add('incorrect');
          if (buttons[correctIndex]) {
            buttons[correctIndex].classList.add('correct');
          }
          feedbackEl.className = 'quiz-feedback show error';
          feedbackEl.innerHTML = `<strong>⚠️ Quase lá!</strong><br>${this.escapeHtml(slide.explanation || 'Revise o conceito deste slide para entender melhor.')}`;
        }
      });
    });
  }

  attachCopyCodeEvents(container) {
    const copyBtns = container.querySelectorAll('.code-copy-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const rawCode = decodeURIComponent(btn.getAttribute('data-code'));
        try {
          await navigator.clipboard.writeText(rawCode);
          const origText = btn.innerHTML;
          btn.innerHTML = '✅ Copiado!';
          setTimeout(() => btn.innerHTML = origText, 2000);
        } catch (err) {
          console.error("Falha ao copiar:", err);
        }
      });
    });
  }
}

window.SlideRenderer = SlideRenderer;
