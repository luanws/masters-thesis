// Base compartilhada pelos slides: caminhos, paleta, instância do pptxgenjs e helpers de layout.
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// Raiz do repositório da dissertação, de onde vêm as figuras dos Capítulos 3 e 4.
// O padrão resolve a partir de presentation/build/. Para outro local, use THESIS_ROOT.
const REPO = process.env.THESIS_ROOT || path.resolve(__dirname, "..", "..");
const FIG = path.join(REPO, "documents", "img", "coleta_e_analise_de_resultados", "preprocessing");
const ASSETS = path.join(__dirname, "..", "assets");

// Lê a figura como data URI, o que evita qualquer problema com acento no caminho.
function figura(modelo, dataset) {
  const p = path.join(FIG, modelo, dataset, "Acurácia.jpg");
  return "image/jpeg;base64," + fs.readFileSync(p).toString("base64");
}

// Fotos e ilustrações geradas por make_assets.py
function asset(nome) {
  const tipo = nome.endsWith(".png") ? "png" : "jpeg";
  return `image/${tipo};base64,` + fs.readFileSync(path.join(ASSETS, nome)).toString("base64");
}

// ---------------------------------------------------------------------------
// Paleta e tipografia
// ---------------------------------------------------------------------------
const C = {
  night: "12263A",
  nightSoft: "1C3550",
  teal: "1C7293",
  tealDark: "145A75",
  tealLight: "5BB4D6",
  amber: "F5A54A",
  amberSoft: "FFD9A8",
  white: "FFFFFF",
  surface: "F1F4F7",
  surfaceAlt: "E4EAF0",
  ink: "1B2A3A",
  muted: "5C6F80",
  mutedLight: "A9BCCC",
  grid: "DCE3EA",
};

const F = { head: "Cambria", body: "Calibri" };
const W = 10, H = 5.625, M = 0.55;

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Luan Willig Silveira";
pres.title = "Defesa de Mestrado - Processamento de imagens em cadeias de isoladores";

const shadow = (o = {}) => ({
  type: "outer", angle: 90, blur: 12, offset: 2, color: "1B2A3A", opacity: 0.12, ...o,
});

// ---------------------------------------------------------------------------
// Helpers de layout
// ---------------------------------------------------------------------------
let slideNo = 0;

// Avança a numeração (slides sem rodapé, como a capa, também contam)
function contarSlide() {
  slideNo += 1;
  return slideNo;
}

function lightSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };
  return s;
}

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: C.night };
  return s;
}

function title(s, eyebrow, text, opts = {}) {
  const dark = !!opts.dark;
  const x = opts.x === undefined ? M : opts.x;
  if (eyebrow) {
    s.addText(eyebrow.toUpperCase(), {
      x, y: 0.3, w: opts.w || W - x - M, h: 0.25, margin: 0,
      fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 1.6,
      color: dark ? C.amber : C.teal,
    });
  }
  s.addText(text, {
    x, y: eyebrow ? 0.56 : 0.42, w: opts.w || W - x - M, h: opts.h || 0.62, margin: 0,
    fontFace: F.head, fontSize: opts.size || 28, bold: true,
    color: dark ? C.white : C.ink, valign: "top",
  });
}

// Rodapé com seção, nota (opcional) e número do slide
function footer(s, label, dark = false, nota = "", x = M) {
  const numero = contarSlide();
  s.addText(label, {
    x, y: H - 0.42, w: 2.6, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9, color: dark ? C.mutedLight : C.muted,
  });
  if (nota) {
    s.addText(nota, {
      x: 3.0, y: H - 0.42, w: 5.8, h: 0.25, margin: 0, align: "right",
      fontFace: F.body, fontSize: 7.5, italic: true, color: dark ? C.mutedLight : C.muted,
    });
  }
  s.addText(String(numero), {
    x: W - M - 0.5, y: H - 0.42, w: 0.5, h: 0.25, margin: 0, align: "right",
    fontFace: F.body, fontSize: 9, bold: true, color: dark ? C.amber : C.teal,
  });
}

// As anotações contêm apenas o texto a ser falado
function fala(s, texto) {
  s.addNotes(texto.trim().split("\n").map(l => l.trim()).join("\n"));
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.07,
    fill: { color: opts.fill || C.surface },
    line: { color: opts.line || C.surfaceAlt, width: 0.75 },
    shadow: opts.flat ? undefined : shadow(),
  });
}

function bubble(s, x, y, d, label, opts = {}) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: opts.fill || C.teal }, line: { color: opts.fill || C.teal, width: 0 },
  });
  s.addText(label, {
    x, y, w: d, h: d, margin: 0, align: "center", valign: "middle",
    fontFace: F.body, fontSize: opts.size || 12, bold: true, color: opts.color || C.white,
  });
}

function foto(s, nome, x, y, w, h, opts = {}) {
  s.addImage({ data: asset(nome), x, y, w, h });
  if (opts.borda) {
    s.addShape(pres.ShapeType.rect, {
      x, y, w, h, fill: { type: "none" }, line: { color: opts.borda, width: opts.espessura || 2.5 },
    });
  }
}

function legenda(s, texto, x, y, w, opts = {}) {
  s.addText(texto, {
    x, y, w, h: opts.h || 0.24, margin: 0, align: opts.align || "left",
    fontFace: F.body, fontSize: opts.size || 9.5, italic: opts.italic !== false,
    bold: !!opts.bold, color: opts.color || C.muted,
  });
}

function bullets(s, items, o) {
  s.addText(
    items.map((t, i) => ({
      text: t, options: { bullet: true, breakLine: i < items.length - 1 },
    })),
    {
      x: o.x, y: o.y, w: o.w, h: o.h, margin: 0,
      fontFace: F.body, fontSize: o.size || 13, color: o.color || C.ink,
      paraSpaceAfter: o.gap === undefined ? 7 : o.gap, valign: "top",
    }
  );
}

const pct = v => v.toFixed(2).replace(".", ",") + "%";

// Slide de resultado: figura da dissertação em largura quase total e três
// destaques logo abaixo. `destaques` = [[valor, rótulo, descrição, estilo], ...]
function slideFigura(s, imgData, legendaTxt, destaques) {
  legenda(s, legendaTxt, 0.3, 1.16, 9.4, { h: 0.22 });
  s.addImage({ data: imgData, x: 0.25, y: 1.36, w: 9.5, h: 2.86 });

  destaques.forEach((d, i) => {
    const x = 0.25 + i * 3.18;
    const escuro = d[3] === "dark";
    card(s, x, 4.3, 3.0, 0.84, escuro
      ? { fill: C.night, line: C.night }
      : { fill: C.surface, line: C.surfaceAlt, flat: true });
    s.addText([
      { text: d[0], options: { fontSize: 17, bold: true, color: escuro ? C.amber : (d[3] === "amber" ? C.amber : C.teal) } },
      { text: "   " + d[1], options: { fontSize: 9, bold: true, color: escuro ? C.mutedLight : C.muted } },
    ], { x: x + 0.2, y: 4.38, w: 2.65, h: 0.3, margin: 0, fontFace: F.head, valign: "middle" });
    s.addText(d[2], {
      x: x + 0.2, y: 4.68, w: 2.68, h: 0.42, margin: 0,
      fontFace: F.body, fontSize: 9, color: escuro ? C.white : C.ink, lineSpacingMultiple: 1.02,
    });
  });
}

const chartBase = {
  showLegend: false, showTitle: false,
  catAxisLabelColor: C.muted, catAxisLabelFontFace: F.body, catAxisLabelFontSize: 9,
  valAxisLabelColor: C.muted, valAxisLabelFontFace: F.body, valAxisLabelFontSize: 9,
  valGridLine: { color: C.grid, size: 0.75 },
  catGridLine: { style: "none" },
  showValue: true, dataLabelColor: C.ink, dataLabelFontFace: F.body,
  dataLabelFontSize: 8.5, dataLabelPosition: "outEnd",
  border: { pt: 0, color: "FFFFFF" },
};

// ---------------------------------------------------------------------------
// Dados dos experimentos (Cap. 4 da dissertação)
// ---------------------------------------------------------------------------
// Acurácia (%) por técnica, na ordem das tabelas comparativas do Cap. 4
const CPLID_CNN = [67.44, 90.70, 95.35, 95.35, 93.02, 95.35, 67.44, 74.42, 88.37, 93.02, 67.44, 76.74, 86.05, 93.02];
const CPLID_YOLO = [55.81, 60.47, 51.16, 58.14, 69.77, 62.79, 72.09, 67.44, 72.09, 74.42, 74.42, 81.40, 67.44, 60.47];
const DRNPW_CNN = [73.33, 80.00, 70.00, 63.33, 80.00, 83.33, 76.67, 66.67, 80.00, 76.67, 76.67, 63.33, 80.00, 63.33];
const DRNPW_YOLO = [83.33, 73.33, 80.00, 76.67, 76.67, 53.33, 63.33, 73.33, 70.00, 66.67, 63.33, 80.00, 73.33, 66.67];

// ---------------------------------------------------------------------------
// Fluxogramas da metodologia: as mesmas figuras usadas na dissertação
// ---------------------------------------------------------------------------
const MET = {
  geral: ["metodologia - geral.png", 1719 / 3840],
  completo: ["metodologia.png", 1368 / 3836],
};

function fluxo(chave) {
  const p = path.join(REPO, "documents", "img", MET[chave][0]);
  return "image/png;base64," + fs.readFileSync(p).toString("base64");
}

// Coloca a figura respeitando a proporção original, dada a altura.
function figFluxo(s, chave, x, y, h) {
  const w = h * MET[chave][1];
  s.addShape(pres.ShapeType.roundRect, {
    x: x - 0.08, y: y - 0.08, w: w + 0.16, h: h + 0.16, rectRadius: 0.04,
    fill: { color: C.white }, line: { color: C.surfaceAlt, width: 0.75 },
  });
  s.addImage({ data: fluxo(chave), x, y, w, h });
}

module.exports = {
  REPO,
  FIG,
  ASSETS,
  figura,
  asset,
  C,
  F,
  W,
  H,
  M,
  pres,
  shadow,
  contarSlide,
  lightSlide,
  darkSlide,
  title,
  footer,
  fala,
  card,
  bubble,
  foto,
  legenda,
  bullets,
  pct,
  slideFigura,
  chartBase,
  CPLID_CNN,
  CPLID_YOLO,
  DRNPW_CNN,
  DRNPW_YOLO,
  MET,
  fluxo,
  figFluxo,
};
