# Bond Yield Calculator

Full-stack app to compute bond **current yield**, **YTM**, **total interest**, **premium/discount**, **cash flow schedule**, and a **price–yield chart**. React + TypeScript frontend, NestJS backend (stateless, no database).

## Structure

```
bond-yield-calculator/
├── frontend/   # React (CRA), Tailwind, React Hook Form, Axios
└── backend/    # NestJS, /api/v1
```

## Run locally

**Requirements:** Node.js 18+, npm

**Backend**

```bash
cd backend && npm install && npm run start:dev
```

- API: http://localhost:3000  
- Swagger: http://localhost:3000/api/docs

**Frontend**

```bash
cd frontend && npm install && npm start
```

- App: http://localhost:3000 (or 3001 if 3000 is in use; set `PORT=3001` in `.env` to avoid clash with backend)
- Optional: copy `.env.example` to `.env` and set `REACT_APP_API_BASE_URL` if the API is not on localhost:3000

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/health | Health check |
| POST | /api/v1/bonds/calculate | Yield, total interest, premium/discount, cash flows |
| POST | /api/v1/bonds/price-yield-curve | Price–yield curve for the chart |

**Calculate / price-yield-curve body:** `faceValue`, `annualCouponRate`, `marketPrice`, `yearsToMaturity`, `couponFrequency` (`"annual"` \| `"semi-annual"`).

## Deploy frontend (CloudFront)

1. `cd frontend && npm run build`
2. Upload contents of `build/` to an S3 bucket.
3. Create a CloudFront distribution with that bucket as origin, default root `index.html`.
4. Set `REACT_APP_API_BASE_URL` to your API URL before building.

## Notes

- **YTM** is solved with the bisection method (tolerance 1e-6); bond pricing is in `backend/src/bonds/bond-pricing.ts` and reused for the price–yield curve.
- Backend is stateless and deterministic; no DB, Redis, or auth.
