import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import gendiff from '../src/index.js';
import { firstNSecondDiffsStylish, firstNSecondDiffsPlain } from '../__fixtures__/diffLogsExamples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('create diffs from files', () => {
  test('create diffs from objects in stylish', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'))).toEqual(firstNSecondDiffsStylish);
  });

  test('create diffs from objects in plain style', () => {
    expect(gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'), 'plain')).toEqual(firstNSecondDiffsPlain);
  });

  test('create diffs from objects in json style', () => {
    const jsonDiff = gendiff(getFixturePath('firstObject.yml'), getFixturePath('secondObject.yml'), 'json');
    expect(typeof jsonDiff).toBe('string');
    const messages = JSON.parse(jsonDiff);
    expect(messages).toBeTruthy();
    expect(messages[0]).toHaveProperty('actionType');
    expect(messages[0]).toHaveProperty('node');
  });
});
