# Deployment

This folder contains GitHub Actions workflows for deploying the Bond Yield Calculator app. Frontend and backend deploy **independently** to different targets.

---

## Where to see Actions run

GitHub only runs workflows that live in the **repository root** `.github/workflows/` directory. For this repo the root is the parent of `bond-yield-calculator`, so the workflows that actually run are at **repo root** `.github/workflows/` (e.g. `genesis-assignment/.github/workflows/`), not inside `bond-yield-calculator/`.

**To see when an action is triggered:**

1. Open your repo on **GitHub**.
2. Click the **Actions** tab (top bar, next to Pull requests).
3. You’ll see:
   - **All workflows** – list of workflow runs (triggered by push or manual run).
   - **Deploy Frontend (S3 + CloudFront)** / **Deploy Backend (EC2)** – click a workflow name to see its runs.
4. Click a **run** to see the job and step logs.

**To trigger a run manually:** Actions → choose the workflow → **Run workflow** → pick the branch (e.g. `development`) → **Run workflow**.

If nothing appears under Actions, the workflow files are likely not in the repo root `.github/workflows/` (see above).

**Run shows "Skipped" or build step never ran**

- GitHub runs the workflow on push but **skips the job** when no files in the trigger paths were changed. So if you only pushed changes under e.g. `.github/` (at repo root), `README`, or files outside `bond-yield-calculator/frontend/**` or `bond-yield-calculator/backend/**`, the run will be **Skipped** and no build runs.
- **Fix:** Either push at least one change under `bond-yield-calculator/frontend/**` (for frontend deploy) or `bond-yield-calculator/backend/**` (for backend deploy), or trigger manually: **Actions** → select the workflow → **Run workflow** → choose branch → **Run workflow**.

**Run failed before "Build"**

- Open the run and check which step failed (red X). Common causes: **Install dependencies** fails if `package-lock.json` is missing or out of sync (run `npm install` locally and commit the lockfile); **Configure AWS credentials** fails if `AWS_ROLE_ARN` or access keys are missing or wrong.

**Frontend not connecting to backend (production) / Mixed content**

- Browsers block **mixed content**: an **HTTPS** frontend (e.g. CloudFront) cannot call an **HTTP** API. You must call the backend over **HTTPS**.
- **Fix – proxy API through CloudFront (no extra domain/cert):**
  1. In the **same** CloudFront distribution that serves your frontend (or a new one): **Origins** → **Create origin** → set **Origin domain** to your EC2 (e.g. `52.23.185.218`), **Protocol** = HTTP only, **Port** = 3000. Save.
  2. **Behaviors** → **Create behavior** → **Path pattern** = `api/*` (or `api/v1/*`), **Origin** = the EC2 origin you just created. **Cache policy** = CachingDisabled (or a short TTL). Save.
  3. Set repo variable **REACT_APP_API_BASE_URL** to your **HTTPS** CloudFront URL + path, e.g. `https://d1234abcd.cloudfront.net/api/v1` (use your distribution’s domain).
  4. **Redeploy the frontend** (Actions → Deploy Frontend → Run workflow) so the new URL is baked in.
- **Alternative:** Put the backend on HTTPS with a domain (e.g. ALB + ACM, or Nginx + Let’s Encrypt) and set **REACT_APP_API_BASE_URL** to that HTTPS URL, then redeploy the frontend.
- **Redeploy:** Changing **REACT_APP_API_BASE_URL** only takes effect after you run the Deploy Frontend workflow again.

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
| **deploy-frontend.yml** | Push to `main` or `development` when `bond-yield-calculator/frontend/**` changes, or manual run | S3 + CloudFront | Static build from `bond-yield-calculator/frontend/build/` |
| **deploy-backend.yml** | Push to `main` or `development` when `bond-yield-calculator/backend/**` changes, or manual run | EC2 | Compiled app in `bond-yield-calculator/backend/dist/` + package files |

Deployments are **separate**: changing only frontend runs only the frontend workflow; changing only backend runs only the backend workflow.

---

## Parameters you need to add

Configure these in the repo: **Settings → Secrets and variables → Actions**.

### Frontend (S3 + CloudFront)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| **AWS_ACCESS_KEY_ID** | Secret | Yes | IAM user access key ID with permission to write to S3 and create CloudFront invalidations. |
| **AWS_SECRET_ACCESS_KEY** | Secret | Yes | IAM user secret access key (pair of the key above). |
| **S3_BUCKET_NAME** | Variable | Yes | Your existing S3 bucket name (static site bucket). |
| **CLOUDFRONT_DISTRIBUTION_ID** | Variable | Yes | CloudFront distribution ID (for cache invalidation after upload). |
| **REACT_APP_API_BASE_URL** | Variable | No | Backend API base URL for the frontend (e.g. `http://52.23.185.218:3000/api/v1`). Defaults to `http://52.23.185.218:3000/api/v1` if not set. |
| **AWS_REGION** | Variable | No | AWS region (e.g. `us-east-1`). Defaults to `us-east-1` if not set. |

**Where to add:** In the **repository** that runs the workflows (e.g. **genesis-assignment**) go to **Settings** → **Secrets and variables** → **Actions**. Under **Secrets** add **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**; under **Variables** add **S3_BUCKET_NAME**, **CLOUDFRONT_DISTRIBUTION_ID**, and optionally **AWS_REGION**. Repository-level (not organization-level) is correct.

**Optional (OIDC):** To use OIDC instead of access keys, edit the workflow to use `role-to-assume: ${{ secrets.AWS_ROLE_ARN }}` and remove the access-key lines; add **AWS_ROLE_ARN** in Secrets and configure the IdP in IAM.

---

### Backend (EC2)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| **EC2_SSH_PRIVATE_KEY** | Secret | Yes | Full contents of the SSH private key (e.g. `~/.ssh/id_rsa`) used to connect to EC2. |
| **EC2_USER** | Secret or Variable | Yes | SSH user on the instance (e.g. `ubuntu`, `ec2-user`). |
| **EC2_HOST** | Secret or Variable | Yes | EC2 hostname or IP (e.g. `ec2-xx-xx-xx-xx.compute.amazonaws.com`). |
| **EC2_APP_DIR** | Variable | No | Full path on EC2 for the app. Defaults to `/home/ubuntu/app`. Set to e.g. `/home/ec2-user/app` if your SSH user is not `ubuntu`. |

**Where to add:** All can be **Secrets** (recommended for user/host) or **Variables**. If you don’t set **EC2_APP_DIR**, the workflow uses `/home/ubuntu/app` (correct when **EC2_USER** is `ubuntu`).

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

**Backend: "Permission denied" or "No such file or directory" on SCP**

- Set **EC2_APP_DIR** to the **full path** on the EC2 instance (e.g. `/home/ubuntu/app` for user `ubuntu`). Using `~/app` causes the wrong path on the runner and fails. If you see **Permission denied**, the directory may exist and be owned by another user; on EC2 run: `sudo chown -R $(whoami):$(whoami) /home/ubuntu/app` (use your actual path).
