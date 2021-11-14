import { generateSeed, IBaseKernelModule, SQLCon } from '@grandlinex/kernel';
import { RunResult } from 'better-sqlite3';
import { UserRow } from '../lib/DBTypes';
import ExampleEntity from './Entities/ExampleEntity';

export default class AuthDb extends SQLCon {
  constructor(mod: IBaseKernelModule<any, any, any, any>) {
    super(mod, '0');
    this.registerEntity(new ExampleEntity('', 0, ''));
  }

  async initNewDB(): Promise<void> {
    const seed = generateSeed();
    const cc = this.getKernel().getCryptoClient();
    const store = this.getKernel().getConfigStore();
    const hash = cc?.getHash(seed, `${store.get('SERVER_PASSWORD')}`);
    await this.execScripts([
      {
        exec: `CREATE TABLE ${this.schemaName}.auth_user
                       (
                           id        INTEGER PRIMARY KEY NOT NULL,
                           user_name TEXT               NOT NULL UNIQUE,
                           password  TEXT               NOT NULL,
                           seed  TEXT                   NOT NULL,
                           created   text                 NOT NULL ,
                           disabled  BOOLEAN            NOT NULL DEFAULT false
                       );`,
        param: [],
      },
      {
        exec: `INSERT INTO ${this.schemaName}.auth_user (user_name, password,seed,created)
                       VALUES ( 'admin', ?, ?, ?);`,
        param: [hash, seed, new Date().toString()],
      },
    ]);
  }

  async getUserByName(name: string): Promise<UserRow | null> {
    try {
      const query = this.db?.prepare(
        `SELECT * FROM ${this.schemaName}.auth_user WHERE user_name=? 
        `
      );
      return query?.get([name]);
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
      const query = await this.execScripts([
        {
          exec: `INSERT INTO ${this.schemaName}.auth_user (user_name,password,seed,created) VALUES (?,?,?,?); `,
          param: [name, password, seed, new Date().toString()],
        },
      ]);
      if (query.length !== 1) {
        return -1;
      }
      return query[0].lastInsertRowid as number;
    } catch (e) {
      this.error(e);
      return -1;
    }
  }

  async getUserList(): Promise<UserRow[]> {
    try {
      const query = this.db?.prepare(
        `SELECT * from ${this.schemaName}.auth_user`
      );
      return query?.all() || [];
    } catch (e) {
      this.error(e);
      return [];
    }
  }
}
