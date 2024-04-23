export interface IReturnError {
  statusCode: number;
  body: {
    errors: string[]
  };
};

export class ErrorHandler {
  async execute (error: Error): Promise<IReturnError> {    
    let statusCode = 500;
    if(error.name === 'Not Found') statusCode = 404;
    if(error.name === 'ValidationError') statusCode = 422;

    return {
      statusCode,
      body: {
        errors: [error.message],
      },
    };
  };
};
