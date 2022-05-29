<h1>Backend project level 2 (Generate difference - gendiff)</h1>

### Hexlet tests and linter status:
[![Actions Status](https://github.com/fishtriangle/backend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/fishtriangle/backend-project-lvl2/actions)

### Code working tests and linter status:
[![tests-on-push](https://github.com/fishtriangle/backend-project-lvl2/actions/workflows/tests-on-push.yml/badge.svg)](https://github.com/fishtriangle/backend-project-lvl2/actions/workflows/tests-on-push.yml)

<hr>

[![Maintainability](https://api.codeclimate.com/v1/badges/1b72e5781234ca347be8/maintainability)](https://codeclimate.com/github/fishtriangle/backend-project-lvl2/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/1b72e5781234ca347be8/test_coverage)](https://codeclimate.com/github/fishtriangle/backend-project-lvl2/test_coverage)

<hr>

### Asciinema logs:

#### Example of run with JSON-files:
[![asciicast](https://asciinema.org/a/5vZ8Od9i0oDV4buxL3cPiUy2Z.svg)](https://asciinema.org/a/5vZ8Od9i0oDV4buxL3cPiUy2Z)
#### Example of run with YAML-files:
[![asciicast](https://asciinema.org/a/sU9Qk0N79qr4O6vqQkmS1Rkv2.svg)](https://asciinema.org/a/sU9Qk0N79qr4O6vqQkmS1Rkv2)
#### Example of run with node structures:
[![asciicast](https://asciinema.org/a/0Bc1IiXUpRRUqS2vIHuSWv1hs.svg)](https://asciinema.org/a/0Bc1IiXUpRRUqS2vIHuSWv1hs)
#### Example of run with plain output:
[![asciicast](https://asciinema.org/a/YUU11kHMogwMKY6oNKEhKRi0m.svg)](https://asciinema.org/a/YUU11kHMogwMKY6oNKEhKRi0m)
#### Example of run with JSON output:
[![asciicast](https://asciinema.org/a/h6HnM9AeBKbXElgfk3KY66UZk.svg)](https://asciinema.org/a/h6HnM9AeBKbXElgfk3KY66UZk)

## Description
Second studying project created with node.js and makefile. 
Find difference between two objects.
In cli-mode supports: .json and .yml/.yaml files. 
Supports different output styles: standard, stylish, plain, json. 

## Requirements
<ul>
<li>Node.js</li>
<li>Makefile</li>
</ul>

## Installation 
In gendiff folder.
To install environment:
```
make install
```
To check is package correct:
```
make publish
```

To create local link:
```
npm link
```

In new application project folder:
```
npm link gendiff
```

## Use inside project:
Common case:
```
import gendiff from 'gendiff';

const diffLog = gendiff(objectBeforeUpdate, updatedObject);
```
And example of diffLog(string):
```
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      + setting3: {
            key5: value5
        }
        setting4: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
}
```


There are several output styles: standard, stylish, plain, json.
Use non-default output style:
```
gendiff(objectBeforeUpdate, updatedObject, 'stylish');
```


## CLI-use
After installation:
```
gendiff primaryFile.yml secondaryFile
```

Usage: gendiff [options] [filepath1] [filepath2]

Options:
<ol>
<li>-V, --version        output the version number</li>
<li>-f, --format [Type]  output format</li>
<li>-h, --help           display help for command</li>
</ol>


## Additional scripts
Linter script:
```
make lint
```

Run tests:
```
make test
```

Run tests coverage:
```
make test-coverage
```
