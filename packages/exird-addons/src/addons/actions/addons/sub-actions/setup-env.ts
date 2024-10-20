import chalk from "chalk"
import fs from "fs-extra"
import { Listr } from "listr2"
import path from "path"
import { ExirdConfig } from "../../../../types"
import { configPath, createFile, installDependencies } from "../../shared/utils"

const setupEnv = {
  name: "env",
  description: "Sets up the project environment.",
  execute: async () => {
    console.log(chalk.bold.blue("Running Environment Setup..."))
    const config: ExirdConfig = fs.readJsonSync(configPath)
    const tasks = new Listr([
      {
        title: "Installing dependencies",
        task: async () => {
          await installDependencies(config.packageManager, {
            deps: [],
            devDeps: ["dotenv"],
          })
        },
      },
      {
        title: "Creating .env file",
        task: async () => {
          const envPath = path.resolve(process.cwd(), ".env")
          await createFile(envPath, envContent)
        },
      },
      {
        title: "Creating config file",
        task: async () => {
          await generateConfigFile(config)
        },
      },
      {
        title: "Updating entry file",
        task: async () => {
          await updateEntry(config)
        },
      },
    ])

    await tasks.run()

    showMsg(config.format)
  },
}

export default setupEnv

// UTILITY FUNCTIONS

const showMsg = (format: string) => {
  const statement = format === "ES6" ? "import config from './config';" : "const config = require('./config');"

  const message = `
Environment setup is complete!
You can now update your environment variables in the .env file.

To use the environment variables, import the config as follows:
${chalk.cyan(statement)}
  `
  console.log(message)
}

export const envContent = `
# Environment
NODE_ENV=development

# Development variables
PORT_DEVELOPMENT=3000

# Test variables
PORT_TEST=4000

# Staging variables
PORT_STAGING=6000

# Production variables
PORT_PRODUCTION=8000
          `.trim()

export const generateConfigFile = async (config: ExirdConfig) => {
  const configFilePath = path.resolve(process.cwd(), "src/config.js")
  const tsConfigFilePath = path.resolve(process.cwd(), "src/config.ts")

  let configFileContent = ""
  if (config.language === "TypeScript") {
    configFileContent = `
import dotenv from 'dotenv';
dotenv.config();
  
const NODE_ENV = process.env.NODE_ENV ?? 'development';

export default {
  env: NODE_ENV,
  port: process.env[\`PORT_\${NODE_ENV.toUpperCase()}\`] || 3000,
};
      `.trim()
  } else if (config.language === "JavaScript") {
    if (config.format === "ES6") {
      configFileContent = `
import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';

export default {
  env: NODE_ENV,
  port: process.env[\`PORT_\${NODE_ENV.toUpperCase()}\`] || 3000,
};
        `.trim()
    } else if (config.format === "CommonJS") {
      configFileContent = `
const dotenv = require('dotenv');
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';

module.exports = {
  env: NODE_ENV,
  port: process.env[\`PORT_\${process.env.NODE_ENV.toUpperCase()}\`],
};
        `.trim()
    }
  }

  if (config.language === "TypeScript") {
    await createFile(tsConfigFilePath, configFileContent)
  } else {
    await createFile(configFilePath, configFileContent)
  }
}

export const updateEntry = async (config: ExirdConfig) => {
  const entryFilePath = path.resolve(process.cwd(), config.entry)
  let relativeConfigPath = path.relative(path.dirname(entryFilePath), path.resolve(process.cwd(), "src/config"))

  // Adjust path formatting for forward and backward navigation
  if (!relativeConfigPath.startsWith("..")) {
    relativeConfigPath = "./" + relativeConfigPath.replace(/\\/g, "/")
  } else {
    relativeConfigPath = relativeConfigPath.replace(/\\/g, "/")
  }

  let entryFileContent = await fs.readFile(entryFilePath, "utf-8")

  const importStatement =
    config.language === "TypeScript"
      ? `import config from '${relativeConfigPath}';\n`
      : config.format === "ES6"
        ? `import config from '${relativeConfigPath}.js';\n`
        : `const config = require('${relativeConfigPath}');\n`

  if (!entryFileContent.includes(importStatement)) {
    const lines = entryFileContent.split("\n")
    const lastImportIndex = lines.findIndex((line) => line.startsWith("import") || line.startsWith("const") || line.startsWith("require"))
    lines.splice(lastImportIndex + 1, 0, importStatement)
    entryFileContent = lines.join("\n")
  }

  // Remove the line that assigns a value to PORT (e.g., const PORT = 3000; or const PORT: number = 3000;)
  entryFileContent = entryFileContent.replace(/^\s*const PORT(: number)? = \d+;\s*$/m, "")

  // Update remaining occurrences of PORT to use config.port
  entryFileContent = entryFileContent.replace(/PORT/g, "config.port")

  await fs.writeFile(entryFilePath, entryFileContent)
}
