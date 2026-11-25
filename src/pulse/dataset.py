"""
PULSE Dataset Acquisition & Integrity Validation Module.

Downloads and validates the official UCI AI4I 2020 Predictive Maintenance Dataset.
Source: https://archive.ics.uci.edu/dataset/601/ai4i+2020+predictive+maintenance+dataset
Direct CSV URL: https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip
Alternative Mirror: https://raw.githubusercontent.com/marshmallow77/ai4i2020/master/ai4i2020.csv
"""

import os
import sys
import zipfile
import urllib.request
import pandas as pd
from typing import Tuple, Dict, Any

EXPECTED_ROW_COUNT = 10000
EXPECTED_COLUMNS = [
    "UDI",
    "Product ID",
    "Type",
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
    "Machine failure",
    "TWF",
    "HDF",
    "PWF",
    "OSF",
    "RNF"
]

PRIMARY_UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/601/ai4i+2020+predictive+maintenance+dataset.zip"
MIRROR_CSV_URL = "https://raw.githubusercontent.com/marshmallow77/ai4i2020/master/ai4i2020.csv"


def download_dataset(target_dir: str = "data/raw") -> str:
    """Download the AI4I 2020 dataset from primary or fallback mirror."""
    os.makedirs(target_dir, exist_ok=True)
    target_csv_path = os.path.join(target_dir, "ai4i2020.csv")

    if os.path.exists(target_csv_path) and os.path.getsize(target_csv_path) > 10000:
        print(f"[PULSE Dataset] Found existing dataset at {target_csv_path}")
        return target_csv_path

    # Try Primary UCI Zip download first
    zip_dest = os.path.join(target_dir, "ai4i2020.zip")
    print(f"[PULSE Dataset] Attempting download from primary source: {PRIMARY_UCI_ZIP_URL}...")
    headers = {"User-Agent": "Mozilla/5.0 (PULSE Industrial Intelligence ML Research Agent)"}
    
    download_success = False
    try:
        req = urllib.request.Request(PRIMARY_UCI_ZIP_URL, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp, open(zip_dest, "wb") as f:
            f.write(resp.read())
        
        # Unzip
        with zipfile.ZipFile(zip_dest, "r") as z:
            csv_candidates = [n for n in z.namelist() if n.endswith(".csv")]
            if csv_candidates:
                z.extract(csv_candidates[0], target_dir)
                extracted_path = os.path.join(target_dir, csv_candidates[0])
                if extracted_path != target_csv_path:
                    os.rename(extracted_path, target_csv_path)
                download_success = True
                print(f"[PULSE Dataset] Successfully downloaded and extracted to {target_csv_path}")
        if os.path.exists(zip_dest):
            os.remove(zip_dest)
    except Exception as e:
        print(f"[PULSE Dataset] Primary download encountered issue: {e}")

    # Fallback to direct raw CSV mirror if primary failed
    if not download_success:
        print(f"[PULSE Dataset] Attempting download from verified mirror: {MIRROR_CSV_URL}...")
        try:
            req = urllib.request.Request(MIRROR_CSV_URL, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp, open(target_csv_path, "wb") as f:
                f.write(resp.read())
            print(f"[PULSE Dataset] Successfully downloaded from mirror to {target_csv_path}")
            download_success = True
        except Exception as e:
            raise RuntimeError(f"Failed to acquire dataset from all sources: {e}")

    return target_csv_path


def validate_dataset(csv_path: str) -> Tuple[bool, Dict[str, Any], pd.DataFrame]:
    """Validate schema, column names, null counts, row counts, and class distributions."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"File not found: {csv_path}")

    df = pd.read_csv(csv_path)
    
    # Check shape
    row_count, col_count = df.shape
    row_valid = (row_count == EXPECTED_ROW_COUNT)
    
    # Check column match
    missing_cols = [c for c in EXPECTED_COLUMNS if c not in df.columns]
    cols_valid = (len(missing_cols) == 0)
    
    # Missing values check
    null_counts = df.isnull().sum().to_dict()
    total_nulls = df.isnull().sum().sum()
    no_nulls = (total_nulls == 0)
    
    # Class distribution
    failure_counts = df["Machine failure"].value_counts().to_dict() if "Machine failure" in df.columns else {}
    failure_rate = (failure_counts.get(1, 0) / row_count) * 100 if row_count > 0 else 0.0

    validation_report = {
        "is_valid": row_valid and cols_valid and no_nulls,
        "row_count": row_count,
        "expected_row_count": EXPECTED_ROW_COUNT,
        "row_count_valid": row_valid,
        "col_count": col_count,
        "missing_columns": missing_cols,
        "columns_valid": cols_valid,
        "total_null_values": int(total_nulls),
        "failure_distribution": failure_counts,
        "failure_rate_percent": round(failure_rate, 4),
        "type_distribution": df["Type"].value_counts().to_dict() if "Type" in df.columns else {}
    }

    return validation_report["is_valid"], validation_report, df


if __name__ == "__main__":
    csv_file = download_dataset()
    is_valid, report, data = validate_dataset(csv_file)
    print("\n--- PULSE Dataset Validation Report ---")
    for k, v in report.items():
        print(f"  {k}: {v}")
    
    if not is_valid:
        print("\n❌ Dataset validation FAILED.")
        sys.exit(1)
    else:
        print("\n✅ Dataset integrity verified. Ready for ML experimentation.")

