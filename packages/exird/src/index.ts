import { program } from "commander"
import { getAction, handleExit, init } from "exird-addons"
import { readFileSync } from "fs"

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
)

process.on("SIGINT", handleExit)

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
  .command("run <actionName>")
  .description("Run a specified action")
  .option("-f, --force", "force the action to run")
  .action((actionName, options) => {
    const action = getAction(actionName)
    if (action) {
      action.execute(options.force)
    } else {
      console.log(`Action "${actionName}" not found.`)
    }
  })

program.parse(process.argv)
