import toPlainFormat from './plain.js';
import toJsonFormat from './json.js';
import toStylishFormat from './stylish.js';

const applyFormat = (format, diffs, primaryObject, secondaryObject) => {
  switch (format) {
    case 'plain':
      return toPlainFormat(diffs);
    case 'json':
      return toJsonFormat(diffs, primaryObject, secondaryObject);
    default:
      return toStylishFormat(diffs);
  }
};

export default applyFormat;
