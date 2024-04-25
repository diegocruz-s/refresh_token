import { IFormateDate, IGenerateToken } from "../globalInterfaces";
import { IAuthenticateRepository, IAuthenticateUseCase, ICompareHashPassword, IDatasRequestAuthenticate, IDatasResponseAuthenticate } from "./protocols";

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor (
    private readonly authenticateRepository: IAuthenticateRepository,
    private readonly compareHashPassword: ICompareHashPassword,
    private readonly generateToken: IGenerateToken,
    private readonly formatDateExpires: IFormateDate,
  ) {};

  async execute(datas: IDatasRequestAuthenticate): Promise<Omit<IDatasResponseAuthenticate, "errors">> {
    const { email, password } = datas;
    const user = await this.authenticateRepository.findUserByEmail(email);
    
    if(!user) throw new Error('Authentication invalid!');

    const comparePasswordToHash = await this.compareHashPassword.execute(
      user.password, password
    );

    if(!comparePasswordToHash) throw new Error('Authentication invalid!');

    const expiresInRefreshToken = await this.formatDateExpires.execute(
      new Date(), process.env.EXPIRE_DATE_REFRESH_TOKEN! || '3d',
    );
      // 2 days a after

    const token = await this.generateToken.execute(
      user.id, process.env.TOKEN_SECRET!, process.env.EXPIRE_DATE_TOKEN!
    );
    await this.authenticateRepository.deleteRefreshTokenByUserId(user.id);
    
    const refreshToken = await this.authenticateRepository.createRefreshToken(
      user.id, expiresInRefreshToken
    );    

    return {
      token,
      refreshToken,
    };
  }
};