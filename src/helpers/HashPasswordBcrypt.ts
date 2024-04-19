import { hash } from "bcrypt";
import { IHashPassword } from "../useCases/createUser/protocols";

export class HashPasswordBcrypt implements IHashPassword {
  async hash(password: string): Promise<string> {
    const hashPassword = await hash(password, 8);

    return hashPassword;
  };
};
