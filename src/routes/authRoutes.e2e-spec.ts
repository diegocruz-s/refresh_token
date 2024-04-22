import request from 'supertest';
import { appController } from '..';
import { createUser } from '../tests/factories/CreateUser';
import { prismaClient } from '../database/prisma';
const app = appController.app;

const dateNow = Date.now();

describe('Authentication [e2e]', () => {
  beforeEach(async () => {
    await prismaClient.refreshToken.deleteMany();
    await prismaClient.user.deleteMany();
  });

  it('should return token and refresh token', async () => {
    const datasUser = {
      email: 'any_email@gmail.com',
      password: 'any_pass',
      username: 'Any_username'
    };
    const response = await request(app)
      .post('/users')
      .send(datasUser)
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.errors).toBeNull();

    const responseLogin = await request(app)
      .post('/auth')
      .send({ email: datasUser.email, password: datasUser.password });
    
    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body.errors).toBeNull();
    expect(responseLogin.body.token).toBeTruthy();
    expect(responseLogin.body.refreshToken).toBeTruthy();
    expect(responseLogin.body.refreshToken).toHaveProperty('_id');
    const date = new Date(responseLogin.body.refreshToken.expiresIn);
    expect(date.getTime()).toBeGreaterThan(dateNow);
    expect(responseLogin.body.refreshToken.userId).toBe(response.body.userId);
  });

  it('should return a error when user not found!', async () => {
    const datasUser = {
      email: 'any_email@gmail.com',
      password: 'any_pass',
      username: 'Any_username'
    };
    const response = await request(app)
      .post('/users')
      .send(datasUser)
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.errors).toBeNull();

    const responseLogin = await request(app)
      .post('/auth')
      .send({ email: 'outher_email@gmail.com', password: datasUser.password });
    
    expect(responseLogin.status).toBe(422);
    expect(responseLogin.body.errors).toBeTruthy();
    expect(responseLogin.body.errors[0]).toBe('Authentication invalid!');
  });

  it('should return a error when password not match!', async () => {
    const datasUser = {
      email: 'any_email@gmail.com',
      password: 'any_pass',
      username: 'Any_username'
    };
    const response = await request(app)
      .post('/users')
      .send(datasUser)
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.errors).toBeNull();

    const responseLogin = await request(app)
      .post('/auth')
      .send({ email: datasUser.email, password: 'outher_pass' });
    
    expect(responseLogin.status).toBe(422);
    expect(responseLogin.body.errors).toBeTruthy();
    expect(responseLogin.body.errors[0]).toBe('Authentication invalid!');
  });

  it('should return a error when datas is nor provided', async () => {
    const datasUser = {
      email: 'any_email@gmail.com',
      password: 'any_pass',
      username: 'Any_username'
    };
    const response = await request(app)
      .post('/users')
      .send(datasUser)
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.errors).toBeNull();

    const responseLogin = await request(app)
      .post('/auth')
      .send({});    
    
    expect(responseLogin.status).toBe(422);
    expect(responseLogin.body.errors).toBeTruthy();
    expect(responseLogin.body.errors![0]).toContain('email');
    expect(responseLogin.body.errors![1]).toContain('password');
    
  });

});

