import _ from 'lodash';

const plain = (diffArray) => {
  let previousValue;
  let previousDepth = 0;
  const iter = (currentDiff, path = '', depth = 0) => {
    if (!_.isArray(currentDiff)) {
      return '';
    }

    const lines = currentDiff.flatMap(({ key, value, action }) => {
      const currentPath = [...path, key];

      let currentValue = value === '' ? '\'\'' : value;
      if (_.isObject(value)) {
        currentValue = '[complex value]';
      } else if (typeof value === 'string') {
        currentValue = `'${value}'`;
      }

      if (action === 'add') {
        return `Property '${currentPath.join('.')}' was added with value: ${currentValue}`;
      }
      if (action === 'remove') {
        return `Property '${currentPath.join('.')}' was removed`;
      }
      if (action === 'update') {
        return (
          `Property '${currentPath.join('.')}' was updated. From ${previousDepth > depth ? '[complex value]' : previousValue} to ${currentValue}`
        );
      }

      previousValue = currentValue;
      previousDepth = depth;
      return iter(value, currentPath, depth + 1);
    });

    return _.compact(lines).join('\n');
  };

  return iter(diffArray);
};

export default plain;
