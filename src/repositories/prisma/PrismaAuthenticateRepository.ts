import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { IAuthenticateRepository } from "../../useCases/authenticate/protocols";

export class PrismaAuthenticateRepository implements IAuthenticateRepository {
  async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
    
  };

  async findUserByEmail(email: string): Promise<User | null> {
    
  };
};