import { Router } from "express";
import { factoryCreateUserController } from "../factories/user/CreateUserController";

const router = Router();

router.post('/', async (req, res) => {
  const { createUserController } = factoryCreateUserController();

  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).json(body);
});

export {
  router,
};
