import { prismaClient } from "../../database/prisma";
import { HashPasswordBcrypt } from "../../helpers/HashPasswordBcrypt";
import { PrismaCreateUserRepository } from "../../repositories/prisma/PrismaCreateUserRepository";
import { CreateUserController } from "../../useCases/createUser/CreateUserController";
import { CreateUserUseCase } from "../../useCases/createUser/CreateUserUseCase";

export function factoryCreateUserController () {
  const hashPasswordBcrypt = new HashPasswordBcrypt();
  const createUserRepository = new PrismaCreateUserRepository(prismaClient);
  const createUserUseCase = new CreateUserUseCase(createUserRepository, hashPasswordBcrypt);
  const createUserController = new CreateUserController(createUserUseCase);

  return {
    createUserController,
  };
};
