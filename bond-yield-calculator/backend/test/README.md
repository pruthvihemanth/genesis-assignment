# Backend tests

Tests are grouped by type and mirror the `src/` layout.

## Layout

```
test/
├── README.md           (this file)
├── jest-e2e.json       (Jest config for e2e: run with npm run test:e2e)
├── unit/               (unit tests — run with npm test)
│   └── bonds/          (tests for src/bonds/)
│       ├── bond-calculator.spec.ts
│       ├── ytm-solver.spec.ts
│       ├── zero-coupon.spec.ts
│       └── price-yield-curve.spec.ts
└── (e2e specs if any)
```

## Commands

- **`npm test`** — run unit tests (`test/unit/**/*.spec.ts`)
- **`npm run test:watch`** — unit tests in watch mode
- **`npm run test:cov`** — unit tests with coverage (from `src/`)
- **`npm run test:e2e`** — run e2e tests (separate Jest config)

Unit spec files import from `src/` using relative paths (e.g. `../../../src/bonds/...`).
