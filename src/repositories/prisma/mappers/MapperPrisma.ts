import { User } from "../../../entities/User";
import { RefreshToken } from "../../../entities/RefreshToken";
import { User as UserPrisma } from "@prisma/client";
import { RefreshToken as RefreshTokenPrisma } from "@prisma/client";

export class MapperPrisma {
  static prismaToObjUser (user: UserPrisma): User {
    const { id, email, password, username } = user;
    const newUser = new User({
      email, password, username, id
    });

    return newUser
  };

  static prismaToObjRefreshToken (refreshToken: RefreshTokenPrisma): RefreshToken {
    const { expiresIn, id, userId } = refreshToken;
    const newRefreshToken = new RefreshToken({
      expiresIn, userId, id,
    });

    return newRefreshToken;
  };

  static objToPrismaUser () {};

  static objToPrismaRefreshToken () {};

};