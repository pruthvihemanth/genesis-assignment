import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { getPriceYieldCurve } from '../api/apiClient';
import { formatCurrency, formatPercent } from '../utils/format';
import type { BondFormInput, PremiumOrDiscount } from '../types/bond';

export interface PriceYieldChartProps {
  bondInput: BondFormInput;
  marketPrice: number;
  ytm: number;
  premiumOrDiscount: PremiumOrDiscount;
}

interface ChartDataPoint {
  yield: number;
  price: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
}): React.ReactElement | null {
  if (!active || !payload?.length || label === undefined) return null;
  const price = payload.find((p) => p.dataKey === 'price')?.value;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-700">
        Yield: {formatPercent(label)}
      </p>
      {price !== undefined && (
        <p className="text-sm text-slate-600">Price: {formatCurrency(price)}</p>
      )}
    </div>
  );
}

export function PriceYieldChart({
  bondInput,
  marketPrice,
  ytm,
  premiumOrDiscount,
}: PriceYieldChartProps): React.ReactElement {
  const [curve, setCurve] = useState<ChartDataPoint[] | null>(null);
  const [curveYtm, setCurveYtm] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setLoading(true);
    getPriceYieldCurve(bondInput)
      .then((res) => {
        if (!cancelled) {
          setCurve(res.curve);
          setCurveYtm(res.ytm);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load price–yield curve.');
          setCurve(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Refetch when bond parameters change; use primitives to avoid ref churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bondInput.faceValue,
    bondInput.annualCouponRate,
    bondInput.marketPrice,
    bondInput.yearsToMaturity,
    bondInput.couponFrequency,
  ]);

  const referenceColor =
    premiumOrDiscount === 'premium'
      ? '#059669'
      : premiumOrDiscount === 'discount'
        ? '#dc2626'
        : '#64748b';

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">
            Price vs yield
          </h2>
        </div>
        <div className="h-80 flex items-center justify-center text-slate-500">
          Loading chart…
        </div>
      </div>
    );
  }

  if (error || !curve?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">
            Price vs yield
          </h2>
        </div>
        <div className="h-80 flex items-center justify-center rounded-lg bg-red-50 border border-red-100 mx-4 my-4">
          <p className="text-sm text-red-700">{error ?? 'No curve data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">
          Price vs yield
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Bond price sensitivity to yield (inverse relationship)
        </p>
      </div>
      <div className="p-4 h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={curve}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="yield"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(v: number) => formatPercent(v)}
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              type="number"
              tickFormatter={(v: number) => formatCurrency(v)}
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={() => 'Price'}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={800}
              animationEasing="ease-out"
              name="Price"
            />
            <ReferenceLine
              x={curveYtm}
              stroke={referenceColor}
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceDot
              x={curveYtm}
              y={marketPrice}
              r={6}
              fill={referenceColor}
              stroke="white"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
