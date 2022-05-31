import createDiffs from './createDiffs.js';
import applyFormat from './formatters/index.js';
import makeObject, { getDescription } from './makeObject.js';

const gendiff = (primaryPath, secondaryPath, logFormat = 'stylish') => {
  const primaryObject = makeObject(primaryPath);
  const secondaryObject = makeObject(secondaryPath);

  const diffs = createDiffs(getDescription(primaryObject), getDescription(secondaryObject));

  return applyFormat(logFormat, diffs, primaryObject, secondaryObject);
};

export default gendiff;
