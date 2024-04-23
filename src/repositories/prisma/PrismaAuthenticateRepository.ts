import { PrismaClient } from "@prisma/client";
import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { IAuthenticateRepository } from "../../useCases/authenticate/protocols";
import { MapperPrisma } from "./mappers/MapperPrisma";

export class PrismaAuthenticateRepository implements IAuthenticateRepository {
  constructor(
    private readonly prismaClient: PrismaClient,
  ) {};

  async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
    const refreshToken = await this.prismaClient.refreshToken.create({
      data: {
        expiresIn, userId,
      },
    });

    const refreshTokenEntity = MapperPrisma.prismaToObjRefreshToken(refreshToken);

    return refreshTokenEntity;
  };

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if(!user) return null;

    const userEntity = MapperPrisma.prismaToObjUser(user);

    return userEntity;
  };
};