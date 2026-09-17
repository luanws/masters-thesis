const {
  figura,
  asset,
  C,
  F,
  M,
  pres,
  lightSlide,
  title,
  footer,
  fala,
} = require("../comum");

// 3 - O isolador no SEP
module.exports = () => {
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
};
