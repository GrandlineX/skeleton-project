import { BaseKernelModule, IKernel } from '@grandlinex/kernel';
import ExampleDB from './database/ExampleDB.js';
import ListExampleAction from './action/ListExampleAction.js';

export default class ExampleModule extends BaseKernelModule<
  IKernel,
  ExampleDB,
  null,
  null,
  null
> {
  constructor(kernel: IKernel) {
    super('example', kernel);
    /**
     * This is the place to add your actions or services.
     */
    this.addAction(new ListExampleAction(this));

    // this.addService('...')
  }

  async initModule(): Promise<void> {
    /**
     * this is the place to initialize your module.
     */
    const db = new ExampleDB(this);
    this.setDb(db);
  }

  startup(): Promise<void> {
    /**
     * Optional
     * This is the place to start your module.
     */
    return Promise.resolve(undefined);
  }

  beforeServiceStart(): Promise<void> {
    /**
     * Optional
     * This is the place to do some stuff before the service start.
     */
    return Promise.resolve(undefined);
  }

  final(): Promise<void> {
    /**
     * Optional
     * This is the place to do some stuff after the kernel is ready.
     */
    return Promise.resolve(undefined);
  }
}
