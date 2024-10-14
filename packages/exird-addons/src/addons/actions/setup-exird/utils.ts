import path from "path"
import fs from "fs-extra"
import { DirectoryCheckResult } from "../../../types/checks"

export const checkDirectory = async (dirPath: string): Promise<DirectoryCheckResult> => {
  try {
    const isEmpty = fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0
    const packageJsonPath = path.join(dirPath, "package.json")
    const packageJsonExists = fs.existsSync(packageJsonPath)
    const packageJson = packageJsonExists ? await fs.readJson(packageJsonPath) : null

    const hasExpress = packageJson?.dependencies?.express || false
    const moduleSystem = packageJson?.type || null
    const packageManager = packageJson?.packageManager || null
    const hasTypeScript = !!packageJson?.devDependencies?.typescript
    const hasESLint = !!packageJson?.devDependencies?.eslint
    const name = packageJson?.name || null
    const entry = packageJson?.main || null

    const exirdDirPath = path.join(dirPath, ".exird")
    const isExird = fs.existsSync(exirdDirPath)

    return {
      isEmpty,
      packageJsonExists,
      hasExpress,
      moduleSystem,
      packageManager,
      hasTypeScript,
      hasESLint,
      name,
      entry,
      isExird,
    }
  } catch (error) {
    console.error("An error occurred!", error)
    throw new Error("Failed to check directory.")
  }
}
