const {
  C,
  F,
  H,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
  bullets,
} = require("../comum");

// 26 - Limitações e trabalhos futuros
module.exports = () => {
  const s = lightSlide();
  title(s, "Conclusões", "Limitações e trabalhos futuros");

  card(s, M, 1.35, 4.3, 3.5, { fill: C.surface, flat: true });
  s.addText("Limitações", {
    x: M + 0.28, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.muted,
  });
  bullets(s, [
    "Escassez de imagens públicas com defeitos anotados",
    "Conjuntos de dados fortemente desbalanceados",
    "Explosão combinatória ao otimizar todos os parâmetros",
  ], { x: M + 0.3, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 10 });

  card(s, M + 4.6, 1.35, 4.3, 3.5, { fill: C.night, line: C.night });
  s.addText("Trabalhos futuros", {
    x: M + 4.88, y: 1.5, w: 3.8, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.amber,
  });
  bullets(s, [
    "Otimização bayesiana de múltiplos parâmetros",
    "Aumento de dados com GANs",
    "Integração com arquiteturas de detecção",
    "Métricas robustas ao desbalanceamento",
    "Execução embarcada em drones",
  ], { x: M + 4.9, y: 1.95, w: 3.75, h: 2.7, size: 12.5, gap: 8, color: C.white });

  footer(s, "Conclusões");
  fala(s, `
O trabalho teve limitações.
A principal foi a quantidade e a disponibilidade de dados. Existe muita escassez de banco de imagens público focado em redes de distribuição, com número expressivo de componentes defeituosos e anotação rigorosa, e isso obriga a usar conjuntos bem desbalanceados.
Outra limitação foi o custo computacional. Otimizar todos os parâmetros do pipeline ao mesmo tempo leva a uma explosão combinatória, o que inviabiliza avaliar tudo em tempo hábil.
A partir dessas limitações, eu sugiro cinco trabalhos futuros. Usar a otimização bayesiana para explorar vários parâmetros ao mesmo tempo. Gerar exemplos sintéticos de defeitos com redes generativas adversariais. Estender o método para arquiteturas de detecção, avaliando também onde a falha está na imagem. Adotar métricas mais robustas ao desbalanceamento, como o F1-score macro e a acurácia balanceada. E avaliar o desempenho do pipeline em dispositivos embarcados, como o próprio drone, para viabilizar a inspeção dinâmica em campo.
`);
};
