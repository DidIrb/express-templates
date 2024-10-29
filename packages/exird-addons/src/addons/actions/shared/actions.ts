import chalk from "chalk"
import { getAction } from "../../../registry"

export const runActions = async (actionName: string, options: { force?: boolean }, subActions: string[]) => {
  const action = getAction(actionName)
  if (action) {
    try {
      await action.execute(options.force ?? false, subActions)
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log(chalk.gray("EXT"), `Action "${actionName}" not found.`)
  }
}
