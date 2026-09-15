const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// Raiz do repositório da dissertação, de onde vêm as figuras dos Capítulos 3 e 4.
// Rodando de dentro de presentation/, o padrão já resolve. Fora dela, use THESIS_ROOT.
const REPO = process.env.THESIS_ROOT || path.resolve(__dirname, "..");
const FIG = path.join(REPO, "documents", "img", "coleta_e_analise_de_resultados", "preprocessing");
const ASSETS = path.join(__dirname, "assets");

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

// Rodapé com seção, fonte dos dados (opcional) e número do slide
function footer(s, label, dark = false, fonte = "", x = M) {
  slideNo += 1;
  s.addText(label, {
    x, y: H - 0.42, w: 2.6, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9, color: dark ? C.mutedLight : C.muted,
  });
  if (fonte) {
    s.addText(fonte, {
      x: 3.0, y: H - 0.42, w: 5.8, h: 0.25, margin: 0, align: "right",
      fontFace: F.body, fontSize: 7.5, italic: true, color: dark ? C.mutedLight : C.muted,
    });
  }
  s.addText(String(slideNo), {
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
const TEC = ["Adaptive Threshold", "CLAHE", "CLAHE + Contrast Enh.", "Contrast Enhancement",
  "Contrast Enh. + CLAHE", "Contrast Enh. + Eq. Hist.", "Denoise", "Edge Detection",
  "Equalize Histogram", "Eq. Hist. + Contrast Enh.", "Gaussian Blur", "Gray Scale",
  "Median Blur", "Original Image"];

const CPLID_CNN = [67.44, 90.70, 95.35, 95.35, 93.02, 95.35, 67.44, 74.42, 88.37, 93.02, 67.44, 76.74, 86.05, 93.02];
const CPLID_YOLO = [55.81, 60.47, 51.16, 58.14, 69.77, 62.79, 72.09, 67.44, 72.09, 74.42, 74.42, 81.40, 67.44, 60.47];
const DRNPW_CNN = [73.33, 80.00, 70.00, 63.33, 80.00, 83.33, 76.67, 66.67, 80.00, 76.67, 76.67, 63.33, 80.00, 63.33];
const DRNPW_YOLO = [83.33, 73.33, 80.00, 76.67, 76.67, 53.33, 63.33, 73.33, 70.00, 66.67, 63.33, 80.00, 73.33, 66.67];

const HIBRIDAS = [2, 4, 5, 9];
const SIMPLES = TEC.map((_, i) => i).filter(i => !HIBRIDAS.includes(i));
const media = (vals, idx = vals.map((_, i) => i)) => idx.reduce((a, i) => a + vals[i], 0) / idx.length;
const r2 = v => Math.round(v * 100) / 100;

// ---------------------------------------------------------------------------
// Fluxogramas da metodologia: as mesmas figuras usadas na dissertação
// ---------------------------------------------------------------------------
const MET = {
  geral: ["metodologia - geral.png", 1719 / 3840],
  completo: ["metodologia.png", 1368 / 3836],
  e1: ["metodologia - 1 - seleção e validação do dataset.png", 1949 / 3840],
  e2: ["metodologia - 2 - pré-processamento.png", 3571 / 3840],
  e3: ["metodologia - 3 - ajustes de parâmetros.png", 3840 / 2630],
  e4: ["metodologia - 4 - escolha e construção do modelo.png", 3840 / 1846],
  e5: ["metodologia - 5 - treinamento.png", 3840 / 1034],
  e6: ["metodologia - 6 - avaliação.png", 3189 / 3840],
};

function fluxo(chave) {
  const p = path.join(REPO, "documents", "img", MET[chave][0]);
  return "image/png;base64," + fs.readFileSync(p).toString("base64");
}

// Coloca a figura respeitando a proporção original, dada a altura (ou a largura).
function figFluxo(s, chave, x, y, { h, w }) {
  const r = MET[chave][1];
  const hh = h !== undefined ? h : w / r;
  const ww = h !== undefined ? h * r : w;
  s.addShape(pres.ShapeType.roundRect, {
    x: x - 0.08, y: y - 0.08, w: ww + 0.16, h: hh + 0.16, rectRadius: 0.04,
    fill: { color: C.white }, line: { color: C.surfaceAlt, width: 0.75 },
  });
  s.addImage({ data: fluxo(chave), x, y, w: ww, h: hh });
  return ww;
}

function figLabel(s, x, y, w, texto, opts = {}) {
  s.addText(texto, {
    x, y, w, h: 0.24, margin: 0, align: opts.align || "center",
    fontFace: F.body, fontSize: opts.size || 10.5, bold: true,
    color: opts.color || C.teal,
  });
}

const FONTE_ANEEL = "Fonte: ANEEL, desempenho das distribuidoras na continuidade do fornecimento em 2025";
const FONTE_MERCADO = "Fontes: DronePower (Energy Summit 2025) e UAV Imaging (comparativo drone e helicóptero)";

// ===========================================================================
// 1 - Capa
// ===========================================================================
{
  const s = darkSlide();
  s.addImage({ data: asset("capa.jpg"), x: 0, y: 0, w: W, h: H });

  s.addText("Universidade Federal de Santa Maria", {
    x: M, y: 0.55, w: 5.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 12, color: C.amber, bold: true,
  });
  s.addText("Programa de Pós-Graduação em Engenharia Elétrica", {
    x: M, y: 0.81, w: 5.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 11, color: C.mutedLight,
  });

  s.addText("Método de aprimoramento de processamentos de imagens aplicados à detecção e classificação de falhas em cadeias de isoladores", {
    x: M, y: 1.4, w: 5.6, h: 1.95, margin: 0,
    fontFace: F.head, fontSize: 23, bold: true, color: C.white, lineSpacingMultiple: 1.05,
  });

  s.addText("Defesa de Dissertação de Mestrado", {
    x: M, y: 3.45, w: 5.6, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 12, italic: true, color: C.amberSoft,
  });

  s.addText([
    { text: "Mestrando: ", options: { color: C.mutedLight } },
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Orientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Daniel Pinheiro Bernardon", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Coorientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Paulo César Vargas Luz", options: { bold: true, color: C.white } },
  ], { x: M, y: 3.95, w: 5.8, h: 1.0, margin: 0, fontFace: F.body, fontSize: 12, lineSpacingMultiple: 1.15 });

  s.addText("Santa Maria, RS", {
    x: M, y: H - 0.45, w: 4, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9.5, color: C.mutedLight,
  });
  slideNo += 1;

  fala(s, `
Bom dia a todos.
Meu nome é Luan Willig Silveira e apresento a minha dissertação de mestrado, desenvolvida no Programa de Pós-Graduação em Engenharia Elétrica da UFSM, sob orientação do professor Daniel Pinheiro Bernardon e coorientação do professor Paulo César Vargas Luz.
O trabalho trata do processamento de imagens aplicado à detecção e à classificação de falhas em cadeias de isoladores. A foto de fundo já mostra o cenário do problema: uma cadeia de isoladores de uma linha de transmissão, fotografada por um drone durante uma inspeção real.
Agradeço a presença da banca.`);
}

// ===========================================================================
// 2 - Roteiro
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Roteiro", "Do sistema elétrico de volta ao sistema elétrico");

  const itens = [
    ["1", "O problema elétrico", "Isoladores, falhas e custo", "defeito_corrosao.jpg"],
    ["2", "A proposta", "Metodologia de pré-processamento", "proc_contraste_q.jpg"],
    ["3", "Resultados", "Dois cenários, dois modelos", "cplid_quadrado.jpg"],
    ["4", "Impacto no setor", "Ganhos financeiros e operacionais", "aerea_recorte.jpg"],
  ];
  itens.forEach((it, i) => {
    const x = M + i * 2.3, lado = 2.0;
    foto(s, it[3], x, 1.35, lado, lado);
    bubble(s, x + 0.12, 1.47, 0.44, it[0], { fill: i === 3 ? C.amber : C.teal, color: i === 3 ? C.night : C.white });
    s.addText(it[1], {
      x, y: 3.5, w: lado, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
    });
    s.addText(it[2], {
      x, y: 3.82, w: lado, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted,
    });
  });

  footer(s, "Roteiro");
  fala(s, `
A apresentação tem quatro partes. Começo pelo problema elétrico: o papel dos isoladores, como eles falham e quanto essas falhas custam. Depois apresento a proposta, que é uma metodologia para escolher o tratamento das imagens usadas na inspeção. Em seguida, os resultados em dois cenários e com dois modelos. E termino voltando ao setor elétrico, com o impacto financeiro e operacional do trabalho.`);
}

// ===========================================================================
// 3 - O sistema elétrico
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "A linha é o elo mais exposto do sistema");

  s.addImage({ data: asset("sep.png"), x: M, y: 1.2, w: 8.9, h: 8.9 * 560 / 2000 });

  const stats = [
    ["≈ 177 mil km", "de linhas na Rede Básica do Sistema Interligado Nacional"],
    ["+ 5,3 mil km", "de novas linhas de transmissão previstas até 2030"],
    ["R$ 28,1 bi", "em obras de ampliação e reforço da rede até 2030"],
  ];
  stats.forEach((st, i) => {
    const x = M + i * 3.05;
    s.addShape(pres.ShapeType.rect, { x, y: 3.95, w: 0.06, h: 0.95, fill: { color: i === 0 ? C.amber : C.teal }, line: { type: "none" } });
    s.addText(st[0], {
      x: x + 0.2, y: 3.9, w: 2.7, h: 0.5, margin: 0,
      fontFace: F.head, fontSize: 24, bold: true, color: i === 0 ? C.amber : C.teal,
    });
    s.addText(st[1], {
      x: x + 0.2, y: 4.4, w: 2.6, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink,
    });
  });

  footer(s, "Contexto elétrico", false, "Fonte: ONS, PAR/PEL 2025 (extensão atual estimada: 5.301 km novos equivalem a 3% da rede)");
  fala(s, `
Começo pelo sistema elétrico. A energia sai da geração, que no Brasil é majoritariamente hidráulica, percorre longas distâncias pelas linhas de transmissão, passa pelas subestações e chega ao consumidor pela rede de distribuição.
De todos esses elos, a linha aérea é o mais exposto. Ela atravessa campo, cidade e vegetação, sem nenhum abrigo.
E a dimensão desse ativo é grande. Somente a Rede Básica do Sistema Interligado Nacional soma cerca de 177 mil quilômetros de linhas. O planejamento do ONS prevê mais 5,3 mil quilômetros até 2030, com cerca de 28 bilhões de reais em obras. Cada quilômetro novo é mais estrutura para inspecionar e manter.
Em cada torre dessa rede existe um componente pequeno, do qual depende o funcionamento de toda a linha. É o que está destacado no círculo da figura: a cadeia de isoladores.`);
}

// ===========================================================================
// 4 - O isolador
// ===========================================================================
{
  const s = lightSlide();
  foto(s, "cadeia_torre.jpg", 0, 0, H, H);
  title(s, "Contexto elétrico", "Isolador: barato, pequeno e crítico", { x: 6.0, w: 3.5, h: 1.0, size: 24 });

  const itens = [
    ["Sustenta", "o peso do condutor e os esforços de vento"],
    ["Isola", "a fase energizada da estrutura aterrada"],
    ["Resiste", "a sol, chuva, poluição e descargas por décadas"],
  ];
  itens.forEach((it, i) => {
    const y = 1.85 + i * 1.02;
    bubble(s, 6.0, y, 0.5, String(i + 1), { fill: i === 1 ? C.amber : C.teal, color: i === 1 ? C.night : C.white });
    s.addText(it[0], {
      x: 6.65, y: y - 0.04, w: 2.8, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 15, bold: true, color: C.ink,
    });
    s.addText(it[1], {
      x: 6.65, y: y + 0.28, w: 2.8, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.muted,
    });
  });

  footer(s, "Contexto elétrico", false, "", 6.0);
  fala(s, `
Esta foto foi feita por um drone durante uma inspeção da CPFL. O que se vê pendurado na torre é uma cadeia de discos de vidro, e ela cumpre duas funções ao mesmo tempo.
A primeira é mecânica: sustentar o peso do condutor e os esforços de vento.
A segunda é elétrica: manter isolada a fase energizada da estrutura metálica, que está aterrada. Para isso, cada disco precisa preservar a sua rigidez dielétrica ao longo de décadas de operação, exposto ao sol, à chuva, à poluição e às descargas atmosféricas.
Quando o isolamento da cadeia se perde, ocorre a descarga disruptiva, a corrente encontra um caminho pela estrutura e a proteção desliga a linha. Ou seja, um componente de baixo custo pode tirar de operação uma linha inteira.`);
}

// ===========================================================================
// 5 - Como falha
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "Como a cadeia de isoladores falha");

  const falhas = [
    ["defeito_corrosao.jpg", "Corrosão", "Pino metálico atacado pela umidade"],
    ["defeito_oxidacao.jpg", "Oxidação e contaminação", "Depósitos sobre o vidro e as ferragens"],
    ["cplid_quadrado.jpg", "Defeito estrutural", "Cadeias cerâmicas: disco trincado ou ausente"],
  ];
  falhas.forEach((f, i) => {
    const x = M + i * 3.05, lado = 2.85;
    foto(s, f[0], x, 1.25, lado, lado);
    s.addText(f[1], {
      x, y: 4.2, w: lado, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 14, bold: true, color: i === 2 ? C.amber : C.teal,
    });
    s.addText(f[2], {
      x, y: 4.5, w: lado, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink,
    });
  });

  footer(s, "Contexto elétrico", false, "Fotos: inspeções por drone da CPFL e conjunto CPLID");
  fala(s, `
As falhas aparecem de formas diferentes.
À esquerda, a corrosão do pino metálico, provocada pela umidade ao longo dos anos, que compromete a resistência mecânica da cadeia.
No centro, a oxidação e a contaminação da superfície. Esses depósitos, somados à umidade, formam uma camada condutora sobre o vidro e aumentam a corrente de fuga.
À direita, uma cadeia de discos cerâmicos, em que o defeito típico é estrutural: o disco trincado ou até ausente. Cada disco perdido reduz a tensão que a cadeia suporta.
O ponto em comum é que todas essas falhas começam pequenas e já são visíveis em imagem, muito antes do desligamento. Encontradas cedo, viram uma troca programada de isolador. Encontradas tarde, viram uma falta na linha.`);
}

// ===========================================================================
// 6 - O custo da falha
// ===========================================================================
{
  const s = darkSlide();
  title(s, "Contexto elétrico", "Quando a linha desliga, a conta chega", { dark: true });

  const stats = [
    ["R$ 1,002 bi", "em compensações pagas aos consumidores por violação dos limites de continuidade"],
    ["9,30 h", "sem energia por consumidor no ano (DEC médio)"],
    ["4,66", "interrupções por consumidor no ano (FEC médio)"],
  ];
  s.addText("Distribuição, Brasil, 2025", {
    x: M, y: 1.3, w: 5, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 11, bold: true, color: C.mutedLight,
  });
  stats.forEach((st, i) => {
    const x = M + i * 3.05;
    card(s, x, 1.62, 2.85, 1.72, { fill: C.nightSoft, line: C.nightSoft, flat: true });
    s.addText(st[0], {
      x: x + 0.22, y: 1.78, w: 2.5, h: 0.62, margin: 0,
      fontFace: F.head, fontSize: i === 0 ? 27 : 32, bold: true, color: i === 0 ? C.amber : C.tealLight,
    });
    s.addText(st[1], {
      x: x + 0.22, y: 2.45, w: 2.45, h: 0.8, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.white, lineSpacingMultiple: 1.05,
    });
  });

  card(s, M, 3.6, 8.9, 1.25, { fill: C.night, line: C.amber, flat: true });
  s.addText("Transmissão", {
    x: M + 0.3, y: 3.75, w: 3, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 12, bold: true, color: C.amber,
  });
  s.addText("A Parcela Variável por Indisponibilidade desconta da receita da transmissora o tempo em que a linha fica desligada por sua responsabilidade.", {
    x: M + 0.3, y: 4.05, w: 8.3, h: 0.65, margin: 0,
    fontFace: F.body, fontSize: 13, color: C.white, lineSpacingMultiple: 1.05,
  });

  footer(s, "Contexto elétrico", true, FONTE_ANEEL);
  fala(s, `
Esse risco tem custo, e o setor elétrico mede esse custo.
Na distribuição, a ANEEL acompanha a continuidade do fornecimento pelos indicadores DEC e FEC. Em 2025, cada consumidor brasileiro ficou em média 9,30 horas sem energia, distribuídas em 4,66 interrupções.
Quando os limites são ultrapassados, a distribuidora paga uma compensação diretamente na fatura do consumidor. Esse valor chegou a 1 bilhão e 2 milhões de reais em 2025. É importante dizer que esse número reúne todas as causas de interrupção, e não apenas isoladores, mas ele mostra a ordem de grandeza do custo da falta de continuidade.
Na transmissão, o mecanismo é a Parcela Variável por Indisponibilidade. Enquanto uma linha fica desligada por responsabilidade da transmissora, parte da sua receita é descontada.
Nos dois casos, a lógica econômica é a mesma: cada falha evitada antes do desligamento é dinheiro que deixa de sair do caixa da empresa, além do prejuízo evitado ao consumidor.`);
}

// ===========================================================================
// 7 - O drone muda a economia da inspeção
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "O drone muda a economia da inspeção");

  s.addImage({ data: asset("drone.png"), x: M, y: 1.45, w: 4.3, h: 4.3 * 760 / 1400 });
  legenda(s, "O drone chega a poucos metros da cadeia, sem expor a equipe à altura nem à linha energizada.", M, 3.95, 4.2, { h: 0.45 });

  const linhas = [
    ["Custo médio de inspeção por torre", [["Tradicional", 750, "R$ 750"], ["Drone", 300, "R$ 300"]], 750],
    ["Torres inspecionadas por dia", [["Tradicional", 5, "5"], ["Drone", 25, "25"]], 25],
    ["Patrulha aérea, custo por km", [["Helicóptero", 200, "US$ 120 a 200"], ["Drone", 80, "US$ 40 a 80"]], 200],
  ];
  const x0 = 5.1, barX = 6.2, maxL = 2.0;
  linhas.forEach((l, i) => {
    const y = 1.3 + i * 1.2;
    s.addText(l[0], {
      x: x0, y, w: 4.35, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12, bold: true, color: C.ink,
    });
    l[1].forEach((b, j) => {
      const yy = y + 0.34 + j * 0.34;
      const len = Math.max(0.12, maxL * b[1] / l[2]);
      const drone = j === 1;
      s.addText(b[0], {
        x: x0, y: yy, w: 1.05, h: 0.26, margin: 0, valign: "middle",
        fontFace: F.body, fontSize: 10, color: drone ? C.teal : C.muted, bold: drone,
      });
      s.addShape(pres.ShapeType.rect, {
        x: barX, y: yy, w: len, h: 0.26,
        fill: { color: drone ? C.teal : C.mutedLight }, line: { type: "none" },
      });
      s.addText(b[2], {
        x: barX + len + 0.08, y: yy, w: 1.2, h: 0.26, margin: 0, valign: "middle",
        fontFace: F.body, fontSize: 10.5, bold: true, color: drone ? C.teal : C.muted,
      });
    });
  });

  footer(s, "Contexto elétrico", false, FONTE_MERCADO);
  fala(s, `
A forma de inspecionar essas cadeias mudou nos últimos anos. A inspeção detalhada exigia uma equipe escalando a estrutura, ou o sobrevoo de helicóptero. As duas alternativas são caras e expõem pessoas a risco de queda, de choque elétrico e de acidente aéreo.
O drone mudou essa conta. Os números à direita são de mercado. Uma empresa brasileira de inspeção por drones relata que o custo médio de inspeção por torre caiu de 750 para 300 reais, e que a produtividade passou de 5 para 25 torres inspecionadas por dia. Um comparativo internacional aponta um custo de 120 a 200 dólares por quilômetro de patrulha com helicóptero, contra 40 a 80 dólares com drone.
Além do custo, o drone chega a poucos metros da cadeia, fotografa cada disco em alta resolução e não coloca ninguém na altura nem perto da linha energizada.`);
}

// ===========================================================================
// 8 - O novo gargalo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "O drone resolve a coleta e cria um novo gargalo");

  s.addImage({ data: asset("mosaico.jpg"), x: M, y: 1.3, w: 5.45, h: 5.45 * 984 / 1960 });
  legenda(s, "Amostra das imagens produzidas em campanhas de inspeção por drone da CPFL", M, 4.1, 5.45);

  card(s, 6.3, 1.3, 3.15, 1.35, { fill: C.surface, flat: true });
  s.addText("Análise manual", {
    x: 6.5, y: 1.42, w: 2.8, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.muted,
  });
  s.addText("Imagem por imagem, lenta e sujeita ao cansaço", {
    x: 6.5, y: 1.76, w: 2.8, h: 0.75, margin: 0,
    fontFace: F.body, fontSize: 11.5, color: C.ink,
  });

  s.addText("▼", {
    x: 6.3, y: 2.72, w: 3.15, h: 0.3, margin: 0, align: "center",
    fontFace: F.body, fontSize: 14, color: C.amber,
  });

  card(s, 6.3, 3.08, 3.15, 1.35, { fill: C.night, line: C.night });
  s.addText("Triagem por IA", {
    x: 6.5, y: 3.2, w: 2.8, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.amber,
  });
  s.addText("O especialista revisa só as imagens suspeitas", {
    x: 6.5, y: 3.54, w: 2.8, h: 0.75, margin: 0,
    fontFace: F.body, fontSize: 11.5, color: C.white,
  });

  footer(s, "Contexto elétrico");
  fala(s, `
Mas o drone traz um efeito colateral. Cada torre gera dezenas de fotografias, e uma campanha de inspeção em uma linha longa gera milhares delas. O mosaico à esquerda é uma pequena amostra do que chega ao escritório depois do trabalho de campo.
Se cada imagem precisar ser aberta e analisada por um especialista, o gargalo apenas muda de lugar: sai da coleta e vai para a análise. E essa análise manual é lenta, cansativa e varia de um analista para outro, principalmente no fim de um dia olhando milhares de discos de vidro.
É aqui que entra a inteligência artificial. Um modelo de visão computacional classifica todas as imagens, separa as que indicam falha e entrega ao especialista apenas as suspeitas. O especialista continua decidindo, mas passa a olhar para o que importa.`);
}

// ===========================================================================
// 9 - A IA depende da imagem
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Proposta", "A IA só é tão boa quanto a imagem que recebe");

  const etapas = [
    ["Aquisição", "Drone em campo", { img: "campo.jpg" }],
    ["Pré-processamento", "Tratamento da imagem", { img: "proc_contraste.jpg", destaque: true }],
    ["Modelo", "Rede neural", { img: "rede_neural.png" }],
    ["Diagnóstico", "Com falha ou sem falha", { img: "proc_diagnostico.jpg" }],
  ];
  const bw = 1.95, gap = 0.37, ih = bw * 0.75;
  etapas.forEach((e, i) => {
    const x = M + i * (bw + gap);
    foto(s, e[2].img, x, 1.4, bw, ih, e[2].destaque ? { borda: C.amber, espessura: 3.5 } : {});
    s.addText(e[0], {
      x, y: 3.0, w: bw, h: 0.3, margin: 0, align: "center",
      fontFace: F.body, fontSize: 13, bold: true, color: e[2].destaque ? C.amber : C.ink,
    });
    s.addText(e[1], {
      x, y: 3.3, w: bw, h: 0.26, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: C.muted,
    });
    if (i < etapas.length - 1) {
      s.addText("▶", {
        x: x + bw, y: 1.95, w: gap, h: 0.35, margin: 0, align: "center",
        fontFace: F.body, fontSize: 13, color: C.mutedLight,
      });
    }
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: M + bw + gap + 0.2, y: 3.64, w: bw - 0.4, h: 0.32, rectRadius: 0.08,
    fill: { color: C.amber }, line: { type: "none" },
  });
  s.addText("Foco deste trabalho", {
    x: M + bw + gap + 0.2, y: 3.64, w: bw - 0.4, h: 0.32, margin: 0, align: "center", valign: "middle",
    fontFace: F.body, fontSize: 10, bold: true, color: C.night,
  });

  card(s, M, 4.2, 8.9, 0.68, { fill: C.night, line: C.night });
  s.addText("Mesma foto, tratamentos diferentes, desempenhos muito diferentes.", {
    x: M + 0.3, y: 4.2, w: 8.3, h: 0.68, margin: 0, valign: "middle", align: "center",
    fontFace: F.head, fontSize: 15, bold: true, color: C.white,
  });

  footer(s, "Proposta");
  fala(s, `
Todo sistema de inspeção automática segue esta sequência. O drone adquire a imagem, a imagem recebe algum tratamento, o modelo de rede neural a analisa e, no fim, sai um diagnóstico: cadeia com falha ou sem falha.
A maior parte das pesquisas concentra esforço no terceiro bloco, o modelo, buscando redes cada vez maiores. O segundo bloco, o pré-processamento, costuma ser tratado como detalhe e escolhido por hábito.
Só que a imagem de campo chega com sol de frente, sombra, céu estourado e vegetação ao fundo. A forma como ela é tratada decide o que a rede consegue enxergar.
Por isso, este trabalho coloca o pré-processamento no centro. Tudo o mais fica fixo, e a pergunta passa a ser: qual tratamento aplicar à imagem para que a rede identifique melhor a falha no isolador?`);
}

// ===========================================================================
// 10 - Literatura
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Estado da arte", "A literatura não chega a um acordo");

  const grupos = [
    ["=", "Sem efeito relevante", "Liu et al. (2021)\nWang et al. (2023)", C.muted],
    ["▲", "Melhora o desempenho", "Zhang et al. (2022)\nSalvi et al. (2021)", C.teal],
    ["▼", "Pode piorar", "Öztürk e Akdemir (2018)\nRodrigues et al. (2020)", C.amber],
  ];
  grupos.forEach((g, i) => {
    const x = M + i * 3.05;
    card(s, x, 1.35, 2.85, 2.75, { flat: true });
    bubble(s, x + 0.97, 1.6, 0.9, g[0], { fill: g[3], size: 26, color: i === 2 ? C.night : C.white });
    s.addText(g[1], {
      x: x + 0.15, y: 2.65, w: 2.55, h: 0.32, margin: 0, align: "center",
      fontFace: F.body, fontSize: 14, bold: true, color: g[3] === C.muted ? C.ink : g[3],
    });
    s.addText(g[2], {
      x: x + 0.15, y: 3.05, w: 2.55, h: 0.8, margin: 0, align: "center",
      fontFace: F.body, fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.15,
    });
  });

  card(s, M, 4.3, 8.9, 0.62, { fill: C.night, line: C.night });
  s.addText("Nenhum trabalho propõe como escolher o tratamento em um caso novo.", {
    x: M + 0.3, y: 4.3, w: 8.3, h: 0.62, margin: 0, valign: "middle", align: "center",
    fontFace: F.head, fontSize: 15, bold: true, color: C.white,
  });

  footer(s, "Proposta");
  fala(s, `
Quando se procura na literatura a resposta para essa pergunta, o que se encontra são conclusões opostas.
Liu e Wang, que trabalham com imagens do nosso domínio, relatam que o pré-processamento não teve efeito relevante.
Zhang, com processamento morfológico, e Salvi, em uma revisão na área médica, relatam ganho de desempenho.
Öztürk e Rodrigues mostram o contrário: tratar demais a imagem pode piorar o resultado, e em um dos casos a imagem original superou todas as versões processadas.
Cada trabalho relata o que funcionou no seu experimento, mas nenhum oferece um procedimento para decidir o que usar diante de uma linha, de um drone e de um conjunto de imagens novos. Essa é a lacuna.`);
}

// ===========================================================================
// 11 - Objetivo
// ===========================================================================
{
  const s = darkSlide();
  foto(s, "aerea_recorte.jpg", 6.35, 1.25, 3.1, 3.1);
  title(s, "Objetivo", "O que falta não é técnica, é critério", { dark: true, w: 5.5, h: 1.0, size: 26 });

  card(s, M, 1.62, 5.5, 1.95, { fill: C.nightSoft, line: C.tealDark, flat: true });
  s.addText("Desenvolver uma metodologia para comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem na detecção e classificação de falhas em cadeias de isoladores.", {
    x: M + 0.28, y: 1.75, w: 4.95, h: 1.7, margin: 0, valign: "middle",
    fontFace: F.head, fontSize: 15, bold: true, color: C.white, lineSpacingMultiple: 1.08,
  });

  ["Comparar", "Selecionar", "Combinar", "Aprimorar"].forEach((v, i) => {
    const x = M + i * 1.4;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 3.85, w: 1.28, h: 0.5, rectRadius: 0.1,
      fill: { color: C.night }, line: { color: C.amber, width: 1 },
    });
    s.addText(v, {
      x, y: 3.85, w: 1.28, h: 0.5, margin: 0, align: "center", valign: "middle",
      fontFace: F.body, fontSize: 11.5, bold: true, color: C.amber,
    });
  });

  footer(s, "Proposta", true);
  fala(s, `
Daí vem o objetivo do trabalho. O que falta na área não é técnica de processamento, porque existe um catálogo enorme delas. O que falta é critério para escolher entre elas.
O objetivo geral é desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem para a detecção e a classificação de falhas em cadeias de isoladores.
Os quatro verbos organizam o trabalho: comparar as técnicas entre si, selecionar a mais adequada para cada cenário, combinar técnicas em sequência e aprimorar os seus parâmetros de forma automática.
Os modelos de rede neural entram como instrumento de medida, e não como produto final.`);
}

// ===========================================================================
// 12 - Metodologia geral
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "Um fluxo iterativo, do dado à decisão");

  figFluxo(s, "geral", 0.5, 1.18, { h: 3.8 });

  const etapas = [
    "Seleção e validação do dataset", "Pré-processamento", "Ajuste de parâmetros",
    "Escolha e construção do modelo", "Treinamento", "Avaliação e ajustes",
  ];
  etapas.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 2.5 + col * 3.6, y = 1.3 + row * 0.8;
    card(s, x, y, 3.4, 0.66, { flat: true });
    bubble(s, x + 0.14, y + 0.15, 0.36, String(i + 1), { fill: i === 5 ? C.amber : C.teal, size: 10, color: i === 5 ? C.night : C.white });
    s.addText(e, {
      x: x + 0.6, y, w: 2.72, h: 0.66, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 12, bold: true, color: C.ink,
    });
  });

  card(s, 2.5, 3.85, 7.0, 1.0, { fill: C.night, line: C.night });
  s.addText([
    { text: "↺  ", options: { color: C.amber, fontSize: 22, bold: true } },
    { text: "Se o desempenho não atende, o fluxo volta ao pré-processamento e ao modelo.", options: { color: C.white, fontSize: 13.5 } },
  ], { x: 2.75, y: 3.85, w: 6.6, h: 1.0, margin: 0, valign: "middle", fontFace: F.body });

  footer(s, "Proposta");
  fala(s, `
Esta é a metodologia proposta, na sua visão geral. O fluxo percorre seis etapas. Primeiro, a seleção e a validação do conjunto de imagens, com as métricas definidas antes de qualquer experimento. Depois, o pré-processamento, com técnicas isoladas e combinadas. Em seguida, o ajuste automático dos parâmetros dessas técnicas. Depois, a escolha e a construção do modelo, o treinamento e, por fim, a avaliação.
O ponto central está no retorno do fluxo. Se o desempenho não atende ao critério, a avaliação devolve o processo ao pré-processamento e à escolha do modelo, e o ciclo se repete.
Para uma concessionária, isso significa ter um procedimento que pode ser executado de novo sempre que muda o drone, a câmera, o tipo de linha ou o modelo de inteligência artificial.`);
}

// ===========================================================================
// 13 - Fluxograma detalhado
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "Quatro decisões conduzem o fluxo");

  figFluxo(s, "completo", 0.55, 1.15, { h: 3.82 });

  const decisoes = ["Dataset está balanceado?", "Combinar técnicas?", "Tipo de tarefa?", "Desempenho satisfatório?"];
  decisoes.forEach((d, i) => {
    const y = 1.3 + i * 0.72;
    s.addShape(pres.ShapeType.diamond, {
      x: 2.55, y: y + 0.04, w: 0.5, h: 0.5,
      fill: { color: i === 3 ? C.amber : C.teal }, line: { type: "none" },
    });
    s.addText(String(i + 1), {
      x: 2.55, y: y + 0.04, w: 0.5, h: 0.5, margin: 0, align: "center", valign: "middle",
      fontFace: F.body, fontSize: 11, bold: true, color: i === 3 ? C.night : C.white,
    });
    s.addText(d, {
      x: 3.25, y, w: 6.2, h: 0.58, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 15, bold: true, color: C.ink,
    });
  });

  card(s, 2.5, 4.3, 7.0, 0.62, { fill: C.surface, flat: true });
  s.addText("Caminho deste trabalho: dados desbalanceados, técnicas isoladas e combinadas, classificação, ajuste automático.", {
    x: 2.7, y: 4.3, w: 6.6, h: 0.62, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 11.5, italic: true, color: C.ink,
  });

  footer(s, "Proposta");
  fala(s, `
Esta é a versão detalhada do mesmo fluxo, que está na dissertação. Não vou percorrer cada bloco, mas destaco os quatro pontos de decisão, que são os losangos do diagrama.
O primeiro verifica se o conjunto de imagens está balanceado, o que é raro em inspeção, porque há muito mais isoladores bons do que defeituosos.
O segundo decide se as técnicas serão usadas isoladas ou combinadas.
O terceiro define o tipo de tarefa, entre classificação, detecção ou regressão.
O quarto verifica se o desempenho é satisfatório.
São essas decisões que fazem da metodologia um procedimento, e não uma receita fixa. Neste trabalho, o caminho percorrido foi o de um conjunto desbalanceado, técnicas isoladas e combinadas, tarefa de classificação e busca automática de parâmetros.`);
}

// ===========================================================================
// 14 - Dois cenários
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Materiais", "Dois cenários reais de inspeção de linhas");

  const cenarios = [
    ["cplid_faixa.jpg", "CPLID", C.teal, [
      "Linhas de transmissão com isoladores cerâmicos",
      "Defeito estrutural: disco ausente ou fraturado",
      "721 imagens, fundo homogêneo",
    ]],
    ["campo_faixa.jpg", "DRNPW", C.amber, [
      "Inspeção por drone da CPFL em operação real",
      "Fundo com vegetação, estradas e construções",
      "585 imagens, fortemente desbalanceado",
    ]],
  ];
  cenarios.forEach((c, i) => {
    const x = M + i * 4.6;
    foto(s, c[0], x, 1.3, 4.3, 2.0);
    s.addText(c[1], {
      x, y: 3.42, w: 4.3, h: 0.36, margin: 0,
      fontFace: F.head, fontSize: 18, bold: true, color: c[2],
    });
    bullets(s, c[3], { x: x + 0.02, y: 3.82, w: 4.25, h: 1.05, size: 11.5, gap: 3 });
  });

  footer(s, "Materiais", false, "Foto à direita: inspeção por drone da CPFL, ilustrativa do cenário DRNPW");
  fala(s, `
Para validar a metodologia, usei dois conjuntos de imagens que representam cenários de inspeção com dificuldades bem diferentes.
O primeiro é o CPLID, um conjunto público de cadeias de isoladores cerâmicos de linhas de transmissão, fotografadas por drone. O fundo é relativamente homogêneo e o defeito é estrutural: disco ausente ou fraturado. São 721 imagens, 678 para treino e 43 para teste.
O segundo é o DRNPW, formado por imagens de inspeção por drone cedidas pela CPFL, em condição real de operação. Aqui a cadeia aparece sobre vegetação, estradas e construções, como na foto, o que torna muito mais difícil separar o componente elétrico do fundo. São 585 imagens, e o conjunto é fortemente desbalanceado: 335 das 468 imagens de treino pertencem a uma única categoria.
Esse é exatamente o problema que uma concessionária encontra na prática: poucos exemplos de defeito no meio de muitas imagens de isoladores em bom estado.`);
}

// ===========================================================================
// 15 - O que cada tratamento faz
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Pré-processamento", "O que cada tratamento faz com a imagem");

  const tiles = [
    ["proc_original.jpg", "Imagem original"],
    ["proc_contraste.jpg", "Realce de contraste"],
    ["proc_equalizacao.jpg", "Equalização de histograma"],
    ["proc_cinza.jpg", "Tons de cinza"],
    ["proc_desfoque.jpg", "Desfoque gaussiano"],
    ["proc_bordas.jpg", "Detecção de bordas"],
  ];
  const tw = 2.1, th = tw * 0.75;
  tiles.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (tw + 0.2), y = 1.22 + row * (th + 0.4);
    foto(s, t[0], x, y, tw, th, i === 1 ? { borda: C.amber, espessura: 3 } : {});
    s.addText(t[1], {
      x, y: y + th + 0.03, w: tw, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 10.5, bold: true, color: i === 1 ? C.amber : C.ink,
    });
  });

  card(s, 7.45, 1.22, 2.0, 3.8, { fill: C.night, line: C.night });
  s.addText("14", {
    x: 7.45, y: 1.45, w: 2.0, h: 0.8, margin: 0, align: "center",
    fontFace: F.head, fontSize: 44, bold: true, color: C.amber,
  });
  s.addText("variantes avaliadas", {
    x: 7.6, y: 2.25, w: 1.7, h: 0.3, margin: 0, align: "center",
    fontFace: F.body, fontSize: 11.5, bold: true, color: C.white,
  });
  s.addText([
    { text: "10", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "técnicas simples", options: { fontSize: 10.5, color: C.white, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "4", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "combinações", options: { fontSize: 10.5, color: C.white } },
  ], { x: 7.6, y: 2.75, w: 1.7, h: 2.0, margin: 0, align: "center", fontFace: F.body });

  footer(s, "Materiais", false, "Tratamentos aplicados para ilustração sobre foto de inspeção por drone da CPFL");
  fala(s, `
Para dar concretude, apliquei alguns dos tratamentos avaliados sobre a mesma foto de campo.
No alto, à esquerda, a imagem original. Ao lado, o realce de contraste, que amplia a diferença entre claro e escuro e destaca o vidro e as ferragens contra a vegetação. Depois, a equalização de histograma, que redistribui os tons da imagem inteira.
Na linha de baixo, a conversão para tons de cinza, que descarta a cor. O desfoque gaussiano, que suaviza o ruído, mas também apaga detalhes finos, como uma trinca ou uma mancha de corrosão. E a detecção de bordas, que reduz a imagem a contornos.
Nenhum desses tratamentos é bom ou ruim por si só. A pergunta é qual deles, ou qual combinação deles, ajuda a rede a reconhecer a falha em cada cenário. No total, foram avaliadas 14 variantes: 10 técnicas simples e 4 combinações.`);
}

// ===========================================================================
// 16 - Protocolo e régua de leitura
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Protocolo experimental", "Uma variável por vez e uma régua de leitura");

  const eq = [["14", "tratamentos"], ["2", "cenários"], ["2", "modelos"], ["56", "treinamentos completos"]];
  const bw = 1.75, opw = 0.63;
  eq.forEach((e, i) => {
    const x = M + i * (bw + opw);
    const fim = i === eq.length - 1;
    card(s, x, 1.3, bw, 1.25, fim ? { fill: C.night, line: C.night } : { flat: true });
    s.addText(e[0], {
      x, y: 1.36, w: bw, h: 0.7, margin: 0, align: "center",
      fontFace: F.head, fontSize: 34, bold: true, color: fim ? C.amber : C.teal,
    });
    s.addText(e[1], {
      x: x + 0.1, y: 2.05, w: bw - 0.2, h: 0.4, margin: 0, align: "center",
      fontFace: F.body, fontSize: 11, color: fim ? C.white : C.muted,
    });
    if (!fim) {
      s.addText(i === 2 ? "=" : "×", {
        x: x + bw, y: 1.6, w: opw, h: 0.6, margin: 0, align: "center", valign: "middle",
        fontFace: F.head, fontSize: 26, bold: true, color: C.mutedLight,
      });
    }
  });

  card(s, M, 2.85, 8.9, 2.0, { fill: C.surface, flat: true });
  s.addText("Piso majoritário", {
    x: M + 0.3, y: 3.0, w: 4.4, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
  });
  s.addText("Acerto de quem responde sempre a classe mais comum, sem olhar a imagem. Abaixo dele, o modelo não aprendeu a reconhecer a falha.", {
    x: M + 0.3, y: 3.35, w: 4.4, h: 1.3, margin: 0,
    fontFace: F.body, fontSize: 12.5, color: C.ink, lineSpacingMultiple: 1.1,
  });
  [["74,42%", "piso do CPLID", C.teal], ["73,33%", "piso do DRNPW", C.amber]].forEach((p, i) => {
    const x = 5.55 + i * 1.95;
    s.addText(p[0], {
      x, y: 3.2, w: 1.85, h: 0.7, margin: 0, align: "center",
      fontFace: F.head, fontSize: 28, bold: true, color: p[2],
    });
    s.addText(p[1], {
      x, y: 3.9, w: 1.85, h: 0.3, margin: 0, align: "center",
      fontFace: F.body, fontSize: 11, color: C.muted,
    });
  });

  footer(s, "Materiais");
  fala(s, `
O protocolo experimental isola uma única variável. Para cada um dos 14 tratamentos, nos dois cenários, treinei a mesma rede, com a mesma configuração, mudando apenas a imagem de entrada. Depois repeti tudo com uma segunda arquitetura, o que totaliza 56 treinamentos completos.
A rede principal é uma rede convolucional deliberadamente simples, com duas camadas convolucionais e treinada por 50 épocas. Um modelo simples e estável permite atribuir a diferença de desempenho ao tratamento da imagem, e não ao modelo.
Antes dos resultados, preciso fixar uma régua. Os conjuntos de teste são desbalanceados, então um modelo que responde sempre a classe mais comum, sem olhar a imagem, já acerta muito. No CPLID, esse piso é de 74,42 por cento. No DRNPW, de 73,33 por cento. Qualquer resultado abaixo desses valores significa que o modelo não aprendeu a reconhecer a falha.`);
}

// ===========================================================================
// 17 - Resultados CPLID
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · Linhas de transmissão com isoladores cerâmicos", "Realçar o contraste evidencia o defeito estrutural", { size: 25 });

  slideFigura(s, figura("CNN", "CPLID"),
    "Acurácia da rede por tratamento, em ordem crescente, com a imagem tratada acima de cada barra (CPLID)",
    [
      ["95,35%", "MELHOR", "Realce de contraste, com F1-score de 96,55%, o maior do cenário.", "teal"],
      ["67,44%", "PIOR", "Desfoque, abaixo da imagem original (93,02%) e do piso (74,42%).", "dark"],
      ["−25,6 pp", "TRATAMENTO ERRADO", "Perda de acurácia em relação à imagem sem tratamento.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
Primeiro cenário: cadeias cerâmicas de linhas de transmissão, com defeito estrutural. O gráfico mostra a acurácia da rede para cada um dos 14 tratamentos, em ordem crescente, com a imagem tratada acima de cada barra.
No topo, três tratamentos empatam em 95,35 por cento de acurácia, e todos têm algo em comum: ampliam o contraste. O realce de contraste simples teve ainda o maior F1-score do cenário, 96,55 por cento.
Do ponto de vista do defeito, isso faz sentido. A falha aqui é a ausência ou a fratura de um disco, uma descontinuidade na silhueta da cadeia, e ampliar o contraste deixa essa descontinuidade mais nítida.
Na outra ponta, o desfoque, a remoção de ruído e a limiarização adaptativa caem para 67,44 por cento. Isso fica abaixo da imagem sem tratamento, que atingiu 93,02 por cento, e abaixo até do piso majoritário. Em outras palavras, o tratamento errado apagou justamente a evidência da falha e deixou o modelo cego.
Cabe uma ressalva: entre o realce de contraste e a imagem original, a diferença é de uma única imagem de teste. O resultado mais forte deste cenário não é o ganho no topo, é a perda na base. Escolher mal o tratamento custou mais de 25 pontos percentuais de acurácia.`);
}

// ===========================================================================
// 18 - Resultados DRNPW
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · Inspeção por drone em campo", "Combinar técnicas separa o isolador do fundo", { size: 25 });

  slideFigura(s, figura("CNN", "DRNPW"),
    "Acurácia da rede por tratamento, em ordem crescente, nas imagens de inspeção por drone da CPFL (DRNPW)",
    [
      ["83,33%", "MELHOR", "Realce de contraste seguido de equalização, com F1-score de 75,76%.", "amber"],
      ["49,12%", "F1 ORIGINAL", "Imagem sem tratamento, com 63,33% de acurácia.", "dark"],
      ["+26,6 pp", "GANHO EM F1", "Mesma rede e mesmas imagens, apenas com o tratamento certo.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
O segundo cenário é o mais próximo da realidade de uma concessionária: imagens de campo da CPFL, com vegetação, estrada e construções ao fundo.
Aqui o melhor resultado veio de uma combinação, o realce de contraste seguido da equalização de histograma, com 83,33 por cento de acurácia e 75,76 por cento de F1-score. A mesma rede, treinada com as imagens originais, ficou em 63,33 por cento de acurácia e 49,12 por cento de F1-score.
São 20 pontos de acurácia e mais de 26 pontos de F1-score de diferença, obtidos sem trocar o drone, a câmera ou o modelo, apenas tratando a imagem.
A leitura elétrica é que, com fundo poluído, o problema deixa de ser só enxergar o defeito e passa a ser separar o isolador do ambiente. A combinação de técnicas faz isso melhor que qualquer técnica isolada.
Também aqui preciso ser cuidadoso. O conjunto de teste tem 30 imagens, e a vantagem sobre o piso majoritário equivale a três imagens. O resultado indica uma direção clara, mas precisa ser confirmado com mais dados de campo.`);
}

// ===========================================================================
// 19 - Simples contra combinadas
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados", "Combinar técnicas compensa nos dois cenários");

  const simplesCPLID = r2(media(CPLID_CNN, SIMPLES)), hibCPLID = r2(media(CPLID_CNN, HIBRIDAS));
  const simplesDRNPW = r2(media(DRNPW_CNN, SIMPLES)), hibDRNPW = r2(media(DRNPW_CNN, HIBRIDAS));

  s.addChart(pres.ChartType.bar, [
    { name: "Técnicas simples", labels: ["CPLID", "DRNPW"], values: [simplesCPLID, simplesDRNPW] },
    { name: "Técnicas combinadas", labels: ["CPLID", "DRNPW"], values: [hibCPLID, hibDRNPW] },
  ], {
    x: 0.3, y: 1.4, w: 5.4, h: 3.5,
    barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [C.mutedLight, C.teal],
    valAxisMinVal: 50, valAxisMaxVal: 100,
    dataLabelFormatCode: '0.00"%"',
    ...chartBase,
    showLegend: true, legendPos: "b", legendColor: C.muted, legendFontFace: F.body, legendFontSize: 10,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 12, dataLabelFontSize: 10,
  });
  legenda(s, "Acurácia média por grupo de técnicas", 0.3, 1.16, 5.4);

  const dif = (a, b) => "+" + (b - a).toFixed(2).replace(".", ",");
  stat2(6.0, dif(simplesCPLID, hibCPLID), "pontos percentuais\nno CPLID", C.teal);
  stat2(7.8, dif(simplesDRNPW, hibDRNPW), "pontos percentuais\nno DRNPW", C.amber);
  function stat2(x, v, l, cor) {
    s.addText(v, { x, y: 1.5, w: 1.7, h: 0.65, margin: 0, fontFace: F.head, fontSize: 32, bold: true, color: cor });
    s.addText(l, { x, y: 2.15, w: 1.7, h: 0.5, margin: 0, fontFace: F.body, fontSize: 11, color: C.muted });
  }

  card(s, 6.0, 3.05, 3.45, 1.8, { fill: C.night, line: C.night });
  s.addText("A ordem importa", {
    x: 6.22, y: 3.2, w: 3.0, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13, bold: true, color: C.amber,
  });
  s.addText("Realce seguido de CLAHE não é o mesmo que CLAHE seguido de realce.", {
    x: 6.22, y: 3.55, w: 3.0, h: 1.1, margin: 0,
    fontFace: F.body, fontSize: 12.5, color: C.white, lineSpacingMultiple: 1.08,
  });

  footer(s, "Resultados");
  fala(s, `
Agrupando os resultados, as combinações de técnicas superaram as técnicas isoladas nos dois cenários. No CPLID, a vantagem média foi de 13,49 pontos percentuais. No DRNPW, de 5,17 pontos.
Um detalhe prático: a ordem das operações importa. Aplicar o realce e depois o CLAHE não produz o mesmo resultado que aplicar o CLAHE e depois o realce, por isso as duas ordens foram avaliadas.
Para quem vai implantar um sistema de inspeção, a mensagem é que o pré-processamento deve ser pensado como uma sequência configurável, e não como um filtro único.`);
}

// ===========================================================================
// 20 - Ajuste automático
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Otimização de parâmetros", "O ajuste do tratamento passa a ser automático");

  s.addChart(pres.ChartType.line, [{
    name: "Acurácia",
    labels: ["0,500", "0,778", "1,056", "1,333", "1,611"],
    values: [76.7, 83.3, 80.0, 90.0, 83.3],
  }], {
    x: 0.3, y: 1.45, w: 5.4, h: 3.4,
    chartColors: [C.teal], lineDataSymbol: "circle", lineDataSymbolSize: 9, lineSize: 3,
    valAxisMinVal: 60, valAxisMaxVal: 100,
    dataLabelFormatCode: '0.0"%"',
    ...chartBase,
    dataLabelPosition: "t", dataLabelFontSize: 10,
  });
  legenda(s, "Busca em grade: acurácia por fator de realce de contraste (DRNPW)", 0.3, 1.2, 5.4);

  [["1,333", "Busca em grade", "90,0% de acurácia no teste", C.teal],
    ["1,4364", "Busca aleatória", "85,06% de acurácia na validação", C.amber]].forEach((b, i) => {
    const y = 1.35 + i * 1.2;
    card(s, 6.0, y, 3.45, 1.05, { flat: true });
    s.addText(b[0], {
      x: 6.2, y: y + 0.1, w: 1.5, h: 0.6, margin: 0,
      fontFace: F.head, fontSize: 24, bold: true, color: b[3],
    });
    s.addText([
      { text: b[1], options: { bold: true, color: C.ink, breakLine: true } },
      { text: b[2], options: { color: C.muted } },
    ], { x: 7.65, y: y + 0.12, w: 1.75, h: 0.8, margin: 0, fontFace: F.body, fontSize: 10.5, valign: "middle" });
  });

  card(s, 6.0, 3.85, 3.45, 1.0, { fill: C.night, line: C.night });
  s.addText("Os dois métodos apontam para um realce moderado, pouco acima de 1,0.", {
    x: 6.2, y: 3.85, w: 3.05, h: 1.0, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 12.5, bold: true, color: C.white,
  });

  footer(s, "Resultados");
  fala(s, `
A etapa seguinte substitui a tentativa e erro pelo ajuste automático. O parâmetro escolhido foi o fator do realce de contraste, no cenário de campo.
A busca em grade testou cinco valores entre 0,5 e 1,6, e o melhor foi 1,333, com 90 por cento de acurácia e 85,3 por cento de F1-score. A busca aleatória, feita como complemento, encontrou 1,4364, com 85 por cento de acurácia na validação.
Os dois métodos apontam para a mesma região: um realce moderado, pouco acima de 1. Contraste demais também atrapalha, e no fator 2,33 a acurácia caiu para 71 por cento.
Registro as ressalvas: as duas buscas usaram conjuntos diferentes, e esse treinamento foi mais curto que o das varreduras anteriores, então os números não se comparam diretamente.
O ganho prático é outro. O ajuste deixa de depender da experiência de quem configura o sistema e passa a ser um procedimento automático e repetível.`);
}

// ===========================================================================
// 21 - Troca de modelo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional", "Trocar o modelo inverte a melhor técnica");

  s.addChart(pres.ChartType.bar, [
    { name: "Rede convolucional simples", labels: ["CPLID", "DRNPW"], values: [r2(media(CPLID_CNN)), r2(media(DRNPW_CNN))] },
    { name: "YOLOv8n-cls", labels: ["CPLID", "DRNPW"], values: [r2(media(CPLID_YOLO)), r2(media(DRNPW_YOLO))] },
    { name: "Piso majoritário", labels: ["CPLID", "DRNPW"], values: [74.42, 73.33] },
  ], {
    x: 0.3, y: 1.42, w: 5.2, h: 3.45,
    barDir: "col", barGrouping: "clustered", barGapWidthPct: 55,
    chartColors: [C.teal, C.amber, C.mutedLight],
    valAxisMinVal: 50, valAxisMaxVal: 95,
    dataLabelFormatCode: '0.00"%"',
    ...chartBase,
    showLegend: true, legendPos: "b", legendColor: C.muted, legendFontFace: F.body, legendFontSize: 9.5,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 11,
  });
  legenda(s, "Acurácia média nos 14 tratamentos", 0.3, 1.2, 5.2);

  const casos = [
    ["CLAHE + realce", "CPLID", CPLID_CNN[2], CPLID_YOLO[2]],
    ["Realce + equalização", "DRNPW", DRNPW_CNN[5], DRNPW_YOLO[5]],
    ["Tons de cinza", "CPLID", CPLID_CNN[11], CPLID_YOLO[11]],
  ];
  s.addText("A mesma técnica nos dois modelos", {
    x: 5.8, y: 1.35, w: 3.65, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 11.5, bold: true, color: C.ink,
  });
  casos.forEach((c, i) => {
    const y = 1.72 + i * 1.05;
    const sobe = c[3] > c[2];
    card(s, 5.8, y, 3.65, 0.92, { flat: true });
    s.addText([
      { text: c[0], options: { bold: true, color: C.ink, breakLine: true } },
      { text: c[1], options: { color: C.muted, fontSize: 9.5 } },
    ], { x: 5.98, y: y + 0.1, w: 1.55, h: 0.72, margin: 0, fontFace: F.body, fontSize: 11, valign: "middle" });
    s.addText([
      { text: pct(c[2]), options: { color: C.teal, bold: true } },
      { text: "  →  ", options: { color: C.mutedLight } },
      { text: pct(c[3]), options: { color: sobe ? C.teal : C.amber, bold: true } },
    ], { x: 7.5, y: y + 0.1, w: 1.9, h: 0.72, margin: 0, fontFace: F.head, fontSize: 13.5, valign: "middle", align: "right" });
  });

  footer(s, "Resultados");
  fala(s, `
Até aqui, todos os resultados usaram a mesma rede. Surge então uma pergunta que interessa diretamente a quem implanta o sistema: se a empresa trocar o modelo de IA, a melhor técnica continua sendo a mesma?
Como a metodologia trata o modelo como um bloco substituível, repeti os 28 treinamentos com o YOLOv8n-cls, uma rede pré-treinada e de maior capacidade.
O resultado surpreende em dois pontos. Primeiro, a rede maior não foi melhor. No CPLID, a sua acurácia média foi de 66,28 por cento, contra 84,55 da rede simples, e ela superou o piso em apenas 1 dos 14 tratamentos. Com poucos exemplos de defeito, mais capacidade não compensa a falta de dados.
Segundo, e mais importante, a ordem das técnicas se inverteu. A combinação de CLAHE com realce, que empatava no topo com 95,35 por cento, caiu para 51,16 com o YOLO. A melhor combinação do cenário de campo caiu de 83,33 para 53,33. E os tons de cinza, que eram fracos, passaram a liderar no CPLID.
A consequência prática é direta: o pré-processamento não se transfere de um modelo para outro. Cada troca de modelo exige refazer a seleção, e é justamente isso que a metodologia torna rápido e controlado.`);
}

// ===========================================================================
// 22 - O que o método entrega
// ===========================================================================
{
  const s = darkSlide();
  title(s, "Impacto", "O que o método entrega à concessionária", { dark: true });

  const entregas = [
    ["+26,6 pp", "Mais detecção", "de F1-score em imagens reais de campo, só com o tratamento certo"],
    ["−25,6 pp", "Proteção contra o erro", "de acurácia perdidos quando o tratamento é mal escolhido"],
    ["Só software", "Sem hardware novo", "mesmo drone, mesma câmera, mesmo modelo de IA"],
    ["↺", "Continuidade", "procedimento repetível a cada troca de drone, câmera, linha ou modelo"],
  ];
  entregas.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 1.35 + row * 1.8;
    card(s, x, y, 4.35, 1.62, { fill: C.nightSoft, line: C.nightSoft, flat: true });
    s.addText(e[0], {
      x: x + 0.25, y: y + 0.15, w: 3.9, h: 0.65, margin: 0,
      fontFace: F.head, fontSize: 28, bold: true, color: i % 3 === 0 ? C.amber : C.tealLight,
    });
    s.addText(e[1], {
      x: x + 0.25, y: y + 0.8, w: 3.9, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 13, bold: true, color: C.white,
    });
    s.addText(e[2], {
      x: x + 0.25, y: y + 1.1, w: 3.9, h: 0.4, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.mutedLight,
    });
  });

  footer(s, "Impacto", true);
  fala(s, `
Traduzindo esses resultados para a linguagem de uma concessionária, destaco quatro entregas.
A primeira é ganho de detecção. No cenário de campo, o tratamento correto elevou o F1-score da rede em mais de 26 pontos percentuais. O F1-score penaliza tanto o alarme falso quanto o defeito não detectado, então esse ganho significa menos isoladores com falha passando despercebidos e menos deslocamentos desnecessários de equipe.
A segunda é proteção contra o erro. No CPLID, um tratamento mal escolhido derrubou a acurácia em mais de 25 pontos, e a metodologia existe para impedir que isso chegue à operação.
A terceira é custo. Todo esse ganho veio de software, sem comprar drone, câmera ou modelo novo. Aplicar um tratamento de imagem custa praticamente nada perto de trocar equipamento.
A quarta é continuidade. As empresas trocam de drone, de câmera e de modelo com frequência, e cada troca, como vimos, muda o tratamento ideal. A metodologia oferece um procedimento para refazer essa escolha sem recomeçar do zero.`);
}

// ===========================================================================
// 23 - Ganho financeiro (estimativa)
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Impacto", "Quanto vale inspecionar melhor");

  const passos = [
    ["≈ 177 mil km", "de linhas na Rede Básica"],
    ["≈ 2 torres", "por km, vão médio de 500 m"],
    ["≈ 350 mil", "estruturas"],
    ["R$ 450", "de economia por torre com drone"],
    ["≈ R$ 157 mi", "por ciclo de inspeção"],
  ];
  const ops = ["×", "=", "×", "="];
  const bw = 1.55, ow = 0.29;
  passos.forEach((p, i) => {
    const x = M + i * (bw + ow);
    const fim = i === passos.length - 1;
    card(s, x, 1.35, bw, 1.45, fim ? { fill: C.night, line: C.night } : { flat: true });
    s.addText(p[0], {
      x: x + 0.05, y: 1.5, w: bw - 0.1, h: 0.55, margin: 0, align: "center", valign: "middle",
      fontFace: F.head, fontSize: fim ? 17 : 16, bold: true, color: fim ? C.amber : C.teal,
    });
    s.addText(p[1], {
      x: x + 0.1, y: 2.08, w: bw - 0.2, h: 0.6, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10, color: fim ? C.white : C.muted,
    });
    if (i < ops.length) {
      s.addText(ops[i], {
        x: x + bw, y: 1.8, w: ow, h: 0.5, margin: 0, align: "center", valign: "middle",
        fontFace: F.head, fontSize: 20, bold: true, color: C.mutedLight,
      });
    }
  });
  legenda(s, "Estimativa de ordem de grandeza. Economia por torre: R$ 750 no método tradicional contra R$ 300 com drone.", M, 2.9, 8.9);

  const extras = [
    ["Continuidade", "Cada falha evitada reduz DEC, FEC e o R$ 1 bi anual em compensações ao consumidor"],
    ["Receita", "Menos horas de indisponibilidade descontadas na Parcela Variável da transmissora"],
    ["Condição para escala", "Milhares de imagens por campanha só viram economia com triagem automática confiável"],
  ];
  extras.forEach((e, i) => {
    const x = M + i * 3.05;
    card(s, x, 3.35, 2.85, 1.52, i === 2 ? { fill: C.night, line: C.night } : { flat: true });
    s.addText(e[0], {
      x: x + 0.2, y: 3.47, w: 2.5, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: i === 2 ? C.amber : C.teal,
    });
    s.addText(e[1], {
      x: x + 0.2, y: 3.8, w: 2.5, h: 0.95, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: i === 2 ? C.white : C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Impacto", false, "Bases: ONS (PAR/PEL 2025), DronePower (Energy Summit 2025) e ANEEL (2025)");
  fala(s, `
Para dar uma ordem de grandeza ao ganho financeiro, faço uma estimativa simples, com premissas explícitas.
A Rede Básica tem cerca de 177 mil quilômetros de linhas. Considerando um vão médio de 500 metros, são cerca de 2 torres por quilômetro, o que dá algo como 350 mil estruturas. Tomando como referência a redução de 750 para 300 reais por torre com a inspeção por drone, a economia é de 450 reais por estrutura. Multiplicando, chega-se a cerca de 157 milhões de reais por ciclo completo de inspeção, só na Rede Básica, sem contar a distribuição.
É uma estimativa de ordem de grandeza, e não um orçamento. Mas ela deixa claro onde a inteligência artificial entra: essa economia só se sustenta se as milhares de imagens de cada campanha forem triadas automaticamente e com confiabilidade, que é exatamente o que este trabalho melhora.
E há o ganho que não aparece nessa conta. Cada falha detectada antes do desligamento reduz o DEC e o FEC, evita compensações ao consumidor e preserva a receita da transmissora na Parcela Variável.`);
}

// ===========================================================================
// 24 - Outras vantagens da IA
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Impacto", "Além do custo: segurança, escala e padronização");

  const vant = [
    ["Segurança", "Menos equipe em altura e perto de condutores energizados"],
    ["Escala", "De 5 para 25 torres por dia, com todas as imagens analisadas"],
    ["Padronização", "O mesmo critério da primeira à milésima imagem, sem cansaço"],
    ["Rastreabilidade", "Histórico de imagens por torre para acompanhar a corrosão ano a ano"],
    ["Priorização", "Manutenção guiada pela condição do isolador, e não só pelo calendário"],
    ["Rapidez", "Imagem analisada logo após o voo e alerta direto para a manutenção"],
  ];
  vant.forEach((v, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 3.05, y = 1.35 + row * 1.8;
    card(s, x, y, 2.85, 1.6, { flat: true });
    s.addShape(pres.ShapeType.rect, { x, y, w: 2.85, h: 0.08, fill: { color: row === 0 ? C.teal : C.amber }, line: { type: "none" } });
    bubble(s, x + 0.2, y + 0.3, 0.46, String(i + 1), { fill: row === 0 ? C.teal : C.amber, color: row === 0 ? C.white : C.night });
    s.addText(v[0], {
      x: x + 0.8, y: y + 0.3, w: 1.95, h: 0.46, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
    });
    s.addText(v[1], {
      x: x + 0.2, y: y + 0.88, w: 2.5, h: 0.62, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Impacto", false, "Produtividade de 5 para 25 torres por dia: DronePower (Energy Summit 2025)");
  fala(s, `
O ganho da inteligência artificial na inspeção não é só financeiro.
O primeiro é segurança: menos gente escalando estruturas e trabalhando perto de condutores energizados.
O segundo é escala. O drone multiplica a quantidade de torres inspecionadas por dia, e a IA garante que o volume de imagens resultante seja de fato analisado.
O terceiro é padronização. O modelo aplica o mesmo critério à primeira e à milésima imagem, sem cansaço e sem variação entre analistas.
O quarto é rastreabilidade. Cada torre passa a ter um histórico de imagens, o que permite acompanhar, por exemplo, a evolução de uma corrosão de um ano para o outro.
O quinto é priorização, com a manutenção orientada pela condição real do isolador, e não apenas pelo calendário.
E o sexto é rapidez. A imagem pode ser analisada logo depois do voo, e o alerta chega à equipe de manutenção antes que a falha evolua.`);
}

// ===========================================================================
// 25 - Conclusões
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Conclusões", "O que os resultados sustentam");

  const cs = [
    ["O pré-processamento é determinante na detecção de falhas em isoladores", "No campo, o tratamento certo elevou o F1-score em 26,6 pp. No CPLID, o errado derrubou a acurácia abaixo do piso."],
    ["O melhor tratamento depende da linha, do defeito e do fundo da imagem", "Contraste para defeito estrutural em cadeias cerâmicas. Combinações para imagens de campo com fundo poluído."],
    ["A escolha precisa ser refeita a cada troca de modelo", "A melhor técnica de uma rede foi a pior da outra. A metodologia torna essa reexecução sistemática."],
  ];
  cs.forEach((c, i) => {
    const y = 1.35 + i * 1.2;
    card(s, M, y, 8.9, 1.05, { flat: true });
    bubble(s, M + 0.22, y + 0.28, 0.5, String(i + 1), { fill: i === 2 ? C.amber : C.teal, color: i === 2 ? C.night : C.white });
    s.addText(c[0], {
      x: M + 0.9, y: y + 0.13, w: 7.8, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
    });
    s.addText(c[1], {
      x: M + 0.9, y: y + 0.48, w: 7.8, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Conclusões");
  fala(s, `
Concluindo.
Primeira conclusão: na detecção de falhas em cadeias de isoladores, o pré-processamento da imagem é determinante. Ele mudou o desempenho na mesma escala que a troca de arquitetura. Para melhor, com mais de 26 pontos de F1-score no cenário de campo. E para pior, derrubando o modelo abaixo do piso no CPLID.
Segunda conclusão: não existe um tratamento universal. Para defeitos estruturais em cadeias cerâmicas de linhas de transmissão, ampliar o contraste funcionou melhor. Para imagens de campo com vegetação e construções ao fundo, as combinações de técnicas foram mais eficazes. A escolha depende da linha, do tipo de defeito e das condições de captura.
Terceira conclusão: essa escolha não se transfere entre modelos. A melhor técnica de uma rede foi a pior da outra. Por isso, a seleção precisa ser refeita a cada mudança, e a metodologia proposta existe para que essa reexecução seja sistemática, e não tentativa e erro.`);
}

// ===========================================================================
// 26 - Limitações e próximos passos
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Conclusões", "Limitações e próximos passos");

  card(s, M, 1.35, 4.3, 3.5, { fill: C.surface, flat: true });
  s.addText("Limitações", {
    x: M + 0.28, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.muted,
  });
  bullets(s, [
    "Poucas imagens públicas de isoladores com defeito anotado",
    "Testes pequenos: uma imagem vale até 3,3 pp",
    "Otimização restrita a um parâmetro pelo custo computacional",
  ], { x: M + 0.3, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 10 });

  card(s, M + 4.6, 1.35, 4.3, 3.5, { fill: C.night, line: C.night });
  s.addText("Próximos passos", {
    x: M + 4.88, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.amber,
  });
  bullets(s, [
    "Base maior com imagens de campo das concessionárias",
    "Defeitos sintéticos gerados com GANs",
    "Otimização bayesiana de vários parâmetros",
    "Detecção com localização da falha na torre",
    "Execução embarcada, a bordo do drone",
  ], { x: M + 4.9, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 8, color: C.white });

  footer(s, "Conclusões");
  fala(s, `
O trabalho tem limitações que precisam ser ditas. A principal é de dados: existem poucos conjuntos públicos de isoladores com defeitos anotados, e os que existem são desbalanceados. Os conjuntos de teste são pequenos, e no DRNPW cada imagem vale 3,3 pontos percentuais, o que limita a força das comparações entre técnicas próximas. E o custo computacional restringiu a otimização a um único parâmetro.
Essas limitações apontam os próximos passos. Ampliar a base com imagens de campo das próprias concessionárias, que já produzem esse material em cada campanha. Gerar exemplos sintéticos de defeitos com redes generativas. Otimizar vários parâmetros ao mesmo tempo com otimização bayesiana. Evoluir da classificação para a detecção, apontando onde está a falha na torre. E executar o modelo embarcado no próprio drone, para que o alerta saia ainda em campo.`);
}

// ===========================================================================
// 27 - Impacto para a engenharia elétrica
// ===========================================================================
{
  const s = darkSlide();
  s.addImage({ data: asset("encerramento.jpg"), x: 0, y: 0, w: W, h: H });
  title(s, "Impacto", "O impacto para a engenharia elétrica", { dark: true });

  const impactos = [
    ["Continuidade do fornecimento", "Falha encontrada na imagem antes do desligamento: menos DEC, FEC, compensações e Parcela Variável"],
    ["Manutenção de linhas", "Inspeção mais barata, rápida e segura, com drone e IA no lugar da escalada e do helicóptero"],
    ["Prática de engenharia", "Um método reprodutível para configurar a IA de inspeção a cada nova linha, drone ou modelo"],
  ];
  impactos.forEach((it, i) => {
    const y = 1.4 + i * 0.95;
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.07, h: 0.78, fill: { color: C.amber }, line: { type: "none" } });
    s.addText(it[0], {
      x: M + 0.25, y: y - 0.02, w: 6.2, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 15, bold: true, color: C.amber,
    });
    s.addText(it[1], {
      x: M + 0.25, y: y + 0.3, w: 6.2, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 12, color: C.white,
    });
  });

  s.addText("Tratar bem a imagem é tão importante quanto escolher a rede neural.", {
    x: M, y: 4.35, w: 7.5, h: 0.5, margin: 0,
    fontFace: F.head, fontSize: 17, bold: true, italic: true, color: C.white,
  });

  footer(s, "Conclusões", true);
  fala(s, `
Encerro voltando ao ponto de partida, o sistema elétrico. O impacto deste trabalho aparece em três frentes.
Na continuidade do fornecimento. Um isolador defeituoso encontrado na imagem, antes de provocar a falta, é uma troca programada em vez de um desligamento, com reflexo direto no DEC, no FEC, nas compensações pagas ao consumidor e na receita da transmissora.
Na manutenção de linhas. A combinação de drone e inteligência artificial torna a inspeção mais barata, mais rápida e mais segura, e este trabalho mostra como extrair mais desempenho dessa IA sem investir em hardware.
E na prática de engenharia. Em vez de escolher o tratamento da imagem por hábito, a concessionária passa a ter um método reprodutível para configurar o seu sistema de inspeção a cada nova linha, novo drone ou novo modelo.
A mensagem final é simples: na inspeção de isoladores, tratar bem a imagem é tão importante quanto escolher a rede neural.`);
}

// ===========================================================================
// 28 - Encerramento
// ===========================================================================
{
  const s = darkSlide();
  s.addImage({ data: asset("capa.jpg"), x: 0, y: 0, w: W, h: H });

  s.addText("Obrigado pela atenção", {
    x: M, y: 1.75, w: 6, h: 0.72, margin: 0,
    fontFace: F.head, fontSize: 34, bold: true, color: C.white,
  });
  s.addText("Fico à disposição da banca para as arguições.", {
    x: M, y: 2.5, w: 6, h: 0.36, margin: 0,
    fontFace: F.body, fontSize: 14, color: C.mutedLight,
  });
  s.addText([
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, fontSize: 13, breakLine: true } },
    { text: "luan.w.silveira@gmail.com", options: { color: C.amber, fontSize: 12, breakLine: true } },
    { text: "PPGEE, Universidade Federal de Santa Maria", options: { color: C.mutedLight, fontSize: 11 } },
  ], { x: M, y: 3.3, w: 6, h: 1.0, margin: 0, fontFace: F.body, lineSpacingMultiple: 1.2 });

  footer(s, "Encerramento", true);
  fala(s, `
Muito obrigado pela atenção. Fico à disposição da banca para as perguntas.`);
}

// ===========================================================================
// APÊNDICE - slides de apoio para a arguição
// ===========================================================================

// A1 - Objetivos específicos
{
  const s = lightSlide();
  title(s, "Apêndice", "Objetivos específicos");

  const objs = [
    ["Métricas", "Estabelecer critérios objetivos para avaliar a eficácia dos processamentos"],
    ["Tipo de modelo", "Determinar a rede adequada para medir o desempenho das técnicas"],
    ["Construção do modelo", "Construir redes para avaliação, sem buscar um modelo definitivo"],
    ["Efeito da arquitetura", "Analisar o impacto da escolha do modelo sobre o processamento"],
    ["Efeito do dataset", "Avaliar a influência do conjunto de dados sobre a eficácia das técnicas"],
    ["Combinação", "Aprimorar os processamentos combinando abordagens unitárias"],
    ["Ajuste automático", "Otimizar parâmetros sem intervenção manual extensa"],
  ];
  objs.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 1.32 + row * 0.9;
    const w = i === 6 ? 8.85 : 4.35;
    card(s, x, y, w, 0.8, { flat: true });
    bubble(s, x + 0.2, y + 0.18, 0.44, String(i + 1), { fill: i === 6 ? C.amber : C.night, size: 11, color: i === 6 ? C.night : C.white });
    s.addText(o[0], {
      x: x + 0.76, y: y + 0.08, w: w - 0.95, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.teal,
    });
    s.addText(o[1], {
      x: x + 0.76, y: y + 0.36, w: w - 0.92, h: 0.38, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink,
    });
  });

  footer(s, "Apêndice");
  fala(s, `
Os objetivos específicos desdobram o objetivo geral em sete frentes: definir as métricas, determinar o tipo de rede, construir os modelos de avaliação, analisar o efeito da arquitetura, analisar o efeito do conjunto de dados, desenvolver a combinação de técnicas e criar o ajuste automático de parâmetros. Os modelos são instrumento de medida do pré-processamento, e não o produto final do trabalho.`);
}

// A2 - Etapas 1 a 3
{
  const s = lightSlide();
  title(s, "Apêndice · Metodologia", "Etapas 1 a 3: dados, tratamento e ajuste");

  figLabel(s, 0.75, 1.28, 1.75, "1 · Seleção e validação");
  figFluxo(s, "e1", 0.86, 1.58, { h: 3.0 });
  figLabel(s, 2.95, 1.28, 3.0, "2 · Pré-processamento");
  figFluxo(s, "e2", 3.05, 1.58, { h: 3.0 });
  figLabel(s, 6.45, 1.28, 3.2, "3 · Ajuste de parâmetros");
  figFluxo(s, "e3", 6.72, 2.25, { h: 1.8 });

  footer(s, "Apêndice");
  fala(s, `
Na etapa 1, as métricas são definidas antes da seleção dos dados: acurácia, F1-score e tempo. Em seguida verifica-se o balanceamento e, se necessário, aplicam-se filtros.
Na etapa 2 está a decisão de combinar ou não as técnicas. Pelo ramo Não avaliam-se técnicas isoladas e, pelo ramo Sim, gera-se um pipeline em sequência. Os dois ramos foram percorridos, e deles saem as 14 variantes.
A etapa 3 substitui o ajuste manual por busca automática. A metodologia prevê busca em grade, aleatória, bayesiana e métodos populacionais, e as duas primeiras foram implementadas sobre o fator de contraste.`);
}

// A3 - Etapas 4 a 6
{
  const s = lightSlide();
  title(s, "Apêndice · Metodologia", "Etapas 4 a 6: modelo, treinamento e avaliação");

  figLabel(s, 0.5, 1.24, 4.3, "4 · Escolha e construção do modelo", { align: "left" });
  figFluxo(s, "e4", 0.6, 1.54, { w: 4.2 });
  figLabel(s, 0.5, 3.72, 4.3, "5 · Treinamento", { align: "left" });
  figFluxo(s, "e5", 0.6, 4.02, { w: 4.2 });
  figLabel(s, 5.2, 1.24, 2.8, "6 · Avaliação e ajustes", { align: "left" });
  figFluxo(s, "e6", 5.3, 1.54, { h: 3.3 });

  footer(s, "Apêndice");
  fala(s, `
Na etapa 4 escolhe-se a arquitetura e o tipo de tarefa. O ramo percorrido foi o da classificação, porque os dois conjuntos possuem exatamente uma anotação por imagem.
A etapa 5 é o treinamento, com monitoramento da função de custo e das métricas de validação.
A etapa 6 fecha o ciclo. Pelo ramo Sim, comparam-se modelos e técnicas. Pelo ramo Não, ajustam-se o processamento e o modelo, e o fluxo volta às etapas 2 e 4.`);
}

// A4 e A5 - Varreduras do YOLOv8n-cls
{
  const s = lightSlide();
  title(s, "Apêndice · YOLOv8n-cls", "Varredura completa no CPLID");
  slideFigura(s, figura("YOLOCLS", "CPLID"),
    "Acurácia do YOLOv8n-cls por tratamento, em ordem crescente (CPLID)",
    [
      ["81,40%", "MELHOR", "Tons de cinza, que na rede simples ficava com 76,74%.", "teal"],
      ["51,16%", "PIOR", "CLAHE + realce, que empatava no topo da rede simples.", "dark"],
      ["1 de 14", "ACIMA DO PISO", "Média de 66,28%, abaixo do piso de 74,42%.", "teal"],
    ]);
  footer(s, "Apêndice");
  fala(s, `
Esta é a varredura completa do YOLOv8n-cls no CPLID. Quase todas as barras ficam abaixo do piso majoritário de 74,42 por cento, e apenas uma técnica o supera. Os tons de cinza lideram com 81,40 por cento, e a combinação de CLAHE com realce, que empatava no topo da rede simples, é a pior, com 51,16 por cento.`);
}
{
  const s = lightSlide();
  title(s, "Apêndice · YOLOv8n-cls", "Varredura completa no DRNPW");
  slideFigura(s, figura("YOLOCLS", "DRNPW"),
    "Acurácia do YOLOv8n-cls por tratamento, em ordem crescente (DRNPW)",
    [
      ["83,33%", "MELHOR", "Limiarização adaptativa, que na rede simples ficava no piso.", "amber"],
      ["53,33%", "PIOR", "Realce + equalização, a melhor técnica da rede simples.", "dark"],
      ["5 de 14", "ACIMA DO PISO", "Média de 71,43%, abaixo do piso de 73,33%.", "amber"],
    ]);
  footer(s, "Apêndice");
  fala(s, `
No DRNPW o padrão se repete. O melhor resultado, 83,33 por cento, veio da limiarização adaptativa, que na rede simples ficava exatamente no piso. E a combinação de realce com equalização, a melhor da rede simples, cai para 53,33 por cento. Como cada imagem de teste vale 3,33 pontos, o que sustenta a leitura é a inversão das extremidades, e não a diferença entre técnicas vizinhas.`);
}

// A6 - Busca aleatória
{
  const s = lightSlide();
  title(s, "Apêndice · Otimização", "Busca aleatória sobre o fator de contraste");

  const rows = [
    ["1", "1,4364", "85,06%", true],
    ["2", "2,8768", "79,31%", false],
    ["3", "2,3300", "71,26%", false],
    ["4", "1,9966", "80,46%", false],
    ["5", "0,8900", "78,16%", false],
  ];
  const x0 = M, y0 = 1.4;
  [["Tentativa", 0.12, 1.0], ["Fator", 1.35, 1.1], ["Acurácia (validação)", 2.75, 2.0]].forEach(h => {
    s.addText(h[0], { x: x0 + h[1], y: y0, w: h[2], h: 0.28, margin: 0, fontFace: F.body, fontSize: 10.5, bold: true, color: C.muted });
  });
  rows.forEach((r, i) => {
    const y = y0 + 0.34 + i * 0.52;
    s.addShape(pres.ShapeType.roundRect, {
      x: x0, y, w: 5.0, h: 0.44, rectRadius: 0.05,
      fill: { color: r[3] ? C.teal : (i % 2 === 0 ? C.surface : C.white) },
      line: { color: r[3] ? C.teal : C.surfaceAlt, width: 0.75 },
    });
    const col = r[3] ? C.white : C.ink;
    s.addText(r[0], { x: x0 + 0.12, y: y + 0.07, w: 1.0, h: 0.3, margin: 0, fontFace: F.body, fontSize: 12, color: col });
    s.addText(r[1], { x: x0 + 1.35, y: y + 0.07, w: 1.1, h: 0.3, margin: 0, fontFace: F.body, fontSize: 12, bold: r[3], color: col });
    s.addText(r[2], { x: x0 + 2.75, y: y + 0.07, w: 2.0, h: 0.3, margin: 0, fontFace: F.body, fontSize: 12, bold: r[3], color: col });
  });

  card(s, 6.0, 1.4, 3.45, 3.0, { fill: C.night, line: C.night });
  s.addText("Leitura", {
    x: 6.22, y: 1.55, w: 3.0, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 12, bold: true, color: C.amber,
  });
  bullets(s, [
    "Grade e aleatória apontam para realce moderado: 1,333 e 1,4364",
    "Conjuntos diferentes: teste com 30 imagens e validação com 87",
    "Contraste alto degrada: 71,26% no fator 2,33",
  ], { x: 6.22, y: 1.9, w: 3.05, h: 2.4, size: 11, color: C.white, gap: 8 });

  footer(s, "Apêndice");
  fala(s, `
A busca aleatória testou cinco valores entre 0,5 e 3,0. O melhor foi 1,4364, com 85,06 por cento de acurácia na validação, próximo do 1,333 da busca em grade. Não afirmo convergência em sentido forte, porque a grade foi avaliada no teste de 30 imagens e a busca aleatória na validação de 87. O que se confirma nas duas é que contraste muito alto degrada o resultado.`);
}

// A7 - Fontes dos dados de mercado
{
  const s = lightSlide();
  title(s, "Apêndice", "Fontes dos dados do setor elétrico e de mercado");

  const fontes = [
    ["ANEEL (2026)", "Resultados do desempenho das distribuidoras na continuidade do fornecimento de energia elétrica em 2025. DEC de 9,30 h, FEC de 4,66 e R$ 1,002 bilhão em compensações."],
    ["ONS (2025)", "PAR/PEL 2025, sumário executivo. 5.301 km de novas linhas (3% da rede existente) e R$ 28,1 bilhões em obras até 2030."],
    ["DronePower (2025)", "Energy Summit 2025. Custo por torre de R$ 750 para R$ 300 e produtividade de 5 para 25 torres por dia."],
    ["UAV Imaging", "Drone vs helicopter inspection: cost, safety, range compared. US$ 120 a 200 por km com helicóptero e US$ 40 a 80 com drone."],
    ["Estimativa própria", "177 mil km × 2 torres por km × R$ 450 por torre. Ordem de grandeza, com vão médio de 500 m como premissa."],
  ];
  fontes.forEach((f, i) => {
    const y = 1.3 + i * 0.74;
    s.addText(f[0], {
      x: M, y, w: 2.0, h: 0.62, margin: 0, valign: "top",
      fontFace: F.body, fontSize: 11.5, bold: true, color: C.teal,
    });
    s.addText(f[1], {
      x: M + 2.1, y, w: 6.8, h: 0.62, margin: 0, valign: "top",
      fontFace: F.body, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Apêndice");
  fala(s, `
Estas são as fontes dos números do setor elétrico e de mercado usados na apresentação. Os indicadores de continuidade e as compensações são da ANEEL. A extensão da rede e os investimentos são do planejamento do ONS. Os custos e a produtividade da inspeção por drone são dados divulgados por empresas do setor, e a economia por ciclo de inspeção é uma estimativa de ordem de grandeza feita a partir dessas bases.`);
}

// ---------------------------------------------------------------------------
pres.writeFile({ fileName: process.argv[2] || "defesa.pptx" })
  .then(f => console.log("Gerado:", f));
