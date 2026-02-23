import React from 'react';
import type { CashFlow } from '../types/bond';
import { formatCurrency } from '../utils/format';

export interface CashFlowTableProps {
  cashFlows: CashFlow[];
}

const COLUMNS: Array<{
  key: keyof CashFlow;
  label: string;
  align: 'left' | 'center' | 'right';
  formatCurrency?: boolean;
}> = [
  { key: 'period', label: 'Period', align: 'left' },
  { key: 'paymentDate', label: 'Payment date', align: 'left' },
  { key: 'couponPayment', label: 'Coupon payment', align: 'center', formatCurrency: true },
  { key: 'cumulativeInterest', label: 'Cumulative interest', align: 'center', formatCurrency: true },
  { key: 'remainingPrincipal', label: 'Remaining principal', align: 'center', formatCurrency: true },
];

export function CashFlowTable({ cashFlows }: CashFlowTableProps): React.ReactElement | null {
  if (!cashFlows.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Cash flow schedule</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {COLUMNS.map(({ key, label, align }) => (
                <th
                  key={key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-medium text-slate-600 uppercase tracking-wider ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {cashFlows.map((row) => (
              <tr key={row.period} className="hover:bg-slate-50/50">
                {COLUMNS.map(({ key, align, formatCurrency: isCurrency }) => (
                  <td
                    key={key}
                    className={`px-4 py-3 text-sm whitespace-nowrap tabular-nums ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'} ${key === 'period' ? 'font-medium text-slate-900' : 'text-slate-700'}`}
                  >
                    {isCurrency ? formatCurrency(row[key] as number) : (row[key] as number | string)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
