import { IGenerateToken } from "../globalInterfaces";
import { IAuthenticateRepository, IAuthenticateUseCase, ICompareHashPassword, IDatasRequestAuthenticate, IDatasResponseAuthenticate } from "./protocols";

export class AuthenticateUseCase implements IAuthenticateUseCase {
  constructor (
    private readonly authenticateRepository: IAuthenticateRepository,
    private readonly compareHashPassword: ICompareHashPassword,
    private readonly generateToken: IGenerateToken,
  ) {};

  async execute(datas: IDatasRequestAuthenticate): Promise<Omit<IDatasResponseAuthenticate, "errors">> {
    const { email, password } = datas;
    const user = await this.authenticateRepository.findUserByEmail(email);
    
    if(!user) throw new Error('Authentication invalid!');

    const comparePasswordToHash = await this.compareHashPassword.execute(
      user.password, password
    );

    if(!comparePasswordToHash) throw new Error('Authentication invalid!');

    const expiresInRefreshToken = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      // 2 days a after

    const token = await this.generateToken.execute(user.id, 'any_secret_token', '2d');
    const refreshToken = await this.authenticateRepository.createRefreshToken(
      user.id, expiresInRefreshToken
    );    

    return {
      token,
      refreshToken,
    };
  }
};