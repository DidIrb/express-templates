import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ignoreFiles } from '../config/ignore.js';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(template: string, destination: string) {
  const templatePath = path.resolve(__dirname, '../templates', template.toLowerCase());

  try {
    await fs.copy(templatePath, destination, {
      // JUST INCASE WE WANT TO IGNORE FILES
      filter: (src) => !ignoreFiles.includes(path.basename(src))
    });
    printCompletionMessage(destination);
  } catch (error: any) {
    handleCopyError(error);
  }
}

function handleCopyError(error: any) {
  if (error.code === 'EPERM' && error.syscall === 'symlink') {
    console.error(chalk.red('✖'), 'Operation not permitted. Symbolic links are not supported on this filesystem.');
  } else if (error.code === 'ENOENT') {
    console.error(chalk.red('✖'), 'Oops, something went wrong. Seems template is unavailable.');
  } else {
    console.error('Error:', error);
  }
}

function printCompletionMessage(destination: string) {
  console.log(`\nScaffolding project in ${destination}...`);
  console.log('Done. Now run:\n');
  if (destination !== process.cwd()) {
    console.log(`   cd ${path.basename(destination)}`);
  }
  console.log('   npm install');
  console.log('   npm run dev');
}
