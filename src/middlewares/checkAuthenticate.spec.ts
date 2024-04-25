import 'dotenv/config';
import { randomUUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken";
import { checkAuthenticate } from "./checkAuthenticate";

describe('Authenticate Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFn: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should call next function when token is correct', async () => {
    const userIdTest = randomUUID();
    const tokenTest = sign({ 
      id: userIdTest 
    }, process.env.TOKEN_SECRET!, {
      expiresIn: '2d',
    });

    mockRequest = {
      headers: {
        authorization: `Bearer ${tokenTest}`,
      },
    };

    checkAuthenticate(mockRequest as Request, mockResponse as Response, nextFn);

    expect(nextFn).toHaveBeenCalledTimes(1);
  });

  it('should return a error when headers request is empty', async () => {
    const expectResponse = {
      errors: ['Access denied!'],
    };

    mockRequest = {
      headers: {},
    };

   checkAuthenticate(mockRequest as Request, mockResponse as Response, nextFn);
   
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFn).toHaveBeenCalledTimes(0);

  });

  it('should return a error when headers request is empty', async () => {
    const expectResponse = {
      errors: ['Invalid token!'],
    };

    mockRequest = {
      headers: {
        authorization: `invalid`,
      },
    };

   checkAuthenticate(mockRequest as Request, mockResponse as Response, nextFn);
   
    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFn).toHaveBeenCalledTimes(0);

  });
 
  it('should return a error when verify token as scret is failed', async () => {
    const expectResponse = {
      errors: ['invalid signature'],
    };

    const secret = 'sdfretdbfbvdh';
    const userIdTest = randomUUID();

    const tokenTest = sign({ 
      id: userIdTest 
    }, secret, {
      expiresIn: '2d',
    });

    mockRequest = {
      headers: {
        authorization: `Bearer ${tokenTest}`,
      },
    };

    checkAuthenticate(mockRequest as Request, mockResponse as Response, nextFn);
   
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expectResponse);
    expect(nextFn).toHaveBeenCalledTimes(0);
  });
});