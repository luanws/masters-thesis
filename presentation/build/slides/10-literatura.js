const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
  bubble,
} = require("../comum");

// 10 - Literatura
module.exports = () => {
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
};
