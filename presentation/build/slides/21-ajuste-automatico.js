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
  chartBase,
} = require("../comum");

// 21 - Ajuste automático
module.exports = () => {
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
Os dois métodos apontam para valores próximos, um pouco acima de 1.
O ganho metodológico é que o ajuste deixa de depender de otimização manual.`);
};
