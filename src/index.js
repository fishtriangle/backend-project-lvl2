import { readFileSync } from 'node:fs';
import _ from 'lodash';
import { extname, resolve } from 'node:path';
import { parseJSON, parseYAML } from './parsers.js';
import standardTree from './formatters/standardTree.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';

export const getObjectFromFile = (path) => {
  const absolutePath = resolve(path);
  const format = extname(absolutePath);
  const data = readFileSync(absolutePath, 'utf8');
  if (format === '.json') {
    return parseJSON(data);
  }
  if (format === '.yml' || format === '.yaml') {
    return parseYAML(data);
  }
  throw new Error('File type is not supported!');
};

export const createDiffs = (primaryObject, secondaryObject = primaryObject) => {
  const primaryKeys = Object.keys(primaryObject);
  const secondaryKeys = Object.keys(secondaryObject);

  return _.uniq(primaryKeys.concat(secondaryKeys))
    .sort()
    .flatMap((key) => {
      const primaryValue = primaryObject[key];
      const secondaryValue = secondaryObject[key];
      if (_.isObject(primaryValue) && _.isObject(secondaryValue)) {
        return {
          key,
          keyPrefix: ' ',
          value: createDiffs(primaryValue, secondaryValue),
        };
      }

      if (_.isEqual(primaryValue, secondaryValue)) {
        return {
          key,
          keyPrefix: ' ',
          value: primaryValue,
        };
      }

      if (!(_.has(secondaryObject, key))) {
        return {
          key,
          keyPrefix: '-',
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
          action: 'remove',
        };
      }

      if (!(_.has(primaryObject, key))) {
        return {
          key,
          keyPrefix: '+',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
          action: 'add',
        };
      }

      return [
        {
          key,
          keyPrefix: '-',
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
        },
        {
          key,
          keyPrefix: '+',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
          action: 'update',
        },
      ];
    });
};

const gendiff = (primaryObject, secondaryObject, logFormat = 'standard') => {
  const diffs = createDiffs(primaryObject, secondaryObject);
  if (logFormat === 'stylish') {
    return stylish(diffs);
  }
  if (logFormat === 'plain') {
    return plain(diffs);
  }
  return standardTree(diffs);
};

export const logDiffsFromPaths = (primaryPath, secondaryPath, logFormat) => {
  const primaryObject = getObjectFromFile(primaryPath);
  const secondaryObject = getObjectFromFile(secondaryPath);
  console.log(gendiff(primaryObject, secondaryObject, logFormat));
};

export default gendiff;
