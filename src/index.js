import { readFileSync } from 'node:fs';
import _ from 'lodash';
import { resolve } from 'node:path';

const getObject = (path) => {
  const absolutePath = resolve(path);
  return JSON.parse(readFileSync(absolutePath, 'utf8'));
};

const createDiffs = (primaryObject, secondaryObject) => {
  const objectsKeys = _.uniq(Object.keys(primaryObject).concat(Object.keys(secondaryObject)))
    .sort();

  const diffsArray = objectsKeys.map((key) => ({
    key,
    primaryProp: primaryObject[key],
    secondaryProp: secondaryObject[key],
  }));

  return diffsArray;
};

const gendiff = (primaryObject, secondaryObject) => {
  console.log('{');
  console.group();
  createDiffs(primaryObject, secondaryObject)
    .map(({key, primaryProp, secondaryProp}) => {
      if (_.isEqual(primaryProp, secondaryProp)) {
        return console.log(`  ${key}: ${primaryProp}`);
      }

      if (!secondaryProp) {
        return console.log(`- ${key}: ${primaryProp}`);
      }

      if (!primaryProp) {
        return console.log(`+ ${key}: ${secondaryProp}`);
      }

      return console.log(`- ${key}: ${primaryProp}\n+ ${key}: ${secondaryProp}`);
    });
  console.groupEnd();
  console.log('}');
};

export const gendiffFromPaths = (primaryPath, secondaryPath) => {
  gendiff(getObject(primaryPath), getObject(secondaryPath));
};

export default gendiff;
