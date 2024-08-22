import inquirer from 'inquirer';

export async function initPrompt() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'exirdjs-project',
    },
    {
      type: 'list',
      name: 'variant',
      message: 'Select a variant:',
      choices: ['TypeScript', 'JavaScript'],
    },
  ]);
}
