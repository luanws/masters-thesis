const {
  C,
  F,
  lightSlide,
  title,
  footer,
  fala,
  card,
  bubble,
  fluxo,
  figFluxo,
} = require("../comum");

// 13 - Metodologia geral
module.exports = () => {
  const s = lightSlide();
  title(s, "Metodologia", "Estruturada, iterativa e modular");

  figFluxo(s, "geral", 0.5, 1.18, 3.8);

  const etapas = [
    "Seleção e validação do dataset", "Pré-processamento", "Ajuste de parâmetros",
    "Escolha e construção do modelo", "Treinamento", "Avaliação e ajustes",
  ];
  etapas.forEach((e, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 2.5 + col * 3.6, y = 1.3 + row * 0.8;
    card(s, x, y, 3.4, 0.66, { flat: true });
    bubble(s, x + 0.14, y + 0.15, 0.36, String(i + 1), { fill: i === 5 ? C.amber : C.teal, size: 10, color: i === 5 ? C.night : C.white });
    s.addText(e, {
      x: x + 0.6, y, w: 2.72, h: 0.66, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 12, bold: true, color: C.ink,
    });
  });

  card(s, 2.5, 3.85, 7.0, 1.0, { fill: C.night, line: C.night });
  s.addText([
    { text: "↺  ", options: { color: C.amber, fontSize: 22, bold: true } },
    { text: "A avaliação retroalimenta o pré-processamento e a escolha do modelo.", options: { color: C.white, fontSize: 13.5 } },
  ], { x: 2.75, y: 3.85, w: 6.6, h: 1.0, margin: 0, valign: "middle", fontFace: F.body });

  footer(s, "Proposta");
  fala(s, `
A metodologia é estruturada, iterativa e modular.
O fluxo parte do início e percorre seis etapas: a seleção e a validação do conjunto de dados, o pré-processamento, o ajuste de parâmetros, a escolha e a construção do modelo, o treinamento e, por fim, a avaliação e os ajustes, encerrando em conclusões e recomendações.
O caráter iterativo vem do ciclo de avaliação. Quando o desempenho não é satisfatório, a avaliação retroalimenta o pré-processamento e a escolha do modelo, o que permite refinar as técnicas e os parâmetros a cada iteração.
O caráter modular vem da divisão em blocos, que permite identificar e corrigir problemas em cada etapa de forma isolada, sem comprometer o restante do processo. É essa modularidade que permite, mais adiante, trocar apenas o bloco do modelo e repetir o experimento com uma segunda arquitetura.`);
};
