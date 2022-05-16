#!/usr/bin/env node

import { program } from 'commander';
import index from '../src';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1');

program.parse();

export default index;
