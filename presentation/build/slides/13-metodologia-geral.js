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
O fluxo começa aqui e passa por seis etapas. Seleção e validação do conjunto de dados, pré-processamento, ajuste de parâmetros, escolha e construção do modelo, treinamento e, por último, avaliação e ajustes, terminando em conclusões e recomendações.
O caráter iterativo vem desse ciclo de avaliação. Quando o desempenho não é satisfatório, a avaliação volta para o pré-processamento e para a escolha do modelo, e isso permite refinar as técnicas e os parâmetros a cada iteração.
E o caráter modular vem da divisão em blocos. Dá para identificar e corrigir problemas em cada etapa de forma isolada, sem mexer no resto do processo. É essa modularidade que me permitiu, mais adiante, trocar só o bloco do modelo e repetir o experimento com uma segunda arquitetura.
`);
};
