const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  foto,
} = require("../comum");

// 5 - Falhas
module.exports = () => {
  const s = lightSlide();
  title(s, "Contexto elétrico", "Falhas que deixam marca na imagem");

  const falhas = [
    ["defeito_corrosao.jpg", "Corrosão", "Identificável em imagens de inspeção"],
    ["defeito_disco_ausente.jpg", "Disco ausente e fraturas", "Comprometem a rigidez dielétrica da cadeia"],
  ];
  falhas.forEach((f, i) => {
    const largura = 4.3, altura = 2.85, x = M + i * (largura + 0.3);
    foto(s, f[0], x, 1.25, largura, altura);
    s.addText(f[1], {
      x, y: 4.2, w: largura, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 14, bold: true, color: i === 1 ? C.amber : C.teal,
    });
    s.addText(f[2], {
      x, y: 4.5, w: largura, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink,
    });
  });

  footer(s, "Contexto elétrico", false, "Fotos ilustrativas de cadeias de isoladores");
  fala(s, `
As falhas aparecem de diferentes formas. A literatura cita trincas, contaminação superficial, perfurações e rupturas, além de corrosões nas estruturas, que também podem ser identificadas por imagem. À esquerda está um exemplo de corrosão.
À direita está o defeito estrutural das cadeias de discos cerâmicos, em que o disco está ausente ou fraturado. Essas condições comprometem a rigidez dielétrica da cadeia e podem evoluir para falhas de isolamento na linha.
O ponto em comum é que todas essas falhas deixam uma assinatura visual. É isso que torna possível usar imagens para encontrá-las.`);
};
