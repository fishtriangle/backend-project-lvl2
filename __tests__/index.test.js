import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect } from '@jest/globals';
import diffsLogger, { getObject } from '../src/index.js';

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

test('create diffs from files', () => {
  const testingPrimaryObject = getObject(getFixturePath('primaryObject.json'));
  const testingSecondaryObject = getObject(getFixturePath('secondaryObject.json'));
  const testingThirdObject = getObject(getFixturePath('thirdObject.json'));
  expect(testingPrimaryObject).toEqual(primaryObject);
  expect(testingSecondaryObject).toEqual(secondaryObject);
  expect(testingThirdObject).toEqual(thirdObject);

  expect(diffsLogger(testingPrimaryObject, testingSecondaryObject)).toEqual(primaryNSecondaryDiffs);
  expect(diffsLogger(testingPrimaryObject, testingThirdObject)).toEqual(primaryNThirdDiffs);
});
