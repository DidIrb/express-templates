import fs from "fs-extra"
import path from "path"
import { DirectoryCheckResult, GenerateWorkflowParams } from "../../../types"
import { getEntryPoint, getLanguage, getModuleSystem, getPackageManager, getProjectName } from "./prompts"

export async function generateConfig(projectDetails: DirectoryCheckResult) {
  const language = projectDetails.hasTypeScript ? "TypeScript" : await getLanguage()
  const entry = projectDetails.entry || (await getEntryPoint(language))

  const config = {
    packageManager: projectDetails.packageManager || (await getPackageManager()),
    name: projectDetails.name || (await getProjectName()),
    language: language,
    entry: entry,
    format: projectDetails.moduleSystem === "module" ? "ES6" : await getModuleSystem(),
    exird: true,
    actions: [],
    addons: {},
  }

  return config
}

export function createWorkflowsFolder(projectPath: string) {
  const workflowsPath = path.join(projectPath, ".exird", "workflows")
  fs.ensureDirSync(workflowsPath)
}

export function generateWorkflow({ projectPath, workflowName, steps }: GenerateWorkflowParams) {
  const workflowContent = `
steps:
${steps.map((step) => `  - action: ${step}`).join("\n")}
  `
  const workflowsPath = path.join(projectPath, ".exird", "workflows")
  fs.ensureDirSync(workflowsPath)
  fs.writeFileSync(path.join(workflowsPath, `${workflowName}.yml`), workflowContent)
}
