import { BaseAuthProvider, IKernel } from '@grandlinex/kernel';
import { JwtToken } from '@grandlinex/kernel/dist/classes/BaseAuthProvider';
import { Request } from 'express';

/**
 * Example AuthProvider to authorize user
 */
export default class AuthProvider extends BaseAuthProvider {
  kernel: IKernel;

  constructor(kernel: IKernel) {
    super();
    this.kernel = kernel;
  }

  async bearerTokenValidation(req: Request): Promise<JwtToken | null> {
    const cc = this.kernel.getCryptoClient();
    let token: string | undefined;
    if (req.headers.authorization !== undefined) {
      const authHeader = req.headers.authorization;
      token = authHeader && authHeader.split(' ')[1];
    } else if (req.query.glxauth !== undefined) {
      token = req.query.glxauth as string;
    } else if (req.headers.cookie !== undefined) {
      const crumps = req.headers.cookie.trim();
      const coList = crumps.split(';');
      const oel = coList.find((el) => el.startsWith('glxauth='));
      token = oel?.split('=')[1];
    }
    if (token === undefined || !cc) {
      return null;
    }
    const tokenData = await cc.jwtVerifyAccessToken(token);

    if (tokenData) {
      return tokenData;
    }
    return null;
  }

  async authorizeToken(
    username: string,
    token: string,
    requestType: string
  ): Promise<boolean> {
    if (username !== 'admin') {
      return false;
    }
    const password = this.kernel.getConfigStore().get('SERVER_PASSWORD');
    if (token !== password) {
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
