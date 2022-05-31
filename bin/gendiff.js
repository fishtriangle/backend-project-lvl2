#!/usr/bin/env node

import { program } from 'commander';
import gendiff from '../src/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((primaryFilepath, secondaryFilepath, options) => {
    const logFormat = options.format ? options.format : 'stylish';
    console.log(gendiff(primaryFilepath, secondaryFilepath, logFormat));
  });

program.parse();
