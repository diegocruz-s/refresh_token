import { User } from "../../entities/User";
import { faker } from '@faker-js/faker';

interface PossibleParams {
  email?: string;
  password?: string;
  username?: string;
};

export function createUser ({ email, password, username }: PossibleParams) {

  const datas = {
    email: email || faker.internet.email(),
    password: password || faker.internet.password(),
    username: username || faker.internet.userName(),
  };

  const newUser = new User(datas);

  return {
    user: newUser
  };
};
