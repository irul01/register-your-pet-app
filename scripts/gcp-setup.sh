#!/usr/bin/env bash
set -euo pipefail

# gcp-setup.sh
# Usage: ./scripts/gcp-setup.sh YOUR_PROJECT_ID [SERVICE_ACCOUNT_NAME]
# Example: ./scripts/gcp-setup.sh my-gcp-project register-your-pet-deployer

PROJECT_ID=${1:-}
SA_NAME=${2:-register-your-pet-deployer}

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: $0 <GCP_PROJECT_ID> [SERVICE_ACCOUNT_NAME]"
  exit 1
fi

SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"
KEY_FILE="./${SA_NAME}-key.json"

echo "== GCP setup helper =="
echo "Project: $PROJECT_ID"
echo "Service account: $SA_EMAIL"

echo "1) Check gcloud"
if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud not found. Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

echo "2) Authenticate (if not already)"
gcloud auth list --filter=status:ACTIVE --format="value(account)" || true
echo "If you're not authenticated, run: gcloud auth login"

echo "3) Set project"
gcloud config set project "$PROJECT_ID"

echo "4) Enable required APIs"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com \
  storage.googleapis.com \
  sqladmin.googleapis.com || true

echo "5) Create service account (if not exists)"
if gcloud iam service-accounts describe "$SA_EMAIL" --project "$PROJECT_ID" >/dev/null 2>&1; then
  echo "Service account $SA_EMAIL already exists"
else
  gcloud iam service-accounts create "$SA_NAME" \
    --description="CI/CD deployer for register-your-pet" \
    --display-name="$SA_NAME" --project "$PROJECT_ID"
fi

echo "6) Bind roles to service account"
# Minimal recommended roles
ROLES=("roles/run.admin" "roles/iam.serviceAccountUser" "roles/storage.admin" "roles/cloudsql.client" "roles/artifactregistry.writer")
for role in "${ROLES[@]}"; do
  echo " - binding $role"
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" --role="$role" || true
done

echo "7) Create key file: $KEY_FILE"
if [ -f "$KEY_FILE" ]; then
  echo "$KEY_FILE already exists locally. Will not overwrite. If you want a fresh key, remove the file and re-run this script."
else
  gcloud iam service-accounts keys create "$KEY_FILE" --iam-account="$SA_EMAIL" --project "$PROJECT_ID"
  echo "Key created: $KEY_FILE"
fi

echo
echo "DONE"
echo "Next steps (manual):"
echo " - Open $KEY_FILE and copy its contents to GitHub Secrets as GCP_SERVICE_ACCOUNT_KEY (do NOT commit the key file)."
echo " - In repo settings -> Secrets -> Actions, add GCP_PROJECT_ID and GCP_REGION as well."
echo " - Remove the local key file when done or keep it secure."

exit 0
