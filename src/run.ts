import Path from 'path';
import { config } from 'dotenv';
import Kernel, { createFolderIfNotExist } from '@grandlinex/kernel';
import AuthModule from './AuthModule';

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

kernel.start();
