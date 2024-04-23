import { RefreshToken } from "../../entities/RefreshToken";
import { createUser } from "../../tests/factories/CreateUser";
import { RefreshTokenController } from "./RefreshTokenController";
import { IRefreshTokenUseCase, IReturnResponseRefreshToken } from "./protocols";

const { user } = createUser({});
const dateNow = Date.now();

const makeRefreshTokenUseCase = () => {
  const refreshTokenUseCase: IRefreshTokenUseCase = {
    async execute(refresh_token_id: string): Promise<Omit<IReturnResponseRefreshToken, 'errors'>> {
      const refreshToken = new RefreshToken({
        expiresIn: new Date(Date.now() + 300000),
        userId: user.id,
        id: refresh_token_id,
      });

      return {
        refreshToken,
        token: 'any_token',
      };
    },
  };

  return {
    refreshTokenUseCase,
  };
};

const makeRefreshTokenUseCaseFailed = () => {
  const refreshTokenUseCase: IRefreshTokenUseCase = {
    async execute(refresh_token_id: string): Promise<Omit<IReturnResponseRefreshToken, 'errors'>> {
      throw new Error('Refresh token not found!');
    },
  };

  return {
    refreshTokenUseCase,
  };
};

const makeControllerWithMocks = () => {
  const { refreshTokenUseCase } = makeRefreshTokenUseCase();
  const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

  return {
    refreshTokenController,
  };
};

const makeControllerWithMocksFailed = () => {
  const { refreshTokenUseCase } = makeRefreshTokenUseCaseFailed();
  const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

  return {
    refreshTokenController,
  };
};

describe('Refresh Token Controller', () => {
  it('should return a token and refresh token', async () => {
    const { refreshTokenController } = makeControllerWithMocks();
    const refreshTokenId = 'any_refresh_token'

    const { body, statusCode } = await refreshTokenController.handle({
      body: {
        refresh_token_id: refreshTokenId,
      },
    });

    expect(statusCode).toBe(200);
    expect(body.errors).toBeNull();
    expect(body.refreshToken?.id).toBe(refreshTokenId);
    expect(body.refreshToken?.userId).toBe(user.id);
    expect(body.refreshToken?.expiresIn.getTime()).toBeGreaterThan(dateNow);
  });

  it('should return a error when refresh token id is not provided', async () => {
    const { refreshTokenController } = makeControllerWithMocks();

    const { body, statusCode } = await refreshTokenController.handle({});

    expect(statusCode).toBe(422);
    expect(body.errors![0]).toBe('Refresh token id is required!');
  });

  it('should return a error when useCase return a error', async () => {
    const { refreshTokenController } = makeControllerWithMocksFailed();

    const { body, statusCode } = await refreshTokenController.handle({
      body: {
        refresh_token_id: 'any',
      },
    });

    expect(statusCode).toBe(404);
    expect(body.errors![0]).toBe('Refresh token not found!');
  });
});