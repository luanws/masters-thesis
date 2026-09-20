const {
  figura,
  lightSlide,
  title,
  footer,
  fala,
  slideFigura,
} = require("../comum");

// 18 - Resultados CPLID
module.exports = () => {
  const s = lightSlide();
  title(s, "Resultados · Linhas de transmissão com isoladores cerâmicos", "Realçar o contraste evidencia o defeito estrutural", { size: 25 });

  slideFigura(s, figura("CNN", "CPLID"),
    "Acurácia da CNN por técnica, em ordem crescente, com a imagem tratada acima de cada barra (CPLID)",
    [
      ["95,35%", "MELHOR", "Realce de contraste, com F1-score de 96,55%, o maior do conjunto.", "teal"],
      ["67,44%", "PIOR", "Desfoque gaussiano, abaixo da imagem original e do piso de 74,42%.", "dark"],
      ["93,02%", "ORIGINAL", "Imagem sem tratamento, superada pelo realce de contraste.", "amber"],
    ]);

  footer(s, "Resultados");
  fala(s, `
Vou começar pelos resultados da rede convolucional no CPLID, que é o cenário das cadeias cerâmicas de linhas de transmissão com defeito estrutural. O gráfico mostra a acurácia de cada técnica, em ordem crescente, e acima de cada barra está a imagem já tratada.
No topo, três técnicas empataram na maior acurácia, e todas elas ampliam o contraste. O realce de contraste simples, a combinação de CLAHE com realce e a combinação de realce com equalização de histograma. O realce simples ainda teve o maior F1-score do conjunto e superou a imagem original, sem tratamento nenhum.
No outro extremo, o desfoque gaussiano e a redução de ruído derrubaram bastante o desempenho. Os dois ficaram no fim da lista, bem abaixo da imagem original e abaixo também do piso majoritário. Quer dizer, um tratamento inadequado piorou o resultado em relação a simplesmente não tratar a imagem.
`);
};
