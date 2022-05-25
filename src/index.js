import { readFileSync } from 'node:fs';
import _ from 'lodash';
import { extname, resolve } from 'node:path';
import { parseJSON, parseYAML } from './parsers.js';
import { standardTree, stylish } from './formatters.js';

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
          key: `  ${key}`,
          value: createDiffs(primaryValue, secondaryValue),
        };
      }

      if (_.isEqual(primaryValue, secondaryValue)) {
        return {
          key: `  ${key}`,
          value: primaryValue,
        };
      }

      if (!(_.has(secondaryObject, key))) {
        return {
          key: `- ${key}`,
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
        };
      }

      if (!(_.has(primaryObject, key))) {
        return {
          key: `+ ${key}`,
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
        };
      }

      return [
        {
          key: `- ${key}`,
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
        },
        {
          key: `+ ${key}`,
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
        },
      ];
    });
};

const gendiff = (primaryObject, secondaryObject, logFormat = 'standard') => {
  if (logFormat === 'stylish') {
    return stylish(createDiffs(primaryObject, secondaryObject));
  }
  return standardTree(createDiffs(primaryObject, secondaryObject));
};

export const logDiffsFromPaths = (primaryPath, secondaryPath, logFormat) => {
  const primaryObject = getObjectFromFile(primaryPath);
  const secondaryObject = getObjectFromFile(secondaryPath);
  console.log(gendiff(primaryObject, secondaryObject, logFormat));
};

export default gendiff;
