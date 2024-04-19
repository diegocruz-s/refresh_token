import request from 'supertest';
import { appController } from '..';
import { prismaClient } from '../database/prisma';
import { createUserTest } from '../tests/factories/CreateUser';
const app = appController.app;

describe('Create User[e2e]', () => {
  beforeEach(async () => {
    await prismaClient.user.deleteMany();
  });

  it('should create a User', async () => {
    const datasBody = {
      email: 'email_teste@gmail.com',
      password: 'PassTest@123', 
      username: 'username_test',
    };

    const response = await request(app)
      .post('/users')
      .send(datasBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body.errors).toBeNull();
  });

  it('should return a error when user already exists[email]', async () => {
    const datasBody = {
      email: 'email_teste@gmail.com',
      password: 'PassTest2@123', 
      username: 'username_test',
    };

    const responseOne = await request(app)
      .post('/users')
      .send(datasBody);

    expect(responseOne.status).toBe(201);
    expect(responseOne.body).toHaveProperty('userId');
    expect(responseOne.body.errors).toBeNull();

    datasBody.username = 'outher_username';

    const responseTwo = await request(app)
      .post('/users')
      .send(datasBody);
    
    expect(responseTwo.status).toBe(422);
    expect(responseTwo.body).not.toHaveProperty('userId');
    expect(responseTwo.body.errors[0]).toBe('User already exists!');
  
  });

  it('should return a error when user already exists[username]', async () => {
    const datasBody = {
      email: 'email_teste@gmail.com',
      password: 'PassTest2@123', 
      username: 'username_test',
    };

    const responseOne = await request(app)
      .post('/users')
      .send(datasBody);

    expect(responseOne.status).toBe(201);
    expect(responseOne.body).toHaveProperty('userId');
    expect(responseOne.body.errors).toBeNull();

    datasBody.email = 'outher_email@gmail.com';

    const responseTwo = await request(app)
      .post('/users')
      .send(datasBody);
    
    expect(responseTwo.status).toBe(422);
    expect(responseTwo.body).not.toHaveProperty('userId');
    expect(responseTwo.body.errors[0]).toBe('User already exists!');

  });
});
