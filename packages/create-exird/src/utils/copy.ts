import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import boxen, { Options } from 'boxen';
import { ignoreFiles } from '../config/ignore.js';

// Resolve __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to copy template files to the destination directory
export async function copyTemplate(template: string, destination: string) {
  const templatePath = path.resolve(__dirname, '../templates', template.toLowerCase());

  try {
    await fs.copy(templatePath, destination, {
      // Ignore specified files during the copy process
      filter: (src) => !ignoreFiles.includes(path.basename(src)),
    });
    printCompletionMessage(destination);
  } catch (error: any) {
    handleCopyError(error);
  }
}

// Function to handle errors during the copy process
function handleCopyError(error: any) {
  let errorMessage = '';

  if (error.code === 'EPERM' && error.syscall === 'symlink') {
    errorMessage = `${chalk.red('✖')} Operation not permitted. Symbolic links are not supported on this filesystem.`;
  } else if (error.code === 'ENOENT') {
    errorMessage = `${chalk.red('✖')} Oops, something went wrong. Seems template is unavailable.`;
  } else {
    errorMessage = `Error: ${error.message}`;
  }

  const boxenOptions: Options = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'red',
  };

  console.log(boxen(chalk.red(errorMessage), boxenOptions));
}

// Function to print a completion message after scaffolding the project
function printCompletionMessage(destination: string) {
  const message = `${chalk.green('Scaffolding project in')} ${chalk.cyan(destination)}...
${chalk.green('Done. Now run:')}

${destination !== process.cwd() ? `${chalk.yellow(`cd ${path.basename(destination)}`)}\n` : ''}
${chalk.yellow('1.')} Run ${chalk.cyan('npm install')} to install dependencies.
${chalk.yellow('2.')} Run ${chalk.cyan('npm run build')} to build the project.`;

  const boxenOptions: Options = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
  };

  console.log(boxen(message, boxenOptions));
}
