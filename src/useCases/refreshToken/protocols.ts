import { RefreshToken } from "../../entities/RefreshToken";
import { HttpRequest, HttpResponse } from "../globalInterfaces";

export interface IReturnResponseRefreshToken {
  token?: string;
  refreshToken?: RefreshToken;
  errors: string[] | null;
};

export interface IRefreshTokenController {
  handle(httpRequest: HttpRequest<{ refresh_token_id: string }>): Promise<HttpResponse<IReturnResponseRefreshToken>>;
};

export interface IRefreshTokenUseCase {
  execute(refresh_token_id: string): Promise<Omit<IReturnResponseRefreshToken, 'errors'>>;
};

export interface IRefreshTokenRepository {
  findRefreshTokenById(id: string): Promise<RefreshToken | null>;
  createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken>;
};
