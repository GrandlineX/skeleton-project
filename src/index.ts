import Path from 'path';
import { Kernel, cors, KernelEndpoint } from '@grandlinex/kernel';
import { Swagger } from '@grandlinex/swagger-mate';
import ExampleModule from './SkeletonModule/ExampleModule.js';
import AuthProvider from './SkeletonModule/auth/AuthProvider.js';
import swaggerConf from './SwaggerConf';

const dirname = __dirname;

const appName = 'SkeletonApp';
const appCode = 'skeleton';
const root = Path.join(dirname, '..');
/**
 * (@) testPath are the place for storing temp files, db data and configuration
 */
const testPath = Path.join(root, 'data', 'config');

const apiPort = 9257;

/**
 * Extending GrandLineX with your own kernel interface for your needs
 */
@Swagger(swaggerConf)
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
      const endpoint = ik.getModule().getPresenter() as KernelEndpoint;
      const app = endpoint.getApp();
      app.use(cors);
    });

    /**
     * Overwrite the default app server port
     */
    this.setAppServerPort(apiPort);
  }
}
