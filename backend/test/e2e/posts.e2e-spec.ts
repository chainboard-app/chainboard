import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Posts E2E', () => {
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

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/posts (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ content: 'Test post content' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('content');
      });
  });

  it('/posts/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('/posts/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/posts/1')
      .send({ content: 'Updated content' })
      .expect(200);
  });

  it('/posts/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/posts/1')
      .expect(200);
  });
});
