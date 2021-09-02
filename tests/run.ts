import * as Path from 'path';
import { config } from 'dotenv';
import Kernel, {createFolderIfNotExist, KernelEndpoint} from '@grandlinex/kernel';
// @ts-ignore
import  cors from 'cors';
import AuthModule from "../src/AuthModule";
config();

const appName = 'SkeletonApp';
const appCode = 'skeleton';
const testPathData = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');

const apiPort = 9257;

createFolderIfNotExist(testPathData);
createFolderIfNotExist(testPath);

const kernel = new Kernel(appName, appCode, testPath, apiPort);
kernel.setTrigerFunction('pre', async (ik) => {
    ik.addModule(new AuthModule(ik));
});
kernel.setTrigerFunction("load",async (ik)=>{
    const endpoint=ik.getModule().getEndpoint() as KernelEndpoint
    const app=endpoint.getApp();
    app.use(cors())
})
kernel.start();
