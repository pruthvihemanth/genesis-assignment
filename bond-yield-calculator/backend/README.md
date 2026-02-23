# Bond Yield Calculator — Backend

NestJS API for bond yield, cash flows, and price–yield curve. Stateless and deterministic (no database). See the [root README](../README.md) for full project overview.

## Tech stack

- **NestJS 11** (TypeScript)
- **class-validator** / **class-transformer** for DTO validation
- **Swagger** (OpenAPI) at `/api/docs`

## Project structure

```
src/
├── domain/
│   ├── bond.entity.ts       # Bond class (faceValue, coupon rate, price, maturity, frequency)
│   └── cash-flow.interface.ts
├── dto/
│   ├── calculate-bond.dto.ts          # Request: faceValue, annualCouponRate, marketPrice, yearsToMaturity, couponFrequency
│   ├── bond-calculation-response.dto.ts
│   └── price-yield-curve-response.dto.ts
├── bonds/
│   ├── bond-pricing.ts      # priceAtPeriodRate(), priceAtAnnualYield() — single source for PV math
│   ├── ytm-solver.ts        # Bisection over period rate; annualYtm() for annual equivalent
│   ├── bond-calculator.ts   # currentYield(), totalInterest(), premiumOrDiscount()
│   ├── cash-flow-generator.ts # Period, payment date, coupon, cumulative interest, remaining principal
│   ├── bonds.service.ts     # calculate(), getPriceYieldCurve(); maps DTO → Bond, orchestrates
│   ├── bonds.controller.ts  # POST /calculate, POST /price-yield-curve
│   └── *.spec.ts            # Unit tests: YTM, premium/discount, zero-coupon, price-yield curve
├── health/
│   └── health.controller.ts # GET /health
├── app.module.ts
└── main.ts                  # Global prefix api/v1, ValidationPipe, CORS, Swagger
```

## Technical approach

- **Layered design:** Controllers handle HTTP and validation only; `BondsService` orchestrates domain and pure helpers. No business logic in controllers.
- **Single pricing implementation:** All present-value logic lives in `bond-pricing.ts`. `YtmSolver` uses `priceAtPeriodRate()` for bisection; `getPriceYieldCurve()` uses `priceAtAnnualYield()` for each yield point. No duplicated formulas.
- **YTM by bisection:** Solve for period rate such that bond price equals market price (tolerance 1e-6, max 1000 iterations). Convert period rate to annual YTM (compound for semi-annual).
- **Price–yield curve:** After computing YTM, sample yields from `max(ytm - 0.05, -0.5)` to `ytm + 0.05` in steps of 0.0025; return sorted `{ curve: [{ yield, price }], ytm }`.
- **Validation:** Global `ValidationPipe` with whitelist and transform; DTOs use class-validator decorators. Strict TypeScript; no `any`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/health | Health check |
| POST | /api/v1/bonds/calculate | Current yield, YTM, total interest, premium/discount, cashFlows[] |
| POST | /api/v1/bonds/price-yield-curve | Curve points + YTM (same body as calculate) |

Request body (both POST): `faceValue`, `annualCouponRate`, `marketPrice`, `yearsToMaturity`, `couponFrequency` (`"annual"` \| `"semi-annual"`).

**Swagger:** http://localhost:3000/api/docs when running.

## Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled app (uses `PORT`, default 3000) |
| `npm test` | Unit tests |
| `npm run test:e2e` | E2E tests (health + calculate) |

## Environment

Optional `.env` (see `.env.example`):

- `PORT` — Server port (default 3000)
