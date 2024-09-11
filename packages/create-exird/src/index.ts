#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { checkPath, copyTemplate, init } from "exird-addons";
import path from 'path';

const program = new Command();

program
    .name('exird')
    .description('CLI tool for scaffolding and building Express applications')
    .version('0.1.0')
    .arguments('[project-name]')
    .option('-t, --typescript', 'Use TypeScript template')
    .option('-j, --javascript', 'Use JavaScript template');

program.parse(process.argv);

const options = program.opts();
const projectName = program.args[0];

(async () => {
    if (!projectName && !options.typescript && !options.javascript) {
        await init();
    } else {
        // Arguments
        const template = options.typescript ? 'typescript' : options.javascript ? 'javascript' : null;
        if (!template) {
            console.log(chalk.yellow('No template specified. Use --typescript or --javascript.'));
            process.exit(1);
        }

        const destination = path.resolve(process.cwd(), projectName || 'exirdjs-project');
        await checkPath(destination);
        await copyTemplate(template, destination);
    }
})();
