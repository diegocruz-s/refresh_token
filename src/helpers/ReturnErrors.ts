export function badRequest (errors: string[]) {
  return {
    statusCode: 422,
    body: {
      errors 
    },
  };
};

