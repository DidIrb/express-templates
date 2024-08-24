declare module 'create-exird' {
  // RESEARCH MORE ON HOW TO IMPORT TYPES FROM OTHER FILES
  export interface InitPromptResponse {
    projectName: string;
    variant: string;
  }

  export function init(): Promise<void>;
  export function copyTemplate(variant: string, projectPath: string): Promise<void>;
  export function initPrompt(): Promise<InitPromptResponse>;
  export function actionPrompt(choices: string[]): Promise<void>;
}