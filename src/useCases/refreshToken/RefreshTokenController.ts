import { badRequest } from "../../helpers/ReturnErrors";
import { ErrorHandler } from "../errors/ErrorHandler";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { IRefreshTokenController, IRefreshTokenUseCase, IReturnResponseRefreshToken } from "./protocols";

export class RefreshTokenController implements IRefreshTokenController {
  constructor(
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
  ) {};

  async handle(httpRequest: HttpRequest<{ refresh_token_id: string }>): Promise<HttpResponse<IReturnResponseRefreshToken>> {
    try {
      const { body } = httpRequest;
  
      if(!body || !body.refresh_token_id) {
        return badRequest(['Refresh token id is required!']);
      };
  
      const { refreshToken, token } = await this.refreshTokenUseCase.execute(body.refresh_token_id);

      return {
        statusCode: 200,
        body: {
          errors: null,
          refreshToken,
          token,
        },
      };
    } catch (error: any) {      
      if(
        error.message.includes('not found')
      ) error.name = 'Not Found';

      const errorHandler = new ErrorHandler();
      const { body, statusCode } = await errorHandler.execute(error);
      
      return {
        body, statusCode
      };
    };
  };
};