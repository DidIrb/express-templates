export interface DirectoryCheckResult {
  isEmpty: boolean
  packageJsonExists: boolean
  hasExpress: boolean
  moduleSystem: string | null
  packageManager: string | null
  hasTypeScript: boolean
  hasESLint: boolean
  name: string | null
  entry: string | null
  isExird: boolean
}
