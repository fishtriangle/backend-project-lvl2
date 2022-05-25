import _ from 'lodash';

export const standardTree = (diffArray) => {
  const iter = (currentDiff, depth) => {
    if (!_.isArray(currentDiff)) {
      return `${currentDiff}`;
    }

    const baseIndent = '  ';
    const indent = '    ';
    const currentIndent = `${baseIndent}${indent.repeat(depth)}`;
    const bracketIndent = `${indent.repeat(depth)}`;
    const lines = currentDiff.map(({ key, value }) => (`${currentIndent}${key}: ${iter(value, depth + 1)}`));

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diffArray, 0);
};

export const stylish = (diffArray) => {
  const iter = (currentDiff, depth) => {
    if (!_.isArray(currentDiff)) {
      return `${currentDiff}\n`;
    }

    const indent = '  ';
    const currentIndent = `${indent.repeat(depth)}`;
    const lines = currentDiff.map(({ key, value }) => (`${currentIndent}${key}: ${iter(value, depth + 1)}`));

    return [
      '\n',
      ...lines,
    ].join('');
  };

  return iter(diffArray, 0).substring(1);
};
