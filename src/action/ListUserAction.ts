import {
  BaseApiAction,
  CryptoClient,
  IBaseKernelModule,
} from '@grandlinex/kernel';
import e from 'express';
import { JwtToken } from '@grandlinex/kernel/dist/classes/BaseAuthProvider';
import { AuthDb } from '../database';

/**
 * @name ListUserAction
 *
 * @openapi
 * /user/list:
 *   get:
 *     summary: User list
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     user_name:
 *                       type: string
 *                     disabled:
 *                       type: boolean
 *       401:
 *         description: invalid token / not authorized
 *       403:
 *         description:  not authorized
 */

export default class ListUserAction extends BaseApiAction {
  constructor(module: IBaseKernelModule<any, any, any, any>) {
    super('GET', '/user/list', module, module.getKernel().getModule());
    this.handler = this.handler.bind(this);
  }

  async handler(
    req: e.Request,
    res: e.Response,
    next: () => void,
    data: JwtToken | null
  ): Promise<void> {
    const cc = this.getKernel().getCryptoClient() as CryptoClient;

    if (data) {
      const allowed = await cc.permissonValidation(data, 'admin');
      if (allowed) {
        const mdb = this.getModule().getDb() as AuthDb;
        const list = await mdb.getUserList();
        const outList: {
          user_name: string;
          id: number;
          disabled: boolean;
        }[] = [];
        list.forEach(({ user_name, id, disabled }) => {
          outList.push({
            user_name,
            id,
            disabled,
          });
        });

        res
          .status(200)
          .header([['Content-Type', 'application/json']])
          .send(outList);
        return;
      }
    }
    res.status(403).send('no no no ...');
  }
}
