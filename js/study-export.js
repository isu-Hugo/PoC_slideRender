/**
 * study-export.js - Transforma o conteúdo da apresentação em prompts otimizados de estudo para IA.
 */

class StudyExport {
  static extractContentSummary(presentationData) {
    if (!presentationData || !presentationData.slides) return '';

    const title = presentationData.meta?.title || 'Aula';
    const author = presentationData.meta?.author || 'Professor';
    
    let summaryText = `APRESENTAÇÃO: ${title} (Professor: ${author})\n\n`;

    presentationData.slides.forEach((slide, index) => {
      summaryText += `--- SLIDE ${index + 1}: ${slide.title || slide.layout} ---\n`;
      
      if (slide.subtitle) summaryText += `Subtítulo: ${slide.subtitle}\n`;
      
      if (slide.items && slide.items.length) {
        summaryText += `Tópicos:\n${slide.items.map(it => `  * ${it}`).join('\n')}\n`;
      }
      
      if (slide.left && slide.right) {
        summaryText += `Comparativo:\n[${slide.left.title}]: ${(slide.left.points || []).join('; ')}\n[${slide.right.title}]: ${(slide.right.points || []).join('; ')}\n`;
      }

      if (slide.code) {
        summaryText += `Código (${slide.language || 'código'}):\n${slide.code}\nExplicação: ${slide.explanation || ''}\n`;
      }

      if (slide.question) {
        summaryText += `Quiz: ${slide.question}\nOpções: ${(slide.options || []).join(' | ')}\nExplicação do gabarito: ${slide.explanation || ''}\n`;
      }

      if (slide.quote) {
        summaryText += `Citação: "${slide.quote}" - ${slide.author || ''}\n`;
      }

      if (slide.speakerNotes) {
        summaryText += `[Notas do Professor / Destaques]: ${slide.speakerNotes}\n`;
      }

      summaryText += '\n';
    });

    return summaryText;
  }

  static generatePrompt(presentationData, mode = 'simulado') {
    const lectureContent = this.extractContentSummary(presentationData);

    switch (mode) {
      case 'simulado':
        return `Você é meu tutor acadêmico particular de alto nível.
Com base no conteúdo estruturado da aula abaixo (disponibilizada pelo meu professor em formato JSON), crie um SIMULADO DE FIXAÇÃO COM 5 QUESTÕES DE MÚLTIPLA ESCOLHA.

Diretrizes:
- Foque em questões práticas, reflexivas e conceituais abordadas nos slides e nas notas do professor.
- Cada questão deve ter 4 alternativas (A, B, C, D) e apenas UMA correta.
- Oculte o gabarito no final, apresentando primeiro todas as questões.
- Abaixo do gabarito, apresente uma justificativa detalhada e pedagógica de cada resposta correta.

CONTEÚDO DA AULA:
"""
${lectureContent}
"""`;

      case 'flashcards':
        return `Você é meu tutor acadêmico e especialista em métodos de repetição espaçada (Spaced Repetition).
Com base no material da aula abaixo, crie um conjunto de 8 a 10 FLASHCARDS para memorização e estudo ativo.

Formato esperado para cada flashcard:
[FRENTE / PERGUNTA]: Pergunta direta e instigante sobre um conceito ou contraste
[VERSO / RESPOSTA]: Resposta sucinta, clara e direto ao ponto com palavras-chave em negrito.

CONTEÚDO DA AULA:
"""
${lectureContent}
"""`;

      case 'resumo':
        return `Você é meu professor assistente e especialista em síntese do conhecimento.
Com base no material desta apresentação, elabore um RESUMO EXECUTIVO DIDÁTICO E UM GUIA DE REVISÃO RÁPIDA contendo:

1. Visão Geral em 3 frases
2. Principais Conceitos e suas conexões (com um diagrama conceitual em formato Mermaid, se aplicável)
3. Erros comuns ou armadilhas conceituais que devo evitar
4. Três perguntas de reflexão profunda para eu testar meu raciocínio

CONTEÚDO DA AULA:
"""
${lectureContent}
"""`;

      case 'socratico':
        return `Você agora assumirá o papel de Sócrates e de meu tutor particular.
Leu o material da minha aula abaixo e sua missão é me ajudar a dominar esse assunto através de um DIÁLOGO SOCRÁTICO interativo.

Regra:
- NÃO me dê a aula inteira de uma vez.
- Comece me fazendo UMA pergunta instigante baseada no primeiro conceito fundamental do slide.
- Espere minha resposta para me desafiar, elogiar ou guiar meu raciocínio adiante, um passo de cada vez.

CONTEÚDO DA AULA:
"""
${lectureContent}
"""`;

      default:
        return lectureContent;
    }
  }
}

window.StudyExport = StudyExport;
