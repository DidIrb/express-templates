import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ignoreFiles } from '../config/ignore.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(variant: string, projectPath: string) {
  const templatePath = path.resolve(__dirname, '../../../../templates', variant.toLowerCase());

  try {
    await fs.copy(templatePath, projectPath, {
      filter: (src) => {
        const basename = path.basename(src);
        return !ignoreFiles.includes(basename);
      }
    });
    printCompletionMessage(projectPath);
  } catch (error: any) {
    if (error.code === 'EPERM' && error.syscall === 'symlink') {
      console.error('Error: Operation not permitted. Symbolic links are not supported on this filesystem.');
    } else {
      console.error('Error:', error);
    }
  }
}

function printCompletionMessage(projectPath: string) {
  console.log(`\nScaffolding project in ${projectPath}...`);
  console.log('Done. Now run:');
  if (projectPath !== process.cwd()) {
    console.log(`  cd ${path.basename(projectPath)}`);
  }
  console.log('   npm install');
  console.log('   npm run dev');
}
