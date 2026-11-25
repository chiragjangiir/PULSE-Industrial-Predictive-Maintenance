# PULSE — Test Strategy & Verification Suite

## 1. Test Architecture
The test suite validates data ingestion, leakage exclusion, physics rules, API contracts, single predictions, and batch CSV processing using `pytest`.

```
backend/tests/
  ├── test_api_endpoints.py   # REST API route checks, validation, schemas, and batch CSV
  └── test_physics_rules.py   # Industrial failure envelope recommendations
```

---

## 2. Executing the Test Suite
```bash
source .venv/bin/activate
export PYTHONPATH=.
pytest backend/tests/ -v --tb=short
```

### Coverage Scope:
- **Root & Health Endpoints**: Status 200, active model metadata, healthy status.
- **Model Metadata**: Threshold verification ($\theta=0.31$), parameter schemas.
- **Single Machine Inference**: Normal prediction ($y=0$, `LOW` risk) and failure prediction ($y=1$, `HIGH`/`CRITICAL` risk with physics recommendations).
- **Batch Processing**: Multi-machine JSON requests and multi-row CSV file uploads.
- **Analytics Endpoints**: Fleet summary, failure mode breakdowns, permutation feature rankings, and model benchmark tables.
- **Physics Heuristics**: Tool wear fatigue ($>200$ min), thermal entrapment, and mechanical overstrain envelope limits.
