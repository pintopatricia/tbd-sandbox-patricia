import { createSelector, OutputParametricSelector } from "reselect";
import { BetLeg, BetLegs } from "../../betting/sportsbook-bets/SportsbookBet.types";
import URN from "../../layout/URN";
import { BetLegMutationType } from "../../../clients/catalogue/catalogue-response-types";

export const createSportsbookBetLegSelector = (): OutputParametricSelector<
  BetLegs,
  string,
  BetLeg | undefined,
  (res1: BetLegs, res2: string) => BetLeg | undefined
> =>
  createSelector(
    [(betLegs: BetLegs) => betLegs, (_: BetLegs, betURN: URN) => betURN],
    (betLegs, betURN): BetLeg | undefined => betLegs[betURN],
  );

export const createSportsbookBetLegsSelector = (): OutputParametricSelector<
  BetLegs,
  string[],
  BetLeg[],
  (res1: BetLegs, res2: string[]) => BetLeg[]
> =>
  createSelector(
    [(betLegs: BetLegs) => betLegs, (_: BetLegs, betLegURNs: URN[]) => betLegURNs],
    (betLegs, betLegURNs): BetLeg[] => betLegURNs.map((betURN) => betLegs[betURN]).filter((leg) => leg !== undefined),
  );

export const createAccaFreezeEligibleLegsSelector = () =>
  createSelector([createSportsbookBetLegsSelector()], (betLegs): BetLeg[] =>
    betLegs.filter(
      (betLeg) =>
        betLeg.mutations?.eligibility?.some(
          (el) => el?.mutation === BetLegMutationType.AccaFreeze && el.mutationAvailability === "Available",
        ),
    ),
  );

export const createIsBetFrozenSelector = () =>
  createSelector([createSportsbookBetLegsSelector()], (betLegs): boolean =>
    betLegs.some((leg) => leg.mutations?.details?.some((detail) => detail?.freezeDetails)),
  );
