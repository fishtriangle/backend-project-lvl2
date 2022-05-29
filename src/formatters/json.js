import _ from 'lodash';
import { getData, getFormat, getPath } from '../parsers.js';

const jsonFormatter = (diffArray, primaryObject, secondaryObject) => {
  let updateFromValue;
  let addCount = 0;
  let removeCount = 0;
  let updateCount = 0;
  let objectsInfo;

  if (!primaryObject && !secondaryObject) {
    objectsInfo = 'Diff created not from files!';
  } else {
    objectsInfo = {
      primaryObject: {
        fullPath: getPath(primaryObject),
        dataFormat: getFormat(primaryObject),
        data: getData(primaryObject),
      },
      secondaryObject: {
        fullPath: getPath(secondaryObject),
        dataFormat: getFormat(secondaryObject),
        data: getData(secondaryObject),
      },
    };
  }

  const valueFormatter = (data) => {
    let formattedValue = data === '' ? '\'\'' : data;

    if (_.isObject(data)) {
      formattedValue = '[complex value]';
    }

    return formattedValue;
  };

  const iter = (currentDiff, path = '') => {
    if (!_.isArray(currentDiff)) {
      return '';
    }

    const messages = currentDiff.flatMap(({ key, value, action }) => {
      const currentPath = [...path, key];

      const currentValue = valueFormatter(value);

      if (action === 'add') {
        addCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
          addArgument: currentValue,
        };
      }
      if (action === 'remove') {
        removeCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
        };
      }
      if (action === 'updateFrom') {
        updateFromValue = valueFormatter(value);
      }
      if (action === 'updateTo') {
        updateCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
          oldArgument: updateFromValue,
          newArgument: currentValue,
        };
      }

      return iter(value, currentPath);
    });

    return _.compact(messages);
  };

  return JSON.stringify(
    [
      objectsInfo,
      {
        diffMessages: iter(diffArray),
        statistics: {
          addedCount: addCount,
          removedCount: removeCount,
          updatedCount: updateCount,
        },
      },
    ],
  );
};

export default jsonFormatter;
