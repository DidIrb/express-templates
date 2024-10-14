import chalk from "chalk"
import fs from "fs-extra"
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

export const createFile = async (filePath: string, content: string): Promise<void> => {
  try {
    await fs.outputFile(filePath, content)
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to create file ${filePath}:`, error)
    throw error
  }
}

export const updateScripts = async (packageManager: string, language: string): Promise<void> => {
  const tasks = [
    language === "TypeScript" ? `${packageManager} pkg set main="dist/index.js"` : `${packageManager} pkg set main="src/index.js"`,
    language === "TypeScript"
      ? `${packageManager} pkg set scripts.start="node ./dist/index.js"`
      : `${packageManager} pkg set scripts.start="node ./dist/index.js"`,
    language === "TypeScript"
      ? `${packageManager} pkg set scripts.dev="ts-node-dev ./src/index.ts"`
      : `${packageManager} pkg set scripts.dev="nodemon ./src/index.js"`,
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
