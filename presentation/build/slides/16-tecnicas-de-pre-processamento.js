const {
  figura,
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
  foto,
} = require("../comum");

// 16 - Técnicas de pré-processamento
module.exports = () => {
  const s = lightSlide();
  title(s, "Pré-processamento", "O que cada técnica faz com a imagem");

  const tiles = [
    ["proc_original.jpg", "Imagem original"],
    ["proc_contraste.jpg", "Realce de contraste"],
    ["proc_equalizacao.jpg", "Equalização de histograma"],
    ["proc_cinza.jpg", "Escala de cinza"],
    ["proc_desfoque.jpg", "Desfoque gaussiano"],
    ["proc_bordas.jpg", "Detecção de bordas"],
  ];
  const tw = 2.1, th = tw * 0.75;
  tiles.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (tw + 0.2), y = 1.22 + row * (th + 0.4);
    foto(s, t[0], x, y, tw, th, i === 1 ? { borda: C.amber, espessura: 3 } : {});
    s.addText(t[1], {
      x, y: y + th + 0.03, w: tw, h: 0.26, margin: 0,
      fontFace: F.body, fontSize: 10.5, bold: true, color: i === 1 ? C.amber : C.ink,
    });
  });

  card(s, 7.45, 1.22, 2.0, 3.8, { fill: C.night, line: C.night });
  s.addText("14", {
    x: 7.45, y: 1.45, w: 2.0, h: 0.8, margin: 0, align: "center",
    fontFace: F.head, fontSize: 44, bold: true, color: C.amber,
  });
  s.addText("variantes avaliadas", {
    x: 7.6, y: 2.25, w: 1.7, h: 0.3, margin: 0, align: "center",
    fontFace: F.body, fontSize: 11.5, bold: true, color: C.white,
  });
  s.addText([
    { text: "4", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "combinações híbridas", options: { fontSize: 10.5, color: C.white, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "1", options: { fontSize: 22, bold: true, color: C.tealLight, breakLine: true } },
    { text: "controle sem processamento", options: { fontSize: 10.5, color: C.white } },
  ], { x: 7.6, y: 2.75, w: 1.7, h: 2.0, margin: 0, align: "center", fontFace: F.body });

  footer(s, "Materiais", false, "Ilustração do efeito das técnicas sobre uma mesma imagem");
  fala(s, `
Eu avaliei 14 variantes de pré-processamento, todas aplicadas nas imagens antes do treinamento. Aqui na figura dá pra ver o efeito de algumas delas sobre a mesma imagem.
São técnicas bem diferentes entre si. Umas mexem no contraste, outras tiram a cor, outras suavizam ou isolam os contornos. Cada uma destaca uma coisa e apaga outra.
Quatro dessas variantes são híbridas, combinando duas técnicas em sequência. E a imagem original entra como controle, que é a linha de base, sem processamento nenhum.
`);
};
