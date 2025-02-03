cd documents
mkdir -p out
pdflatex -shell-escape -output-directory=out main.tex
bibtex out/main
pdflatex -shell-escape -output-directory=out main.tex
pdflatex -shell-escape -output-directory=out main.tex
