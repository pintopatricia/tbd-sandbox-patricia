import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { MarketRunner, ExchangeMarket, ExchangeMarkets, ExchangeRunner, ExchangeRunners } from "../index";
import { MarketId } from "../Common.types";
import { ApplicationState } from "../../ApplicationState.types";
import { exchangeRunnerHasUpdates, exchangeRunnerPricesHasUpdates } from "../../../helpers/market-runners";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import { isCompetitionEventHierarchy } from "../../../helpers/markets";
import URN from "../../layout/URN";

export const getExchangeMarkets = (state: ApplicationState): ExchangeMarkets | undefined =>
  state.entities?.exchangemarkets;

export const createGetExchangeMarketByHierarchySelector = () =>
  createShallowEqualSelector(
    [
      (state: ExchangeMarkets) => state,
      (_: ExchangeMarkets, { sporteventURN }: { sporteventURN: URN }) => sporteventURN,
      (_: ExchangeMarkets, { competitionURN }: { competitionURN: URN }) => competitionURN,
    ],
    (exchangemarkets, sporteventURN, competitionURN) =>
      Object.values(exchangemarkets).find(
        (exchangeMarket) =>
          isCompetitionEventHierarchy(exchangeMarket.hierarchy) &&
          exchangeMarket.hierarchy.sportevent === sporteventURN &&
          exchangeMarket.hierarchy.competition === competitionURN,
      ),
  );

export const createExchangeMarketsSelector = () =>
  createShallowEqualSelector(
    [(state: ApplicationState) => state.entities.exchangemarkets],
    (exchangeMarkets): ExchangeMarkets => exchangeMarkets,
  );

/**
 * For a given market URN, returns the corresponding market or undefined if there's none
 */
export const createExchangeMarketSelector = () =>
  createShallowEqualSelector(
    (exchangeMarkets: ExchangeMarkets, urn: URN) => exchangeMarkets[urn],
    (exchangeMarket): ExchangeMarket | undefined => exchangeMarket,
  );

/**
 * Selector that for a given market id, returns the corresponding market or undefined if there's none
 */
export const createGetExchangeMarketByMarketIdSelector = () =>
  createShallowEqualSelector(
    (exchangeMarkets: ExchangeMarkets) => exchangeMarkets,
    (_: ExchangeMarkets, marketId: MarketId) => marketId,
    (exchangeMarkets, marketId) =>
      Object.values(exchangeMarkets).find(({ marketId: currentMarketId }) => marketId === currentMarketId),
  );

/**
 * For a given market, and runner urn, returns the respective MarketRunner from that market
 */
export const getExchangeMarketRunnerByURN = (exchangeMarket: ExchangeMarket, urn: URN): MarketRunner | undefined => {
  const { runners } = exchangeMarket;

  return runners.find((runner) => runner.urn === urn);
};

/**
 * Given two arrays of exchange runners, it checks if there are updates (number of runners, prices, etc)
 *
 * @param runners1
 * @param runners2
 * @returns {boolean} true if the new runners array contains updates
 */
const hasChangedExchangeMarketRunners: (runners1: ExchangeRunner[], runners2: ExchangeRunner[]) => boolean = (
  runners1,
  runners2,
) => {
  if (runners1.length !== runners2.length) {
    return false;
  }

  const runnerWithChanges = runners1.find((runner, index) => exchangeRunnerHasUpdates(runner, runners2[index]));

  if (runnerWithChanges) {
    return false;
  }

  return true;
};

/**
 * Selector to get the prices for the runners of a given exchange market
 *
 * @param state Application state
 * @param marketURN Market identifier
 * @returns {ExchangeRunner[]} Runners Prices for exchange market
 */
function getExchangeMarketRunnersPrices(exchangerunners: ExchangeRunners, marketURN: URN): ExchangeRunner[] {
  return Object.values(exchangerunners).filter((runner) => runner.market === marketURN);
}

/**
 * For a given market URN, returns the corresponding market runners or empty if there's none
 */
export const createExchangeMarketRunnersSelector = () =>
  createSelector(
    (exchangeMarkets: ExchangeMarkets, urn: URN) => exchangeMarkets[urn]?.runners,
    (runners = []) => runners,
  );

/**
 * Creates a selector to get runners prices for an exchange market
 * Best prices for exchange market are at position 0 in runners bet availability array (Back/Lay)
 */
export const createRunnersBestPricesForExchangeMarketSelector = () =>
  createSelectorCreator(defaultMemoize, hasChangedExchangeMarketRunners)(
    (exchangeRunners: ExchangeRunners, marketURN: URN): ExchangeRunner[] => {
      const runners: ExchangeRunner[] = Object.values(exchangeRunners)
        .filter((runner) => runner.market === marketURN)
        .map((runner) => {
          const back = {
            liquidity: runner.back?.[0]?.liquidity,
            marketDepth: runner.back?.[0]?.marketDepth,
            price: runner.back?.[0]?.price,
          };
          const lay = {
            liquidity: runner.lay?.[0]?.liquidity,
            marketDepth: runner.lay?.[0]?.marketDepth,
            price: runner.lay?.[0]?.price,
          };
          return {
            ...runner,
            back: [back],
            lay: [lay],
          };
        });
      return runners;
    },
    (runners: ExchangeRunner[]) => runners,
  );

/**
 * Given two arrays of exchange runners, it checks if the prices value remains the same
 *
 * @param runners1
 * @param runners2
 * @returns {boolean} true if the new runners array contains the same prices as previously
 */
const hasSameExchangeMarketRunnersPrices: (runners1: ExchangeRunner[], runners2: ExchangeRunner[]) => boolean = (
  runners1,
  runners2,
) => {
  if (runners1.length !== runners2.length) {
    return false;
  }

  return !runners1.find((runner, index) => exchangeRunnerPricesHasUpdates(runner, runners2[index]));
};

/**
 * Creates a selector to get runners prices for an exchange market
 */
export const createRunnersPricesForExchangeMarketSelector = () =>
  createSelectorCreator(defaultMemoize, hasChangedExchangeMarketRunners)(
    getExchangeMarketRunnersPrices,
    (runners: ExchangeRunner[]) => runners,
  );

/**
 * Creates a selector to get runners for book percentage calculation
 */
export const createRunnersForBookPercentageSelector = () =>
  createSelectorCreator(defaultMemoize, hasSameExchangeMarketRunnersPrices)(
    getExchangeMarketRunnersPrices,
    (runners: ExchangeRunner[]) => runners,
  );

export const createExchangeMarketRunnerByMarketAndRunnerURNsSelector = () => {
  type ExchangeMarketRunnerByMarketAndRunnerURNsProps = { marketURN: URN; runnerURN: URN };
  const getExchangeMarketByURN = createExchangeMarketSelector();

  return createSelector(
    [
      (exchangemarkets: ExchangeMarkets, { marketURN }: ExchangeMarketRunnerByMarketAndRunnerURNsProps) =>
        getExchangeMarketByURN(exchangemarkets, marketURN),
      (_: ExchangeMarkets, props: ExchangeMarketRunnerByMarketAndRunnerURNsProps) => props.runnerURN,
    ],
    (market, runnerURN) => market?.runners.find((runner) => runner.urn === runnerURN),
  );
};
