// Gera a apresentação de defesa. Cada slide fica em slides/NN-nome.js e é
// adicionado na ordem do prefixo numérico.
// Uso: node presentation/build/build.js [saida.pptx]
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { pres } = require("./comum");

const SLIDES = path.join(__dirname, "slides");

fs.readdirSync(SLIDES)
  .filter(nome => /^\d+-.+\.js$/.test(nome))
  .sort()
  .forEach(nome => require(path.join(SLIDES, nome))());

// O pptxgenjs não expõe opção de idioma para addNotes() e grava lang="en-US"
// fixo no XML das notas do orador. Corrige isso após gerar o arquivo, para o
// corretor ortográfico do PowerPoint tratar a fala também como português.
async function corrigirIdiomaDasNotas(caminhoPptx) {
  const zip = await JSZip.loadAsync(fs.readFileSync(caminhoPptx));
  const notas = zip.folder("ppt/notesSlides").file(/\.xml$/);
  for (const arquivo of notas) {
    const xml = await arquivo.async("string");
    zip.file(arquivo.name, xml.replace(/lang="en-US"/g, 'lang="pt-BR"'));
  }
  fs.writeFileSync(caminhoPptx, await zip.generateAsync({ type: "nodebuffer" }));
}

const saida = path.resolve(process.argv[2] || path.join(__dirname, "..", "defesa.pptx"));
pres.writeFile({ fileName: saida })
  .then(f => corrigirIdiomaDasNotas(f).then(() => f))
  .then(f => console.log("Gerado:", f));
