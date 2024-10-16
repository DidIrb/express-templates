import chalk from "chalk"
import { ExirdConfig } from "../../../types"
import { execPromise } from "../shared/utils"

export const initializeProject = async (packageManager: string): Promise<void> => {
  try {
    const command = packageManager === "pnpm" ? `${packageManager} init` : `${packageManager} init -y`

    await execPromise(command)
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to initialize project with ${packageManager}:`, error)
    throw error
  }
}

export const updateScripts = async (packageManager: string, entry: string, language: string): Promise<void> => {
  const tasks = [
    language === "TypeScript" ? `${packageManager} pkg set main="dist/index.js"` : `${packageManager} pkg set main="src/index.js"`,
    language === "TypeScript"
      ? `${packageManager} pkg set scripts.start="node ./dist/index.js"`
      : `${packageManager} pkg set scripts.start="node ./dist/index.js"`,
    language === "TypeScript"
      ? `${packageManager} pkg set scripts.dev="ts-node-dev ${entry}"`
      : `${packageManager} pkg set scripts.dev="nodemon ${entry}"`,
    language === "TypeScript"
      ? `${packageManager} pkg set scripts.build="tsup src/index.ts --format cjs,esm --dts"`
      : `${packageManager} pkg set scripts.build="tsup src/index.js --format cjs,esm"`,
  ]

  try {
    for (const task of tasks) {
      await execPromise(task)
    }
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to update package.json scripts:`, error)
    throw error
  }
}

export const showMsg = (config: ExirdConfig) => {
  const message = `
Express Project setup for 
  - ${config.name}
  - ${config.language}
  - ${config.format}
is complete!

To start the server, run:
${chalk.cyan(`${config.packageManager} run dev`)}
  `
  console.log(message)
}
