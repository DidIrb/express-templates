#!/usr/bin/env node

import { actionPrompt } from "./shared/prompts/action.js";
import { initPrompt } from "./shared/prompts/init.prompt.js";
import { checkPath } from "./shared/utils/checks.js";
import { copyTemplate } from "./shared/utils/copy.js";
export * from "./shared/utils/init.js";

export { copyTemplate, initPrompt, actionPrompt, checkPath }