export interface IReturnError {
  statusCode: number;
  body: {
    errors: string[]
  };
};

export class ErrorHandler {
  async execute (error: Error): Promise<IReturnError> {    
    const statusCode = error.name === 'ValidationError' ? 422 : 500;

    return {
      statusCode,
      body: {
        errors: [error.message],
      },
    };
  };
};
