import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // @nestjs-modules/ioredis@2.0.2's RedisCoreModule does not implement
    // OnModuleDestroy, so app.close() alone leaves the ioredis TCP socket
    // open and Jest hanging. Quit it explicitly before closing the app.
    const redis = app.get<Redis>(getRedisConnectionToken());
    await redis.quit();
    await app.close();
  });

  it('/api/user/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/user/test')
      .expect(200)
      .expect('User Test Method');
  });
});
