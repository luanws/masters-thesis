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

// Rodapé com seção, nota (opcional) e número do slide
function footer(s, label, dark = false, nota = "", x = M) {
  slideNo += 1;
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
Meu nome é Luan Willig Silveira e apresento a minha dissertação de mestrado, desenvolvida no Programa de Pós-Graduação em Engenharia Elétrica da Universidade Federal de Santa Maria, sob orientação do professor Daniel Pinheiro Bernardon e coorientação do professor Paulo César Vargas Luz.
O título do trabalho é Método de aprimoramento de processamentos de imagens aplicados à detecção e classificação de falhas em cadeias de isoladores. O tema une a manutenção das linhas do sistema elétrico ao uso de imagens e de redes neurais para inspecioná-las.
Agradeço a presença da banca e passo à apresentação.`);
}

// ===========================================================================
// 2 - Roteiro
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Roteiro", "Do sistema elétrico de volta ao sistema elétrico");

  const itens = [
    ["1", "O problema elétrico", "Isoladores, falhas e inspeção", "defeito_corrosao.jpg"],
    ["2", "A proposta", "Metodologia de processamento", "proc_contraste_q.jpg"],
    ["3", "Resultados", "Dois cenários, dois modelos", "cplid_quadrado.jpg"],
    ["4", "Impacto", "Vantagens para o sistema elétrico", "aerea_recorte.jpg"],
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
A apresentação está dividida em quatro partes.
Começo pelo problema elétrico: o papel dos isoladores no sistema elétrico de potência, as falhas que eles apresentam e a forma como são inspecionados.
Em seguida, apresento a proposta, que é a metodologia para comparar, selecionar, combinar e ajustar o processamento das imagens.
Depois, os resultados obtidos com dois conjuntos de dados e dois modelos de rede neural.
E termino voltando ao sistema elétrico, com as vantagens e o impacto do trabalho.`);
}

// ===========================================================================
// 3 - O isolador no SEP
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "O isolador no Sistema Elétrico de Potência");

  s.addImage({ data: asset("sep.png"), x: M, y: 1.2, w: 8.9, h: 8.9 * 560 / 2000 });

  const itens = [
    ["Transmissão e distribuição", "Linhas que levam a energia até os consumidores"],
    ["Isoladores, fixadores e suportes", "Componentes inspecionados ao longo das linhas"],
    ["Falha não tratada", "Pode causar interrupções no fornecimento de energia"],
  ];
  itens.forEach((it, i) => {
    const x = M + i * 3.05;
    s.addShape(pres.ShapeType.rect, { x, y: 3.95, w: 0.06, h: 0.85, fill: { color: i === 2 ? C.amber : C.teal }, line: { type: "none" } });
    s.addText(it[0], {
      x: x + 0.2, y: 3.93, w: 2.7, h: 0.34, margin: 0,
      fontFace: F.body, fontSize: 13.5, bold: true, color: i === 2 ? C.amber : C.teal,
    });
    s.addText(it[1], {
      x: x + 0.2, y: 4.3, w: 2.6, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.ink,
    });
  });

  footer(s, "Contexto elétrico");
  fala(s, `
Começo pelo Sistema Elétrico de Potência. A energia gerada percorre as linhas de transmissão, passa pelas subestações e chega aos consumidores pelas redes de distribuição.
Ao longo dessas linhas, componentes como isoladores, fixadores e suportes garantem a sustentação e o isolamento dos condutores. Quando esses componentes apresentam problemas que não são tratados, a consequência pode ser a interrupção do fornecimento de energia. Por isso, a inspeção desses ativos é uma atividade central para a confiabilidade do sistema. E o processamento de imagens se tornou uma ferramenta essencial para essa confiabilidade, porque permite identificar problemas nesses componentes a partir de imagens das linhas.
Entre esses componentes, o foco deste trabalho é o que aparece destacado no círculo da figura: a cadeia de isoladores, presente nas estruturas das linhas de alta tensão. É sobre a detecção e a classificação de falhas nessas cadeias que a dissertação trata.`);
}

// ===========================================================================
// 4 - O isolador
// ===========================================================================
{
  const s = lightSlide();
  foto(s, "cadeia_torre.jpg", 0, 0, H, H);
  title(s, "Contexto elétrico", "Isolador: sustentação e isolamento", { x: 6.0, w: 3.5, h: 1.0, size: 24 });

  const itens = [
    ["Sustenta", "mecanicamente os condutores"],
    ["Isola", "as partes energizadas das estruturas aterradas"],
    ["Fica exposto", "a temperatura, umidade, poluição e descargas atmosféricas"],
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
Os isoladores cumprem duas funções ao mesmo tempo.
A primeira é mecânica: sustentar os condutores.
A segunda é elétrica: garantir o isolamento entre as partes energizadas e as estruturas aterradas.
Nas linhas de alta tensão, eles são normalmente agrupados em cadeias, como a que aparece na foto.
O problema é que essas cadeias ficam expostas de forma contínua a condições ambientais severas, como variações de temperatura, umidade, poluição e descargas atmosféricas. Ao longo do tempo, essa exposição favorece o surgimento de falhas que comprometem a capacidade de isolamento e, com ela, a confiabilidade do sistema elétrico. O desempenho da linha depende, portanto, do estado de cada cadeia de isoladores instalada ao longo dela.`);
}

// ===========================================================================
// 5 - Falhas
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "Falhas que deixam marca na imagem");

  const falhas = [
    ["defeito_corrosao.jpg", "Corrosão", "Identificável em imagens de inspeção"],
    ["defeito_oxidacao.jpg", "Contaminação superficial", "Relacionada aos flashovers por poluição"],
    ["cplid_quadrado.jpg", "Disco ausente e fraturas", "Comprometem a rigidez dielétrica da cadeia"],
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

  footer(s, "Contexto elétrico", false, "Fotos ilustrativas de cadeias de isoladores");
  fala(s, `
As falhas aparecem de diferentes formas. A literatura cita trincas, contaminação superficial, perfurações e rupturas, além de corrosões nas estruturas, que também podem ser identificadas por imagem.
Um caso importante está ligado à poluição. Entre os defeitos citados na literatura estão os flashovers por poluição, isto é, a descarga elétrica que ocorre sobre a superfície isolante quando a rigidez dielétrica é rompida.
Outro caso é o defeito estrutural das cadeias de discos cerâmicos, à direita, em que o disco está ausente ou fraturado. Essas condições comprometem a rigidez dielétrica da cadeia e podem evoluir para falhas de isolamento na linha.
O ponto em comum é que todas essas falhas deixam uma assinatura visual. É isso que torna possível usar imagens para encontrá-las.`);
}

// ===========================================================================
// 6 - Detectar cedo
// ===========================================================================
{
  const s = darkSlide();
  foto(s, "defeito_oxidacao.jpg", 6.35, 1.3, 3.1, 3.1);
  title(s, "Contexto elétrico", "Detectar cedo protege o sistema elétrico", { dark: true, w: 5.6, h: 1.0, size: 26 });

  const ganhos = [
    ["Continuidade", "Evita interrupções no fornecimento de energia"],
    ["Custo", "Reduz os custos de manutenção"],
    ["Segurança", "Previne riscos às instalações e às pessoas"],
  ];
  ganhos.forEach((g, i) => {
    const y = 1.7 + i * 0.9;
    card(s, M, y, 5.55, 0.76, { fill: C.nightSoft, line: C.nightSoft, flat: true });
    bubble(s, M + 0.18, y + 0.16, 0.44, String(i + 1), { fill: C.amber, color: C.night });
    s.addText([
      { text: g[0], options: { bold: true, color: C.amber, breakLine: true } },
      { text: g[1], options: { color: C.white } },
    ], { x: M + 0.8, y: y + 0.06, w: 4.6, h: 0.64, margin: 0, fontFace: F.body, fontSize: 12.5, valign: "middle" });
  });

  s.addText("Falhas não detectadas podem ter consequências graves.", {
    x: M, y: 4.5, w: 5.6, h: 0.4, margin: 0,
    fontFace: F.head, fontSize: 14, bold: true, italic: true, color: C.white,
  });

  footer(s, "Contexto elétrico", true);
  fala(s, `
Por isso, a identificação precoce dessas falhas é essencial, e ela traz três ganhos diretos para o sistema elétrico.
O primeiro é a continuidade: encontrar a falha a tempo evita interrupções no fornecimento de energia.
O segundo é econômico: a detecção precoce reduz os custos de manutenção.
O terceiro é a segurança: previne riscos às instalações e às pessoas.
Há também o outro lado dessa questão. Uma falha que não é detectada, o chamado falso negativo, pode ter consequências graves e, no limite, levar a falhas no sistema de transmissão. Por isso, ao longo do trabalho, a capacidade de encontrar a falha, e não apenas a taxa geral de acertos, recebe atenção especial na leitura dos resultados.`);
}

// ===========================================================================
// 7 - Da inspeção manual à automatizada
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "Da inspeção manual à inspeção automatizada");

  s.addImage({ data: asset("drone.png"), x: M, y: 1.45, w: 4.3, h: 4.3 * 760 / 1400 });
  legenda(s, "Imagens capturadas por drones facilitam a inspeção de grandes extensões de linhas.", M, 3.95, 4.2, { h: 0.45 });

  card(s, 5.15, 1.3, 4.3, 1.62, { fill: C.surface, flat: true });
  s.addText("Inspeção visual e manual", {
    x: 5.38, y: 1.4, w: 3.9, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.muted,
  });
  bullets(s, [
    "Lenta e custosa",
    "Sujeita à subjetividade e a erros humanos",
    "Feita por equipes especializadas",
  ], { x: 5.4, y: 1.76, w: 3.9, h: 1.1, size: 11.5, gap: 3 });

  card(s, 5.15, 3.1, 4.3, 1.8, { fill: C.night, line: C.night });
  s.addText("Inspeção por imagem com IA", {
    x: 5.38, y: 3.2, w: 3.9, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.amber,
  });
  bullets(s, [
    "Mais rápida, econômica e reprodutível",
    "Evita intervenções manuais em locais de difícil acesso",
    "Reconhece padrões de falha em condições adversas",
  ], { x: 5.4, y: 3.56, w: 3.9, h: 1.3, size: 11.5, gap: 3, color: C.white });

  footer(s, "Contexto elétrico");
  fala(s, `
Tradicionalmente, a inspeção de cadeias de isoladores é feita de forma visual e manual, por equipes especializadas. Isso torna a inspeção lenta, custosa e sujeita à subjetividade e a erros humanos.
Uma alternativa promissora é a inspeção por imagem. O uso de imagens capturadas por drones facilita a inspeção de grandes extensões de linhas de transmissão, reduz custos e aumenta a segurança, porque evita intervenções manuais em locais de difícil acesso.
Associadas a modelos de aprendizado de máquina, essas imagens permitem automatizar a detecção e a classificação das falhas, o que torna a inspeção mais rápida, econômica e reprodutível. E os métodos de aprendizado profundo conseguem reconhecer padrões que indicam falhas mesmo em condições adversas, como baixa visibilidade ou equipamentos desgastados.
É essa combinação de drone e inteligência artificial que forma o contexto de aplicação desta dissertação.`);
}

// ===========================================================================
// 8 - Desafios da inspeção por imagem
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto elétrico", "O desafio: muitas imagens e fundos complexos");

  s.addImage({ data: asset("mosaico.jpg"), x: M, y: 1.3, w: 5.45, h: 5.45 * 984 / 1960 });
  legenda(s, "Imagens ilustrativas de inspeção de cadeias de isoladores", M, 4.1, 5.45);

  const desafios = [
    ["Alto volume de dados", "Torna a inspeção manual ineficaz"],
    ["Fundos complexos", "Vegetação, rios e ocupação urbana ao redor do isolador"],
    ["Anotação manual", "Demorada e propensa a erros"],
  ];
  desafios.forEach((d, i) => {
    const y = 1.3 + i * 0.95;
    card(s, 6.3, y, 3.15, 0.82, i === 1 ? { fill: C.night, line: C.night } : { flat: true });
    s.addText([
      { text: d[0], options: { bold: true, color: i === 1 ? C.amber : C.teal, breakLine: true } },
      { text: d[1], options: { color: i === 1 ? C.white : C.ink, fontSize: 10.5 } },
    ], { x: 6.48, y: y + 0.05, w: 2.85, h: 0.72, margin: 0, fontFace: F.body, fontSize: 12.5, valign: "middle" });
  });

  footer(s, "Contexto elétrico");
  fala(s, `
A inspeção por imagem, porém, traz os seus próprios desafios.
O primeiro é o volume. Uma inspeção produz um grande número de imagens, e a literatura aponta que a inspeção manual se torna ineficaz justamente pelo alto volume de dados.
O segundo é o fundo das imagens. O isolador aparece sobre vegetação, rios, ocupação urbana e outras estruturas, e essa complexidade dificulta distinguir o componente elétrico do ambiente ao seu redor.
O terceiro é a anotação. Rotular manualmente as imagens capturadas por drones é demorado e propenso a erros, o que limita o tamanho dos conjuntos de dados disponíveis.
A inteligência artificial responde ao primeiro desafio, porque permite analisar grandes volumes de dados e identificar padrões complexos. Mas os outros dois mostram que a qualidade da imagem que chega ao modelo continua sendo decisiva.`);
}

// ===========================================================================
// 9 - A IA depende da imagem
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Proposta", "A IA depende da imagem que recebe");

  const etapas = [
    ["Aquisição", "Imagem da cadeia", { img: "campo.jpg" }],
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
  s.addText("Não basta investir em arquiteturas complexas se a imagem oculta o defeito.", {
    x: M + 0.3, y: 4.2, w: 8.3, h: 0.68, margin: 0, valign: "middle", align: "center",
    fontFace: F.head, fontSize: 15, bold: true, color: C.white,
  });

  footer(s, "Proposta");
  fala(s, `
Um sistema de inspeção automática segue esta sequência. A imagem é adquirida, recebe um pré-processamento, é analisada pelo modelo de rede neural, e o resultado é um diagnóstico: com falha ou sem falha.
A eficácia desse sistema depende, em grande medida, das técnicas de processamento de imagem empregadas e da forma como elas são combinadas e ajustadas. Diferentes técnicas, parâmetros e arquiteturas podem produzir resultados bastante distintos para o mesmo problema.
Não basta investir apenas em arquiteturas complexas de rede neural se as imagens de entrada apresentarem ruídos e limitações de contraste que ocultam os defeitos.
Por isso, este trabalho coloca o pré-processamento no centro, como a variável independente do estudo. A pergunta passa a ser: qual tratamento aplicar à imagem para que o modelo identifique melhor a falha no isolador?`);
}

// ===========================================================================
// 10 - Literatura
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Estado da arte", "A literatura não chega a um consenso");

  const grupos = [
    ["=", "Sem impacto significativo", "Liu et al. (2021)\nWang et al. (2023)", C.muted],
    ["▲", "Melhorou o desempenho", "Zhang et al. (2022)\nSalvi et al. (2021)", C.teal],
    ["▼", "Riscos e efeito negativo", "Öztürk e Akdemir (2018)\nRodrigues et al. (2020)", C.amber],
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
  s.addText("Nenhum estudo propõe um método para determinar os processamentos mais eficientes.", {
    x: M + 0.3, y: 4.3, w: 8.3, h: 0.62, margin: 0, valign: "middle", align: "center",
    fontFace: F.head, fontSize: 14, bold: true, color: C.white,
  });

  footer(s, "Proposta");
  fala(s, `
Quando se busca na literatura como tratar essas imagens, o que se encontra é falta de consenso.
Liu e Wang, que detectam falhas em isoladores em imagens aéreas de linhas de transmissão, utilizaram apenas redimensionamento e normalização, e não registram impacto significativo do pré-processamento.
Zhang, que combina aprendizado profundo com processamento morfológico para segmentar os isoladores, relata melhora no desempenho. Salvi, em uma revisão na área de patologia digital, conclui que essas técnicas melhoram a precisão e reduzem o tempo computacional.
Já Öztürk e Akdemir mostram que o excesso de processamento pode degradar o desempenho, e Rodrigues observa que as imagens originais favoreceram a rede neural.
Os estudos vão, portanto, da melhora ao risco de sobre-processamento. E nenhum deles propõe um método para determinar quais processamentos são mais eficientes e para otimizar os seus parâmetros. Essa é a lacuna que a dissertação procura preencher.`);
}

// ===========================================================================
// 11 - Objetivo geral
// ===========================================================================
{
  const s = darkSlide();
  foto(s, "aerea_recorte.jpg", 6.35, 1.25, 3.1, 3.1);
  title(s, "Objetivo", "Objetivo geral", { dark: true, w: 5.5 });

  card(s, M, 1.45, 5.5, 2.1, { fill: C.nightSoft, line: C.tealDark, flat: true });
  s.addText("Desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem para a detecção e classificação de falhas em cadeias de isoladores.", {
    x: M + 0.28, y: 1.55, w: 4.95, h: 1.9, margin: 0, valign: "middle",
    fontFace: F.head, fontSize: 16, bold: true, color: C.white, lineSpacingMultiple: 1.08,
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
A partir dessa lacuna, o objetivo geral do trabalho é desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem para a detecção e a classificação de falhas em cadeias de isoladores.
Os quatro verbos organizam toda a proposta.
Comparar as técnicas entre si, sob as mesmas condições.
Selecionar as mais adequadas a cada caso.
Combinar técnicas em sequência, formando pipelines.
E aprimorar os seus parâmetros de forma automática, sem a necessidade de intervenção manual extensa.
Esse objetivo responde diretamente à lacuna identificada. Em vez de relatar apenas o que funcionou em um experimento, a proposta é oferecer um método para determinar os processamentos mais eficientes e otimizar os seus parâmetros.
Com isso, a escolha do tratamento das imagens passa a seguir um procedimento sistemático.`);
}

// ===========================================================================
// 12 - Objetivos específicos
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Objetivo", "Objetivos específicos");

  const objs = [
    ["Métricas", "Estabelecer métricas para avaliar a eficácia dos processamentos"],
    ["Tipo de modelo", "Determinar o tipo de rede neural para avaliar os processamentos"],
    ["Construção do modelo", "Construir redes de avaliação, sem buscar um modelo definitivo"],
    ["Efeito do modelo", "Analisar o impacto da escolha do modelo no processamento"],
    ["Efeito do dataset", "Avaliar a influência do conjunto de dados na eficácia"],
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

  footer(s, "Proposta");
  fala(s, `
Para alcançar esse objetivo, foram definidos sete objetivos específicos.
O primeiro é estabelecer métricas para avaliar a eficácia dos processamentos de imagem.
O segundo e o terceiro são determinar o tipo de rede neural adequado e construir os modelos de avaliação, sem o intuito de encontrar um modelo definitivo.
O quarto e o quinto são analisar o impacto da escolha do modelo e a influência do conjunto de dados sobre os resultados.
O sexto é aprimorar os processamentos pela combinação de abordagens unitárias.
E o sétimo é criar um método de ajuste automático dos parâmetros.
Destaco o sentido do terceiro objetivo: os modelos treinados servem para avaliar o impacto dos diferentes processamentos, e não são o produto final do trabalho.`);
}

// ===========================================================================
// 13 - Metodologia geral
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "Estruturada, iterativa e modular");

  figFluxo(s, "geral", 0.5, 1.18, 3.8);

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
    { text: "A avaliação retroalimenta o pré-processamento e a escolha do modelo.", options: { color: C.white, fontSize: 13.5 } },
  ], { x: 2.75, y: 3.85, w: 6.6, h: 1.0, margin: 0, valign: "middle", fontFace: F.body });

  footer(s, "Proposta");
  fala(s, `
A metodologia é estruturada, iterativa e modular.
O fluxo parte do início e percorre seis etapas: a seleção e a validação do conjunto de dados, o pré-processamento, o ajuste de parâmetros, a escolha e a construção do modelo, o treinamento e, por fim, a avaliação e os ajustes, encerrando em conclusões e recomendações.
O caráter iterativo vem do ciclo de avaliação. Quando o desempenho não é satisfatório, a avaliação retroalimenta o pré-processamento e a escolha do modelo, o que permite refinar as técnicas e os parâmetros a cada iteração.
O caráter modular vem da divisão em blocos, que permite identificar e corrigir problemas em cada etapa de forma isolada, sem comprometer o restante do processo. É essa modularidade que permite, mais adiante, trocar apenas o bloco do modelo e repetir o experimento com uma segunda arquitetura.`);
}

// ===========================================================================
// 14 - Fluxograma detalhado
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "Quatro decisões conduzem o fluxo");

  figFluxo(s, "completo", 0.55, 1.15, 3.82);

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
  s.addText("Neste trabalho: técnicas isoladas e combinadas, classificação e ajuste automático de parâmetros.", {
    x: 2.7, y: 4.3, w: 6.6, h: 0.62, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 11.5, italic: true, color: C.ink,
  });

  footer(s, "Proposta");
  fala(s, `
Cada etapa se desdobra em operações e decisões, mostradas no fluxograma detalhado. Destaco os quatro pontos de decisão.
O primeiro verifica se o conjunto de dados está balanceado. Isso é especialmente relevante na detecção de falhas, em que costuma haver muito mais amostras de isoladores saudáveis do que de defeituosos.
O segundo decide se as técnicas serão usadas isoladas ou combinadas em um pipeline.
O terceiro define o tipo de tarefa, entre classificação, detecção e regressão.
E o quarto verifica se o desempenho atende aos critérios definidos. Se não atende, o bloco de ajuste de processamentos e modelo devolve o fluxo às etapas anteriores.
Neste trabalho, foram percorridos os dois ramos do pré-processamento, o de técnicas isoladas e o de técnicas combinadas, com a tarefa de classificação e o ajuste automático de parâmetros.`);
}

// ===========================================================================
// 15 - Dois cenários
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Materiais", "Dois cenários de inspeção de isoladores");

  const cenarios = [
    ["cplid_faixa.jpg", "CPLID", C.teal, [
      "Linhas de transmissão, isoladores majoritariamente cerâmicos",
      "Defeito estrutural: disco ausente e fraturas",
      "678 imagens de treino e 43 de teste",
    ]],
    ["campo_faixa.jpg", "DRNPW", C.amber, [
      "Imagens de drones disponibilizadas pela CPFL",
      "Fundos heterogêneos com forte poluição visual",
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

  footer(s, "Materiais", false, "Foto à direita: ilustrativa do cenário de campo");
  fala(s, `
Para validar a metodologia, foram usados dois conjuntos de dados de inspeção de infraestrutura elétrica, que representam cenários bem diferentes.
O primeiro é o CPLID, o Chinese Power Line Insulator Dataset. Ele reúne imagens de cadeias de isoladores de linhas de transmissão aéreas, majoritariamente cerâmicos, capturadas por drones e com fundos homogêneos. O defeito de interesse é estrutural: a ausência de disco e as fraturas no corpo do isolador. São duas classes, com 678 imagens de treino e 43 de teste.
O segundo é o DRNPW, disponibilizado pela CPFL, com imagens capturadas por drones em condições operacionais reais. Aqui os isoladores aparecem sobre fundos heterogêneos, com vegetação e ocupação urbana, o que reproduz a dificuldade de campo em distinguir o componente elétrico do ambiente. São 585 imagens, divididas em 468 de treino, 87 de validação e 30 de teste.
Esse conjunto é fortemente desbalanceado: das 468 imagens de treino, 335 pertencem a uma única categoria.`);
}

// ===========================================================================
// 16 - Técnicas de pré-processamento
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Pré-processamento", "O que cada técnica faz com a imagem");

  const tiles = [
    ["proc_original.jpg", "Imagem original"],
    ["proc_contraste.jpg", "Realce de contraste"],
    ["proc_equalizacao.jpg", "Equalização de histograma"],
    ["proc_cinza.jpg", "Escala de cinza"],
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
    { text: "4", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "combinações híbridas", options: { fontSize: 10.5, color: C.white, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "1", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "controle sem processamento", options: { fontSize: 10.5, color: C.white } },
  ], { x: 7.6, y: 2.75, w: 1.7, h: 2.0, margin: 0, align: "center", fontFace: F.body });

  footer(s, "Materiais", false, "Ilustração do efeito das técnicas sobre uma mesma imagem");
  fala(s, `
Foram avaliadas 14 variantes de pré-processamento, aplicadas às imagens antes do treinamento. A figura ilustra o efeito de algumas delas sobre uma mesma imagem.
O realce de contraste amplia as diferenças de intensidade por meio de um fator multiplicador. A equalização de histograma redistribui as intensidades na faixa dinâmica disponível. A escala de cinza suprime a informação de cor. O desfoque gaussiano faz uma suavização passa-baixa. E a detecção de bordas isola os contornos da imagem.
Além dessas, foram avaliadas a binarização adaptativa, o CLAHE, que equaliza o histograma por regiões locais, a redução de ruído por médias não locais e o filtro de mediana.
Quatro variantes são híbridas, combinando o realce de contraste com o CLAHE ou com a equalização de histograma, em ordens diferentes.
E a imagem original entra como amostra de controle, a linha de base sem processamento.`);
}

// ===========================================================================
// 17 - Protocolo e piso majoritário
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Protocolo experimental", "Uma variável por vez e uma régua de leitura");

  const eq = [["14", "variantes"], ["2", "conjuntos de dados"], ["2", "modelos"], ["1", "variável: o pré-processamento"]];
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
      x: x + 0.1, y: 2.05, w: bw - 0.2, h: 0.42, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: fim ? C.white : C.muted,
    });
    if (!fim) {
      s.addText(i === 2 ? "→" : "×", {
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
  s.addText("Acurácia obtida ao responder sempre a classe mais frequente do teste, sem observar a imagem. Abaixo dele, o modelo não extrai informação útil.", {
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
O protocolo experimental isola uma única variável.
Foi implementada uma rede neural convolucional clássica e padronizada, com duas camadas convolucionais de 32 filtros, max-pooling, uma camada densa de 8 unidades e saída softmax. O treinamento usou o otimizador Adam por 50 épocas, com data augmentation em tempo de treino e imagens de 512 por 512 pixels. Com o modelo fixo, a única variável entre as execuções é o pré-processamento aplicado às imagens. Depois, a mesma varredura foi repetida com uma segunda arquitetura.
Para ler os resultados, é preciso um critério de referência, porque os dois conjuntos de teste são desbalanceados. Nesses casos, a acurácia sozinha pode ser enganosa, já que um modelo que sempre prevê a classe saudável alcança um valor alto sem detectar nenhuma falha. Esse critério é o piso majoritário: a acurácia obtida ao responder sempre a classe mais frequente, sem observar a imagem.
No CPLID, 32 das 43 imagens de teste são de isoladores normais, o que dá um piso de 74,42 por cento. No DRNPW, o piso é de 73,33 por cento. Um modelo abaixo desse valor não extrai informação útil das imagens.`);
}

// ===========================================================================
// 18 - Resultados CPLID
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · Linhas de transmissão com isoladores cerâmicos", "Realçar o contraste evidencia o defeito estrutural", { size: 25 });

  slideFigura(s, figura("CNN", "CPLID"),
    "Acurácia da CNN por técnica, em ordem crescente, com a imagem tratada acima de cada barra (CPLID)",
    [
      ["95,35%", "MELHOR", "Realce de contraste, com F1-score de 96,55%, o maior do conjunto.", "teal"],
      ["67,44%", "PIOR", "Desfoque gaussiano, abaixo da imagem original e do piso de 74,42%.", "dark"],
      ["93,02%", "ORIGINAL", "Imagem sem tratamento, superada pelo realce de contraste.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
Começo pelos resultados da rede convolucional no CPLID, o cenário das cadeias cerâmicas de linhas de transmissão com defeito estrutural. O gráfico mostra a acurácia de cada técnica, em ordem crescente, com a imagem tratada acima de cada barra.
No topo, três técnicas empataram em 95,35 por cento de acurácia, e todas ampliam o contraste: o realce de contraste simples, a combinação de CLAHE com realce e a combinação de realce com equalização de histograma. O realce simples teve ainda o maior F1-score do conjunto, 96,55 por cento, superando inclusive a imagem original sem tratamento, que alcançou 93,02 por cento de acurácia.
Esse resultado é coerente com a natureza do defeito. As assinaturas visuais do disco ausente e da fratura se concentram na estrutura física do isolador e são realçadas pela ampliação do intervalo tonal.
No outro extremo, as técnicas de suavização e desfoque reduziram consideravelmente o desempenho. O desfoque gaussiano ficou em apenas 67,44 por cento, abaixo da imagem original e abaixo do piso majoritário. Ou seja, um tratamento inadequado piorou o resultado em relação a não tratar a imagem.`);
}

// ===========================================================================
// 19 - Resultados DRNPW
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · Inspeção aérea em ambiente operacional real", "Combinar técnicas separa o isolador do fundo", { size: 25 });

  slideFigura(s, figura("CNN", "DRNPW"),
    "Acurácia da CNN por técnica, em ordem crescente, nas imagens de drones da CPFL (DRNPW)",
    [
      ["83,33%", "MELHOR", "Realce de contraste com equalização de histograma, F1-score de 75,76%.", "amber"],
      ["49,12%", "F1 ORIGINAL", "Imagem sem tratamento, com 63,33% de acurácia.", "dark"],
      ["3 imagens", "ACIMA DO PISO", "Vantagem do melhor resultado sobre o piso de 73,33%.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
No DRNPW, o cenário de inspeção aérea em ambiente operacional real, o comportamento muda.
Com fundos de forte poluição visual, os melhores resultados vieram das combinações que ampliam o contraste. A combinação de realce de contraste e equalização de histograma teve o melhor desempenho, com 83,33 por cento de acurácia e 75,76 por cento de F1-score, contra 63,33 por cento de acurácia e 49,12 por cento de F1-score dos modelos treinados apenas com as imagens originais.
A leitura é que, nesse cenário, a combinação reforça o contraste entre o componente e o fundo. Já as técnicas que suprimem a cor, como a escala de cinza, ou que suavizam as texturas, como os desfoques, ficaram entre os piores resultados, por descartarem informação relevante à identificação do defeito.
Faço aqui uma ressalva: esse melhor resultado supera o piso de 73,33 por cento em 10 pontos percentuais, o equivalente a três imagens de teste, e seis das 14 técnicas ficaram no piso ou abaixo dele. Por isso, a inspeção em ambiente com forte poluição visual permanece como o caso mais desafiador.`);
}

// ===========================================================================
// 20 - Simples contra híbridas
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados", "Combinar técnicas compensa com a CNN");

  s.addChart(pres.ChartType.bar, [
    { name: "Vantagem das híbridas", labels: ["CPLID", "DRNPW"], values: [13.49, 5.17] },
  ], {
    x: 0.3, y: 1.45, w: 5.4, h: 3.4,
    barDir: "col", barGapWidthPct: 70,
    chartColors: [C.teal, C.amber],
    valAxisMinVal: 0, valAxisMaxVal: 16,
    dataLabelFormatCode: '"+"0.00" pp"',
    ...chartBase,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 12, dataLabelFontSize: 12,
  });
  legenda(s, "Diferença média de acurácia entre técnicas híbridas e simples, CNN (pontos percentuais)", 0.3, 1.2, 5.4);

  s.addText("Combinação", {
    x: 6.0, y: 1.35, w: 3.45, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 11.5, bold: true, color: C.ink,
  });
  foto(s, "proc_contraste.jpg", 6.0, 1.7, 1.55, 1.16);
  s.addText("+", {
    x: 7.55, y: 2.03, w: 0.35, h: 0.5, margin: 0, align: "center", valign: "middle",
    fontFace: F.head, fontSize: 22, bold: true, color: C.mutedLight,
  });
  foto(s, "proc_equalizacao.jpg", 7.9, 1.7, 1.55, 1.16);

  card(s, 6.0, 3.15, 3.45, 1.7, { fill: C.night, line: C.night });
  s.addText("A ordem importa", {
    x: 6.22, y: 3.3, w: 3.0, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13, bold: true, color: C.amber,
  });
  s.addText("Sequências diferentes produzem resultados distintos.", {
    x: 6.22, y: 3.65, w: 3.0, h: 1.0, margin: 0,
    fontFace: F.body, fontSize: 13, color: C.white, lineSpacingMultiple: 1.08,
  });

  footer(s, "Resultados");
  fala(s, `
Agrupando as 14 técnicas em simples e híbridas, as combinações se destacam com a rede convolucional.
No CPLID, a média de acurácia das técnicas híbridas foi 13,49 pontos percentuais superior à das técnicas simples. No DRNPW, a vantagem foi de 5,17 pontos.
Isso confirma a decisão da metodologia de avaliar também pipelines de técnicas combinadas, em que a saída de uma técnica serve de entrada para a próxima. Um pipeline pode reunir, por exemplo, normalização, redução de ruído, ajuste de contraste e aumento de nitidez.
E há um detalhe importante: a ordem das operações importa, porque sequências diferentes produzem resultados distintos. Por isso, as combinações foram avaliadas nas duas ordens possíveis: CLAHE seguido de realce e realce seguido de CLAHE, e equalização seguida de realce e realce seguido de equalização.`);
}

// ===========================================================================
// 21 - Ajuste automático
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Otimização de parâmetros", "O ajuste do contraste passa a ser automático");

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
  legenda(s, "Busca em grade: acurácia no teste por fator de realce de contraste (DRNPW)", 0.3, 1.2, 5.4);

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
  s.addText("Os dois métodos apontam para valores um pouco acima de 1,0.", {
    x: 6.2, y: 3.85, w: 3.05, h: 1.0, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 12.5, bold: true, color: C.white,
  });

  footer(s, "Resultados");
  fala(s, `
A etapa de ajuste automático foi aplicada ao parâmetro do realce de contraste, o fator multiplicador, no DRNPW. Valores menores que 1 reduzem o contraste, e valores maiores que 1 o aumentam.
Primeiro, a busca em grade avaliou cinco valores entre 0,5 e 1,611. O melhor foi o fator 1,333, com 90 por cento de acurácia, 81 por cento de precisão e 85,3 por cento de F1-score. A redução excessiva de contraste, com fator 0,5, resultou na menor acurácia, 76,7 por cento.
Como complemento, a busca aleatória testou cinco valores entre 0,5 e 3. O melhor foi 1,4364, com 85,06 por cento de acurácia na validação, e contrastes muito altos degradaram o desempenho, com 71,26 por cento no fator 2,33.
Os dois métodos apontam para valores próximos, um pouco acima de 1. Essa convergência deve ser lida com reserva, porque as duas buscas foram avaliadas sobre conjuntos distintos: o de teste, com 30 imagens, e o de validação, com 87.
O ganho metodológico é que o ajuste deixa de depender de otimização manual.`);
}

// ===========================================================================
// 22 - Troca de modelo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional", "Trocar o modelo inverte a melhor técnica");

  s.addChart(pres.ChartType.bar, [
    { name: "CNN", labels: ["CPLID", "DRNPW"], values: [84.55, 73.81] },
    { name: "YOLOv8n-cls", labels: ["CPLID", "DRNPW"], values: [66.28, 71.43] },
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
  legenda(s, "Acurácia média nas 14 técnicas", 0.3, 1.2, 5.2);

  const casos = [
    ["CLAHE + realce", "CPLID", CPLID_CNN[2], CPLID_YOLO[2]],
    ["Realce + equalização", "DRNPW", DRNPW_CNN[5], DRNPW_YOLO[5]],
    ["Escala de cinza", "CPLID", CPLID_CNN[11], CPLID_YOLO[11]],
  ];
  s.addText("A mesma técnica: CNN → YOLOv8n-cls", {
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
Até aqui, todas as avaliações usaram uma única arquitetura. Isso isola o pré-processamento, mas deixa uma pergunta em aberto: os efeitos observados vêm das imagens ou do modelo usado para avaliá-las?
Como a metodologia trata o modelo como um bloco substituível, a mesma varredura foi repetida com o YOLOv8n-cls, a variante de classificação da família YOLO, com pesos iniciais do COCO e cerca de 1,4 milhão de parâmetros treináveis. Foram 28 treinamentos completos, mantendo os conjuntos, as 14 técnicas e as 50 épocas.
O YOLOv8n-cls não superou a rede convolucional. No CPLID, a sua acurácia média foi de 66,28 por cento, contra 84,55, e ele superou o piso em apenas 1 das 14 técnicas. No DRNPW, as duas arquiteturas ficaram na vizinhança do piso.
E a ordem de mérito das técnicas se inverteu. A combinação de CLAHE com realce caiu de 95,35 para 51,16 por cento. A melhor combinação do DRNPW caiu de 83,33 para 53,33. E a escala de cinza subiu de 76,74 para 81,40 por cento.
Uma explicação plausível é que os pesos do COCO carregam as estatísticas de cor e contraste de fotografias naturais, e transformações que se afastam dessa distribuição degradam a utilidade dos filtros já aprendidos. A consequência é que a escolha do pré-processamento não é independente do modelo.`);
}

// ===========================================================================
// 23 - O que a metodologia entrega
// ===========================================================================
{
  const s = darkSlide();
  title(s, "Impacto", "O que a metodologia entrega", { dark: true });

  const entregas = [
    ["49,12% → 75,76%", "Ganho de desempenho", "F1-score da imagem original à melhor combinação, no DRNPW"],
    ["93,02% → 67,44%", "Proteção contra a escolha errada", "acurácia da imagem original ao desfoque gaussiano, no CPLID"],
    ["84,55% × 66,28%", "Onde investir", "a arquitetura maior e pré-treinada não superou a CNN, no CPLID"],
    ["↺", "Reexecução controlada", "seleção refeita a cada mudança de modelo ou de conjunto de dados"],
  ];
  entregas.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 1.35 + row * 1.8;
    card(s, x, y, 4.35, 1.62, { fill: C.nightSoft, line: C.nightSoft, flat: true });
    s.addText(e[0], {
      x: x + 0.25, y: y + 0.15, w: 3.9, h: 0.65, margin: 0,
      fontFace: F.head, fontSize: 24, bold: true, color: i % 3 === 0 ? C.amber : C.tealLight,
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
Reunindo os resultados, destaco o que a metodologia entrega para quem desenvolve um sistema de inspeção de isoladores.
Primeiro, ganho de desempenho. No cenário de campo, a escolha do tratamento levou o F1-score de 49,12 por cento, com as imagens originais, para 75,76 por cento, com a mesma rede.
Segundo, proteção contra a escolha errada. No CPLID, o desfoque gaussiano derrubou a acurácia de 93,02 para 67,44 por cento.
Terceiro, uma indicação sobre onde investir. Em regime de poucos dados, a arquitetura maior e pré-treinada não superou a rede convolucional simples, porque o aumento da capacidade do modelo não compensou as limitações do conjunto de dados.
E quarto, um procedimento. Como a melhor técnica muda com a arquitetura e com o conjunto de dados, a seleção precisa ser refeita a cada mudança, e a estrutura iterativa da metodologia viabiliza essa reexecução controlada.
Em síntese, o tratamento adequado das imagens brutas, ajustado a cada conjunto de dados e ao modelo adotado, é condição essencial para o bom desempenho.`);
}

// ===========================================================================
// 24 - Vantagens para o sistema elétrico
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Impacto", "Vantagens para o sistema elétrico");

  const vant = [
    ["Continuidade", "A detecção precoce de falhas evita interrupções no fornecimento"],
    ["Custo de manutenção", "Identificar a falha cedo reduz os custos de manutenção"],
    ["Segurança", "Evita intervenções manuais em locais de difícil acesso"],
    ["Grandes extensões", "Drones facilitam a inspeção de longos trechos de linha"],
    ["Reprodutibilidade", "Diagnóstico mais rápido, econômico e menos subjetivo"],
    ["Manutenção preditiva", "Danos identificados antes de se tornarem críticos"],
  ];
  vant.forEach((v, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 3.05, y = 1.35 + row * 1.8;
    card(s, x, y, 2.85, 1.6, { flat: true });
    s.addShape(pres.ShapeType.rect, { x, y, w: 2.85, h: 0.08, fill: { color: row === 0 ? C.teal : C.amber }, line: { type: "none" } });
    bubble(s, x + 0.2, y + 0.3, 0.46, String(i + 1), { fill: row === 0 ? C.teal : C.amber, color: row === 0 ? C.white : C.night });
    s.addText(v[0], {
      x: x + 0.8, y: y + 0.3, w: 1.95, h: 0.46, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 13.5, bold: true, color: C.ink,
    });
    s.addText(v[1], {
      x: x + 0.2, y: y + 0.88, w: 2.5, h: 0.62, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Impacto");
  fala(s, `
Voltando ao sistema elétrico, a inspeção automatizada por imagem, que este trabalho ajuda a tornar mais confiável, traz vantagens em seis frentes.
A continuidade do fornecimento, porque a detecção precoce de falhas evita interrupções.
O custo, porque identificar a falha cedo reduz os custos de manutenção.
A segurança, porque o uso de imagens evita intervenções manuais em locais de difícil acesso.
A abrangência, porque os drones facilitam a inspeção de grandes extensões de linhas.
A reprodutibilidade, porque o diagnóstico automatizado é mais rápido, econômico e menos sujeito à subjetividade e ao erro humano.
E a manutenção preditiva, porque as técnicas modernas permitem monitorar os equipamentos e identificar danos antes que se tornem críticos.
Em todas essas frentes, o ganho depende de o modelo acertar, e o acerto do modelo depende, como vimos, do tratamento dado às imagens.`);
}

// ===========================================================================
// 25 - Conclusões
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Conclusões", "O que os resultados sustentam");

  const cs = [
    ["O pré-processamento é determinante na detecção de falhas em isoladores", "Elevou o F1-score de 49,12% para 75,76% no DRNPW e, mal escolhido, levou a acurácia de 93,02% a 67,44% no CPLID."],
    ["Não há técnica universalmente superior", "Realce de contraste para defeito estrutural em cadeias cerâmicas. Combinações híbridas para fundos com poluição visual."],
    ["A seleção do pré-processamento depende do modelo", "A ordem de mérito se inverteu entre a CNN e o YOLOv8n-cls, e a escolha deve ser refeita a cada mudança."],
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
Primeira conclusão: o pré-processamento das imagens exerce papel determinante no desempenho dos modelos em cenários de inspeção de infraestrutura elétrica.
Segunda conclusão: não há um processamento universalmente superior. Para defeitos estruturais em cadeias de isoladores de linhas de transmissão, no CPLID, o realce de contraste foi a estratégia de maior êxito. Para a inspeção aérea com fundos heterogêneos e poluídos, no DRNPW, as combinações de realce de contraste e equalização de histograma foram mais eficazes. A eficácia de cada técnica depende das características do conjunto de dados e do contexto de captura das falhas.
Terceira conclusão: a ordem de mérito das técnicas se altera conforme a arquitetura, de modo que a seleção do pré-processamento não é independente do modelo nem da forma de inicialização dos seus pesos. Por isso, ela precisa ser refeita a cada mudança de arquitetura ou de conjunto de dados, e é essa reexecução controlada que a metodologia proposta busca viabilizar.`);
}

// ===========================================================================
// 26 - Limitações e trabalhos futuros
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Conclusões", "Limitações e trabalhos futuros");

  card(s, M, 1.35, 4.3, 3.5, { fill: C.surface, flat: true });
  s.addText("Limitações", {
    x: M + 0.28, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.muted,
  });
  bullets(s, [
    "Escassez de imagens públicas com defeitos anotados",
    "Conjuntos de dados fortemente desbalanceados",
    "Explosão combinatória ao otimizar todos os parâmetros",
  ], { x: M + 0.3, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 10 });

  card(s, M + 4.6, 1.35, 4.3, 3.5, { fill: C.night, line: C.night });
  s.addText("Trabalhos futuros", {
    x: M + 4.88, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.amber,
  });
  bullets(s, [
    "Otimização bayesiana de múltiplos parâmetros",
    "Aumento de dados com GANs",
    "Integração com arquiteturas de detecção",
    "Métricas robustas ao desbalanceamento",
    "Execução embarcada em drones",
  ], { x: M + 4.9, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 8, color: C.white });

  footer(s, "Conclusões");
  fala(s, `
O trabalho enfrentou limitações.
A principal foi a quantidade e a disponibilidade de dados. Há grande escassez de bancos de imagens públicos focados em redes de distribuição, com número expressivo de componentes defeituosos e anotações rigorosas, o que obriga o uso de conjuntos fortemente desbalanceados.
Outra limitação foi o custo computacional. Otimizar todos os parâmetros do pipeline ao mesmo tempo leva à explosão combinatória, o que inviabiliza a avaliação exaustiva em tempo hábil.
A partir dessas limitações, sugiro cinco trabalhos futuros. Usar a otimização bayesiana para explorar vários parâmetros simultaneamente. Gerar exemplos sintéticos de defeitos com redes generativas adversariais. Estender o método para arquiteturas de detecção, avaliando a localização espacial das falhas. Adotar métricas mais robustas ao desbalanceamento, como o F1-score macro e a acurácia balanceada. E avaliar o desempenho do pipeline em dispositivos embarcados, como drones, para viabilizar a inspeção dinâmica em campo.`);
}

// ===========================================================================
// 27 - Impacto para a engenharia elétrica
// ===========================================================================
{
  const s = darkSlide();
  s.addImage({ data: asset("encerramento.jpg"), x: 0, y: 0, w: W, h: H });
  title(s, "Impacto", "O impacto para a engenharia elétrica", { dark: true });

  const impactos = [
    ["Confiabilidade do sistema", "Modelos que identificam melhor as falhas nos isoladores, antes das interrupções"],
    ["Manutenção de linhas", "Inspeção por drone e IA mais rápida, econômica, segura e reprodutível"],
    ["Método para a inspeção automatizada", "Procedimento sistemático para escolher e ajustar o tratamento das imagens"],
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

  s.addText("Tratar bem a imagem bruta é tão relevante quanto escolher a arquitetura da rede.", {
    x: M, y: 4.3, w: 7.8, h: 0.6, margin: 0,
    fontFace: F.head, fontSize: 16, bold: true, italic: true, color: C.white,
  });

  footer(s, "Conclusões", true);
  fala(s, `
Encerro voltando ao ponto de partida, o Sistema Elétrico de Potência.
A principal contribuição deste trabalho é uma metodologia estruturada para a inspeção automatizada de linhas de transmissão, que mapeia de forma sistemática o impacto do processamento das imagens aéreas.
O impacto aparece em três frentes. Na confiabilidade do sistema, porque um modelo que identifica melhor a falha no isolador contribui para encontrá-la antes que ela cause uma interrupção no fornecimento. Na manutenção das linhas, porque fortalece a inspeção por drone e inteligência artificial, que é mais rápida, econômica, segura e reprodutível que a inspeção manual. E na própria inspeção automatizada, porque oferece um procedimento sistemático para escolher e ajustar o tratamento das imagens, que pode ser repetido a cada novo conjunto de dados ou nova arquitetura.
A mensagem final é que o tratamento adequado das imagens brutas é tão relevante quanto a escolha da arquitetura da rede neural.`);
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
Muito obrigado pela atenção. Fico à disposição da banca para as arguições.`);
}

// ---------------------------------------------------------------------------
pres.writeFile({ fileName: process.argv[2] || "defesa.pptx" })
  .then(f => console.log("Gerado:", f));
