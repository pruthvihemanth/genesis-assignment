import { Bond } from '../domain/bond.entity';
import type { CashFlow } from '../domain/cash-flow.interface';
export declare class CashFlowGenerator {
    generate(bond: Bond, baseDate?: Date): CashFlow[];
    private addMonths;
}
