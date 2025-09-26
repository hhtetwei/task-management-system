import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './utils/test-app';
import { DataSource } from 'typeorm';

type UserCred = {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  type?: 'ADMIN' | 'USER';
};

async function registerAndLogin(agent: request.SuperAgentTest, app: INestApplication, user: UserCred) {
  const reg = await agent
    .post('/auth/register')
    .field('email', user.email)
    .field('password', user.password)
    .field('name', user.name)
    .field('type', user.type ?? 'USER')
    .attach('profileImage', Buffer.from(''), 'empty.png')
    .expect(201);

  const id = reg.body?.user?.id;

  await agent
    .post('/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(201);

  return id;
}

describe('Tasks flow testing', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminAgent: any;
  let userAgent: any;
  let otherAgent: any;
  let userId: number;
  let adminId: number;
  let otherUserId: number;
  let createdTaskId: number;

  beforeAll(async () => {
    app = await createTestApp();
    dataSource = app.get(DataSource);
  
    await dataSource.getRepository('Task').createQueryBuilder().delete().execute();
    await dataSource.getRepository('User').createQueryBuilder().delete().execute();
  
    adminAgent = request.agent(app.getHttpServer());
    userAgent = request.agent(app.getHttpServer());
    otherAgent = request.agent(app.getHttpServer());
  
    adminId = await registerAndLogin(adminAgent, app, {
      email: 'admin@system.com',
      password: 'Password123!',
      name: 'Admin',
      type: 'ADMIN',
    });
  
    userId = await registerAndLogin(userAgent, app, {
      email: 'user@gmail.com',
      password: 'Password123!',
      name: 'user',
      type: 'USER',
    });
  
    otherUserId = await registerAndLogin(otherAgent, app, {
      email: 'user2@gmail.com',
      password: 'Password123!',
      name: 'user2',
      type: 'USER',
    });
  });
  
  afterAll(async () => {
    await app.close();
  });

  it('GET /tasks without auth -> 401', async () => {
    await request(app.getHttpServer()).get('/tasks').expect(401);
  });

  it('Admin creates tasks (assigned to user & to self)', async () => {
    const t1 = await adminAgent
      .post('/tasks')
      .send({
        title: 'For Bob',
        description: 'User task',
        priority: 'HIGH',
        status: 'TODO',
        assigneeId: userId,
      })
      .expect(201);

    expect(t1.body.id).toBeDefined();
    createdTaskId = t1.body.id;

    const t2 = await adminAgent
      .post('/tasks')
      .send({
        title: 'For Admin',
        description: 'Admin task',
        priority: 'LOW',
        status: 'IN_PROGRESS',
        assigneeId: adminId,
      })
      .expect(201);

    expect(t2.body.id).toBeDefined();
  });

  it('User sees only their own tasks via GET /tasks', async () => {
    const res = await userAgent
      .get('/tasks')
      .query({ page: 1, pageSize: 20 })
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    const titles = res.body.data.map((t: any) => t.title);
    expect(titles).toContain('For Bob');
    expect(titles).not.toContain('For Admin');
  });

  it('Admin sees all tasks, and can filter (status, priority, search)', async () => {
    const resAll = await adminAgent
      .get('/tasks')
      .query({ page: 1, pageSize: 20 })
      .expect(200);
    expect(resAll.body.count).toBeGreaterThanOrEqual(2);

    const resFilter = await adminAgent
      .get('/tasks')
      .query({ status: 'IN_PROGRESS', search: 'admin', page: 1, pageSize: 20 })
      .expect(200);

    const titles = resFilter.body.data.map((t: any) =>
      t.title.toLowerCase(),
    );
    expect(titles.every((ttl: string) => ttl.includes('admin'))).toBe(true);
  });

  it('Unauthorized user cannot update a task assigned to someone else -> 403', async () => {
    const res = await otherAgent
      .patch(`/tasks/${createdTaskId}`)
      .send({ title: 'Hacked' })
      .expect(403);

    expect(res.body.message || res.body.error).toBeDefined();
  });
});
