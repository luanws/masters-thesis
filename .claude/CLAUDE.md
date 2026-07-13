# Como compilar e gerar o PDF da dissertação

Este projeto usa **LaTeX** compilado dentro de um contêiner **Docker** (imagem `masters-latex`, baseada em `texlive/texlive`). Isso garante que o ambiente de compilação seja o mesmo em qualquer máquina, sem precisar instalar o TeX Live localmente.

## Pré-requisitos

- **Docker** instalado e em execução.
- (Opcional) **VS Code** — as tarefas de build já estão configuradas em [`.vscode/tasks.json`](../.vscode/tasks.json).

## Estrutura relevante

| Caminho | Descrição |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | Define a imagem `masters-latex` (TeX Live + `latexmk` + `inotify-tools`). |
| [`documents/main.tex`](../documents/main.tex) | Arquivo raiz da **dissertação**. |
| [`compile.sh`](../compile.sh) | Script que compila a dissertação (`documents/`). |
| [`sepoc/main.tex`](../sepoc/main.tex) | Arquivo raiz do **artigo SEPOC**. |
| [`compile_sepoc.sh`](../compile_sepoc.sh) | Script que compila o artigo SEPOC (`sepoc/`). |
| `documents/out/main.pdf` | **PDF gerado** da dissertação. |
| `sepoc/out/main.pdf` | **PDF gerado** do artigo SEPOC. |

## Forma recomendada: tarefas do VS Code

As tarefas estão definidas em [`.vscode/tasks.json`](../.vscode/tasks.json). Para executá-las:

1. Abra a paleta de comandos: `Ctrl+Shift+P`
2. Escolha **Tasks: Run Task** (`Executar Tarefa`)
3. Selecione a tarefa desejada:
   - **Build Docker Image** — constrói a imagem `masters-latex` (só é necessário na primeira vez ou quando o `Dockerfile` mudar).
   - **Compile LaTeX** — compila a **dissertação** (é a tarefa de build padrão, também acionável por `Ctrl+Shift+B`). Depende de *Build Docker Image*.
   - **Compile LaTeX (Sepoc)** — compila o **artigo SEPOC**. Depende de *Build Docker Image*.

As tarefas de compilação já dependem da construção da imagem (`dependsOn`), então basta rodar a tarefa de compilação diretamente.

## Forma manual: linha de comando

Se preferir não usar o VS Code, reproduza exatamente o que as tarefas fazem. Execute a partir da **raiz do projeto**.

### 1. Construir a imagem Docker (uma vez)

```bash
docker build -t masters-latex .
```

### 2. Compilar a dissertação

```bash
docker run --rm -v "${PWD}:/workspace" -w /workspace masters-latex \
  sh -c "sed -i 's/\r$//' compile.sh && sh ./compile.sh"
```

### 3. Compilar o artigo SEPOC (opcional)

```bash
docker run --rm -v "${PWD}:/workspace" -w /workspace masters-latex \
  sh -c "sed -i 's/\r$//' compile_sepoc.sh && sh ./compile_sepoc.sh"
```

> **Nota (Windows):** o `sed -i 's/\r$//'` remove os retornos de carro (`CRLF` → `LF`) do script `.sh` antes de executá-lo. Isso é necessário porque os arquivos podem ser salvos com quebras de linha do Windows, que quebrariam o `sh` dentro do contêiner Linux.

## O que os scripts de compilação fazem

Ambos os scripts ([`compile.sh`](../compile.sh) e [`compile_sepoc.sh`](../compile_sepoc.sh)) seguem o fluxo padrão do LaTeX com bibliografia:

1. Entram no diretório do documento (`documents/` ou `sepoc/`).
2. Criam a pasta de saída `out/`.
3. Rodam `pdflatex` → `bibtex` → `pdflatex` → `pdflatex`.

A sequência tripla de `pdflatex` intercalada com `bibtex` é necessária para resolver corretamente **referências cruzadas**, **citações** e a **bibliografia**.

A flag `-shell-escape` permite pacotes que executam programas externos; `-interaction=nonstopmode` faz a compilação não parar em erros (útil para builds automatizados).

## Resultado

Após a compilação bem-sucedida, o PDF fica em:

- Dissertação → **`documents/out/main.pdf`**
- Artigo SEPOC → **`sepoc/out/main.pdf`**
