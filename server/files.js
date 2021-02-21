import { resolve } from 'path';

export const assets = resolve(__dirname, '../build');
export const indexFilePath = resolve(assets, 'index.html');
export const images = resolve(__dirname, '../server-build');