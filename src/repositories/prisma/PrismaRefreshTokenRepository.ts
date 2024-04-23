import { PrismaClient } from "@prisma/client";
import { RefreshToken } from "../../entities/RefreshToken";
import { IRefreshTokenRepository } from "../../useCases/refreshToken/protocols";
import { MapperPrisma } from "./mappers/MapperPrisma";

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    private readonly prismaClient: PrismaClient
  ) {};

  async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
    const newRefreshToken = await this.prismaClient.refreshToken.create({
      data: {
        expiresIn,
        userId,
      },
    });

    return MapperPrisma.prismaToObjRefreshToken(newRefreshToken);
  };

  async deleteRefreshTokenByUserId(userId: string): Promise<void> {
    await this.prismaClient.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  };

  async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
    const findRefreshToken = await this.prismaClient.refreshToken.findUnique({
      where: {
        id,
      },
    });

    if(!findRefreshToken) return null;

    return MapperPrisma.prismaToObjRefreshToken(findRefreshToken);
  };
};
