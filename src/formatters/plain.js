import _ from 'lodash';

const valueFormatter = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  if (typeof data === 'string') {
    return `'${data}'`;
  }
  return (data === '' ? '\'\'' : data);
};

const plain = (diffArray) => {
  const iter = (currentDiff, path = '') => {
    const valueCounter = {};

    if (!_.isArray(currentDiff)) {
      return '';
    }

    const lines = currentDiff.flatMap(({ key, value, action }) => {
      const currentPath = [...path, key];

      const currentValue = valueFormatter(value);

      if (action === 'add') {
        return `Property '${currentPath.join('.')}' was added with value: ${currentValue}`;
      }
      if (action === 'remove') {
        return `Property '${currentPath.join('.')}' was removed`;
      }
      if (action === 'updateFrom') {
        valueCounter.updateFromValue = valueFormatter(value);
      }
      if (action === 'updateTo') {
        return (
          `Property '${currentPath.join('.')}' was updated. From ${valueCounter.updateFromValue} to ${currentValue}`
        );
      }

      return iter(value, currentPath);
    });

    return _.compact(lines).join('\n');
  };

  return iter(diffArray);
};

export default plain;
