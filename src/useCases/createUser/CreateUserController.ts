import { z } from 'zod';

import { IDatasCreateUser } from "../../entities/User";
import { validation } from "../../helpers/validation";
import { ErrorHandler } from "../errors/ErrorHandler";
import { HttpRequest, HttpResponse } from "../globalInterfaces";
import { ICreateUserController, ICreateUserUseCase, IReturnCreateUser } from "./protocols";
import { badRequest } from '../../helpers/ReturnErrors';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
});

export class CreateUserController implements ICreateUserController {
  constructor (
    private readonly createUserUseCase: ICreateUserUseCase,
  ) {};
  
  async handle(httpRequest: HttpRequest<IDatasCreateUser>): Promise<HttpResponse<IReturnCreateUser>> {
    try {
      const { body } = httpRequest;
      if(!body) throw new Error('Body is not provided!');

      const checkValidationBody = await validation({
        body: body,
        schema: createUserSchema
      });

      if(checkValidationBody.errors) {
        return badRequest(checkValidationBody.errors);
      };

      const { userId } = await this.createUserUseCase.execute(body!);
      
      return {
        statusCode: 201,
        body: {
          userId,
          errors: null,
        },
      };
    } catch (error: any) {      
      if(
        error.message.includes('provided') || error.message.toLowerCase().includes('already')
      ) error.name = 'ValidationError';

      const errorHandler = new ErrorHandler();
      const { body, statusCode } = await errorHandler.execute(error);
      
      return {
        body, statusCode
      };
    };
  };
};

