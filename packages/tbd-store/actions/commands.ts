import { AppCommands, LoadSbkBetslipCommand } from "../state";

export const COMMANDS__INIT = "COMMANDS/INIT";

export const URL__BETSLIP_DEEPLINK = "URL/BETSLIP_DEEPLINK";

export type CommandsInitAction = {
  type: typeof COMMANDS__INIT;
  payload: AppCommands;
};

export type URLBetslipDeeplinkAction = {
  type: typeof URL__BETSLIP_DEEPLINK;
  payload: LoadSbkBetslipCommand["args"];
};
