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

  const diffsArray = objectsKeys.map((key) => {
    if (_.isEqual(primaryObject[key], secondaryObject[key])) {
      return [`  ${key}: ${primaryObject[key]}`];
    }

    if (!(_.has(secondaryObject, key))) {
      return [`- ${key}: ${primaryObject[key]}`];
    }

    if (!(_.has(primaryObject, key))) {
      return [`+ ${key}: ${secondaryObject[key]}`];
    }

    return [
      `- ${key}: ${primaryObject[key]}`,
      `+ ${key}: ${secondaryObject[key]}`,
    ];
  });

  return diffsArray;
};

const logDiffs = (diffsArray) => {
  diffsArray
    .map((sameIndexDiffArray) => sameIndexDiffArray
      .map((diffItem) => {
        console.log(diffItem);
        return diffItem;
      }));
};

const gendiff = (primaryObject, secondaryObject) => {
  console.log('{');
  console.group();
  logDiffs(createDiffs(primaryObject, secondaryObject));
  console.groupEnd();
  console.log('}');
};

export const gendiffFromPaths = (primaryPath, secondaryPath) => {
  gendiff(getObject(primaryPath), getObject(secondaryPath));
};

export default gendiff;
