import chalk from "chalk"
import fs from "fs-extra"
import { Listr } from "listr2"
import { globalErrorHandler } from "../../../config/errorHandler"
import { Action, ExirdConfig } from "../../../types"
import { setupExird } from "../setup-exird"
import { checkAction, checkForPackageJson, configPath, execPromise, installDependencies, printMessage, updateConfigValue } from "../shared/utils"
import { createIndexFile, getGitignore, getReadme, getTsConfig } from "./content"
import { createFile, initializeProject, updateScripts } from "./utils"

// ** Please account for things like npm -y when initializing
export const setupExpress: Action = {
  name: "setup-express",
  description: "Setting up an Express project with necessary configurations",
  async execute(force: boolean = false): Promise<void> {
    const dirPath: string = process.cwd()

    try {
      if (!fs.existsSync(configPath)) await setupExird.execute(force)
      if (checkAction("setup-express", force)) return

      const config: ExirdConfig = fs.readJsonSync(configPath)

      const tasks = new Listr([
        {
          title: "Initializing project if necessary",
          task: async () => {
            if (!checkForPackageJson(dirPath)) await initializeProject(config.packageManager)
          },
        },
        {
          title: "Creating necessary files",
          task: async () => {
            if (config.language === "TypeScript") {
              await createFile(".gitignore", getGitignore())
              await createFile("tsconfig.json", getTsConfig(config.format))
              await createFile("README.md", getReadme("TypeScript"))
              await createFile("src/index.ts", createIndexFile(config.language, config.format))
            } else {
              await createFile(".gitignore", getGitignore())
              await createFile("src/index.js", createIndexFile(config.language, config.format))
              await createFile("README.md", getReadme("JavaScript"))
            }
          },
        },
        {
          title: "Installing dependencies...",
          task: async () => {
            await installDependencies(config.packageManager, {
              deps: ["express"],
              devDeps:
                config.language === "TypeScript" ? ["typescript", "@types/node", "@types/express", "ts-node-dev", "tsup"] : ["nodemon", "tsup"],
            })
          },
        },
        {
          title: "Setting package name",
          task: async () => {
            await execPromise(`pnpm pkg set name=${config.name}`)
          },
        },
        {
          title: "Updating package.json scripts",
          task: async () => {
            await updateScripts(config.packageManager, config.language)
          },
        },
        {
          title: "Updating configuration values",
          task: async () => {
            await updateConfigValue("actions", ["setup-express"])
          },
        },
      ])

      await tasks.run()
      printMessage(chalk.green("SCS"), "Express base setup complete.")
    } catch (error) {
      globalErrorHandler(error)
    }
  },
}
