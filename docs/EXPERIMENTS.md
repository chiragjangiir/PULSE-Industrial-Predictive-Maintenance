# PULSE — Machine Learning Experiments & Empirical Evaluation

## 1. Experimental Protocol
- **Dataset**: UCI AI4I 2020 Predictive Maintenance Dataset (10,000 instances).
- **Partitioning**: 80% Stratified Training (8,000 instances), 20% Stratified Test (2,000 instances), `seed=42`.
- **Target**: `Machine failure` (1 = Failure, 0 = Normal).
- **Positive Rate**: Train = 3.39% (271 failures), Test = 3.40% (68 failures).
- **Strict Leakage Prevention**: Identifiers (`UDI`, `Product ID`) and failure modes (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) excluded from predictors.

---

## 2. Model Benchmark Comparison Table (Hold-Out Test Set)

| Candidate Model | Accuracy | ROC-AUC | PR-AUC | Precision | Recall | F1-Score |
|---|---|---|---|---|---|---|
| **Dummy (Stratified)** | 0.9320 | 0.4966 | 0.0338 | 0.0278 | 0.0294 | 0.0286 |
| **Logistic Regression (Balanced)** | 0.8175 | 0.9385 | 0.4304 | 0.1791 | **0.8824** | 0.2978 |
| **Decision Tree (Balanced)** | 0.9490 | 0.8565 | 0.7658 | 0.3733 | 0.8235 | 0.5138 |
| **k-Nearest Neighbors ($k=5$)** | 0.9755 | 0.8836 | 0.6166 | 0.8387 | 0.3824 | 0.5253 |
| **Random Forest (Ensemble)** | 0.9825 | **0.9825** | 0.8761 | 0.6477 | 0.8382 | 0.7308 |
| **Gradient Boosting (Production)** | **0.9905** | 0.9679 | **0.8918** | **0.9016** | 0.8088 | **0.8527** |

*Note: Baseline models evaluated at default threshold $\theta=0.50$; final Gradient Boosting evaluated at cost-optimized threshold $\theta=0.31$.*

---

## 3. Threshold Optimization & Cost Analysis
- **Hypothetical Cost Structure**:
  - Unplanned breakdown failure ($FN$): \$500 per incident.
  - Preventative inspection / false alarm ($FP$): \$50 per incident.
- **Search Strategy**: 5-Fold Stratified Cross-Validation strictly across training folds.
- **Optimal Threshold Selected**: $\theta = 0.31$ (Minimizing training fold maintenance cost to \$22,350 vs \$28,500+ at standard 0.50 threshold).
- **Hold-Out Confusion Matrix at $\theta = 0.31$**:
  - True Negatives ($TN$): 1,926
  - False Positives ($FP$): 6
  - False Negatives ($FN$): 13
  - True Positives ($TP$): 55

---

## 4. Feature Importance Rankings
Permutation Importance on the hold-out test set (scoring = `roc_auc`):
1. `torque_wear_interaction` (+0.342 AUC impact)
2. `Torque [Nm]` (+0.285 AUC impact)
3. `Rotational speed [rpm]` (+0.178 AUC impact)
4. `Tool wear [min]` (+0.092 AUC impact)
5. `temp_diff` (+0.065 AUC impact)
6. `Process temperature [K]` (+0.021 AUC impact)
7. `Air temperature [K]` (+0.012 AUC impact)
8. `Type` (+0.005 AUC impact)

