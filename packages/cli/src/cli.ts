import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { copyTemplate } from './utils/copy.template.js';
import { initPrompt } from './prompts/init.js';

async function init() {
  const { projectName, variant } = await initPrompt();

  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length > 0) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Current directory is not empty. Please choose how to proceed:',
        choices: [
          'Remove existing files and continue',
          'Cancel operation',
          'Ignore files and continue',
        ],
      },
    ]);

    if (action === 'Cancel operation') {
      console.log('✖ Operation cancelled.');
      return;
    } else if (action === 'Remove existing files and continue') {
      await fs.emptyDir(projectPath);
    }
  }

  await copyTemplate(variant, projectPath);
}

process.on('SIGINT', async () => {
  const { confirmCancel } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmCancel',
      message: 'Do you want to cancel the operation?',
      default: true,
    },
  ]);

  if (confirmCancel) {
    console.log('✖ Operation cancelled.');
    process.exit(0);
  }
});

init().catch((error) => {
  console.error('Error:', error);
});
