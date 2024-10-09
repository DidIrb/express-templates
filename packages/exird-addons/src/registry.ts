import { Action } from "./types/actions"

const actions: { [key: string]: Action } = {}

export function register(action: Action) {
  actions[action.name] = action
}

export function getAction(name: string): Action | undefined {
  return actions[name]
}

export function listActions(): string[] {
  return Object.keys(actions)
}
