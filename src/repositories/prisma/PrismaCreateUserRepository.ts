import { PrismaClient } from "@prisma/client";
import { User } from "../../entities/User";
import { ICreateUserRepository } from "../../useCases/createUser/protocols";

export class PrismaCreateUserRepository implements ICreateUserRepository {
  constructor(
    private readonly prismaClient: PrismaClient
  ) {}
  
  async createUser(user: User): Promise<string> {
    const { email, id, password, username } = user;
    const newUser = await this.prismaClient.user.create({
      data: {
        id, email, password, username
      }
    });

    return newUser.id;
  };

  async userExists(email: string, username: string): Promise<boolean> {
    const user = await this.prismaClient.user.findFirst({
      where: {
        AND: [
          { email }, { username },
        ],
      },
    });

    return user ? true : false;
  };
};