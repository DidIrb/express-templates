import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"
import { ignoreFiles } from "../../config/ignore.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function copyTemplate(template: string, destination: string) {
  const templatePath = path.resolve(__dirname, "templates", template.toLowerCase())

  try {
    await fs.copy(templatePath, destination, {
      filter: (src) => !ignoreFiles.includes(path.basename(src)),
    })
    printCompletionMessage(destination)
  } catch (error: unknown) {
    handleCopyError(error)
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error && "syscall" in error
}

function handleCopyError(error: unknown) {
  let errorMessage = ""

  if (isNodeError(error)) {
    if (error.code === "EPERM" && error.syscall === "symlink") {
      errorMessage = `${chalk.red("✖")} Operation not permitted. Symbolic links are not supported on this filesystem.`
    } else if (error.code === "ENOENT") {
      errorMessage = `${chalk.red("✖")} Oops, something went wrong. Seems template is unavailable.`
    } else {
      errorMessage = `Error: ${error.message}`
    }
  } else {
    errorMessage = "An unknown error occurred."
  }

  console.error(errorMessage)
}

function printCompletionMessage(destination: string) {
  const message = `${"\n  Scaffolding project in"} ${chalk.cyan(destination)}...
  ${chalk.green("Done. Now run:")}

  ${destination !== process.cwd() ? `${chalk.yellow(`cd ${path.basename(destination)}`)}\n` : ""}
  ${chalk.yellow("1.")} Run ${chalk.cyan("npm install")}.
  ${chalk.yellow("2.")} Run ${chalk.cyan("npm run dev")}.`

  console.log(message)
}
