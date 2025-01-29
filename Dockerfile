FROM texlive/texlive

RUN tlmgr update --self && \
    tlmgr install latexmk && \
    apt-get update && \
    apt-get install -y inotify-tools

WORKDIR /documents

CMD ["sh", "-c", "while inotifywait -e close_write main.tex; do latexmk -pdf main.tex; done"]
