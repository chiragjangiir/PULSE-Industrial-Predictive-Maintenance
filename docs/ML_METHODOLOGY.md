# PULSE — ML Research Methodology

## 1. Research Objectives & Problem Formulation
PULSE frames industrial predictive maintenance as an explainable, cost-sensitive binary classification problem:
Given operational telemetry $X \in \mathbb{R}^d$, predict $y \in \{0, 1\}$ denoting normal operation ($y=0$) or impending machine breakdown ($y=1$).

The core research objectives are:
1. Formulate a leak-free end-to-end preprocessing and modeling pipeline.
2. Address severe class imbalance (~3.39% positive failure class) using PR-AUC, ROC-AUC, and cost-weighted scoring rather than uninformative standard accuracy.
3. Establish whether physics-based feature interactions improve classification boundaries over raw sensor readings alone.
4. Implement threshold optimization to minimize operational maintenance costs, balancing unpredicted catastrophic breakdowns (False Negatives) against unnecessary maintenance interruptions (False Positives).
5. Provide local and global explainability via SHAP and permutation importance to support maintenance technician decision-making.

---

## 2. Leakage Prevention Protocol
Data leakage invalidates academic findings and industrial deployment:
- **Identifier Exclusion**: `UDI` and `Product ID` are dropped.
- **Subtype Exclusion**: `TWF`, `HDF`, `PWF`, `OSF`, and `RNF` are deterministic components of the failure event and must not be used as input predictors.
- **Data Splitting**: An 80/20 stratified train/test split is performed once with a fixed seed (`seed=42`).
- **Encapsulated Preprocessing**: Scaling parameters and encoders are fitted solely on training folds within `scikit-learn` `Pipeline` objects. Test data is only transformed during final evaluation.

---

## 3. Candidate Models & Benchmarking
The platform benchmarks six diverse model families:
1. **Dummy Baseline**: Stratified / Prior distribution prediction to establish baseline bounds.
2. **Logistic Regression**: Regularized linear baseline with standardized continuous inputs.
3. **Decision Tree**: Interpretable orthogonal axis-aligned partitioner.
4. **Random Forest Classifier**: Ensemble of bagging estimators with balanced class weighting.
5. **k-Nearest Neighbors (KNN)**: Non-parametric distance-based classifier.
6. **Gradient Boosting Classifier**: Sequentially minimized loss ensemble.

---

## 4. Evaluation Metrics
In severely imbalanced industrial settings, accuracy is misleading (a trivial classifier predicting all 0s gets 96.61% accuracy with zero recall).
Primary decision metrics:
- **PR-AUC (Average Precision)**: Evaluates precision across all recall thresholds.
- **ROC-AUC**: Evaluates ranking capability across false positive rates.
- **Recall & False Negatives**: In industrial settings, a missed breakdown is far more costly than an unnecessary inspection.
- **Balanced Accuracy**: Arithmetic mean of sensitivity and specificity.
