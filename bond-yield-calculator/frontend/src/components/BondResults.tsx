import React from 'react';
import type { BondCalculationResult, PremiumOrDiscount } from '../types/bond';
import { formatCurrency, formatPercent } from '../utils/format';

export interface BondResultsProps {
  result: BondCalculationResult | null;
}

function PremiumBadge({ value }: { value: PremiumOrDiscount }): React.ReactElement {
  const styles: Record<PremiumOrDiscount, string> = {
    premium: 'bg-emerald-100 text-emerald-800',
    discount: 'bg-red-100 text-red-800',
    par: 'bg-slate-100 text-slate-700',
  };
  const labels: Record<PremiumOrDiscount, string> = {
    premium: 'Premium',
    discount: 'Discount',
    par: 'Par',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styles[value]}`}
    >
      {labels[value]}
    </span>
  );
}

export function BondResults({ result }: BondResultsProps): React.ReactElement | null {
  if (!result) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Results</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <p className="text-sm text-slate-500">Current yield</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">
            {formatPercent(result.currentYield)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Yield to maturity (YTM)</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">
            {formatPercent(result.ytm)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Total interest earned</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Price vs par</p>
          <div className="mt-1.5">
            <PremiumBadge value={result.premiumOrDiscount} />
          </div>
        </div>
      </div>
    </div>
  );
}
