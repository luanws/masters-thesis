#!/bin/sh
# Gera a apresentacao de defesa em .pptx.
# Uso: sh presentation/build.sh
set -e
cd "$(dirname "$0")"

# instala a dependencia do gerador na primeira execucao
if [ ! -d node_modules ]; then npm install; fi

node build.js defesa.pptx
echo "Gerado: presentation/defesa.pptx"
