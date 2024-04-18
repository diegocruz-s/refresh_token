import { IDatasCreateUser, User } from "../../entities/User";
import { ICreateUserRepository, ICreateUserUseCase } from "./protocols";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor (
    private readonly createUserRepository: ICreateUserRepository,
  ) {};
  
  async execute(datas: IDatasCreateUser): Promise<{ userId: string }> {
    const { email, password, username } = datas; 
    const userAlreadyExists = await this.createUserRepository.userExists(
      email, username
    );

    if (userAlreadyExists) throw new Error('User already exists!');

    const newUser = new User({
      email, password, username,
    });

    const userId = await this.createUserRepository.createUser(newUser);

    return { userId };

  };
};