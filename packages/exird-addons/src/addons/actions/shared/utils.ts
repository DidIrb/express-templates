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

export function updateConfig<K extends keyof ExirdConfig>(key: K, value: ExirdConfig[K]) {
  const config: ExirdConfig = fs.readJsonSync(configPath)

  if (Array.isArray(config[key]) && Array.isArray(value)) {
    const uniqueValues = new Set([...(config[key] as string[]), ...value])
    config[key] = Array.from(uniqueValues) as ExirdConfig[K]
  } else if (typeof config[key] === "object" && config[key] !== null && typeof value === "object" && value !== null) {
    config[key] = { ...config[key], ...value }
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
    const packageJsonPath = path.resolve(process.cwd(), "package.json")
    const packageJson = fs.existsSync(packageJsonPath) ? await fs.readJson(packageJsonPath) : { dependencies: {}, devDependencies: {} }

    // Ensure dependencies and devDependencies are treated as empty objects if missing
    packageJson.dependencies = packageJson.dependencies || {}
    packageJson.devDependencies = packageJson.devDependencies || {}

    const install = async (deps: string[], dev: boolean) => {
      const missingDeps = deps.filter((dep) => {
        const depName = dep.split("@")[0]
        return !(dev ? packageJson.devDependencies[depName] : packageJson.dependencies[depName])
      })

      if (missingDeps.length > 0) {
        const saveFlag = dev ? "--save-dev" : ""
        await execPromise(`${packageManager} install ${missingDeps.join(" ")} ${saveFlag}`)
      }
    }

    await install(dependencies.deps, false)
    await install(dependencies.devDeps, true)
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

export const normalizeName = (name: string): string => {
  return name
    .replace(/^--/, "")
    .replace(/^-/, "")
    .replace(/^setup-/, "")
}

export const createFile = async (filePath: string, content: string): Promise<void> => {
  try {
    await fs.outputFile(filePath, content)
  } catch (error) {
    console.error(chalk.red("ERR"), `Failed to create file ${filePath}:`, error)
    throw error
  }
}
