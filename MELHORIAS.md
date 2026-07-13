# Plano de melhorias da dissertação (itens pendentes)

Este arquivo lista apenas as melhorias que **ainda não podem ser feitas** por dependerem
de reexecutar experimentos, de recurso computacional, de informações do ambiente ou de
decisões editoriais suas. As correções que eram puramente de redação já foram aplicadas
diretamente nos arquivos `.tex` (reenquadramento de objetivo, delimitação do escopo da
metodologia, nota sobre comparação relativa e conjuntos pequenos, justificativa da CNN
rasa, correção do nome do DRNPW, moderação das afirmações de inovação, remoção do
cronograma e de citação não discutida).

Prioridade: P0 = mais crítico. Marque com `[x]` conforme concluir.

## P0 — Validade dos resultados (dependem de reexecutar experimentos)

### 1. Robustez estatística por reuso de dados
- [ ] Adotar validação cruzada k-fold (por exemplo, k = 5), que reusa as imagens já disponíveis sem coletar novos dados.
- [ ] Reportar média e desvio-padrão por métrica entre os folds, substituindo os valores únicos hoje apresentados.
- [ ] Se o k-fold completo for caro, ao menos repetir cada configuração com poucas sementes (3) sob o mesmo orçamento de épocas.
- [ ] Com a variância em mãos, aplicar um teste de significância (t pareado ou Wilcoxon) para sustentar (ou não) as comparações entre técnicas próximas. Observação: o texto já foi ajustado para tratar as diferenças como tendências; este item permite elevar a afirmação a significância estatística quando os dados existirem.

### 2. Convergência e curvas de treino
- [ ] Elevar as 5 épocas do grid search a um patamar coerente com a avaliação (ou justificar a diferença) e treinar com early stopping.
- [ ] Incluir curvas de treino/validação (loss e acurácia por época) para evidenciar convergência e comparação justa.

### 3. Investigar a inconsistência da loss na busca aleatória
- [ ] Explicar a loss de validação ~4,14 quase idêntica em todas as tentativas, com acurácia variando de 71% a 85%. Verificar se é erro de cálculo/registro.
- [ ] Corrigir e reprocessar apenas a tabela afetada, se for bug.

## P1 — Coerência entre metodologia e resultados

### 4. Comparação entre arquiteturas (objetivo do modelo)
- [ ] O texto já reenquadrou o objetivo para "modelo de referência". Se houver folga de recurso, agregar uma comparação barata via transfer learning com backbone congelado (por exemplo, MobileNet/ResNet pré-treinada, treinando só a cabeça por poucas épocas), o que elevaria o trabalho de "referência única" para "comparação".

### 5. Medição do tempo de processamento
- [ ] O texto já registra, como limitação, que o tempo não foi medido. Para removê-la, instrumentar os runs e reportar tempo de pré-processamento por técnica e tempo de inferência (medição de custo desprezível quando o pipeline roda).

## P2 — Reprodutibilidade e caracterização dos dados

### 6. Caracterização do DRNPW (precisa da sua informação)
- [ ] Confirmar o nome/significado correto da sigla DRNPW (a expansão inventada foi removida do texto; hoje consta apenas a descrição funcional).
- [ ] Informar a distribuição por classe em treino/validação/teste para cada dataset.
- [ ] Explicar por que a resolução difere entre experimentos (512x512 na avaliação de técnicas e 640x640 na otimização).

### 7. Reprodutibilidade
- [ ] Fixar e documentar as sementes aleatórias.
- [ ] Registrar versões de bibliotecas (TensorFlow/Keras, PIL, OpenCV) e o hardware usado.
- [ ] Disponibilizar o código (repositório ou apêndice) e tornar acessível o `optimization_factor_results.json`.

### 8. Evidência a partir do que já roda
- [ ] Gerar e incluir matrizes de confusão dos experimentos já executados (basta salvar as predições).
- [ ] Incluir exemplos qualitativos: imagens antes/depois de cada pré-processamento sobre amostras reais dos datasets.

## P3 — Revisão bibliográfica (decisão editorial sua)

### 9. Calibração da revisão
- [ ] Condensar a seção de redes neurais (modelo de neurônio, funções de ativação e custo), hoje em nível de graduação e extensa. Requer sua decisão sobre quanto cortar.
- [ ] Reduzir a proporção de referências `@misc` (15 de 80), trocando sites/blogs por fontes revisadas por pares. Requer buscar as fontes substitutas.

## Checklist de coerência final (antes de submeter)

- [ ] Toda métrica definida na metodologia é reportada nos resultados ou consta como limitação assumida.
- [ ] Nenhuma afirmação comparativa depende de diferenças menores que o desvio-padrão observado.
- [ ] Nomes, siglas, resoluções e tamanhos de datasets são idênticos em todas as ocorrências.
- [ ] Referências cruzadas (figuras, tabelas, equações) resolvem corretamente na compilação.

## Ordem de execução sugerida

1. Rodar k-fold (ou poucas sementes) e recalcular métricas com média e desvio. [P0: 1]
2. Elevar épocas do grid search, adicionar curvas de treino e investigar/corrigir a loss. [P0: 2, 3]
3. (Opcional) comparação por transfer learning e medição de tempo. [P1: 4, 5]
4. Uniformizar dados, reprodutibilidade, matrizes de confusão e exemplos. [P2: 6, 7, 8]
5. Revisão bibliográfica. [P3: 9]
6. Rodar o checklist de coerência final.
