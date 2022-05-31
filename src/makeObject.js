import { extname, resolve } from 'path';
import { readFileSync } from 'fs';
import parseData from './parsers.js';

const makeObject = (path) => {
  const absolutePath = resolve(path);
  const format = extname(absolutePath).slice(1);
  const data = readFileSync(absolutePath, 'utf8');
  const parsedData = parseData(data, format);
  return {
    path: absolutePath,
    format,
    description: parsedData,
  };
};

export const getPath = (object) => object.path;
export const getDescription = (object) => object.description;
export const getFormat = (object) => object.format;

export default makeObject;
