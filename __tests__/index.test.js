import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import gendiff from '../src/index.js';
import makeObject from '../src/makeObject.js';
import { firstObject, secondObject, thirdObject } from '../__fixtures__/objectsExamples.js';
import { firstNSecondDiffsStylish, firstNSecondDiffsPlain } from '../__fixtures__/diffLogsExamples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('create diffs from files', () => {
  test('get object from JSON', () => {
    const testingFirstObject = makeObject(getFixturePath('firstObject.json'));
    const testingSecondObject = makeObject(getFixturePath('secondObject.json'));
    const testingThirdObject = makeObject(getFixturePath('thirdObject.json'));
    expect(testingFirstObject.description).toEqual(firstObject);
    expect(testingSecondObject.description).toEqual(secondObject);
    expect(testingThirdObject.description).toEqual(thirdObject);
  });

  test('get object from YAML', () => {
    const testingFirstObject = makeObject(getFixturePath('firstObject.yml'));
    const testingSecondObject = makeObject(getFixturePath('secondObject.yml'));
    const testingThirdObject = makeObject(getFixturePath('thirdObject.yml'));
    expect(testingFirstObject.description).toEqual(firstObject);
    expect(testingSecondObject.description).toEqual(secondObject);
    expect(testingThirdObject.description).toEqual(thirdObject);
  });

  test('create diffs from objects in stylish', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'))).toEqual(firstNSecondDiffsStylish);
  });

  test('create diffs from objects in plain style', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'), 'plain')).toEqual(firstNSecondDiffsPlain);
  });

  test('create diffs from objects in json style', () => {
    const jsonDiff = gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'), 'json');
    expect(typeof jsonDiff).toBe('string');
    const [objectsInfo, messages] = JSON.parse(jsonDiff);
    expect(objectsInfo).toBeTruthy();
    expect(messages).toHaveProperty('diffMessages');
  });
});
