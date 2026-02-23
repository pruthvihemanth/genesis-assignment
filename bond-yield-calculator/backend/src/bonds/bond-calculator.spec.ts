import { BondCalculator } from './bond-calculator';
import { Bond } from '../domain/bond.entity';

describe('BondCalculator', () => {
  describe('currentYield', () => {
    it('should compute current yield correctly', () => {
      const bond = new Bond(1000, 5, 950, 10, 'annual');
      const cy = BondCalculator.currentYield(bond);
      expect(cy).toBeCloseTo(50 / 950, 6);
    });

    it('should return 0 when market price is 0', () => {
      const bond = new Bond(1000, 5, 0, 10, 'annual');
      expect(BondCalculator.currentYield(bond)).toBe(0);
    });
  });

  describe('totalInterest', () => {
    it('should sum coupon payments for annual bond', () => {
      const bond = new Bond(1000, 5, 1000, 10, 'annual');
      expect(BondCalculator.totalInterest(bond)).toBe(10 * 50);
    });

    it('should sum coupon payments for semi-annual bond', () => {
      const bond = new Bond(1000, 6, 1000, 5, 'semi-annual');
      expect(BondCalculator.totalInterest(bond)).toBe(10 * 30);
    });

    it('should return 0 for zero coupon bond', () => {
      const bond = new Bond(1000, 0, 800, 10, 'annual');
      expect(BondCalculator.totalInterest(bond)).toBe(0);
    });
  });

  describe('premiumOrDiscount', () => {
    it('should return premium when market price > face value', () => {
      const bond = new Bond(1000, 5, 1050, 10, 'annual');
      expect(BondCalculator.premiumOrDiscount(bond)).toBe('premium');
    });

    it('should return discount when market price < face value', () => {
      const bond = new Bond(1000, 5, 950, 10, 'annual');
      expect(BondCalculator.premiumOrDiscount(bond)).toBe('discount');
    });

    it('should return par when market price equals face value', () => {
      const bond = new Bond(1000, 5, 1000, 10, 'annual');
      expect(BondCalculator.premiumOrDiscount(bond)).toBe('par');
    });

    it('should return par when difference is within numerical tolerance', () => {
      const bond = new Bond(1000, 5, 1000 + 1e-10, 10, 'annual');
      expect(BondCalculator.premiumOrDiscount(bond)).toBe('par');
    });
  });
});
