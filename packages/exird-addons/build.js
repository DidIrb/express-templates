import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { ignoreFiles } from './dist/config/ignore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesDir = path.resolve(__dirname, './src/types');
const outputFile = path.resolve(__dirname, './dist/index.d.ts');
const sourceDir = path.resolve(__dirname, '../../templates');
const destDir = path.resolve(__dirname, './dist/templates');

async function generateTypeDefinitions() {
  let output = `declare module 'exird-addons' {\n`;

  fs.readdirSync(typesDir).forEach(file => {
    const filePath = path.join(typesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    output += content + '\n';
  });

  output += `}\n`;

  fs.writeFileSync(outputFile, output);
  console.log(chalk.green('✔'), 'Type definitions generated in dist/index.d.ts');
}

async function copyTemplates() {
  await fs.copy(sourceDir, destDir, {
    filter: (src) => !ignoreFiles.includes(path.basename(src))
  });
  console.log(chalk.green('✔'), 'Templates copied successfully!');
}

async function build() {
  try {
    await generateTypeDefinitions();
    await copyTemplates();
  } catch (err) {
    console.error(chalk.red('✖'), 'Error during build process:', err);
  }
}

build();
