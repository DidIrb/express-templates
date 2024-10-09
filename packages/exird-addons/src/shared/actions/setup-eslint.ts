// import fs from 'fs-extra';
// import path from 'path';
// import { execSync } from 'child_process';
// import chalk from 'chalk';
// import { Action } from '../types/actions';
// import { getPackageManager, getLanguage, getCodingStyle } from '../shared/prompts/action';

// export const setupEslint: Action = {
//   name: 'setup-eslint',
//   description: 'Sets up ESLint with specified configurations',
//   async execute() {
//     const projectPath = process.cwd();

//     // Get shared configurations
//     const packageManager = await getPackageManager();
//     const language = await getLanguage();
//     const codingStyle = await getCodingStyle();

//     // Check if package.json exists
//     if (!fs.existsSync(path.join(projectPath, 'package.json'))) {
//       console.log(chalk.red('No package.json found. Initializing a new project...'));
//       execSync(`${packageManager} init -y`, { cwd: projectPath, stdio: 'inherit' });
//     }

//     // Install ESLint and related packages
//     console.log(chalk.blue('Installing ESLint and related packages...'));
//     execSync(`${packageManager} install eslint @eslint/js globals --save-dev`, { cwd: projectPath, stdio: 'inherit' });

//     // Create ESLint configuration
//     const eslintConfig = `
// import globals from "globals";
// import pluginJs from "@eslint/js";

// export default [
//   {
//     languageOptions: {
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//       },
//     },
//   },
//   pluginJs.configs.recommended,
//   {
//     rules: {},
//   },
// ];
//     `;
//     fs.writeFileSync(path.join(projectPath, 'eslint.config.mjs'), eslintConfig);

//     console.log(chalk.green('ESLint setup complete.'));
//   }
// };
