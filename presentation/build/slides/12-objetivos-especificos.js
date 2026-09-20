const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
  bubble,
} = require("../comum");

// 12 - Objetivos específicos
module.exports = () => {
  const s = lightSlide();
  title(s, "Objetivo", "Objetivos específicos");

  const objs = [
    ["Métricas", "Estabelecer métricas para avaliar a eficácia dos processamentos"],
    ["Tipo de modelo", "Determinar o tipo de rede neural para avaliar os processamentos"],
    ["Construção do modelo", "Construir redes de avaliação, sem buscar um modelo definitivo"],
    ["Efeito do modelo", "Analisar o impacto da escolha do modelo no processamento"],
    ["Efeito do dataset", "Avaliar a influência do conjunto de dados na eficácia"],
    ["Combinação", "Aprimorar os processamentos combinando abordagens unitárias"],
    ["Ajuste automático", "Otimizar parâmetros sem intervenção manual extensa"],
  ];
  objs.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = M + col * 4.5, y = 1.32 + row * 0.9;
    const w = i === 6 ? 8.85 : 4.35;
    card(s, x, y, w, 0.8, { flat: true });
    bubble(s, x + 0.2, y + 0.18, 0.44, String(i + 1), { fill: i === 6 ? C.amber : C.night, size: 11, color: i === 6 ? C.night : C.white });
    s.addText(o[0], {
      x: x + 0.76, y: y + 0.08, w: w - 0.95, h: 0.28, margin: 0,
      fontFace: F.body, fontSize: 12.5, bold: true, color: C.teal,
    });
    s.addText(o[1], {
      x: x + 0.76, y: y + 0.36, w: w - 0.92, h: 0.38, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.ink,
    });
  });

  footer(s, "Proposta");
  fala(s, `
Para chegar nesse objetivo, eu defini sete objetivos específicos.
O primeiro é estabelecer métricas para avaliar a eficácia dos processamentos de imagem.
O segundo e o terceiro são determinar o tipo de rede neural adequado e construir os modelos de avaliação, sem a intenção de chegar a um modelo definitivo.
O quarto e o quinto são analisar o impacto da escolha do modelo e a influência do conjunto de dados sobre os resultados.
O sexto é aprimorar os processamentos combinando abordagens unitárias.
E o sétimo é criar um método de ajuste automático dos parâmetros.
Eu queria destacar o sentido do terceiro objetivo. Os modelos que eu treinei servem para medir o impacto dos diferentes processamentos. Eles não são o produto final do trabalho.
`);
};
