cd documents
mkdir -p out
chmod u+w out
chmod -R u+w out
touch out/main.log
chmod u+w out/main.log
pdflatex -shell-escape -interaction=nonstopmode -output-directory=out main.tex
bibtex out/main
pdflatex -shell-escape -interaction=nonstopmode -output-directory=out main.tex
pdflatex -shell-escape -interaction=nonstopmode -output-directory=out main.tex
cd ../