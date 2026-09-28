/**
 * storage.js - Gerenciamento de persistência, importação e exportação de arquivos JSON.
 */

class StorageManager {
  static STORAGE_KEY = 'slide_engine_active_deck';

  static async loadInitialPresentation() {
    // 1. Tenta carregar do localStorage
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('Falha ao restaurar apresentação do localStorage:', e);
      }
    }

    // 2. Se não houver no localStorage, busca o sample padrão
    try {
      const response = await fetch('./templates/sample-presentation.json');
      if (response.ok) {
        const sampleData = await response.json();
        this.savePresentation(sampleData);
        return sampleData;
      }
    } catch (e) {
      console.warn('Não foi possível ler sample-presentation.json via fetch:', e);
    }

    // 3. Fallback mínimo embutido caso abra como file:// sem servidor web
    return this.getFallbackPresentation();
  }

  static savePresentation(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }

  static downloadJsonFile(data, filename = 'apresentacao-slide-engine.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static parseJsonString(rawString) {
    try {
      const parsed = JSON.parse(rawString);
      if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
        throw new Error('O JSON precisa conter um array "slides" com pelo menos 1 slide.');
      }
      return { success: true, data: parsed };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static getFallbackPresentation() {
    return {
      "meta": {
        "title": "Apresentação Interativa",
        "author": "Professor",
        "course": "Didática Digital",
        "theme": "modern-dark"
      },
      "slides": [
        {
          "id": 1,
          "layout": "title",
          "badge": "Início Rápido",
          "title": "Motor de Slides JSON",
          "subtitle": "Importe seus arquivos JSON ou gere com IA",
          "speakerNotes": "Slide inicial demonstrativo."
        },
        {
          "id": 2,
          "layout": "bullets",
          "title": "Vantagens do Formato",
          "items": [
            "Funciona 100% offline no navegador",
            "Fácil integração com Gemini e ChatGPT",
            "Exportação em 1 clique para estudo do aluno"
          ],
          "speakerNotes": "Explique a simplicidade da ferramenta."
        }
      ]
    };
  }
}

window.StorageManager = StorageManager;
