import chalk from 'chalk';
import { program } from 'commander';
import { checkPath, copyTemplate, init } from "exird-addons";
import { readFileSync } from 'fs';
import path from 'path';
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version, '-v, --version', 'output the current version')
    .helpOption('-h, --help', 'display help for command')
    .arguments('[project-name]')
    .option('-t, --typescript', 'Use TypeScript template')
    .option('-j, --javascript', 'Use JavaScript template');

program.parse(process.argv);

const options = program.opts();
const projectName = program.args[0];

(async () => {
    if (!projectName && !options.typescript && !options.javascript) {
        await init();
    } else {
        const template = options.typescript ? 'typescript' : options.javascript ? 'javascript' : null;
        if (!template) {
            console.log(chalk.yellow('No template specified. Use --typescript or --javascript.'));
            process.exit(1);
        }

        const destination = path.resolve(process.cwd(), projectName || 'exirdjs-project');
        await checkPath(destination);
        await copyTemplate(template, destination);
    }
})();
