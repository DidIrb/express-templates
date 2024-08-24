import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { ignoreFiles } from './config/ignore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../../../templates');
const destDir = path.resolve(__dirname, '../dist/templates');
const buildFile = path.resolve(__dirname, '../dist/build.js');

const copyTemplates = async (): Promise<void> => {
  try {
    await fs.copy(sourceDir, destDir, {
      filter: (src: string) => !ignoreFiles.includes(path.basename(src))
    });
    console.log(chalk.green('✔'), 'Templates copied successfully!');

    // Remove the build.js file from the dist directory
    await fs.remove(buildFile);
    console.log(chalk.green('✔'), 'build.js removed from dist directory');
  } catch (err) {
    console.error(chalk.red('Error during build process:', err));
  }
};

copyTemplates();
