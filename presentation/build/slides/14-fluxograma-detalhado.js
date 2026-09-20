const {
  C,
  F,
  pres,
  lightSlide,
  title,
  footer,
  fala,
  card,
  fluxo,
  figFluxo,
} = require("../comum");

// 14 - Fluxograma detalhado
module.exports = () => {
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
Cada etapa se desdobra em operações e decisões, que aparecem nesse fluxograma detalhado. Eu queria destacar os quatro pontos de decisão.
O primeiro verifica se o conjunto de dados está balanceado. Isso é bem relevante na detecção de falhas, porque costuma existir muito mais imagem de isolador saudável do que de isolador defeituoso.
O segundo decide se as técnicas vão ser usadas isoladas ou combinadas em um pipeline.
O terceiro define o tipo de tarefa, entre classificação, detecção e regressão.
E o quarto verifica se o desempenho atende aos critérios definidos. Se não atende, o bloco de ajuste de processamentos e modelo devolve o fluxo para as etapas anteriores.
Neste trabalho eu percorri os dois ramos do pré-processamento, o de técnicas isoladas e o de técnicas combinadas, com a tarefa de classificação e com o ajuste automático de parâmetros.
`);
};
