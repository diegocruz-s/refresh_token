export interface IReturnError {
  statusCode: number;
  body: {
    errors: string[]
  };
};

export class ErrorHandler {
  async execute (errorMsg: string): Promise<IReturnError> {
    return {
      statusCode: 500,
      body: {
        errors: [errorMsg],
      },
    };
  };
};
