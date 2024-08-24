#!/usr/bin/env node

import { init } from './utils/init.js';
import chalk from 'chalk';

(async () => {
    try {
        console.log(process.argv.length)
        await init();
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red('✖'), 'An error occurred:', error.message);
        } else {
            console.log(chalk.red('✖'), 'Operation cancelled.');
        }
    }
})();
