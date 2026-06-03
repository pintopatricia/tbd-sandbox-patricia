import { ApplicationState } from "../ApplicationState.types";
import { BetslipType } from "../constants";
import { getObbBettingLegs } from "./obb-betting/obb-betting-selectors";
import { getSportsbookBettingLegs } from "./sportsbook-betting/sportsbook-betting-selectors";

// TODO: improve getActiveBetslipType to deal with other possibilities than SPORTSBOOK as else case
export const getActiveBetslipType = (state: ApplicationState) => {
  const isNonEmptyObject = (obj: object) => obj && Object.keys(obj).length > 0;
  if (state.betslip?.step === "REPORT") {
    if (state.betslip.obbReport) {
      return BetslipType.OBB;
    }

    if (state.betslip.sportsbookReport) {
      return BetslipType.SPORTSBOOK;
    }
  }

  if (isNonEmptyObject(getObbBettingLegs(state))) {
    return BetslipType.OBB;
  }

  if (isNonEmptyObject(getSportsbookBettingLegs(state))) {
    return BetslipType.SPORTSBOOK;
  }

  return null;
};
