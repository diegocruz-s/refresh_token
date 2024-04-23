import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { HttpRequest, HttpResponse } from "../globalInterfaces";

export interface IDatasRequestAuthenticate {
  email: string;
  password: string;
};

export interface IDatasResponseAuthenticate {
  token?: string;
  refreshToken?: RefreshToken;
  errors: string[] | null;
};

export interface IAuthenticateController {
  handle(httpRequest: HttpRequest<IDatasRequestAuthenticate>): Promise<HttpResponse<IDatasResponseAuthenticate>>;
};

export interface IAuthenticateUseCase {
  execute(datas: IDatasRequestAuthenticate): Promise<Omit<IDatasResponseAuthenticate, 'errors'>>
};

export interface IAuthenticateRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken>;
};

export interface ICompareHashPassword {
  execute(hash: string, password: string): Promise<boolean>;
};

