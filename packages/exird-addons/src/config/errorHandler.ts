import chalk from "chalk"

export class CustomError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "CustomError"
  }
}

export function globalErrorHandler(error: unknown) {
  if (error === "") {
    console.log(chalk.gray("EXT"), "Operation canceled!")
    process.exit(0)
  } else if (error instanceof CustomError) {
    console.error(chalk.red("ERR"), `Code: ${error.code}, Message: ${error.message}`)
  } else if (error instanceof Error) {
    console.error(chalk.red("ERR"), error.message)
  } else {
    console.error(chalk.red("ERR"), "An unknown error occurred.", JSON.stringify(error))
  }
}
