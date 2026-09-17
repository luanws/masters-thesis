const {
  C,
  F,
  pres,
  lightSlide,
  title,
  footer,
  fala,
  card,
  legenda,
  pct,
  chartBase,
  CPLID_CNN,
  CPLID_YOLO,
  DRNPW_CNN,
  DRNPW_YOLO,
} = require("../comum");

// 22 - Troca de modelo
module.exports = () => {
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
};
