const {
  asset,
  C,
  F,
  W,
  H,
  M,
  contarSlide,
  darkSlide,
  fala,
} = require("../comum");

// 1 - Capa
module.exports = () => {
  const s = darkSlide();
  s.addImage({ data: asset("capa.jpg"), x: 0, y: 0, w: W, h: H });

  s.addText("Universidade Federal de Santa Maria", {
    x: M, y: 0.55, w: 5.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 12, color: C.amber, bold: true,
  });
  s.addText("Programa de Pós-Graduação em Engenharia Elétrica", {
    x: M, y: 0.81, w: 5.8, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 11, color: C.mutedLight,
  });

  s.addText("Método de aprimoramento de processamentos de imagens aplicados à detecção e classificação de falhas em cadeias de isoladores", {
    x: M, y: 1.4, w: 5.6, h: 1.95, margin: 0,
    fontFace: F.head, fontSize: 23, bold: true, color: C.white, lineSpacingMultiple: 1.05,
  });

  s.addText("Defesa de Dissertação de Mestrado", {
    x: M, y: 3.45, w: 5.6, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 12, italic: true, color: C.amberSoft,
  });

  s.addText([
    { text: "Mestrando: ", options: { color: C.mutedLight } },
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Orientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Daniel Pinheiro Bernardon", options: { bold: true, color: C.white, breakLine: true } },
    { text: "Coorientador: ", options: { color: C.mutedLight } },
    { text: "Prof. Dr. Paulo César Vargas Luz", options: { bold: true, color: C.white } },
  ], { x: M, y: 3.95, w: 5.8, h: 1.0, margin: 0, fontFace: F.body, fontSize: 12, lineSpacingMultiple: 1.15 });

  s.addText("Santa Maria, RS", {
    x: M, y: H - 0.45, w: 4, h: 0.25, margin: 0,
    fontFace: F.body, fontSize: 9.5, color: C.mutedLight,
  });
  contarSlide();

  fala(s, `
Bom dia a todos.
Meu nome é Luan Willig Silveira e eu vou apresentar hoje a minha dissertação de mestrado, que foi desenvolvida no Programa de Pós-Graduação em Engenharia Elétrica da Universidade Federal de Santa Maria, com orientação do professor Daniel Pinheiro Bernardon e coorientação do professor Paulo César Vargas Luz.
O título é esse que está no slide, Método de aprimoramento de processamentos de imagens aplicados à detecção e classificação de falhas em cadeias de isoladores. Na prática, o trabalho junta duas coisas, a manutenção das linhas do sistema elétrico e o uso de imagens e de redes neurais para inspecionar essas linhas.
Queria agradecer à banca pela presença. Então vamos começar.
`);
};
