export interface Action {
  name: string
  description: string
  execute(force: boolean): Promise<void>
}

export interface WorkflowStep {
  action: string
}

export interface GenerateWorkflowParams {
  projectPath: string
  workflowName: string
  steps: string[]
}
