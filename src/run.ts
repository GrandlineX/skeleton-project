import * as Path from 'path';
import { config } from 'dotenv';
import { createFolderIfNotExist } from '@grandlinex/kernel';
import SkeletonKernel from './SkeletonKernel';

const testPathData = Path.join(__dirname, '..', 'data');
const testPath = Path.join(__dirname, '..', 'data', 'config');
config();

createFolderIfNotExist(testPathData);
createFolderIfNotExist(testPath);

const kernel = new SkeletonKernel();

kernel.start();
