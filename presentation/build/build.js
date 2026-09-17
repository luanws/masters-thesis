// Gera a apresentação de defesa. Cada slide fica em slides/NN-nome.js e é
// adicionado na ordem do prefixo numérico.
// Uso: node presentation/build/build.js [saida.pptx]
const fs = require("fs");
const path = require("path");
const { pres } = require("./comum");

const SLIDES = path.join(__dirname, "slides");

fs.readdirSync(SLIDES)
  .filter(nome => /^\d+-.+\.js$/.test(nome))
  .sort()
  .forEach(nome => require(path.join(SLIDES, nome))());

const saida = path.resolve(process.argv[2] || path.join(__dirname, "..", "defesa.pptx"));
pres.writeFile({ fileName: saida })
  .then(f => console.log("Gerado:", f));
