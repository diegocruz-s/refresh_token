import { User } from "../../entities/User";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserRepository, IHashPassword } from "./protocols";

const makeFakeRepository = () => {
  class CreateUserRepository implements ICreateUserRepository {
    private users: User[] = [];

    async createUser(user: User): Promise<string> {
      this.users.push(user);
      return user.id;
    };

    async userExists(email: string, username: string): Promise<boolean> {
      const user = this.users.find(user => (
        user.email === email ||
        user.username === username
      ));

      return user ? true : false;
    };

  };

  const createUserRepository = new CreateUserRepository();

  return {
    createUserRepository
  };
};

const makeFakeCreateUserUseCase = () => {
  const { createUserRepository } = makeFakeRepository();
  class HashPassword implements IHashPassword {
    async hash(password: string): Promise<string> {
      return `${password + Date.now().toString()}`;
    };
  };
  const hashPassword = new HashPassword();

  const createUserUseCase = new CreateUserUseCase(createUserRepository, hashPassword);
  return {
    createUserUseCase  
  };
};

const makeControllerWithMocks = () => {
  const { createUserUseCase } = makeFakeCreateUserUseCase();
  const createUserController = new CreateUserController(createUserUseCase);

  return {
    createUserController
  };
};

describe('Create User Controller', () => {
  it('should create a user', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_email@gmail.com',
      username: 'Any_username',
      password: 'Any_password',
    };

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty('userId');
    expect(body.errors).toBeNull();

  });

  it('should return a error when body is not provided', async () => {
    const { createUserController } = makeControllerWithMocks();

    const { body, statusCode } = await createUserController.handle({});

    expect(statusCode).toBe(422);
    
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe('Body is not provided!');

  });

  it('should return a error when parmas is not correct[email]', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_string',
      username: 'Any_username',
      password: 'Any_password',
    };

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });
    
    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain('email');
  });

  it('should return a error when username less than 3', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_email@gmail.com',
      username: 'ab',
      password: 'Any_password',
    };

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });
    
    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain('username');
  });

  it('should return a error when password less than 6', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_email@gmail.com',
      username: 'Any_username',
      password: 'any',
    };

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });
    
    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toContain('password');
  });

  it('should return a error when params is not correct[all]', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any',
      username: 'An',
      password: 'any',
    };

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });
    
    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(3);
    body.errors!.forEach((err, i) => {
      expect(err.includes(Object.values(datasUser)[i]));
    });
  });

  it('should return a error when user already exists[email]', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_email@gmail.com',
      username: 'Any_username',
      password: 'Any_password',
    };

    const responseOne = await createUserController.handle({
      body: datasUser,
    });

    expect(responseOne.statusCode).toBe(201);
    expect(responseOne.body).toHaveProperty('userId');
    expect(responseOne.body.errors).toBeNull();

    datasUser.username = 'Outher_username';

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe('User already exists!');

  });

  it('should return a error when user already exists[username]', async () => {
    const { createUserController } = makeControllerWithMocks();
  
    const datasUser = {
      email: 'any_email@gmail.com',
      username: 'Any_username',
      password: 'Any_password',
    };

    const responseOne = await createUserController.handle({
      body: datasUser,
    });

    expect(responseOne.statusCode).toBe(201);
    expect(responseOne.body).toHaveProperty('userId');
    expect(responseOne.body.errors).toBeNull();

    datasUser.email = 'outher_email@gmail.com';

    const { body, statusCode } = await createUserController.handle({
      body: datasUser,
    });

    expect(statusCode).toBe(422);
    expect(body.errors?.length).toBe(1);
    expect(body.errors![0]).toBe('User already exists!');

  });

});