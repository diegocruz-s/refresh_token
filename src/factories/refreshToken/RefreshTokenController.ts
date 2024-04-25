import { prismaClient } from "../../database/prisma";
import { FormatDate } from "../../helpers/FormatDate";
import { GenerateTokenJwt } from "../../helpers/GenerateTokenJwt";
import { PrismaRefreshTokenRepository } from "../../repositories/prisma/PrismaRefreshTokenRepository";
import { RefreshTokenController } from "../../useCases/refreshToken/RefreshTokenController";
import { RefreshTokenUseCase } from "../../useCases/refreshToken/RefreshTokenUseCase";

export function factoryRefreshTokenController () {
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prismaClient);
  const generateTokenJwt = new GenerateTokenJwt();
  const formatDate = new FormatDate();
  
  const refreshTokenUseCase = new RefreshTokenUseCase(
    refreshTokenRepository, generateTokenJwt, formatDate
  );

  const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

  return {
    refreshTokenController,
  };
};

