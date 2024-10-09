import Enquirer from "enquirer"

const { prompt } = Enquirer

export async function actionPrompt(choices: string[]): Promise<string> {
  const { action } = await prompt<{ action: string }>([
    {
      type: "select",
      name: "action",
      message: "Current directory is not empty. Please choose how to proceed:",
      choices: choices.map((choice) => ({ name: choice, value: choice })),
    },
  ])
  return action
}
