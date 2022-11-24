import * as Path from 'path';
import { XUtil } from '@grandlinex/kernel';
import SkeletonKernel from './index';

const testPathData = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');

XUtil.createFolderIfNotExist(testPathData);
XUtil.createFolderIfNotExist(testPath);
/**
 * Starting the new kernel
 */
const kernel = new SkeletonKernel();

kernel.start();
