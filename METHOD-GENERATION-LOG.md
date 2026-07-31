# METHOD — log de geração

O filme da seção que substitui a linha estática 1-2-3-4 na home. Higgsfield.

**As entradas ficam em `_source/method/`, que NÃO é versionado** (580 MB). Este
arquivo existe para que tudo seja regerável sem refazer a curadoria. Os job IDs
abaixo são a única cópia dessa informação — se `_source/` sumir, é por aqui que
se reconstrói.

Documentos irmãos, esses sim versionados:
`.claude/method/FILME.md` (folha de câmera e regras de registro) ·
`.claude/method/ANOTACAO.md` (o que aparece escrito na tela) ·
`.claude/method/grade.py` (graduação de cor) ·
`.claude/method/build.sh` (montagem — ainda a versão da primeira tentativa)

---

## Primeira tentativa — DESCARTADA

Onze clipes a partir dos 22 keyframes que Vinicius forneceu (`Images video.zip`),
montados em `assets/method/method-sequence.mp4`, 40,83s. **O arquivo ainda está
no disco e não está ligado a nenhuma página.**

Veredito dele: *"isso são as figuras com alguns efeitos. eu quero que isso seja
um filme, não uma sequência de fotos com efeitos."* E depois: *"sua decisão de
5s cada não leva em consideração a necessidade do tempo, leva só em consideração
um stitch preguiçoso."*

Estava certo. O diagnóstico completo: 12 planos em 12 mundos diferentes, todos
de 5s porque 5s era o padrão do modelo, câmera travada em todos (apliquei a
lição errada da premissa — o tremor de lá vinha do filtro `zoompan` do ffmpeg
arredondando corte para pixel inteiro, nada a ver com câmera generativa), e
metade dos planos eram **infográficos** com monitor, painel e inset. Não se move
câmera dentro de um diagrama.

Job IDs da tentativa descartada, caso alguma coisa de lá volte a servir:

| clipe | keyframes | job (pro/1080p) |
|---|---|---|
| c1 condicionamento | 19 | `2b659066-ce2d-450b-90d5-dd239d06838b` |
| c2 eluato | 20 | `c1622421-ffe7-439d-a35a-147d5b673116` |
| c3a migração | 10→11 | `7687d12f-16e1-42ec-8e55-5f2f7185b687` |
| c3b migração | 11→12 | `89775f39-defa-4f7c-8d12-129160359b9b` |
| c4 mineralização | 21 | `994e05fe-1548-4e41-86a1-d903a3cc36ad` |
| c5 integração | 07 | `6a27c0f5-bf21-458b-975f-500152d13717` |
| c6 modelo | 08 | `de5afd00-f258-46e0-9db7-e0840057216f` |
| c7 seleção | 09→13 | `fd032a69-cc2f-4b63-b8df-310dc83e587d` |
| c8a pesagem | 14→15 | `26787814-2d01-4be0-95c5-de1402b1e803` |
| c8b corpos de prova | 15→17 | `480052c5-ba9c-4138-966e-d4b3260f4404` |
| c9 laço | 22 | `a6b8322b-5a7f-4bf9-bbd2-02dc7a39b9ff` |

Os 22 keyframes originais e seus `media_id` estão em
`_source/method/media_ids.json`.

---

## Segunda tentativa — a que vale

Registro decidido depois de comparar três direções lado a lado (aquarela
desenhada · híbrido · volumétrico luminoso). Venceu o **volumétrico luminoso**,
que é o mesmo registro do filme da premissa. Critério de Vinicius: não ter
**três times visuais** na mesma página (hero · premissa · método).

Ver `.claude/method/FILME.md` para as regras completas. As que mais custaram:
uma temperatura por quadro · o fundo ivory nunca sai · fenômeno é filme, medida
é HTML.

### Referências de estilo (usar como `medias` em toda geração)

| papel | id |
|---|---|
| íons no campo alcalino — frio, aprovado | `532c6f65-76ab-4bfb-a545-58e941340599` |
| células com mineral — quente, aprovado | `caed091f-5725-4c3e-9f35-50bd79ff7b0b` |
| premissa · matter (upload) | `24c1bcbd-bf9d-4d64-99ca-992fcdf5f6b2` |
| premissa · life (upload) | `13e14ab7-b8ed-4907-baa0-3d5dcca3bcb8` |

### Keyframes — `nano_banana_pro`, 2k, 16:9

| plano | job id |
|---|---|
| M02a material | `10ecf541-8869-45a7-a82f-12b0e3e8ef31` |
| M02b biologia | `c8acff2a-1077-47c3-a0e1-13f73d26c276` |
| M03 falha sob carga | `e53a5e20-9e0b-4d40-93a0-4020af657719` |
| M04a campo completo | `9eb998c2-ab4c-4f63-abf7-72d783491f57` |
| M04b campo reduzido | `bd85a606-9a52-46cf-9178-6c054ed9eb88` |
| M05 resonance (três pares) | `68ca4f53-e8e8-4316-a2b6-044512bcb2ef` |
| M06 janus (véu e platô) | `6d71f8b0-4ea7-418a-a1ad-00c31dbb9a07` |
| M07a seleção | `e4d02083-8cad-4a27-b058-5c926ce2a826` |
| M07b inversão | `fed4f2bd-ecf0-4e95-9b37-bb7baa18d94d` |
| M08 bancada (luva + jaleco) | `45b7e5a8-04a0-40b4-a7fd-8ef014981add` |
| M09 hologram | `2504bb9a-7bb1-4cff-849b-fd010fcc9bb2` |
| M10 laço | `24d47edd-ea7a-47f3-9b1a-f8370cc94aa7` |

Graduados em `_source/method/graded/`. A tabela de parâmetros por plano está em
`FILME.md` — o gerador entrega ivory 2 a 3× mais quente que a referência, em
todos os quadros, sem exceção.

### Clipes — `kling3_0`, `mode:pro`, `sound:off`, 1080p

`pro` custa o mesmo que `std` (8,75) e o filme é mudo. Não há motivo para `std`
neste projeto.

| clipe | dur | job id | veredito |
|---|---|---|---|
| v03 falha | 5s | `ab962422-da54-44f0-b4a3-dbca54105cdf` | bom |
| v05 resonance | 5s | `a1ff4380-ddb2-4630-8220-00629a61abdd` | bom até ~3s; depois a fileira se estende |
| v06 janus | 8s | `e1066f70-fb1a-4f97-8ea4-21431b3d6408` | bom |
| v07b inversão | 8s | `27831541-99a7-4403-83c6-59970d267719` | bom |
| v02b biologia | 5s | `ab2b657b-21a6-4c6b-bdf0-f7be5aa5f901` | bom |
| v07a seleção | 5s | `8d46c44a-8c10-4979-8ce4-ed081564006a` | passa; corpos flutuam sem motivo |
| v04a placa viva | 5s | `2ddf6f2c-b74b-49e6-8268-ae799b4105e0` | bom |
| v04b placa viva | 5s | `1c7d03d3-0425-4bc0-9670-d4c71d4dff42` | bom |

**Descartados, e por quê:**

| clipe | job id | falha |
|---|---|---|
| v04 dobra | `185c76f1-e6a3-4d98-a3b2-4dfece55c0d8` | pedi desvanecimento sem sair do lugar; o modelo moveu a câmera e rearranjou o campo |
| v02a motes (1ª) | `98c13df0-0e7d-4f74-9ef3-67c0404b7a4b` | o fluxo de motes some |
| v02a motes (2ª) | `8946eb69-1c9a-413d-95f9-23026f9f1284` | idem — mote pálido sobre ivory claro não tem contraste. Não é problema de prompt |

Esses três descartes ensinaram a mesma coisa e por isso a regra existe:
**desvanecimento é composição, não geração; fluxo de dado é HTML, não vídeo.**

### Falta gerar

Clipes de **M08 bancada**, **M09 hologram** e **M10 laço**. Créditos ao fim do
dia 2026-08-01: **252,75**.

### Depois disso

1. Montagem — corte por beat (não 5s uniformes), graduação por plano, dobra do
   campo por dissolução entre `v04a-placa` e `v04b-placa`.
2. Camada de anotação HTML/SVG, conforme `ANOTACAO.md`. Ainda em português no
   documento; a versão final vai em inglês.
3. A seção na home, substituindo a linha 1-2-3-4.

---

## Armadilhas do ambiente (valem para o repositório inteiro)

- **`ffmpeg` dentro de `while read` engole o stdin do laço.** Sintoma absurdo:
  `s05-mineral` chegava ao ffmpeg como `05-mineral`, um plano por vez, e só o
  `ffprobe` seguinte dava pela falta do arquivo. `ffmpeg -nostdin` resolve, e é
  obrigatório em qualquer laço deste repositório.
- **`/tmp` não existe para o ffmpeg nativo do Windows.** Usar
  `$LOCALAPPDATA/Temp`, mesmo rodando no bash.
- **`curl` pelo mount do Drive falha o handshake TLS**
  (`CRYPT_E_NO_REVOCATION_CHECK`). Precisa de `--ssl-no-revoke` em todo PUT e
  GET.
- **A URL de resultado do Higgsfield carrega a hora de conclusão** e não dá para
  adivinhar. Pegar sempre por `job_display` ou `show_generations`.
- **Alguns prompts disparam recomendação de preset** ("IN THE DARK", "DROWN IN
  MUSIC") — o classificador lê "no lens flare, no film grain" como pedido de
  estética escura. Reenviar com `declined_preset_id` e acrescentar *bright
  evenly-lit scene* ao bloco de estilo.
