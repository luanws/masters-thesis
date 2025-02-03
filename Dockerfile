FROM texlive/texlive

RUN tlmgr update --self && \
    tlmgr install latexmk && \
    apt-get update && \
    apt-get install -y inotify-tools

WORKDIR /documents
