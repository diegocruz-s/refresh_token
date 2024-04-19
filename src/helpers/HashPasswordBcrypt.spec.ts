import { HashPasswordBcrypt } from "./HashPasswordBcrypt";

describe('Hash Password Bcrypt', () => {
  it('should hash a password', async () => {
    const hashPasswordBcrypt = new HashPasswordBcrypt();
    const password = 'TestPassword@123';
    const hashPassword = await hashPasswordBcrypt.hash(password);
    
    expect(password).not.toEqual(hashPassword);
  });
});