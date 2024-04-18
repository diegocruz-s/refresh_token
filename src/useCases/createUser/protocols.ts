import { IDatasCreateUser, User } from "../../entities/User";
import { HttpRequest, HttpResponse } from "../globalInterfaces";

export interface IReturnCreateUser {
  errors: string[] | null;
  userId?: string;
};

export interface ICreateUserController {
  handle(httpRequest: HttpRequest<IDatasCreateUser>): Promise<HttpResponse<IReturnCreateUser>>;
};

export interface ICreateUserRepository {
  userExists(email: string, username: string): Promise<boolean>;
  createUser(user: User): Promise<string>;
};

export interface ICreateUserUseCase {
  execute(datas: IDatasCreateUser): Promise<{ userId: string }>
};

