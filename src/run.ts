import * as Path from 'path';
import { createFolderIfNotExist } from '@grandlinex/kernel';
import SkeletonKernel from './SkeletonKernel';

const testPathData = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');

createFolderIfNotExist(testPathData);
createFolderIfNotExist(testPath);
/**
 * Starting the new kernel
 */
const kernel = new SkeletonKernel();

kernel.start();
