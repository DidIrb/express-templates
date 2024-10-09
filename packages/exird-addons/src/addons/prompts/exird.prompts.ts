import Enquirer from "enquirer"

const { prompt } = Enquirer

export interface ExirdPromptResponse {
  language: string
  moduleSystem: string
  useSrcDirectory: boolean
  entryPoint: string
  packageManager: string
  projectName: string
  newFolderName?: string
  initializeNewProject?: boolean
}

export async function getLanguage(): Promise<string> {
  const response: ExirdPromptResponse = await prompt({
    type: "select",
    name: "language",
    message: "Choose the language:",
    choices: ["JavaScript", "TypeScript"],
  })
  return response.language
}

export async function getModuleSystem(): Promise<string> {
  const response: ExirdPromptResponse = await prompt({
    type: "select",
    name: "moduleSystem",
    message: "Choose the module system:",
    choices: ["CommonJS (require)", "ES6 (import/export)"],
  })
  return response.moduleSystem
}

export async function getEntryPoint(language: string): Promise<string> {
  const initialEntryPoint =
    language === "TypeScript" ? "src/index.ts" : "src/index.js"
  const response: ExirdPromptResponse = await prompt({
    type: "input",
    name: "entryPoint",
    message: "Enter the entry point file name:",
    initial: initialEntryPoint,
  })
  return response.entryPoint
}

export async function getPackageManager(): Promise<string> {
  const response: ExirdPromptResponse = await prompt({
    type: "select",
    name: "packageManager",
    message: "Choose a package manager:",
    choices: ["npm", "yarn", "pnpm", "bun"],
  })
  return response.packageManager
}

export async function getProjectName(): Promise<string> {
  const response: ExirdPromptResponse = await prompt({
    type: "input",
    name: "projectName",
    message: "Enter the project name:",
    initial: "exirdjs-project",
  })
  return response.projectName
}

export async function getNewFolderName(): Promise<string> {
  const response: ExirdPromptResponse = await prompt({
    type: "input",
    name: "newFolderName",
    message: "Enter the name of the new folder:",
  })
  return response.newFolderName!
}

export async function promptInitializeNewProject(): Promise<boolean> {
  const response: ExirdPromptResponse = await prompt({
    type: "confirm",
    name: "initializeNewProject",
    message: "Do you want to initialize a new Exird project?",
  })
  return response.initializeNewProject!
}
