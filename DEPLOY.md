# Deployment guide

This repository includes a CI/CD pipeline (GitHub Actions) that builds and publishes images and can deploy to Cloud Run when the required secrets are configured.

## What the workflow does

- On pull requests: runs build & lint for backend and frontend to catch issues early.
- On push to `main`: builds and pushes backend and frontend Docker images to GitHub Container Registry (GHCR). If `GCP_SERVICE_ACCOUNT_KEY` and related secrets are set, it will deploy the backend to Cloud Run.

## Required secrets for Cloud Run deployment

Add the following repository secrets in GitHub Settings → Secrets:

- `GCP_SERVICE_ACCOUNT_KEY` — Service account JSON (entire JSON string). The service account must have `roles/run.admin`, `roles/iam.serviceAccountUser`, and `roles/storage.admin` for pushing images if needed.
- `GCP_PROJECT_ID` — GCP project id
- `GCP_REGION` — region for Cloud Run deploy (e.g., `us-central1`)

Example steps to create a service account key:

1. Create a service account in the GCP Console.
2. Grant the roles mentioned above.
3. Create and download a JSON key.
4. Add the JSON content as the secret `GCP_SERVICE_ACCOUNT_KEY`.

## Alternative: SSH deploy

If you prefer to deploy to your own server, you can extend the workflow to SSH into the server and pull the latest images or run docker-compose. Required secrets would be `SSH_PRIVATE_KEY`, `SSH_HOST`, and `SSH_USER`.

## Notes

- The workflow pushes images to GHCR under `ghcr.io/<owner>/register-your-pet-app`. Make sure the target account has the appropriate package permissions.
- For one-developer projects this setup allows you to test changes safely in CI and automatically deploy to production after push to `main`.
