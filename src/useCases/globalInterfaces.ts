export interface HttpResponse<T> {
  statusCode: number;
  body: T;
};

export interface HttpRequest<T> {
  body?: T;
};

export interface IGenerateToken {
  execute(id: string, secret: string, expiresIn: string): Promise<string>;
};
