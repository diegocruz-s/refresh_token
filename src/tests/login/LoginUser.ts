
import request from 'supertest';
import { appController } from '../..';

const app = appController.app;

export async function loginUser () {
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
  
  return {
    user: { ...datasUser, id: response.body.userId },
    token: responseLogin.body.token,
    refreshToken: responseLogin.body.refreshToken,
  };
};