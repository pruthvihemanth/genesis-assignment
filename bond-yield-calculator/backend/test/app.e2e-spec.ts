import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Bond Yield API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns 200 and status ok', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'ok');
      });
  });

  it('POST /api/v1/bonds/calculate returns 200 with yields and cash flows', () => {
    return request(app.getHttpServer())
      .post('/api/v1/bonds/calculate')
      .send({
        faceValue: 1000,
        annualCouponRate: 5,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 'annual',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('currentYield');
        expect(res.body).toHaveProperty('ytm');
        expect(res.body).toHaveProperty('totalInterest');
        expect(res.body).toHaveProperty('premiumOrDiscount', 'discount');
        expect(Array.isArray(res.body.cashFlows)).toBe(true);
        expect(res.body.cashFlows.length).toBe(10);
      });
  });
});
