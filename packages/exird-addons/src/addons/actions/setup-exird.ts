import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import { globalErrorHandler } from "../../shared/config/errorHandler"
import { DirectoryCheckResult } from "../../types"
import { Action } from "../../types/actions"
import {
  getEntryPoint,
  getLanguage,
  getModuleSystem,
  getNewFolderName,
  getPackageManager,
  getProjectName,
  promptInitializeNewProject,
} from "../prompts/exird.prompts"
import { checkDirectory } from "../utils/checks"
import {
  createWorkflowsFolder,
  generateWorkflow,
} from "../utils/workflow-setup"

export const setupExird: Action = {
  name: "setup-exird",
  description: "Initializing an Exirdjs project with specified configurations",
  async execute(force: boolean = false) {
    const dirPath = process.cwd()

    try {
      const projectDetails: DirectoryCheckResult = await checkDirectory(dirPath)

      if (projectDetails.isExird && !force) {
        console.log(
          chalk.yellow("WRN"),
          "Exird already initialized. Aborting setup to prevent overwriting existing configurations.",
        )
        return
      }

      if (
        !projectDetails.isEmpty &&
        !projectDetails.hasExpress &&
        projectDetails.packageJsonExists
      ) {
        console.log(
          chalk.yellow("WRN"),
          "Express not found thus cannot be initialized at this location",
        )
        const initializeNewProject = await promptInitializeNewProject()
        if (initializeNewProject) {
          const newFolderName = await getNewFolderName()
          const newFolderPath = path.join(dirPath, newFolderName)
          fs.ensureDirSync(newFolderPath)
          process.chdir(newFolderPath)
        }
      }

      const config = await generateConfig(projectDetails)

      const exirdDir = path.join(process.cwd(), ".exird")
      fs.ensureDirSync(exirdDir)

      fs.writeFileSync(
        path.join(exirdDir, "exird.config.json"),
        JSON.stringify(config, null, 2),
      )

      createWorkflowsFolder(process.cwd())
      generateWorkflow({
        projectPath: process.cwd(),
        workflowName: "example-workflow",
        steps: ["setup-exird", "setup-express"],
      })

      console.log(chalk.green("Project setup complete."))
    } catch (error) {
      globalErrorHandler(error)
    }
  },
}

async function generateConfig(projectDetails: DirectoryCheckResult) {
  const language = projectDetails.hasTypeScript
    ? "TypeScript"
    : await getLanguage()
  const entry = projectDetails.entry || (await getEntryPoint(language))

  const config = {
    packageManager:
      projectDetails.packageManager || (await getPackageManager()),
    name: projectDetails.name || (await getProjectName()),
    language: language,
    entry: entry,
    format:
      projectDetails.moduleSystem === "module"
        ? "ES6"
        : await getModuleSystem(),
    exird: true,
    actions: {},
    addons: {},
  }

  return config
}
