#!/usr/bin/env node

import { init } from './utils/init.js';
import chalk from 'chalk';

let isInitialized = false;

async function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    await init();
}

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