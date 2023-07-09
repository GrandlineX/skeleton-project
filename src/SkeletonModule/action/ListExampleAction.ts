import {
  BaseApiAction,
  CryptoClient,
  IBaseKernelModule,
  JwtToken,
} from '@grandlinex/kernel';
import e from 'express';

import { SPath, SPathUtil } from '@grandlinex/swagger-mate';
import ExampleEntity from '../database/Entities/ExampleEntity.js';
import { ExampleDB } from '../database/index.js';

@SPath({
  '/example/list': {
    get: {
      tags: ['Example'],
      operationId: 'getExampleList',
      summary: 'Get Example list',
      responses: SPathUtil.refResponse('200', new ExampleEntity(''), true),
    },
  },
})
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
      const allowed = await cc.permissionValidation(data, 'admin');
      if (allowed) {
        const mdb = this.getModule().getDb() as ExampleDB;
        const EEW = mdb.getEntityWrapper<ExampleEntity>('ExampleEntity');
        const ret = await EEW?.getObjList({
          search: { age: 42 },
        });
        if (!ret) {
          res.sendStatus(500);
          return;
        }
        res.status(200).send(ret);
        return;
      }
    }
    res.status(403).send('no no no ...');
  }
}
