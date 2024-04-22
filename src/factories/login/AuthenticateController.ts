import { prismaClient } from "../../database/prisma";
import { CompareHashPasswordBcrypt } from "../../helpers/CompareHashPasswordBcrypt";
import { GenerateTokenJwt } from "../../helpers/GenerateTokenJwt";
import { PrismaAuthenticateRepository } from "../../repositories/prisma/PrismaAuthenticateRepository";
import { AuthenticateController } from "../../useCases/authenticate/AuthenticateController";
import { AuthenticateUseCase } from "../../useCases/authenticate/AuthenticateUseCase";

export function factoryAuthenticateController () {
  const authenticateRepository = new PrismaAuthenticateRepository(prismaClient);
  const compareHashPasswordBcrypt = new CompareHashPasswordBcrypt();
  const generateTokenJwt = new GenerateTokenJwt();

  const authenticateUseCase = new AuthenticateUseCase(
    authenticateRepository, compareHashPasswordBcrypt, generateTokenJwt,
  );

  const createAuthenticateController = new AuthenticateController(authenticateUseCase);

  return {
    createAuthenticateController,
  };
};
