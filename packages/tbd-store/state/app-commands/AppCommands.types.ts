export type AppCommand = LoadSbkBetslipCommand;
export type AppCommands = AppCommand[];

export const CMD_LOAD_SBK_BETSLIP = "CMD/LOAD_SBK_BETSLIP";

type Selection = {
  marketUrn: string;
  runnerUrn: string;
};

export type LoadSbkBetslipCommand = {
  name: typeof CMD_LOAD_SBK_BETSLIP;
  args: {
    selections: Selection[];
    isBetSharing: boolean;
  };
};
