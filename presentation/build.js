const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// Raiz do repositório da dissertação, de onde vêm as figuras do Capítulo 4.
// Rodando de dentro de presentation/, o padrão já resolve. Fora dela, use THESIS_ROOT.
const REPO = process.env.THESIS_ROOT || path.resolve(__dirname, "..");
const FIG = path.join(REPO, "documents", "img", "coleta_e_analise_de_resultados", "preprocessing");

// Lê a figura como data URI, o que evita qualquer problema com acento no caminho.
function figura(modelo, dataset) {
  const p = path.join(FIG, modelo, dataset, "Acurácia.jpg");
  return "image/jpeg;base64," + fs.readFileSync(p).toString("base64");
}

// ---------------------------------------------------------------------------
// Paleta e tipografia
// ---------------------------------------------------------------------------
const C = {
  night: "12263A",      // azul-noite (dominante nos slides escuros)
  nightSoft: "1C3550",
  teal: "1C7293",       // apoio
  tealDark: "145A75",
  amber: "F5A54A",      // acento
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
  if (eyebrow) {
    s.addText(eyebrow.toUpperCase(), {
      x: M, y: 0.3, w: W - 2 * M, h: 0.25, margin: 0,
      fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 1.6,
      color: dark ? C.amber : C.teal,
    });
  }
  s.addText(text, {
    x: M, y: eyebrow ? 0.56 : 0.42, w: opts.w || W - 2 * M, h: opts.h || 0.62, margin: 0,
    fontFace: F.head, fontSize: opts.size || 29, bold: true,
    color: dark ? C.white : C.ink, valign: "top",
  });
}

function footer(s, label, dark = false) {
  slideNo += 1;
  const n = slideNo;
  s.addText(label, {
    x: M, y: H - 0.42, w: 6.5, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9, color: dark ? C.mutedLight : C.muted,
  });
  s.addText(String(n), {
    x: W - M - 0.6, y: H - 0.42, w: 0.6, h: 0.25, margin: 0, align: "right",
    fontFace: F.body, fontSize: 9, bold: true, color: dark ? C.amber : C.teal,
  });
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

function stat(s, x, y, w, value, label, opts = {}) {
  s.addText(value, {
    x, y, w, h: 0.62, margin: 0, align: opts.align || "left",
    fontFace: F.head, fontSize: opts.size || 34, bold: true, color: opts.color || C.teal,
  });
  s.addText(label, {
    x, y: y + 0.6, w, h: opts.labelH || 0.5, margin: 0, align: opts.align || "left",
    fontFace: F.body, fontSize: 10.5, color: opts.labelColor || C.muted,
  });
}

// paragrafos com marcador
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

// Slide de resultado: figura da dissertação em largura quase total e três
// destaques logo abaixo. `destaques` = [[valor, rótulo, descrição, estilo], ...]
function slideFigura(s, imgData, legenda, destaques) {
  s.addText(legenda, {
    x: 0.3, y: 1.16, w: 9.4, h: 0.22, margin: 0,
    fontFace: F.body, fontSize: 9.5, italic: true, color: C.muted,
  });
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
// Dados dos experimentos (Cap. 4 da dissertacao)
// ---------------------------------------------------------------------------
const TEC = ["Adaptive Threshold", "CLAHE", "CLAHE + Contrast Enh.", "Contrast Enhancement",
  "Contrast Enh. + CLAHE", "Contrast Enh. + Eq. Hist.", "Denoise", "Edge Detection",
  "Equalize Histogram", "Eq. Hist. + Contrast Enh.", "Gaussian Blur", "Gray Scale",
  "Median Blur", "Original Image"];

const CPLID_CNN = [67.44, 90.70, 95.35, 95.35, 93.02, 95.35, 67.44, 74.42, 88.37, 93.02, 67.44, 76.74, 86.05, 93.02];
const CPLID_YOLO = [55.81, 60.47, 51.16, 58.14, 69.77, 62.79, 72.09, 67.44, 72.09, 74.42, 74.42, 81.40, 67.44, 60.47];
const DRNPW_CNN = [73.33, 80.00, 70.00, 63.33, 80.00, 83.33, 76.67, 66.67, 80.00, 76.67, 76.67, 63.33, 80.00, 63.33];
const DRNPW_YOLO = [83.33, 73.33, 80.00, 76.67, 76.67, 53.33, 63.33, 73.33, 70.00, 66.67, 63.33, 80.00, 73.33, 66.67];

// ordena decrescente para leitura em barra horizontal
function sortedPairs(vals) {
  return TEC.map((t, i) => [t, vals[i]]).sort((a, b) => a[1] - b[1]);
}

// ===========================================================================
// SLIDE 1 - Capa
// ===========================================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, {
    x: 7.15, y: -1.35, w: 4.2, h: 4.2, fill: { color: C.teal, transparency: 72 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 8.25, y: 3.05, w: 2.6, h: 2.6, fill: { color: C.tealDark, transparency: 55 }, line: { width: 0 },
  });

  s.addText("Universidade Federal de Santa Maria", {
    x: M, y: 0.6, w: 6.6, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 12, color: C.amber, bold: true,
  });
  s.addText("Programa de Pós-Graduação em Engenharia Elétrica", {
    x: M, y: 0.86, w: 6.6, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 11, color: C.mutedLight,
  });

  s.addText("Método de aprimoramento de processamentos de imagens aplicados à detecção e classificação de falhas em cadeias de isoladores", {
    x: M, y: 1.5, w: 6.7, h: 1.85, margin: 0,
    fontFace: F.head, fontSize: 25, bold: true, color: C.white, lineSpacingMultiple: 1.05,
  });

  s.addText("Defesa de Dissertação de Mestrado", {
    x: M, y: 3.45, w: 6.7, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 12, italic: true, color: C.amberSoft,
  });

  s.addText([
    { text: "Mestrando: ", options: { color: C.mutedLight } },
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Orientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Daniel Pinheiro Bernardon", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Coorientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Paulo César Vargas Luz", options: { bold: true, color: C.white } },
  ], { x: M, y: 4.0, w: 6.7, h: 1.0, margin: 0, fontFace: F.body, fontSize: 12, lineSpacingMultiple: 1.15 });

  s.addText("Santa Maria, RS", {
    x: M, y: H - 0.45, w: 4, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9.5, color: C.mutedLight,
  });
  slideNo += 1;

  s.addNotes(
`[00:00 - 00:30 | 30s] ABERTURA
Bom dia. Meu nome e Luan Willig Silveira e apresento a dissertacao intitulada "Metodo de aprimoramento de processamentos de imagens aplicados a deteccao e classificacao de falhas em cadeias de isoladores", desenvolvida no PPGEE da UFSM sob orientacao do professor Daniel Bernardon e coorientacao do professor Paulo Cesar Vargas Luz.
Agradeco a presenca da banca e passo ao roteiro.
DICA: nao leia o titulo inteiro em voz alta, resuma como "processamento de imagens aplicado a inspecao de isoladores".`);
}

// ===========================================================================
// SLIDE 2 - Roteiro
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Roteiro", "O que será apresentado");

  const itens = [
    ["1", "Contexto e problema", "Inspeção de cadeias de isoladores"],
    ["2", "Lacuna e objetivos", "O que a literatura não responde"],
    ["3", "Metodologia proposta", "Fluxo iterativo e modular"],
    ["4", "Materiais e protocolo", "Dois datasets, 14 técnicas, dois modelos"],
    ["5", "Resultados", "Pré-processamento, otimização e arquiteturas"],
    ["6", "Conclusões", "Contribuições, limitações e trabalhos futuros"],
  ];
  itens.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 1.42 + row * 1.15;
    card(s, x, y, 4.35, 0.98);
    bubble(s, x + 0.22, y + 0.24, 0.5, it[0], { fill: i % 2 === 0 ? C.teal : C.night });
    s.addText(it[1], {
      x: x + 0.85, y: y + 0.19, w: 3.3, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 13.5, bold: true, color: C.ink,
    });
    s.addText(it[2], {
      x: x + 0.85, y: y + 0.5, w: 3.3, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted,
    });
  });

  footer(s, "Roteiro");
  s.addNotes(
`[00:30 - 01:00 | 30s] ROTEIRO
A apresentacao segue seis blocos: comeco pelo contexto do problema de inspecao, depois apresento a lacuna que a literatura deixa em aberto e os objetivos, na sequencia a metodologia proposta, os materiais e o protocolo experimental, os resultados e, por fim, as conclusoes.
Reservo os ultimos minutos para limitacoes e trabalhos futuros.
DICA: apontar rapidamente para os blocos, sem detalhar. Nao gastar mais de 30 segundos aqui.`);
}

// ===========================================================================
// SLIDE 3 - Contexto
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contexto", "Isoladores: componente crítico e exposto");

  const blocos = [
    ["Função", "Sustentam mecanicamente os condutores e garantem o isolamento entre partes energizadas e estruturas aterradas."],
    ["Exposição", "Variações de temperatura, umidade, poluição e descargas atmosféricas atuam de forma contínua sobre as cadeias."],
    ["Falhas típicas", "Trincas, contaminação superficial, perfurações, ruptura e ausência de disco comprometem a rigidez dielétrica."],
  ];
  blocos.forEach((b, i) => {
    const x = M + i * 3.05;
    card(s, x, 1.5, 2.85, 1.95);
    s.addText(b[0], {
      x: x + 0.25, y: 1.68, w: 2.35, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 13.5, bold: true, color: C.teal,
    });
    s.addText(b[1], {
      x: x + 0.25, y: 2.0, w: 2.4, h: 1.3, margin: 0,
      fontFace: F.body, fontSize: 11.5, color: C.ink, lineSpacingMultiple: 1.1,
    });
  });

  card(s, M, 3.75, 8.9, 1.0, { fill: C.night, line: C.night });
  s.addText("A identificação precoce da falha evita interrupção de fornecimento, reduz custo de manutenção e previne risco às instalações e às pessoas.", {
    x: M + 0.3, y: 3.97, w: 8.3, h: 0.56, margin: 0,
    fontFace: F.body, fontSize: 13, italic: true, color: C.white, valign: "middle",
  });

  footer(s, "Contexto e problema");
  s.addNotes(
`[01:00 - 02:00 | 60s] CONTEXTO
Os isoladores cumprem duas funcoes ao mesmo tempo: sustentam mecanicamente os condutores e garantem o isolamento eletrico entre as partes energizadas e as estruturas aterradas. Em alta tensao eles aparecem agrupados em cadeias.
Essas cadeias ficam expostas de forma continua a temperatura, umidade, poluicao e descargas atmosfericas. Com o tempo, essa exposicao produz trincas, contaminacao superficial, perfuracoes e ate a ausencia de disco, condicoes que reduzem a rigidez dieletrica e podem evoluir para falha de isolamento na linha.
O ponto a fixar e o da faixa inferior: identificar a falha cedo evita interrupcao de fornecimento, reduz custo de manutencao e previne risco as pessoas.`);
}

// ===========================================================================
// SLIDE 4 - Problema
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Problema", "Da inspeção visual à inspeção automatizada");

  card(s, M, 1.45, 4.3, 2.75);
  bubble(s, M + 0.25, 1.68, 0.44, "!", { fill: C.muted });
  s.addText("Inspeção visual e manual", {
    x: M + 0.82, y: 1.72, w: 3.2, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
  });
  bullets(s, [
    "Lenta e cara em grandes extensões de linha",
    "Sujeita à subjetividade e ao erro humano",
    "Exige equipe especializada em campo",
    "Pouco reprodutível entre inspeções",
  ], { x: M + 0.3, y: 2.22, w: 3.75, h: 1.75, size: 12 });

  card(s, M + 4.6, 1.45, 4.3, 2.75, { fill: C.night, line: C.night });
  bubble(s, M + 4.85, 1.68, 0.44, "✓", { fill: C.amber, color: C.night });
  s.addText("Inspeção assistida por imagem", {
    x: M + 5.42, y: 1.72, w: 3.2, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.white,
  });
  bullets(s, [
    "Captura por drone em larga escala",
    "Processamento de imagem e aprendizado de máquina",
    "Diagnóstico mais rápido, econômico e reprodutível",
    "Depende da qualidade visual do dado de entrada",
  ], { x: M + 4.9, y: 2.22, w: 3.75, h: 1.75, size: 12, color: C.white });

  s.addText("A eficácia do sistema automatizado depende das técnicas de processamento empregadas, de como são combinadas e de como são ajustadas.", {
    x: M, y: 4.42, w: 8.9, h: 0.5, margin: 0, align: "center",
    fontFace: F.head, fontSize: 14, bold: true, color: C.teal,
  });

  footer(s, "Contexto e problema");
  s.addNotes(
`[02:00 - 03:15 | 75s] PROBLEMA
Tradicionalmente a inspecao e visual e manual, feita por equipes especializadas. Em linhas de grande extensao isso e lento, caro e sujeito a subjetividade, alem de pouco reprodutivel entre uma inspecao e outra.
A alternativa que se consolidou e a inspecao assistida por imagem: o drone captura o material em larga escala e um modelo de aprendizado de maquina faz a triagem. O ganho e claro em velocidade, custo e reprodutibilidade.
Mas ha uma dependencia que costuma ser tratada como detalhe: o desempenho do modelo depende da qualidade visual do dado de entrada, ou seja, das tecnicas de processamento aplicadas antes da modelagem, de como elas se combinam e de como sao ajustadas. E exatamente esse ponto que a dissertacao ataca.`);
}

// ===========================================================================
// SLIDE 5 - Onde entra o pre-processamento
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Recorte do trabalho", "O elo menos estudado do pipeline");

  const etapas = [
    ["Aquisição", "Imagens de drone"],
    ["Pré-processamento", "Realce, filtragem, cor"],
    ["Modelo", "CNN, YOLO, ResNet"],
    ["Diagnóstico", "Com falha ou sem falha"],
  ];
  const bw = 2.02, gap = 0.28;
  etapas.forEach((e, i) => {
    const x = M + i * (bw + gap);
    const destaque = i === 1;
    card(s, x, 1.75, bw, 1.3, destaque ? { fill: C.teal, line: C.teal } : {});
    s.addText(e[0], {
      x: x + 0.12, y: 2.02, w: bw - 0.24, h: 0.34, margin: 0, align: "center",
      fontFace: F.body, fontSize: destaque ? 13.5 : 12.5, bold: true,
      color: destaque ? C.white : C.ink,
    });
    s.addText(e[1], {
      x: x + 0.12, y: 2.4, w: bw - 0.24, h: 0.4, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: destaque ? C.amberSoft : C.muted,
    });
    if (i < 3) {
      s.addText("▶", {
        x: x + bw + 0.01, y: 2.2, w: gap - 0.02, h: 0.3, margin: 0, align: "center",
        fontFace: F.body, fontSize: 11, color: C.mutedLight,
      });
    }
  });

  s.addText("Variável independente deste trabalho", {
    x: M + bw + gap, y: 3.12, w: bw, h: 0.28, margin: 0, align: "center",
    fontFace: F.body, fontSize: 10, bold: true, italic: true, color: C.amber,
  });

  card(s, M, 3.62, 8.9, 1.18, { fill: C.surface });
  s.addText("A mesma imagem, tratada de formas diferentes, produz modelos com desempenho muito diferente. Ainda assim, a etapa costuma ser fixada por hábito ou por tentativa e erro, sem procedimento sistemático de escolha.", {
    x: M + 0.3, y: 3.82, w: 8.3, h: 0.8, margin: 0,
    fontFace: F.body, fontSize: 13, color: C.ink, valign: "middle", lineSpacingMultiple: 1.1,
  });

  footer(s, "Contexto e problema");
  s.addNotes(
`[03:15 - 04:00 | 45s] RECORTE
Este e o pipeline tipico: aquisicao por drone, pre-processamento, modelo e diagnostico.
A literatura investe pesado no terceiro bloco, o modelo, e trata o segundo como etapa acessoria. Neste trabalho o segundo bloco e a variavel independente: tudo o mais e mantido fixo para medir o efeito do pre-processamento.
A justificativa esta na faixa de baixo: a mesma imagem tratada de formas diferentes produz modelos com desempenho muito diferente, e mesmo assim essa escolha costuma ser feita por habito ou por tentativa e erro.`);
}

// ===========================================================================
// SLIDE 6 - Trabalhos relacionados
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Estado da arte", "A literatura não converge");

  const rows = [
    ["Liu et al. (2021)", "CSPD-YOLO em imagens aéreas", "Sem impacto significativo", C.muted],
    ["Wang et al. (2023)", "RA-CNN com otimização por PSO", "Sem impacto significativo", C.muted],
    ["Zhang et al. (2022)", "Faster R-CNN e processamento morfológico", "Melhorou o desempenho", C.teal],
    ["Salvi et al. (2021)", "Revisão em patologia digital", "Melhorou precisão e tempo", C.teal],
    ["Öztürk e Akdemir (2018)", "Histopatologia com níveis de processamento", "Risco de sobre-processamento", C.amber],
    ["Rodrigues et al. (2020)", "Células HEp-2 com seis estratégias", "Afetou negativamente a CNN", C.amber],
  ];

  const y0 = 1.30, rh = 0.44;
  s.addText([
    { text: "Trabalho", options: { bold: true } },
  ], { x: M + 0.15, y: y0, w: 2.2, h: 0.3, margin: 0, fontFace: F.body, fontSize: 10.5, color: C.muted });
  s.addText("Abordagem", { x: M + 2.5, y: y0, w: 3.3, h: 0.3, margin: 0, fontFace: F.body, fontSize: 10.5, bold: true, color: C.muted });
  s.addText("Efeito do pré-processamento", { x: M + 5.9, y: y0, w: 2.9, h: 0.3, margin: 0, fontFace: F.body, fontSize: 10.5, bold: true, color: C.muted });

  rows.forEach((r, i) => {
    const y = y0 + 0.34 + i * rh;
    if (i % 2 === 0) {
      s.addShape(pres.ShapeType.rect, {
        x: M, y, w: 8.9, h: rh - 0.05, fill: { color: C.surface }, line: { width: 0 },
      });
    }
    s.addText(r[0], { x: M + 0.15, y: y + 0.08, w: 2.3, h: 0.34, margin: 0, fontFace: F.body, fontSize: 11, bold: true, color: C.ink });
    s.addText(r[1], { x: M + 2.5, y: y + 0.08, w: 3.35, h: 0.34, margin: 0, fontFace: F.body, fontSize: 10.5, color: C.muted });
    s.addText(r[2], { x: M + 5.9, y: y + 0.08, w: 2.9, h: 0.34, margin: 0, fontFace: F.body, fontSize: 10.5, bold: true, color: r[3] });
  });

  card(s, M, 4.4, 8.9, 0.7, { fill: C.night, line: C.night });
  s.addText("Mesmo objeto de estudo, conclusões opostas. Nenhum dos trabalhos propõe um procedimento para decidir qual processamento usar.", {
    x: M + 0.3, y: 4.5, w: 8.3, h: 0.5, margin: 0,
    fontFace: F.body, fontSize: 12.5, bold: true, color: C.white, valign: "middle",
  });

  footer(s, "Lacuna e objetivos");
  s.addNotes(
`[04:00 - 05:15 | 75s] ESTADO DA ARTE
Esta tabela resume o problema da literatura. Liu e Wang, os dois trabalhos mais proximos do nosso dominio, aplicam apenas redimensionamento e normalizacao e relatam que o pre-processamento nao teve impacto relevante.
Zhang, com processamento morfologico, e Salvi, em revisao de patologia digital, relatam o oposto: ganho de desempenho.
Ozturk mostra que existe um ponto de saturacao, o sobre-processamento degrada o resultado, e Rodrigues chega a conclusao mais desconfortavel, a de que a imagem original superou as versoes processadas.
Ou seja, para o mesmo tipo de pergunta ha conclusoes opostas. E, mais importante, nenhum desses trabalhos oferece um procedimento para decidir qual processamento usar em um caso novo. Cada um reporta o que funcionou no seu experimento.
DICA: nao ler as seis linhas, agrupar em tres blocos como acima.`);
}

// ===========================================================================
// SLIDE 7 - Lacuna e objetivo geral (dark)
// ===========================================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, {
    x: 7.7, y: 3.3, w: 3.4, h: 3.4, fill: { color: C.teal, transparency: 78 }, line: { width: 0 },
  });
  title(s, "Lacuna e objetivo geral", "O que falta não é técnica, é critério", { dark: true });

  s.addText("A literatura oferece um catálogo extenso de técnicas de processamento e nenhum critério reprodutível para escolher entre elas em um caso concreto.", {
    x: M, y: 1.55, w: 6.6, h: 0.85, margin: 0,
    fontFace: F.body, fontSize: 14, color: C.mutedLight, lineSpacingMultiple: 1.15,
  });

  card(s, M, 2.6, 8.9, 1.35, { fill: C.nightSoft, line: C.tealDark });
  s.addText("Objetivo geral", {
    x: M + 0.32, y: 2.78, w: 3, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.2, color: C.amber,
  });
  s.addText("Desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem para a detecção e classificação de falhas em cadeias de isoladores.", {
    x: M + 0.32, y: 3.08, w: 8.26, h: 0.75, margin: 0,
    fontFace: F.head, fontSize: 15, bold: true, color: C.white, lineSpacingMultiple: 1.05,
  });

  const verbos = ["Comparar", "Selecionar", "Combinar", "Aprimorar"];
  verbos.forEach((v, i) => {
    const x = M + i * 2.24;
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 4.25, w: 2.05, h: 0.5, rectRadius: 0.1,
      fill: { color: C.night }, line: { color: C.amber, width: 1 },
    });
    s.addText(v, {
      x, y: 4.25, w: 2.05, h: 0.5, margin: 0, align: "center", valign: "middle",
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.amber,
    });
  });

  footer(s, "Lacuna e objetivos", true);
  s.addNotes(
`[05:15 - 06:15 | 60s] LACUNA E OBJETIVO GERAL
A leitura desses trabalhos leva a uma constatacao: o que falta na area nao e tecnica de processamento, existe um catalogo extenso delas. O que falta e criterio reprodutivel para escolher entre elas diante de um caso concreto.
Dai o objetivo geral: desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar tecnicas de processamento de imagem aplicadas a deteccao e classificacao de falhas em cadeias de isoladores.
Os quatro verbos organizam o trabalho inteiro: comparar tecnicas entre si, selecionar a mais adequada, combinar tecnicas em pipeline e aprimorar seus parametros de forma automatica.
DICA: este e o slide central da defesa. Falar devagar e olhar para a banca.`);
}

// ===========================================================================
// SLIDE 8 - Objetivos especificos
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Objetivos específicos", "Sete frentes de trabalho");

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
    const x = M + col * 4.5, y = 1.32 + row * 0.88;
    const w = i === 6 ? 8.85 : 4.35;
    card(s, x, y, w, 0.78, { flat: true });
    bubble(s, x + 0.2, y + 0.17, 0.44, String(i + 1), { fill: i === 6 ? C.amber : C.night, size: 11, color: i === 6 ? C.night : C.white });
    s.addText(o[0], {
      x: x + 0.76, y: y + 0.07, w: w - 0.95, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.teal,
    });
    s.addText(o[1], {
      x: x + 0.76, y: y + 0.35, w: w - 0.92, h: 0.38, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  s.addText("Os modelos são instrumento de medida do pré-processamento, e não o produto final do trabalho.", {
    x: M, y: 4.8, w: 8.9, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 12, italic: true, bold: true, color: C.amber,
  });

  footer(s, "Lacuna e objetivos");
  s.addNotes(
`[06:15 - 07:15 | 60s] OBJETIVOS ESPECIFICOS
Os objetivos especificos desdobram o objetivo geral em sete frentes: definir metricas, determinar o tipo de rede, construir os modelos de avaliacao, analisar o efeito da arquitetura, analisar o efeito do conjunto de dados, desenvolver a combinacao de tecnicas e criar o ajuste automatico de parametros.
Chamo a atencao para a frase final, que evita um mal-entendido comum: os modelos aqui sao instrumento de medida do pre-processamento. O trabalho nao busca o melhor classificador de isoladores, busca um procedimento para escolher o tratamento das imagens.
DICA: nao ler os sete cartoes um a um, agrupar em "definir, medir, combinar e otimizar".`);
}

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
// Retorna a largura efetiva ocupada.
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

// ===========================================================================
// SLIDE 9 - Fluxograma geral
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "Fluxo estruturado, iterativo e modular");

  figFluxo(s, "geral", 0.5, 1.18, { h: 3.8 });

  const etapas = [
    ["1", "Seleção e validação do dataset"],
    ["2", "Pré-processamento"],
    ["3", "Ajuste de parâmetros"],
    ["4", "Escolha e construção do modelo"],
    ["5", "Treinamento"],
    ["6", "Avaliação e ajustes"],
  ];
  etapas.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 2.5 + col * 3.6, y = 1.3 + row * 0.72;
    card(s, x, y, 3.4, 0.62, { flat: true });
    bubble(s, x + 0.14, y + 0.13, 0.36, e[0], { fill: i === 5 ? C.amber : C.teal, size: 10, color: i === 5 ? C.night : C.white });
    s.addText(e[1], {
      x: x + 0.6, y, w: 2.72, h: 0.62, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 11, bold: true, color: C.ink, lineSpacingMultiple: 0.95,
    });
  });

  card(s, 2.5, 3.5, 7.0, 0.62, { fill: C.night, line: C.night });
  s.addText("A avaliação retroalimenta o pré-processamento e a escolha do modelo, e o ciclo se repete até o critério de desempenho ser atendido.", {
    x: 2.72, y: 3.5, w: 6.6, h: 0.62, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 11, color: C.white, lineSpacingMultiple: 1.0,
  });

  const props = [
    ["Modular", "Cada bloco é substituível sem refazer os demais"],
    ["Iterativo", "O ciclo se repete até o critério ser atendido"],
    ["Reprodutível", "Métricas fixadas antes de qualquer experimento"],
  ];
  props.forEach((p, i) => {
    const x = 2.5 + i * 2.38;
    s.addText(p[0], {
      x, y: 4.3, w: 2.2, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 11.5, bold: true, color: C.teal,
    });
    s.addText(p[1], {
      x, y: 4.56, w: 2.24, h: 0.56, margin: 0,
      fontFace: F.body, fontSize: 9.5, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Metodologia");
  s.addNotes(
`[07:15 - 08:15 | 60s] METODOLOGIA, FLUXO GERAL
Este e o fluxograma geral da metodologia proposta, o mesmo da dissertacao. O fluxo parte do bloco Inicio e percorre seis etapas: selecao e validacao do dataset, pre-processamento, ajuste de parametros, escolha e construcao do modelo, treinamento e avaliacao e ajustes, encerrando em conclusoes e recomendacoes.
O que distingue a proposta de um roteiro linear e o retorno a esquerda do diagrama: a avaliacao retroalimenta o pre-processamento e a escolha do modelo, e o ciclo se repete ate o criterio de desempenho ser atendido.
Tres propriedades sustentam a proposta. Modular, cada bloco pode ser trocado sem refazer os demais, e e isso que permite o experimento com uma segunda arquitetura que mostro adiante. Iterativo, o ciclo se repete. E reprodutivel, porque as metricas sao fixadas antes de qualquer experimento.
DICA: este slide e o mapa. Os proximos abrem cada etapa, entao nao se alongar aqui.`);
}

// ===========================================================================
// SLIDE 10 - Fluxograma detalhado completo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia", "O fluxograma detalhado, do início às conclusões");

  figFluxo(s, "completo", 0.55, 1.15, { h: 3.82 });

  const leitura = [
    ["Seis agrupamentos", "Cada moldura do diagrama corresponde a uma das seis etapas do fluxo geral, e reúne as operações e decisões daquela etapa."],
    ["Quatro pontos de decisão", "Dataset está balanceado? · Combinar técnicas? · Tipo de tarefa · Desempenho satisfatório? Cada um abre ramos distintos do fluxo."],
    ["O laço à esquerda", "Quando o desempenho não satisfaz, o bloco Ajustar processamentos e modelo devolve o fluxo ao pré-processamento, e não ao início."],
  ];
  leitura.forEach((l, i) => {
    const y = 1.3 + i * 1.14;
    card(s, 2.5, y, 7.0, 1.0, { flat: true });
    bubble(s, 2.68, y + 0.26, 0.46, String(i + 1), { fill: i === 2 ? C.amber : C.teal, color: i === 2 ? C.night : C.white });
    s.addText(l[0], {
      x: 3.3, y: y + 0.12, w: 6.0, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.ink,
    });
    s.addText(l[1], {
      x: 3.3, y: y + 0.4, w: 6.05, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  s.addText("Caminho percorrido neste trabalho: dataset desbalanceado, técnicas isoladas e combinadas, tarefa de classificação e busca automática de parâmetros.", {
    x: 2.5, y: 4.76, w: 7.0, h: 0.34, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, italic: true, color: C.amber,
  });

  footer(s, "Metodologia");
  s.addNotes(
`[08:15 - 09:30 | 75s] FLUXOGRAMA DETALHADO
Esta e a versao detalhada do fluxograma, tambem reproduzida da dissertacao. Ela nao precisa ser lida bloco a bloco agora, os proximos dois slides ampliam cada etapa. O que interessa neste momento sao tres leituras de conjunto.
Primeira, as molduras. Cada uma corresponde a uma das seis etapas do fluxo geral e reune as operacoes daquela etapa.
Segunda, os losangos, que sao os quatro pontos de decisao do metodo: se o dataset esta balanceado, se as tecnicas serao combinadas, qual o tipo de tarefa e se o desempenho e satisfatorio. Sao esses quatro pontos que tornam a metodologia um procedimento de decisao, e nao uma receita fixa.
Terceira, a linha longa a esquerda do diagrama, que e o laco de retroalimentacao. Quando o desempenho nao satisfaz, o bloco Ajustar processamentos e modelo devolve o fluxo ao pre-processamento, e nao ao inicio.
No caso deste trabalho, o caminho percorrido foi: dataset desbalanceado, os dois ramos de combinacao de tecnicas, tarefa de classificacao e busca automatica de parametros.
DICA: use o ponteiro para percorrer o diagrama de cima para baixo enquanto fala.`);
}

// ===========================================================================
// SLIDE 11 - Fluxogramas das etapas 1 a 3
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia · etapas 1 a 3", "Dataset, pré-processamento e parâmetros");

  figLabel(s, 0.75, 1.28, 1.75, "1 · Seleção e validação");
  figFluxo(s, "e1", 0.86, 1.58, { h: 3.0 });

  figLabel(s, 2.95, 1.28, 3.0, "2 · Pré-processamento");
  figFluxo(s, "e2", 3.05, 1.58, { h: 3.0 });

  figLabel(s, 6.45, 1.28, 3.2, "3 · Ajuste de parâmetros");
  figFluxo(s, "e3", 6.72, 2.25, { h: 1.8 });

  card(s, 0.5, 4.76, 9.0, 0.5, { fill: C.night, line: C.night });
  s.addText("As métricas são definidas antes da seleção dos dados, e a decisão Combinar técnicas? é o que gera as 14 variantes avaliadas, 10 simples e 4 híbridas.", {
    x: 0.75, y: 4.76, w: 8.5, h: 0.5, margin: 0, valign: "middle",
    fontFace: F.body, fontSize: 10.5, color: C.white,
  });

  footer(s, "Metodologia");
  s.addNotes(
`[09:30 - 10:30 | 60s] ETAPAS 1 A 3
Aqui estao ampliados os fluxogramas das tres primeiras etapas.
Na etapa 1, a ordem importa: as metricas sao definidas antes da selecao do conjunto de dados, e nao depois de ver os resultados. Adotamos acuracia, F1-score e tempo. Em seguida verifica-se o balanceamento e, se necessario, aplicam-se filtros, e as duas ramificacoes convergem para as tecnicas basicas.
Na etapa 2 esta o ponto de decisao central do trabalho: combinar tecnicas ou nao. Pelo ramo Nao avaliam-se tecnicas isoladas, pelo ramo Sim gera-se um pipeline em sequencia. Percorri os dois ramos, e e dai que saem as 14 variantes, dez simples e quatro hibridas.
A etapa 3 substitui o ajuste manual por busca automatica. A metodologia preve grade, aleatoria, bayesiana e metodos populacionais, e implementei as duas primeiras sobre o fator de contraste.
DICA: apontar o losango da etapa 2, ele e a origem das 14 tecnicas que aparecem nos resultados.`);
}

// ===========================================================================
// SLIDE 12 - Fluxogramas das etapas 4 a 6
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Metodologia · etapas 4 a 6", "Modelo, treinamento e ciclo de ajuste");

  figLabel(s, 0.5, 1.24, 4.3, "4 · Escolha e construção do modelo", { align: "left" });
  figFluxo(s, "e4", 0.6, 1.54, { w: 4.2 });

  figLabel(s, 0.5, 3.72, 4.3, "5 · Treinamento", { align: "left" });
  figFluxo(s, "e5", 0.6, 4.02, { w: 4.2 });

  figLabel(s, 5.2, 1.24, 2.8, "6 · Avaliação e ajustes", { align: "left" });
  figFluxo(s, "e6", 5.3, 1.54, { h: 3.3 });

  const notas = [
    ["Etapa 4", "Ramo percorrido: classificação, pois os conjuntos têm uma anotação por imagem"],
    ["Etapa 5", "28 treinamentos completos por arquitetura na varredura final"],
    ["Etapa 6", "O ramo Não devolve o fluxo às etapas 2 e 4, e é o que torna o método iterativo"],
  ];
  notas.forEach((n, i) => {
    const y = 1.54 + i * 1.12;
    s.addText(n[0], {
      x: 8.3, y, w: 1.45, h: 0.24, margin: 0,
      fontFace: F.body, fontSize: 10.5, bold: true, color: i === 2 ? C.amber : C.teal,
    });
    s.addText(n[1], {
      x: 8.3, y: y + 0.26, w: 1.45, h: 0.8, margin: 0,
      fontFace: F.body, fontSize: 9, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Metodologia");
  s.addNotes(
`[10:30 - 11:15 | 45s] ETAPAS 4 A 6
Na etapa 4 escolhe-se a arquitetura e decide-se o tipo de tarefa, entre regressao, deteccao e classificacao. O ramo percorrido foi o da classificacao, porque os dois conjuntos possuem exatamente uma anotacao por imagem, o que os caracteriza como problemas de classificacao mesmo quando o rotulo esta em formato de caixa delimitadora.
A etapa 5 e o treinamento, com monitoramento da funcao de custo e das metricas de validacao. Na varredura final foram 28 treinamentos completos por arquitetura.
A etapa 6 fecha o ciclo. Pelo ramo Sim, comparam-se modelos e tecnicas e chega-se as conclusoes. Pelo ramo Nao, ajustam-se processamentos e modelo, e o fluxo volta as etapas 2 e 4.
E esse retorno que permite refazer a selecao do pre-processamento sempre que o modelo ou o conjunto de dados mudam, e os resultados a seguir mostram que isso e necessario.
DICA: terminar no ramo Nao da etapa 6, ele e a ponte para a secao de resultados.`);
}

// ===========================================================================
// SLIDE 13 - Datasets
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Materiais", "Dois cenários de dificuldade distinta");

  // CPLID
  card(s, M, 1.42, 4.3, 2.62);
  s.addText("CPLID", {
    x: M + 0.28, y: 1.6, w: 2.4, h: 0.34, margin: 0,
    fontFace: F.head, fontSize: 17, bold: true, color: C.teal,
  });
  s.addText("Chinese Power Line Insulator Dataset", {
    x: M + 0.28, y: 1.94, w: 3.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10, italic: true, color: C.muted,
  });
  bullets(s, [
    "Cadeias de isoladores cerâmicos captadas por drone",
    "Fundo homogêneo e falha estrutural bem demarcada",
    "Duas classes: normal e defeituoso (missing cap e fratura)",
    "678 imagens de treino e 43 de teste",
  ], { x: M + 0.3, y: 2.3, w: 3.75, h: 1.6, size: 11, gap: 5 });

  // DRNPW
  card(s, M + 4.6, 1.42, 4.3, 2.62);
  s.addText("DRNPW", {
    x: M + 4.88, y: 1.6, w: 2.4, h: 0.34, margin: 0,
    fontFace: F.head, fontSize: 17, bold: true, color: C.amber,
  });
  s.addText("Imagens de inspeção por drone cedidas pela CPFL", {
    x: M + 4.88, y: 1.94, w: 3.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10, italic: true, color: C.muted,
  });
  bullets(s, [
    "Condição operacional real, com forte poluição visual",
    "Fundos heterogêneos: vegetação e ocupação urbana",
    "70 categorias declaradas, apenas 59 presentes no treino",
    "585 imagens: 468 de treino, 87 de validação e 30 de teste",
  ], { x: M + 4.9, y: 2.3, w: 3.75, h: 1.6, size: 11, gap: 5 });

  card(s, M, 4.18, 8.9, 0.92, { fill: C.surface });
  s.addText([
    { text: "Desbalanceamento severo no DRNPW: ", options: { bold: true, color: C.ink } },
    { text: "335 das 468 imagens de treino pertencem a uma única categoria e diversas classes contam com um ou dois exemplos.", options: { color: C.ink } },
  ], {
    x: M + 0.3, y: 4.32, w: 8.3, h: 0.64, margin: 0,
    fontFace: F.body, fontSize: 12.5, valign: "middle", lineSpacingMultiple: 1.05,
  });

  footer(s, "Materiais e protocolo");
  s.addNotes(
`[11:15 - 12:45 | 90s] DATASETS
A validacao usou dois conjuntos escolhidos justamente por serem diferentes em dificuldade.
O CPLID reune cadeias de isoladores ceramicos captadas por drone, com fundo homogeneo e falha estrutural bem demarcada, ausencia de disco e fratura. Sao duas classes e um conjunto pequeno, 678 imagens de treino e 43 de teste.
O DRNPW vem da CPFL e reproduz a condicao de campo: forte poluicao visual, fundo com vegetacao e ocupacao urbana. Sao 585 imagens divididas em 468 de treino, 87 de validacao e 30 de teste.
O ponto critico esta na faixa inferior, e vou retomar isso na discussao dos resultados: no DRNPW, 335 das 468 imagens de treino pertencem a uma unica categoria e varias classes tem um ou dois exemplos. Esse desbalanceamento limita o que qualquer arquitetura consegue aprender.`);
}

// ===========================================================================
// SLIDE 14 - Protocolo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Protocolo experimental", "Uma variável por vez");

  card(s, M, 1.42, 3.5, 3.05);
  s.addText("CNN de referência", {
    x: M + 0.25, y: 1.6, w: 3.0, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13, bold: true, color: C.teal,
  });
  bullets(s, [
    "Duas camadas convolucionais, 32 filtros 3 × 3, ativação ReLU",
    "Max-pooling com janelas 4 × 4",
    "Flatten, densa de 8 unidades e saída softmax",
    "Adam, entropia cruzada categórica esparsa",
    "50 épocas, entrada de 512 × 512 pixels",
    "Data augmentation em tempo de treino",
  ], { x: M + 0.26, y: 1.98, w: 3.0, h: 2.35, size: 10.5, gap: 5 });

  card(s, M + 3.8, 1.42, 5.1, 3.05, { flat: true });
  s.addText("14 técnicas de pré-processamento avaliadas", {
    x: M + 4.05, y: 1.6, w: 4.6, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13, bold: true, color: C.ink,
  });

  const simples = ["Adaptive Threshold", "CLAHE", "Contrast Enhancement", "Denoise (NL-Means)",
    "Edge Detection", "Equalize Histogram", "Gaussian Blur", "Gray Scale", "Median Blur", "Original Image"];
  const hibridas = ["CLAHE + Contrast Enh.", "Contrast Enh. + CLAHE", "Contrast Enh. + Eq. Hist.", "Eq. Hist. + Contrast Enh."];

  s.addText("Simples (10)", {
    x: M + 4.05, y: 1.96, w: 2.2, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, color: C.teal,
  });
  bullets(s, simples, { x: M + 4.06, y: 2.24, w: 2.3, h: 2.1, size: 9.5, gap: 2 });

  s.addText("Híbridas (4)", {
    x: M + 6.45, y: 1.96, w: 2.2, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, color: C.amber,
  });
  bullets(s, hibridas, { x: M + 6.46, y: 2.24, w: 2.25, h: 1.2, size: 9.5, gap: 2 });
  s.addText("A ordem de aplicação importa: as duas combinações de realce e CLAHE aparecem nas duas ordens possíveis.", {
    x: M + 6.46, y: 3.5, w: 2.25, h: 0.85, margin: 0,
    fontFace: F.body, fontSize: 9.5, italic: true, color: C.muted, lineSpacingMultiple: 1.05,
  });

  s.addText("14 técnicas × 2 datasets × 2 arquiteturas, tudo o mais mantido constante. A única variável entre execuções é o tratamento aplicado à imagem de entrada.", {
    x: M, y: 4.62, w: 8.9, h: 0.42, margin: 0,
    fontFace: F.body, fontSize: 12.5, bold: true, color: C.teal,
  });

  footer(s, "Materiais e protocolo");
  s.addNotes(
`[12:45 - 14:00 | 75s] PROTOCOLO
A CNN de referencia foi mantida deliberadamente simples: duas camadas convolucionais de 32 filtros, max-pooling, uma densa de 8 unidades e saida softmax. Otimizador Adam, entropia cruzada esparsa, 50 epocas, entrada de 512 por 512 e data augmentation em tempo de treino.
Essa simplicidade e proposital. Um modelo enxuto e estavel entre execucoes e permite atribuir a variacao observada ao pre-processamento, e nao ao modelo.
Foram avaliadas 14 tecnicas, dez simples e quatro hibridas. Nas hibridas a ordem de aplicacao foi tratada como variavel: realce seguido de CLAHE e CLAHE seguido de realce sao duas entradas distintas, porque as operacoes nao comutam.
No total, 14 tecnicas por dois conjuntos por duas arquiteturas, com todo o resto constante.`);
}

// ===========================================================================
// SLIDE 15 - Metricas e piso majoritario
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Como ler os resultados", "Por que a acurácia sozinha engana");

  card(s, M, 1.45, 5.35, 1.95, { flat: true });
  s.addText("Piso majoritário", {
    x: M + 0.28, y: 1.62, w: 3.0, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13, bold: true, color: C.ink,
  });
  s.addText("Acurácia obtida ao responder sempre a classe mais frequente do conjunto de teste, sem olhar a imagem. Todo resultado abaixo desse valor indica que o modelo não extraiu informação útil das imagens.", {
    x: M + 0.28, y: 1.94, w: 4.85, h: 1.3, margin: 0,
    fontFace: F.body, fontSize: 11.5, color: C.ink, lineSpacingMultiple: 1.1,
  });

  stat(s, M + 5.75, 1.5, 1.5, "74,42%", "Piso do CPLID\n32 de 43 imagens", { size: 26, labelH: 0.6 });
  stat(s, M + 7.45, 1.5, 1.5, "73,33%", "Piso do DRNPW\n22 de 30 imagens", { size: 26, color: C.amber, labelH: 0.6 });

  card(s, M, 3.6, 8.9, 1.5, { fill: C.night, line: C.night });
  const notas = [
    ["Métricas", "Acurácia e F1-score, ambos com média ponderada pelo suporte de cada classe"],
    ["Consequência", "Sob essa definição, o recall ponderado é numericamente igual à acurácia"],
    ["Granularidade", "No DRNPW cada imagem de teste vale 3,33 pontos percentuais de acurácia"],
  ];
  notas.forEach((n, i) => {
    const x = M + 0.3 + i * 2.85;
    s.addText(n[0], {
      x, y: 3.78, w: 2.6, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 11, bold: true, color: C.amber,
    });
    s.addText(n[1], {
      x, y: 4.06, w: 2.6, h: 0.85, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.white, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Materiais e protocolo");
  s.addNotes(
`[14:00 - 15:00 | 60s] COMO LER OS RESULTADOS
Antes dos numeros, preciso fixar o criterio de leitura, porque os dois conjuntos de teste sao desbalanceados.
O piso majoritario e a acuracia que se obtem respondendo sempre a classe mais frequente, sem olhar a imagem. No CPLID, 32 das 43 imagens de teste sao de isoladores normais, o que da um piso de 74,42 por cento. No DRNPW, 22 das 30 imagens sao de uma unica categoria, piso de 73,33 por cento.
Qualquer resultado abaixo desses valores significa que o modelo nao extraiu informacao util da imagem.
Duas observacoes tecnicas: as metricas usam media ponderada pelo suporte, razao pela qual o recall coincide numericamente com a acuracia nas tabelas, e no DRNPW cada imagem de teste vale 3,33 pontos percentuais, o que exige cautela ao comparar tecnicas vizinhas.
DICA: este slide protege o restante da apresentacao de questionamento da banca. Nao pular.`);
}

// ===========================================================================
// SLIDE 16 - Resultados CPLID
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · CPLID", "O contraste lidera, o desfoque derruba");

  slideFigura(s, figura("CNN", "CPLID"),
    "Acurácia da CNN por técnica de pré-processamento, em ordem crescente. Acima de cada barra, a imagem resultante do tratamento correspondente.",
    [
      ["95,35%", "MELHOR", "Contrast Enhancement, CLAHE + realce e realce + equalização empatam. O maior F1-score, 96,55%, ficou com o realce simples.", "teal"],
      ["67,44%", "PIOR", "Gaussian Blur, Denoise e Adaptive Threshold, abaixo da imagem original (93,02%) e do piso majoritário (74,42%).", "dark"],
      ["84,55%", "MÉDIA DAS 14", "Dez das 14 técnicas ficaram acima do piso majoritário de 74,42% neste conjunto.", "teal"],
    ]);

  footer(s, "Resultados");
  s.addNotes(
`[15:00 - 17:00 | 120s] RESULTADOS CPLID
Este e o primeiro resultado central. O grafico traz a acuracia da CNN nas 14 tecnicas do CPLID, em ordem crescente.
No topo, tres tecnicas empatam em 95,35 por cento, e as tres tem o mesmo denominador comum, a ampliacao do contraste: o realce simples, a combinacao de CLAHE com realce e a combinacao de realce com equalizacao de histograma. O realce simples registrou tambem o maior F1-score do conjunto, 96,55 por cento.
Na base do grafico, tres tecnicas ficam em 67,44 por cento: Gaussian Blur, Denoise e Adaptive Threshold. Duas observacoes sobre esse valor. Primeiro, ele esta abaixo da imagem original sem tratamento, que alcancou 93,02 por cento, ou seja, o processamento piorou o dado. Segundo, esta abaixo do piso majoritario de 74,42 por cento, o que significa que esses modelos nao aprenderam a distinguir as classes.
A leitura fisica e coerente com o defeito: no CPLID a assinatura da falha e estrutural, a ausencia de disco ou a fratura, e ampliar o intervalo tonal realca essa borda. Ja suavizar a imagem apaga exatamente a evidencia que se quer detectar.
A media das 14 tecnicas foi 84,55 por cento, com 10 delas acima do piso.
DICA: nao ler as 14 barras. Use as miniaturas acima das barras, elas mostram o efeito visual de cada tratamento. Aponte o Gaussian Blur na esquerda, o Original Image no meio e o realce de contraste na direita.`);
}

// ===========================================================================
// SLIDE 17 - Resultados DRNPW
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados · DRNPW", "Ganho menor e mais difícil de sustentar");

  slideFigura(s, figura("CNN", "DRNPW"),
    "Acurácia da CNN por técnica de pré-processamento no conjunto de inspeção por drone, em ordem crescente.",
    [
      ["83,33%", "MELHOR", "Contrast Enhancement seguido de Equalize Histogram, com F1-score de 75,76%, ante 63,33% e 49,12% da imagem original.", "amber"],
      ["63,33%", "PIORES", "Gray Scale, Contrast Enhancement isolado e Original Image empatam. Suprimir a cor descarta o que separa o componente do fundo.", "dark"],
      ["Ressalva", "LEITURA", "A vantagem sobre o piso de 73,33% equivale a três imagens de teste, e 6 das 14 técnicas ficaram no piso ou abaixo dele.", "amber"],
    ]);

  footer(s, "Resultados");
  s.addNotes(
`[17:00 - 18:45 | 105s] RESULTADOS DRNPW
No DRNPW o quadro muda. O melhor resultado foi 83,33 por cento de acuracia e 75,76 de F1-score, com realce de contraste seguido de equalizacao de histograma, contra 63,33 e 49,12 da imagem original. A leitura e coerente: quando o fundo e poluido, reforcar o contraste entre o componente e o ambiente ajuda.
Mas faco questao de apresentar a ressalva, que esta na dissertacao. Essa vantagem corresponde a dez pontos percentuais sobre o piso de 73,33, o que em um conjunto de 30 imagens equivale a apenas tres acertos a mais. E seis das 14 tecnicas ficaram no piso ou abaixo dele. Portanto o resultado indica uma direcao, mas nao sustenta afirmacao forte.
Um resultado que vale destacar e o do Gray Scale, entre os piores, com 63,33 por cento. Suprimir a informacao de cor descarta justamente o que ajuda a separar o isolador da vegetacao ao fundo.
DICA: se o tempo estiver apertado, esta e a ressalva a manter e o resto a resumir.`);
}

// ===========================================================================
// SLIDE 18 - Simples vs hibridas
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Resultados", "Combinar técnicas compensa, mas não sempre");

  s.addChart(pres.ChartType.bar, [
    { name: "Técnicas simples", labels: ["CPLID", "DRNPW"], values: [81.28, 72.33] },
    { name: "Técnicas híbridas", labels: ["CPLID", "DRNPW"], values: [94.19, 77.50] },
  ], {
    x: 0.3, y: 1.4, w: 5.2, h: 3.0,
    barDir: "col", barGrouping: "clustered", barGapWidthPct: 60,
    chartColors: [C.mutedLight, C.teal],
    valAxisMinVal: 50, valAxisMaxVal: 100,
    dataLabelFormatCode: '0.00"%"',
    showLegend: true, legendPos: "b", legendColor: C.muted, legendFontFace: F.body, legendFontSize: 9,
    showTitle: false,
    catAxisLabelColor: C.ink, catAxisLabelFontFace: F.body, catAxisLabelFontSize: 11,
    valAxisLabelColor: C.muted, valAxisLabelFontFace: F.body, valAxisLabelFontSize: 9,
    valGridLine: { color: C.grid, size: 0.75 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: C.ink, dataLabelFontFace: F.body,
    dataLabelFontSize: 9, dataLabelPosition: "outEnd",
  });

  s.addText("Acurácia média por grupo de técnicas, CNN", {
    x: 0.3, y: 1.16, w: 5.2, h: 0.24, margin: 0,
    fontFace: F.body, fontSize: 10, italic: true, color: C.muted,
  });

  stat(s, 5.9, 1.5, 1.7, "+13,49", "pontos percentuais\na favor das híbridas\nno CPLID", { size: 30, labelH: 0.75 });
  stat(s, 7.7, 1.5, 1.7, "+5,17", "pontos percentuais\na favor das híbridas\nno DRNPW", { size: 30, color: C.amber, labelH: 0.75 });

  card(s, 5.9, 2.95, 3.55, 1.95, { fill: C.night, line: C.night });
  s.addText("Leitura", {
    x: 6.12, y: 3.1, w: 3.1, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 1, color: C.amber,
  });
  bullets(s, [
    "A vantagem das híbridas é real nos dois conjuntos, porém desigual",
    "A ordem de aplicação altera o resultado, as operações não comutam",
    "Nenhuma técnica foi superior em todo cenário avaliado",
  ], { x: 6.12, y: 3.4, w: 3.15, h: 1.42, size: 10.5, color: C.white, gap: 6 });

  footer(s, "Resultados");
  s.addNotes(
`[18:45 - 19:45 | 60s] SIMPLES CONTRA HIBRIDAS
Agrupando as 14 tecnicas em simples e hibridas, a diferenca fica evidente. No CPLID as combinacoes superaram as tecnicas isoladas em 13,49 pontos percentuais na media. No DRNPW a vantagem tambem existe, mas cai para 5,17 pontos.
Tres leituras. A vantagem das hibridas e real nos dois conjuntos, porem desigual, o que ja indica dependencia do dado. A ordem de aplicacao altera o resultado, porque as operacoes nao comutam, e por isso avaliamos as duas ordens possiveis. E, principalmente, nenhuma tecnica foi superior em todo cenario avaliado.
Essa e a primeira resposta do trabalho: combinar compensa, mas nao existe combinacao universal.`);
}

// ===========================================================================
// SLIDE 19 - Grid search
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Otimização de parâmetros", "Busca em grade sobre o fator de contraste");

  s.addChart(pres.ChartType.line, [{
    name: "Acurácia",
    labels: ["0,500", "0,778", "1,056", "1,333", "1,611"],
    values: [76.7, 83.3, 80.0, 90.0, 83.3],
  }], {
    x: 0.3, y: 1.5, w: 5.3, h: 2.85,
    chartColors: [C.teal], lineDataSymbol: "circle", lineDataSymbolSize: 8, lineSize: 2.5,
    valAxisMinVal: 60, valAxisMaxVal: 100,
    dataLabelFormatCode: '0.0"%"',
    ...chartBase,
    dataLabelPosition: "t",
  });
  s.addText("Acurácia no conjunto de teste (30 imagens) por valor do fator", {
    x: 0.3, y: 1.26, w: 5.3, h: 0.24, margin: 0,
    fontFace: F.body, fontSize: 10, italic: true, color: C.muted,
  });

  card(s, 5.85, 1.42, 3.6, 1.5, { flat: true });
  s.addText("Melhor ponto", {
    x: 6.07, y: 1.55, w: 3.1, h: 0.24, margin: 0,
    fontFace: F.body, fontSize: 10, bold: true, charSpacing: 1, color: C.muted,
  });
  s.addText([
    { text: "factor = 1,333", options: { fontSize: 19, bold: true, color: C.teal, breakLine: true } },
    { text: "90,0% de acurácia, 81,0% de precisão e 85,3% de F1-score", options: { fontSize: 10.5, color: C.ink } },
  ], { x: 6.07, y: 1.8, w: 3.15, h: 1.0, margin: 0, fontFace: F.head, lineSpacingMultiple: 1.05 });

  card(s, 5.85, 3.05, 3.6, 1.85, { fill: C.night, line: C.night });
  s.addText("Ressalvas de leitura", {
    x: 6.07, y: 3.18, w: 3.1, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, color: C.amber,
  });
  bullets(s, [
    "Máximo estreito: 27 acertos contra 24 e 25 nos pontos vizinhos",
    "Treino de 5 épocas em 640 × 640, não comparável às varreduras anteriores",
    "A relação entre contraste e desempenho não é monotônica",
  ], { x: 6.07, y: 3.48, w: 3.15, h: 1.32, size: 10, color: C.white, gap: 5 });

  footer(s, "Resultados");
  s.addNotes(
`[19:45 - 21:00 | 75s] BUSCA EM GRADE
A etapa de ajuste automatico foi aplicada ao parametro do realce de contraste, o fator multiplicador. A busca em grade avaliou cinco valores entre 0,5 e 1,611 no DRNPW.
O melhor ponto foi 1,333, com 90 por cento de acuracia, 81 de precisao e 85,3 de F1-score. Um aumento moderado de contraste favorece a deteccao, o que e consistente com a varredura anterior.
Faco tres ressalvas, todas registradas na dissertacao. A primeira, esse maximo e estreito: 90 por cento correspondem a 27 acertos em 30 imagens, contra 24 e 25 nos pontos vizinhos da grade. Isso caracteriza um pico, nao um patamar estavel. A segunda, este treinamento usou 5 epocas em 640 por 640, entao o valor nao e diretamente comparavel aos 50 epocas em 512 por 512 das varreduras anteriores. A terceira, a relacao entre contraste e desempenho nao se mostrou monotonica, de modo que a hipotese de degradacao progressiva por excesso de contraste nao pode ser confirmada com esse numero de amostras.`);
}

// ===========================================================================
// SLIDE 20 - Random search
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Otimização de parâmetros", "Busca aleatória: convergência e cautela");

  // tabela
  const rows = [
    ["1", "1,4364", "85,06%", true],
    ["2", "2,8768", "79,31%", false],
    ["3", "2,3300", "71,26%", false],
    ["4", "1,9966", "80,46%", false],
    ["5", "0,8900", "78,16%", false],
  ];
  const x0 = M, y0 = 1.5;
  s.addText("Tentativa", { x: x0 + 0.12, y: y0, w: 1.0, h: 0.28, margin: 0, fontFace: F.body, fontSize: 10, bold: true, color: C.muted });
  s.addText("Fator", { x: x0 + 1.25, y: y0, w: 1.1, h: 0.28, margin: 0, fontFace: F.body, fontSize: 10, bold: true, color: C.muted });
  s.addText("Acurácia (validação)", { x: x0 + 2.45, y: y0, w: 2.0, h: 0.28, margin: 0, fontFace: F.body, fontSize: 10, bold: true, color: C.muted });

  rows.forEach((r, i) => {
    const y = y0 + 0.32 + i * 0.5;
    s.addShape(pres.ShapeType.roundRect, {
      x: x0, y, w: 4.5, h: 0.42, rectRadius: 0.05,
      fill: { color: r[3] ? C.teal : (i % 2 === 0 ? C.surface : C.white) },
      line: { color: r[3] ? C.teal : C.surfaceAlt, width: 0.75 },
    });
    const col = r[3] ? C.white : C.ink;
    s.addText(r[0], { x: x0 + 0.12, y: y + 0.06, w: 1.0, h: 0.3, margin: 0, fontFace: F.body, fontSize: 11.5, color: col });
    s.addText(r[1], { x: x0 + 1.25, y: y + 0.06, w: 1.1, h: 0.3, margin: 0, fontFace: F.body, fontSize: 11.5, bold: r[3], color: col });
    s.addText(r[2], { x: x0 + 2.45, y: y + 0.06, w: 2.0, h: 0.3, margin: 0, fontFace: F.body, fontSize: 11.5, bold: r[3], color: col });
  });

  card(s, 5.5, 1.42, 3.95, 1.62, { flat: true });
  s.addText("Convergência entre os métodos", {
    x: 5.72, y: 1.56, w: 3.5, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 11.5, bold: true, color: C.ink,
  });
  s.addText([
    { text: "1,333", options: { bold: true, color: C.teal } },
    { text: "  na busca em grade e  ", options: { color: C.muted } },
    { text: "1,4364", options: { bold: true, color: C.amber } },
    { text: "  na busca aleatória. Os dois métodos apontam para realce moderado, pouco acima de 1,0.", options: { color: C.ink } },
  ], { x: 5.72, y: 1.86, w: 3.5, h: 1.05, margin: 0, fontFace: F.body, fontSize: 11.5, lineSpacingMultiple: 1.1 });

  card(s, 5.5, 3.16, 3.95, 1.74, { fill: C.night, line: C.night });
  s.addText("Por que não afirmar convergência", {
    x: 5.72, y: 3.3, w: 3.5, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, color: C.amber,
  });
  bullets(s, [
    "As duas buscas foram avaliadas sobre conjuntos distintos, teste com 30 imagens e validação com 87",
    "Contrastes elevados degradaram o resultado, 71,26% no fator 2,33",
  ], { x: 5.72, y: 3.6, w: 3.5, h: 1.2, size: 10, color: C.white, gap: 6 });

  footer(s, "Resultados");
  s.addNotes(
`[21:00 - 22:00 | 60s] BUSCA ALEATORIA
Como complemento, repetimos o ajuste com busca aleatoria, cinco tentativas amostradas entre 0,5 e 3,0.
O melhor valor foi 1,4364, com 85,06 por cento de acuracia de validacao. Comparando com o 1,333 da busca em grade, os dois metodos apontam para a mesma regiao, realce moderado pouco acima de 1,0.
Registro, no entanto, por que nao afirmo convergencia em sentido forte: as duas buscas foram avaliadas sobre conjuntos diferentes, a grade sobre o teste de 30 imagens e a aleatoria sobre a validacao de 87. Sao numeros proximos, mas nao diretamente comparaveis.
O que se confirma nas duas buscas e o comportamento nas extremidades: contraste muito alto degrada, 71,26 por cento no fator 2,33, e contraste reduzido tambem nao ajuda.`);
}

// ===========================================================================
// SLIDE 21 - Por que um segundo modelo
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional", "Os efeitos são da imagem ou da arquitetura?");

  card(s, M, 1.45, 5.3, 1.5, { fill: C.surface });
  s.addText("Todas as varreduras anteriores usaram uma única arquitetura. Isso isola bem o pré-processamento, mas deixa em aberto se o efeito observado vem das características das imagens ou do modelo usado para medi-las.", {
    x: M + 0.28, y: 1.62, w: 4.8, h: 1.15, margin: 0,
    fontFace: F.body, fontSize: 12.5, color: C.ink, valign: "middle", lineSpacingMultiple: 1.1,
  });

  s.addText("Como a metodologia trata a modelagem como bloco substituível, basta trocar esse bloco e repetir a varredura.", {
    x: M, y: 3.08, w: 5.3, h: 0.62, margin: 0,
    fontFace: F.head, fontSize: 13.5, bold: true, color: C.teal, lineSpacingMultiple: 1.05,
  });

  bullets(s, [
    "Mesmos dois conjuntos de dados",
    "Mesmas 14 técnicas de pré-processamento",
    "Mesmo número de épocas de treinamento",
    "Única variável alterada: a arquitetura",
  ], { x: M + 0.02, y: 3.82, w: 5.2, h: 1.2, size: 11.5, gap: 4 });

  card(s, 6.15, 1.45, 3.3, 3.45, { fill: C.night, line: C.night });
  s.addText("YOLOv8n-cls", {
    x: 6.4, y: 1.62, w: 2.9, h: 0.36, margin: 0,
    fontFace: F.head, fontSize: 18, bold: true, color: C.white,
  });
  s.addText("Variante de classificação da família YOLO", {
    x: 6.4, y: 1.98, w: 2.9, h: 0.5, margin: 0,
    fontFace: F.body, fontSize: 10.5, italic: true, color: C.mutedLight, lineSpacingMultiple: 1.05,
  });
  const cfg = [
    ["Pesos iniciais", "COCO (pré-treinado)"],
    ["Parâmetros treináveis", "1.437.442"],
    ["Resolução de entrada", "224 × 224"],
    ["Lote e taxa inicial", "16 e 0,01"],
    ["Épocas", "50"],
    ["Treinamentos completos", "28"],
  ];
  cfg.forEach((c, i) => {
    const y = 2.5 + i * 0.38;
    s.addText(c[0], {
      x: 6.4, y, w: 1.75, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 10, color: C.mutedLight,
    });
    s.addText(c[1], {
      x: 8.1, y, w: 1.2, h: 0.3, margin: 0, align: "right",
      fontFace: F.body, fontSize: 10, bold: true, color: i === 5 ? C.amber : C.white,
    });
  });

  footer(s, "Resultados");
  s.addNotes(
`[22:00 - 22:45 | 45s] POR QUE UM SEGUNDO MODELO
Uma objecao legitima a tudo o que apresentei ate aqui e a seguinte: os efeitos observados vem das caracteristicas das imagens ou da arquitetura que usei para medi-las?
Como a metodologia trata a modelagem como bloco substituivel, essa pergunta pode ser respondida trocando apenas esse bloco e repetindo a varredura. Foi o que fizemos com o YOLOv8n-cls, a variante de classificacao da familia YOLO, partindo de pesos pre-treinados no COCO.
Mantivemos os mesmos dois conjuntos, as mesmas 14 tecnicas e o mesmo numero de epocas. A unica variavel alterada e a arquitetura. Sao 28 treinamentos completos.
DICA: enfatizar que este experimento e um teste da propria metodologia, nao apenas mais um resultado.`);
}

// ===========================================================================
// SLIDE 22 - Resultados YOLO
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional", "Mais capacidade, menos desempenho");

  s.addChart(pres.ChartType.bar, [
    { name: "CNN", labels: ["CPLID", "DRNPW"], values: [84.55, 73.81] },
    { name: "YOLOv8n-cls", labels: ["CPLID", "DRNPW"], values: [66.28, 71.43] },
    { name: "Piso majoritário", labels: ["CPLID", "DRNPW"], values: [74.42, 73.33] },
  ], {
    x: 0.3, y: 1.42, w: 5.35, h: 3.1,
    barDir: "col", barGrouping: "clustered", barGapWidthPct: 55,
    chartColors: [C.teal, C.amber, C.mutedLight],
    valAxisMinVal: 50, valAxisMaxVal: 95,
    dataLabelFormatCode: '0.00"%"',
    showLegend: true, legendPos: "b", legendColor: C.muted, legendFontFace: F.body, legendFontSize: 9,
    showTitle: false,
    catAxisLabelColor: C.ink, catAxisLabelFontFace: F.body, catAxisLabelFontSize: 11,
    valAxisLabelColor: C.muted, valAxisLabelFontFace: F.body, valAxisLabelFontSize: 9,
    valGridLine: { color: C.grid, size: 0.75 }, catGridLine: { style: "none" },
    showValue: true, dataLabelColor: C.ink, dataLabelFontFace: F.body,
    dataLabelFontSize: 8.5, dataLabelPosition: "outEnd",
  });
  s.addText("Acurácia média nas 14 técnicas", {
    x: 0.3, y: 1.2, w: 5.35, h: 0.22, margin: 0,
    fontFace: F.body, fontSize: 10, italic: true, color: C.muted,
  });

  const obs = [
    ["CPLID", "A CNN superou o piso em 10 das 14 técnicas. O YOLOv8n-cls superou em apenas 1 de 14, com média 18,27 pontos abaixo da CNN.", C.teal],
    ["DRNPW", "As duas arquiteturas ficaram na vizinhança imediata do piso, com diferença média de 2,38 pontos, menos de uma imagem por combinação.", C.amber],
    ["Diagnóstico", "O limite é de dados, não de arquitetura. Em regime de poucas amostras e forte desbalanceamento, mais capacidade não compensa.", C.ink],
  ];
  obs.forEach((o, i) => {
    const y = 1.42 + i * 1.15;
    card(s, 5.95, y, 3.5, 1.02, { flat: true });
    s.addText(o[0], {
      x: 6.15, y: y + 0.1, w: 3.1, h: 0.24, margin: 0,
      fontFace: F.body, fontSize: 11, bold: true, color: o[2],
    });
    s.addText(o[1], {
      x: 6.15, y: y + 0.34, w: 3.12, h: 0.62, margin: 0,
      fontFace: F.body, fontSize: 9.5, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Resultados");
  s.addNotes(
`[22:45 - 23:45 | 60s] RESULTADOS DO EXPERIMENTO ADICIONAL
O grafico compara a acuracia media das 14 tecnicas nas duas arquiteturas, com o piso majoritario como referencia.
No CPLID a diferenca e expressiva: 84,55 por cento da CNN contra 66,28 do YOLOv8n-cls. Mais do que a media, o dado relevante e a contagem: a CNN superou o piso em 10 das 14 tecnicas, o YOLO em apenas 1 de 14.
No DRNPW as duas arquiteturas ficam coladas no piso, com diferenca media de 2,38 pontos, menos de uma imagem por combinacao.
O diagnostico e o mesmo nos dois casos: o fator limitante e o volume e o balanceamento dos dados, nao a capacidade do modelo. Uma arquitetura pre-treinada de mais de um milhao de parametros, em regime de poucas amostras, tende a convergir para solucoes degeneradas.
DICA: este slide da o resumo, os dois seguintes trazem a varredura completa. Nao detalhar aqui.`);
}

// ===========================================================================
// SLIDE 23 - Varredura do YOLOv8n-cls no CPLID
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional · CPLID", "A varredura completa com o YOLOv8n-cls");

  slideFigura(s, figura("YOLOCLS", "CPLID"),
    "Acurácia do YOLOv8n-cls por técnica de pré-processamento, em ordem crescente. Mesmo conjunto, mesmas técnicas e mesmas épocas da varredura com a CNN.",
    [
      ["81,40%", "MELHOR", "Gray Scale, que para a CNN era a quinta pior técnica deste conjunto, com 76,74%.", "teal"],
      ["51,16%", "PIOR", "CLAHE + Contrast Enhancement, justamente uma das três que empatavam no topo com a CNN, em 95,35%.", "dark"],
      ["1 de 14", "ACIMA DO PISO", "Média de 66,28%, abaixo do piso majoritário de 74,42%, contra 10 de 14 da CNN.", "teal"],
    ]);

  footer(s, "Resultados");
  s.addNotes(
`[23:45 - 24:30 | 45s] VARREDURA DO YOLO NO CPLID
Esta e a varredura completa do YOLOv8n-cls no CPLID, no mesmo formato do grafico que mostrei para a CNN.
Duas leituras. A primeira, de nivel: quase todas as barras estao abaixo do piso majoritario de 74,42 por cento, apenas uma tecnica o supera.
A segunda, de ordem, e a que interessa metodologicamente: compare com o grafico da CNN. O Gray Scale, que la aparecia na quinta pior posicao, aqui lidera com 81,40 por cento. E a combinacao de CLAHE com realce de contraste, que la empatava no topo com 95,35, aqui e a pior, com 51,16.
DICA: se possivel, volte um slide para comparar as duas ordens lado a lado antes de seguir.`);
}

// ===========================================================================
// SLIDE 24 - Varredura do YOLOv8n-cls no DRNPW
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Experimento adicional · DRNPW", "A inversão se repete no segundo conjunto");

  slideFigura(s, figura("YOLOCLS", "DRNPW"),
    "Acurácia do YOLOv8n-cls por técnica de pré-processamento no conjunto de inspeção por drone, em ordem crescente.",
    [
      ["83,33%", "MELHOR", "Adaptive Threshold, que com a CNN ficava exatamente no piso majoritário, em 73,33%.", "amber"],
      ["53,33%", "PIOR", "Contrast Enhancement + Equalize Histogram, a melhor técnica da CNN neste mesmo conjunto.", "dark"],
      ["5 de 14", "ACIMA DO PISO", "Média de 71,43%, ainda 1,91 ponto abaixo do piso majoritário de 73,33%.", "amber"],
    ]);

  footer(s, "Resultados");
  s.addNotes(
`[24:30 - 25:15 | 45s] VARREDURA DO YOLO NO DRNPW
No DRNPW o padrao se repete, e de forma ainda mais acentuada.
O melhor resultado, 83,33 por cento com Adaptive Threshold, iguala numericamente o melhor da CNN neste conjunto, mas com uma tecnica completamente diferente. O Adaptive Threshold ficava exatamente no piso quando avaliado com a CNN.
E a combinacao de realce de contraste com equalizacao de histograma, que era a melhor tecnica da CNN aqui, despenca para 53,33 por cento, a pior de todas.
Convem lembrar a granularidade: cada imagem de teste vale 3,33 pontos percentuais, entao diferencas entre tecnicas vizinhas correspondem a um unico acerto. O que sustenta a leitura nao e a diferenca entre vizinhas, e a reversao das extremidades.`);
}

// ===========================================================================
// SLIDE 25 - Inversao da ordem de merito
// ===========================================================================
{
  const s = darkSlide();
  title(s, "Achado principal", "A melhor técnica muda quando o modelo muda", { dark: true });

  const casos = [
    ["CLAHE + Contrast Enh.", "CPLID", 95.35, 51.16],
    ["Contrast Enh. + Eq. Hist.", "DRNPW", 83.33, 53.33],
    ["Gray Scale", "CPLID", 76.74, 81.40],
  ];
  casos.forEach((c, i) => {
    const y = 1.5 + i * 0.98;
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y, w: 5.55, h: 0.84, rectRadius: 0.07,
      fill: { color: C.nightSoft }, line: { color: C.nightSoft, width: 0 },
    });
    s.addText(c[0], {
      x: M + 0.25, y: y + 0.12, w: 2.5, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 11.5, bold: true, color: C.white,
    });
    s.addText(c[1], {
      x: M + 0.25, y: y + 0.42, w: 2.5, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 9.5, color: C.mutedLight,
    });
    s.addText([
      { text: "CNN  ", options: { fontSize: 9.5, color: C.mutedLight } },
      { text: c[2].toFixed(2).replace(".", ",") + "%", options: { fontSize: 15, bold: true, color: "5BB4D6" } },
    ], { x: M + 2.85, y: y + 0.22, w: 1.25, h: 0.42, margin: 0, fontFace: F.body, valign: "middle" });
    s.addText("→", {
      x: M + 4.1, y: y + 0.22, w: 0.35, h: 0.42, margin: 0, align: "center", valign: "middle",
      fontFace: F.body, fontSize: 14, color: C.mutedLight,
    });
    s.addText([
      { text: "YOLO  ", options: { fontSize: 9.5, color: C.mutedLight } },
      { text: c[3].toFixed(2).replace(".", ",") + "%", options: { fontSize: 15, bold: true, color: C.amber } },
    ], { x: M + 4.45, y: y + 0.22, w: 1.3, h: 0.42, margin: 0, fontFace: F.body, valign: "middle" });
  });

  s.addText("Híbridas contra simples, diferença média de acurácia", {
    x: 6.4, y: 1.5, w: 3.05, h: 0.5, margin: 0,
    fontFace: F.body, fontSize: 10.5, bold: true, color: C.mutedLight, lineSpacingMultiple: 1.05,
  });
  const deltas = [["CNN, CPLID", "+13,49"], ["CNN, DRNPW", "+5,17"], ["YOLO, CPLID", "−2,44"], ["YOLO, DRNPW", "−3,16"]];
  deltas.forEach((d, i) => {
    const y = 2.05 + i * 0.42;
    s.addText(d[0], {
      x: 6.4, y, w: 1.9, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.white, valign: "middle",
    });
    s.addText(d[1] + " pp", {
      x: 8.25, y, w: 1.2, h: 0.32, margin: 0, align: "right", valign: "middle",
      fontFace: F.body, fontSize: 11.5, bold: true, color: i < 2 ? "5BB4D6" : C.amber,
    });
  });

  s.addText("O sinal se inverte: o que favorece a rede treinada do zero prejudica o modelo partido de pesos pré-treinados no COCO, cujos filtros esperam estatísticas de fotografia natural.", {
    x: M, y: 4.5, w: 8.9, h: 0.62, margin: 0,
    fontFace: F.head, fontSize: 13, bold: true, color: C.amber, lineSpacingMultiple: 1.05,
  });

  footer(s, "Resultados", true);
  s.addNotes(
`[25:15 - 26:30 | 75s] ACHADO PRINCIPAL
Este e, na minha avaliacao, o resultado de maior valor metodologico do trabalho.
Os dois graficos anteriores mostraram a inversao caso a caso. Este slide consolida os tres exemplos mais claros: CLAHE com realce de contraste, de 95,35 para 51,16 por cento, realce com equalizacao no DRNPW, de 83,33 para 53,33, e o Gray Scale, que faz o caminho inverso, de 76,74 para 81,40.
O padrao aparece tambem nas medias por grupo. Para a CNN, as hibridas superam as simples nos dois conjuntos. Para o YOLO, o sinal se inverte nos dois.
Ha uma explicacao plausivel: o YOLOv8n-cls parte de pesos pre-treinados no COCO, cujas estatisticas de cor e contraste sao as de fotografias naturais. Transformacoes que afastam a imagem dessa distribuicao degradam a utilidade dos filtros ja aprendidos. A CNN, treinada a partir de pesos aleatorios, ajusta seus filtros a distribuicao que efetivamente recebe.
A consequencia pratica e direta: a selecao do pre-processamento nao e independente do modelo, e precisa ser refeita a cada troca de arquitetura.`);
}

// ===========================================================================
// SLIDE 26 - Conclusoes
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Conclusões", "O que os resultados sustentam");

  const cs = [
    ["1", "O pré-processamento é determinante", "Ele altera o desempenho na mesma escala que a troca de arquitetura, e chega a derrubar o modelo abaixo do piso majoritário."],
    ["2", "Não existe técnica universalmente superior", "A eficácia depende das características do conjunto de dados, da natureza do defeito e da arquitetura adotada."],
    ["3", "A seleção precisa ser refeita a cada mudança", "Trocar o modelo ou o dataset inverte a ordem de mérito das técnicas, o que exige reexecução controlada do fluxo."],
  ];
  cs.forEach((c, i) => {
    const y = 1.42 + i * 1.14;
    card(s, M, y, 8.9, 1.0, { flat: true });
    bubble(s, M + 0.22, y + 0.26, 0.48, c[0], { fill: i === 2 ? C.amber : C.teal, color: i === 2 ? C.night : C.white });
    s.addText(c[1], {
      x: M + 0.85, y: y + 0.13, w: 7.8, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 13.5, bold: true, color: C.ink,
    });
    s.addText(c[2], {
      x: M + 0.85, y: y + 0.45, w: 7.85, h: 0.48, margin: 0,
      fontFace: F.body, fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  s.addText("Tratar bem a imagem bruta é tão relevante quanto escolher a arquitetura da rede.", {
    x: M, y: 4.86, w: 8.9, h: 0.36, margin: 0, align: "center",
    fontFace: F.head, fontSize: 14.5, bold: true, color: C.teal,
  });

  footer(s, "Conclusões");
  s.addNotes(
`[26:30 - 27:45 | 75s] CONCLUSOES
Tres conclusoes sustentadas pelos resultados.
Primeira, o pre-processamento e determinante. Ele altera o desempenho na mesma escala que a troca de arquitetura e, em varios casos, derrubou o modelo abaixo do piso majoritario. Processar mal e pior do que nao processar.
Segunda, nao existe tecnica universalmente superior. No CPLID, com fundo homogeneo e defeito estrutural, o realce de contraste lidera. No DRNPW, com poluicao visual, as combinacoes hibridas se saem melhor, e suprimir a cor esta entre os piores resultados. A eficacia depende do dado, do defeito e do modelo.
Terceira, e por isso mesmo, a selecao do pre-processamento precisa ser refeita a cada mudanca de arquitetura ou de conjunto de dados. E exatamente essa reexecucao controlada que a estrutura iterativa da metodologia viabiliza.
A sintese e a frase final: tratar bem a imagem bruta e tao relevante quanto escolher a arquitetura da rede.`);
}

// ===========================================================================
// SLIDE 27 - Limitacoes
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Limitações", "O que os resultados não permitem afirmar");

  const lims = [
    ["Escassez e desbalanceamento", "Poucos conjuntos públicos de redes de distribuição com falhas anotadas com rigor. No DRNPW, o desbalanceamento impediu as duas arquiteturas de superarem o piso."],
    ["Conjuntos de teste reduzidos", "Com 43 e 30 imagens de teste, uma imagem vale entre 2,3 e 3,3 pontos percentuais, o que limita a força das comparações entre técnicas vizinhas."],
    ["Custo computacional", "Otimizar todos os parâmetros do pipeline em conjunto leva à explosão combinatória, o que inviabiliza a avaliação exaustiva em tempo hábil."],
  ];
  lims.forEach((l, i) => {
    const x = M + i * 3.05;
    card(s, x, 1.5, 2.85, 2.55, { flat: true });
    bubble(s, x + 1.18, 1.72, 0.48, String(i + 1), { fill: C.night });
    s.addText(l[0], {
      x: x + 0.2, y: 2.32, w: 2.45, h: 0.5, margin: 0, align: "center",
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.teal,
    });
    s.addText(l[1], {
      x: x + 0.2, y: 2.85, w: 2.45, h: 1.05, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.08,
    });
  });

  s.addText("As métricas ponderadas usadas aqui não distinguem com clareza o modelo que aprendeu daquele que apenas replica a classe dominante. O piso majoritário foi adotado como salvaguarda de leitura.", {
    x: M, y: 4.3, w: 8.9, h: 0.6, margin: 0,
    fontFace: F.body, fontSize: 12, italic: true, color: C.muted, lineSpacingMultiple: 1.08,
  });

  footer(s, "Conclusões");
  s.addNotes(
`[27:45 - 28:30 | 45s] LIMITACOES
Tres limitacoes que delimitam o alcance do que apresentei.
A primeira e a escassez de dados. Ha poucos conjuntos publicos de redes de distribuicao com falhas anotadas com rigor, e o que existe e fortemente desbalanceado. No DRNPW isso impediu as duas arquiteturas de superarem o piso.
A segunda decorre da primeira: com 43 e 30 imagens de teste, cada imagem vale entre 2,3 e 3,3 pontos percentuais, o que enfraquece qualquer comparacao entre tecnicas vizinhas.
A terceira e o custo computacional. Otimizar todos os parametros do pipeline simultaneamente leva a explosao combinatoria, e por isso a otimizacao neste trabalho ficou restrita a um parametro.
Registro ainda que as metricas ponderadas nao distinguem bem o modelo que aprendeu daquele que replica a classe dominante, razao pela qual adotei o piso majoritario como salvaguarda de leitura.`);
}

// ===========================================================================
// SLIDE 28 - Trabalhos futuros
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Trabalhos futuros", "Encaminhamentos a partir das limitações");

  const fut = [
    ["Otimização bayesiana", "Explorar múltiplos parâmetros do pipeline ao mesmo tempo, reduzindo o efeito da explosão combinatória"],
    ["Aumento de dados com GANs", "Gerar exemplos sintéticos da classe minoritária para equilibrar os conjuntos de treinamento"],
    ["Arquiteturas de detecção", "Estender o método da classificação para a localização espacial das falhas em campo"],
    ["Métricas robustas", "Adotar F1-score macro e acurácia balanceada, e ampliar os conjuntos de teste"],
    ["Execução em borda", "Medir o custo temporal do pipeline em dispositivos embarcados a bordo do drone"],
  ];
  fut.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5;
    const y = 1.42 + row * 1.12;
    const w = i === 4 ? 8.85 : 4.35;
    card(s, x, y, w, 0.98, { flat: true });
    bubble(s, x + 0.2, y + 0.25, 0.48, String(i + 1), { fill: i === 4 ? C.amber : C.teal, color: i === 4 ? C.night : C.white });
    s.addText(f[0], {
      x: x + 0.82, y: y + 0.12, w: w - 1.0, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.ink,
    });
    s.addText(f[1], {
      x: x + 0.82, y: y + 0.42, w: w - 1.0, h: 0.48, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Conclusões");
  s.addNotes(
`[28:30 - 29:15 | 45s] TRABALHOS FUTUROS
Cinco encaminhamentos, todos derivados diretamente das limitacoes do slide anterior.
Substituir a busca em grade pela otimizacao bayesiana, que permite explorar varios parametros do pipeline ao mesmo tempo. Usar redes generativas adversariais para gerar exemplos sinteticos da classe minoritaria e atacar o desbalanceamento na origem. Estender o metodo, hoje de classificacao, para arquiteturas de deteccao, avaliando a localizacao espacial da falha, o que exige conjuntos anotados com caixas delimitadoras em volume adequado. Adotar F1-score macro e acuracia balanceada, que separam melhor o modelo que aprendeu daquele que replica a classe dominante. E, por fim, medir o custo temporal do pipeline em dispositivo embarcado, para viabilizar a inspecao dinamica a bordo do drone.`);
}

// ===========================================================================
// SLIDE 29 - Contribuicoes
// ===========================================================================
{
  const s = lightSlide();
  title(s, "Contribuição", "O que fica do trabalho");

  card(s, M, 1.45, 8.9, 1.15, { fill: C.night, line: C.night });
  s.addText("Uma metodologia estruturada, iterativa e modular para decidir qual tratamento aplicar às imagens antes da modelagem, e não apenas mais um resultado pontual sobre uma técnica específica.", {
    x: M + 0.32, y: 1.6, w: 8.26, h: 0.85, margin: 0,
    fontFace: F.head, fontSize: 14.5, bold: true, color: C.white, valign: "middle", lineSpacingMultiple: 1.08,
  });

  const contribs = [
    ["Procedimento", "Fluxo reprodutível de comparação, seleção, combinação e ajuste de técnicas"],
    ["Evidência empírica", "28 treinamentos completos em dois conjuntos, duas arquiteturas e 14 técnicas"],
    ["Critério de leitura", "Piso majoritário adotado como referência em conjuntos desbalanceados"],
    ["Alerta metodológico", "A escolha do pré-processamento não é independente do modelo adotado"],
  ];
  contribs.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 2.78 + row * 1.05;
    card(s, x, y, 4.35, 0.92, { flat: true });
    s.addText(c[0], {
      x: x + 0.25, y: y + 0.12, w: 3.9, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 12, bold: true, color: C.teal,
    });
    s.addText(c[1], {
      x: x + 0.25, y: y + 0.4, w: 3.9, h: 0.45, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Conclusões");
  s.addNotes(
`[29:15 - 29:45 | 30s] CONTRIBUICAO
Fechando: a contribuicao principal nao e um resultado pontual sobre uma tecnica especifica, e sim uma metodologia estruturada, iterativa e modular para decidir qual tratamento aplicar as imagens antes da modelagem.
Junto com ela ficam quatro entregas: o procedimento reprodutivel, a evidencia empirica de 28 treinamentos completos em dois conjuntos e duas arquiteturas, o criterio de leitura por piso majoritario para conjuntos desbalanceados e o alerta metodologico de que a escolha do pre-processamento nao e independente do modelo.`);
}

// ===========================================================================
// SLIDE 30 - Encerramento
// ===========================================================================
{
  const s = darkSlide();
  s.addShape(pres.ShapeType.ellipse, {
    x: 7.4, y: -1.1, w: 3.8, h: 3.8, fill: { color: C.teal, transparency: 76 }, line: { width: 0 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 8.5, y: 3.5, w: 2.4, h: 2.4, fill: { color: C.tealDark, transparency: 55 }, line: { width: 0 },
  });

  s.addText("Obrigado pela atenção", {
    x: M, y: 1.75, w: 6.6, h: 0.72, margin: 0,
    fontFace: F.head, fontSize: 34, bold: true, color: C.white,
  });
  s.addText("Fico à disposição da banca para as arguições.", {
    x: M, y: 2.5, w: 6.6, h: 0.36, margin: 0,
    fontFace: F.body, fontSize: 14, color: C.mutedLight,
  });

  s.addText([
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, fontSize: 13, breakLine: true } },
    { text: "luan.w.silveira@gmail.com", options: { color: C.amber, fontSize: 12, breakLine: true } },
    { text: "PPGEE, Universidade Federal de Santa Maria", options: { color: C.mutedLight, fontSize: 11 } },
  ], { x: M, y: 3.3, w: 6.6, h: 1.0, margin: 0, fontFace: F.body, lineSpacingMultiple: 1.2 });

  footer(s, "Encerramento", true);
  s.addNotes(
`[29:45 - 30:00 | 15s] ENCERRAMENTO
Encerro por aqui e agradeco a atencao da banca. Fico a disposicao para as arguicoes.

SLIDES DE APOIO PARA PERGUNTAS FREQUENTES:
1) Por que uma CNN tao simples? Porque ela e instrumento de medida. Um modelo estavel entre execucoes permite atribuir a variacao ao pre-processamento.
2) Por que nao usar YOLO de deteccao? Os dois conjuntos possuem exatamente uma anotacao por imagem, o que os caracteriza como problemas de classificacao. A deteccao exigiria anotacao com caixas em volume adequado.
3) O melhor resultado do DRNPW e significativo? Nao em sentido estatistico forte. Sao tres imagens acima do piso em um conjunto de 30. Indica direcao, nao comprova superioridade.
4) Por que o F1-score e a acuracia divergem tanto? Porque os conjuntos sao desbalanceados. A acuracia sozinha e otimista, e por isso o piso majoritario foi adotado como referencia.
5) A convergencia entre grid e random search prova o valor otimo? Nao. As duas buscas foram avaliadas sobre conjuntos distintos, de 30 e 87 imagens.`);
}

// ---------------------------------------------------------------------------
pres.writeFile({ fileName: process.argv[2] || "defesa.pptx" })
  .then(f => console.log("Gerado:", f));
