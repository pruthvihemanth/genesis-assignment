import axios, { AxiosInstance } from 'axios';
import type { BondFormInput, BondCalculationResult, PriceYieldCurveResult } from '../types/bond';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function createClient(): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  });
}

const client = createClient();

export async function calculateBond(
  input: BondFormInput
): Promise<BondCalculationResult> {
  const { data } = await client.post<BondCalculationResult>('/bonds/calculate', {
    faceValue: input.faceValue,
    annualCouponRate: input.annualCouponRate,
    marketPrice: input.marketPrice,
    yearsToMaturity: input.yearsToMaturity,
    couponFrequency: input.couponFrequency,
  });
  return data;
}

export async function healthCheck(): Promise<{ status: string }> {
  const { data } = await client.get<{ status: string }>('/health');
  return data;
}

export async function getPriceYieldCurve(
  input: BondFormInput
): Promise<PriceYieldCurveResult> {
  const { data } = await client.post<PriceYieldCurveResult>(
    '/bonds/price-yield-curve',
    {
      faceValue: input.faceValue,
      annualCouponRate: input.annualCouponRate,
      marketPrice: input.marketPrice,
      yearsToMaturity: input.yearsToMaturity,
      couponFrequency: input.couponFrequency,
    }
  );
  return data;
}
