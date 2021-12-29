import Path from 'path';
import Kernel, { cors, KernelEndpoint, KernelModule } from '@grandlinex/kernel';
import ExampleModule from './SkeletonModule/ExampleModule';
import AuthProvider from './SkeletonModule/auth/AuthProvider';

const appName = 'SkeletonApp';
const appCode = 'skeleton';
const root = Path.join(__dirname, '..');
/**
 * (@) testPath are the place for storing temp files, db data and configuration
 */
const testPath = Path.join(root, 'data', 'config');

const apiPort = 9257;

/**
 * Extending GrandLineX with your own kernel interface for your needs
 */
export default class SkeletonKernel extends Kernel {
  constructor() {
    super({ appName, appCode, pathOverride: testPath, envFilePath: root });

    /**
     * Register the new Module in Kernel
     */
    this.addModule(new ExampleModule(this));

    /**
     * Use Dev Header for the Express server to deal with some origin error in dev
     */
    this.setTriggerFunction('load', async (ik) => {
      ik.getCryptoClient()?.setAuthProvider(new AuthProvider(ik));
      const endpoint = ik.getModule().getEndpoint() as KernelEndpoint;
      const app = endpoint.getApp();
      app.use(cors);
    });

    /**
     * Overwrite the default app server port
     */
    this.setAppServerPort(apiPort);

    const mod = this.getModule() as KernelModule;

    /**
     * Force the Kernel module to use a SQLightDB instead of an PostgreSQL
     */
    mod.useLightDB = true;
  }
}
