import { IDatasCreateUser } from "../../entities/User";
import { validation } from "../../helpers/validation";
import { ErrorHandler } from "../errors/ErrorHandler";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { ICreateUserController, ICreateUserUseCase, IReturnCreateUser } from "./protocols";
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

export class CreateUserController implements ICreateUserController {
  constructor (
    private readonly createUserUseCase: ICreateUserUseCase,
  ) {};
  
  async handle(httpRequest: HttpRequest<IDatasCreateUser>): Promise<HttpResponse<IReturnCreateUser>> {
    try {
      const { body } = httpRequest;

      // Validation Body
      const checkValidationBody = await validation({
        body: body,
        schema: createUserSchema
      });

      if(checkValidationBody.errors) {
        return {
          statusCode: 422,
          body: {
            errors: checkValidationBody.errors,
          },
        };
      };
      // End Validation Body

      // UseCase
      const { userId } = await this.createUserUseCase.execute(body!);
      
      return {
        statusCode: 201,
        body: {
          userId,
          errors: null,
        },
      };
    } catch (error: any) {
      const errorHandler = new ErrorHandler();
      const { body, statusCode } = await errorHandler.execute(error.message);
      
      return {
        body, statusCode
      };
    };
  };
};
