import * as dotenv from 'dotenv';
dotenv.config({
    path: '.env.testing',
});

import request from 'supertest';
import { appController } from '..';
import { prismaClient } from '../database/prisma';
import { createUser } from '../tests/factories/CreateUser';
import { loginUser } from '../tests/login/LoginUser';
import { RefreshToken } from '../entities/RefreshToken';
import { advanceTo, clear } from 'jest-date-mock'

const app = appController.app;

const dateNow = Date.now();

describe('Authentication [e2e]', () => {
  beforeEach(async () => {
    await prismaClient.refreshToken.deleteMany();
    await prismaClient.user.deleteMany();
  });

  afterAll(() => clear());

  it('should return a token and refresh token', async () => {
    const { refreshToken, token } = await loginUser();
    
    const response = await request(app)
      .post('/auth/refresh_token')
      .send({ refresh_token_id: refreshToken._id });
    
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeNull();
    expect(response.body.token).toBeTruthy();
    expect(response.body.refreshToken).toHaveProperty('_id');
    expect(response.body.refreshToken._id).not.toBe(refreshToken._id);
    expect(response.body.refreshToken.userId).toBe(refreshToken.userId);
    expect(new Date(response.body.refreshToken.expiresIn).getTime()).toBeGreaterThan(dateNow);
  });

  it('should return a error when refreshTokenId is not provided', async () => {    
    const response = await request(app)
      .post('/auth/refresh_token');

    expect(response.status).toBe(422);
    expect(response.body.errors![0]).toBe('Refresh token id is required!');
  });

  it('should return a error when refreshToken is not found', async () => {  
    const response = await request(app)
      .post('/auth/refresh_token')
      .send({ refresh_token_id: 'any_refresh_token' });

    expect(response.status).toBe(404);
    expect(response.body.errors![0]).toBe('Refresh token not found!');
  });

  it('should return a error when refreshToken is expired', async () => {  
    const { refreshToken, token } = await loginUser();
        
    const originalDateNow = Date.now();
    advanceTo(new Date(originalDateNow + 10 * 24 * 60 * 60 * 1000));
    expect(Date.now()).toBe(originalDateNow + 10 * 24 * 60 * 60 * 1000);

    const response = await request(app)
      .post('/auth/refresh_token')
      .send({ refresh_token_id: refreshToken._id });

    expect(response.status).toBe(422);
    expect(response.body.errors![0]).toBe('Refresh token expired!');

    clear();
   
  });

});
