import { compare } from "bcrypt";
import { ICompareHashPassword } from "../useCases/authenticate/protocols";

export class CompareHashPasswordBcrypt implements ICompareHashPassword {
  async execute(hash: string, password: string): Promise<boolean> {
    const comparePwd = await compare(password, hash);

    return comparePwd;
  };
};
