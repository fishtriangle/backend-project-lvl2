import yaml from 'js-yaml';
import { extname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

export const parseJSON = (dataJSON) => (JSON.parse(dataJSON));
export const parseYAML = (dataYAML) => (yaml.load(dataYAML));

const makeObjectFromFile = (path) => {
  const absolutePath = resolve(path);
  const format = extname(absolutePath);
  const data = readFileSync(absolutePath, 'utf8');
  let object;
  if (format === '.json') {
    object = parseJSON(data);
  }
  if (format === '.yml' || format === '.yaml') {
    object = parseYAML(data);
  }
  if (!object) {
    throw new Error('File type is not supported!');
  }
  return {
    path: absolutePath,
    format,
    data: object,
  };
};

export const getPath = (objectToDiff) => objectToDiff.path;
export const getData = (objectToDiff) => objectToDiff.data;
export const getFormat = (objectToDiff) => objectToDiff.format;

export default makeObjectFromFile;
