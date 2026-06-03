import { createSelector, OutputParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { SportsbookBet, SportsbookBets } from "./SportsbookBet.types";
import { BetMutationEligibilityType } from "../../../clients/catalogue/catalogue-response-types";

export const createSportsbookBetSelector = (): OutputParametricSelector<
  SportsbookBets,
  string,
  SportsbookBet | undefined,
  (res1: SportsbookBets, res2: string) => SportsbookBet | undefined
> =>
  createSelector(
    [(sportsbookBets: SportsbookBets) => sportsbookBets, (_: SportsbookBets, betURN: URN) => betURN],
    (sportsbookBets, betURN): SportsbookBet | undefined => sportsbookBets[betURN],
  );

export const createSportsbookBetByBetReceiptIdSelector = () =>
  createSelector(
    [(sportsbookBets: SportsbookBets) => sportsbookBets, (_: SportsbookBets, betId: string) => betId],
    (sportsbookBets, betReceiptId): SportsbookBet | undefined =>
      Object.values(sportsbookBets).find((bet) => bet.betReceiptId === betReceiptId),
  );

export const createIsAccaFreezeEligibleSelector = () =>
  createSelector(
    [(sportsbookBets: SportsbookBets) => sportsbookBets, (_: SportsbookBets, betURN: URN) => betURN],
    (sportsbookBets, betURN): boolean =>
      Boolean(
        sportsbookBets[betURN].mutations?.eligibility?.some(
          (el) => el?.mutation === BetMutationEligibilityType.AccaFreeze,
        ),
      ),
  );
