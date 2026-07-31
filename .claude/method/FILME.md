# O filme do método — folha de câmera

Substitui a linha estática 1-2-3-4 na home. Ensina como o laboratório desenha
biomateriais com propriedades sob demanda: o que entra, o que a IA devolve, e
por que o resultado volta ao começo.

## O registro — travado em 2026-08-01

Volumétrico, translúcido, luminoso, sobre ivory quente. Luz **atravessa** a
matéria; o brilho vem de dentro. **Sem contorno de tinta, sem textura de papel,
sem desenho.** Profundidade curta: a borda perto se dissolve, um plano é
nítido, o fundo cai em névoa. Matte — nunca brilho especular.

É o mesmo registro do filme da premissa. Foi a decisão do Vinicius depois de
comparar três direções lado a lado: aquarela desenhada, híbrido e este. O
critério foi não ter **três times visuais** na mesma página (hero · premissa ·
método).

**Referências de estilo, nesta ordem de prioridade:**

| papel | media/job id |
|---|---|
| íons no campo alcalino (frio, aprovado) | `532c6f65-76ab-4bfb-a545-58e941340599` |
| células com mineral (quente, aprovado) | `caed091f-5725-4c3e-9f35-50bd79ff7b0b` |
| premissa · matter (frio) | `24c1bcbd-bf9d-4d64-99ca-992fcdf5f6b2` |
| premissa · life (quente) | `13e14ab7-b8ed-4907-baa0-3d5dcca3bcb8` |

## A curva de cor é narrativa, não ambiente

Medido prancha a prancha na premissa: matéria 5,9 · inteligência 13,5 ·
vida 51,2 (calor R−B). **O âmbar significa vida.** Um plano de matéria quente
rouba o significado do plano de vida — e é cientificamente errado, porque
cimento de silicato de cálcio é cinza-creme pálido.

Alvos por movimento:

| o que está na tela | calor | saturação |
|---|---|---|
| matéria, cimento, pó | 5–10 | 15–20 |
| campo alcalino, modelo, candidatos | 10–16 | 15–25 |
| biologia respondendo | 45–55 | 45–55 |

O primeiro teste de vida saiu a 61,5 — 20% quente demais. Puxar para ~52.

### Uma temperatura por quadro

Tentar pôr o polo frio e o polo quente no mesmo quadro **não funciona**: o
âmbar contamina o fundo e o quadro inteiro sobe. Medido — "as duas exigências"
deu 22,6 e "as duas entradas" deu 30,5, com alvo 8. Na premissa cada prancha
tem uma só temperatura.

Onde o sentido exige os dois, faz-se com **dois planos de enquadramento
idêntico** e um corte entre eles. A rima de composição carrega o sentido melhor
que a justaposição, e cada quadro fica puro na sua cor.

### O fundo ivory nunca sai

Erro cometido: mandei "estritamente frio, branco-papel, sem luz dourada" e o
fundo virou cinza-azulado — calor −7,1 e −16,2. O **ivory quente é o papel do
site** e é constante. O frio mora só no corpo; o contraste entre fundo quente e
corpo frio é que dá a temperatura do quadro.

Na mesma leva o cimento virou vidro/gelo. A identidade do material tem de ser
dita: **fosco, gessoso, opaco, a luz não atravessa** — nunca vidro, nunca
cristal transparente, nunca molhado.

## Regras que não se negociam

- **Pesquisador sempre de luva e jaleco.** Nenhuma mão nua em quadro nenhum.
- **Nenhum texto embutido em imagem.** Toda tipografia é HTML. Já escapou um
  "Ca²⁺ / OH⁻" num teste, apesar da proibição no prompt — conferir sempre.
- **Íons e nódulos finos e delicados.** Nunca esfera brilhante, conta, pérola,
  bolha, ova de peixe ou massa de couve-flor.
- **Célula é fusiforme**, alongada, com prolongamentos e núcleo visível. Nunca
  redonda, nunca pétala.
- **A célula não vira cristal.** O mineral é resposta dela, forma-se entre e
  sob a camada viva. O cimento não mineraliza.
- **Porosidade irregular.** Nunca favo de mel, nunca tubo usinado, nunca
  treliça regular.
- **O estágio computacional não inventa resultado numérico** nem alega
  superioridade clínica.
- Cada quadro nasce com **um terço vazio** onde a tipografia HTML vai cair.

## A graduação de cor não é opcional

O gerador entrega ivory sistematicamente **2 a 3× mais quente** que a
referência aprovada — medido nos doze quadros, calor entre 16 e 31 com alvos de
6 a 14. Não é ruído: aconteceu em todos. Regerar não converge e custa 2
créditos por tentativa.

`py .claude/method/grade.py <entrada> <saída> <calor> <saturação>` resolve por
busca em dois estágios. **Grada-se o vídeo, não o keyframe** — assim o corte
guarda os parâmetros junto com a razão deles. Os valores medidos:

| plano | rm | sat | calor final |
|---|---|---|---|
| 02a material | −0,07 | 1,30 | 7,6 |
| 02b biologia | 0 | 1,00 | 47,2 |
| 03 falha | −0,01 | 1,30 | 5,8 |
| 04a campo | −0,07 | 1,30 | 10,9 |
| 04b reduzido | −0,11 | 1,30 | 9,8 |
| 05 resonance | −0,05 | 1,30 | 12,5 |
| 06 janus | −0,01 | 1,00 | 13,8 |
| 07a seleção | −0,07 | 1,30 | 11,7 |
| 07b inversão | −0,09 | 1,60 | 10,1 |
| 08 bancada | −0,09 | 1,60 | 8,9 |
| 09 hologram | −0,04 | 1,00 | 50,8 |
| 10 laço | −0,07 | 1,30 | 14,0 |

## Encadeamento

O quadro final de cada plano é o quadro inicial do seguinte. Isso corta o
custo de imagens quase pela metade e, mais importante, **impõe continuidade**:
o corte casa por construção, não por sorte.

## Os dez movimentos

Cada um traz: o que se vê · o que ensina · alvo de calor · onde fica o vazio.

**01 · As duas exigências** — um corpo de cimento frio e poroso e, ao lado,
tecido vivo e quente, no mesmo quadro, ainda separados. *Dois conjuntos de
exigências sobre o mesmo objeto.* calor 5→50 no quadro · vazio no alto.

**02 · As duas entradas** — duas correntes convergindo: a mineral (fria,
cristalina) e a viva (quente, macia), ambas carregando leituras finas. *Material
e biologia entram como dado, desde o primeiro quadro.* calor 8 · vazio à esq.

**03 · O impasse** — o mesmo corpo, duas vezes, no mesmo enquadramento: mais
água, escoa melhor e cede sob carga; mais radiopacificador, ganha densidade e
cede sob carga. *Nenhuma receita maximiza tudo.* calor 6 · vazio à dir.

**04 · HYPERFIELD** — um campo enorme de corpos candidatos; quase todos viram
fantasma e sobra um conjunto compacto. *Testar o que importa, não tudo.*
calor 10 · vazio ao centro-alto.

**05 · RESONANCE** — muitos filamentos vibrando; quase todos silenciam, poucos
continuam. *Para cada alvo, um punhado move a agulha.* calor 10 · vazio à esq.

**06 · JANUS** — um corpo só mostrando dois tempos: as primeiras horas de um
lado, o estado de 28 dias do outro, na mesma forma contínua. *Semanas
respondidas em segundos.* calor 14 · vazio ao alto.

**07 · DARWINIAN — a inversão** — gerações de candidatos; os inaptos se
dissolvem em becos sem saída; a população converge para um. **E então o sentido
se inverte:** o corpo escolhido se resolve de volta nos pós que o compõem.
*Nomeie a propriedade; o modelo devolve a formulação.* O plano mais longo.
calor 12 · vazio à dir.

**08 · A bancada decide** — o corpo prescrito, feito e ensaiado. Previsto e
medido caindo na mesma marca. Pesquisador de luva e jaleco. *Quatro cimentos
desenhados bateram com o previsto.* calor 8 · vazio à esq.

**09 · HOLOGRAM** — três planos biológicos atravessando um ao outro numa
leitura só: células multiplicando, células fechando uma falha, células
mineralizando. *Julgue por um e você se engana.* calor 50 · vazio à dir.

**10 · O laço fecha** — o campo do movimento 04 volta, com outra forma. A
próxima busca já começa melhor. calor 20 · vazio ao centro.

Coda: a definir com o Vinicius — ele recusou a versão em frase. Preferência
minha: o laço, seguido da mão enluvada pondo a próxima pergunta.
