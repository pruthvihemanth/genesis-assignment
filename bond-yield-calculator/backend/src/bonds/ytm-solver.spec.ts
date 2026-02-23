import { YtmSolver } from './ytm-solver';
import { Bond } from '../domain/bond.entity';

describe('YtmSolver', () => {
  let solver: YtmSolver;

  beforeEach(() => {
    solver = new YtmSolver();
  });

  function bondPrice(bond: Bond, annualRate: number): number {
    const periodRate =
      bond.periodsPerYear === 2
        ? Math.pow(1 + annualRate, 0.5) - 1
        : annualRate;
    let pv = 0;
    for (let t = 1; t <= bond.totalPeriods; t++) {
      pv += bond.couponPerPeriod / Math.pow(1 + periodRate, t);
    }
    pv += bond.faceValue / Math.pow(1 + periodRate, bond.totalPeriods);
    return pv;
  }

  it('should solve YTM for premium bond (price > par)', () => {
    const bond = new Bond(1000, 5, 1050, 10, 'annual');
    const ytm = solver.annualYtm(bond);
    expect(ytm).toBeLessThan(0.05);
    expect(ytm).toBeGreaterThan(0);
    const impliedPrice = bondPrice(bond, ytm);
    expect(Math.abs(impliedPrice - 1050)).toBeLessThan(1);
  });

  it('should solve YTM for discount bond (price < par)', () => {
    const bond = new Bond(1000, 5, 950, 10, 'annual');
    const ytm = solver.annualYtm(bond);
    expect(ytm).toBeGreaterThan(0.05);
    const impliedPrice = bondPrice(bond, ytm);
    expect(Math.abs(impliedPrice - 950)).toBeLessThan(1);
  });

  it('should return coupon rate when price equals par', () => {
    const bond = new Bond(1000, 5, 1000, 10, 'annual');
    const ytm = solver.annualYtm(bond);
    expect(Math.abs(ytm - 0.05)).toBeLessThan(1e-4);
  });

  it('should solve YTM for semi-annual coupon bond', () => {
    const bond = new Bond(1000, 6, 980, 5, 'semi-annual');
    const ytm = solver.annualYtm(bond);
    expect(ytm).toBeGreaterThan(0);
    const impliedPrice = bondPrice(bond, ytm);
    expect(Math.abs(impliedPrice - 980)).toBeLessThan(1);
  });

  it('should solve YTM for zero coupon bond', () => {
    const bond = new Bond(1000, 0, 613.91, 10, 'annual');
    const ytm = solver.annualYtm(bond);
    const expectedYtm = Math.pow(1000 / 613.91, 1 / 10) - 1;
    expect(Math.abs(ytm - expectedYtm)).toBeLessThan(1e-4);
  });

  it('should converge within tolerance', () => {
    const bond = new Bond(1000, 5, 950, 10, 'annual');
    const ytm = solver.annualYtm(bond);
    const price = bondPrice(bond, ytm);
    expect(Math.abs(price - bond.marketPrice)).toBeLessThan(1e-3);
  });
});
