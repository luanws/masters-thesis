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

// 25 - Conclusões
module.exports = () => {
  const s = lightSlide();
  title(s, "Conclusões", "O que os resultados sustentam");

  const cs = [
    ["O pré-processamento é determinante na detecção de falhas em isoladores", "Elevou o F1-score de 49,12% para 75,76% no DRNPW e, mal escolhido, levou a acurácia de 93,02% a 67,44% no CPLID."],
    ["Não há técnica universalmente superior", "Realce de contraste para defeito estrutural em cadeias cerâmicas. Combinações híbridas para fundos com poluição visual."],
    ["A seleção do pré-processamento depende do modelo", "A ordem de mérito se inverteu entre a CNN e o YOLOv8n-cls, e a escolha deve ser refeita a cada mudança."],
  ];
  cs.forEach((c, i) => {
    const y = 1.35 + i * 1.2;
    card(s, M, y, 8.9, 1.05, { flat: true });
    bubble(s, M + 0.22, y + 0.28, 0.5, String(i + 1), { fill: i === 2 ? C.amber : C.teal, color: i === 2 ? C.night : C.white });
    s.addText(c[0], {
      x: M + 0.9, y: y + 0.13, w: 7.8, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
    });
    s.addText(c[1], {
      x: M + 0.9, y: y + 0.48, w: 7.8, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Conclusões");
  fala(s, `
Concluindo.
Primeira conclusão: o pré-processamento das imagens exerce papel determinante no desempenho dos modelos em cenários de inspeção de infraestrutura elétrica.
Segunda conclusão: não há um processamento universalmente superior. Para defeitos estruturais em cadeias de isoladores de linhas de transmissão, no CPLID, o realce de contraste foi a estratégia de maior êxito. Para a inspeção aérea com fundos heterogêneos e poluídos, no DRNPW, as combinações de realce de contraste e equalização de histograma foram mais eficazes. A eficácia de cada técnica depende das características do conjunto de dados e do contexto de captura das falhas.
Terceira conclusão: a ordem de mérito das técnicas se altera conforme a arquitetura, de modo que a seleção do pré-processamento não é independente do modelo nem da forma de inicialização dos seus pesos. Por isso, ela precisa ser refeita a cada mudança de arquitetura ou de conjunto de dados, e é essa reexecução controlada que a metodologia proposta busca viabilizar.`);
};
