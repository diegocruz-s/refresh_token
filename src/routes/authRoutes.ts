import { Router } from "express";

import { factoryAuthenticateController } from '../factories/login/AuthenticateController';
import { factoryRefreshTokenController } from "../factories/refreshToken/RefreshTokenController";

const router = Router();


router.post('/', async (req, res) => {
  const { createAuthenticateController } = factoryAuthenticateController();

  const { statusCode, body } = await createAuthenticateController.handle({
    body: req.body,
  });
  
  return res.status(statusCode).json(body);
});

router.post('/refresh_token', async (req, res) => {
  const { refreshTokenController } = factoryRefreshTokenController();
  
  const { statusCode, body } = await refreshTokenController.handle({
    body: req.body,
  });

  return res.status(statusCode).json(body);
});

export {
  router,
};
