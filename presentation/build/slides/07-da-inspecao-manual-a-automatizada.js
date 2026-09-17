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
  bullets,
} = require("../comum");

// 7 - Da inspeção manual à automatizada
module.exports = () => {
  const s = lightSlide();
  title(s, "Contexto elétrico", "Da inspeção manual à inspeção automatizada");

  s.addImage({ data: asset("drone.png"), x: M, y: 1.45, w: 4.3, h: 4.3 * 760 / 1400 });
  legenda(s, "Imagens capturadas por drones facilitam a inspeção de grandes extensões de linhas.", M, 3.95, 4.2, { h: 0.45 });

  card(s, 5.15, 1.3, 4.3, 1.62, { fill: C.surface, flat: true });
  s.addText("Inspeção visual e manual", {
    x: 5.38, y: 1.4, w: 3.9, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.muted,
  });
  bullets(s, [
    "Lenta e custosa",
    "Sujeita à subjetividade e a erros humanos",
    "Feita por equipes especializadas",
  ], { x: 5.4, y: 1.76, w: 3.9, h: 1.1, size: 11.5, gap: 3 });

  card(s, 5.15, 3.1, 4.3, 1.8, { fill: C.night, line: C.night });
  s.addText("Inspeção por imagem com IA", {
    x: 5.38, y: 3.2, w: 3.9, h: 0.3, margin: 0,
    fontFace: F.body, fontSize: 13.5, bold: true, color: C.amber,
  });
  bullets(s, [
    "Mais rápida, econômica e reprodutível",
    "Evita intervenções manuais em locais de difícil acesso",
    "Reconhece padrões de falha em condições adversas",
  ], { x: 5.4, y: 3.56, w: 3.9, h: 1.3, size: 11.5, gap: 3, color: C.white });

  footer(s, "Contexto elétrico");
  fala(s, `
Tradicionalmente, a inspeção de cadeias de isoladores é feita de forma visual e manual, por equipes especializadas. Isso torna a inspeção lenta, custosa e sujeita à subjetividade e a erros humanos.
Uma alternativa promissora é a inspeção por imagem. O uso de imagens capturadas por drones facilita a inspeção de grandes extensões de linhas de transmissão, reduz custos e aumenta a segurança, porque evita intervenções manuais em locais de difícil acesso.
Associadas a modelos de aprendizado de máquina, essas imagens permitem automatizar a detecção e a classificação das falhas, o que torna a inspeção mais rápida, econômica e reprodutível. E os métodos de aprendizado profundo conseguem reconhecer padrões que indicam falhas mesmo em condições adversas, como baixa visibilidade ou equipamentos desgastados.
É essa combinação de drone e inteligência artificial que forma o contexto de aplicação desta dissertação.`);
};
