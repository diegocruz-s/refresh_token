import { randomUUID } from "crypto";

interface IReturnIsValidUser {
  errors: (string | null)[];
  valid: boolean;
};

interface IDatasCreateUser {
  email: string;
  username: string;
  password: string;
};

export class User {
  private readonly _id: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;

  constructor ({ email, password, username }: IDatasCreateUser) {
    this._id = randomUUID();
    this.email = email;
    this.username = username;
    this.password = password;

  };

  get id(): string {
    return this._id;
  };

  isValid (): IReturnIsValidUser {
    const fieldsUser = Object.getOwnPropertyNames(this);
    
    const errorsFields = fieldsUser
      .map(field => (!!this[field as keyof User]) ? null : `Property ${field} is missing!`)
      .filter(item => !!item);

    return {
      errors: errorsFields,
      valid: errorsFields.length > 0 ? false : true,
    };
  };

};

