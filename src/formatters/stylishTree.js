import _ from 'lodash';

const stylishTree = (diffArray) => {
  const iter = (currentDiff, depth) => {
    if (!_.isArray(currentDiff)) {
      return `${currentDiff}`;
    }

    const baseIndent = '  ';
    const indent = '    ';
    const currentIndent = `${baseIndent}${indent.repeat(depth)}`;
    const bracketIndent = `${indent.repeat(depth)}`;
    const lines = currentDiff.map(({ key, keyPrefix, value }) => (`${currentIndent}${keyPrefix} ${key}: ${iter(value, depth + 1)}`));

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diffArray, 0);
};

export default stylishTree;
