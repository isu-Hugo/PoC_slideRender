# 📖 Guia de Referência do Schema JSON (SlideEngine)

Este documento lista **todos os campos implementados** no SlideEngine, seus tipos, descrições e em quais layouts eles são utilizados.

---

## 1. Objeto Raiz (`meta`)

Contém as informações globais da apresentação.

| Campo | Tipo | Obrigatório | Descrição / Valores Aceitos |
| :--- | :--- | :---: | :--- |
| `title` | `string` | Sim | Título geral da aula/apresentação exibido no topo. |
| `author` | `string` | Não | Nome do professor ou autor do material. |
| `course` | `string` | Não | Nome da disciplina, módulo ou curso. |
| `theme` | `string` | Não | Tema visual inicial: `"modern-dark"`, `"academic-light"`, `"emerald"`, `"cyberpunk"`. |
| `date` | `string` | Não | Data da aula (ex: `"2026-09-27"`). |

---

## 2. Array de Slides (`slides`)

Uma lista de objetos, onde cada objeto representa uma tela da apresentação.

### Campos Comuns (Válidos para qualquer layout):
- `id` (`number`): Identificador sequencial do slide (ex: `1`, `2`, `3`).
- `layout` (`string`): O tipo de template a renderizar (`"title"`, `"bullets"`, `"split"`, `"code"`, `"quiz"`, `"quote"`).
- `speakerNotes` (`string`): **Anotações do Professor**. Aparecem no painel lateral retrátil (`N`) e são enviadas à IA para alimentar a geração de simulados e flashcards.

---

### Layouts Específicos e seus Campos:

#### A) Layout `"title"` (Capa ou Encerramento)
Usado para abertura de módulos, temas centrais ou encerramento de aulas.
- `badge` (`string`): Insígnia ou etiqueta no topo (ex: `"Aula Inaugural"`, `"Módulo 01"`).
- `title` (`string`): Título com gradiente de destaque.
- `subtitle` (`string`): Subtítulo explicativo ou contextualização.

#### B) Layout `"bullets"` (Lista de Tópicos)
Ideal para objetivos, etapas, requisitos e listas conceituais.
- `title` (`string`): Título do slide.
- `subtitle` (`string`): Subtítulo ou frase introdutória.
- `items` (`array` de `string`): Lista de itens. Cada item ganha um card interativo com animação ao passar o mouse.

#### C) Layout `"split"` (Duas Colunas Comparativas)
Ideal para Prós vs Contras, Abordagem A vs B, Teoria vs Prática.
- `title` (`string`): Título do comparativo.
- `left` (`object`):
  - `title` (`string`): Título do bloco esquerdo.
  - `tag` (`string`): Etiqueta colorida (ex: `"Simplicidade"`).
  - `points` (`array` de `string`): Tópicos do bloco esquerdo.
- `right` (`object`):
  - `title` (`string`): Título do bloco direito.
  - `tag` (`string`): Etiqueta colorida (ex: `"Escalabilidade"`).
  - `points` (`array` de `string`): Tópicos do bloco direito.

#### D) Layout `"code"` (Terminal com Código)
Para demonstrações práticas de desenvolvimento, algoritmos e dados.
- `title` (`string`): Título da demonstração.
- `subtitle` (`string`): Contexto do trecho.
- `language` (`string`): Linguagem indicada no cabeçalho (ex: `"javascript"`, `"python"`, `"sql"`, `"json"`).
- `code` (`string`): O código propriamente dito (pode conter quebras de linha com `\n`). Possui botão integrado para **copiar** com um clique.
- `explanation` (`string`): Caixa de destaque pedagógico explicativo abaixo do terminal.

#### E) Layout `"quiz"` (Pergunta Interativa de Fixação)
Teste dinâmico para os alunos responderem em sala de aula ou durante o estudo autônomo.
- `question` (`string`): O enunciado da questão.
- `options` (`array` de `string`): As alternativas (A, B, C, D...).
- `answerIndex` (`number`): O índice numérico da alternativa correta (base 0, ex: `0` para A, `1` para B, `2` para C).
- `explanation` (`string`): Justificativa pedagógica exibida instantaneamente após o aluno clicar em uma resposta.

#### F) Layout `"quote"` (Citação / Tese Central)
Para frases de impacto, princípios norteadores ou referências bibliográficas.
- `quote` (`string`): A frase ou tese entre aspas.
- `author` (`string`): Nome do autor, cientista ou filósofo.
- `role` (`string`): Cargo, livro de origem ou contexto da citação.
