import { Router } from "express";

import { factoryAuthenticateController } from '../factories/login/AuthenticateController';

const router = Router();


router.post('/', async (req, res) => {
  const { createAuthenticateController } = factoryAuthenticateController();

  const { statusCode, body } = await createAuthenticateController.handle({
    body: req.body,
  });
  
  return res.status(statusCode).json(body);
});

export {
  router,
};
