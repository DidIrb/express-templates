import fs from "fs-extra"
import path from "path"
import { GenerateWorkflowParams } from "../../types"

export function createWorkflowsFolder(projectPath: string) {
  const workflowsPath = path.join(projectPath, ".exird", "workflows")
  fs.ensureDirSync(workflowsPath)
}

export function generateWorkflow({
  projectPath,
  workflowName,
  steps,
}: GenerateWorkflowParams) {
  const workflowContent = `
steps:
${steps.map((step) => `  - action: ${step}`).join("\n")}
  `
  const workflowsPath = path.join(projectPath, ".exird", "workflows")
  fs.ensureDirSync(workflowsPath)
  fs.writeFileSync(
    path.join(workflowsPath, `${workflowName}.yml`),
    workflowContent,
  )
}
