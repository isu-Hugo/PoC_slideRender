# ⚡ SlideEngine - Motor Pedagógico de Slides Orientado a JSON & IA

Um motor moderno e leve de slides interativos desenvolvido em **HTML, CSS e JavaScript puro (Vanilla)**, projetado especificamente para integrar o ciclo didático entre **Professor ➔ IA ➔ Aluno ➔ IA**.

---

## 🎯 Proposta Pedagógica (Por que este projeto existe?)

Os formatos tradicionais de apresentação (PPTX, PDF) são arquivos pesados, estáticos e proprietários. Quando um aluno tenta alimentar uma IA com um PDF de slides, a IA frequentemente alucina devido a problemas na extração de texto, diagramas desconexos e ausência de notas contextuais.

O **SlideEngine** resolve isso transformando o slide em um **objeto de dados estruturado (JSON)**:
1. **O Professor** cria sua aula fornecendo temas ou ementas para qualquer LLM (Gemini, Claude, ChatGPT) através do nosso prompt de sistema pronto. A IA gera um JSON semântico e consistente em segundos.
2. **O Aluno** assiste à apresentação no navegador (com suporte a tela cheia, códigos copiáveis, perguntas interativas com gabarito imediato e notas do orador).
3. **Estudo Ativo:** Com um clique no botão **"🤖 Estudar com IA"**, o motor compila todos os conceitos, perguntas e notas da aula em um prompt perfeito para gerar simulados de 5 questões, flashcards para memorização ou resumos aprofundados.

---

## 🚀 Como Executar o MVP

Como o projeto é construído em Vanilla HTML/CSS/JS, você não precisa instalar o Node.js nem rodar compiladores.

### Opção 1: Abrir diretamente no Navegador
- Basta dar um duplo clique no arquivo [`index.html`](index.html).

### Opção 2: Servidor Local Leve (Recomendado)
Se preferir rodar em um servidor local (ex: via Python ou VS Code Live Server):
```bash
# Com Python 3
python -m http.server 8000
```
Depois acesse `http://localhost:8000` no seu navegador.

---

## 🌟 Recursos do MVP

- **Palco 16:9 Adaptativo**: Layout fluido com proporção de tela de cinema, cantos suaves e sombra moderna.
- **Transições Suaves**: Animação direcional automática ao avançar ou retroceder slides.
- **Layouts Ricos Prontos**:
  - `title`: Capa e título com insígnia e metadados.
  - `bullets`: Lista de tópicos com marcadores estilizados.
  - `split`: Duas colunas lado a lado (ideal para comparativos e vantagens vs desvantagens).
  - `code`: Bloco de código com botão "Copiar" e destaque didático.
  - `quiz`: Pergunta interativa com opções clicáveis e feedback pedagógico imediato (verde/vermelho).
  - `quote`: Citação de destaque e referência bibliográfica.
- **Painel Lateral de Notas do Professor (`N`)**: Notas detalhadas e dicas de oratória para cada slide.
- **Exportador para Estudo com IA**: 4 modos pré-configurados (Simulado de 5 questões com gabarito, Flashcards, Resumo Conceitual e Diálogo Socrático).
- **Importação & Exportação**: Suporte a upload de arquivo `.json` ou colar texto direto.
- **Seletor de Temas**: Dark Moderno, Claro Acadêmico, Verde Esmeralda e Cyberpunk.
- **Navegação por Teclado e Touch**:
  - `➡` / `Espaço` / `Enter`: Próximo
  - `⬅` / `Backspace`: Anterior
  - `F`: Alternar Tela Cheia
  - `N`: Alternar Notas do Professor
  - `?`: Ajuda e atalhos

---

## 📁 Estrutura do Projeto

```
slideTemplate/
├── index.html                  # Interface completa do motor de slides
├── README.md                   # Esta documentação
├── css/
│   ├── style.css               # Estilos, grids, layouts e animações
│   └── themes.css              # Variáveis de temas de cores
├── js/
│   ├── app.js                  # Inicializador e controle de eventos
│   ├── renderer.js             # Conversor dos dados JSON em HTML
│   ├── navigation.js           # Gerenciador de teclas, cliques e touch
│   ├── storage.js              # Importação, exportação e localStorage
│   └── study-export.js         # Gerador dos prompts de estudo para o aluno
└── templates/
    ├── sample-presentation.json # Apresentação de demonstração completa
    └── ai-system-prompt.md     # Prompt do professor para gerar novos slides
```
