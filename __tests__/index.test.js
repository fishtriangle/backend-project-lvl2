import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import gendiff from '../src/index.js';
import makeObjectFromFile from '../src/parsers.js';
import { firstObject, secondObject, thirdObject } from '../__fixtures__/objectsExamples.js';
import { firstNSecondDiffsStandard, firstNSecondDiffsStylish, firstNSecondDiffsPlain } from '../__fixtures__/diffLogsExamples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('create diffs from files', () => {
  test('get object from JSON', () => {
    const testingFirstObject = makeObjectFromFile(getFixturePath('firstObject.json'));
    const testingSecondObject = makeObjectFromFile(getFixturePath('secondObject.json'));
    const testingThirdObject = makeObjectFromFile(getFixturePath('thirdObject.json'));
    expect(testingFirstObject.data).toEqual(firstObject);
    expect(testingSecondObject.data).toEqual(secondObject);
    expect(testingThirdObject.data).toEqual(thirdObject);
  });

  test('get object from YAML', () => {
    const testingFirstObject = makeObjectFromFile(getFixturePath('firstObject.yml'));
    const testingSecondObject = makeObjectFromFile(getFixturePath('secondObject.yml'));
    const testingThirdObject = makeObjectFromFile(getFixturePath('thirdObject.yml'));
    expect(testingFirstObject.data).toEqual(firstObject);
    expect(testingSecondObject.data).toEqual(secondObject);
    expect(testingThirdObject.data).toEqual(thirdObject);
  });

  test('create diffs from objects in standard style', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'))).toEqual(firstNSecondDiffsStandard);
  });

  test('create diffs from objects in stylish', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'), 'stylish')).toEqual(firstNSecondDiffsStylish);
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
    expect(messages).toHaveProperty('statistics');
  });
});
