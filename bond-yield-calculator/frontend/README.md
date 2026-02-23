# Bond Yield Calculator — Frontend

React SPA for bond yield and cash flow inputs, results, price–yield chart, and cash flow table. See the [root README](../README.md) for full project overview.

## Tech stack

- **React 19** (Create React App, TypeScript)
- **Tailwind CSS** for layout and styling
- **React Hook Form** for form state and validation
- **Axios** for API calls
- **Recharts** for the price–yield line chart

## Project structure

```
src/
├── api/
│   └── client.ts          # Axios instance, calculateBond(), getPriceYieldCurve(), healthCheck()
├── components/
│   ├── BondForm.tsx       # Bond inputs, validation, submit/reset
│   ├── BondResults.tsx    # Current yield, YTM, total interest, premium/discount badge
│   ├── CashFlowTable.tsx  # Schedule table (period, date, coupon, cumulative, principal)
│   ├── PriceYieldChart.tsx # Recharts line chart + YTM reference line/dot
│   └── Spinner.tsx
├── types/
│   └── bond.ts            # BondFormInput, CashFlow, BondCalculationResult, PriceYieldCurveResult
├── utils/
│   └── format.ts          # formatCurrency(), formatPercent()
├── App.tsx                # State (result, lastInput, loading, error), layout, composition
├── index.tsx
└── index.css              # Tailwind directives + base body styles
```

## Technical approach

- **No business logic in UI:** All bond math lives in the backend. The frontend only sends bond parameters and displays API responses.
- **Single source of state:** `App` holds `result`, `lastInput`, `loading`, `error`. Form submit calls `calculateBond()`; on success we store result and lastInput so the chart can call `getPriceYieldCurve()` with the same parameters.
- **Typed API layer:** `api/client.ts` uses shared types from `types/bond.ts`; base URL from `REACT_APP_API_BASE_URL` (default `http://localhost:3000/api/v1`).
- **Accessibility & UX:** Labels, error messages, loading states, disabled submit while loading, responsive layout. Chart tooltips and legend; premium/discount/par reflected in chart marker color.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server (default port 3000; use `PORT=3001` if backend uses 3000) |
| `npm run build` | Production build → `build/` |
| `npm test` | Run tests |

## Environment

Copy `.env.example` to `.env` and set:

- `REACT_APP_API_BASE_URL` — Backend API base (e.g. `http://localhost:3000/api/v1`). Required at build time for production.
