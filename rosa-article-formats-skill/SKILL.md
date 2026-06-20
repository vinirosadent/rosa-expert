---
name: rosa-article-formats
description: >
  Fluxo completo para criar páginas de artigo da "3. Scientific articles page" do
  site rosa.expert (A/P Vinicius Rosa, NUS Dentistry): lê o paper criticamente,
  propõe quais figuras seriam interessantes, recomenda um dos 6 templates de
  Article Spotlight, itera com o usuário e — quando as figuras estão fechadas —
  gera os prompts em PORTUGUÊS para o usuário criar essas figuras no ChatGPT (com
  ratio + pixels + descrição científica), além do orçamento de palavras por área.
  Acione SEMPRE que o usuário for trabalhar numa página de artigo / Article
  Spotlight, mencionar "Scientific articles page", "página de artigo", "research
  paper page", citar um paper em C:\Users\vinir\Google Drive\Papers\Published, ou
  pedir "formatos", "que figuras pedir", "tamanhos de figura", "quantas palavras".
---

# Páginas de artigo (Article Spotlight) — rosa.expert

## Visão geral do fluxo

1. **Ler o paper criticamente** (pasta `Papers\Published`).
2. **Propor figuras + recomendar um template** — proposta inicial; o usuário concorda ou ajusta.
3. **Iterar** até fechar o conjunto de figuras.
4. **Gerar os scripts para o ChatGPT** — só depois do acordo, com ratio + pixels + descrição científica que realmente produz a figura idealizada.
5. **Orçamento de texto** — palavras por área da página.

Fonte de verdade dos formatos: `Claude design/Research paper pages/_REFERENCIA-modelos-figuras-texto.md`.

---

## PASSO 1 — Localizar e ler o paper criticamente

Artigos ficam em **`C:\Users\vinir\Google Drive\Papers\Published`** (e subpastas).
**Procure o artigo lá ATIVAMENTE — não peça o PDF de cara.** Sequência obrigatória:

1. **Tente ler a pasta primeiro.** Se ela já estiver montada/acessível, faça `Glob`
   recursivo por `**/*.pdf` (e por subpasta) e case pelo título/autor/tema que o
   usuário citou. Em bash o caminho montado costuma ser
   `/sessions/<sessão>/mnt/<pasta>/...` — verifique os mounts disponíveis.
2. **Se a pasta NÃO estiver montada**, chame `request_cowork_directory` apontando
   **exatamente para `C:\Users\vinir\Google Drive\Papers\Published`** para o usuário
   conceder acesso. Depois do OK, repita a busca recursiva do passo 1.
3. **Só se o usuário recusar conectar a pasta**, ofereça as alternativas: anexar o
   PDF aqui, ou indicar o caminho/subpasta exata.

Nunca conclua que "não tem acesso" sem antes tentar (1) e (2). Não invente conteúdo
do paper.

- Leia o PDF e extraia: pergunta de pesquisa, abordagem/método, principais
  resultados (com números), e a "imagem mental" central do estudo (o que um leitor
  leigo-informado deveria visualizar).
- Leitura **crítica**: qual é a mensagem visual mais forte? O que merece virar
  graphical abstract? Há comparação (controle vs. teste) que pede par lado a lado?
  Há processo/tempo que pede um esquema panorâmico? Há micro-estrutura (SEM, corte
  histológico) que cabe numa figura retrato de margem?

## PASSO 2 — Propor figuras + recomendar o template

Apresente uma **proposta inicial** (não definitiva), por exemplo:

- Uma lista de 1–4 figuras candidatas, cada uma com: papel na narrativa, conteúdo
  sugerido, e o ratio que melhor a serve (24:9 / 16:9 / 3:4 / 4:3).
- Se o estudo tem vídeo/animação disponível, sinalize o slot de vídeo (16:9 embed).
- **Recomende um dos 6 templates** que melhor acomoda esse conjunto, justificando.

Templates disponíveis (escolha por nº de figuras + vídeo):

| Template | Figuras a gerar (em ordem) | Vídeo (embed próprio) |
|---|---|---|
| **1 figura + 1 vídeo** | 1× **24:9** (panorâmica) | 1× 16:9 |
| **2 figuras** | 1× **24:9** · 1× **16:9** | — |
| **2 figuras + 1 vídeo** | 1× **24:9** · 1× **3:4** (margem) | 1× 16:9 |
| **3 figuras** | 1× **16:9** · 1× **3:4** · 1× **16:9** | — |
| **3 figuras + 1 vídeo** | 1× **24:9** · 1× **3:4** · 1× **16:9** | 1× 16:9 |
| **4 figuras** | 1× **24:9** · 1× **3:4** · 2× **4:3** (par comparativo) | — |

Papéis: **24:9** = panorâmica full-bleed / graphical abstract · **16:9** = figura
de corpo padrão · **3:4** = figura de margem retrato (SEM, micrografia, detalhe) ·
**4:3** = par lado a lado para comparação.

**Espere a confirmação do usuário.** Ele pode trocar figuras, mudar de template,
acrescentar/remover. Ajuste a proposta até haver acordo. Nunca pule para os scripts
antes de fechar o conjunto.

## PASSO 3 — Gerar os scripts para o ChatGPT (após o acordo)

Para cada figura acordada, escreva um **prompt completo em português, copia-e-cola**,
combinando: (a) ratio + pixels, (b) descrição científica fiel ao paper e ao que foi
idealizado, (c) orientações de composição. O usuário gera as figuras no ChatGPT.

Dimensões padrão:

| Ratio | Pixels | Uso |
|---|---|---|
| 24:9 | **2400 × 900 px** | Panorâmica full-bleed (graphical abstract / esquema) |
| 16:9 | **1600 × 900 px** | Figura padrão na coluna de conteúdo |
| 3:4 | **900 × 1200 px** | Figura de margem retrato |
| 4:3 | **1000 × 750 px** | Par lado a lado (comparação) |

Esqueleto de cada prompt (preencher com o conteúdo real do paper):

> "Crie uma figura científica em proporção **[RATIO] ([PX])**, [orientação
> horizontal/vertical], fundo claro e limpo, estilo editorial científico. Conteúdo:
> [descrição fiel do que a figura mostra, com os elementos, rótulos e relações
> definidos com o usuário]. Composição: [respiro nas bordas / sem texto crítico nas
> margens / paleta sóbria / etc.]. Evite texto decorativo e elementos fora de escala."

Regras de qualidade dos prompts:
- A descrição vem do **conteúdo real do paper** + do que foi acordado, nunca genérica.
- 24:9: peça respiro lateral e nada essencial nas bordas (é full-bleed).
- 3:4: peça enquadramento vertical pensado para coluna estreita lateral.
- Par 4:3: peça **mesmo enquadramento, escala e estilo** nas duas, mudando só a condição.

> **Aviso a repassar:** geradores de imagem nem sempre respeitam o ratio exato. Se
> sair fora, recorte/exporte na proporção certa antes de subir — o box do site
> preenche pela proporção, não pelo tamanho.

## PASSO 4 — Orçamento de texto (palavras por área)

**Constantes em TODOS os templates:**
- **Lead / dek de abertura** (itálico serif sob o título): **30 palavras**
- **Pull-quote** (citação destacada): **19 palavras**
- **Legendas (captions):** **12–18 palavras**, frase única
  - panorâmica 24:9 e figura 16:9 ≈ 13–15 · margem 3:4 ≈ 13–14 · comparação 4:3 ≈ 17–18

**Texto AO LADO da figura de margem 3:4** (só nos templates que a têm):
heading ~8 palavras + 2 parágrafos fixos (~83 palavras) + 3º parágrafo "balanceador".

| Template (com fig 3:4) | Alvo de prosa ao lado |
|---|---|
| 4 figuras | **~83 palavras** (2 parágrafos; coluna curta) |
| 2 figuras + vídeo | **~133 palavras** |
| 3 figuras + vídeo | **~136 palavras** |
| 3 figuras | **~171 palavras** (coluna longa) |

Regra: piso = 83 palavras; alvo = **130–170** conforme o template.
**Sem texto lateral:** templates **"2 figuras"** e **"1 figura + 1 vídeo"**.

---

## Resumo de saída esperada

- PASSO 1–2: leitura crítica + proposta de figuras + template recomendado (aguardar OK).
- PASSO 3: 1 prompt completo de ChatGPT por figura (ratio + px + descrição científica);
  lembrar que o vídeo, se houver, é embed próprio em 16:9.
- PASSO 4: orçamento de texto (dek 30, pull-quote 19, legendas 12–18 e, se aplicável,
  texto ao lado da fig 3:4 conforme o template).
