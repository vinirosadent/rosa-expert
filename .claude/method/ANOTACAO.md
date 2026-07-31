# A camada de anotação — o que aparece escrito na tela

**Por que este arquivo existe.** Tentei ensinar pH com um véu de íons variando
ao longo do corpo de prova. Vinicius: *"uma pessoa vendo aqui jamais vai saber
que é pH."* Estava certo, e o erro era pior que não ensinar — um gradiente ao
longo do corpo lê como variação no **espaço**, e a alcalinidade varia no
**tempo**. A imagem dizia algo falso.

Conclusão: **quantidade não é filmável por substância.** Medição precisa de
eixo, de tempo marcado e de número. A imagem carrega o fenômeno; a anotação
carrega a medida.

**Regra de trabalho:** a anotação de um plano se escreve ANTES de o plano ser
gerado. Se não dá para escrever o rótulo, o plano não existe.

**Onde mora:** HTML/SVG por cima do vídeo, na tipografia e nas cores do site,
no relógio do filme. Nada queimado no pixel — nítido, traduzível, editável,
acessível. É a mesma máquina da seção premise, fazendo mais.

**Nada aqui é inventado.** Toda propriedade, faixa e gene vem do JDR
2023;102(13):1425–1433 e da página Living Matter Engines.

---

## Estrutura de cada anotação

- **rótulo** — nome curto, entra com o plano, fica
- **frase** — uma linha, o fato que o plano ensina
- **marcas** — o que é apontado na imagem: eixos, valores, nomes de ensaio

---

## 01 · O IMPASSE

**rótulo** Cinco propriedades, uma receita
**frase** Um cimento de capeamento tem de endurecer em tempo útil, selar,
aparecer no raio-X e ainda deixar a polpa construir.
**marcas** os cinco nomes entrando um a um sobre o corpo de prova:
*tempo de presa · pH · escoamento · resistência à compressão · radiopacidade*

## 02 · O TROCO

**rótulo** As propriedades se puxam
**frase** Mais água escoa melhor e enfraquece. Mais zircônia aparece no raio-X
e enfraquece.
**marcas** sobre a fratura: *água ↑ → escoamento ↑ · resistência ↓*
e, no segundo plano rimado: *zircônia ↑ → radiopacidade ↑ · resistência ↓*
**rodapé** Nenhuma receita maximiza tudo ao mesmo tempo.

## 03 · AS DUAS ENTRADAS

**rótulo** Material e biologia entram juntos
**frase** O que o material é e o que as células fazem com ele são medidos lado
a lado, e alimentam o mesmo modelo.
**marcas** plano frio: *composição do pó · zircônia · razão água/pó*
plano quente: *proliferação · migração · mineralização*

## 04 · HYPERFIELD

**rótulo** Testar o que importa, não tudo
**frase** Um arranjo ortogonal responde a mesma pergunta com uma fração dos
experimentos.
**marcas** **243 → 11**, a contagem caindo enquanto o campo dobra.
Nao e' numero inventado: e' a propria conta do interativo da pagina
(`fullCount` e `dof1` em ai-living-lab.html) para os cinco fatores a tres
niveis cada — 3^5 = 243 combinacoes, contra 1 + 5x2 = 11 corridas.

## 05 · RESONANCE

**rótulo** Poucos fatores movem a agulha
**frase** Para um dado alvo, só um punhado de variáveis muda o resultado. O
resto é ruído.
**marcas** sobre o primeiro par: *muda* · sobre os outros dois: *não muda*

## 06 · JANUS — leva gráfico

**rótulo** As primeiras horas preveem as semanas
**frase** pH às 3 h e às 24 h, mais a área do corpo de prova, preveem o platô
de 28 dias.
**marcas** **gráfico HTML/SVG desenhado por cima**, eixo x em tempo
(3 h · 24 h · 28 dias), eixo y em pH. Os dois pontos iniciais entram, a curva
se projeta, o platô assenta, e a **janela bioativa** aparece como faixa: de
menos não faz nada, de mais estressa a célula.
Este é o plano onde a substância sozinha mentia. O gráfico é obrigatório.

## 07 · DARWINIAN — a inversão

**rótulo** Diga a propriedade; o modelo devolve a receita
**frase** Um algoritmo genético evolui uma população de formulações contra o
perfil alvo. As inaptas somem; a população converge.
**marcas** no plano da seleção: *geração* subindo. No plano da inversão, os
três pós ganham nome: *composição do pó · zircônia · água*
**rodapé** É aqui que o sentido se inverte: até agora, material → dado.
Daqui em diante, alvo → material.

## 08 · A BANCADA DECIDE — leva números

**rótulo** Previsto contra medido
**frase** A receita prescrita é fabricada e ensaiada: o que o modelo previu tem
de aparecer na bancada.

*Nota:* a frase deliberadamente **não** cita "os quatro cimentos do estudo",
embora isso seja verdade do paper. Se citasse, o leitor ligaria os valores
ilustrativos da tabela abaixo aos resultados publicados — e aí a ressalva do
rótulo não salvaria. O crédito ao paper, se entrar, entra em outro beat.
**marcas** cinco pares alvo/medido caindo quase na mesma marca:

| propriedade | alvo | medido |
|---|---|---|
| tempo de presa | 15 min | 16 min |
| pH em 24 h | 11,5 | 11,3 |
| escoamento | 22 mm | 21 mm |
| resistência à compressão | 55 MPa | 57 MPa |
| radiopacidade | 6,0 mm Al | 5,8 mm Al |

Valores **ilustrativos**, autorizados pelo Vinicius, plausíveis para cimento
endodôntico de silicato de cálcio. Por isso os rótulos dizem **alvo** e
**medido** — que é verdade do método — e o filme **não** afirma que estes são
os quatro cimentos do estudo. Próximos e não idênticos de propósito: validação
real não coincide perfeitamente.

## 09 · HOLOGRAM

**rótulo** Julgar por um endpoint engana
**frase** Um material pode fazer a célula multiplicar e ainda assim impedi-la
de migrar. O Digital BioScore lê os três domínios como um perfil só.
**marcas** sobre as três regiões da mesma camada: *proliferação · migração ·
mineralização*, e o resultado em polpa: *RUNX2 ↑ · COL-1 ↑ · ALP ↑*

## 10 · O LAÇO

**rótulo** O resultado afia o próximo modelo
**frase** A evidência validada volta para o modelo, e a busca seguinte começa
de um conjunto menor e melhor mirado.
**marcas** nenhuma — o plano fecha limpo.

**Coda** — sobre a imagem do laço, nunca num cartão isolado:

> Designing the materials that should exist.

Escolha do Vinicius, e ela faz uma coisa que nenhuma outra faria: é
**exatamente o título da seção premise**, três seções acima na mesma home. A
premissa abre com essa frase como promessa; o filme do método termina nela
tendo mostrado como se cumpre. A página inteira vira um arco fechado.

Por isso a tipografia da coda deve citar a da premissa — mesma família, mesmo
peso, mesmo tamanho relativo — para o eco ser reconhecido e não parecer
repetição acidental.

---

## Decidido em 2026-08-01

1. **04** usa 243 → 11, a conta da própria página.
2. **08** usa valores ilustrativos autorizados, rotulados alvo/medido.
3. **Coda** é a frase de fecho do site, sobre a imagem do laço.

Falta só: **idioma**. O site é em inglês; este roteiro está em português para
leitura. A anotação final vai em inglês.
