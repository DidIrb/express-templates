export interface Action {
  name: string
  description: string
  execute(force: boolean, subActionNames?: string[]): Promise<void>
}

export interface WorkflowStep {
  action: string
}

export interface GenerateWorkflowParams {
  projectPath: string
  workflowName: string
  steps: string[]
}

export interface ExirdConfig {
  packageManager: string
  language: string
  entry: string
  format: string
  name: string
  exird: boolean
  actions: string[]
  addons: Record<string, string>
}
