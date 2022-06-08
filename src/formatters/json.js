import _ from 'lodash';

const formatValue = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  return (data === '' ? '\'\'' : data);
};

const toJsonFormat = (diffArray) => {
  const iter = (currentDiff, path = '') => {
    if (!_.isArray(currentDiff)) {
      return '';
    }

    const messages = currentDiff.flatMap(({
      key,
      value,
      type,
      valueBefore,
    }) => {
      const currentPath = [...path, key];
      const currentValue = formatValue(value);

      switch (type) {
        case 'added':
          return {
            actionType: type,
            node: currentPath.join('.'),
            addArgument: currentValue,
          };
        case 'removed':
          return {
            actionType: type,
            node: currentPath.join('.'),
          };
        case 'updated':
          return {
            actionType: type,
            node: currentPath.join('.'),
            oldArgument: valueBefore,
            newArgument: currentValue,
          };
        default:
          return iter(value, currentPath);
      }
    });

    return _.compact(messages);
  };

  const diffMessages = iter(diffArray);

  return JSON.stringify(diffMessages);
};

export default toJsonFormat;
