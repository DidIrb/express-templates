import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import YAML from "yaml"
import { globalErrorHandler } from "../../config/errorHandler"
import { runActions } from "../actions/shared/actions"
import Enquirer from "enquirer"
import { WorkflowResponse } from "../../types"

export async function promptWorkflowSelection(files: string[]): Promise<string> {
  const enquirer = new Enquirer<WorkflowResponse>()

  const response = await enquirer.prompt({
    type: "select",
    name: "workflow",
    message: "Select a workflow to run:",
    choices: files,
  })

  return response.workflow
}

export const runWorkflow = async (workflowName: string): Promise<void> => {
  const cwd = process.cwd()
  const workflowPaths = [path.join(cwd, `.exird/workflows/${workflowName}.yaml`), path.join(cwd, `.exird/workflows/${workflowName}.yml`)]

  const workflowPath = workflowPaths.find(fs.existsSync)

  if (!workflowPath) {
    console.error(chalk.gray("EXT"), `Workflow "${workflowName}" not found.`)
    return
  }

  try {
    const data = await fs.readFile(workflowPath, "utf8")
    const workflowContent = YAML.parse(data)
    console.log(chalk.bold(`RUNNING ${workflowName.toUpperCase()}\n`))
    for (const step of workflowContent.steps) {
      console.log(chalk.green.underline(`${step.name}`))
      const [action, ...actionArgs] = step.action.split(" ")
      const args = step.args ? step.args.split(" ") : []
      const combinedArgs = [...actionArgs, ...args]
      await runActions(action, { force: false }, combinedArgs)
    }
  } catch (err) {
    globalErrorHandler(err)
  }
}
