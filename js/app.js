/**
 * app.js - Orquestrador principal da aplicação SlideEngine.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const viewport = document.getElementById('slideViewport');
  const presentationTitleEl = document.getElementById('presentationTitle');
  const themeSelectEl = document.getElementById('themeSelect');
  const toastContainer = document.getElementById('toastContainer');

  const app = {
    deckData: null,
    renderer: new SlideRenderer(viewport),
    navigation: null,
    currentStudyMode: 'simulado',

    init: async function() {
      this.navigation = new SlideNavigation(this);
      this.bindUI();
      
      // Carrega apresentação inicial
      const data = await StorageManager.loadInitialPresentation();
      this.loadPresentation(data);
    },

    loadPresentation: function(data) {
      this.deckData = data;
      
      // Atualiza título na barra
      if (presentationTitleEl) {
        presentationTitleEl.textContent = data.meta?.title || 'Sem Título';
        presentationTitleEl.title = data.meta?.title || '';
      }

      // Aplica tema se especificado no JSON
      if (data.meta?.theme && themeSelectEl) {
        themeSelectEl.value = data.meta.theme;
        this.setTheme(data.meta.theme);
      }

      // Entrega slides ao navegador
      this.navigation.setDeck(data.slides);
      StorageManager.savePresentation(data);
    },

    setTheme: function(themeName) {
      document.body.setAttribute('data-theme', themeName);
      if (themeSelectEl) themeSelectEl.value = themeName;
    },

    toggleFullscreen: function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Erro ao ativar tela cheia: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    },

    toggleNotes: function() {
      const drawer = document.getElementById('speakerNotesDrawer');
      drawer?.classList.toggle('open');
    },

    openModal: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        
        // Se for o modal de estudos, já gera o prompt do modo ativo
        if (modalId === 'exportStudyModal') {
          this.updateStudyPrompt();
        }
      }
    },

    closeModal: function(modalId) {
      const modal = document.getElementById(modalId);
      modal?.classList.remove('open');
    },

    closeAllModals: function() {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    },

    showToast: function(message, duration = 3000) {
      if (!toastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    updateStudyPrompt: function() {
      const outputArea = document.getElementById('studyPromptOutput');
      if (outputArea && this.deckData) {
        const promptText = StudyExport.generatePrompt(this.deckData, this.currentStudyMode);
        outputArea.value = promptText;
      }
    },

    bindUI: function() {
      // Seletor de Tema
      themeSelectEl?.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
        if (this.deckData) {
          if (!this.deckData.meta) this.deckData.meta = {};
          this.deckData.meta.theme = e.target.value;
          StorageManager.savePresentation(this.deckData);
        }
      });

      // Botão Tela Cheia
      document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());

      // Botão Notas do Orador
      document.getElementById('notesBtn')?.addEventListener('click', () => this.toggleNotes());
      document.getElementById('closeNotesBtn')?.addEventListener('click', () => this.toggleNotes());

      // Botão Ajuda
      document.getElementById('helpBtn')?.addEventListener('click', () => this.openModal('helpModal'));

      // Botão Importar / Carregar JSON
      document.getElementById('importBtn')?.addEventListener('click', () => this.openModal('importModal'));

      // Botão Baixar JSON
      document.getElementById('downloadJsonBtn')?.addEventListener('click', () => {
        if (this.deckData) {
          const fileName = (this.deckData.meta?.title || 'apresentacao')
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, '-')
            .substring(0, 30) + '.json';
          StorageManager.downloadJsonFile(this.deckData, fileName);
          this.showToast('✅ Arquivo JSON baixado com sucesso!');
        }
      });

      // Botão "Estudar com IA"
      document.getElementById('studyAiBtn')?.addEventListener('click', () => this.openModal('exportStudyModal'));

      // Botão "Criar Slides com IA" (Prompt do Professor)
      document.getElementById('teacherPromptBtn')?.addEventListener('click', () => this.openModal('teacherPromptModal'));

      // Fechar Modais clicando no 'X' ou fora do card
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeAllModals();
          }
        });
      });

      document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => this.closeAllModals());
      });

      // Ações do Modal de Importação
      const importTextarea = document.getElementById('jsonInputArea');
      const fileInput = document.getElementById('jsonFileInput');

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          if (importTextarea) importTextarea.value = content;
        };
        reader.readAsText(file);
      });

      document.getElementById('confirmImportBtn')?.addEventListener('click', () => {
        const rawJson = importTextarea?.value.trim();
        if (!rawJson) {
          alert('Por favor, cole o código JSON ou selecione um arquivo.');
          return;
        }

        const result = StorageManager.parseJsonString(rawJson);
        if (result.success) {
          this.loadPresentation(result.data);
          this.closeAllModals();
          this.showToast('🎉 Apresentação carregada com sucesso!');
        } else {
          alert(`Erro ao processar JSON: ${result.error}`);
        }
      });

      // Ações do Modal de Estudos
      const studyCards = document.querySelectorAll('.study-option-card');
      studyCards.forEach(card => {
        card.addEventListener('click', () => {
          studyCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.currentStudyMode = card.getAttribute('data-mode');
          this.updateStudyPrompt();
        });
      });

      document.getElementById('copyStudyPromptBtn')?.addEventListener('click', async () => {
        const outputArea = document.getElementById('studyPromptOutput');
        if (outputArea) {
          try {
            await navigator.clipboard.writeText(outputArea.value);
            this.showToast('📋 Prompt copiado! Cole agora no ChatGPT, Gemini ou Claude.');
          } catch (err) {
            console.error('Falha ao copiar:', err);
          }
        }
      });

      // Copiar prompt do Professor
      document.getElementById('copyTeacherPromptBtn')?.addEventListener('click', async () => {
        const area = document.getElementById('teacherPromptArea');
        if (area) {
          try {
            await navigator.clipboard.writeText(area.value);
            this.showToast('📋 Prompt do professor copiado com sucesso!');
          } catch (err) {
            console.error('Falha ao copiar:', err);
          }
        }
      });

      // Carregar Exemplo Completo (6 Slides com todos os layouts)
      document.getElementById('loadFullExampleBtn')?.addEventListener('click', async () => {
        try {
          const resp = await fetch('./templates/exemplo-completo-todos-os-campos.json');
          if (resp.ok) {
            const data = await resp.json();
            this.loadPresentation(data);
            this.closeAllModals();
            this.showToast('🚀 Exemplo completo (6 slides) carregado com sucesso!');
          } else {
            throw new Error('Arquivo não encontrado');
          }
        } catch (err) {
          alert('Não foi possível carregar o arquivo templates/exemplo-completo-todos-os-campos.json.');
        }
      });

      // Resetar para Exemplo Padrão
      document.getElementById('loadSampleBtn')?.addEventListener('click', async () => {
        localStorage.removeItem(StorageManager.STORAGE_KEY);
        const data = await StorageManager.loadInitialPresentation();
        this.loadPresentation(data);
        this.closeAllModals();
        this.showToast('🔄 Exemplo demonstrativo recarregado!');
      });
    }
  };

  window.SlideApp = app;
  app.init();
});
