#!/usr/bin/env node

import { init } from './utils/init.js';
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

let isInitialized = false;

async function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    await init();
}

program
  .name('exird')
  .description('CLI tool for scaffolding and building Express applications')
  .version('0.1.0');

(async () => {
    try {
        await initialize();
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red('✖'), 'An error occurred:', error.message);
        } else {
            console.log(chalk.red('✖'), 'Operation cancelled.');
        }
    }
})();

export { initialize as init };