const {
  C,
  F,
  M,
  pres,
  lightSlide,
  title,
  footer,
  fala,
  card,
  foto,
} = require("../comum");

// 9 - A IA depende da imagem
module.exports = () => {
  const s = lightSlide();
  title(s, "Proposta", "A IA depende da imagem que recebe");

  const etapas = [
    ["Aquisição", "Imagem da cadeia", { img: "campo.jpg" }],
    ["Pré-processamento", "Tratamento da imagem", { img: "proc_contraste.jpg", destaque: true }],
    ["Modelo", "Rede neural", { img: "rede_neural.png" }],
    ["Diagnóstico", "Com falha ou sem falha", { img: "proc_diagnostico.jpg" }],
  ];
  const bw = 1.95, gap = 0.37, ih = bw * 0.75;
  etapas.forEach((e, i) => {
    const x = M + i * (bw + gap);
    foto(s, e[2].img, x, 1.4, bw, ih, e[2].destaque ? { borda: C.amber, espessura: 3.5 } : {});
    s.addText(e[0], {
      x, y: 3.0, w: bw, h: 0.3, margin: 0, align: "center",
      fontFace: F.body, fontSize: 13, bold: true, color: e[2].destaque ? C.amber : C.ink,
    });
    s.addText(e[1], {
      x, y: 3.3, w: bw, h: 0.26, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: C.muted,
    });
    if (i < etapas.length - 1) {
      s.addText("▶", {
        x: x + bw, y: 1.95, w: gap, h: 0.35, margin: 0, align: "center",
        fontFace: F.body, fontSize: 13, color: C.mutedLight,
      });
    }
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: M + bw + gap + 0.2, y: 3.64, w: bw - 0.4, h: 0.32, rectRadius: 0.08,
    fill: { color: C.amber }, line: { type: "none" },
  });
  s.addText("Foco deste trabalho", {
    x: M + bw + gap + 0.2, y: 3.64, w: bw - 0.4, h: 0.32, margin: 0, align: "center", valign: "middle",
    fontFace: F.body, fontSize: 10, bold: true, color: C.night,
  });

  card(s, M, 4.2, 8.9, 0.68, { fill: C.night, line: C.night });
  s.addText("Não basta investir em arquiteturas complexas se a imagem oculta o defeito.", {
    x: M + 0.3, y: 4.2, w: 8.3, h: 0.68, margin: 0, valign: "middle", align: "center",
    fontFace: F.head, fontSize: 15, bold: true, color: C.white,
  });

  footer(s, "Proposta");
  fala(s, `
Um sistema de inspeção automática segue esta sequência. A imagem é adquirida, recebe um pré-processamento, é analisada pelo modelo de rede neural, e o resultado é um diagnóstico: com falha ou sem falha.
A eficácia desse sistema depende, em grande medida, das técnicas de processamento de imagem empregadas e da forma como elas são combinadas e ajustadas. Diferentes técnicas, parâmetros e arquiteturas podem produzir resultados bastante distintos para o mesmo problema.
Não basta investir apenas em arquiteturas complexas de rede neural se as imagens de entrada apresentarem ruídos e limitações de contraste que ocultam os defeitos.
Por isso, este trabalho coloca o pré-processamento no centro, como a variável independente do estudo. A pergunta passa a ser: qual tratamento aplicar à imagem para que o modelo identifique melhor a falha no isolador?`);
};
