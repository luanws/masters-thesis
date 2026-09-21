const {
  asset,
  C,
  F,
  W,
  H,
  M,
  darkSlide,
  footer,
  fala,
} = require("../comum");

// 28 - Encerramento
module.exports = () => {
  const s = darkSlide();
  s.addImage({ data: asset("capa.jpg"), x: 0, y: 0, w: W, h: H });

  s.addText("Obrigado pela atenção", {
    x: M, y: 1.75, w: 6, h: 0.72, margin: 0,
    fontFace: F.head, fontSize: 34, bold: true, color: C.white,
  });
  s.addText("Fico à disposição da banca para as arguições.", {
    x: M, y: 2.5, w: 6, h: 0.36, margin: 0,
    fontFace: F.body, fontSize: 14, color: C.mutedLight,
  });
  s.addText([
    { text: "Luan Willig Silveira", options: { bold: true, color: C.white, fontSize: 13, breakLine: true } },
    { text: "luan.w.silveira@gmail.com", options: { color: C.amber, fontSize: 12, breakLine: true } },
    { text: "PPGEE, Universidade Federal de Santa Maria", options: { color: C.mutedLight, fontSize: 11 } },
  ], { x: M, y: 3.3, w: 6, h: 1.0, margin: 0, fontFace: F.body, lineSpacingMultiple: 1.2 });

  footer(s, "Encerramento", true);
  fala(s, `
Muito obrigado pela atenção.
Agradeço mais uma vez a presença dos professores Adriano e Lúcio na banca e também aos professores Daniel e Paulo Cesar, que me orientaram durante o desenvolvimento do trabalho.
Fico à disposição da banca para a etapa seguinte e passo a palavra ao professor Daniel.
`);
};
