const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  bubble,
  foto,
} = require("../comum");

// 2 - Roteiro
module.exports = () => {
  const s = lightSlide();
  title(s, "Roteiro", "Do sistema elétrico de volta ao sistema elétrico");

  const itens = [
    ["1", "O problema elétrico", "Isoladores, falhas e inspeção", "roteiro_problema.jpg"],
    ["2", "A proposta", "Metodologia de processamento", "roteiro_proposta.jpg"],
    ["3", "Resultados", "Dois cenários, dois modelos", "roteiro_resultados.jpg"],
    ["4", "Impacto", "Vantagens para o sistema elétrico", "impacto.png"],
  ];
  itens.forEach((it, i) => {
    const x = M + i * 2.3, lado = 2.0;
    foto(s, it[3], x, 1.35, lado, lado, { borda: C.surfaceAlt, espessura: 0.75 });
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
};
