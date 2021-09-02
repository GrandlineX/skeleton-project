import {
  BaseApiAction,
  CryptoClient,
  generateSeed,
  IBaseKernelModule,
} from '@grandlinex/kernel';
import e from 'express';
import { JwtToken } from '@grandlinex/kernel/dist/classes/BaseAuthProvider';
import { AuthDb } from '../database';
/**
 * @name CreateUserAction
 *
 * @openapi
 * /user/add:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       401:
 *         description: invalid token / not authorized
 *       403:
 *         description:  not authorized
 *       503:
 *         description: server error
 *       504:
 *         description: server error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */
export default class CreateUserAction extends BaseApiAction {
  constructor(module: IBaseKernelModule<any, any, any, any>) {
    super('POST', '/user/add', module, module.getKernel().getModule());
    this.handler = this.handler.bind(this);
  }

  async handler(
    req: e.Request,
    res: e.Response,
    next: () => void,
    data: JwtToken | null
  ): Promise<void> {
    const cc = this.getKernel().getCryptoClient() as CryptoClient;

    if (!req.body.username || !req.body.password) {
      res.status(400).send('error: send username and password');
      return;
    }
    if (data) {
      const allowed = await cc.permissonValidation(data, 'admin');
      if (allowed) {
        const mdb = this.getModule().getDb() as AuthDb;
        const seed = generateSeed();
        const hash = cc.getHash(seed, req.body.password);

        const uid = await mdb.createNewUser(req.body.username, hash, seed);
        if (uid) {
          res.status(200).send('user creaded');
        } else {
          res.status(504).send('interal error 1');
        }
        return;
      }
    }
    res.status(403).send('no no no ...');
  }
}
