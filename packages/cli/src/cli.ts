#!/usr/bin/env node

import { program } from 'commander';
import Enquirer from 'enquirer';
import fs from 'fs-extra';
import path from 'path';
import { copyTemplate } from './utils/copy.js';
import { initPrompt } from './prompts/init.js';
import chalk from 'chalk';
import { InitPromptResponse } from './types/prompts.js';

const { prompt } = Enquirer;

async function init() {
  const { projectName, variant }: InitPromptResponse = await initPrompt();

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
    const choices = [
      'Remove existing files and continue',
      'Cancel operation',
      'Ignore files and continue'
    ];

    const { action } = await prompt<{ action: string }>([
      {
        type: 'select',
        name: 'action',
        message: 'Current directory is not empty. Please choose how to proceed:',
        choices: choices.map(choice => ({ name: choice, value: choice }))
      },
    ]);
    const actionIndex = choices.indexOf(action);

    if (actionIndex === 1) { 
      console.log(chalk.red('✖'), 'Operation cancelled.');
      process.exit(0);
    } else if (actionIndex === 0) {
      await fs.emptyDir(projectPath);
    }
    // No need to handle 'Ignore files and continue' as it will just proceed
  }

  await copyTemplate(variant, projectPath);
}

program
  .command('init')
  .description('Initialize a new exird project')
  .action(() => {
    init();
  });

program.parse(process.argv);

// If no command is provided, default to init
if (!process.argv.slice(2).length) {
  program.outputHelp();
  init();
}
