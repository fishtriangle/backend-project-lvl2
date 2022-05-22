import { readFileSync } from 'node:fs';
import _ from 'lodash';
import { resolve } from 'node:path';
import { car, cdr, cons } from 'hexlet-pairs';

export const getObject = (path) => {
  const absolutePath = resolve(path);
  return JSON.parse(readFileSync(absolutePath, 'utf8'));
};

export const createDiffs = (primaryObject, secondaryObject) => {
  const objectsPair = cons(_.cloneDeep(primaryObject), _.cloneDeep(secondaryObject));

  const getKeys = (pair) => {
    const primaryKeys = Object.keys(car(pair));
    const secondaryKeys = Object.keys(cdr(pair));
    return _.uniq(primaryKeys.concat(secondaryKeys)).sort();
  };

  const objectsKeys = getKeys(objectsPair);

  return objectsKeys.map((key) => ({
    key,
    props: cons(car(objectsPair)[key], cdr(objectsPair)[key]),
  }));
};

const diffsLogger = (primaryObject, secondaryObject) => {
  console.log('{');
  console.group();
  const diffLog = createDiffs(primaryObject, secondaryObject)
    .map(({ key, props }) => {
      let diffResultString;
      if (_.isEqual(car(props), cdr(props))) {
        diffResultString = `  ${key}: ${car(props)}`;
      } else if (!cdr(props)) {
        diffResultString = `- ${key}: ${car(props)}`;
      } else if (!car(props)) {
        diffResultString = `+ ${key}: ${cdr(props)}`;
      } else {
        diffResultString = `- ${key}: ${car(props)}\n+ ${key}: ${cdr(props)}`;
      }
      console.log(diffResultString);
      return diffResultString;
    });
  console.groupEnd();
  console.log('}');
  return diffLog;
};

export const logDiffsFromPaths = (primaryPath, secondaryPath) => {
  diffsLogger(getObject(primaryPath), getObject(secondaryPath));
};

export default diffsLogger;
