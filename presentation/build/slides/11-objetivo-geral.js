const {
  C,
  F,
  M,
  pres,
  darkSlide,
  title,
  footer,
  fala,
  card,
  foto,
} = require("../comum");

// 11 - Objetivo geral
module.exports = () => {
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
A partir dessa lacuna, o objetivo geral do trabalho é desenvolver uma metodologia capaz de comparar, selecionar, combinar e aprimorar técnicas de processamento de imagem para detectar e classificar falhas em cadeias de isoladores.
Esses quatro verbos organizam a proposta inteira.
Comparar as técnicas entre si, sob as mesmas condições.
Selecionar as mais adequadas para cada caso.
Combinar técnicas em sequência, formando pipelines.
E aprimorar os parâmetros de forma automática, sem depender de intervenção manual extensa.
Esse objetivo responde direto à lacuna que eu acabei de mostrar. Em vez de relatar só o que funcionou em um experimento, a ideia é entregar um método para determinar os processamentos mais eficientes e otimizar os parâmetros.
Com isso, escolher o tratamento das imagens passa a seguir um procedimento sistemático.
`);
};
