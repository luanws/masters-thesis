const {
  C,
  F,
  H,
  lightSlide,
  title,
  footer,
  fala,
  bubble,
  foto,
} = require("../comum");

// 4 - O isolador
module.exports = () => {
  const s = lightSlide();
  foto(s, "cadeia_torre.jpg", 0, 0, H, H);
  title(s, "Contexto elétrico", "Isolador: sustentação e isolamento", { x: 6.0, w: 3.5, h: 1.0, size: 24 });

  const itens = [
    ["Sustenta", "mecanicamente os condutores"],
    ["Isola", "as partes energizadas das estruturas aterradas"],
    ["Fica exposto", "a temperatura, umidade, poluição e descargas atmosféricas"],
  ];
  itens.forEach((it, i) => {
    const y = 1.85 + i * 1.02;
    bubble(s, 6.0, y, 0.5, String(i + 1), { fill: i === 1 ? C.amber : C.teal, color: i === 1 ? C.night : C.white });
    s.addText(it[0], {
      x: 6.65, y: y - 0.04, w: 2.8, h: 0.32, margin: 0,
      fontFace: F.body, fontSize: 15, bold: true, color: C.ink,
    });
    s.addText(it[1], {
      x: 6.65, y: y + 0.28, w: 2.8, h: 0.5, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.muted,
    });
  });

  footer(s, "Contexto elétrico", false, "", 6.0);
  fala(s, `
O isolador cumpre duas funções ao mesmo tempo.
A primeira é mecânica, que é sustentar os condutores.
A segunda é elétrica, que é garantir o isolamento entre as partes energizadas e as estruturas aterradas.
Nas linhas de alta tensão eles normalmente aparecem agrupados em cadeias, como essa que está na foto.
O problema é que essas cadeias ficam expostas o tempo todo a condições ambientais severas, variação de temperatura, umidade, poluição, descarga atmosférica. Com o tempo, essa exposição favorece o aparecimento de falhas que comprometem a capacidade de isolamento e, junto com ela, a confiabilidade do sistema elétrico. Ou seja, o desempenho da linha depende do estado de cada cadeia de isoladores instalada nela.
`);
};
