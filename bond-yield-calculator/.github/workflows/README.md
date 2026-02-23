# Deployment

This folder contains GitHub Actions workflows for deploying the Bond Yield Calculator app. Frontend and backend deploy **independently** to different targets.

---

## How deployment is structured

```
.github/workflows/
├── README.md              ← this file
├── deploy-frontend.yml    → Build React app → upload to S3 → invalidate CloudFront
└── deploy-backend.yml     → Build NestJS app → copy to EC2 → install deps → restart app
```

| Workflow | Trigger | Target | What gets deployed |
|----------|---------|--------|--------------------|
| **deploy-frontend.yml** | Push to `main` when `frontend/**` changes, or manual run | S3 + CloudFront | Static build from `frontend/build/` |
| **deploy-backend.yml** | Push to `main` when `backend/**` changes, or manual run | EC2 | Compiled app in `backend/dist/` + `package.json` / `package-lock.json` |

Deployments are **separate**: changing only frontend runs only the frontend workflow; changing only backend runs only the backend workflow.

---

## Parameters you need to add

Configure these in the repo: **Settings → Secrets and variables → Actions**.

### Frontend (S3 + CloudFront)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| **AWS_ROLE_ARN** | Secret | Yes (if using OIDC) | IAM role ARN for OIDC auth. Use this **or** the two access key secrets below. |
| **AWS_ACCESS_KEY_ID** | Secret | Yes (if using keys) | AWS access key. Uncomment in workflow and remove `role-to-assume` if using keys. |
| **AWS_SECRET_ACCESS_KEY** | Secret | Yes (if using keys) | AWS secret key. |
| **S3_BUCKET_NAME** | Variable | Yes | Your existing S3 bucket name (static site bucket). |
| **CLOUDFRONT_DISTRIBUTION_ID** | Variable | Yes | CloudFront distribution ID (for cache invalidation after upload). |
| **AWS_REGION** | Variable | No | AWS region (e.g. `us-east-1`). Defaults to `us-east-1` if not set. |

**Where to add:** Secrets = **Secrets** tab; S3/CloudFront/Region = **Variables** tab.

---

### Backend (EC2)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| **EC2_SSH_PRIVATE_KEY** | Secret | Yes | Full contents of the SSH private key (e.g. `~/.ssh/id_rsa`) used to connect to EC2. |
| **EC2_USER** | Secret or Variable | Yes | SSH user on the instance (e.g. `ubuntu`, `ec2-user`). |
| **EC2_HOST** | Secret or Variable | Yes | EC2 hostname or IP (e.g. `ec2-xx-xx-xx-xx.compute.amazonaws.com`). |
| **EC2_APP_DIR** | Variable | No | Directory on EC2 where the app is deployed. Default: `~/app`. |

**Where to add:** All can be **Secrets** (recommended for user/host) or **Variables** (EC2_APP_DIR is typically a variable).

---

## Deployment flow (what runs when)

### Frontend pipeline

1. Checkout repo.
2. Install frontend deps (`npm ci`) and build (`npm run build`).
3. Configure AWS (OIDC role or access keys).
4. Sync `frontend/build/` to S3 (hashed assets get long cache; `index.html` gets no cache).
5. Create CloudFront invalidation for `/*`.

### Backend pipeline

1. Checkout repo.
2. Install backend deps and build (`npm run build` → output in `backend/dist/`).
3. Write SSH key from `EC2_SSH_PRIVATE_KEY` and add host to `known_hosts`.
4. SCP `backend/dist/`, `package.json`, and `package-lock.json` to `EC2_APP_DIR` on EC2.
5. SSH into EC2: `cd` to app dir, run `npm ci --omit=dev`, then `pm2 restart bond-api` (or start it if not running).

---

## First-time setup on EC2

Before the backend workflow can run, the EC2 instance should have:

- **Node.js 20+** and **PM2** (or another process manager; the workflow assumes PM2).
- An **app directory** (e.g. `~/app`) that the deploy user can write to.
- **SSH access** from the internet (or from GitHub’s IPs) so Actions can connect.

Example one-time setup:

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# App directory
mkdir -p ~/app
```

After the first deploy, the workflow will run `npm ci --omit=dev` and `pm2 restart bond-api` on each run. If you use systemd or another manager instead of PM2, change the last SSH command in `deploy-backend.yml` accordingly.
