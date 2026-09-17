const {
  C,
  F,
  H,
  M,
  darkSlide,
  title,
  footer,
  fala,
  card,
  bubble,
  foto,
} = require("../comum");

// 6 - Detectar cedo
module.exports = () => {
  const s = darkSlide();
  foto(s, "defeito_oxidacao.jpg", 6.35, 1.3, 3.1, 3.1);
  title(s, "Contexto elétrico", "Detectar cedo protege o sistema elétrico", { dark: true, w: 5.6, h: 1.0, size: 26 });

  const ganhos = [
    ["Continuidade", "Evita interrupções no fornecimento de energia"],
    ["Custo", "Reduz os custos de manutenção"],
    ["Segurança", "Previne riscos às instalações e às pessoas"],
  ];
  ganhos.forEach((g, i) => {
    const y = 1.7 + i * 0.9;
    card(s, M, y, 5.55, 0.76, { fill: C.nightSoft, line: C.nightSoft, flat: true });
    bubble(s, M + 0.18, y + 0.16, 0.44, String(i + 1), { fill: C.amber, color: C.night });
    s.addText([
      { text: g[0], options: { bold: true, color: C.amber, breakLine: true } },
      { text: g[1], options: { color: C.white } },
    ], { x: M + 0.8, y: y + 0.06, w: 4.6, h: 0.64, margin: 0, fontFace: F.body, fontSize: 12.5, valign: "middle" });
  });

  s.addText("Falhas não detectadas podem ter consequências graves.", {
    x: M, y: 4.5, w: 5.6, h: 0.4, margin: 0,
    fontFace: F.head, fontSize: 14, bold: true, italic: true, color: C.white,
  });

  footer(s, "Contexto elétrico", true);
  fala(s, `
Por isso, a identificação precoce dessas falhas é essencial, e ela traz três ganhos diretos para o sistema elétrico.
O primeiro é a continuidade: encontrar a falha a tempo evita interrupções no fornecimento de energia.
O segundo é econômico: a detecção precoce reduz os custos de manutenção.
O terceiro é a segurança: previne riscos às instalações e às pessoas.
Há também o outro lado dessa questão. Uma falha que não é detectada, o chamado falso negativo, pode ter consequências graves e, no limite, levar a falhas no sistema de transmissão. Por isso, ao longo do trabalho, a capacidade de encontrar a falha, e não apenas a taxa geral de acertos, recebe atenção especial na leitura dos resultados.`);
};
