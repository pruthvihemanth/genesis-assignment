import { BondsService } from './bonds.service';
import { CashFlowGenerator } from './cash-flow-generator';
import { YtmSolver } from './ytm-solver';
import { CalculateBondDto, CouponFrequencyDto } from '../dto/calculate-bond.dto';

describe('Price–yield curve', () => {
  let bondsService: BondsService;

  beforeEach(() => {
    bondsService = new BondsService(new CashFlowGenerator(), new YtmSolver());
  });

  const validDto: CalculateBondDto = {
    faceValue: 1000,
    annualCouponRate: 5,
    marketPrice: 950,
    yearsToMaturity: 10,
    couponFrequency: CouponFrequencyDto.ANNUAL,
  } as CalculateBondDto;

  it('should return curve with expected length (ytm ± 5%, step 0.25%)', () => {
    const result = bondsService.getPriceYieldCurve(validDto);
    const expectedMinPoints = (0.1 / 0.0025) + 1;
    expect(result.curve.length).toBeGreaterThanOrEqual(expectedMinPoints - 2);
    expect(result.curve.length).toBeLessThanOrEqual(expectedMinPoints + 2);
  });

  it('should return curve sorted by yield ascending', () => {
    const result = bondsService.getPriceYieldCurve(validDto);
    for (let i = 1; i < result.curve.length; i++) {
      expect(result.curve[i].yield).toBeGreaterThanOrEqual(result.curve[i - 1].yield);
    }
  });

  it('should have price decreasing as yield increases', () => {
    const result = bondsService.getPriceYieldCurve(validDto);
    for (let i = 1; i < result.curve.length; i++) {
      expect(result.curve[i].price).toBeLessThanOrEqual(result.curve[i - 1].price);
    }
  });

  it('should include computed YTM in response', () => {
    const result = bondsService.getPriceYieldCurve(validDto);
    expect(typeof result.ytm).toBe('number');
    expect(result.ytm).toBeGreaterThan(0);
  });
});
