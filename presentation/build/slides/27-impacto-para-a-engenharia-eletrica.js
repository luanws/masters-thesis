const {
  asset,
  C,
  F,
  W,
  H,
  M,
  pres,
  darkSlide,
  title,
  footer,
  fala,
} = require("../comum");

// 27 - Impacto para a engenharia elétrica
module.exports = () => {
  const s = darkSlide();
  s.addImage({ data: asset("encerramento.jpg"), x: 0, y: 0, w: W, h: H });
  title(s, "Impacto", "O impacto para a engenharia elétrica", { dark: true });

  const impactos = [
    ["Confiabilidade do sistema", "Modelos que identificam melhor as falhas nos isoladores, antes das interrupções"],
    ["Manutenção de linhas", "Inspeção por drone e IA mais rápida, econômica, segura e reprodutível"],
    ["Método para a inspeção automatizada", "Procedimento sistemático para escolher e ajustar o tratamento das imagens"],
  ];
  impactos.forEach((it, i) => {
    const y = 1.4 + i * 0.95;
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.07, h: 0.78, fill: { color: C.amber }, line: { type: "none" } });
    s.addText(it[0], {
      x: M + 0.25, y: y - 0.02, w: 6.2, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 15, bold: true, color: C.amber,
    });
    s.addText(it[1], {
      x: M + 0.25, y: y + 0.3, w: 6.2, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 12, color: C.white,
    });
  });

  s.addText("Tratar bem a imagem bruta é tão relevante quanto escolher a arquitetura da rede.", {
    x: M, y: 4.3, w: 7.8, h: 0.6, margin: 0,
    fontFace: F.head, fontSize: 16, bold: true, italic: true, color: C.white,
  });

  footer(s, "Conclusões", true);
  fala(s, `
Encerro voltando ao ponto de partida, o Sistema Elétrico de Potência.
A principal contribuição deste trabalho é uma metodologia estruturada para a inspeção automatizada de linhas de transmissão, que mapeia de forma sistemática o impacto do processamento das imagens aéreas.
O impacto aparece em três frentes. Na confiabilidade do sistema, porque um modelo que identifica melhor a falha no isolador contribui para encontrá-la antes que ela cause uma interrupção no fornecimento. Na manutenção das linhas, porque fortalece a inspeção por drone e inteligência artificial, que é mais rápida, econômica, segura e reprodutível que a inspeção manual. E na própria inspeção automatizada, porque oferece um procedimento sistemático para escolher e ajustar o tratamento das imagens, que pode ser repetido a cada novo conjunto de dados ou nova arquitetura.
A mensagem final é que o tratamento adequado das imagens brutas é tão relevante quanto a escolha da arquitetura da rede neural.`);
};
