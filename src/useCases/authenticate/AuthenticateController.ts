import { z } from "zod";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { IAuthenticateController, IAuthenticateUseCase, IDatasRequestAuthenticate, IDatasResponseAuthenticate } from "./protocols";
import { validation } from "../../helpers/validation";
import { badRequest } from "../../helpers/ReturnErrors";
import { ErrorHandler } from "../errors/ErrorHandler";

const validationLogin = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export class AuthenticateController implements IAuthenticateController {
  constructor (
    private readonly authenticateUseCase: IAuthenticateUseCase,
  ) {};

  async handle(httpRequest: HttpRequest<IDatasRequestAuthenticate>): Promise<HttpResponse<IDatasResponseAuthenticate>> {
    try {
      const { body } = httpRequest;
      const validateLogin = await validation({
        body, schema: validationLogin,
      });
  
      if(validateLogin.errors || !body) {
        return badRequest(validateLogin.errors || ['Body is not provided!']);
      };
  
      const { refreshToken, token } = await this.authenticateUseCase.execute({
        email: body.email, password: body.password,
      });
  
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
        error.message.includes('Authentication')
      ) error.name = 'ValidationError';

      const errorHandler = new ErrorHandler();
      const { body, statusCode } = await errorHandler.execute(error);
      
      return {
        body, statusCode
      };
    };
  };
};