import { randomUUID } from "crypto";

export interface IDatasRefreshToken {
  expiresIn: Date;
  userId: string;
  id?: string;
};

export interface IReturnValidation {
  errors: string[] | null;
  valid: boolean;
};

export class RefreshToken {
  private readonly _id: string;
  readonly expiresIn: Date;
  readonly userId: string;

  constructor({ expiresIn, userId, id }: IDatasRefreshToken) {
    this._id = id || randomUUID();
    this.expiresIn = expiresIn;
    this.userId = userId;
  };

  get id (): string {
    return this._id;
  };

  isValid(): IReturnValidation {
    const errors = [];
    if (!this.userId) {
      errors.push('Property userId is missing!');
    };

    const isValidExpiresIn = this.expiresIn.getTime() > Date.now(); 

    if (!isValidExpiresIn || !this.expiresIn) {
      errors.push('Property expiresIn must be greater than now!');
    };

    return {
      errors: errors.length > 0 ? errors : null,
      valid: errors.length > 0 ? false : true,
    };
  };

};
