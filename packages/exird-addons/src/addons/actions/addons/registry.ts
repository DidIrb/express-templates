import { normalizeName } from "../shared/utils"
import eslint from "./sub-actions/eslint"
import setupEnv from "./sub-actions/setup-env"

// ACTIONS TO ADD, HUSKY, PRETTIER, COMMITLINT, COMMITIZEN, LINT-STAGED,
interface SubAction {
  name: string
  description: string
  execute: () => Promise<void>
}

const registerSubActions = (): { [key: string]: SubAction } => {
  const subActionsModules: SubAction[] = [setupEnv, eslint]

  const subActions: { [key: string]: SubAction } = {}
  subActionsModules.forEach((subAction) => {
    const normalizedName = normalizeName(subAction.name)
    subActions[normalizedName] = subAction
    subActions[`setup-${normalizedName}`] = subAction
    subActions[`--${normalizedName}`] = subAction
    subActions[`-${normalizedName}`] = subAction
  })

  return subActions
}

export default registerSubActions
