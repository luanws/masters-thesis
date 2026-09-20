const {
  figura,
  lightSlide,
  title,
  footer,
  fala,
  slideFigura,
} = require("../comum");

// 19 - Resultados DRNPW
module.exports = () => {
  const s = lightSlide();
  title(s, "Resultados · Inspeção aérea em ambiente operacional real", "Combinar técnicas separa o isolador do fundo", { size: 25 });

  slideFigura(s, figura("CNN", "DRNPW"),
    "Acurácia da CNN por técnica, em ordem crescente, nas imagens de drones da CPFL (DRNPW)",
    [
      ["83,33%", "MELHOR", "Realce de contraste com equalização de histograma, F1-score de 75,76%.", "amber"],
      ["49,12%", "F1 ORIGINAL", "Imagem sem tratamento, com 63,33% de acurácia.", "dark"],
      ["3 imagens", "ACIMA DO PISO", "Vantagem de 10 pontos percentuais sobre o piso de 73,33%.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
Já no DRNPW, que é o cenário de inspeção aérea em ambiente operacional real, o comportamento muda.
Com fundos de forte poluição visual, os melhores resultados vieram das combinações que ampliam o contraste. A melhor de todas foi o realce de contraste com equalização de histograma, bem à frente dos modelos treinados só com as imagens originais. O F1-score, que é a métrica mais sensível ao desbalanceamento, subiu de menos de 50 por cento, com as imagens originais, para uns 75 por cento.
A leitura é que, nesse cenário, a combinação reforça o contraste entre o componente e o fundo. E a escala de cinza, que tira a informação de cor, ficou entre os piores resultados, no mesmo patamar da imagem original e do realce de contraste aplicado sozinho. Aqui o realce sozinho não bastou. O ganho veio mesmo da combinação com a equalização de histograma.
Eu preciso fazer uma ressalva aqui. Esse melhor resultado supera o piso majoritário em dez pontos percentuais, que equivale a três imagens de teste, e seis das 14 técnicas avaliadas ficaram no piso ou abaixo dele. Então a inspeção em ambiente com forte poluição visual continua sendo o caso mais desafiador.
`);
};
