"""Grada um quadro do filme do metodo para a temperatura que a cena pede.

Porque isto existe: o gerador entrega ivory sistematicamente mais quente que a
referencia aprovada. Medido nos primeiros oito quadros, o calor (R-B medio) saiu
entre 19 e 31 com alvos de 7 a 12 — um vies de 2 a 3x, em TODOS eles. Repetir a
geracao nao converge e custa 2 creditos por tentativa; graduacao converge, e' de
graca e e' o que se faz em filme de verdade.

O alvo nao e' so' o calor. A referencia tem calor 7,0 COM saturacao 18,5: a cor
esta la', so' que fria. Tirar o calor sozinho leva a saturacao junto (medido:
12,6), e o quadro fica lavado. Por isso a busca e' em DUAS variaveis — esfriar e
devolver cor — e nao em sequencia.

A busca e' em DOIS ESTAGIOS. A versao ingenua varria 25x18 combinacoes, o que da'
450 chamadas de ffmpeg por quadro e estourou 9 minutos num quadro so'. Aqui o
primeiro estagio encontra o k (quanto esfriar) com a saturacao neutra, e o
segundo refina k e saturacao em volta dele: 6 + 15 = 21 chamadas.

    py .claude/method/grade.py <entrada> <saida> <calor> <saturacao>
"""
import subprocess, sys, os, tempfile

W, H = 240, 135   # medir menor: o vies de cor e' global, nao precisa de resolucao

def medir(p):
    d = tempfile.mkdtemp(); o = os.path.join(d, 'x.ppm')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', p, '-vf',
                    f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}',
                    '-pix_fmt', 'rgb24', o], check=True)
    b = open(o, 'rb').read(); i = b.index(b'255\n') + 4; px = b[i:]
    n = W*H; w = s = 0.0
    for k in range(n):
        r, g, bl = px[k*3], px[k*3+1], px[k*3+2]
        w += r - bl; s += max(r, g, bl) - min(r, g, bl)
    return w/n, s/n

def filtro(k, sat):
    # colorbalance nos meios-tons e nas altas, nao nas baixas: preserva o preto
    # e o branco do papel, entao o ivory nao vira cinza. Foi o erro anterior —
    # um pedido de "estritamente frio" no prompt levou o fundo a -16 de calor.
    return (f'colorbalance=rm={-k:.3f}:bm={k:.3f}:rh={-k*0.6:.3f}:bh={k*0.6:.3f},'
            f'eq=saturation={sat:.2f}')

def aplicar(src, dst, k, sat):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src,
                    '-vf', filtro(k, sat), dst], check=True)

def prova(src, k, sat):
    t = os.path.join(tempfile.mkdtemp(), 't.png')
    aplicar(src, t, k, sat)
    return medir(t)

def resolver(src, calor_alvo, sat_alvo):
    # estagio 1: so' o quanto esfriar, com a saturacao neutra
    grade1 = [i*0.02 for i in range(6)]
    melhor_k, melhor_e = 0.0, None
    for k in grade1:
        w, _ = prova(src, k, 1.0)
        e = abs(w - calor_alvo)
        if melhor_e is None or e < melhor_e:
            melhor_k, melhor_e = k, e
    # estagio 2: refina em volta, agora com a saturacao junto — o peso do calor
    # e' o dobro porque e' ele que carrega o significado (ambar = vida).
    melhor = None
    for dk in (-0.01, 0.0, 0.01):
        k = max(0.0, melhor_k + dk)
        for si in range(10, 25, 3):
            sat = si * 0.1
            w, s = prova(src, k, sat)
            erro = 2*abs(w - calor_alvo) + abs(s - sat_alvo)
            if melhor is None or erro < melhor[0]:
                melhor = (erro, k, sat, w, s)
    return melhor

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    calor, sat = float(sys.argv[3]), float(sys.argv[4])
    a_w, a_s = medir(src)
    erro, k, s, w, sv = resolver(src, calor, sat)
    aplicar(src, dst, k, s)
    print(f'{os.path.basename(src):22} '
          f'calor {a_w:5.1f}->{w:5.1f} (alvo {calor:4.1f})   '
          f'sat {a_s:5.1f}->{sv:5.1f} (alvo {sat:4.1f})   rm=-{k:.2f} sat={s:.2f}')
