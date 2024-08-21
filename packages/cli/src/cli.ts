#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  {
    type: 'list',
    name: 'language',
    message: 'Which language template would you like to install?',
    choices: ['JavaScript', 'TypeScript'],
  },
];

inquirer.prompt(questions).then((answers) => {
  const templateDir = path.resolve(__dirname, '../../../templates', answers.language.toLowerCase());
  const targetDir = process.cwd();

  if (answers.language === 'JavaScript' || answers.language === 'TypeScript') {
    copyTemplate(templateDir, targetDir);
  } else {
    console.log(`Template for ${answers.language} is not yet implemented.`);
  }
});

function copyTemplate(src: string, dest: string) {
  fs.copy(src, dest, {
    filter: (src, dest) => {
      return !src.includes('node_modules');
    }
  })
  .then(() => console.log('Template copied successfully!'))
  .catch(err => console.error('Error copying template:', err));
}
