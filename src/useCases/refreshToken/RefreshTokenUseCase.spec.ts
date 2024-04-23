import { randomUUID } from "crypto";
import { RefreshToken } from "../../entities/RefreshToken";
import { createUser } from "../../tests/factories/CreateUser";
import { IGenerateToken } from "../globalInterfaces";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";
import { IRefreshTokenRepository } from "./protocols";

const { user } = createUser({});
const firstRefreshToken = new RefreshToken({
  userId: user.id,
  id: randomUUID(),
  expiresIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
});

const makeFakeGenerateToken = () => {
  class GenerateToken implements IGenerateToken {
    async execute(id: string, secret: string, expiresIn: string): Promise<string> {
      return `${id}-${secret}-${expiresIn}`;
    };
  };

  const generateToken = new GenerateToken();

  return {
    generateToken,
  };
};

const makeFakeRepository = () => {
  class RefreshTokenRepository implements IRefreshTokenRepository {
    private refreshTokens: RefreshToken[] = [firstRefreshToken];

    async createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken> {
      const newRefreshToken = new RefreshToken({
        id: randomUUID(),
        expiresIn,
        userId,
      });

      this.refreshTokens.push(newRefreshToken);
      return newRefreshToken;
    };

    async deleteRefreshTokenByUserId(userId: string): Promise<void> {
      this.refreshTokens = this.refreshTokens.filter(rT => rT.userId !== userId);
    };

    async findRefreshTokenById(id: string): Promise<RefreshToken | null> {
      const findRefreshToken = this.refreshTokens.find(rT => rT.id === id);
      if(!findRefreshToken) return null;

      return findRefreshToken;
    };

    async generateRefreshToken(refreshToken: RefreshToken) {
      this.refreshTokens.push(refreshToken);
    };

  };

  const refreshTokenRepository = new RefreshTokenRepository();

  return {
    refreshTokenRepository,
  };
};

const makeUseCaseWithMocks = () => {
  const { refreshTokenRepository } = makeFakeRepository();
  const { generateToken } = makeFakeGenerateToken();
  const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, generateToken);

  return {
    refreshTokenUseCase,
    refreshTokenRepository,
  };
};

describe('Refresh Token Use Case', () => {
  it('should return token and refresh token', async () => {
    const { refreshTokenUseCase } = makeUseCaseWithMocks();

    const { refreshToken, token } = await refreshTokenUseCase.execute(firstRefreshToken.id);

    expect(token).toBeTruthy();
    expect(refreshToken?.id).not.toBe(firstRefreshToken.id);
    expect(refreshToken?.userId).toBe(user.id);
    expect(refreshToken?.expiresIn.getTime()).toBeGreaterThan(Date.now());
  });

  it('should return a error when refresh token not found', async () => {
    const { refreshTokenUseCase } = makeUseCaseWithMocks();

    await expect(refreshTokenUseCase.execute('any_refresh_token_id')).rejects.toThrow('Refresh token not found!');
  });

  it('should return a error when refresh token expired', async () => {
    const { refreshTokenUseCase, refreshTokenRepository } = makeUseCaseWithMocks();

    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const idRT = randomUUID();
    const refreshTokenExpires = new RefreshToken({
      expiresIn: tenSecondsAgo,
      userId: user.id,
      id: idRT,
    });

    await refreshTokenRepository.generateRefreshToken(refreshTokenExpires);

    await expect(refreshTokenUseCase.execute(idRT)).rejects.toThrow('Refresh token expired!');
  });
});