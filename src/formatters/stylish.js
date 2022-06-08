import _ from 'lodash';

const stylish = (diffArray) => {
  const iter = (currentDiff, depth) => {
    if (!_.isArray(currentDiff)) {
      return `${currentDiff}`;
    }

    const baseIndent = '  ';
    const indent = '    ';
    const currentIndent = `${baseIndent}${indent.repeat(depth)}`;
    const bracketIndent = `${indent.repeat(depth)}`;

    const lines = currentDiff.flatMap(({
      key,
      type,
      value,
      valueBefore,
    }) => {
      switch (type) {
        case 'added':
          return `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`;
        case 'removed':
          return `${currentIndent}- ${key}: ${iter(value, depth + 1)}`;
        case 'updated':
          return [
            `${currentIndent}- ${key}: ${iter(valueBefore, depth + 1)}`,
            `${currentIndent}+ ${key}: ${iter(value, depth + 1)}`,
          ];
        default:
          return `${currentIndent}  ${key}: ${iter(value, depth + 1)}`;
      }
    });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diffArray, 0);
};

export default stylish;
