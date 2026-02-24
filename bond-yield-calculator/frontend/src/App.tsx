import React, { useState, useCallback } from 'react';
import { BondForm } from './components/BondForm';
import { BondResults } from './components/BondResults';
import { PriceYieldChart } from './components/PriceYieldChart';
import { CashFlowTable } from './components/CashFlowTable';
import { Spinner } from './components/Spinner';
import { calculateBond } from './api/apiClient';
import type { BondFormInput, BondCalculationResult } from './types/bond';

function App(): React.ReactElement {
  const [result, setResult] = useState<BondCalculationResult | null>(null);
  const [lastInput, setLastInput] = useState<BondFormInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setResult(null);
    setLastInput(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (input: BondFormInput) => {
    setError(null);
    setLoading(true);
    try {
      const data = await calculateBond(input);
      setResult(data);
      setLastInput(input);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } })
              .response?.data?.message
          : null;
      const str =
        typeof message === 'string'
          ? message
          : Array.isArray(message)
            ? message.join(' ')
            : 'Calculation failed. Please check your inputs and try again.';
      setError(str);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Bond Yield Calculator
          </h1>
          <p className="mt-2 text-slate-600">
            Compute current yield, YTM, and cash flow schedule
          </p>
        </header>

        <main className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Bond parameters
            </h2>
            <div className="flex flex-wrap items-end gap-3">
              <BondForm onSubmit={handleSubmit} onReset={handleReset} isLoading={loading} />
              {loading && (
                <span className="flex items-center gap-2 text-slate-500 text-sm">
                  <Spinner /> Calculating…
                </span>
              )}
            </div>
            {error && (
              <div
                className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}
          </section>

          {result && (
            <>
              <BondResults result={result} />
              {lastInput && (
                <PriceYieldChart
                  bondInput={lastInput}
                  marketPrice={lastInput.marketPrice}
                  ytm={result.ytm}
                  premiumOrDiscount={result.premiumOrDiscount}
                />
              )}
              <CashFlowTable cashFlows={result.cashFlows} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
