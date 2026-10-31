"""Gera o banner do artigo SEPOC (banner_sepoc.pptx) a partir do Poster_Template.pptx.

Uso, a partir da raiz do projeto:
    python sepoc/presentation/build_banner.py
"""
from copy import deepcopy
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Cm, Pt

AQUI = Path(__file__).resolve().parent
IMG = AQUI.parent / "img"
TEMPLATE = AQUI / "Poster_Template.pptx"
SAIDA = AQUI / "banner_sepoc.pptx"

# Cores do template (barras de seção em degradê laranja/marrom)
TEXTO = RGBColor(0x26, 0x26, 0x26)
MARROM = RGBColor(0x44, 0x23, 0x04)
MARROM_MEDIO = RGBColor(0x7B, 0x44, 0x1A)
LARANJA = RGBColor(0xFF, 0x84, 0x00)
VERMELHO = RGBColor(0xC1, 0x12, 0x1F)  # mesma cor da barra "Original Image" nos gráficos
CINZA = RGBColor(0x59, 0x59, 0x59)
CARTAO = RGBColor(0xF3, 0xF3, 0xF3)
DESTAQUE = RGBColor(0xFF, 0xE6, 0xC7)
BRANCO = RGBColor(0xFF, 0xFF, 0xFF)

FONTE = "Arial"
CORPO = 32  # tamanho do corpo usado no template
LEGENDA = 24

# Colunas do template (cm)
COL_E = 5.0
COL_D = 47.5
LARG = 37.5

prs = Presentation(TEMPLATE)
slide = prs.slides[0]
arvore = slide.shapes._spTree
por_id = {s.shape_id: s for s in slide.shapes}
proximo_id = [100]


def novo_id():
    proximo_id[0] += 1
    return proximo_id[0]


# ---------------------------------------------------------------- título
TITULO = ("Método de aprimoramento de processamentos de imagens aplicados à "
          "detecção e classificação de falhas em cadeias de isoladores")

AUTORES = [
    ("Silveira, Luan W.", "1", " (PG); "),
    ("Luz, Paulo C. V.", "1", " (O); "),
    ("Bernardon, Daniel P.", "2", " (O); "),
    ("Feil, Dion L. P.", "1", "; "),
    ("Santos, Laura L. C.", "1", "; "),
    ("Knak Neto, Nelson", "1", ""),
]
AFILIACOES = [
    ("1", "Engenharia Elétrica, Universidade Federal de Santa Maria, Cachoeira do Sul; "),
    ("2", "Engenharia Elétrica, Universidade Federal de Santa Maria, Santa Maria"),
]
EMAIL = "luan.w.silveira@gmail.com"


def reescrever_paragrafo(par, partes, tamanho=None):
    """Troca o texto de um parágrafo mantendo a formatação do primeiro run.
    partes: lista de (texto, sobrescrito)."""
    runs = par.runs
    modelo = runs[0]._r
    for r in runs:
        par._p.remove(r._r)
    for texto, sobrescrito in partes:
        r = deepcopy(modelo)
        r.find(qn("a:t")).text = texto
        rpr = r.find(qn("a:rPr"))
        for att in ("err", "baseline"):
            rpr.attrib.pop(att, None)
        if tamanho:
            rpr.set("sz", str(tamanho * 100))
        if sobrescrito:
            rpr.set("baseline", "30000")
        par._p.append(r)
    # endParaRPr precisa ficar no fim
    fim = par._p.find(qn("a:endParaRPr"))
    if fim is not None:
        par._p.remove(fim)
        par._p.append(fim)


titulo = por_id[5]
ps = titulo.text_frame.paragraphs
reescrever_paragrafo(ps[0], [(TITULO, False)])
partes = []
for nome, sup, sep in AUTORES:
    partes += [(nome, False), (sup, True), (sep, False)]
reescrever_paragrafo(ps[1], [p for p in partes if p[0]])
partes = []
for sup, txt in AFILIACOES:
    partes += [(sup, True), (txt, False)]
reescrever_paragrafo(ps[2], partes, tamanho=26)
reescrever_paragrafo(ps[3], [(EMAIL, False)], tamanho=26)
# sem redução automática: o texto já cabe na caixa
bp = titulo.text_frame._txBody.find(qn("a:bodyPr"))
for filho in list(bp):
    bp.remove(filho)

# ------------------------------------------------- limpeza do conteúdo de exemplo
modelo_barra = deepcopy(por_id[10]._element)
for sid in (7, 8, 9, 10, 12, 13, 14, 16):
    arvore.remove(por_id[sid]._element)
for rel_id, rel in list(slide.part.rels.items()):
    if rel.reltype.endswith("/image"):
        slide.part.drop_rel(rel_id)


# ---------------------------------------------------------------- helpers
def barra(x, y, texto):
    """Barra de seção copiada do template."""
    el = deepcopy(modelo_barra)
    el.find(".//" + qn("p:cNvPr")).set("id", str(novo_id()))
    el.find(".//" + qn("p:cNvPr")).set("name", f"Seção {texto}")
    el.find(".//" + qn("a:off")).set("x", str(Cm(x)))
    el.find(".//" + qn("a:off")).set("y", str(Cm(y)))
    el.find(".//" + qn("a:ext")).set("cx", str(Cm(LARG)))
    el.find(".//" + qn("a:t")).text = texto
    arvore.append(el)


def run(par, texto, tamanho=CORPO, negrito=False, cor=TEXTO, italico=False, sobrescrito=False):
    r = par.add_run()
    r.text = texto
    f = r.font
    f.name = FONTE
    f.size = Pt(tamanho)
    f.bold = negrito
    f.italic = italico
    f.color.rgb = cor
    if sobrescrito:
        r._r.get_or_add_rPr().set("baseline", "30000")
    return r


def caixa(x, y, w, h, paragrafos, ancora=MSO_ANCHOR.TOP, nome=None):
    """paragrafos: lista de dicts {runs: [(texto, opts)], marcador, alinhamento, depois, entrelinha}."""
    tb = slide.shapes.add_textbox(Cm(x), Cm(y), Cm(w), Cm(h))
    if nome:
        tb.name = nome
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = ancora
    for i, d in enumerate(paragrafos):
        par = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        par.alignment = d.get("alinhamento", PP_ALIGN.LEFT)
        par.line_spacing = d.get("entrelinha", 1.1)
        par.space_after = Pt(d.get("depois", 14))
        if d.get("marcador"):
            ppr = par._p.get_or_add_pPr()
            ppr.set("marL", str(Cm(1.0)))
            ppr.set("indent", str(-Cm(1.0)))
            buclr = ppr.makeelement(qn("a:buClr"), {})
            srgb = buclr.makeelement(qn("a:srgbClr"), {"val": str(LARANJA)})
            buclr.append(srgb)
            ppr.append(buclr)
            ppr.append(ppr.makeelement(qn("a:buFont"), {"typeface": "Arial"}))
            ppr.append(ppr.makeelement(qn("a:buChar"), {"char": "■"}))
        for texto, opts in d["runs"]:
            run(par, texto, **opts)
    return tb


def item(*partes, depois=18):
    """Parágrafo com marcador. partes: str (normal) ou ('texto', {opts})."""
    runs = [(p, {}) if isinstance(p, str) else p for p in partes]
    return {"runs": runs, "marcador": True, "depois": depois}


def b(texto, **kw):
    return (texto, {"negrito": True, **kw})


def figura(caminho, x, y, w):
    from PIL import Image
    with Image.open(caminho) as im:
        a, l = im.size
    h = w * l / a
    pic = slide.shapes.add_picture(str(caminho), Cm(x), Cm(y), Cm(w), Cm(h))
    return h, pic


def cartao(x, y, w, h, numero, cor_num, rotulo):
    fundo = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Cm(x), Cm(y), Cm(w), Cm(h))
    fundo.adjustments[0] = 0.08
    fundo.fill.solid()
    fundo.fill.fore_color.rgb = CARTAO
    fundo.line.fill.background()
    fundo.shadow.inherit = False
    fundo.name = f"Cartão {numero}"
    caixa(x + 0.7, y + 0.5, w - 1.4, h - 1.0, [
        {"runs": [(numero, {"tamanho": 66, "negrito": True, "cor": cor_num})], "depois": 4, "entrelinha": 1.0},
        {"runs": [(rotulo, {"tamanho": LEGENDA, "cor": TEXTO})], "depois": 0, "entrelinha": 1.05},
    ], ancora=MSO_ANCHOR.MIDDLE)


def tabela(x, y, w, larguras, linhas, destaque=None, tamanho=26, altura_linha=1.35):
    n_l, n_c = len(linhas), len(linhas[0])
    shp = slide.shapes.add_table(n_l, n_c, Cm(x), Cm(y), Cm(w), Cm(altura_linha * n_l))
    tbl = shp.table
    tbl.first_row = True
    tbl.horz_banding = False
    total = sum(larguras)
    for j, lw in enumerate(larguras):
        tbl.columns[j].width = Cm(w * lw / total)
    for i, linha in enumerate(linhas):
        tbl.rows[i].height = Cm(altura_linha)
        for j, valor in enumerate(linha):
            c = tbl.cell(i, j)
            c.margin_left = c.margin_right = Cm(0.15)
            c.margin_top = c.margin_bottom = Cm(0.1)
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.fill.solid()
            if i == 0:
                c.fill.fore_color.rgb = MARROM
            elif destaque is not None and i == destaque:
                c.fill.fore_color.rgb = DESTAQUE
            else:
                c.fill.fore_color.rgb = BRANCO if i % 2 else CARTAO
            tf = c.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            run(p, valor, tamanho=tamanho,
                negrito=(i == 0 or i == destaque),
                cor=BRANCO if i == 0 else TEXTO)
    return shp


# ===================================================== COLUNA ESQUERDA
y = 33.4
barra(COL_E, y, "INTRODUÇÃO")
y += 2.7
caixa(COL_E, y, LARG, 13.2, [
    item("A inspeção automatizada de isoladores usa Redes Neurais Convolucionais (CNNs), "
         "cujo desempenho depende da qualidade da imagem de entrada."),
    item("Não há método padronizado para escolher as técnicas de pré-processamento "
         "nem seus parâmetros, que costumam ser fixados sem avaliação."),
    item(b("Objetivo: "), "comparar, selecionar, combinar e ajustar essas técnicas "
         "de forma sistemática na classificação de falhas.", depois=0),
], nome="Texto introdução")

y += 14.2
barra(COL_E, y, "METODOLOGIA")
y += 2.7
h_fluxo, _ = figura(IMG / "metodologia - geral.png", COL_E, y, 10.0)
caixa(COL_E, y + h_fluxo + 0.3, 10.0, 2.2, [
    {"runs": [("Figura 1: fluxo da metodologia.", {"tamanho": LEGENDA, "cor": CINZA, "italico": True})],
     "alinhamento": PP_ALIGN.CENTER, "depois": 0},
], nome="Legenda figura 1")
x_txt = COL_E + 11.5
w_txt = LARG - 11.5
caixa(x_txt, y, w_txt, 17.0, [
    item(b("CPLID: "), "imagens aéreas com fundo mais controlado, 2 classes."),
    item(b("DRNPW: "), "recortes de inspeções com drone (CPFL), fundo poluído e 70 categorias."),
    item("Mesma CNN simples em todos os testes, 50 épocas. ", b("Só o pré-processamento muda.")),
    item(b("14 variantes: "), "filtros de ruído, limiarização, bordas, CLAHE, equalização "
         "de histograma e Contrast Enhancement (CE), isolados e combinados.", depois=0),
], nome="Texto metodologia")
tabela(x_txt, y + 17.4, w_txt, [4.6, 3.6, 3.6, 3.6, 4.6], [
    ["Conjunto", "Treino", "Valid.", "Teste", "Piso maj."],
    ["CPLID", "678", "127", "43", "74,42%"],
    ["DRNPW", "468", "87", "30", "73,33%"],
], tamanho=24, altura_linha=1.2)
caixa(x_txt, y + 17.4 + 3.6 + 0.4, w_txt, 2.4, [
    {"runs": [("Piso majoritário: acurácia de responder sempre a classe mais frequente.",
               {"tamanho": LEGENDA, "cor": CINZA, "italico": True})], "depois": 0},
], nome="Nota piso")

y += max(h_fluxo + 2.5, 17.4 + 3.6 + 2.8) + 1.2
barra(COL_E, y, "RESULTADOS: CPLID")
y += 2.7
h_cplid, _ = figura(IMG / "cplid_acc.png", COL_E - 0.5, y, 24.5)
x_card = COL_E + 24.6
w_card = LARG - 24.6
alt = (h_cplid - 1.2) / 3
cartao(x_card, y, w_card, alt, "95,35%", MARROM_MEDIO, "CE isolado, empatado com duas combinações")
cartao(x_card, y + alt + 0.6, w_card, alt, "93,02%", VERMELHO, "Imagem original: 1 acerto a menos em 43")
cartao(x_card, y + 2 * (alt + 0.6), w_card, alt, "67,44%", CINZA, "Gaussian Blur: abaixo do piso")
caixa(COL_E, y + h_cplid + 0.3, LARG, 5.0, [
    {"runs": [("Figura 2: acurácia no CPLID. Em vermelho, a imagem sem tratamento. "
               "A linha tracejada marca o piso majoritário.",
               {"tamanho": LEGENDA, "cor": CINZA, "italico": True})], "depois": 10},
    {"runs": [b("Margem estreita para ajudar e ampla para prejudicar: ", tamanho=28),
              ("o método serve para descartar transformações destrutivas.", {"tamanho": 28})], "depois": 0},
], nome="Texto CPLID")

# ===================================================== COLUNA DIREITA
y = 33.4
barra(COL_D, y, "RESULTADOS: DRNPW")
y += 2.7
h_drnpw, _ = figura(IMG / "drnpw_acc.png", COL_D - 0.5, y, 24.5)
x_card = COL_D + 24.6
cartao(x_card, y, w_card, alt, "63,33%", VERMELHO, "Imagem original, abaixo do piso")
cartao(x_card, y + alt + 0.6, w_card, alt, "83,33%", MARROM_MEDIO, "CE + Equalize Histogram")
cartao(x_card, y + 2 * (alt + 0.6), w_card, alt, "+6", LARANJA, "acertos em 30 imagens de teste")
caixa(COL_D, y + h_drnpw + 0.3, LARG, 5.0, [
    {"runs": [("Figura 3: acurácia no DRNPW. Em vermelho, a imagem sem tratamento. "
               "A linha tracejada marca o piso majoritário.",
               {"tamanho": LEGENDA, "cor": CINZA, "italico": True})], "depois": 10},
    {"runs": [b("Com fundo poluído, o pré-processamento teve o maior efeito observado, ", tamanho=28),
              ("ainda que a três acertos do piso.", {"tamanho": 28})], "depois": 0},
], nome="Texto DRNPW")

y += h_drnpw + 0.3 + 5.0 + 1.2
barra(COL_D, y, "OTIMIZAÇÃO DO FATOR DE CONTRASTE")
y += 2.7
w_grid, w_rand = 21.5, LARG - 21.5 - 1.0
caixa(COL_D, y, w_grid, 1.2, [{"runs": [b("Grid Search", tamanho=26), (" (teste, 30 imagens)", {"tamanho": 26})], "depois": 0}])
caixa(COL_D + w_grid + 1.0, y, w_rand, 1.2, [{"runs": [b("Random Search", tamanho=26), (" (validação, 87)", {"tamanho": 26})], "depois": 0}])
y += 1.5
tabela(COL_D, y, w_grid, [3, 3.4, 3.2], [
    ["Fator", "Acurácia", "F1-score"],
    ["0,500", "76,7%", "66,5%"],
    ["0,778", "83,3%", "75,8%"],
    ["1,056", "80,0%", "71,1%"],
    ["1,333", "90,0%", "85,3%"],
    ["1,611", "83,3%", "75,8%"],
], destaque=4)
tabela(COL_D + w_grid + 1.0, y, w_rand, [3, 3.4], [
    ["Fator", "Acurácia"],
    ["0,8900", "78,2%"],
    ["1,4364", "85,1%"],
    ["1,9966", "80,5%"],
    ["2,3300", "71,3%"],
    ["2,8768", "79,3%"],
], destaque=2)
y += 6 * 1.35 + 0.5
caixa(COL_D, y, LARG, 2.6, [
    {"runs": [("CE isolado no DRNPW, 5 épocas por fator. As buscas usam conjuntos diferentes "
               "e não se comparam diretamente. A relação entre fator e acurácia não é monotônica.",
               {"tamanho": LEGENDA, "cor": CINZA, "italico": True})], "depois": 0},
], nome="Nota otimização")

y += 2.6 + 1.4
barra(COL_D, y, "CONCLUSÃO")
y += 2.7
caixa(COL_D, y, LARG, 106.5 - y, [
    item("O efeito de uma mesma técnica variou entre os cenários de captura. ",
         b("CE + Equalize Histogram"), " teve a maior acurácia nos dois conjuntos."),
    item(b("CPLID: "), "ganho de um acerto, sem relevância. O valor do método está em evitar perdas de até 25,6 pontos."),
    item(b("DRNPW: "), "de 63,33% para 83,33% com a combinação de técnicas."),
    item(b("Contribuição: "), "um protocolo fixo e expansível que troca a tentativa e erro "
         "por comparação quantitativa."),
    item(b("Limitações: "), "testes com 43 e 30 imagens e um treino por configuração. "
         "Próximo passo: conjuntos maiores e sementes controladas.", depois=0),
], nome="Texto conclusão")

caixa(COL_D, 107.0, LARG, 1.4, [
    {"runs": [b("Agradecimentos: ", tamanho=22, cor=CINZA),
              ("CAPES/PROEX, Código de Financiamento 001.", {"tamanho": 22, "cor": CINZA})],
     "depois": 0},
], nome="Agradecimentos")

prs.save(SAIDA)
print("gerado:", SAIDA)
