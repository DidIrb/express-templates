import enquirer from 'enquirer';
import { InitPromptResponse } from '../types/prompts';

export async function initPrompt(): Promise<InitPromptResponse> {
  return enquirer.prompt<InitPromptResponse>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      initial: 'exirdjs-project',
    },
    {
      type: 'select',
      name: 'variant',
      message: 'Select a variant:',
      choices: ['TypeScript', 'JavaScript'],
    },
  ]);
}
