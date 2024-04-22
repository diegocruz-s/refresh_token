import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { createUser } from "../../tests/factories/CreateUser";
import { AuthenticateUseCase } from "./AuthenticateUseCase";
import { IAuthenticateRepository, ICompareHashPassword, IGenerateToken } from "./protocols";

const { user } = createUser({});
const dateNow = Date.now();

const makeFakeRepository = () => {
  class AuthenticateRepository implements IAuthenticateRepository {
    private users: User[] = [user];

    async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
      const newRefreshToken = new RefreshToken({
        userId, expiresIn,
      });

      const { errors, valid } = newRefreshToken.isValid();

      if(!valid) throw new Error('Error generate refresh token!');

      return newRefreshToken;
    };

    async findUserByEmail(email: string): Promise<User | null> {
      const findUser = this.users.find(user => user.email === email);
      
      if(!findUser) return null;

      return findUser;
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
  const authenticateUseCase = new AuthenticateUseCase(
    authenticateRepository,
    compareHashPassword,
    generateToken,
  );

  return {
    authenticateUseCase,
  };
};

describe('Authenticate Use Case', () => {
  it('should return a token and refreshToken', async () => {
    const { authenticateUseCase } = makeControllerWithMocks();

    const datasLogin = {
      email: user.email,
      password: user.password,
    };

    const { token, refreshToken } = await authenticateUseCase.execute(datasLogin);

    expect(token).toBeTruthy();
    expect(refreshToken?.userId).toBe(user.id);
    expect(refreshToken?.expiresIn.getTime()).toBeGreaterThan(dateNow);
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
