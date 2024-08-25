#!/usr/bin/env node

import { Command } from 'commander';
import { init as createExirdInit } from 'create-exird';
import chalk from 'chalk';

const program = new Command();

let isInitialized = false;

async function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    await createExirdInit();
}

program
  .name('exird')
  .description('CLI tool for scaffolding and building Express applications')
  .version('0.1.0');

program
  .command('init')
  .description('Scaffold a new Express application')
  .action(async () => {
    try {
        await initialize();
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red('✖'), 'An error occurred:', error.message);
        } else {
            console.log(chalk.red('✖'), 'Operation cancelled.');
        }
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log(chalk.blue('For more information, visit: https://your-website.com'));
}

export { initialize as init };
