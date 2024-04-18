import { IDatasCreateUser, User } from "../../entities/User";
import { ICreateUserRepository, ICreateUserUseCase, IHashPassword } from "./protocols";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor (
    private readonly createUserRepository: ICreateUserRepository,
    private readonly hashPassword: IHashPassword,
  ) {};
  
  async execute(datas: IDatasCreateUser): Promise<{ userId: string }> {
    const { email, password, username } = datas; 
    const userAlreadyExists = await this.createUserRepository.userExists(
      email, username
    );

    if (userAlreadyExists) throw new Error('User already exists!');

    const passwordHash = await this.hashPassword.hash(password);

    const newUser = new User({
      email, username, password: passwordHash,
    });

    const userId = await this.createUserRepository.createUser(newUser);

    return { userId };

  };
};
