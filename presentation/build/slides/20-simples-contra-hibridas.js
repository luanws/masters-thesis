const {
  C,
  F,
  pres,
  lightSlide,
  title,
  footer,
  fala,
  card,
  foto,
  legenda,
  chartBase,
} = require("../comum");

// 20 - Simples contra híbridas
module.exports = () => {
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
No CPLID, a média de acurácia das híbridas ficou bem acima da média das simples, mais de treze pontos percentuais. No DRNPW a vantagem continua, mas é bem menor. E isso vale para a rede convolucional. Com o YOLOv8n-cls, como eu mostro daqui a pouco, o sinal se inverte nos dois conjuntos.
Esse resultado confirma a decisão da metodologia de avaliar também pipelines de técnicas combinadas, em que a saída de uma técnica vira a entrada da próxima. Um pipeline pode juntar, por exemplo, normalização, redução de ruído, ajuste de contraste e aumento de nitidez.
E tem um detalhe importante aqui. A ordem das operações importa, porque sequências diferentes dão resultados diferentes. Por isso eu avaliei as combinações nas duas ordens possíveis. CLAHE seguido de realce e realce seguido de CLAHE, e equalização seguida de realce e realce seguido de equalização.
`);
};
