import chalk from "chalk"
import { globalErrorHandler } from "../../../config/errorHandler"
import { Action, ExirdConfig } from "../../../types"
import { configPath, normalizeName, printMessage, updateConfig } from "../shared/utils"
import registerSubActions from "./registry"
import fs from "fs-extra"
import { setupExird } from "../setup-exird"

const subActions = registerSubActions()

export const addons: Action = {
  name: "addons",
  description: "Setting up additional configurations and dependencies",
  async execute(force: boolean = false, subActionsList: string[] = []): Promise<void> {
    try {
      if (!fs.existsSync(configPath)) await setupExird.execute(force)

      const config: ExirdConfig = fs.readJsonSync(configPath)

      if (subActionsList.length === 0) {
        console.log(chalk.blue("Available sub-actions:"))
        Object.values(subActions).forEach(({ name, description }) => {
          console.log(`- ${name}: ${description}`)
        })
      } else {
        for (const subActionName of subActionsList) {
          const normalized = normalizeName(subActionName)
          if (config.addons[normalized] && !force) {
            console.log(chalk.gray("EXT"), `Addons: "${normalized}" has already been run.`)
            continue
          }
          const subAction = subActions[normalized]
          if (subAction) {
            await subAction.execute()
            updateConfig("addons", { ...config.addons, [normalized]: subAction.description })
          } else {
            throw new Error(`Addons "${subActionName}" not found.`)
          }
        }
        printMessage(chalk.green("SCS"), "Setup complete.")
      }
    } catch (error) {
      globalErrorHandler(error)
    }
  },
}
