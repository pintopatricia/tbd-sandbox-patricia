import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { ExchangeBetAvailability, ExchangeRunnersTraded, ExchangeRunnerTraded } from "../index";
import { ExchangeRunners, ExchangeRunner } from "./ExchangeRunner.types";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import URN from "../../layout/URN";
import { ExchangeSide as ExchangeSideType } from "../../betting/exchange-bets/ExchangeBet.types";
import { ExchangeSide } from "../../constants";

/**
 * Selector that for a given runner ID, returns the corresponding runner or undefined if there's none
 */
export const getExchangeRunnerByURN = (exchangeRunners: ExchangeRunners, urn: URN): ExchangeRunner | undefined =>
  exchangeRunners[urn];

export const getExchangeRunnerTradedByURN = (
  exchangeRunnersTraded: ExchangeRunnersTraded,
  urn: URN,
): ExchangeRunnerTraded => exchangeRunnersTraded[urn];

export const createGetExchangeRunnerTradedByURN = () =>
  createSelector(
    [getExchangeRunnerTradedByURN],
    (exchangeRunnerTraded: ExchangeRunnerTraded): ExchangeRunnerTraded => exchangeRunnerTraded,
  );

type ExchangeRunnerOdds = {
  back?: ExchangeBetAvailability[];
  lay?: ExchangeBetAvailability[];
};

export const createExchangeRunnerWithoutOddsByRunnerURNSelector = () =>
  createShallowEqualSelector(
    [
      (excrunners: ExchangeRunners, urn: URN): Omit<ExchangeRunner, "back" | "lay"> | undefined => {
        const runner = excrunners[urn];
        if (runner) {
          const { urn: runnerURN, reduction, date, status, market, selectionId, handicap } = runner;

          return { urn: runnerURN, reduction, date, status, market, selectionId, handicap };
        }

        return undefined;
      },
    ],
    (runnerWithoutOdds) => runnerWithoutOdds,
  );

const areExcRunnerPricesEqual = (price: ExchangeBetAvailability, updatedPrice: ExchangeBetAvailability): boolean => {
  if (
    price.liquidity !== updatedPrice.liquidity ||
    price.marketDepth !== updatedPrice.marketDepth ||
    price.price !== updatedPrice.price
  ) {
    return false;
  }
  return true;
};

const exchangeRunnerHasMaintainedOdds: (runner: ExchangeRunner, updatedRunner: ExchangeRunner) => boolean = (
  runner,
  updatedRunner,
) => {
  if (!runner.back || !updatedRunner.back || runner.back.length !== updatedRunner.back.length) {
    return false;
  }
  for (let index = 0; index < runner.back.length; index += 1) {
    const runnerBack = runner.back[index];
    const updatedRunnerBack = updatedRunner.back[index];

    if (!areExcRunnerPricesEqual(runnerBack, updatedRunnerBack)) {
      return false;
    }
  }

  if (!runner.lay || !updatedRunner.lay || runner.lay.length !== updatedRunner.lay.length) {
    return false;
  }
  for (let index = 0; index < runner.lay.length; index += 1) {
    const runnerLay = runner.lay[index];
    const updatedRunnerLay = updatedRunner.lay[index];

    if (!areExcRunnerPricesEqual(runnerLay, updatedRunnerLay)) {
      return false;
    }
  }

  return true;
};

const exchangeRunnerHasMaintainedBestOdds: (runner: ExchangeRunner, updatedRunner: ExchangeRunner) => boolean = (
  runner,
  updatedRunner,
) => {
  if (runner === updatedRunner) {
    return true;
  }

  if (!runner.back || !updatedRunner.back || !areExcRunnerPricesEqual(runner.back[0], updatedRunner.back[0])) {
    return false;
  }

  if (!runner.lay || !updatedRunner.lay || !areExcRunnerPricesEqual(runner.lay[0], updatedRunner.lay[0])) {
    return false;
  }

  return true;
};

const createExchangeRunnerAllOddsByURNSelector = () =>
  createSelectorCreator(defaultMemoize, exchangeRunnerHasMaintainedOdds)(
    [(excrunner: ExchangeRunner) => excrunner],
    (excrunner: ExchangeRunner) => ({
      back: excrunner.back,
      lay: excrunner.lay,
    }),
  );

const createExchangeRunnerBestOddsByURNSelector = () =>
  createSelectorCreator(defaultMemoize, exchangeRunnerHasMaintainedBestOdds)(
    [(excrunner: ExchangeRunner) => excrunner, (_: ExchangeRunner, side?: ExchangeSideType) => side],
    (excrunner, side) => {
      if (side) {
        if (side === ExchangeSide.BACK) {
          return {
            back: excrunner.back ? [excrunner.back[0]] : [],
            lay: [],
          };
        }
        if (side === ExchangeSide.LAY) {
          return {
            back: [],
            lay: excrunner.lay ? [excrunner.lay[0]] : [],
          };
        }
      }

      return {
        back: excrunner.back ? [excrunner.back[0]] : [],
        lay: excrunner.lay ? [excrunner.lay[0]] : [],
      };
    },
  );

export const createExchangeRunnerOddsByURNSelector = () => {
  type ExchangeRunnerOddsByURNSelectorProps = { urn: URN; bestOdds: boolean; side?: ExchangeSideType };

  const getExchangeRunnerBestOddsByURN = createExchangeRunnerBestOddsByURNSelector();
  const getExchangeRunnerAllOddsByURN = createExchangeRunnerAllOddsByURNSelector();
  const getExchangeRunnerWithoutOddsByRunnerURN = createExchangeRunnerWithoutOddsByRunnerURNSelector();

  return createSelector(
    [
      (excrunners: ExchangeRunners, { urn }: ExchangeRunnerOddsByURNSelectorProps) =>
        // Odds are being removed from this input selector in order to avoid having nested data structures that would keep invalidating reselect's cache.
        // Instead, this first input selector focus on properties other than odds.
        getExchangeRunnerWithoutOddsByRunnerURN(excrunners, urn),
      (excrunners, { urn, bestOdds, side }: ExchangeRunnerOddsByURNSelectorProps): ExchangeRunnerOdds | undefined => {
        // This selector focuses uniquely on the runner odds, where a custom compare function is applied to ensure that cache is invalidated only when there are actual changes in the odds.
        const runner = excrunners[urn];
        if (runner) {
          if (side) {
            return getExchangeRunnerBestOddsByURN(runner, side);
          }
          if (bestOdds) {
            return getExchangeRunnerBestOddsByURN(runner, undefined);
          }

          return getExchangeRunnerAllOddsByURN(runner);
        }

        return undefined;
      },
    ],
    (runner, odds): ExchangeRunner | undefined =>
      runner &&
      odds && {
        ...runner,
        ...odds,
      },
  );
};
