import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Project Manager API (E2E)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let projectId: string;
  let stageId: string;
  let taskId: string;

  const randomStr = Math.random().toString(36).substring(7);
  const testUser = {
    fullname: `Test User ${randomStr}`,
    email: `test_${randomStr}@e2e.com`,
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) - Debería registrar un usuario', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('/auth/login (POST) - Debería loguearse y devolver Token', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        jwtToken = res.body.token;
      });
  });

  it('/projects (POST) - Debería crear un proyecto protegido', () => {
    return request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: `Proyecto E2E ${randomStr}`,
        description: 'Proyecto creado automáticamente por test runner',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        projectId = res.body.id;
      });
  });

  it('/stages (POST) - Debería crear una columna en el proyecto', () => {
    return request(app.getHttpServer())
      .post('/stages')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'To Do',
        projectId: projectId,
      })
      .expect(201)
      .expect((res) => {
        stageId = res.body.id;
      });
  });

  it('/tasks (POST) - Debería crear una tarea', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Tarea Automática',
        projectId: projectId,
        stageId: stageId,
      })
      .expect(201)
      .expect((res) => {
        taskId = res.body.id;
        expect(res.body.title).toBe('Tarea Automática');
      });
  });

  it('/tasks/:id (PATCH) - Debería mover la tarea (y generar auditoría)', async () => {
    const stage2Res = await request(app.getHttpServer())
      .post('/stages')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Done', projectId: projectId });

    const newStageId = stage2Res.body.id;

    return request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ stageId: newStageId })
      .expect(200)
      .expect((res) => {
        expect(res.body.stage.id).toBe(newStageId);
      });
  });

  it('/audit (GET) - Debería haber registrado el movimiento', () => {
    return request(app.getHttpServer())
      .get('/audit')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        const logs = res.body;
        const moveLog = logs.find((log: any) => log.action === 'MOVE_TASK');
        expect(moveLog).toBeDefined();
        expect(moveLog.details).toEqual(
          expect.objectContaining({ taskTitle: 'Tarea Automática' }),
        );
      });
  });
});
