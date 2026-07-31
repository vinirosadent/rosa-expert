# rosa.expert

Site estático do laboratório do A/P Vinicius Rosa (NUS). HTML/CSS/JS puro, sem
build system, sem framework, sem dependências. Publicado por GitHub Pages a
partir de `main` — o que está no repositório é o que está no ar.

Vinicius escreve em português; responda em português. **Respostas curtas:**
entregue a conclusão em poucas linhas. Números, medições e raciocínio vão para a
mensagem de commit e para os logs do projeto, não para o chat.

---

## A seção "The premise" na home tem um ponto de retorno

A seção fixada Matter → Intelligence → Life (`index.html`, `<section
id="premise">`) foi aprovada e marcada como **`premissa-v1`**.

Qualquer alteração parte daí. Se não ficar boa, volta-se a esse estado:

```
git checkout premissa-v1 -- index.html assets/premise .claude/premise
```

`git show premissa-v1` descreve a versão inteira: a linha do tempo, os pesos, as
invariantes e o que já foi tentado e rejeitado.

### Antes de commitar qualquer mudança nessa seção

```
py .claude/premise/checks/timing.py      # a tabela do corte e as 7 invariantes
py .claude/premise/checks/shipped.py     # index.html reproduz a tabela
py .claude/premise/checks/film_audit.py  # tremor, beats mortos, coluna ivory
```

Os três têm de passar. **Não são cerimônia:** cada invariante existe porque a
seção errou aquilo pelo menos uma vez, e o erro era invisível numa captura de
tela. A mais teimosa: *a matéria não pode começar a mudar enquanto a legenda 01
ainda está sendo lida* — isso quebrou de três formas diferentes.

Para reconstruir o filme: `bash .claude/premise/build.sh`. As entradas ficam em
`_source/premise/`, que **não** é versionado (arquivos grandes). Os job IDs de
tudo estão em `PREMISE-GENERATION-LOG.md`, então dá para regerar.

O telefone recebe **outro corte**, `premise-mobile.mp4`, 4:5 — não o 16:9
espremido numa faixa. Os dois arquivos têm de ter a mesma duração e o mesmo
número de quadros, porque compartilham uma só tabela de legendas; `shipped.py`
verifica isso.

### O que já foi tentado nessa seção e rejeitado

Não repita sem motivo novo:

- **scroll raspando o clipe** — dessincronizava texto e imagem;
- **deriva de câmera com `zoompan`** — treme, porque o filtro arredonda o corte
  para pixel inteiro (medido: 10 inversões de sinal por 100 quadros);
- **quatro aberturas com movimento de imagem**, incluindo partículas WebGL reais
  amostradas do próprio scaffold — todas lidas como pesadas ou arbitrárias. A
  abertura hoje é só a premissa em ivory, e carrega o movimento na tipografia.

---

## Testar localmente

```
python .claude/devserver.py 8128
```

Use este servidor, **não** `python -m http.server`: aquele não implementa HTTP
Range, e sem Range o navegador reporta `video.seekable = [0,0]`. Já custou um
diagnóstico inteiro.

---

## Convenções

- Comentários e mensagens de commit explicam **por quê**, não o quê — de
  preferência com o número que motivou a decisão. O histórico desta seção é a
  referência do tom.
- Tokens de design em `assets/css/tokens.css`. Use-os; mas o token não é lei:
  `--ease-out` é um expo-out e está errado para varreduras, por exemplo.
- Nada de texto embutido em imagem: toda a tipografia é HTML.
- O painel de preview do Claude Code **não dispara `requestAnimationFrame`** e o
  relógio de animação fica parado em zero. Verificação de animação aqui é
  numérica e geométrica, nunca visual — foi isso que escondeu dois bugs.
