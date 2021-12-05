import { IBaseKernelModule, SQLCon } from '@grandlinex/kernel';

import ExampleEntity from './Entities/ExampleEntity';

export default class ExampleDB extends SQLCon {
  constructor(mod: IBaseKernelModule<any, any, any, any>) {
    super(mod, '0');
    this.registerEntity(new ExampleEntity(''));
  }

  async initNewDB(): Promise<void> {
    const EEW = this.getEntityWrapper<ExampleEntity>('ExampleEntity');
    if (EEW) {
      await EEW.createObject(
        new ExampleEntity('HelloWorld', 42, 'GrandLineX example entity')
      );
    }
  }
}
