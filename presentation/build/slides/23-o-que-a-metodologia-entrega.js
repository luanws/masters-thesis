const {
  C,
  F,
  M,
  darkSlide,
  title,
  footer,
  fala,
  card,
} = require("../comum");

// 23 - O que a metodologia entrega
module.exports = () => {
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
Primeiro, ganho de desempenho. No cenário de campo, a escolha do tratamento elevou de forma expressiva o F1-score em relação às imagens originais, com a mesma rede.
Segundo, proteção contra a escolha errada. No CPLID, o desfoque gaussiano derrubou a acurácia para bem abaixo da imagem original.
Terceiro, uma indicação sobre onde investir. Em regime de poucos dados, a arquitetura maior e pré-treinada não superou a rede convolucional simples, porque o aumento da capacidade do modelo não compensou as limitações do conjunto de dados.
E quarto, um procedimento. Como a melhor técnica muda com a arquitetura e com o conjunto de dados, a seleção precisa ser refeita a cada mudança, e a estrutura iterativa da metodologia viabiliza essa reexecução controlada.
Em síntese, o tratamento adequado das imagens brutas, ajustado a cada conjunto de dados e ao modelo adotado, é condição essencial para o bom desempenho.`);
};
