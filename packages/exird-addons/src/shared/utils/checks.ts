import fs from "fs-extra"
import { actionPrompt } from "../prompts/action.js"
import chalk from "chalk"

export const checkPath = async (path: string) => {
  try {
    if (fs.existsSync(path) && fs.readdirSync(path).length > 0) {
      const choices = [
        "Remove existing files and continue",
        "Cancel operation",
        "Ignore files and continue",
      ]

      const action = await actionPrompt(choices)
      const actionIndex = choices.indexOf(action)

      if (actionIndex === 1) {
        console.log(chalk.red("✖"), "Operation cancelled.")
        process.exit(0)
      } else if (actionIndex === 0) {
        await fs.emptyDir(path)
      }
      // No need to handle 'Ignore files and continue' as it will just proceed
    }
  } catch (error) {
    console.log("an error occured!", error)
  }
}
