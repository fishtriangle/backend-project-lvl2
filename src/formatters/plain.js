import _ from 'lodash';

const plain = (diffArray) => {
  const iter = (currentDiff, path = '') => {
    let updateFromValue;
    const valueFormatter = (data) => {
      let formattedValue = data === '' ? '\'\'' : data;

      if (_.isObject(data)) {
        formattedValue = '[complex value]';
      } else if (typeof data === 'string') {
        formattedValue = `'${data}'`;
      }

      return formattedValue;
    };

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
        updateFromValue = valueFormatter(value);
      }
      if (action === 'updateTo') {
        return (
          `Property '${currentPath.join('.')}' was updated. From ${updateFromValue} to ${currentValue}`
        );
      }

      return iter(value, currentPath);
    });

    return _.compact(lines).join('\n');
  };

  return iter(diffArray);
};

export default plain;
