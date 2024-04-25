import { sign } from "jsonwebtoken";
import { IGenerateToken } from "../useCases/globalInterfaces";

export class GenerateTokenJwt implements IGenerateToken {
  async execute(id: string, secret: string, expiresIn: string): Promise<string> {    
    const token = await sign({ id }, secret, { expiresIn });

    return token;
  };
};
