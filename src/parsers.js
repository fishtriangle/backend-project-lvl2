import yaml from 'js-yaml';
import { extname, resolve } from 'path';
import { readFileSync } from 'fs';

export const parseJSON = (dataJSON) => (JSON.parse(dataJSON));
export const parseYAML = (dataYAML) => (yaml.load(dataYAML));

const parsers = {
  '.json': parseJSON,
  '.yml': parseYAML,
  '.yaml': parseYAML,
};

const makeObjectFromFile = (path) => {
  const absolutePath = resolve(path);
  const format = extname(absolutePath);
  const data = readFileSync(absolutePath, 'utf8');
  const object = parsers[format](data);
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
