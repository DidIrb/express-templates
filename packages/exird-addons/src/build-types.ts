import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typesDir = path.resolve(__dirname, '../src/types');
const outputFile = path.resolve(__dirname, './index.d.ts');
const buildFile = path.resolve(__dirname, './build-types.js');

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

  await fs.remove(buildFile);
  console.log(chalk.green('✔'), 'build-types.mjs removed from dist directory');
}

generateTypeDefinitions().catch(err => {
  console.error(chalk.red('✖'), 'Error generating type definitions:', err);
});
