import { AppCommands } from "../state";

import { resolveBetslipDeepLinking } from "./deep-linking-resolver";

export function resolveAppCommands(errorLogFn: (error: string) => void, currentUrl: string | null): AppCommands {
  const commands = [];

  const deepLinkingCommand = resolveBetslipDeepLinking(currentUrl, errorLogFn);
  if (deepLinkingCommand) {
    commands.push(deepLinkingCommand);
  }

  return commands;
}
