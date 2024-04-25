import { RefreshToken } from "../entities/RefreshToken";

export interface HttpResponse<T> {
  statusCode: number;
  body: T;
};

export interface HttpRequest<T> {
  body?: T;
};

export interface IGenerateToken {
  execute(id: string, secret: string, expiresIn: string): Promise<string>;
};

export interface IRefreshTokenCreateDeleteRepository {
  createRefreshToken(userId: string, expiresIn: Date): Promise<RefreshToken>;
  deleteRefreshTokenByUserId(userId: string): Promise<void>;
};

export interface IFormateDate {
  execute(date: Date, timeToIncrease: string): Promise<Date>;
};