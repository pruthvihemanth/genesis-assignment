import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { BondFormInput, CouponFrequency } from '../types/bond';

export interface BondFormProps {
  onSubmit: SubmitHandler<BondFormInput>;
  isLoading: boolean;
  onReset?: () => void;
}

const COUPON_FREQUENCY_OPTIONS: { value: CouponFrequency; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'semi-annual', label: 'Semi-annual' },
];

const defaultValues: BondFormInput = {
  faceValue: 1000,
  annualCouponRate: 5,
  marketPrice: 950,
  yearsToMaturity: 10,
  couponFrequency: 'annual',
};

export function BondForm({ onSubmit, isLoading, onReset }: BondFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BondFormInput>({ defaultValues });

  const handleReset = (): void => {
    reset(defaultValues);
    onReset?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="faceValue"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Face value ($)
          </label>
          <input
            id="faceValue"
            type="number"
            step="0.01"
            min="0.01"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register('faceValue', {
              required: 'Required',
              min: { value: 0.01, message: 'Must be positive' },
              valueAsNumber: true,
            })}
          />
          {errors.faceValue && (
            <p className="mt-1 text-sm text-red-600">{errors.faceValue.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="annualCouponRate"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Annual coupon rate (%)
          </label>
          <input
            id="annualCouponRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register('annualCouponRate', {
              required: 'Required',
              min: { value: 0, message: 'Min 0%' },
              max: { value: 100, message: 'Max 100%' },
              valueAsNumber: true,
            })}
          />
          {errors.annualCouponRate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.annualCouponRate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="marketPrice"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Market price ($)
          </label>
          <input
            id="marketPrice"
            type="number"
            step="0.01"
            min="0.01"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register('marketPrice', {
              required: 'Required',
              min: { value: 0.01, message: 'Must be positive' },
              valueAsNumber: true,
            })}
          />
          {errors.marketPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.marketPrice.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="yearsToMaturity"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Years to maturity
          </label>
          <input
            id="yearsToMaturity"
            type="number"
            step="0.5"
            min="0.01"
            max="100"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            {...register('yearsToMaturity', {
              required: 'Required',
              min: { value: 0.01, message: 'Must be positive' },
              max: { value: 100, message: 'Max 100 years' },
              valueAsNumber: true,
            })}
          />
          {errors.yearsToMaturity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.yearsToMaturity.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Coupon frequency
        </label>
        <div className="flex gap-4">
          {COUPON_FREQUENCY_OPTIONS.map(({ value, label }) => (
            <label key={value} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={value}
                className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500"
                {...register('couponFrequency')}
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Calculating…' : 'Calculate'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
