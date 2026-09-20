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
Tradicionalmente, a inspeção das cadeias de isoladores é feita de forma visual e manual, por equipes especializadas. Isso deixa a inspeção lenta, cara e sujeita à subjetividade e ao erro humano.
Uma alternativa promissora é a inspeção por imagem. Usar imagens capturadas por drones facilita muito inspecionar grandes extensões de linha, reduz custo e aumenta a segurança, porque evita que alguém tenha que ir até um local de difícil acesso.
Quando essas imagens são associadas a modelos de aprendizado de máquina, dá para automatizar a detecção e a classificação das falhas, e a inspeção fica mais rápida, mais econômica e reprodutível. E os métodos de aprendizado profundo conseguem reconhecer padrões de falha mesmo em condições adversas, com pouca visibilidade ou equipamento desgastado.
É essa combinação de drone com inteligência artificial que forma o contexto de aplicação da dissertação.
`);
};
