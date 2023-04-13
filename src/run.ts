import * as Path from 'path';
import { XUtil } from '@grandlinex/kernel';
import * as url from 'url';
import SkeletonKernel from './index.js';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

const testPathData = Path.join(dirname, '..', 'data');
const testPath = Path.join(dirname, '..', 'data', 'config');

XUtil.createFolderIfNotExist(testPathData);
XUtil.createFolderIfNotExist(testPath);
/**
 * Starting the new kernel
 */
const kernel = new SkeletonKernel();

kernel.start();
