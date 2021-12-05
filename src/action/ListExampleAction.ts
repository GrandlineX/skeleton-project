import {
  BaseApiAction,
  CryptoClient,
  IBaseKernelModule,
} from '@grandlinex/kernel';
import e from 'express';
import { JwtToken } from '@grandlinex/kernel/dist/classes/BaseAuthProvider';
import { ExampleDB } from '../database';
import ExampleEntity from '../database/Entities/ExampleEntity';

/**
 * @name ListUserAction
 *
 * @openapi
 * /example/list:
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
 *                     e_id:
 *                       type: number
 *                     title:
 *                       type: string
 *                     age:
 *                       type: number
 *                     description:
 *                       type: string
 *       401:
 *         description: invalid token / not authorized
 *       403:
 *         description:  not authorized
 */

export default class ListExampleAction extends BaseApiAction {
  constructor(module: IBaseKernelModule<any, any, any, any>) {
    super('GET', '/example/list', module, module.getKernel().getModule());
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
        const mdb = this.getModule().getDb() as ExampleDB;
        const EEW = mdb.getEntityWrapper<ExampleEntity>('ExampleEntity');
        const ret = await EEW?.getObjList({
          age: 42,
        });
        if (!ret) {
          res.sendStatus(500);
          return;
        }
        res
          .status(200)
          .header([['Content-Type', 'application/json']])
          .send(ret);
        return;
      }
    }
    res.status(403).send('no no no ...');
  }
}
