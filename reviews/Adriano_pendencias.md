# Comentários do Prof. Adriano: status

Página = página do `reviews/Adriano.pdf`. Status: ✅ resolvido no texto · 🟡 resolvido, mas confira · ⏳ falta você avaliar.

## Pendências (⏳)

| # | Pág. | Comentário | O que falta decidir ou fazer |
|---|---|---|---|
| 0 | 1 | Título: "Análise de técnicas de pré-processamento" | Trocar o título é decisão sua e do orientador (afeta capa, resumo, ficha). Sugestão: "Análise de técnicas de pré-processamento de imagens aplicadas à classificação de falhas em cadeias de isoladores". |
| 3 | 12 | Uma imagem por problema na introdução | Entrou figura com isolador normal e com disco ausente (CPLID). Faltam fotos de trinca, contaminação e perfuração. Há fotos de corrosão/oxidação da CPFL em `presentation/assets`, mas usar na dissertação depende de autorização. |
| 11 | 20 | "melhorar imagens de íris, mesmo?" | Conferir no artigo de Sharma et al. (2024) se o exemplo é mesmo de íris. |
| 21 | 40 | Dataset do Wang et al. (2023) | Conferir no artigo qual conjunto gerou os 85,3%. |
| 26, 28 | 42, 44 | Poucos trabalhos e related works fraco | A seção foi reorganizada por critério, mas faltam mais trabalhos de pré-processamento, inclusive de outros domínios. Precisa de pesquisa bibliográfica. |
| 39, 46, 47 | 57, 67, 68 | Destaques sem texto | Sem comentário escrito. No 47 assumi "CNN redefinida" e tirei a redefinição. Nos outros dois não mexi. |
| 48 | 68 | Tamanho original das imagens | CPLID (1152×864) entrou. Falta o tamanho original das imagens do DRNPW (o servidor estava fora do ar). |
| 60, 94 | 71, 92 | Exemplos e quantidades por classe, como foi anotado | CPLID entrou (600/248, VOC). Faltam exemplo de imagem do DRNPW e a lista/quantidade das 70 categorias (o que é cada categoria). |
| 64 | 72 | Gráficos de treinamento por época | Precisa dos logs de treino (histórico de loss/acurácia). Se não houver, retreinar salvando o histórico. |
| 65 | 75 | Por que 640×640 na busca, se antes era 512? | O código usa 640 como padrão do script de otimização. Precisa de justificativa sua ou de refazer com 512. |
| 66, 83 | 75, 81 | Testes muito pequenos (30 e 43 imagens) | Texto agora assume a limitação e traz intervalos de confiança. Resolver de fato exige refazer com validação cruzada. |
| 72, 77 | 76, 77 | Por que só 5 épocas? | Precisa de justificativa sua ou de refazer a busca com 50 épocas. |
| 78 | 77 | Onde está `optimization_factor_results.json`? | Indicar o local (repositório público, apêndice) ou remover a frase. |
| 85 | 82 | Por que não métricas por classe? | Exige rodar a avaliação de novo guardando as predições. |
| 86 | 82 | Gray Scale ajudar o YOLO é estranho | Ver os achados abaixo. A explicação depende de você. |
| 88 | 88 | Overfitting e mesmo isolador em duas imagens | Entrou como limitação. Ver o achado sobre o CPLID abaixo. |

## Achados no código dos experimentos (`drones-ia-cpfl/learn-datasets`)

1. **A divisão treino/validação/teste é refeita a cada técnica.** `scripts/preprocess.py` chama `random.shuffle` sem semente em `split_train_val_test`, e o pré-processamento roda uma vez por técnica. Assim, cada técnica foi testada em um conjunto de teste diferente. Isso enfraquece a comparação entre técnicas e o "piso majoritário".
2. **As métricas da CNN no CPLID parecem binárias, não ponderadas.** O F1 maior que a acurácia (ex.: 67,44% / 80,56%) só fecha com precisão = 67,44% e recall = 100%, isto é, F1 binário com o modelo respondendo uma classe só. O texto da Seção do YOLO dizia que o critério ponderado era "mantido em relação às avaliações anteriores". Tirei essa frase, mas convém confirmar como a CNN calculou as métricas.
3. **Oito das 14 técnicas convertem a imagem para tons de cinza** (Adaptive Threshold, CLAHE, Edge Detection, Equalize Histogram e as quatro híbridas). Isso agora está no texto e derruba a explicação de que o Gray Scale foi mal "por perder a cor": a melhor técnica do DRNPW também é em tons de cinza.
4. **Pesos do YOLOv8n-cls**: o texto dizia COCO, mas os modelos `-cls` da Ultralytics são pré-treinados no ImageNet. Corrigido.
5. **Busca aleatória**: o relatório `reports/relatorio_otimizacao_2.md` fala em 10 tentativas, a dissertação em 5. Conferir.
6. **CPLID**: pela descrição do conjunto, as imagens defeituosas foram geradas por aumento de dados a partir de poucos isoladores reais. Se confirmado, o mesmo isolador pode estar no treino e no teste (comentário 88).
