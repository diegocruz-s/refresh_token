import { hash } from "bcrypt";
import { CompareHashPasswordBcrypt } from "./CompareHashPasswordBcrypt";
import { HashPasswordBcrypt } from "./HashPasswordBcrypt";

const makeCompareHashPasswordBcrypt = () => {
  const hashPasswordBcrypt = new HashPasswordBcrypt();
  const compareHashPasswordBcrypt = new CompareHashPasswordBcrypt();

  return {
    hashPasswordBcrypt, compareHashPasswordBcrypt
  };
};

describe('Compare Hash Password Bcrypt', () => {
  it('should return a true when compare is match', async () => {
    const { compareHashPasswordBcrypt, hashPasswordBcrypt } = makeCompareHashPasswordBcrypt();
    const password = 'any_pass';
    const hash = await hashPasswordBcrypt.hash(password);

    const result = await compareHashPasswordBcrypt.execute(hash, password);

    expect(result).toBe(true);
  });

  it('should return a false when compare is not match', async () => {
    const { compareHashPasswordBcrypt, hashPasswordBcrypt } = makeCompareHashPasswordBcrypt();
    const password = 'any_pass';
    const hash = await hashPasswordBcrypt.hash('outher_value_pass');

    const result = await compareHashPasswordBcrypt.execute(hash, password);

    expect(result).toBe(false);
  });
});