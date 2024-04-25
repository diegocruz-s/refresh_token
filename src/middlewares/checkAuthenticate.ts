import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export async function checkAuthenticate (req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if(!authorization) {
      return res.status(422).json({
        errors: ['Access denied!'],
      });
    };

    const [, token] = authorization.split(' ');

    if(!token) {
      return res.status(422).json({
          errors: ['Invalid token!']
      });
    };

    verify(token, process.env.TOKEN_SECRET!);

    next();

  } catch (error: any) {    
    return res.status(500).json({
        errors: [error.message],
    });
  };
};