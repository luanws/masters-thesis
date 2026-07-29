# Relatório completo de resultados — 29/07/2026

Comparação de três modelos sobre os datasets pré-processados do projeto. Todos os números vêm dos arquivos em `results/` e `runs/trains/`; nada foi transcrito à mão.

## Resumo

| Dataset | Piso | CNN | YOLO | YOLOCLS |
|---|---|---|---|---|
| CPLID | 0.7442 | 0.8455 | 0.7010 | 0.6628 |
| DRNPW | 0.7333 | 0.7381 | 0.7119 | 0.7143 |

O *piso* é a acurácia de responder sempre a classe majoritária do conjunto de teste, sem olhar a imagem. Qualquer modelo abaixo dele não aprendeu nada de aproveitável. Os valores são a média da acurácia sobre os 14 pré-processamentos.

---

## Contexto do treinamento

### Ambiente

| | |
|---|---|
| Processador | Intel Xeon E5-1650 v4 @ 3.60 GHz |
| GPU | **não utilizada** — a Quadro M4000 do host não é repassada ao container; o torch reporta `CUDA driver is a stub library` e cai para CPU |
| Ambiente | container Docker `learn-datasets-dev`, Python 3.11.15, torch 2.9.1, ultralytics 8.4.106 |

Todo o treinamento rodou em CPU. Isso não muda a qualidade final dos modelos, mas explica os tempos e limita, na prática, experimentar resoluções ou lotes maiores.

### Datasets

| Dataset | Treino | Validação | Teste | Classes | Composição do teste |
|---|---|---|---|---|---|
| CPLID | 678 | 127 | 43 | 2 | 32 de 43 são `Normal_Insulators` |
| DRNPW | 468 | 87 | 30 | 70 | 22 de 30 são `ESTRUTURA DE ACO-PECAS-OXIDADAS` |

Cada imagem tem exatamente uma anotação, então os dois datasets são, na prática, problemas de classificação — mesmo o DRNPW, cujos rótulos estão em formato de caixa delimitadora.

Duas assimetrias importantes:

- **CPLID** é binário (`Defective_Insulators` / `Normal_Insulators`) e razoavelmente equilibrado no treino, mas o teste tem 32 imagens de uma classe contra 11 da outra.
- **DRNPW** declara 70 classes, das quais apenas 59 aparecem no treino. Das 468 imagens de treino, 335 pertencem a uma única classe; as outras 58 classes dividem 133 imagens, várias com um ou dois exemplos. O teste tem 30 imagens em 7 classes.

### Pré-processamentos

Os mesmos 14 pré-processamentos foram aplicados a cada dataset: `AdaptiveThreshold`, `CLAHE`, `CLAHEAndContrastEnhancement`, `ContrastEnhancement`, `ContrastEnhancementAndCLAHE`, `ContrastEnhancementAndEqualizeHistogram`, `Denoise`, `EdgeDetection`, `EqualizeHistogram`, `EqualizeHistogramAndContrastEnhancement`, `GaussianBlur`, `GrayScale`, `MedianBlur`, `OriginalImage`.

`OneColorPreprocessing` existe no projeto mas não gerou resultado em nenhuma combinação.

### Execuções

| Modelo | Épocas | Quando | Comando |
|---|---|---|---|
| CNN | 50 | out/2025 – fev/2026 | `commands.py scripts.train ... --model-title=CNN --epochs=50` |
| YOLO | 50 | 28/07/2026, manhã | `commands.py scripts.train ... --model-title=YOLO --epochs=50` |
| YOLOCLS | 50 | 28/07/2026, noite | `commands.py scripts.train ... --model-title=YOLOCLS --epochs=50` |

Os três usaram 50 épocas. As varreduras foram disparadas com `commands.py`, que expande os `*` de `--dataset-name`, `--preprocessing-title` e `--model-title` no produto cartesiano e executa as combinações em sequência.

**Ressalva:** a coluna da CNN não foi regerada junto com as outras duas. Os modelos e as métricas da CNN são de execuções anteriores, entre julho de 2024 e fevereiro de 2026. A seção [Validade da comparação](#validade-da-comparação) detalha o que isso compromete.

### Tempo de treino

| Modelo | Tempo por combinação (50 épocas) | Por época |
|---|---|---|
| YOLO | ~97 min | ~117 s |
| YOLOCLS | ~9 min | ~10 s |

O detector é cerca de dez vezes mais caro que o classificador: resolução de 640 px contra 224 px, e uma cabeça de detecção que precisa prever caixas além das classes.

---

## Como cada modelo funciona

### CNN

Rede convolucional escrita no projeto, em Keras — [`src/modules/models/CNN.py`](../src/modules/models/CNN.py).

```
InputLayer
Conv2D(32, 3x3, relu)  ->  MaxPooling2D(4x4)
Conv2D(32, 3x3, relu)  ->  MaxPooling2D(4x4)
Flatten
Dense(8, relu)
Dense(n_classes, softmax)
```

Otimizador `adam`, perda `sparse_categorical_crossentropy`. O treino usa aumento de dados: rotação de até 360°, deslocamento de 10% na horizontal e vertical, e espelhamento nos dois eixos.

É um modelo pequeno — duas convoluções e uma camada densa de 8 unidades. Recebe a imagem inteira e devolve uma distribuição sobre as classes; a predição é o `argmax`. O rótulo verdadeiro vem do campo `category` do dataset.

### YOLO

Detector `yolov8n` da ultralytics, partindo dos pesos COCO — [`src/modules/models/YOLO.py`](../src/modules/models/YOLO.py).

| | |
|---|---|
| Pesos iniciais | `yolov8n.pt` (pré-treinado em COCO) |
| Parâmetros | 3.066.494 |
| Resolução | 640 px |
| Lote | 16 |
| Otimizador | `auto`, `lr0 = 0.01` |

É o único dos três que resolve um problema diferente: além de dizer **o que** está na imagem, precisa dizer **onde**. Para que o resultado seja comparável com os outros dois, a predição é reduzida a uma classe por imagem — a da caixa de maior confiança. Imagens sem nenhuma detecção recebem uma classe extra, `SEM DETECCAO`, que conta como erro.

A redução usa limiar de confiança de 0,001 em vez do padrão 0,25. Com o padrão, o modelo não produz detecção alguma na maior parte das imagens de teste, e todas as métricas iriam a zero por limiar, não por qualidade.

**Essa redução é generosa com o modelo**: ela ignora completamente se a caixa está no lugar certo. A qualidade real da detecção está na tabela abaixo, e é ruim:

| Dataset | mAP50 (faixa entre os 14 pré-processamentos) |
|---|---|
| CPLID | 0.0644 – 0.1272 |
| DRNPW | 0.0014 – 0.0537 |

Um detector utilizável fica acima de 0,6. Estes estão uma a duas ordens de grandeza abaixo, ou seja: o modelo praticamente não localiza nada.

### YOLOCLS

`yolov8n-cls`, a mesma família em modo de classificação — [`src/modules/models/YOLOCLS.py`](../src/modules/models/YOLOCLS.py). Foi criado justamente para isolar a variável: mesma arquitetura-base da YOLO, mesma tarefa da CNN, sem caixa nenhuma.

| | |
|---|---|
| Pesos iniciais | `yolov8n-cls.pt` |
| Parâmetros | 1.437.442 |
| Resolução | 224 px |
| Lote | 16 |
| Otimizador | `auto`, `lr0 = 0.01` |

No modo de classificação a ultralytics não lê `images/` + `labels/`, e sim um diretório por classe. O modelo deriva essa estrutura a partir dos rótulos existentes, com links simbólicos, sem duplicar imagens em disco. Dois cuidados foram necessários:

- As classes são numeradas pela ordem alfabética dos diretórios de cada split. Se validação e treino não tiverem exatamente o mesmo conjunto de classes, os índices se deslocam e a validação vira ruído. Classes que só aparecem na validação são descartadas; as que só aparecem no treino são preenchidas com uma imagem de treino.
- O split de teste não entra nessa estrutura. As métricas reportadas saem das imagens originais.

Acurácia top-1 na validação interna, ao fim das 50 épocas:

| Dataset | top-1 (faixa entre os 14 pré-processamentos) |
|---|---|
| CPLID | 0.5591 – 0.6772 |
| DRNPW | 0.5041 – 0.5798 |

Esse número é otimista: a validação foi completada com imagens de treino nas classes ausentes. Vale como indicativo de convergência, não como resultado.

### Como as métricas são calculadas

Os três modelos passam pela mesma classe [`Metrics`](../src/utils/metrics.py), que usa média **ponderada** pelo suporte de cada classe (`average="weighted"` do scikit-learn).

Uma consequência dessa escolha vale registrar: com média ponderada o **recall é sempre igual à acurácia**, por definição. Qualquer arquivo em que os dois diferem foi gerado por uma versão anterior do código e não é comparável — estão marcados com ⚠️ nas tabelas.

---

## Resultados

### CPLID

Teste com **43 imagens**, das quais **32 são `Normal_Insulators`** — piso de **0.7442**.

#### CNN

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| AdaptiveThreshold | 0.6744 | 0.6744 | 1.0000 | 0.8056 | 2024-07-15 23:53 ⚠️ |
| CLAHE | 0.9070 | 0.9143 | 0.9697 | 0.9412 | 2025-09-22 23:16 ⚠️ |
| **CLAHEAndContrastEnhancement** | 0.9535 | 0.9535 | 0.9535 | 0.9535 | 2026-07-26 16:24 |
| **ContrastEnhancement** | 0.9535 | 0.9655 | 0.9655 | 0.9655 | 2024-07-15 23:53 ⚠️ |
| ContrastEnhancementAndCLAHE | 0.9302 | 0.9298 | 0.9302 | 0.9294 | 2025-09-23 13:32 |
| **ContrastEnhancementAndEqualizeHistogram** | 0.9535 | 0.9561 | 0.9535 | 0.9516 | 2025-10-06 22:14 |
| Denoise | 0.6744 | 0.6744 | 1.0000 | 0.8056 | 2024-07-15 23:53 ⚠️ |
| EdgeDetection | 0.7442 | 0.7442 | 1.0000 | 0.8533 | 2024-07-15 23:54 ⚠️ |
| EqualizeHistogram | 0.8837 | 0.8611 | 1.0000 | 0.9254 | 2024-07-15 23:54 ⚠️ |
| EqualizeHistogramAndContrastEnhancement | 0.9302 | 0.9325 | 0.9302 | 0.9308 | 2025-10-06 22:15 |
| GaussianBlur | 0.6744 | 0.6744 | 1.0000 | 0.8056 | 2024-07-15 23:53 ⚠️ |
| GrayScale | 0.7674 | 0.7436 | 1.0000 | 0.8529 | 2024-07-15 23:53 ⚠️ |
| MedianBlur | 0.8605 | 0.9583 | 0.8214 | 0.8846 | 2024-07-15 23:53 ⚠️ |
| OriginalImage | 0.9302 | 0.9062 | 1.0000 | 0.9508 | 2024-07-15 23:54 ⚠️ |
| **média** | 0.8455 | 0.8492 | 0.9660 | 0.8968 | |
| *piso* | *0.7442* | | | | |

⚠️ 10 das 14 linhas acima foram geradas antes da troca de `average="binary"` para `"weighted"` (ago/2024). A acurácia não é afetada pela mudança, mas precisão, recall e F1 — inclusive na linha de média — misturam duas definições.

#### YOLO

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| AdaptiveThreshold | 0.6512 | 0.4240 | 0.6512 | 0.5136 | 2026-07-28 14:07 |
| CLAHE | 0.6512 | 0.4240 | 0.6512 | 0.5136 | 2026-07-28 14:05 |
| CLAHEAndContrastEnhancement | 0.5581 | 0.3115 | 0.5581 | 0.3999 | 2026-07-28 14:06 |
| ContrastEnhancement | 0.6744 | 0.4817 | 0.6744 | 0.5620 | 2026-07-28 14:06 |
| ContrastEnhancementAndCLAHE | 0.7209 | 0.5197 | 0.7209 | 0.6040 | 2026-07-28 14:08 |
| ContrastEnhancementAndEqualizeHistogram | 0.6512 | 0.4240 | 0.6512 | 0.5136 | 2026-07-28 14:06 |
| Denoise | 0.7209 | 0.5197 | 0.7209 | 0.6040 | 2026-07-28 14:05 |
| EdgeDetection | 0.6744 | 0.4548 | 0.6744 | 0.5433 | 2026-07-28 14:07 |
| **EqualizeHistogram** | 0.7907 | 0.6252 | 0.7907 | 0.6983 | 2026-07-28 14:06 |
| EqualizeHistogramAndContrastEnhancement | 0.7674 | 0.5890 | 0.7674 | 0.6665 | 2026-07-28 14:07 |
| GaussianBlur | 0.7674 | 0.5890 | 0.7674 | 0.6665 | 2026-07-28 14:05 |
| **GrayScale** | 0.7907 | 0.6252 | 0.7907 | 0.6983 | 2026-07-28 14:08 |
| MedianBlur | 0.7442 | 0.5538 | 0.7442 | 0.6350 | 2026-07-28 14:04 |
| OriginalImage | 0.6512 | 0.4240 | 0.6512 | 0.5136 | 2026-07-28 14:05 |
| **média** | 0.7010 | 0.4976 | 0.7010 | 0.5809 | |
| *piso* | *0.7442* | | | | |

#### YOLOCLS

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| AdaptiveThreshold | 0.5581 | 0.4007 | 0.5581 | 0.4665 | 2026-07-28 22:32 |
| CLAHE | 0.6047 | 0.4129 | 0.6047 | 0.4907 | 2026-07-28 22:31 |
| CLAHEAndContrastEnhancement | 0.5116 | 0.4490 | 0.5116 | 0.4367 | 2026-07-28 22:31 |
| ContrastEnhancement | 0.5814 | 0.5621 | 0.5814 | 0.5707 | 2026-07-28 22:31 |
| ContrastEnhancementAndCLAHE | 0.6977 | 0.6428 | 0.6977 | 0.6508 | 2026-07-28 22:32 |
| ContrastEnhancementAndEqualizeHistogram | 0.6279 | 0.5836 | 0.6279 | 0.5835 | 2026-07-28 22:32 |
| Denoise | 0.7209 | 0.5197 | 0.7209 | 0.6040 | 2026-07-28 22:31 |
| EdgeDetection | 0.6744 | 0.4548 | 0.6744 | 0.5433 | 2026-07-28 22:32 |
| EqualizeHistogram | 0.7209 | 0.6128 | 0.7209 | 0.6625 | 2026-07-28 22:31 |
| EqualizeHistogramAndContrastEnhancement | 0.7442 | 0.6723 | 0.7442 | 0.6876 | 2026-07-28 22:32 |
| GaussianBlur | 0.7442 | 0.6989 | 0.7442 | 0.7106 | 2026-07-28 22:30 |
| **GrayScale** | 0.8140 | 0.8494 | 0.8140 | 0.7493 | 2026-07-28 22:32 |
| MedianBlur | 0.6744 | 0.6312 | 0.6744 | 0.6478 | 2026-07-28 22:30 |
| OriginalImage | 0.6047 | 0.4129 | 0.6047 | 0.4907 | 2026-07-28 22:31 |
| **média** | 0.6628 | 0.5645 | 0.6628 | 0.5925 | |
| *piso* | *0.7442* | | | | |

#### Comparativo

| Pré-processamento | CNN (acurácia) | YOLO (acurácia) | YOLOCLS (acurácia) | CNN (F1) | YOLO (F1) | YOLOCLS (F1) |
|---|---|---|---|---|---|---|
| AdaptiveThreshold | **0.6744** | 0.6512 | 0.5581 | **0.8056** | 0.5136 | 0.4665 |
| CLAHE | **0.9070** | 0.6512 | 0.6047 | **0.9412** | 0.5136 | 0.4907 |
| CLAHEAndContrastEnhancement | **0.9535** | 0.5581 | 0.5116 | **0.9535** | 0.3999 | 0.4367 |
| ContrastEnhancement | **0.9535** | 0.6744 | 0.5814 | **0.9655** | 0.5620 | 0.5707 |
| ContrastEnhancementAndCLAHE | **0.9302** | 0.7209 | 0.6977 | **0.9294** | 0.6040 | 0.6508 |
| ContrastEnhancementAndEqualizeHistogram | **0.9535** | 0.6512 | 0.6279 | **0.9516** | 0.5136 | 0.5835 |
| Denoise | 0.6744 | **0.7209** | **0.7209** | **0.8056** | 0.6040 | 0.6040 |
| EdgeDetection | **0.7442** | 0.6744 | 0.6744 | **0.8533** | 0.5433 | 0.5433 |
| EqualizeHistogram | **0.8837** | 0.7907 | 0.7209 | **0.9254** | 0.6983 | 0.6625 |
| EqualizeHistogramAndContrastEnhancement | **0.9302** | 0.7674 | 0.7442 | **0.9308** | 0.6665 | 0.6876 |
| GaussianBlur | 0.6744 | **0.7674** | 0.7442 | **0.8056** | 0.6665 | 0.7106 |
| GrayScale | 0.7674 | 0.7907 | **0.8140** | **0.8529** | 0.6983 | 0.7493 |
| MedianBlur | **0.8605** | 0.7442 | 0.6744 | **0.8846** | 0.6350 | 0.6478 |
| OriginalImage | **0.9302** | 0.6512 | 0.6047 | **0.9508** | 0.5136 | 0.4907 |
| **média** | 0.8455 | 0.7010 | 0.6628 | 0.8968 | 0.5809 | 0.5925 |

### DRNPW

Teste com **30 imagens**, das quais **22 são `ESTRUTURA DE ACO-PECAS-OXIDADAS`** — piso de **0.7333**.

#### CNN

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| AdaptiveThreshold | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2025-10-02 18:07 |
| CLAHE | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2025-10-02 18:07 |
| CLAHEAndContrastEnhancement | 0.7000 | 0.4900 | 0.7000 | 0.5765 | 2025-10-06 22:13 |
| ContrastEnhancement | 0.6333 | 0.4011 | 0.6333 | 0.4912 | 2026-02-22 18:33 |
| ContrastEnhancementAndCLAHE | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2025-10-02 18:09 |
| **ContrastEnhancementAndEqualizeHistogram** | 0.8333 | 0.6944 | 0.8333 | 0.7576 | 2025-10-06 22:14 |
| Denoise | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2025-10-02 18:04 |
| EdgeDetection | 0.6667 | 0.4444 | 0.6667 | 0.5333 | 2025-10-02 18:04 |
| EqualizeHistogram | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2025-10-02 18:06 |
| EqualizeHistogramAndContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2025-10-06 22:15 |
| GaussianBlur | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2025-10-02 18:02 |
| GrayScale | 0.6333 | 0.4011 | 0.6333 | 0.4912 | 2025-10-02 18:08 |
| MedianBlur | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2025-10-02 18:01 |
| OriginalImage | 0.6333 | 0.4011 | 0.6333 | 0.4912 | 2025-10-02 18:03 |
| **média** | 0.7381 | 0.5495 | 0.7381 | 0.6287 | |
| *piso* | *0.7333* | | | | |

#### YOLO

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| **AdaptiveThreshold** | 0.8333 | 0.6944 | 0.8333 | 0.7576 | 2026-07-28 14:04 |
| CLAHE | 0.7000 | 0.6696 | 0.7000 | 0.6844 | 2026-07-28 14:01 |
| CLAHEAndContrastEnhancement | 0.7667 | 0.6345 | 0.7667 | 0.6943 | 2026-07-28 14:02 |
| ContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2026-07-28 14:02 |
| ContrastEnhancementAndCLAHE | 0.7000 | 0.6192 | 0.7000 | 0.6571 | 2026-07-28 14:04 |
| ContrastEnhancementAndEqualizeHistogram | 0.5333 | 0.2844 | 0.5333 | 0.3710 | 2026-07-28 14:03 |
| Denoise | 0.6333 | 0.4368 | 0.6333 | 0.5170 | 2026-07-28 14:01 |
| EdgeDetection | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 14:03 |
| EqualizeHistogram | 0.7000 | 0.4900 | 0.7000 | 0.5765 | 2026-07-28 14:02 |
| EqualizeHistogramAndContrastEnhancement | 0.6667 | 0.4444 | 0.6667 | 0.5333 | 2026-07-28 14:03 |
| GaussianBlur | 0.6667 | 0.4444 | 0.6667 | 0.5333 | 2026-07-28 14:00 |
| GrayScale | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2026-07-28 14:04 |
| MedianBlur | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 14:00 |
| OriginalImage | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 14:01 |
| **média** | 0.7119 | 0.5399 | 0.7119 | 0.6116 | |
| *piso* | *0.7333* | | | | |

#### YOLOCLS

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| **AdaptiveThreshold** | 0.8333 | 0.6944 | 0.8333 | 0.7576 | 2026-07-28 22:30 |
| CLAHE | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 22:29 |
| CLAHEAndContrastEnhancement | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2026-07-28 22:29 |
| ContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2026-07-28 22:29 |
| ContrastEnhancementAndCLAHE | 0.7667 | 0.5878 | 0.7667 | 0.6654 | 2026-07-28 22:30 |
| ContrastEnhancementAndEqualizeHistogram | 0.5333 | 0.2844 | 0.5333 | 0.3710 | 2026-07-28 22:29 |
| Denoise | 0.6333 | 0.4368 | 0.6333 | 0.5170 | 2026-07-28 22:29 |
| EdgeDetection | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 22:29 |
| EqualizeHistogram | 0.7000 | 0.4900 | 0.7000 | 0.5765 | 2026-07-28 22:29 |
| EqualizeHistogramAndContrastEnhancement | 0.6667 | 0.4444 | 0.6667 | 0.5333 | 2026-07-28 22:30 |
| GaussianBlur | 0.6333 | 0.4368 | 0.6333 | 0.5170 | 2026-07-28 22:28 |
| GrayScale | 0.8000 | 0.6400 | 0.8000 | 0.7111 | 2026-07-28 22:30 |
| MedianBlur | 0.7333 | 0.5378 | 0.7333 | 0.6205 | 2026-07-28 22:28 |
| OriginalImage | 0.6667 | 0.5238 | 0.6667 | 0.5867 | 2026-07-28 22:28 |
| **média** | 0.7143 | 0.5271 | 0.7143 | 0.6053 | |
| *piso* | *0.7333* | | | | |

#### Comparativo

| Pré-processamento | CNN (acurácia) | YOLO (acurácia) | YOLOCLS (acurácia) | CNN (F1) | YOLO (F1) | YOLOCLS (F1) |
|---|---|---|---|---|---|---|
| AdaptiveThreshold | 0.7333 | **0.8333** | **0.8333** | 0.6205 | **0.7576** | **0.7576** |
| CLAHE | **0.8000** | 0.7000 | 0.7333 | **0.7111** | 0.6844 | 0.6205 |
| CLAHEAndContrastEnhancement | 0.7000 | 0.7667 | **0.8000** | 0.5765 | 0.6943 | **0.7111** |
| ContrastEnhancement | 0.6333 | **0.7667** | **0.7667** | 0.4912 | **0.6654** | **0.6654** |
| ContrastEnhancementAndCLAHE | **0.8000** | 0.7000 | 0.7667 | **0.7111** | 0.6571 | 0.6654 |
| ContrastEnhancementAndEqualizeHistogram | **0.8333** | 0.5333 | 0.5333 | **0.7576** | 0.3710 | 0.3710 |
| Denoise | **0.7667** | 0.6333 | 0.6333 | **0.6654** | 0.5170 | 0.5170 |
| EdgeDetection | 0.6667 | **0.7333** | **0.7333** | 0.5333 | **0.6205** | **0.6205** |
| EqualizeHistogram | **0.8000** | 0.7000 | 0.7000 | **0.7111** | 0.5765 | 0.5765 |
| EqualizeHistogramAndContrastEnhancement | **0.7667** | 0.6667 | 0.6667 | **0.6654** | 0.5333 | 0.5333 |
| GaussianBlur | **0.7667** | 0.6667 | 0.6333 | **0.6654** | 0.5333 | 0.5170 |
| GrayScale | 0.6333 | **0.8000** | **0.8000** | 0.4912 | **0.7111** | **0.7111** |
| MedianBlur | **0.8000** | 0.7333 | 0.7333 | **0.7111** | 0.6205 | 0.6205 |
| OriginalImage | 0.6333 | **0.7333** | 0.6667 | 0.4912 | **0.6205** | 0.5867 |
| **média** | 0.7381 | 0.7119 | 0.7143 | 0.6287 | 0.6116 | 0.6053 |

### INSPLAD

#### CNN

| Pré-processamento | Acurácia | Precisão | Recall | F1 | Gerado em |
|---|---|---|---|---|---|
| AdaptiveThreshold | 0.3846 | 0.6913 | 0.3846 | 0.2285 | 2024-08-07 23:26 |
| CLAHE | 0.4487 | 0.2013 | 0.4487 | 0.2780 | 2024-08-07 23:26 |
| ContrastEnhancement | 0.5128 | 0.2630 | 0.5128 | 0.3477 | 2024-08-07 23:26 |
| Denoise | 0.5385 | 0.5117 | 0.5385 | 0.4979 | 2024-08-07 23:26 |
| EdgeDetection | 0.4615 | 0.2130 | 0.4615 | 0.2915 | 2024-08-07 23:27 |
| EqualizeHistogram | 0.5000 | 0.2500 | 0.5000 | 0.3333 | 2024-08-07 23:27 |
| GaussianBlur | 0.4872 | 0.2373 | 0.4872 | 0.3192 | 2024-08-07 23:26 |
| GrayScale | 0.5513 | 0.3039 | 0.5513 | 0.3918 | 2024-08-07 23:26 |
| MedianBlur | 0.4872 | 0.2373 | 0.4872 | 0.3192 | 2024-08-07 23:27 |
| **OriginalImage** | 0.6026 | 0.3631 | 0.6026 | 0.4531 | 2024-08-07 23:27 |
| **média** | 0.4974 | 0.3272 | 0.4974 | 0.3460 | |

---

## Análise

### CPLID

| Modelo | Acurácia média | Supera o piso em |
|---|---|---|
| CNN | 0.8455 | 10/14 |
| YOLO | 0.7010 | 4/14 |
| YOLOCLS | 0.6628 | 1/14 |
| *piso* | *0.7442* | |

### DRNPW

| Modelo | Acurácia média | Supera o piso em |
|---|---|---|
| CNN | 0.7381 | 8/14 |
| YOLO | 0.7119 | 4/14 |
| YOLOCLS | 0.7143 | 5/14 |
| *piso* | *0.7333* | |

### YOLO e YOLOCLS convergem para a mesma solução

- **CPLID**: resultado idêntico nas quatro métricas em **2 de 14** pré-processamentos (`Denoise`, `EdgeDetection`).
- **DRNPW**: resultado idêntico nas quatro métricas em **9 de 14** pré-processamentos (`AdaptiveThreshold`, `ContrastEnhancement`, `ContrastEnhancementAndEqualizeHistogram`, `Denoise`, `EdgeDetection`, `EqualizeHistogram`, `EqualizeHistogramAndContrastEnhancement`, `GrayScale`, `MedianBlur`).

São arquiteturas diferentes, com resoluções diferentes, treinadas em execuções separadas. Números iguais até a última casa decimal indicam que ambas colapsaram na mesma predição degenerada — tipicamente responder a classe majoritária — e não que aprenderam a mesma coisa.

### O que isso significa

**No DRNPW, nenhum dos três modelos aprendeu.** As três médias ficam a poucos milésimos do piso. Com 70 classes declaradas, 468 imagens de treino e 335 delas numa única classe, não há dados suficientes para as classes da cauda — várias têm um ou dois exemplos.

**No CPLID, só a CNN saiu do piso.** A YOLO e a YOLOCLS ficaram, na média, abaixo de responder sempre `Normal_Insulators`.

**A hipótese de que o problema era o objetivo de detecção não se sustentou.** O YOLOCLS foi criado para testar exatamente isso: mesma família de modelo, tarefa de classificação pura. O resultado no CPLID não melhorou — piorou um pouco. A explicação precisa estar em outro lugar: no tamanho dos conjuntos, no desbalanceamento, ou na interação entre os pré-processamentos e os pesos pré-treinados em COCO.

---

## Validade da comparação

Quatro pontos limitam o que se pode concluir destes números.

**1. A coluna da CNN não foi regerada.** As varreduras recentes rodaram apenas `YOLO` e `YOLOCLS`. Os resultados da CNN vêm de execuções entre julho de 2024 e fevereiro de 2026:

| Dataset | Modelo | Execuções | Mais antiga | Mais recente |
|---|---|---|---|---|
| CPLID | CNN | 14 | 2024-07-15 23:53 | 2026-07-26 16:24 |
| CPLID | YOLO | 14 | 2026-07-28 14:04 | 2026-07-28 14:08 |
| CPLID | YOLOCLS | 14 | 2026-07-28 22:30 | 2026-07-28 22:32 |
| DRNPW | CNN | 14 | 2025-10-02 18:01 | 2026-02-22 18:33 |
| DRNPW | YOLO | 14 | 2026-07-28 14:00 | 2026-07-28 14:04 |
| DRNPW | YOLOCLS | 14 | 2026-07-28 22:28 | 2026-07-28 22:30 |
| INSPLAD | CNN | 10 | 2024-08-07 23:26 | 2024-08-07 23:27 |

**2. 10 resultados usam outra definição de métrica.** São arquivos anteriores à troca de `average="binary"` para `"weighted"`, em agosto de 2024, identificáveis pelo `recall` diferente da acurácia. Não são comparáveis com os demais: `CPLID/AdaptiveThreshold/CNN`, `CPLID/CLAHE/CNN`, `CPLID/ContrastEnhancement/CNN`, `CPLID/Denoise/CNN`, `CPLID/EdgeDetection/CNN`, `CPLID/EqualizeHistogram/CNN`, `CPLID/GaussianBlur/CNN`, `CPLID/GrayScale/CNN`, `CPLID/MedianBlur/CNN`, `CPLID/OriginalImage/CNN`.

Isso atinge boa parte da coluna da CNN no CPLID, incluindo alguns dos valores mais altos da tabela.

**3. Os conjuntos de teste são pequenos.** Com 43 imagens no CPLID, cada acerto vale 2,3 pontos percentuais; com 30 no DRNPW, 3,3 pontos. Diferenças de poucos pontos entre modelos estão dentro do ruído de duas ou três imagens.

**4. A métrica ponderada esconde o desbalanceamento.** Acurácia e recall ponderados premiam acertar a classe majoritária. `f1_macro` ou acurácia balanceada separariam modelo de chute com muito mais clareza, e seriam o próximo passo natural para este conjunto de experimentos.

---

*Relatório gerado automaticamente a partir de `results/` e `runs/trains/` em 29/07/2026.*