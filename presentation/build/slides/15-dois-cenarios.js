const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  foto,
  bullets,
} = require("../comum");

// 15 - Dois cenários
module.exports = () => {
  const s = lightSlide();
  title(s, "Materiais", "Dois cenários de inspeção de isoladores");

  const cenarios = [
    ["cplid_faixa.jpg", "CPLID", C.teal, [
      "Linhas de transmissão, isoladores majoritariamente cerâmicos",
      "Defeito estrutural: disco ausente e fraturas",
      "678 imagens de treino, 127 de validação e 43 de teste",
    ]],
    ["campo_faixa.jpg", "DRNPW", C.amber, [
      "Imagens de drones disponibilizadas pela CPFL",
      "Fundos heterogêneos com forte poluição visual",
      "585 imagens: 468 treino, 87 validação, 30 teste",
      "Desbalanceado: 335 imagens de treino em uma única classe",
    ]],
  ];
  cenarios.forEach((c, i) => {
    const x = M + i * 4.6;
    foto(s, c[0], x, 1.3, 4.3, 2.0);
    s.addText(c[1], {
      x, y: 3.42, w: 4.3, h: 0.36, margin: 0,
      fontFace: F.head, fontSize: 18, bold: true, color: c[2],
    });
    bullets(s, c[3], { x: x + 0.02, y: 3.82, w: 4.25, h: 1.3, size: 10.5, gap: 3 });
  });

  footer(s, "Materiais", false, "Foto à direita: ilustrativa do cenário de campo");
  fala(s, `
Para validar a metodologia, foram usados dois conjuntos de dados de inspeção de infraestrutura elétrica, que representam cenários bem diferentes.
O primeiro é o CPLID, o Chinese Power Line Insulator Dataset. Ele reúne imagens de cadeias de isoladores de linhas de transmissão aéreas, majoritariamente cerâmicos, capturadas por drones e com fundos homogêneos. O defeito de interesse é estrutural: a ausência de disco e as fraturas no corpo do isolador. São duas classes, com 678 imagens de treino, 127 de validação e 43 de teste.
O segundo é o DRNPW, disponibilizado pela CPFL, com imagens capturadas por drones em condições operacionais reais. Aqui os isoladores aparecem sobre fundos heterogêneos, com vegetação e ocupação urbana, o que reproduz a dificuldade de campo em distinguir o componente elétrico do ambiente. São 585 imagens, divididas em 468 de treino, 87 de validação e 30 de teste.
Esse conjunto é fortemente desbalanceado: das 468 imagens de treino, 335 pertencem a uma única categoria.`);
};
