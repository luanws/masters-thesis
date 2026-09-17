"""Gera as imagens usadas em build.js (pasta presentation/assets).

Fotos: inspeções por drone da CPFL (repositório drones-ia-cpfl) e uma imagem do CPLID.
Ilustrações: SVG desenhado aqui e rasterizado pelo LibreOffice (etapa pulada se ele não
estiver instalado, mantendo os PNGs já gerados). A ilustração do impacto e as miniaturas
do roteiro são desenhadas direto com a PIL.

Uso: python presentation/make_assets.py
Variáveis: DRONES_ROOT (padrão ../../../drones-ia-cpfl), SOFFICE.
"""
import os
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

HERE = Path(__file__).resolve().parent
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)
DRONES = Path(os.environ.get("DRONES_ROOT", HERE / ".." / ".." / ".." / "drones-ia-cpfl")).resolve()
ISOOX = DRONES / "detector-api-metrics-generator" / "data" / "ISOOX"
CPLID = DRONES / "learn-datasets" / "test" / "resources" / "images" / "0049.jpg"
SOFFICE = os.environ.get("SOFFICE", r"C:\Program Files\LibreOffice\program\soffice.exe")

NIGHT = (18, 38, 58)


def abrir(p, max_lado=None):
    im = Image.open(p)
    if max_lado:
        im.draft("RGB", (max_lado, max_lado))
    return ImageOps.exif_transpose(im).convert("RGB")


def recorte(im, box, tamanho):
    return im.crop(box).resize(tamanho, Image.LANCZOS)


def salvar(im, nome, q=82):
    im.save(OUT / nome, quality=q, optimize=True)
    print("ok", nome, im.size)


def gradiente(im, a_esq, a_dir):
    """Escurece a imagem com azul-noite, da esquerda (a_esq) para a direita (a_dir)."""
    w, h = im.size
    mascara = Image.new("L", (w, 1))
    for x in range(w):
        t = max(0.0, (x / (w - 1) - 0.45) / 0.55)  # escuro uniforme até 45% da largura
        mascara.putpixel((x, 0), int(255 * (a_esq + (a_dir - a_esq) * t)))
    mascara = mascara.resize((w, h))
    return Image.composite(Image.new("RGB", im.size, NIGHT), im, mascara)


# ---------------------------------------------------------------------------
# Fotos
# ---------------------------------------------------------------------------
aerea_corrosao = abrir(ISOOX / "corrosao" / "corrosao (10).JPG")      # 4000x2250
aerea_campo = abrir(ISOOX / "oxidacao" / "oxid-um-ano (10).JPG")       # 4000x2250
torre_baixo = abrir(ISOOX / "ok" / "ok (1).JPG")                       # 4000x2250
torre_ceu = abrir(ISOOX / "ok" / "ok (10).JPG")                        # 4000x2250
pino_corroido = abrir(ISOOX / "corrosao" / "corrosao (1).JPG")         # 2448x3264
disco_oxidado = abrir(ISOOX / "oxidacao" / "oxid-um-ano (1).JPG")      # 3456x4608
cplid = abrir(CPLID)                                                   # 1152x864

salvar(gradiente(aerea_corrosao.resize((1920, 1080), Image.LANCZOS), 0.93, 0.15), "capa.jpg")
salvar(gradiente(torre_ceu.resize((1920, 1080), Image.LANCZOS), 0.9, 0.55), "encerramento.jpg")
salvar(recorte(aerea_corrosao, (1750, 0, 4000, 2250), (1100, 1100)), "aerea_recorte.jpg")
salvar(recorte(cplid, (0, 164, 1152, 700), (1290, 600)), "cplid_faixa.jpg")
salvar(recorte(aerea_campo, (300, 250, 3700, 1831), (1290, 600)), "campo_faixa.jpg")
salvar(recorte(torre_baixo, (975, 0, 3225, 2250), (1200, 1200)), "cadeia_torre.jpg")
salvar(recorte(pino_corroido, (0, 300, 2448, 2748), (900, 900)), "defeito_corrosao.jpg")
salvar(recorte(disco_oxidado, (0, 700, 3456, 4156), (900, 900)), "defeito_oxidacao.jpg")
salvar(recorte(cplid, (144, 0, 1008, 864), (900, 900)), "cplid_quadrado.jpg")
salvar(cplid.resize((1200, 900), Image.LANCZOS), "cplid.jpg")
salvar(recorte(aerea_campo, (700, 100, 3300, 2050), (1200, 900)), "campo.jpg")

# Mosaico: o volume de imagens que uma campanha de drone produz
arquivos = []
for pasta in ("ok", "oxidacao", "corrosao"):
    todos = sorted((ISOOX / pasta).glob("*.JPG"))
    arquivos += todos[:: max(1, len(todos) // 8)][:8]
arquivos = [arquivos[i] for k in range(8) for i in (k, 8 + k, 16 + k) if i < len(arquivos)]
cw, ch, cols, rows, gap = 320, 240, 6, 4, 8
mosaico = Image.new("RGB", (cols * cw + (cols - 1) * gap, rows * ch + (rows - 1) * gap), (255, 255, 255))
for i, arq in enumerate(arquivos[: cols * rows]):
    im = ImageOps.fit(abrir(arq, 1200), (cw, ch), Image.LANCZOS)
    mosaico.paste(im, ((i % cols) * (cw + gap), (i // cols) * (ch + gap)))
salvar(mosaico, "mosaico.jpg")

# Demonstração dos tratamentos sobre a mesma imagem de campo
base = recorte(aerea_campo, (700, 100, 3300, 2050), (640, 480))
cinza = ImageOps.grayscale(base)
bordas = ImageOps.autocontrast(cinza.filter(ImageFilter.GaussianBlur(1.2)).filter(ImageFilter.FIND_EDGES), cutoff=2)
tratamentos = {
    "proc_original.jpg": base,
    "proc_contraste.jpg": ImageEnhance.Contrast(base).enhance(1.6),
    "proc_equalizacao.jpg": ImageOps.equalize(base),
    "proc_cinza.jpg": cinza.convert("RGB"),
    "proc_desfoque.jpg": base.filter(ImageFilter.GaussianBlur(7)),
    "proc_bordas.jpg": bordas.convert("RGB"),
}
for nome, im in tratamentos.items():
    salvar(im, nome, q=85)
salvar(ImageOps.fit(tratamentos["proc_contraste.jpg"], (480, 480), Image.LANCZOS), "proc_contraste_q.jpg", q=85)

# Diagnóstico ilustrativo: a mesma imagem de campo com a região inspecionada marcada
diag = base.copy()
d = ImageDraw.Draw(diag)
d.rectangle((250, 140, 470, 330), outline=(245, 165, 74), width=7)
salvar(diag, "proc_diagnostico.jpg", q=85)


# ---------------------------------------------------------------------------
# Ilustrações em SVG
# ---------------------------------------------------------------------------
INK, TEAL, AMBER, MUTED, GLASS, STEEL = "#12263A", "#1C7293", "#F5A54A", "#5C6F80", "#9FD3E6", "#8193A3"


def torre(cx, topo, base, larg_base=130, cor=INK, braco=(160, 130, 160)):
    """Torre treliçada simples com três mísulas e cadeias de isoladores."""
    h = base - topo
    s = []
    lt, rt = cx - 16, cx + 16
    lb, rb = cx - larg_base / 2, cx + larg_base / 2
    s.append(f'<polyline points="{lt},{topo} {lb},{base}" stroke="{cor}" stroke-width="6" fill="none"/>')
    s.append(f'<polyline points="{rt},{topo} {rb},{base}" stroke="{cor}" stroke-width="6" fill="none"/>')
    n = 7
    for i in range(n):
        y1 = topo + h * i / n
        y2 = topo + h * (i + 1) / n
        xl1 = lt + (lb - lt) * i / n
        xr1 = rt + (rb - rt) * i / n
        xl2 = lt + (lb - lt) * (i + 1) / n
        xr2 = rt + (rb - rt) * (i + 1) / n
        s.append(f'<line x1="{xl1}" y1="{y1}" x2="{xr2}" y2="{y2}" stroke="{cor}" stroke-width="3"/>')
        s.append(f'<line x1="{xr1}" y1="{y1}" x2="{xl2}" y2="{y2}" stroke="{cor}" stroke-width="3"/>')
    pontas = []
    for k, (dy, w) in enumerate(zip((0.10, 0.24, 0.38), braco)):
        y = topo + h * dy
        s.append(f'<line x1="{cx - w / 2}" y1="{y}" x2="{cx + w / 2}" y2="{y}" stroke="{cor}" stroke-width="6"/>')
        s.append(f'<line x1="{cx - w / 2}" y1="{y}" x2="{cx - 14}" y2="{y + 22}" stroke="{cor}" stroke-width="3"/>')
        s.append(f'<line x1="{cx + w / 2}" y1="{y}" x2="{cx + 14}" y2="{y + 22}" stroke="{cor}" stroke-width="3"/>')
        for lado in (-1, 1):
            x = cx + lado * (w / 2 - 6)
            for j in range(4):
                s.append(f'<ellipse cx="{x}" cy="{y + 9 + j * 8}" rx="9" ry="3.5" fill="{GLASS}" stroke="{TEAL}" stroke-width="1.5"/>')
            pontas.append((x, y + 42))
    return "\n".join(s), pontas


def catenaria(x1, y1, x2, y2, flecha=26, cor=MUTED, w=2.5):
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + flecha * 2
    return f'<path d="M{x1},{y1} Q{mx},{my} {x2},{y2}" stroke="{cor}" stroke-width="{w}" fill="none"/>'


def svg_sep():
    W, H, CHAO = 2000, 560, 470
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
         f'<line x1="20" y1="{CHAO}" x2="{W - 20}" y2="{CHAO}" stroke="#DCE3EA" stroke-width="4"/>']
    # geração hidráulica
    p.append(f'<polygon points="30,300 175,300 175,{CHAO} 30,{CHAO}" fill="{GLASS}"/>')
    p.append(f'<path d="M40,325 q18,-12 36,0 t36,0 t36,0" stroke="#FFFFFF" stroke-width="4" fill="none"/>')
    p.append(f'<polygon points="165,230 215,230 305,{CHAO} 165,{CHAO}" fill="#C9D3DC" stroke="{INK}" stroke-width="4"/>')
    p.append(f'<rect x="235" y="385" width="95" height="85" fill="{INK}"/>')
    p.append(f'<circle cx="282" cy="330" r="30" fill="#FFFFFF" stroke="{AMBER}" stroke-width="6"/>')
    p.append(f'<path d="M262,330 q10,-16 20,0 t20,0" stroke="{AMBER}" stroke-width="5" fill="none"/>')
    # transmissão
    t1, pts1 = torre(560, 110, CHAO)
    t2, pts2 = torre(860, 110, CHAO)
    p += [t1, t2]
    for (xa, ya), (xb, yb) in zip(pts1[1::2], pts2[0::2]):
        p.append(catenaria(xa, ya, xb, yb))
    for (xa, ya) in pts1[0::2]:
        p.append(catenaria(330, 390, xa, ya, 10))
    for (xb, yb) in pts2[1::2]:
        p.append(catenaria(xb, yb, 1010, 330, 12))
    hx, hy = pts2[1]
    p.append(f'<circle cx="{hx}" cy="{hy - 20}" r="44" fill="none" stroke="{AMBER}" stroke-width="6"/>')
    # subestação
    p.append(f'<rect x="1000" y="300" width="250" height="170" fill="none" stroke="{MUTED}" stroke-width="3" stroke-dasharray="12,8"/>')
    p.append(f'<line x1="1010" y1="330" x2="1240" y2="330" stroke="{INK}" stroke-width="6"/>')
    for x in (1040, 1150):
        p.append(f'<rect x="{x}" y="380" width="70" height="75" rx="6" fill="{TEAL}"/>')
        for dx in (15, 35, 55):
            p.append(f'<line x1="{x + dx}" y1="380" x2="{x + dx}" y2="335" stroke="{INK}" stroke-width="4"/>')
    # distribuição
    for x in (1400, 1580):
        p.append(f'<rect x="{x - 7}" y="270" width="14" height="{CHAO - 270}" fill="{STEEL}"/>')
        p.append(f'<rect x="{x - 55}" y="282" width="110" height="10" fill="{INK}"/>')
    for dx in (-45, 0, 45):
        p.append(catenaria(1245, 330, 1400 + dx, 282, 8, w=2))
        p.append(catenaria(1400 + dx, 282, 1580 + dx, 282, 14, w=2))
        p.append(catenaria(1580 + dx, 282, 1760, 360, 8, w=2))
    # consumo
    for x, h in ((1690, 90), (1790, 110)):
        p.append(f'<rect x="{x}" y="{CHAO - h}" width="80" height="{h}" fill="#E4EAF0" stroke="{INK}" stroke-width="3"/>')
        p.append(f'<polygon points="{x - 10},{CHAO - h} {x + 40},{CHAO - h - 45} {x + 90},{CHAO - h}" fill="{INK}"/>')
        p.append(f'<rect x="{x + 28}" y="{CHAO - 40}" width="24" height="40" fill="{AMBER}"/>')
    p.append(f'<polygon points="1890,{CHAO} 1890,360 1925,330 1925,360 1960,330 1960,360 1985,340 1985,{CHAO}" fill="{STEEL}" stroke="{INK}" stroke-width="3"/>')
    # rótulos
    for x, texto in ((170, "Geração"), (710, "Transmissão"), (1125, "Subestação"), (1490, "Distribuição"), (1840, "Consumo")):
        p.append(f'<text x="{x}" y="530" font-family="Calibri, Arial" font-size="38" font-weight="bold" fill="{MUTED}" text-anchor="middle">{texto}</text>')
    p.append("</svg>")
    return "\n".join(p)


def svg_drone():
    W, H = 1400, 760
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
         f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>']
    # mísula treliçada e cadeia de isoladores
    p.append(f'<rect x="760" y="120" width="640" height="70" fill="none" stroke="{INK}" stroke-width="8"/>')
    for i in range(8):
        x = 760 + i * 80
        p.append(f'<line x1="{x}" y1="120" x2="{x + 80}" y2="190" stroke="{INK}" stroke-width="4"/>')
    p.append(f'<line x1="1000" y1="190" x2="1000" y2="215" stroke="{INK}" stroke-width="6"/>')
    for j in range(9):
        y = 235 + j * 42
        cor_borda = AMBER if j == 5 else TEAL
        p.append(f'<ellipse cx="1000" cy="{y}" rx="58" ry="17" fill="{GLASS}" stroke="{cor_borda}" stroke-width="{7 if j == 5 else 3}"/>')
        p.append(f'<rect x="992" y="{y + 12}" width="16" height="20" fill="{STEEL}"/>')
    p.append(f'<path d="M620,700 Q1000,640 1400,700" stroke="{MUTED}" stroke-width="10" fill="none"/>')
    p.append(f'<line x1="1000" y1="610" x2="1000" y2="672" stroke="{INK}" stroke-width="8"/>')
    # campo de visão da câmera
    p.append(f'<polygon points="420,640 915,420 1090,560" fill="{AMBER}" fill-opacity="0.22"/>')
    p.append(f'<rect x="925" y="420" width="150" height="110" fill="none" stroke="{AMBER}" stroke-width="6" stroke-dasharray="18,10"/>')
    # drone
    p.append(f'<line x1="170" y1="560" x2="660" y2="560" stroke="{INK}" stroke-width="18" stroke-linecap="round"/>')
    for x in (170, 660):
        p.append(f'<rect x="{x - 20}" y="520" width="40" height="40" rx="6" fill="{INK}"/>')
        p.append(f'<ellipse cx="{x}" cy="512" rx="140" ry="16" fill="{TEAL}" fill-opacity="0.55"/>')
    for x in (270, 560):
        p.append(f'<ellipse cx="{x}" cy="485" rx="100" ry="11" fill="{TEAL}" fill-opacity="0.35"/>')
        p.append(f'<line x1="{x}" y1="492" x2="{x}" y2="545" stroke="{INK}" stroke-width="10"/>')
    p.append(f'<rect x="320" y="520" width="190" height="85" rx="26" fill="{INK}"/>')
    p.append(f'<rect x="345" y="540" width="60" height="10" rx="5" fill="{AMBER}"/>')
    p.append(f'<polyline points="345,605 315,690 280,690" stroke="{INK}" stroke-width="9" fill="none"/>')
    p.append(f'<polyline points="485,605 515,690 550,690" stroke="{INK}" stroke-width="9" fill="none"/>')
    p.append(f'<rect x="395" y="605" width="40" height="18" fill="{STEEL}"/>')
    p.append(f'<circle cx="420" cy="645" r="30" fill="{INK}"/>')
    p.append(f'<circle cx="428" cy="640" r="13" fill="{AMBER}"/>')
    p.append("</svg>")
    return "\n".join(p)


def svg_rede_neural():
    W, H = 900, 675
    camadas = [(150, 4), (350, 6), (550, 6), (750, 2)]
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
         f'<rect width="{W}" height="{H}" fill="#F1F4F7"/>']
    pos = [[(x, H / 2 + (i - (n - 1) / 2) * 82) for i in range(n)] for x, n in camadas]
    for a, b in zip(pos, pos[1:]):
        for (x1, y1) in a:
            for (x2, y2) in b:
                p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#A9BCCC" stroke-width="2"/>')
    for k, camada in enumerate(pos):
        for (x, y) in camada:
            cor = AMBER if k == len(pos) - 1 else TEAL
            p.append(f'<circle cx="{x}" cy="{y}" r="26" fill="{cor}" stroke="#FFFFFF" stroke-width="4"/>')
    p.append("</svg>")
    return "\n".join(p)


svgs = {"sep.svg": svg_sep(), "drone.svg": svg_drone(), "rede_neural.svg": svg_rede_neural()}
if Path(SOFFICE).exists():
    for nome, conteudo in svgs.items():
        (OUT / nome).write_text(conteudo, encoding="utf-8")
    subprocess.run([SOFFICE, "--headless", "--convert-to", "png", "--outdir", str(OUT)]
                   + [str(OUT / n) for n in svgs], check=True, capture_output=True)
    for nome in svgs:
        (OUT / nome).unlink()
        print("ok", nome.replace(".svg", ".png"))
else:
    print("LibreOffice não encontrado: mantidas as ilustrações SVG já rasterizadas em assets/")


def desenhar_impacto(tamanho=900, s=2):
    """Linha levando energia até uma casa iluminada, com selo de continuidade (desenhado com PIL)."""
    rgb = lambda h: tuple(int(h.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4))
    im = Image.new("RGB", (tamanho * s, tamanho * s), (255, 255, 255))
    d = ImageDraw.Draw(im)
    P = lambda *xy: [v * s for v in xy]
    chao = 780
    d.line(P(30, chao, tamanho - 30, chao), fill=rgb("#DCE3EA"), width=6 * s)

    # torre treliçada com três mísulas e cadeias de isoladores
    cx, topo, larg_base, tinta = 250, 160, 190, rgb(INK)
    lt, rt, lb, rb = cx - 16, cx + 16, cx - larg_base / 2, cx + larg_base / 2
    d.line(P(lt, topo, lb, chao), fill=tinta, width=7 * s)
    d.line(P(rt, topo, rb, chao), fill=tinta, width=7 * s)
    n, h = 7, chao - topo
    for i in range(n):
        y1, y2 = topo + h * i / n, topo + h * (i + 1) / n
        xl1, xr1 = lt + (lb - lt) * i / n, rt + (rb - rt) * i / n
        xl2, xr2 = lt + (lb - lt) * (i + 1) / n, rt + (rb - rt) * (i + 1) / n
        d.line(P(xl1, y1, xr2, y2), fill=tinta, width=3 * s)
        d.line(P(xr1, y1, xl2, y2), fill=tinta, width=3 * s)
    pontas = []
    for dy, w in zip((0.10, 0.24, 0.38), (230, 190, 230)):
        y = topo + h * dy
        d.line(P(cx - w / 2, y, cx + w / 2, y), fill=tinta, width=7 * s)
        for lado in (-1, 1):
            x = cx + lado * (w / 2 - 8)
            for j in range(4):
                yc = y + 11 + j * 10
                d.ellipse(P(x - 12, yc - 4.5, x + 12, yc + 4.5), fill=rgb(GLASS), outline=rgb(TEAL), width=2 * s)
            if lado == 1:
                pontas.append((x, y + 50))

    # condutores até a casa
    for k, (x1, y1) in enumerate(pontas):
        x2, y2 = 590, 548 + k * 8
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + 36
        pts = []
        for t in [i / 40 for i in range(41)]:
            pts += P((1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t ** 2 * x2,
                     (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t ** 2 * y2)
        d.line(pts, fill=rgb(MUTED), width=4 * s)

    # casa com a janela acesa
    d.rectangle(P(590, 560, 820, chao), fill=rgb("#E4EAF0"), outline=tinta, width=6 * s)
    d.polygon(P(565, 565, 705, 440, 845, 565), fill=tinta)
    d.rectangle(P(650, 615, 760, 700), fill=rgb(AMBER), outline=tinta, width=5 * s)

    # selo de continuidade
    d.ellipse(P(625, 155, 815, 345), fill=rgb(TEAL))
    d.line(P(672, 252, 707, 288, 772, 212), fill=(255, 255, 255), width=22 * s, joint="curve")
    for x, y in ((672, 252), (772, 212)):
        d.ellipse(P(x - 11, y - 11, x + 11, y + 11), fill=(255, 255, 255))
    return im.resize((tamanho, tamanho), Image.LANCZOS)


im = desenhar_impacto()
im.save(OUT / "impacto.png", optimize=True)
print("ok impacto.png", im.size)

# Miniaturas do roteiro, cada uma ligada ao tema do bloco
sep = Image.open(OUT / "sep.png").convert("RGB")
esc = sep.width / 2000
torres = sep.crop((int(465 * esc), int(95 * esc), int(975 * esc), int(545 * esc)))
salvar(ImageOps.pad(torres, (900, 900), color=(255, 255, 255)), "roteiro_problema.jpg", q=90)

lado, gap = 444, 12
grade = Image.new("RGB", (2 * lado + gap, 2 * lado + gap), (255, 255, 255))
for i, nome in enumerate(("proc_original.jpg", "proc_contraste.jpg", "proc_equalizacao.jpg", "proc_bordas.jpg")):
    im = ImageOps.fit(Image.open(OUT / nome).convert("RGB"), (lado, lado), Image.LANCZOS)
    grade.paste(im, ((i % 2) * (lado + gap), (i // 2) * (lado + gap)))
salvar(grade, "roteiro_proposta.jpg", q=88)

# Acurácia da CNN no CPLID (Cap. 4) em ordem crescente, com o piso majoritário tracejado
acc = sorted([67.44, 90.70, 95.35, 95.35, 93.02, 95.35, 67.44, 74.42, 88.37, 93.02, 67.44, 76.74, 86.05, 93.02])
graf = Image.new("RGB", (900, 900), (255, 255, 255))
g = ImageDraw.Draw(graf)
x0, x1, y_min, y_max = 90, 840, 760, 150
y_de = lambda v: y_min - (v - 50) / 50 * (y_min - y_max)
claro, escuro = (171, 238, 185), (28, 114, 147)
passo = (x1 - x0) / len(acc)
for i, v in enumerate(acc):
    t = (v - acc[0]) / (acc[-1] - acc[0])
    cor = tuple(int(claro[c] + (escuro[c] - claro[c]) * t) for c in range(3))
    xb = x0 + i * passo + 7
    g.rectangle((xb, y_de(v), xb + passo - 14, y_min), fill=cor)
g.line((x0 - 10, y_min, x1 + 10, y_min), fill=(92, 111, 128), width=4)
yp = y_de(74.42)
for xd in range(x0 - 10, x1 + 10, 34):
    g.line((xd, yp, xd + 20, yp), fill=(245, 165, 74), width=6)
salvar(graf, "roteiro_resultados.jpg", q=90)
