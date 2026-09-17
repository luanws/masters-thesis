const {
  asset,
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
  legenda,
} = require("../comum");

// 8 - Desafios da inspeção por imagem
module.exports = () => {
  const s = lightSlide();
  title(s, "Contexto elétrico", "O desafio: muitas imagens e fundos complexos");

  s.addImage({ data: asset("mosaico.jpg"), x: M, y: 1.3, w: 5.45, h: 5.45 * 984 / 1960 });
  legenda(s, "Imagens ilustrativas de inspeção de cadeias de isoladores", M, 4.1, 5.45);

  const desafios = [
    ["Alto volume de dados", "Torna a inspeção manual ineficaz"],
    ["Fundos complexos", "Vegetação, rios e ocupação urbana ao redor do isolador"],
    ["Anotação manual", "Demorada e propensa a erros"],
  ];
  desafios.forEach((d, i) => {
    const y = 1.3 + i * 0.95;
    card(s, 6.3, y, 3.15, 0.82, i === 1 ? { fill: C.night, line: C.night } : { flat: true });
    s.addText([
      { text: d[0], options: { bold: true, color: i === 1 ? C.amber : C.teal, breakLine: true } },
      { text: d[1], options: { color: i === 1 ? C.white : C.ink, fontSize: 10.5 } },
    ], { x: 6.48, y: y + 0.05, w: 2.85, h: 0.72, margin: 0, fontFace: F.body, fontSize: 12.5, valign: "middle" });
  });

  footer(s, "Contexto elétrico");
  fala(s, `
A inspeção por imagem, porém, traz os seus próprios desafios.
O primeiro é o volume. Uma inspeção produz um grande número de imagens, e a literatura aponta que a inspeção manual se torna ineficaz justamente pelo alto volume de dados.
O segundo é o fundo das imagens. O isolador aparece sobre vegetação, rios, ocupação urbana e outras estruturas, e essa complexidade dificulta distinguir o componente elétrico do ambiente ao seu redor.
O terceiro é a anotação. Rotular manualmente as imagens capturadas por drones é demorado e propenso a erros, o que limita o tamanho dos conjuntos de dados disponíveis.
A inteligência artificial responde ao primeiro desafio, porque permite analisar grandes volumes de dados e identificar padrões complexos. Mas os outros dois mostram que a qualidade da imagem que chega ao modelo continua sendo decisiva.`);
};
