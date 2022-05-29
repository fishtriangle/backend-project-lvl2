import _ from 'lodash';
import makeObjectFromFile, { getData } from './parsers.js';
import toStandardFormat from './formatters/standard.js';
import toStylishFormat from './formatters/stylish.js';
import toPlainFormat from './formatters/plain.js';
import toJsonFormat from './formatters/json.js';

export const createDiffs = (primaryData, secondaryData = primaryData) => {
  const primaryKeys = Object.keys(primaryData);
  const secondaryKeys = Object.keys(secondaryData);
  const unitedKeys = _.uniq(primaryKeys.concat(secondaryKeys));

  return _.sortBy(unitedKeys)
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
        },
        {
          key,
          keyPrefix: '+',
          value: _.isObject(secondaryValue) ? createDiffs(secondaryValue) : secondaryValue,
          valueBefore: _.isObject(primaryValue) ? createDiffs(primaryValue) : primaryValue,
          action: 'update',
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
      return toStandardFormat(diffs);
    case 'plain':
      return toPlainFormat(diffs);
    case 'json':
      return toJsonFormat(diffs, primaryObject, secondaryObject);
    default:
      return toStylishFormat(diffs);
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
