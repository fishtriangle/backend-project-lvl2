import _ from 'lodash';
import makeObjectFromFile, { getData } from './parsers.js';
import standardTree from './formatters/standardTree.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';
import jsonFormatter from './formatters/json.js';

export const createDiffs = (primaryData, secondaryData = primaryData) => {
  const primaryKeys = Object.keys(primaryData);
  const secondaryKeys = Object.keys(secondaryData);

  return _.uniq(primaryKeys.concat(secondaryKeys))
    .sort()
    .flatMap((key) => {
      const primaryValue = primaryData[key];
      const secondaryValue = secondaryData[key];
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

      if (!(_.has(secondaryData, key))) {
        return {
          key,
          keyPrefix: '-',
          value: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
          action: 'remove',
        };
      }

      if (!(_.has(primaryData, key))) {
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
          action: 'updateFrom',
        },
        {
          key,
          keyPrefix: '+',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
          action: 'updateTo',
        },
      ];
    });
};

const gendiff = (primaryData, secondaryData, logFormat = 'standard', primaryObject = null, secondaryObject = null) => {
  const diffs = createDiffs(primaryData, secondaryData);
  if (logFormat === 'stylish') {
    return stylish(diffs);
  }
  if (logFormat === 'plain') {
    return plain(diffs);
  }
  if (logFormat === 'json') {
    return jsonFormatter(diffs, primaryObject, secondaryObject);
  }
  return standardTree(diffs);
};

export const logDiffsFromPaths = (primaryPath, secondaryPath, logFormat) => {
  const primaryObject = makeObjectFromFile(primaryPath);
  const secondaryObject = makeObjectFromFile(secondaryPath);
  console.log(
    gendiff(
      getData(primaryObject),
      getData(secondaryObject),
      logFormat,
      primaryObject,
      secondaryObject,
    ),
  );
};

export default gendiff;
