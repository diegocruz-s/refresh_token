import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { createUser } from "../../tests/factories/CreateUser";
import { AuthenticateController } from "./AuthenticateController";
import { IAuthenticateUseCase, IDatasRequestAuthenticate, IDatasResponseAuthenticate } from "./protocols";

const { user } = createUser({});
const dateNow = Date.now();

const makeFakeAuthenticateUseCase = () => {
  class AuthenticateUseCase implements IAuthenticateUseCase {
    private users: User[] = [user]

    async execute(datas: IDatasRequestAuthenticate): Promise<Omit<IDatasResponseAuthenticate, "errors">> {
      const refreshToken = new  RefreshToken({
        expiresIn: new Date(dateNow + 30000),
        userId: this.users[0].id,
      });

      const { errors, valid } = refreshToken.isValid();

      const token = 'any_string';

      if(!valid) throw new Error('Create Refresh Token error!');

      return {
        refreshToken,
        token,
      };
    };
  };

  const authenticateUseCase = new AuthenticateUseCase();

  return {
    authenticateUseCase
  };
};

const makeControllerWithMocks = () => {
  const { authenticateUseCase } = makeFakeAuthenticateUseCase();
  const authenticateController = new AuthenticateController(authenticateUseCase);

  return {
    authenticateController
  };
};

describe('Authenticate User', () => {
  it('should return a token and refresh_token', async () => {
    const { authenticateController } = makeControllerWithMocks();

    const datasLogin = { 
      email: user.email,
      password: user.password, 
    };

    const { statusCode, body } = await authenticateController.handle({
      body: datasLogin,
    });

    expect(statusCode).toBe(200);
    expect(body.errors).toBeNull();
    expect(body.token).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
    expect(body.refreshToken?.userId).toBe(user.id);
    expect(body.refreshToken?.expiresIn.getTime()).toBeGreaterThan(dateNow);

  });
});