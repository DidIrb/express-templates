import chalk from "chalk"
import { program } from "commander"
import { getAction, init } from "exird-addons"
import { readFileSync } from "fs"

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"))

process.on("SIGINT", () => {
  console.log(chalk.red("\nEXT"), "Operation canceled!")
  process.exit(0)
})

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, "-v, --version", "output the current version")
  .helpOption("-h, --help", "display help for command")

program
  .command("init")
  .description("Initialize a new express project")
  .action(() => init())

program
  .command("run <actionName> [subActions...]")
  .description("Run a specified action")
  .option("-f, --force", "force the action to run")
  .allowUnknownOption(true) // Allow unknown options to be passed as arguments
  .action(async (actionName, subActions, options) => {
    const action = getAction(actionName)
    if (action) {
      try {
        await action.execute(options.force, subActions)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log(`Action "${actionName}" not found.`)
    }
  })

program.parse(process.argv)
