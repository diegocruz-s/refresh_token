import * as dotenv from 'dotenv';
dotenv.config({
    path: '.env.testing',
});

import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { createUser } from "../../tests/factories/CreateUser";
import { IFormateDate, IGenerateToken } from "../globalInterfaces";
import { AuthenticateUseCase } from "./AuthenticateUseCase";
import { IAuthenticateRepository, ICompareHashPassword } from "./protocols";

const { user } = createUser({});
const refreshToken = new RefreshToken({
  expiresIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  userId: user.id,
});

const dateNow = Date.now();

const makeFakeFormatDate = () => {
  class FormatDate implements IFormateDate {
    async execute(date: Date, timeToIncrease: string): Promise<Date> {
      return new Date(Date.now() + 2 * 1000 * 60 * 60 * 24);
    };
  };

  const formatDate = new FormatDate();

  return {
    formatDate,
  };
};

const makeFakeRepository = () => {
  class AuthenticateRepository implements IAuthenticateRepository {
    private users: User[] = [user];
    public refreshToken: RefreshToken[] = [refreshToken];

    async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
      const newRefreshToken = new RefreshToken({
        userId, expiresIn,
      });

      const { errors, valid } = newRefreshToken.isValid();

      if(!valid) throw new Error('Error generate refresh token!');

      this.refreshToken.push(newRefreshToken);

      return newRefreshToken;
    };

    async findUserByEmail(email: string): Promise<User | null> {
      const findUser = this.users.find(user => user.email === email);
      
      if(!findUser) return null;

      return findUser;
    };

    async deleteRefreshTokenByUserId(userId: string): Promise<void> {
      this.refreshToken = this.refreshToken.filter(rT => rT.userId !== userId);
    };

  };

  const authenticateRepository = new AuthenticateRepository();

  return {
    authenticateRepository,
  };
};

const makeCompareHashPassword = () => {
  class CompareHashPassword implements ICompareHashPassword {
    async execute(hash: string, password: string): Promise<boolean> {
      if(hash === password) return true;
      return false;
    };
  };

  const compareHashPassword = new CompareHashPassword();

  return {
    compareHashPassword,
  };
};

const makeGenerateToken = () => {
  class GenerateToken implements IGenerateToken {
    async execute(id: string, secret: string, expiresIn: string): Promise<string> {
      const token = `${id}-${secret}-${expiresIn}`;

      return token;
    }
  };

  const generateToken = new GenerateToken();
  
  return {
    generateToken,
  };
};

const makeControllerWithMocks = () => {
  const { authenticateRepository } = makeFakeRepository();
  const { compareHashPassword } = makeCompareHashPassword();
  const { generateToken } = makeGenerateToken();
  const { formatDate } = makeFakeFormatDate();
  const authenticateUseCase = new AuthenticateUseCase(
    authenticateRepository,
    compareHashPassword,
    generateToken,
    formatDate
  );

  return {
    authenticateUseCase,
    authenticateRepository,
  };
};

describe('Authenticate Use Case', () => {
  it('should return a token and refreshToken', async () => {
    const { authenticateUseCase, authenticateRepository } = makeControllerWithMocks();

    const datasLogin = {
      email: user.email,
      password: user.password,
    };

    const { token, refreshToken } = await authenticateUseCase.execute(datasLogin);

    expect(token).toBeTruthy();
    expect(refreshToken?.userId).toBe(user.id);
    expect(refreshToken?.expiresIn.getTime()).toBeGreaterThan(dateNow);
    expect(authenticateRepository.refreshToken.length).toBe(1);
  });

  it('should return a error when user not exists', async () => {
    const { authenticateUseCase } = makeControllerWithMocks();

    const datasLogin = {
      email: 'any_email@gmail.com',
      password: user.password,
    };

    await expect(authenticateUseCase.execute(datasLogin)).rejects.toThrow('Authentication invalid!');
  });

  it('should return a error when compareHashPassword is not valid', async () => {
    const { authenticateUseCase } = makeControllerWithMocks();

    const datasLogin = {
      email: user.email,
      password: 'any_pass',
    };

    await expect(authenticateUseCase.execute(datasLogin)).rejects.toThrow('Authentication invalid!');
  });
}); 
