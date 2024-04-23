import { IGenerateToken } from "../globalInterfaces";
import { IRefreshTokenRepository, IRefreshTokenUseCase, IReturnResponseRefreshToken } from "./protocols";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly generateToken: IGenerateToken,
  ) {};

  async execute(refresh_token_id: string): Promise<Omit<IReturnResponseRefreshToken, "errors">> {
    const refreshToken = await this.refreshTokenRepository.findRefreshTokenById(refresh_token_id);

    if(!refreshToken) throw new Error('Refresh token not found!');

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const expiredDate = refreshToken.expiresIn
    expiredDate.setHours(0, 0, 0, 0);

    const isValidDateExpires = expiredDate.getTime() > currentDate.getTime();

    if(!isValidDateExpires) throw new Error('Refresh token expired!');

    await this.refreshTokenRepository.deleteRefreshTokenByUserId(refreshToken.userId);

    const expiresInRefreshToken = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const newRefreshToken = await this.refreshTokenRepository.createRefreshToken(
      refreshToken.userId, expiresInRefreshToken,
    );
    
    const token = await this.generateToken.execute(refreshToken.userId, 'any_secret_token', '2d');

    return {
      refreshToken: newRefreshToken,
      token,
    };
  };
};
