/**
 * navigation.js - Gerencia estado dos slides, teclas de atalho e touch.
 */

class SlideNavigation {
  constructor(app) {
    this.app = app;
    this.currentIndex = 0;
    this.totalSlides = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.counterEl = document.getElementById('slideCounter');
    this.progressFillEl = document.getElementById('progressFill');
    this.prevBtn = document.getElementById('prevSlideBtn');
    this.nextBtn = document.getElementById('nextSlideBtn');
    this.notesBodyEl = document.getElementById('speakerNotesBody');

    this.initEvents();
  }

  setDeck(slides) {
    this.slides = slides || [];
    this.totalSlides = this.slides.length;
    this.currentIndex = 0;
    this.renderCurrent('next');
  }

  initEvents() {
    // Botões Próximo / Anterior
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Teclado
    window.addEventListener('keydown', (e) => {
      // Ignora atalhos se o foco estiver dentro de um textarea ou input
      if (['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          this.prev();
          break;
        case 'Home':
          e.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          e.preventDefault();
          this.goTo(this.totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.app.toggleFullscreen();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          this.app.toggleNotes();
          break;
        case 'h':
        case 'H':
        case '?':
          e.preventDefault();
          this.app.openModal('helpModal');
          break;
      }
    });

    // Touch / Swipe
    const viewport = document.getElementById('slideViewport');
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }
  }

  handleSwipe() {
    const threshold = 50; // pixels mínimos para considerar swipe
    const diff = this.touchEndX - this.touchStartX;
    if (diff > threshold) {
      this.prev();
    } else if (diff < -threshold) {
      this.next();
    }
  }

  next() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
      this.renderCurrent('next');
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrent('prev');
    }
  }

  goTo(index) {
    if (index >= 0 && index < this.totalSlides && index !== this.currentIndex) {
      const direction = index > this.currentIndex ? 'next' : 'prev';
      this.currentIndex = index;
      this.renderCurrent(direction);
    }
  }

  renderCurrent(direction = 'next') {
    const slide = this.slides[this.currentIndex];
    this.app.renderer.render(slide, direction);
    this.updateControls();
  }

  updateControls() {
    const humanCurrent = this.currentIndex + 1;
    if (this.counterEl) {
      this.counterEl.textContent = `${humanCurrent} / ${this.totalSlides}`;
    }

    if (this.progressFillEl) {
      const percentage = this.totalSlides > 1 ? (this.currentIndex / (this.totalSlides - 1)) * 100 : 100;
      this.progressFillEl.style.width = `${percentage}%`;
    }

    if (this.prevBtn) this.prevBtn.disabled = (this.currentIndex === 0);
    if (this.nextBtn) this.nextBtn.disabled = (this.currentIndex === this.totalSlides - 1);

    // Atualiza anotações do orador
    const currentSlide = this.slides[this.currentIndex];
    if (this.notesBodyEl) {
      if (currentSlide?.speakerNotes) {
        this.notesBodyEl.innerHTML = `
          <div style="margin-bottom: 0.75rem; font-weight: 600; color: var(--primary);">
            📌 Notas da Aula (Slide ${humanCurrent}):
          </div>
          <p>${this.notesBodyEl.textContent = currentSlide.speakerNotes}</p>
        `;
      } else {
        this.notesBodyEl.innerHTML = `<em>Nenhuma anotação específica do professor para este slide.</em>`;
      }
    }
  }
}

window.SlideNavigation = SlideNavigation;
