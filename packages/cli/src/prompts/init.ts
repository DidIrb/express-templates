import Enquirer from 'enquirer';
import { InitPromptResponse } from '../types/prompts';
const { prompt } = Enquirer;


export async function initPrompt(): Promise<InitPromptResponse> {
  return prompt<InitPromptResponse>([
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
