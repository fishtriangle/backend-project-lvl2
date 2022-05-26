import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import gendiff, { getObjectFromFile } from '../src/index.js';
import { firstObject, secondObject, thirdObject } from '../__fixtures__/objectsExamples.js';
import { firstNSecondDiffsStandard, firstNSecondDiffsStylish, firstNSecondDiffsPlain } from '../__fixtures__/diffLogsExamples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

// beforeAll (() => {
//
// })

describe('create diffs from files', () => {
  test('get object from JSON', () => {
    const testingFirstObject = getObjectFromFile(getFixturePath('firstObject.json'));
    const testingSecondObject = getObjectFromFile(getFixturePath('secondObject.json'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.json'));
    expect(testingFirstObject).toEqual(firstObject);
    expect(testingSecondObject).toEqual(secondObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('get object from YAML', () => {
    const testingFirstObject = getObjectFromFile(getFixturePath('firstObject.yml'));
    const testingSecondObject = getObjectFromFile(getFixturePath('secondObject.yml'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.yml'));
    expect(testingFirstObject).toEqual(firstObject);
    expect(testingSecondObject).toEqual(secondObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('create diffs from objects in standard style', () => {
    expect(gendiff(firstObject, secondObject)).toEqual(firstNSecondDiffsStandard);
  });

  test('create diffs from objects in stylish', () => {
    expect(gendiff(firstObject, secondObject, 'stylish')).toEqual(firstNSecondDiffsStylish);
  });

  test('create diffs from objects in plain style', () => {
    expect(gendiff(firstObject, secondObject, 'plain')).toEqual(firstNSecondDiffsPlain);
  });
});
