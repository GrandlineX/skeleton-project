import {
  BaseAuthProvider,
  IBaseKernelModule,
  KernelDB,
} from '@grandlinex/kernel';
import { JwtToken } from '@grandlinex/kernel/dist/classes/BaseAuthProvider';
import { AuthDb } from '../database';

export default class AuthProvider extends BaseAuthProvider {
  module: IBaseKernelModule<AuthDb, null, null, null>;

  constructor(module: IBaseKernelModule<AuthDb, null, null, null>) {
    super();
    this.module = module;
  }

  async authorizeToken(
    username: string,
    token: string,
    requestType: string
  ): Promise<boolean> {
    const adb = this.module.getDb() as AuthDb;
    const cc = this.module.getKernel().getCryptoClient();
    const user = await adb.getUserByName(username);
    if (!user) {
      return false;
    }
    const a = cc?.getHash(user.seed, token);
    if (!a || a !== user.password) {
      return false;
    }

    return true;
  }

  async validateAcces(token: JwtToken, requestType: string): Promise<boolean> {
    if (token.username) {
      return requestType === 'api' || requestType === 'admin';
    }
    return requestType === 'api';
  }
}
