import {
  AuthResult,
  BaseAuthProvider,
  CoreKernel,
  JwtToken,
} from '@grandlinex/kernel';

import { Request } from 'express';

/**
 * Example AuthProvider to authorize user
 */
export default class AuthProvider extends BaseAuthProvider {
  kernel: CoreKernel<any>;

  constructor(kernel: CoreKernel<any>) {
    super();
    this.kernel = kernel;
  }

  async bearerTokenValidation(req: Request): Promise<JwtToken | number> {
    const cc = this.kernel.getCryptoClient();
    let token: string | undefined;
    if (req.headers.authorization !== undefined) {
      const authHeader = req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1];
    } else if (req.query.glxauth !== undefined) {
      token = req.query.glxauth as string;
    } else if (req.headers.cookie !== undefined) {
      const crumbs = req.headers.cookie.trim();
      const coList = crumbs.split(';');
      const oel = coList.find((el) => el.startsWith('glxauth='));
      token = oel?.split('=')[1];
    }
    if (token === undefined || !cc) {
      return 401;
    }
    return cc.jwtVerifyAccessToken(token);
  }

  async validateAccess(token: JwtToken, requestType: string): Promise<boolean> {
    if (token.username) {
      return requestType === 'api' || requestType === 'admin';
    }
    return requestType === 'api';
  }

  async authorizeToken(
    userid: string,
    token: string,
    requestType: string
  ): Promise<AuthResult> {
    if (userid !== 'admin') {
      return {
        valid: false,
        userId: null,
      };
    }
    const password = this.kernel.getConfigStore().get('SERVER_PASSWORD');
    if (token !== password) {
      return {
        valid: false,
        userId: null,
      };
    }

    return {
      valid: true,
      userId: 'admin',
    };
  }
}
