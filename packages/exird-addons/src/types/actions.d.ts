export interface Action {
  name: string
  description: string
  execute(force: boolean, subActionNames?: string[]): Promise<void>
}

export interface WorkflowStep {
  action: string
}

interface GenerateWorkflowParams {
  projectPath: string
  workflowName: string
  content: string
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
  database: Record<string, string>
}
