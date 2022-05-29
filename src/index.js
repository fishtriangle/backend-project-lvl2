import _ from 'lodash';
import makeObjectFromFile, { getData } from './parsers.js';
import standardTree from './formatters/standardTree.js';
import stylish from './formatters/stylishTree.js';
import plain from './formatters/plain.js';
import jsonFormatter from './formatters/json.js';

export const createDiffs = (primaryData, secondaryData = primaryData) => {
  const primaryKeys = Object.keys(primaryData);
  const secondaryKeys = Object.keys(secondaryData);
  const unitedKeys = _.uniq(primaryKeys.concat(secondaryKeys));

  return unitedKeys
    .slice()
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

const gendiff = (primaryPath, secondaryPath, logFormat = 'stylish') => {
  const primaryObject = makeObjectFromFile(primaryPath);
  const secondaryObject = makeObjectFromFile(secondaryPath);
  const diffs = createDiffs(getData(primaryObject), getData(secondaryObject));
  switch (logFormat) {
    case 'standard':
      return standardTree(diffs);
    case 'plain':
      return plain(diffs);
    case 'json':
      return jsonFormatter(diffs, primaryObject, secondaryObject);
    default:
      return stylish(diffs);
  }
};

export const logDiffsFromPaths = (primaryPath, secondaryPath, logFormat) => {
  console.log(
    gendiff(
      primaryPath,
      secondaryPath,
      logFormat,
    ),
  );
};

export default gendiff;
