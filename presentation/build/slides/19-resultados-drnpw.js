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
      ["3 imagens", "ACIMA DO PISO", "Vantagem do melhor resultado sobre o piso de 73,33%.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
No DRNPW, o cenário de inspeção aérea em ambiente operacional real, o comportamento muda.
Com fundos de forte poluição visual, os melhores resultados vieram das combinações que ampliam o contraste. A combinação de realce de contraste e equalização de histograma teve o melhor desempenho, com 83,33 por cento de acurácia e 75,76 por cento de F1-score, contra 63,33 por cento de acurácia e 49,12 por cento de F1-score dos modelos treinados apenas com as imagens originais.
A leitura é que, nesse cenário, a combinação reforça o contraste entre o componente e o fundo. Já as técnicas que suprimem a cor, como a escala de cinza, ou que suavizam as texturas, como os desfoques, ficaram entre os piores resultados, por descartarem informação relevante à identificação do defeito.
Faço aqui uma ressalva: esse melhor resultado supera o piso de 73,33 por cento em 10 pontos percentuais, o equivalente a três imagens de teste, e seis das 14 técnicas ficaram no piso ou abaixo dele. Por isso, a inspeção em ambiente com forte poluição visual permanece como o caso mais desafiador.`);
};
