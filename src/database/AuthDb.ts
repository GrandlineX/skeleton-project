import { generateSeed, PGConnector } from '@grandlinex/kernel';
import { UserRow } from '../lib/DBTypes';

export default class AuthDb extends PGConnector {
  async initNewDB(): Promise<void> {
    const seed = generateSeed();
    const hash = this.module
      .getKernel()
      .getCryptoClient()
      ?.getHash(seed, `${process.env.SERVER_PASSWOR}`);
    await this.execScripts([
      {
        exec: `CREATE TABLE ${this.schemaName}.auth_user
                       (
                           id        SERIAL PRIMARY KEY NOT NULL,
                           user_name TEXT               NOT NULL UNIQUE,
                           password  TEXT               NOT NULL,
                           seed  TEXT                   NOT NULL,
                           created   timestamp          NOT NULL DEFAULT NOW(),
                           disabled  BOOLEAN            NOT NULL DEFAULT false
                       );`,
        param: [],
      },
      {
        exec: `INSERT INTO ${this.schemaName}.auth_user (user_name, password,seed)
                       VALUES ( 'admin', $1,$2);`,
        param: [hash, seed],
      },
    ]);
  }

  async getUserByName(name: string): Promise<UserRow | null> {
    try {
      const query = await this.db?.query(
        `SELECT * FROM ${this.schemaName}.auth_user WHERE user_name=$1 
        `,
        [name]
      );
      if (query?.rows.length !== 1) {
        return null;
      }
      return query?.rows[0];
    } catch (e) {
      this.error(e);
      return null;
    }
  }

  async createNewUser(
    name: string,
    password: string,
    seed: string
  ): Promise<number> {
    try {
      const query = await this.db?.query(
        `INSERT INTO ${this.schemaName}.auth_user (user_name,password,seed) VALUES ($1,$2,$3) RETURNING id; 
        `,
        [name, password, seed]
      );
      if (query?.rows.length !== 1) {
        return -1;
      }
      return query?.rows[0].id;
    } catch (e) {
      this.error(e);
      return -1;
    }
  }

  async getUserList(): Promise<UserRow[]> {
    try {
      const query = await this.db?.query(
        `SELECT * from ${this.schemaName}.auth_user`
      );
      return query?.rows || [];
    } catch (e) {
      this.error(e);
      return [];
    }
  }
}
