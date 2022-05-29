import _ from 'lodash';
import { getData, getFormat, getPath } from '../parsers.js';

const makeObjectsInfo = (primaryObject, secondaryObject) => (
  (!primaryObject && !secondaryObject)
    ? 'Diff created not from files!'
    : {
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
    });

const valueFormatter = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  return (data === '' ? '\'\'' : data);
};

const jsonFormatter = (diffArray, primaryObject, secondaryObject) => {
  const counters = {
    addCount: 0,
    removeCount: 0,
    updateCount: 0,
    updateFromValue: '',
  };
  const objectsInfo = makeObjectsInfo(primaryObject, secondaryObject);

  const iter = (currentDiff, path = '') => {
    if (!_.isArray(currentDiff)) {
      return '';
    }

    const messages = currentDiff.flatMap(({ key, value, action }) => {
      const currentPath = [...path, key];
      const currentValue = valueFormatter(value);

      if (action === 'add') {
        counters.addCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
          addArgument: currentValue,
        };
      }
      if (action === 'remove') {
        counters.removeCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
        };
      }
      if (action === 'updateFrom') {
        counters.updateFromValue = valueFormatter(value);
      }
      if (action === 'updateTo') {
        counters.updateCount += 1;
        return {
          actionId: action,
          node: currentPath.join('.'),
          oldArgument: counters.updateFromValue,
          newArgument: currentValue,
        };
      }

      return iter(value, currentPath);
    });

    return _.compact(messages);
  };

  const diffMessages = iter(diffArray);

  return JSON.stringify(
    [
      objectsInfo,
      {
        diffMessages,
        statistics: {
          addCount: counters.addCount,
          removeCount: counters.removeCount,
          updateCount: counters.updateCount,
        },
      },
    ],
  );
};

export default jsonFormatter;
