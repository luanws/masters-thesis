# Plano de melhorias da dissertação (itens pendentes)

Este arquivo lista apenas o que **depende de você** (dados, registros dos experimentos,
decisões editoriais) ou de **reexecutar experimentos**. As correções puramente textuais
já foram aplicadas nos `.tex`:

- alinhado o número de tentativas do random search à tabela (10 → 5), com nota de
  verificação em comentário LaTeX;
- declarada a limitação de protocolo do grid search (seleção do fator sobre o conjunto
  de teste) e a divergência frente ao random search (validação);
- adicionada a explicação das métricas ponderadas na tabela do grid search
  (recall ponderado = acurácia), com nota de verificação em comentário LaTeX;
- justificado o espaço de busca 0,5-1,611 como escolha operacional, sem critério físico;
- adicionado à conclusão o parágrafo que posiciona os resultados frente ao estado da
  arte citado nos trabalhos relacionados (YOLOv7 93,8%; CSPD-YOLO 98,18%);
- removida toda a retórica de "dificuldade da etapa" do capítulo de metodologia e
  enxugado o bloco "Início".

Prioridade: P0 = mais crítico. Marque com `[x]` conforme concluir.

---

## P0 — Verificações factuais (precisam dos registros dos experimentos)

### 1. Tentativas do random search (5 ou 10?)
- [ ] Conferir os registros do experimento: se existiram 10 tentativas, completar a
      Tabela de busca aleatória com as 5 faltantes e restaurar o texto; se foram 5,
      apenas remover o comentário de verificação deixado no `.tex`.

### 2. Contagem de imagens do DRNPW (779 vs. 585)
- [ ] O texto informa "779 imagens processadas", mas a divisão soma 585
      (468 + 87 + 30). Explicar o destino das ~194 imagens (descarte por qualidade?
      classes excluídas? duplicatas?) ou corrigir os números.

### 3. Confirmar o cálculo das métricas do grid search
- [ ] Verificar no código se as métricas usaram de fato `average='weighted'`
      (a afirmação foi adicionada ao texto com base na coincidência exata entre
      recall e acurácia). Confirmado, remover o comentário de verificação no `.tex`.

### 4. Loss de validação anômala na busca aleatória
- [ ] Investigar a loss ~4,14 quase idêntica em todas as tentativas com acurácia
      variando de 71% a 85%. Se for erro de cálculo/registro, corrigir e reprocessar
      a tabela.

---

## P1 — Validade estatística (dependem de reexecutar experimentos)

Sem isto, as ordenações entre técnicas não se sustentam: o teste do DRNPW tem 30
imagens (1 imagem ≈ 3,3 pontos percentuais) e o do CPLID ~43.

### 5. Repetição com múltiplas sementes ou k-fold
- [ ] Adotar validação cruzada k-fold (k = 5) reusando as imagens já disponíveis,
      ou ao menos repetir cada configuração com 3 sementes.
- [ ] Reportar média e desvio-padrão por métrica, substituindo os valores únicos.
- [ ] Com a variância em mãos, aplicar teste de significância (t pareado ou
      Wilcoxon) às comparações entre técnicas próximas.

### 6. Convergência e orçamento de treino coerente
- [ ] Elevar as 5 épocas do grid search a patamar coerente com o experimento
      principal (50 épocas) ou justificar tecnicamente a diferença; usar early
      stopping.
- [ ] Justificar (ou uniformizar) a diferença de resolução entre experimentos:
      512x512 na avaliação de técnicas e 640x640 na otimização.
- [ ] Incluir curvas de treino/validação (loss e acurácia por época).

### 7. Refazer a seleção do grid search sem vazamento
- [ ] Selecionar o melhor fator pela validação e usar o teste apenas na avaliação
      final do fator escolhido (a limitação já está declarada no texto; este item
      a elimina).

---

## P2 — Lacunas de conteúdo (precisam de informação sua ou de instrumentação)

### 8. Caracterização completa do DRNPW
- [ ] Confirmar nome/significado da sigla DRNPW.
- [ ] Descrever as classes: quantas, quais falhas, distribuição por classe em
      treino/validação/teste.
- [ ] Esclarecer como as "anotações automáticas para detecção de objetos" viraram
      rótulos de classificação.

### 9. Medição do tempo de processamento
- [ ] Instrumentar os runs e reportar tempo de pré-processamento por técnica e
      tempo de inferência. É uma das três métricas declaradas da metodologia;
      medi-la remove a principal promessa não cumprida do trabalho.

### 10. Comparação entre arquiteturas (opcional, eleva o trabalho)
- [ ] Se houver folga de recurso: comparação barata via transfer learning com
      backbone congelado (MobileNet/ResNet pré-treinada, treinando só a cabeça),
      elevando o trabalho de "modelo de referência único" para "comparação".

---

## P3 — Reprodutibilidade e evidências adicionais

### 11. Reprodutibilidade
- [ ] Fixar e documentar sementes aleatórias.
- [ ] Registrar versões de bibliotecas (TensorFlow/Keras, PIL, OpenCV) e hardware.
- [ ] Disponibilizar o código (repositório ou apêndice) e tornar acessível o
      `optimization_factor_results.json` citado no texto.

### 12. Evidência a partir do que já roda
- [ ] Gerar matrizes de confusão dos experimentos já executados (basta salvar as
      predições).
- [ ] Incluir exemplos qualitativos: imagens antes/depois de cada pré-processamento
      sobre amostras reais dos dois datasets.

---

## P4 — Decisões editoriais e metadados

### 13. Revisão bibliográfica
- [ ] Decidir quanto condensar da seção de redes neurais (neurônio artificial,
      funções de ativação e custo, hoje em nível de graduação). Posso propor uma
      versão enxuta para sua aprovação.
- [ ] Substituir referências `@misc` (15 de 80) por fontes revisadas por pares
      onde a afirmação for técnica. Exige busca e conferência cuidadosa das
      fontes substitutas; as figuras retiradas de blogs/sites precisam de decisão
      sua (refazer ou manter com a fonte original).

### 14. Placeholders e metadados do template
- [ ] Substituir os placeholders da banca em `documents/main.tex`
      ("Banca Um", "Banca Dois") pelos nomes reais.
- [ ] Preencher `\areaconcentracao{CNPq}` com a área de concentração real do PPGEE.
- [ ] Gerar e incluir a ficha catalográfica (hoje `\semcatalografica`) e ativar as
      listas de figuras/tabelas exigidas pela MDT, se aplicável.

---

## Checklist de coerência final (antes de submeter)

- [ ] Toda métrica definida na metodologia é reportada nos resultados ou consta
      como limitação assumida.
- [ ] Nenhuma afirmação comparativa depende de diferenças menores que o
      desvio-padrão observado.
- [ ] Nomes, siglas, resoluções, contagens e divisões de datasets são idênticos em
      todas as ocorrências (texto, tabelas, resumo e abstract).
- [ ] Resumo e abstract refletem os números finais após as reexecuções.
- [ ] Comentários de verificação deixados nos `.tex` (buscar por "VERIFICA") foram
      resolvidos e removidos.
- [ ] Referências cruzadas (figuras, tabelas, equações) resolvem corretamente na
      compilação.

## Ordem de execução sugerida

1. Resolver as verificações factuais com os registros dos runs. [P0: 1-4]
2. Rodar k-fold (ou 3 sementes) e recalcular métricas com média e desvio. [P1: 5]
3. Uniformizar orçamento de treino, curvas e seleção sem vazamento. [P1: 6-7]
4. Caracterizar o DRNPW e medir tempo de processamento. [P2: 8-9]
5. (Opcional) comparação por transfer learning. [P2: 10]
6. Reprodutibilidade, matrizes de confusão e exemplos qualitativos. [P3: 11-12]
7. Revisão bibliográfica e metadados do template. [P4: 13-14]
8. Rodar o checklist de coerência final e recompilar.
