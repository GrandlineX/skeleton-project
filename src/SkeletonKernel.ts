import Kernel, { cors, KernelEndpoint } from '@grandlinex/kernel';
import * as Path from 'path';
import AuthModule from './AuthModule';

const appName = 'SkeletonApp';
const appCode = 'skeleton';
const testPathData = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');

const apiPort = 9257;
export default class SkeletonKernel extends Kernel {
  constructor() {
    super(appName, appCode, testPath);
    this.addModule(new AuthModule(this));
    this.setTrigerFunction('load', async (ik) => {
      const endpoint = ik.getModule().getEndpoint() as KernelEndpoint;
      const app = endpoint.getApp();
      app.use(cors);
    });
    this.setAppServerPort(apiPort);
  }
}
