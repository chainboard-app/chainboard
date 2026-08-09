import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/github (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/github')
      .expect(302);
  });

  it('/auth/github/callback (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/github/callback')
      .expect(302);
  });

  it('/auth/verify (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/verify')
      .send({ token: 'test-token' })
      .expect(401); // Invalid token
  });
});
