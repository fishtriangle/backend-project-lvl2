import { fileURLToPath } from 'url';
import path from 'path';
import { test, expect, describe } from '@jest/globals';
import gendiff, { getObjectFromFile } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const thirdObject = {};
const fourthObject = {
  common: {
    setting1: 'Value 1',
    setting2: 200,
    setting3: true,
    setting6: {
      key: 'value',
      doge: {
        wow: '',
      },
    },
  },
  group1: {
    baz: 'bas',
    foo: 'bar',
    nest: {
      key: 'value',
    },
  },
  group2: {
    abc: 12345,
    deep: {
      id: 45,
    },
  },
};

const fifthObject = {
  common: {
    follow: false,
    setting1: 'Value 1',
    setting3: null,
    setting4: 'blah blah',
    setting5: {
      key5: 'value5',
    },
    setting6: {
      key: 'value',
      ops: 'vops',
      doge: {
        wow: 'so much',
      },
    },
  },
  group1: {
    foo: 'bar',
    baz: 'bars',
    nest: 'str',
  },
  group3: {
    deep: {
      id: {
        number: 45,
      },
    },
    fee: 100500,
  },
};

const fourthNFifthDiffs = '{\n'
+ '    common: {\n'
+ '      + follow: false\n'
+ '        setting1: Value 1\n'
+ '      - setting2: 200\n'
+ '      - setting3: true\n'
+ '      + setting3: null\n'
+ '      + setting4: blah blah\n'
+ '      + setting5: {\n'
+ '            key5: value5\n'
+ '        }\n'
+ '        setting6: {\n'
+ '            doge: {\n'
+ '              - wow: \n'
+ '              + wow: so much\n'
+ '            }\n'
+ '            key: value\n'
+ '          + ops: vops\n'
+ '        }\n'
+ '    }\n'
+ '    group1: {\n'
+ '      - baz: bas\n'
+ '      + baz: bars\n'
+ '        foo: bar\n'
+ '      - nest: {\n'
+ '            key: value\n'
+ '        }\n'
+ '      + nest: str\n'
+ '    }\n'
+ '  - group2: {\n'
+ '        abc: 12345\n'
+ '        deep: {\n'
+ '            id: 45\n'
+ '        }\n'
+ '    }\n'
+ '  + group3: {\n'
+ '        deep: {\n'
+ '            id: {\n'
+ '                number: 45\n'
+ '            }\n'
+ '        }\n'
+ '        fee: 100500\n'
+ '    }\n'
+ '}';

// beforeAll (() => {
//
// })

describe('create diffs from files', () => {
  test('get object from JSON', () => {
    const testingFourthObject = getObjectFromFile(getFixturePath('fourthObject.json'));
    const testingFifthObject = getObjectFromFile(getFixturePath('fifthObject.json'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.json'));
    expect(testingFourthObject).toEqual(fourthObject);
    expect(testingFifthObject).toEqual(fifthObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('get object from YAML', () => {
    const testingFourthObject = getObjectFromFile(getFixturePath('fourthObject.yml'));
    const testingFifthObject = getObjectFromFile(getFixturePath('fifthObject.yml'));
    const testingThirdObject = getObjectFromFile(getFixturePath('thirdObject.yml'));
    expect(testingFourthObject).toEqual(fourthObject);
    expect(testingFifthObject).toEqual(fifthObject);
    expect(testingThirdObject).toEqual(thirdObject);
  });

  test('create diffs from objects', () => {
    expect(gendiff(fourthObject, fifthObject)).toEqual(fourthNFifthDiffs);
  });
});
