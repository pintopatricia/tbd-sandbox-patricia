import { AppCommands, CMD_LOAD_SBK_BETSLIP } from "../app-commands";

import { BootState } from "./BootState.types";

export const buildBootInitialState = (bootState: BootState, appCommands?: AppCommands): BootState => {
  const allowLoadFromStorage = !appCommands || !appCommands.some((cmd) => cmd.name === CMD_LOAD_SBK_BETSLIP);

  return {
    ...bootState,
    allowLoadFromStorage,
  };
};
