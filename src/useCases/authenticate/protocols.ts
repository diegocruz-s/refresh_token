import { RefreshToken } from "../../entities/RefreshToken";
import { User } from "../../entities/User";
import { HttpRequest, HttpResponse, IRefreshTokenCreateDeleteRepository } from "../globalInterfaces";

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

export interface IAuthenticateRepository extends IRefreshTokenCreateDeleteRepository {
  findUserByEmail(email: string): Promise<User | null>;
};

export interface ICompareHashPassword {
  execute(hash: string, password: string): Promise<boolean>;
};

