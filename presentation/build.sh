#!/bin/sh
# Gera a apresentacao de defesa em .pptx e converte para .odp (LibreOffice Impress).
# Uso: sh presentation/build.sh
set -e
cd "$(dirname "$0")"

# instala a dependencia do gerador na primeira execucao
if [ ! -d node_modules ]; then npm install; fi

node build.js defesa.pptx

# Localiza o LibreOffice nas instalacoes usuais
SOFFICE=""
for c in \
  "soffice" \
  "/c/Program Files/LibreOffice/program/soffice.exe" \
  "/c/Program Files (x86)/LibreOffice/program/soffice.exe" \
  "/Applications/LibreOffice.app/Contents/MacOS/soffice" \
  "/usr/bin/soffice"
do
  if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then SOFFICE="$c"; break; fi
done

if [ -z "$SOFFICE" ]; then
  echo "LibreOffice nao encontrado. O .pptx foi gerado, mas o .odp nao."
  exit 1
fi

"$SOFFICE" --headless --convert-to odp --outdir . defesa.pptx >/dev/null
echo "Gerados: presentation/defesa.pptx e presentation/defesa.odp"
