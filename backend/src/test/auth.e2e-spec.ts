import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './utils/test-app';

function asCookieArray(v: unknown): string[] {
  if (!v) return [];
  return Array.isArray(v) ? (v as string[]) : [String(v)];
}

describe('Auth flow testing', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    email: 'system@gmail.com',
    password: 'Password123!',
    name: 'tester',
    phoneNumber: '0900000000',
  };

  it('login -> sets cookies and returns user', async () => {
   
    await request(app.getHttpServer())
      .post('/auth/register')
      .field('email', user.email)
      .field('password', user.password)
      .field('name', user.name)
      .attach('profileImage', Buffer.from(''), 'empty.png')
      .expect(201);
  
  
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201);
  
    expect(res.body.user).toBeDefined();
  });

  it('me (guarded) -> returns current user with cookies', async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.post('/auth/login').send({ email: user.email, password: user.password }).expect(201);
    const me = await agent.get('/auth/me').expect(200);

    expect(me.body).toBeDefined();
  });

  it('refresh -> rotates access token (sets new access_token cookie)', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').send({ email: user.email, password: user.password }).expect(201);

    const res = await agent.post('/auth/refresh').expect(201);
    expect(res.body).toEqual({ ok: true });

    const cookies = asCookieArray(res.headers['set-cookie']);
    expect(cookies.some(c => c.startsWith('access_token='))).toBe(true);
  });
});
