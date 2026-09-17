const {
  C,
  F,
  M,
  lightSlide,
  title,
  footer,
  fala,
  card,
} = require("../comum");

// 17 - Protocolo e piso majoritário
module.exports = () => {
  const s = lightSlide();
  title(s, "Protocolo experimental", "Uma variável por vez e uma régua de leitura");

  const eq = [["14", "variantes"], ["2", "conjuntos de dados"], ["2", "modelos"], ["1", "variável: o pré-processamento"]];
  const bw = 1.75, opw = 0.63;
  eq.forEach((e, i) => {
    const x = M + i * (bw + opw);
    const fim = i === eq.length - 1;
    card(s, x, 1.3, bw, 1.25, fim ? { fill: C.night, line: C.night } : { flat: true });
    s.addText(e[0], {
      x, y: 1.36, w: bw, h: 0.7, margin: 0, align: "center",
      fontFace: F.head, fontSize: 34, bold: true, color: fim ? C.amber : C.teal,
    });
    s.addText(e[1], {
      x: x + 0.1, y: 2.05, w: bw - 0.2, h: 0.42, margin: 0, align: "center",
      fontFace: F.body, fontSize: 10.5, color: fim ? C.white : C.muted,
    });
    if (!fim) {
      s.addText(i === 2 ? "→" : "×", {
        x: x + bw, y: 1.6, w: opw, h: 0.6, margin: 0, align: "center", valign: "middle",
        fontFace: F.head, fontSize: 26, bold: true, color: C.mutedLight,
      });
    }
  });

  card(s, M, 2.85, 8.9, 2.0, { fill: C.surface, flat: true });
  s.addText("Piso majoritário", {
    x: M + 0.3, y: 3.0, w: 4.4, h: 0.32, margin: 0,
    fontFace: F.body, fontSize: 14, bold: true, color: C.ink,
  });
  s.addText("Acurácia obtida ao responder sempre a classe mais frequente do teste, sem observar a imagem. Abaixo dele, o modelo não extrai informação útil.", {
    x: M + 0.3, y: 3.35, w: 4.4, h: 1.3, margin: 0,
    fontFace: F.body, fontSize: 12.5, color: C.ink, lineSpacingMultiple: 1.1,
  });
  [["74,42%", "piso do CPLID", C.teal], ["73,33%", "piso do DRNPW", C.amber]].forEach((p, i) => {
    const x = 5.55 + i * 1.95;
    s.addText(p[0], {
      x, y: 3.2, w: 1.85, h: 0.7, margin: 0, align: "center",
      fontFace: F.head, fontSize: 28, bold: true, color: p[2],
    });
    s.addText(p[1], {
      x, y: 3.9, w: 1.85, h: 0.3, margin: 0, align: "center",
      fontFace: F.body, fontSize: 11, color: C.muted,
    });
  });

  footer(s, "Materiais");
  fala(s, `
O protocolo experimental isola uma única variável.
Foi implementada uma rede neural convolucional clássica e padronizada, com camadas convolucionais, max-pooling, uma camada densa e saída softmax. O treinamento usou o otimizador Adam, com data augmentation em tempo de treino e imagens redimensionadas para um tamanho fixo. Com o modelo fixo, a única variável entre as execuções é o pré-processamento aplicado às imagens. Depois, a mesma varredura foi repetida com uma segunda arquitetura.
Para ler os resultados, é preciso um critério de referência, porque os dois conjuntos de teste são desbalanceados. Nesses casos, a acurácia sozinha pode ser enganosa, já que um modelo que sempre prevê a classe saudável alcança um valor alto sem detectar nenhuma falha. Esse critério é o piso majoritário: a acurácia obtida ao responder sempre a classe mais frequente, sem observar a imagem.
No CPLID, a classe de isoladores normais domina o conjunto de teste, o que dá um piso de 74,42 por cento. No DRNPW, o piso é de 73,33 por cento. Um modelo abaixo desse valor não extrai informação útil das imagens.`);
};
