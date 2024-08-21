#!/usr/bin/env node

import inquirer from 'inquirer';

const questions = [
  {
    type: 'list',
    name: 'language',
    message: 'Which language template would you like to install?',
    choices: ['JavaScript', 'TypeScript'],
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log(`You chose: ${answers.language}`);
});
