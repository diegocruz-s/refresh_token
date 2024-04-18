import { Schema } from "zod";

export interface IParameters {
  schema: Schema;
  body: unknown;
};

export interface IReturnValidation {
  errors: string[] | null;
};

export async function validation({ schema, body }: IParameters): Promise<IReturnValidation> {
  try {
    await schema.parse(body);

    return { errors: null };
  } catch (error: any) {
    const errors: string[] = [];

    error.issues.map((err: any) => {
      errors.push(`${err.path[0]}: ${err.message}`);
    });

    return { errors };
  }
};
