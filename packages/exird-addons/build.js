import fs from "fs-extra"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"
import { ignoreFiles } from "./dist/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceDir = path.resolve(__dirname, "../../templates")
const destDir = path.resolve(__dirname, "./dist/templates")

const dtsPath = path.resolve(__dirname, "dist/index.d.ts")

async function generateTypeDefinitions() {
  let output = `declare module 'exird-addons' {\n`

  const content = fs.readFileSync(dtsPath, "utf-8")
  // Remove 'declare ' keyword
  const fixedContent = content.replace(/declare /g, "")
  // Indent each line of the content
  const indentedContent = fixedContent
    .split("\n")
    .map((line) => "  " + line)
    .join("\n")
  output += indentedContent + "\n"

  output += `}\n`

  fs.writeFileSync(dtsPath, output)
  console.log(
    chalk.green("✔"),
    "Type definitions encapsulated in dist/index.d.ts",
  )
}

async function copyTemplates() {
  await fs.copy(sourceDir, destDir, {
    filter: (src) => !ignoreFiles.includes(path.basename(src)),
  })
  console.log(chalk.green("✔"), "Templates copied successfully!")
}

async function build() {
  try {
    await generateTypeDefinitions()
    await copyTemplates()
  } catch (err) {
    console.error(chalk.red("✖"), "Error during build process:", err)
  }
}

build()
