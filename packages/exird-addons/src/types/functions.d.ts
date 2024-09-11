export function init(): Promise<void>;
export function checkPath(path: string): Promise<void>;
export function copyTemplate(variant: string, projectPath: string): Promise<void>;
export function actionPrompt(choices: string[]): Promise<string>;
export function initPrompt(): Promise<InitPromptResponse>; 