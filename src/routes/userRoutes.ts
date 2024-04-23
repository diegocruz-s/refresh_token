import { Router } from "express";
import { factoryCreateUserController } from "../factories/user/CreateUserController";
import { checkAuthenticate } from "../middlewares/checkAuthenticate";

const router = Router();

router.post('/', async (req, res) => {
  const { createUserController } = factoryCreateUserController();

  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).json(body);
});

router.get('/test', checkAuthenticate, async (req, res) => {
  return res.status(200).json({ text: 'Ok!' })
});

export {
  router,
};
