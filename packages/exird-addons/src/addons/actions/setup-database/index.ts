import fs from "fs-extra"
import { setupExird } from "../"
import { globalErrorHandler } from "../../../config/errorHandler"
import { ExirdConfig } from "../../../types"
import setupEnv from "../addons/sub-actions/setup-env"
import { checkAction, configPath, updateConfig } from "../shared/utils"
import { NavigateDB, ReinitializeExpress, setupDB } from "./utils"
import chalk from "chalk"

const setupDatabase = {
  name: "setup-database",
  description: "Sets up the database configuration for the project.",
  execute: async (force: boolean = false) => {
    try {
      console.log(chalk.cyan("MSG"), "Only MongoDB supported!, More Features Pending...")
      if (!fs.existsSync(configPath)) await setupExird.execute(force)
      const config: ExirdConfig = fs.readJsonSync(configPath)
      if (!config.addons["env"]) {
        setupEnv.execute()
        updateConfig("addons", { ...config.addons, env: setupEnv.description })
      }
      if (checkAction("setup-database", force)) return
      await ReinitializeExpress(force)

      if (!config?.database?.name) {
        config.database = await setupDB()
        await updateConfig("database", config.database)
      }

      NavigateDB(config)

      updateConfig("actions", ["setup-database"])
    } catch (error) {
      globalErrorHandler(error)
    }
  },
}

export default setupDatabase
