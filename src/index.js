import { extname, resolve } from 'path';
import { readFileSync } from 'fs';
import createDiffs from './createDiffs.js';
import applyFormat from './formatters/index.js';
import parseData from './parsers.js';

const gendiff = (primaryPath, secondaryPath, logFormat = 'stylish') => {
  const getAbsolutePath = (path) => resolve(path);
  const getFormat = (absolutePath) => extname(absolutePath).slice(1);
  const getData = (absolutePath) => readFileSync(absolutePath, 'utf8');

  const primaryFullPath = getAbsolutePath(primaryPath);
  const secondaryFullPath = getAbsolutePath(secondaryPath);

  const primaryParsedData = parseData(getData(primaryFullPath), getFormat(primaryFullPath));
  const secondaryParsedData = parseData(getData(secondaryFullPath), getFormat(secondaryFullPath));

  const diffs = createDiffs(primaryParsedData, secondaryParsedData);

  return applyFormat(logFormat, diffs);
};

export default gendiff;
