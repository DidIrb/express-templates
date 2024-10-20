import chalk from "chalk"
import { Listr } from "listr2"
import fs from "fs-extra"
import path from "path"
import { ExirdConfig } from "../../../../types"
import { configPath, execPromise, installDependencies } from "../../shared/utils"

const eslint = {
  name: "eslint",
  description: "Sets up ESLint for linting JavaScript/TypeScript code.",
  execute: async () => {
    console.log(chalk.bold.blue("Running ESLint Setup..."))
    const config: ExirdConfig = fs.readJsonSync(configPath)
    const tasks = new Listr([
      {
        title: "Installing ESLint and necessary plugins",
        task: async () => {
          const devDeps = ["@eslint/js", "globals", "eslint"]

          if (config.language === "TypeScript") {
            devDeps.push("typescript-eslint")
          }

          await installDependencies(config.packageManager, {
            deps: [],
            devDeps: devDeps,
          })
        },
      },
      {
        title: "Creating ESLint config file",
        task: async () => {
          await createEslintConfig(config)
        },
      },
      {
        title: "Updating package.json scripts",
        task: async () => {
          const packageManager = config.packageManager
          await execPromise(`${packageManager} pkg set scripts.lint="eslint ."`)
          await execPromise(`${packageManager} pkg set scripts.lint:fix="eslint . --fix"`)
        },
      },
    ])

    await tasks.run()
    showMsg(config.packageManager)
  },
}

const showMsg = (packageManager: string) => {
  const message = `
ESLint setup is complete!
To lint your project, run: ${chalk.cyan(`${packageManager} run lint`)}
To fix linting issues, run: ${chalk.cyan(`${packageManager} run lint:fix`)}
  `
  console.log(message)
}

const createEslintConfig = async (config: ExirdConfig) => {
  const eslintConfigPath = path.resolve(process.cwd(), config.language === "TypeScript" ? "eslint.config.mjs" : "eslint.config.js")
  let eslintConfigContent = ""

  if (config.language === "TypeScript") {
    eslintConfigContent = `
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { plugins: {}, rules: {} },
  { ignores: ["node_modules", "eslint.config.mjs"] },
];
    `.trim()
  } else if (config.language === "JavaScript" && config.format === "ES6") {
    eslintConfigContent = `
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.{js,mjs,cjs}"] },
  { languageOptions: { sourceType: "module", globals: globals.node } },
  pluginJs.configs.recommended,
  { plugins: {}, rules: {} },
  { ignores: ["node_modules"] },
];
    `.trim()
  } else if (config.language === "JavaScript" && config.format === "CommonJS") {
    eslintConfigContent = `
const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  { files: ["**/*.{js,mjs,cjs}"] },
  { languageOptions: { sourceType: "commonjs", globals: globals.node } },
  pluginJs.configs.recommended,
  { plugins: {}, rules: {} },
  { ignores: ["node_modules"] },
];
    `.trim()
  }

  await fs.writeFile(eslintConfigPath, eslintConfigContent)
}

export default eslint
