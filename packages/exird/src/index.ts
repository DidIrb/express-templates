#!/usr/bin/env node

import { program } from 'commander';
import { init } from 'exird-addons';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

program
    .version(packageJson.version, '-v, --version', 'output the current version')
    .helpOption('-h, --help', 'display help for command');

program
    .command('init')
    .description('Initialize a new express project')
    .action(() => init());

program.parse(process.argv);
