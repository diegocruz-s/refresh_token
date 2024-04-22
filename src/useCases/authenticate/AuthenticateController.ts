import { z } from "zod";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { IAuthenticateController, IAuthenticateUseCase, IDatasRequestAuthenticate, IDatasResponseAuthenticate } from "./protocols";
import { validation } from "../../helpers/validation";

const validationLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthenticateController implements IAuthenticateController {
  constructor (
    private readonly authenticateUseCase: IAuthenticateUseCase,
  ) {};

  async handle(httpRequest: HttpRequest<IDatasRequestAuthenticate>): Promise<HttpResponse<IDatasResponseAuthenticate>> {
    const { body } = httpRequest;
    const validateLogin = await validation({
      body, schema: validationLogin,
    });

    if(validateLogin.errors) {
      return {
        statusCode: 422,
        body: {
          errors: validateLogin.errors,
          refreshToken: null,
          token: null,
        },
      };
    };

    const { refreshToken, token } = await this.authenticateUseCase.execute({
      email: body!.email, password: body!.password,
    });

    return {
      body: {
        errors: null,
        refreshToken,
        token
      },
      statusCode: 200,
    }
  };
};