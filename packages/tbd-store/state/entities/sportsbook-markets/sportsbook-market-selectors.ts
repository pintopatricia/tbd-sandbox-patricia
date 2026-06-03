import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { generateRunnerId } from "@ppb/betslip-core";
import { SportsbookMarket, SportsbookMarkets } from "./SportsbookMarket.types";
import { MarketRunner, SportsbookRunner } from "../index";
import { MarketId, SelectionId } from "../Common.types";
import { ApplicationState } from "../../ApplicationState.types";

import { sportsbookRunnerStatusHasUpdates } from "../../../helpers/market-runners";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import { isCompetitionEventHierarchy } from "../../../helpers/markets";
import URN from "../../layout/URN";
import { SportsbookBettingState } from "../../betting/sportsbook-betting/SportsbookBetting.types";
import { isSingleLegInState } from "../../../helpers/sportsbook-betting";

export const getSportsbookMarkets = (state: ApplicationState): SportsbookMarkets | undefined =>
  state.entities?.sportsbookmarkets;

export const createGetSportsbookMarketByHierarchySelector = () =>
  createShallowEqualSelector(
    [
      (state: SportsbookMarkets) => state,
      (_: SportsbookMarkets, { sporteventURN }: { sporteventURN: URN }) => sporteventURN,
      (_: SportsbookMarkets, { competitionURN }: { competitionURN: URN }) => competitionURN,
    ],
    (sportsbookmarkets, sporteventURN, competitionURN) =>
      Object.values(sportsbookmarkets).find(
        (sportsbookmarket) =>
          isCompetitionEventHierarchy(sportsbookmarket.hierarchy) &&
          sportsbookmarket.hierarchy.sportevent === sporteventURN &&
          sportsbookmarket.hierarchy.competition === competitionURN,
      ),
  );

/**
 * TODO: MEMOIZATION
 * DEPRECATED! Please use createSportsbookMarketByURNSelector instead.
 * This selector is being deprecated because does not provide memoization and does not follow the current guidelines.
 *
 * For a given market ID, returns the corresponding market or undefined if there's none
 */
export const getSportsbookMarketByURN = (state: SportsbookMarkets, urn: URN): SportsbookMarket | undefined =>
  state[urn];

/**
 * Selector that for a given market id, returns the corresponding market or undefined if there's none
 */
export const getSportsbookMarketById = (state: SportsbookMarkets, marketId: MarketId): SportsbookMarket | undefined =>
  Object.values(state).find(({ marketId: currentMarketId }) => marketId === currentMarketId);

/**
 * For a given market, and runner urn, returns the respective MarketRunner from that market
 */
export const getSportsbookMarketRunnerByURN = (state: SportsbookMarket, urn: URN): MarketRunner | undefined => {
  const { runners } = state;

  return runners.find((runner) => runner.urn === urn);
};

/**
 * Selector that for a given runner URN, returns the corresponding runner or undefined if there's none
 */
export const getSportsbookMarketRunnerById = (
  runners: MarketRunner[],
  selectionId: SelectionId,
): MarketRunner | undefined =>
  runners.find(({ selectionId: currentSelectionId }) => selectionId === currentSelectionId);

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------

export const createSportsbookMarketByURNSelector = () =>
  createShallowEqualSelector(
    [(sportsbookmarkets: SportsbookMarkets, urn: URN): SportsbookMarket | undefined => sportsbookmarkets[urn]],
    (sportsbookmarket) => sportsbookmarket,
  );

/**
 * Selector to get a specific sportsbook market
 *
 * @param state Application state
 * @param marketURN Market identifier
 * @returns {SportsbookMarket} Sportsbook Market
 */
export const getSportsbookMarket = (state: ApplicationState, marketURN: URN): SportsbookMarket =>
  state.entities.sportsbookmarkets[marketURN];

const marketStatusDidntChange: (previousMarket: SportsbookMarket, currentMarket: SportsbookMarket) => boolean = (
  previousMarket,
  currentMarket,
) => previousMarket.status === currentMarket.status;

export const createSportsbookMarketSelector = () =>
  // "any" reason:  https://github.com/reduxjs/reselect/issues/384
  createSelectorCreator(defaultMemoize, marketStatusDidntChange)(
    getSportsbookMarket,
    (sportsbookmarket: SportsbookMarket) => sportsbookmarket,
  );

/**
 * Selector to get the runners of a given sportsbook market
 *
 * @param state Application state
 * @param marketURN Market identifier
 * @returns {MarketRunner[]} Runners for sportsbook market
 */
export const getSportsbookMarketRunners = (state: ApplicationState, marketURN: URN): MarketRunner[] =>
  state.entities.sportsbookmarkets[marketURN].runners;

const getSportsbookRunnersByMarketUrn = (state: ApplicationState, marketURN: URN): SportsbookRunner[] =>
  Object.values(state.entities.sportsbookrunners).filter((runner) => runner.market === marketURN);

const hasChangedSportsbookRunnersStatus: (runners1: SportsbookRunner[], runners2: SportsbookRunner[]) => boolean = (
  runners1,
  runners2,
) => {
  if (runners1.length !== runners2.length) {
    return false;
  }

  const runnerWithChanges = runners1.find((runner, index) => sportsbookRunnerStatusHasUpdates(runner, runners2[index]));

  if (runnerWithChanges) {
    return false;
  }

  return true;
};

export const createSportsbookRunnersByMarketURNSelector = () =>
  createSelectorCreator(defaultMemoize, hasChangedSportsbookRunnersStatus)(
    getSportsbookRunnersByMarketUrn,
    (runners: SportsbookRunner[]) => runners,
  );

/**
 * Given the market and selection id, check if there's SBK Legs available
 *
 * @param {URN} marketURN The market URN
 * @param {number} selectionId The selection ID
 * @param {SportsbookBettingState} sportsbookBettingState The SBK betting state in the store
 *
 * @returns {Boolean} Availability of the Leg for specified runner
 */
export function isLegInState(
  marketURN: URN,
  selectionId: number,
  sportsbookBettingState: SportsbookBettingState,
): boolean {
  const marketId = marketURN.split(":").pop() || ""; // market id is the last part of the URN (parts separated by `:`)
  const runnerTuple = [generateRunnerId({ marketId, selectionId })];

  return isSingleLegInState(sportsbookBettingState, runnerTuple);
}

/**
 * For a given market, and runner urn, returns the respective MarketRunner from that market
 */
type SbkMarketRunnerByRunnerAndMarketURNSelectorProps = { marketUrn: URN; runnerUrn: URN };
export const createSportsbookMarketRunnerByRunnerAndMarketURNSelector = () => {
  const getSbkMarketByURN = createSportsbookMarketByURNSelector();

  return createSelector(
    [
      (markets: SportsbookMarkets, { marketUrn }: SbkMarketRunnerByRunnerAndMarketURNSelectorProps) =>
        getSbkMarketByURN(markets, marketUrn),
      (_: SportsbookMarkets, { runnerUrn }: SbkMarketRunnerByRunnerAndMarketURNSelectorProps) => runnerUrn,
    ],
    (market, runnerUrn): MarketRunner | undefined => market?.runners.find((runner) => runner.urn === runnerUrn),
  );
};
