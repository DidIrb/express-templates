export interface InitPromptResponse {
  projectName: string
  variant: string
}

export interface PromptResponse {
  language: string
  moduleSystem: string
  useSrcDirectory: boolean
  entryPoint: string
  packageManager: string
  projectName: string
}
