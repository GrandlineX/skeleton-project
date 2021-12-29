import { BaseKernelModule, IKernel } from '@grandlinex/kernel';
import ExampleDB from './database/ExampleDB';
import ListExampleAction from './action/ListExampleAction';

export default class ExampleModule extends BaseKernelModule<
  ExampleDB,
  null,
  null,
  null
> {
  constructor(kernel: IKernel) {
    super('example', kernel);
    this.addAction(new ListExampleAction(this));
  }

  async initModule(): Promise<void> {
    const db = new ExampleDB(this);
    this.setDb(db);
  }

  startup(): Promise<void> {
    return Promise.resolve(undefined);
  }

  beforeServiceStart(): Promise<void> {
    return Promise.resolve(undefined);
  }

  final(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
