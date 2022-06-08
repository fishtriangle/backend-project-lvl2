import _ from 'lodash';

const formatValue = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  if (typeof data === 'string') {
    return `'${data}'`;
  }
  return (data === '' ? '\'\'' : data);
};

const toPlainFormat = (diffArray) => {
  const iter = (currentDiff, path = '') => {
    if (!_.isArray(currentDiff)) {
      return '';
    }

    const lines = currentDiff.flatMap(({
      key,
      value,
      type,
      valueBefore,
    }) => {
      const currentPath = [...path, key];

      const currentValue = formatValue(value);

      switch (type) {
        case 'added':
          return `Property '${currentPath.join('.')}' was added with value: ${currentValue}`;
        case 'removed':
          return `Property '${currentPath.join('.')}' was removed`;
        case 'updated':
          return (
            `Property '${currentPath.join('.')}' was updated. From ${formatValue(valueBefore)} to ${currentValue}`
          );
        default:
          return iter(value, currentPath);
      }
    });

    return _.compact(lines).join('\n');
  };

  return iter(diffArray);
};

export default toPlainFormat;
