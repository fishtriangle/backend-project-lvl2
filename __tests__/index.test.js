import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import printLog, { getObjectFromFile } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const primaryObject = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};
const secondaryObject = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};
const thirdObject = {};
const primaryNSecondaryDiffs = [
  '- follow: false',
  '  host: hexlet.io',
  '- proxy: 123.234.53.22',
  '- timeout: 50\n+ timeout: 20',
  '+ verbose: true',
];
const primaryNThirdDiffs = [
  '- follow: false',
  '- host: hexlet.io',
  '- proxy: 123.234.53.22',
  '- timeout: 50',
];

// beforeAll (() => {
//
// })

describe('create diffs from files', () => {
  test('get object from JSON', () => {
    const testingPrimaryObject = getObjectFromFile(getFixturePath('primaryObject.json'));
    const testingSecondaryObject = getObjectFromFile(getFixturePath('secondaryObject.json'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.json'));
    expect(testingPrimaryObject).toEqual(primaryObject);
    expect(testingSecondaryObject).toEqual(secondaryObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('get object from YAML', () => {
    const testingPrimaryObject = getObjectFromFile(getFixturePath('primaryObject.yml'));
    const testingSecondaryObject = getObjectFromFile(getFixturePath('secondaryObject.yml'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.yml'));
    expect(testingPrimaryObject).toEqual(primaryObject);
    expect(testingSecondaryObject).toEqual(secondaryObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('create diffs from objects', () => {
    expect(printLog(primaryObject, secondaryObject)).toEqual(primaryNSecondaryDiffs);
    expect(printLog(primaryObject, thirdObject)).toEqual(primaryNThirdDiffs);
  });
});
