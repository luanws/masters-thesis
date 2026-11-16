# Comentários do Prof. Adriano: pendências e itens conferidos

Item = número usado na conversa. Coment. = número do comentário no `reviews/Adriano.pdf`. Pág. = página desse PDF. A coluna "Onde está" tem links clicáveis para a linha do texto ou do código. Os links do código dos experimentos apontam para `E:\GitHub\drones-ia-cpfl\learn-datasets`.

Status: ✅ resolvido · ⏳ falta fazer · ❌ não será feito (exige retreinar ou refazer experimentos, ou não pede ajuste) · 🖥️ dá para resolver com acesso ao servidor

## Falta você avaliar

| Status | Item | Coment. | Pág. | Comentário | O que falta | Onde está |
|---|---|---|---|---|---|---|
| ✅ | 1 | 0 | 1 | Título "Análise de técnicas de pré-processamento" | Título trocado para "Análise de técnicas de pré-processamento de imagens aplicadas à detecção e classificação de falhas em cadeias de isoladores" | [main.tex:91](../documents/main.tex#L91) |
| ✅ | 2 | 11 | 20 | "de íris mesmo? ver" | É íris mesmo, mas a acurácia era 89,2% e não 97%. A frase do RetinexDIP também estava errada. Ambas corrigidas | [revisao_bibliografica.tex:56](../documents/chapters/revisao_bibliografica.tex#L56) |
| ✅ | 3 | 21 | 40 | Dataset do Wang et al. (2023) | O artigo não identifica o conjunto. O texto agora diz isso, informa a divisão 6:3:1 e o mAP de 58,6% | [revisao_bibliografica.tex:444](../documents/chapters/revisao_bibliografica.tex#L444) |
| ✅ | 4 | 26, 28 | 42, 44 | Poucos trabalhos, revisão fraca | 13 trabalhos novos verificados no Crossref: 6 de isoladores e 7 comparações de pré-processamento em CNNs, com casos favoráveis e contrários. Tabela comparativa e síntese atualizadas | [revisao_bibliografica.tex:442](../documents/chapters/revisao_bibliografica.tex#L442), [:468](../documents/chapters/revisao_bibliografica.tex#L468) |
| ✅ | 5 | 39, 46 | 57, 67 | Destaques sem texto | Considerado resolvido, sem alteração no texto | [Adriano.pdf](Adriano.pdf) |
| ❌ | 6 | 64 | 72 | Gráficos de treinamento por época | Precisa dos logs de treino ou de um retreino salvando o histórico. O `fit` não guarda o histórico | [coleta_e_analise_de_resultados.tex:101](../documents/chapters/coleta_e_analise_de_resultados.tex#L101), [CNN.py:144](../../../drones-ia-cpfl/learn-datasets/src/modules/models/CNN.py#L144) |
| ❌ | 7 | 65 | 75 | Por que 640×640, se antes era 512? | Justificar ou refazer com 512. O 640 é o padrão do script de otimização | [coleta_e_analise_de_resultados.tex:188](../documents/chapters/coleta_e_analise_de_resultados.tex#L188), [optimize_preprocessing_parameter.py:111](../../../drones-ia-cpfl/learn-datasets/scripts/optimize_preprocessing_parameter.py#L111) |
| ❌ | 8 | 72, 77 | 76, 77 | Por que só 5 épocas? | Justificar ou refazer com 50 | [coleta_e_analise_de_resultados.tex:192](../documents/chapters/coleta_e_analise_de_resultados.tex#L192) |
| ✅ | 9 | 78 | 77 | Onde está o `optimization_factor_results.json`? | Frase retirada | [coleta_e_analise_de_resultados.tex:233](../documents/chapters/coleta_e_analise_de_resultados.tex#L233) |
| ❌ | 10 | 85 | 82 | Por que não calcular métricas por classe? | Reavaliar os modelos guardando as predições | [coleta_e_analise_de_resultados.tex:337](../documents/chapters/coleta_e_analise_de_resultados.tex#L337), [metrics.py:37](../../../drones-ia-cpfl/learn-datasets/src/utils/metrics.py#L37) |
| ❌ | 11 | 86 | 82 | Gray Scale ajudar o YOLO é estranho | Não será ajustado: é só uma observação. Resposta para a defesa: só 3 imagens acima do piso, intervalos sobrepostos e testes diferentes por técnica | [coleta_e_analise_de_resultados.tex:376](../documents/chapters/coleta_e_analise_de_resultados.tex#L376), [:540](../documents/chapters/coleta_e_analise_de_resultados.tex#L540) |

## Resolvidos no texto, para conferir

| Status | Item | Coment. | Pág. | Comentário | Situação | Onde está |
|---|---|---|---|---|---|---|
| ✅ | 12 | 3 | 12 | Uma imagem por problema | Figura 2×2: normal e disco ausente (CPLID), corrosão e oxidação (fotos da CPFL), com o efeito de cada defeito no texto | [introducao.tex:5](../documents/chapters/introducao.tex#L5) |
| ✅ | 13 | 35 | 56 | Como decide se combina ou não? | Critério escrito (desempenho isolado e complementaridade) | [metodologia.tex:141](../documents/chapters/metodologia.tex#L141) |
| ✅ | 14 | 47 | 68 | Destaque em "(CNN)" sem texto | Redefinição da sigla retirada | [coleta_e_analise_de_resultados.tex:9](../documents/chapters/coleta_e_analise_de_resultados.tex#L9) |
| ✅ | 15 | 48, 60, 94 | 68–92 | Tamanho original, exemplos, quantidades e anotação | Resolvido com os dados do servidor: tamanho original (4000×2250), composição das 70 categorias por componente e figura com dois exemplos. Ver também o item 24 | [coleta_e_analise_de_resultados.tex:17](../documents/chapters/coleta_e_analise_de_resultados.tex#L17) |
| ❌ | 16 | 66, 83 | 75, 81 | Testes com 30 e 43 imagens | Entraram como limitação, com intervalos de confiança. Resolver de fato exige refazer os experimentos | [coleta_e_analise_de_resultados.tex:99](../documents/chapters/coleta_e_analise_de_resultados.tex#L99), [:140](../documents/chapters/coleta_e_analise_de_resultados.tex#L140), [conclusao.tex:24](../documents/chapters/conclusao.tex#L24) |
| ✅ | 17 | 67 | 75 | "um modelo ideal?" | Seção renomeada para "Configuração do Experimento" e "valor ótimo" trocado por "melhor entre os avaliados" | [coleta_e_analise_de_resultados.tex:184](../documents/chapters/coleta_e_analise_de_resultados.tex#L184), [:186](../documents/chapters/coleta_e_analise_de_resultados.tex#L186), [:251](../documents/chapters/coleta_e_analise_de_resultados.tex#L251) |
| ✅ | 18 | 88 | 88 | Overfitting, mesmo isolador em duas imagens | Confirmado no README e no artigo do CPLID: as 248 defeituosas são sintéticas. Descrição do conjunto e limitação atualizadas | [conclusao.tex:24](../documents/chapters/conclusao.tex#L24) |
| ✅ | 19 | 95–98 | 94–95 | Data de acesso das referências | Medium, Pillow e PyCaret com acesso em 16 nov. 2026 | [references.bib:149](../documents/references.bib#L149), [:859](../documents/references.bib#L859), [:909](../documents/references.bib#L909) |

## Problemas nos experimentos (prioridade)

| Status | Item | Problema | Onde está |
|---|---|---|---|
| ❌ | 20 | A divisão treino/teste é refeita a cada técnica. `split_train_val_test` chama `random.shuffle` sem semente, então cada técnica parece ter sido testada em um conjunto de teste diferente. Confirmado no servidor: as 14 técnicas da CNN têm 14 conjuntos de teste diferentes. | [preprocess.py:260](../../../drones-ia-cpfl/learn-datasets/scripts/preprocess.py#L260), [:275](../../../drones-ia-cpfl/learn-datasets/scripts/preprocess.py#L275) |
| ❌ | 21 | No CPLID, três técnicas têm o mesmo par acurácia 67,44% / F1 80,56%. Esse par é o que dá um F1 binário com o modelo respondendo sempre a mesma classe. Mas o código atual calcula as métricas com média ponderada, que nesse caso daria cerca de 54%. Falta descobrir como esses números foram gerados. | [coleta_e_analise_de_resultados.tex:97](../documents/chapters/coleta_e_analise_de_resultados.tex#L97), [metrics.py:37](../../../drones-ia-cpfl/learn-datasets/src/utils/metrics.py#L37) |
| ✅ | 22 | 8 das 14 técnicas convertem a imagem para tons de cinza (Adaptive Threshold, CLAHE, Edge Detection, Equalize Histogram e as quatro híbridas), inclusive a melhor do DRNPW. Por isso, "perder a cor" não explica o resultado ruim do Gray Scale. Corrigido no resumo, no abstract e em um parágrafo novo na discussão do YOLO, com as médias das variantes em cinza e coloridas. | [coleta_e_analise_de_resultados.tex:138](../documents/chapters/coleta_e_analise_de_resultados.tex#L138), [clahe.py:18](../../../drones-ia-cpfl/learn-datasets/src/modules/preprocessing/clahe.py#L18), [equalize.py:19](../../../drones-ia-cpfl/learn-datasets/src/modules/preprocessing/equalize.py#L19) |
| ✅ | 23 | Busca aleatória: 5 ou 10 tentativas? O JSON salvo no servidor foi configurado com 10, mas registra só 5, com os mesmos fatores da dissertação. O texto (5 tentativas) está correto. | [coleta_e_analise_de_resultados.tex:253](../documents/chapters/coleta_e_analise_de_resultados.tex#L253), [relatorio_otimizacao_2.md:23](../../../drones-ia-cpfl/learn-datasets/reports/relatorio_otimizacao_2.md#L23) |
| ⏳ | 24 | O DRNPW não é um conjunto de isoladores: 78,8% das 779 imagens são de estrutura de aço (73,3% só "peças oxidadas") e só 4,2% são de isoladores. A descrição do conjunto já foi corrigida, mas outros trechos ainda tratam o DRNPW como "imagens de isoladores" (resumo, discussão dos resultados, busca em grade e conclusão). Falta decidir como reapresentar o DRNPW no restante do texto. | [coleta_e_analise_de_resultados.tex:17](../documents/chapters/coleta_e_analise_de_resultados.tex#L17) |
