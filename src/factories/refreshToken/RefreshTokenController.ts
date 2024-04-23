import { prismaClient } from "../../database/prisma";
import { GenerateTokenJwt } from "../../helpers/GenerateTokenJwt";
import { PrismaRefreshTokenRepository } from "../../repositories/prisma/PrismaRefreshTokenRepository";
import { RefreshTokenController } from "../../useCases/refreshToken/RefreshTokenController";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";

export function factoryRefreshTokenController () {
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prismaClient);
  const generateTokenJwt = new GenerateTokenJwt();
  const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, generateTokenJwt);
  const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

  return {
    refreshTokenController,
  };
};

