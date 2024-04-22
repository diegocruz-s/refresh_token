import { createUser } from "../tests/factories/CreateUser";
import { RefreshToken } from "./RefreshToken";

describe('Refresh Token', () => {
  it('should create a Refresh Token', async () => {
    const { user } = createUser({});
    const expiresIn = new Date(Date.now() + 20000);
    const id = 'any_id_refreshToken';

    const refreshToken = new RefreshToken({
      id,
      expiresIn,
      userId: user.id,
    });

    const { errors, valid } = refreshToken.isValid();
 
    expect(valid).toBeTruthy();
    expect(errors).toBeNull();
    expect(refreshToken).toHaveProperty('id');
    expect(refreshToken.id).toBe(id);
    expect(refreshToken.expiresIn).toBe(expiresIn);
    expect(refreshToken.userId).toBe(user.id);
    
  });

  it('should return a error when userId is not provided', async () => {
    const expiresIn = new Date(Date.now() + 20000);

    const refreshToken = new RefreshToken({
      expiresIn,
      userId: '',
    });

    const { errors, valid } = refreshToken.isValid();
 
    expect(valid).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('Property userId is missing!');
    
  });

  it('should return a error when expiresIn less than now', async () => {
    const { user } = createUser({});
    const expiresIn = new Date(Date.now() - 20000);

    const refreshToken = new RefreshToken({
      expiresIn,
      userId: user.id,
    });

    const { errors, valid } = refreshToken.isValid();
 
    expect(valid).toBeFalsy();
    expect(errors?.length).toBe(1);
    expect(errors![0]).toBe('Property expiresIn must be greater than now!');
    
  });

  it('should return a error when expiresIn less than now and userId is not provided', async () => {
    const expiresIn = new Date(Date.now() - 100);

    const refreshToken = new RefreshToken({
      expiresIn,
      userId: '',
    });

    const { errors, valid } = refreshToken.isValid();
 
    expect(valid).toBeFalsy();
    expect(errors?.length).toBe(2);
    expect(errors).toContain('Property expiresIn must be greater than now!');
    expect(errors).toContain('Property userId is missing!');
    
  });
});