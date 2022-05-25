import { program } from 'commander';
import { logDiffsFromPaths } from './index.js';

export default function cli() {
  program
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format <type>', 'output format')
    .action((primaryFilepath, secondaryFilepath, options) => {
      let logFormat = 'stylish';
      if (options.format === 'standard') {
        logFormat = 'standard';
      }
      logDiffsFromPaths(primaryFilepath, secondaryFilepath, logFormat);
    });

  program.parse();
}
