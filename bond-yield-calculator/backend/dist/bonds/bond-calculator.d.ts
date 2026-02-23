import { Bond } from '../domain/bond.entity.js';
export type PremiumOrDiscount = 'premium' | 'discount' | 'par';
export declare class BondCalculator {
    static currentYield(bond: Bond): number;
    static totalInterest(bond: Bond): number;
    static premiumOrDiscount(bond: Bond): PremiumOrDiscount;
}
