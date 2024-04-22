import { User } from "./User";

describe('Create User', () => {
  it('should create a user', () => {
    const datasUser = {
      id: 'any_id',
      email: 'anyEmail@gmail.com',
      username: 'any_username',
      password: 'Any_pass@123',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();

    expect(user).toHaveProperty('id');
    expect(user.id).toBe(datasUser.id);
    expect(user.email).toBe(datasUser.email);
    expect(user.username).toBe(datasUser.username);
    expect(user.password).toBe(datasUser.password);
    expect(errors.length).toBe(0);
    expect(valid).toBeTruthy();
  });

  it('should return a error when params is not provided[email]', () => {
    const datasUser = {
      email: '',
      username: 'any_username',
      password: 'Any_pass@123',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();

    expect(valid).toBeFalsy();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe(`Property email is missing!`);

  });

  it('should return a error when params is not provided[username]', () => {
    const datasUser = {
      email: 'anyEmail@gmail.com',
      username: '',
      password: 'Any_pass@123',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();

    expect(valid).toBeFalsy();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe(`Property username is missing!`);

  });

  it('should return a error when params is not provided[password]', () => {
    const datasUser = {
      email: 'anyEmail@gmail.com',
      username: 'any_username',
      password: '',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();

    expect(valid).toBeFalsy();
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe(`Property password is missing!`);

  });

  it('should return a error when params is not provided[all params]', () => {
    const datasUser = {
      email: '',
      username: '',
      password: '',
    };

    const user = new User(datasUser);
    const { errors, valid } = user.isValid();

    expect(valid).toBeFalsy();
    expect(errors.length).toBe(3);
    expect(errors).toContain(`Property email is missing!`);
    expect(errors).toContain(`Property username is missing!`);
    expect(errors).toContain(`Property password is missing!`);

  });
});