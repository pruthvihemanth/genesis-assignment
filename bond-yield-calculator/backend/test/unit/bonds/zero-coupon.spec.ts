import { Bond } from '../../../src/domain/bond.entity';
import { YtmSolver } from '../../../src/bonds/ytm-solver';
import { BondCalculator } from '../../../src/bonds/bond-calculator';
import { CashFlowGenerator } from '../../../src/bonds/cash-flow-generator';

describe('Zero coupon bond', () => {
  const faceValue = 1000;
  const yearsToMaturity = 10;
  const marketPrice = 613.91;

  it('should have zero total interest', () => {
    const bond = new Bond(faceValue, 0, marketPrice, yearsToMaturity, 'annual');
    expect(BondCalculator.totalInterest(bond)).toBe(0);
  });

  it('should have current yield zero', () => {
    const bond = new Bond(faceValue, 0, marketPrice, yearsToMaturity, 'annual');
    expect(BondCalculator.currentYield(bond)).toBe(0);
  });

  it('should compute YTM as (FV/P)^(1/n) - 1', () => {
    const bond = new Bond(faceValue, 0, marketPrice, yearsToMaturity, 'annual');
    const solver = new YtmSolver();
    const ytm = solver.annualYtm(bond);
    const expected = Math.pow(faceValue / marketPrice, 1 / yearsToMaturity) - 1;
    expect(Math.abs(ytm - expected)).toBeLessThan(1e-6);
  });

  it('should generate cash flows with zero coupon payments', () => {
    const bond = new Bond(faceValue, 0, marketPrice, yearsToMaturity, 'annual');
    const generator = new CashFlowGenerator();
    const flows = generator.generate(bond);
    expect(flows).toHaveLength(yearsToMaturity);
    flows.forEach((f) => {
      expect(f.couponPayment).toBe(0);
      expect(f.cumulativeInterest).toBe(0);
    });
    expect(flows[flows.length - 1].remainingPrincipal).toBe(0);
  });
});
