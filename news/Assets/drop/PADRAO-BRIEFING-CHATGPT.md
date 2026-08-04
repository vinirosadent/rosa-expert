# Briefing padrão para figuras de notícia (hero + fotos do corpo)

Isto é o **padrão técnico** — a parte que não muda de matéria para matéria.
A parte criativa (o que a imagem mostra, o conceito) você decide e descreve
por conta própria em cada pasta; aqui só o que o layout do site EXIGE para a
imagem não ficar cortada, desfocada ou com o texto ilegível em cima dela.

Números medidos direto do CSS do site (`assets/css/news-article.css`), não
inventados — se o CSS mudar, este arquivo pode ficar desatualizado; confira o
`.na-hero` antes de assumir os valores abaixo em caso de dúvida.

## 1. Proporção e tamanho de exportação

- **Proporção: 24:9 (2,667:1)** — a mesma "faixa" panorâmica já usada nas
  figuras de banner das páginas de Article Spotlight. O `.na-hero` do site
  tem no máximo 1180px de largura e entre 420–540px de altura (a altura varia
  com a tela); 24:9 cai confortavelmente dentro dessa faixa em qualquer
  viewport.
- **Exporte em 2400×900px** (mantém exatamente 24:9). Cobre telas retina sem
  passar disso à toa.
- Formato: PNG ou JPG, sem marca d'água, sem crédito/copyright embutido na
  imagem (isso vai como legenda em HTML, se precisar).

## 2. Zona de segurança horizontal — onde NÃO colocar o elemento principal

O hero tem um véu (gradiente) que cobre a imagem da ESQUERDA para a DIREITA:
a manchete e o texto ficam à esquerda, sentados em cima desse véu opaco; a
imagem só aparece "limpa" a partir de ~58–72% da largura para a direita.

**Regra prática: o elemento principal da imagem (rosto, objeto, cena) deve
ficar centrado na METADE DIREITA do quadro — idealmente entre 60% e 90% da
largura, contando da esquerda.** Qualquer coisa importante colocada no terço
esquerdo do quadro vai ficar esmaecida ou escondida atrás do texto.

## 3. Zona de segurança vertical — onde NÃO colocar o elemento principal

O corte da imagem (`object-position`) ancora em ~22% do topo no desktop e
~18% no celular, e no celular só os 62% de cima da imagem chegam a aparecer.

**Regra prática: mantenha o essencial (rosto, foco da cena) no TERÇO SUPERIOR
a METADE do quadro, com alguma folga acima.** Nunca coloque o elemento
principal no terço inferior — no celular ele pode ser cortado inteiramente.

## 4. Texto

**Nenhuma tipografia entra na imagem.** Manchete, legenda, badge — tudo isso
é HTML renderizado por cima. Se a imagem "precisar" de um rótulo, isso é
sinal de que falta contexto no texto da matéria, não que a imagem precisa de
letras.

## 5. Registro visual

- Se existe uma FOTO real do evento/pessoa/objeto, ela sempre vence uma
  imagem gerada — meio da matéria é a exceção, não a regra.
- Quando for gerar por IA (nomeações, conselhos editoriais, comitês — o que
  não tem "foto do evento" possível), mantenha o registro editorial/documental,
  fosco. Nada de render 3D brilhante, nada de clichê de banco de imagens,
  nada de "cara de IA" óbvia (pele plástica, luz de estúdio genérica demais).
- Se a imagem envolve alguma estrutura ou processo técnico real (ex.: um
  equipamento, uma peça anatômica, um diagrama), a precisão tem prioridade
  sobre o efeito — confira a referência real antes de aceitar o resultado.

## 6. Como entregar

Em cada pasta `news/Assets/drop/<slug>/`:

- **`hero.jpg`** (ou `.png`/`.webp`) — a imagem do hero, seguindo as regras
  acima. Esse nome de arquivo é fixo — é assim que eu sei qual arquivo é o
  hero, mesmo sem abrir a pasta pra conferir.
- Qualquer outra foto/figura para dentro do corpo do texto: nome livre e
  descritivo (ex.: `equipe-premiacao.jpg`), e me diga em que ponto do texto
  ela deveria entrar — ou eu sigo a ordem em que os arquivos aparecem na
  pasta.

Quando estiver pronto, avise que eu atualizo a página: troco o hero (e tiro
o estado "sem foto" se for o caso), insiro as figuras extras no corpo, e
escrevo o `alt` a partir do que a imagem realmente mostra.
