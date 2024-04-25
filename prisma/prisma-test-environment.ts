import { exec } from 'node:child_process';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import util from 'node:util';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.testing' });

const execSync = util.promisify(exec);

export default class PrismaTestEnvironment extends NodeEnvironment {
  public stringConnection: string;
  public expiresRefreshToken: string;
  private prisma!: PrismaClient;

  constructor(config: any, context: any) {
    super(config, context)

    const dbUser = process.env.DATABASE_USER;
    const dbPass = process.env.DATABASE_PASS;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbName = process.env.DATABASE_NAME;
    const expiresRT = process.env.EXPIRE_DATE_REFRESH_TOKEN_TEST;

    this.stringConnection = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    this.expiresRefreshToken = expiresRT!;
    this.prisma = new PrismaClient();
    
  };
  
  async setup(): Promise<void> {
    
    process.env.DATABASE_URL = this.stringConnection
    this.global.process.env.DATABASE_URL = this.stringConnection
    this.global.process.env.EXPIRE_DATE_REFRESH_TOKEN = this.expiresRefreshToken

    await execSync(`prisma migrate deploy`)

    return super.setup()

  };

  async teardown(): Promise<void> {
    // Obtenha todas as tabelas do seu banco de dados
    const [_, ...rest] = await this.prisma.$queryRaw<[{ Tables_in_first_application_tests_tests: string }]>`SHOW TABLES`;
    
    // Para cada tabela, execute uma consulta DELETE
    for (const { Tables_in_first_application_tests_tests: table } of rest) {
      // await (this.prisma as any)[table].deleteMany()
      await this.prisma.user.deleteMany()
    }

    // Feche a conexão do Prisma
    await this.prisma.$disconnect();
  };
};