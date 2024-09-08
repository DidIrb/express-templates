#!/usr/bin/env node

import { init } from './utils/init.js';
import chalk from 'chalk';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import { copyTemplate } from './utils/copy.js';
import { actionPrompt } from './prompts/action.js';

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
    .version('0.1.0')
    .arguments('[project-name]')
    .option('-t, --typescript', 'Use TypeScript template')  // This should not show inside the exird package
    .option('-j, --javascript', 'Use JavaScript template'); //  neither should this

program.parse(process.argv);

const options = program.opts();
const projectName = program.args[0];

// Check if the command is 'init' and handle it separately
if (projectName === 'init') {
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
} else {
    (async () => {
        try {
            if (!projectName && !options.typescript && !options.javascript) {
                // No arguments provided, run the init function
                await initialize();
            } else {
                // Arguments provided, handle them
                const template = options.typescript ? 'typescript' : options.javascript ? 'javascript' : null;
                if (!template) {
                    console.log(chalk.yellow('No template specified. Use --typescript or --javascript.'));
                    process.exit(1);
                }

                const destination = path.resolve(process.cwd(), projectName || 'exirdjs-project');

                // Check if the destination directory exists and handle accordingly
                if (fs.existsSync(destination) && fs.readdirSync(destination).length > 0) {
                    const choices = [
                        'Remove existing files and continue',
                        'Cancel operation',
                        'Ignore files and continue'
                    ];

                    const action = await actionPrompt(choices);
                    const actionIndex = choices.indexOf(action);

                    if (actionIndex === 1) {
                        console.log(chalk.red('✖'), 'Operation cancelled.');
                        process.exit(0);
                    } else if (actionIndex === 0) {
                        await fs.emptyDir(destination);
                    }
                    // No need to handle 'Ignore files and continue' as it will just proceed
                }

                await copyTemplate(template, destination);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(chalk.red('✖'), 'An error occurred:', error.message);
            } else {
                console.log(chalk.red('✖'), 'Operation cancelled.');
            }
        }
    })();
}

export { initialize as init };
