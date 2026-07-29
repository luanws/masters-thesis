# Relatório de resultados

Conteúdo dos arquivos `metrics.json` em `results/`, lidos em 29/07/2026. Uma tabela por modelo, em cada dataset. Os valores são exatamente os que estão nos arquivos.

---

## CPLID

### CNN

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.6744 | 0.6744 | 1.0000 | 0.8056 |
| CLAHE | 0.9070 | 0.9143 | 0.9697 | 0.9412 |
| CLAHEAndContrastEnhancement | 0.9535 | 0.9535 | 0.9535 | 0.9535 |
| ContrastEnhancement | 0.9535 | 0.9655 | 0.9655 | 0.9655 |
| ContrastEnhancementAndCLAHE | 0.9302 | 0.9298 | 0.9302 | 0.9294 |
| ContrastEnhancementAndEqualizeHistogram | 0.9535 | 0.9561 | 0.9535 | 0.9516 |
| Denoise | 0.6744 | 0.6744 | 1.0000 | 0.8056 |
| EdgeDetection | 0.7442 | 0.7442 | 1.0000 | 0.8533 |
| EqualizeHistogram | 0.8837 | 0.8611 | 1.0000 | 0.9254 |
| EqualizeHistogramAndContrastEnhancement | 0.9302 | 0.9325 | 0.9302 | 0.9308 |
| GaussianBlur | 0.6744 | 0.6744 | 1.0000 | 0.8056 |
| GrayScale | 0.7674 | 0.7436 | 1.0000 | 0.8529 |
| MedianBlur | 0.8605 | 0.9583 | 0.8214 | 0.8846 |
| OriginalImage | 0.9302 | 0.9062 | 1.0000 | 0.9508 |

### YOLO

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.6512 | 0.4240 | 0.6512 | 0.5136 |
| CLAHE | 0.6512 | 0.4240 | 0.6512 | 0.5136 |
| CLAHEAndContrastEnhancement | 0.5581 | 0.3115 | 0.5581 | 0.3999 |
| ContrastEnhancement | 0.6744 | 0.4817 | 0.6744 | 0.5620 |
| ContrastEnhancementAndCLAHE | 0.7209 | 0.5197 | 0.7209 | 0.6040 |
| ContrastEnhancementAndEqualizeHistogram | 0.6512 | 0.4240 | 0.6512 | 0.5136 |
| Denoise | 0.7209 | 0.5197 | 0.7209 | 0.6040 |
| EdgeDetection | 0.6744 | 0.4548 | 0.6744 | 0.5433 |
| EqualizeHistogram | 0.7907 | 0.6252 | 0.7907 | 0.6983 |
| EqualizeHistogramAndContrastEnhancement | 0.7674 | 0.5890 | 0.7674 | 0.6665 |
| GaussianBlur | 0.7674 | 0.5890 | 0.7674 | 0.6665 |
| GrayScale | 0.7907 | 0.6252 | 0.7907 | 0.6983 |
| MedianBlur | 0.7442 | 0.5538 | 0.7442 | 0.6350 |
| OriginalImage | 0.6512 | 0.4240 | 0.6512 | 0.5136 |

### YOLOCLS

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.5581 | 0.4007 | 0.5581 | 0.4665 |
| CLAHE | 0.6047 | 0.4129 | 0.6047 | 0.4907 |
| CLAHEAndContrastEnhancement | 0.5116 | 0.4490 | 0.5116 | 0.4367 |
| ContrastEnhancement | 0.5814 | 0.5621 | 0.5814 | 0.5707 |
| ContrastEnhancementAndCLAHE | 0.6977 | 0.6428 | 0.6977 | 0.6508 |
| ContrastEnhancementAndEqualizeHistogram | 0.6279 | 0.5836 | 0.6279 | 0.5835 |
| Denoise | 0.7209 | 0.5197 | 0.7209 | 0.6040 |
| EdgeDetection | 0.6744 | 0.4548 | 0.6744 | 0.5433 |
| EqualizeHistogram | 0.7209 | 0.6128 | 0.7209 | 0.6625 |
| EqualizeHistogramAndContrastEnhancement | 0.7442 | 0.6723 | 0.7442 | 0.6876 |
| GaussianBlur | 0.7442 | 0.6989 | 0.7442 | 0.7106 |
| GrayScale | 0.8140 | 0.8494 | 0.8140 | 0.7493 |
| MedianBlur | 0.6744 | 0.6312 | 0.6744 | 0.6478 |
| OriginalImage | 0.6047 | 0.4129 | 0.6047 | 0.4907 |

---

## DRNPW

### CNN

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| CLAHE | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| CLAHEAndContrastEnhancement | 0.7000 | 0.4900 | 0.7000 | 0.5765 |
| ContrastEnhancement | 0.6333 | 0.4011 | 0.6333 | 0.4912 |
| ContrastEnhancementAndCLAHE | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| ContrastEnhancementAndEqualizeHistogram | 0.8333 | 0.6944 | 0.8333 | 0.7576 |
| Denoise | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| EdgeDetection | 0.6667 | 0.4444 | 0.6667 | 0.5333 |
| EqualizeHistogram | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| EqualizeHistogramAndContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| GaussianBlur | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| GrayScale | 0.6333 | 0.4011 | 0.6333 | 0.4912 |
| MedianBlur | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| OriginalImage | 0.6333 | 0.4011 | 0.6333 | 0.4912 |

### YOLO

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.8333 | 0.6944 | 0.8333 | 0.7576 |
| CLAHE | 0.7000 | 0.6696 | 0.7000 | 0.6844 |
| CLAHEAndContrastEnhancement | 0.7667 | 0.6345 | 0.7667 | 0.6943 |
| ContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| ContrastEnhancementAndCLAHE | 0.7000 | 0.6192 | 0.7000 | 0.6571 |
| ContrastEnhancementAndEqualizeHistogram | 0.5333 | 0.2844 | 0.5333 | 0.3710 |
| Denoise | 0.6333 | 0.4368 | 0.6333 | 0.5170 |
| EdgeDetection | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| EqualizeHistogram | 0.7000 | 0.4900 | 0.7000 | 0.5765 |
| EqualizeHistogramAndContrastEnhancement | 0.6667 | 0.4444 | 0.6667 | 0.5333 |
| GaussianBlur | 0.6667 | 0.4444 | 0.6667 | 0.5333 |
| GrayScale | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| MedianBlur | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| OriginalImage | 0.7333 | 0.5378 | 0.7333 | 0.6205 |

### YOLOCLS

| Pré-processamento | Acurácia | Precisão | Recall | F1 |
|---|---|---|---|---|
| AdaptiveThreshold | 0.8333 | 0.6944 | 0.8333 | 0.7576 |
| CLAHE | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| CLAHEAndContrastEnhancement | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| ContrastEnhancement | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| ContrastEnhancementAndCLAHE | 0.7667 | 0.5878 | 0.7667 | 0.6654 |
| ContrastEnhancementAndEqualizeHistogram | 0.5333 | 0.2844 | 0.5333 | 0.3710 |
| Denoise | 0.6333 | 0.4368 | 0.6333 | 0.5170 |
| EdgeDetection | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| EqualizeHistogram | 0.7000 | 0.4900 | 0.7000 | 0.5765 |
| EqualizeHistogramAndContrastEnhancement | 0.6667 | 0.4444 | 0.6667 | 0.5333 |
| GaussianBlur | 0.6333 | 0.4368 | 0.6333 | 0.5170 |
| GrayScale | 0.8000 | 0.6400 | 0.8000 | 0.7111 |
| MedianBlur | 0.7333 | 0.5378 | 0.7333 | 0.6205 |
| OriginalImage | 0.6667 | 0.5238 | 0.6667 | 0.5867 |