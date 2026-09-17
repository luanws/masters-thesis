const {
  C,
  F,
  M,
  pres,
  lightSlide,
  title,
  footer,
  fala,
  card,
  bubble,
} = require("../comum");

// 24 - Vantagens para o sistema elétrico
module.exports = () => {
  const s = lightSlide();
  title(s, "Impacto", "Vantagens para o sistema elétrico");

  const vant = [
    ["Continuidade", "A detecção precoce de falhas evita interrupções no fornecimento"],
    ["Custo de manutenção", "Identificar a falha cedo reduz os custos de manutenção"],
    ["Segurança", "Evita intervenções manuais em locais de difícil acesso"],
    ["Grandes extensões", "Drones facilitam a inspeção de longos trechos de linha"],
    ["Reprodutibilidade", "Diagnóstico mais rápido, econômico e menos subjetivo"],
    ["Manutenção preditiva", "Danos identificados antes de se tornarem críticos"],
  ];
  vant.forEach((v, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 3.05, y = 1.35 + row * 1.8;
    card(s, x, y, 2.85, 1.6, { flat: true });
    s.addShape(pres.ShapeType.rect, { x, y, w: 2.85, h: 0.08, fill: { color: row === 0 ? C.teal : C.amber }, line: { type: "none" } });
    bubble(s, x + 0.2, y + 0.3, 0.46, String(i + 1), { fill: row === 0 ? C.teal : C.amber, color: row === 0 ? C.white : C.night });
    s.addText(v[0], {
      x: x + 0.8, y: y + 0.3, w: 1.95, h: 0.46, margin: 0, valign: "middle",
      fontFace: F.body, fontSize: 13.5, bold: true, color: C.ink,
    });
    s.addText(v[1], {
      x: x + 0.2, y: y + 0.88, w: 2.5, h: 0.62, margin: 0,
      fontFace: F.body, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.05,
    });
  });

  footer(s, "Impacto");
  fala(s, `
Voltando ao sistema elétrico, a inspeção automatizada por imagem, que este trabalho ajuda a tornar mais confiável, traz vantagens em seis frentes.
A continuidade do fornecimento, porque a detecção precoce de falhas evita interrupções.
O custo, porque identificar a falha cedo reduz os custos de manutenção.
A segurança, porque o uso de imagens evita intervenções manuais em locais de difícil acesso.
A abrangência, porque os drones facilitam a inspeção de grandes extensões de linhas.
A reprodutibilidade, porque o diagnóstico automatizado é mais rápido, econômico e menos sujeito à subjetividade e ao erro humano.
E a manutenção preditiva, porque as técnicas modernas permitem monitorar os equipamentos e identificar danos antes que se tornem críticos.
Em todas essas frentes, o ganho depende de o modelo acertar, e o acerto do modelo depende, como vimos, do tratamento dado às imagens.`);
};
