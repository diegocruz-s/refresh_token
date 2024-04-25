import { IFormateDate, IGenerateToken } from "../globalInterfaces";
import { IRefreshTokenRepository, IRefreshTokenUseCase, IReturnResponseRefreshToken } from "./protocols";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly generateToken: IGenerateToken,
    private readonly formatDateExpires: IFormateDate,
  ) {};

  async execute(refresh_token_id: string): Promise<Omit<IReturnResponseRefreshToken, "errors">> {    
    const refreshToken = await this.refreshTokenRepository.findRefreshTokenById(refresh_token_id);    
    if(!refreshToken) throw new Error('Refresh token not found!');

    const currentDate = new Date();
    const expiredDate = refreshToken.expiresIn;

    const isValidDateExpires = expiredDate.getTime() > currentDate.getTime();
  
    if(!isValidDateExpires) throw new Error('Refresh token expired!');

    await this.refreshTokenRepository.deleteRefreshTokenByUserId(refreshToken.userId);

    const expiresInRefreshToken = await this.formatDateExpires.execute(
      currentDate,
      process.env.EXPIRE_DATE_REFRESH_TOKEN! || '7d',
    );
    const newRefreshToken = await this.refreshTokenRepository.createRefreshToken(
      refreshToken.userId, expiresInRefreshToken,
    );

    const token = await this.generateToken.execute(
      refreshToken.userId, process.env.TOKEN_SECRET!, process.env.EXPIRE_DATE_TOKEN!
    );

    return {
      refreshToken: newRefreshToken,
      token,
    };
  };
};
