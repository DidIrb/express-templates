import fs from "fs-extra"
import path from "path"
import { ExirdConfig } from "../../../types"
import { exec } from "child_process"
import { promisify } from "util"
import chalk from "chalk"

export const configPath = path.join(process.cwd(), ".exird", "exird.config.json")
export const execPromise = promisify(exec)

export const checkForPackageJson = (dirPath: string): boolean => {
  const packageJsonPath = path.join(dirPath, "package.json")
  return fs.existsSync(packageJsonPath)
}

export function updateConfigValue<K extends keyof ExirdConfig>(key: K, value: ExirdConfig[K]) {
  const config: ExirdConfig = fs.readJsonSync(configPath)
  if (Array.isArray(config[key]) && Array.isArray(value)) {
    const uniqueValues = new Set(config[key] as string[])
    value.forEach((item) => uniqueValues.add(item))
    config[key] = Array.from(uniqueValues) as ExirdConfig[K]
  } else {
    config[key] = value
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export const executeCommand = async (command: string): Promise<void> => {
  try {
    await execPromise(command)
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to execute command: ${command}`, error)
    throw error
  }
}

export const checkAction = (action: string, force: boolean = false): boolean => {
  const config: ExirdConfig = fs.readJsonSync(configPath)
  if (!force && config.actions.includes(action)) {
    console.log(chalk.grey("EXT"), `Skipping action: "${action}" has already been executed.`)
    return true
  }
  return false
}

export const installDependencies = async (packageManager: string, dependencies: { deps: string[]; devDeps: string[] }): Promise<void> => {
  try {
    if (dependencies.deps.length > 0) {
      await execPromise(`${packageManager} install ${dependencies.deps.join(" ")}`)
    }
    if (dependencies.devDeps.length > 0) {
      await execPromise(`${packageManager} install ${dependencies.devDeps.join(" ")} --save-dev`)
    }
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to install dependencies:`, error)
    throw error
  }
}

export function printMessage(...messages: string[]) {
  const terminalWidth = process.stdout.columns
  const separator = "-".repeat(terminalWidth)
  console.log(separator)
  console.log(messages.map((msg) => msg.toString()).join(" "))
  console.log(separator)
}
