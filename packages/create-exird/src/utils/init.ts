import chalk from 'chalk';

import fs from 'fs-extra';
import path from 'path';
import { InitPromptResponse } from '../types/prompts';
import { initPrompt } from '../prompts/init.prompt.js';
import { actionPrompt } from '../prompts/action.js';
import { copyTemplate } from './copy.js';

export async function init() {
    const { projectName, variant }: InitPromptResponse = await initPrompt();
  
    const projectPath = path.resolve(process.cwd(), projectName);
  
    if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
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
        await fs.emptyDir(projectPath);
      } 
      // No need to handle 'Ignore files and continue' as it will just proceed
    }
  
    await copyTemplate(variant, projectPath);
  }
  