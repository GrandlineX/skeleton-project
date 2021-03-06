import {
  CoreEntityWrapper,
  IBaseKernelModule,
  InMemDB,
} from '@grandlinex/kernel';

import ExampleEntity from './Entities/ExampleEntity';

export default class ExampleDB extends InMemDB {
  exampleEntity: CoreEntityWrapper<ExampleEntity>;

  constructor(mod: IBaseKernelModule<any, any, any, any>) {
    super(mod);
    this.exampleEntity = this.registerEntity(new ExampleEntity(''));
  }

  async initNewDB(): Promise<void> {
    await this.exampleEntity.createObject(
      new ExampleEntity('HelloWorld', 42, 'GrandLineX example entity')
    );
  }
}
