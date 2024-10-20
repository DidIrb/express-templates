import fs from "fs"
import path from "path"
import { DirectoryCheckResult } from "../../../types"

export const checkDirectory = async (dirPath: string): Promise<DirectoryCheckResult> => {
  try {
    const isEmpty = fs.existsSync(dirPath) && fs.readdirSync(dirPath).length === 0
    const packageJsonPath = path.join(dirPath, "package.json")
    const packageJsonExists = fs.existsSync(packageJsonPath)
    const packageJson = packageJsonExists ? await fs.promises.readFile(packageJsonPath, "utf-8").then(JSON.parse) : null

    const hasExpress = packageJson?.dependencies?.express || false
    const moduleSystem = packageJson?.type || null
    const packageManager = packageJson?.packageManager || null
    const hasTypeScript = !!packageJson?.devDependencies?.typescript
    const hasESLint = !!packageJson?.devDependencies?.eslint
    const name = packageJson?.name || null
    const entry = packageJson?.main || null
    const exirdDirPath = path.join(dirPath, ".exird")
    const isExird = fs.existsSync(exirdDirPath)

    // Check for database-related packages
    const dbDependencies = [
      { name: "mongodb", type: "NoSQL" },
      { name: "mysql", type: "SQL" },
      { name: "mysql2", type: "SQL" },
      { name: "pg", type: "SQL" },
    ]

    let database: string | null = null
    let databaseType: string | null = null
    for (const dbDep of dbDependencies) {
      if (packageJson?.dependencies?.[dbDep.name] || packageJson?.devDependencies?.[dbDep.name]) {
        database = dbDep.name
        databaseType = dbDep.type
        break
      }
    }

    const mapperDependencies = ["sequelize", "typeorm", "prisma", "mongoose"]

    let mapper: string | null = null
    for (const mapperDep of mapperDependencies) {
      if (packageJson?.dependencies?.[mapperDep] || packageJson?.devDependencies?.[mapperDep]) {
        mapper = mapperDep
        break
      }
    }

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
      database,
      mapper,
      databaseType,
    }
  } catch (error) {
    console.error("An error occurred!", error)
    throw new Error("Failed to check directory.")
  }
}
