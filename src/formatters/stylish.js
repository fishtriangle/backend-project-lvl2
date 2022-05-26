import _ from 'lodash';

const stylish = (diffArray) => {
  const iter = (currentDiff, depth) => {
    if (!_.isArray(currentDiff)) {
      return `${currentDiff}\n`;
    }

    const indent = '  ';
    const currentIndent = `${indent.repeat(depth)}`;
    const lines = currentDiff.map(({ key, keyPrefix, value }) => (`${currentIndent}${keyPrefix} ${key}: ${iter(value, depth + 1)}`));

    return [
      '\n',
      ...lines,
    ].join('');
  };

  return iter(diffArray, 0).substring(1);
};

export default stylish;
