import { randomUUID } from "crypto";
import { GenerateTokenJwt } from "./GenerateTokenJwt";

describe('Generate Token JWT', () => {
  it('should return a token', async () => {
    const generateTokenJwt = new GenerateTokenJwt();
    const datasToken = {
      id: randomUUID(),
      secret: 'any_secret',
      expiresIn: '7d',
    };

    const token = await generateTokenJwt.execute(
      datasToken.id, datasToken.secret, datasToken.expiresIn,
    );

    expect(token).toBeTruthy();
  });
});