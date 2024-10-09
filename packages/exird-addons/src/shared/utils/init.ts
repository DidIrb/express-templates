import chalk from "chalk"
import path from "path"
import { InitPromptResponse } from "../../types/prompts.js"
import { initPrompt } from "../prompts/init.prompt.js"
import { copyTemplate } from "./copy.js"
import { checkPath } from "./checks.js"

export async function init() {
  try {
    const { projectName, variant }: InitPromptResponse = await initPrompt()

    const projectPath = path.resolve(process.cwd(), projectName)
    await checkPath(projectPath)
    await copyTemplate(variant, projectPath)
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("✖"), "An error occurred:", error.message)
    } else {
      console.log(chalk.red("✖"), "Operation cancelled.")
    }
  }
}

export function handleExit(): void {
  console.log(chalk.red("\n✖"), `Operation canceled.`)
  process.exit(0)
}
