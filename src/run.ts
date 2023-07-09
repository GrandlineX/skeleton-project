import * as Path from 'path';
import { XUtil } from '@grandlinex/kernel';
import SkeletonKernel from './index.js';

const dirname = __dirname;

const testPathData = Path.join(dirname, '..', 'data');
const testPath = Path.join(dirname, '..', 'data', 'config');

XUtil.createFolderIfNotExist(testPathData);
XUtil.createFolderIfNotExist(testPath);
/**
 * Starting the new kernel
 */
const kernel = new SkeletonKernel();

kernel.start();
