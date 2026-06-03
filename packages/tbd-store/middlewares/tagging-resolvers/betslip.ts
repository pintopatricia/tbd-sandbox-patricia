import { BetslipSubType } from "../../state";

export const BETSLIP_TYPE_TAG: Record<BetslipSubType, string> = {
  EXCHANGE: "exchange betslip",
  SPORTSBOOK_SINGLES: "sportsbook betslip",
  SPORTSBOOK_MULTIPLES: "multiples betslip",
} as const;
