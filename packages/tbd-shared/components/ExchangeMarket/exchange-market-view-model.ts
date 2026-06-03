import { getMarketRunnersByDisplayRunners } from "@ppb/tbd-store/helpers/markets";
import { ExchangeBookPercentage } from "@ppb/tbd-store/state/entities/ExchangeBookPercentage.types";
import { ExchangeRunner } from "@ppb/tbd-store/state/entities/exchange-runners/ExchangeRunner.types";
import { MarketRunner } from "@ppb/tbd-store/state/entities/Market.types";
import { calc } from "@ppb/bet-engine";
import { createSelector } from "reselect";
import URN from "@ppb/tbd-store/state/layout/URN";

/**
 * Build the runner prices
 *
 * @param {runner} ExchangeRunner Runner
 *
 * @returns {Object} Runner Prices for Exchange Book Percentage
 */

export const buildRunnersPrices = (runner: ExchangeRunner): ExchangeBookPercentage | undefined => {
  const { back = [], lay = [] } = runner;

  const [backSide] = back;
  const [laySide] = lay;

  if (!backSide || !laySide) {
    return undefined;
  }

  const backPrice = backSide.price;
  const layPrice = laySide.price;

  // Checks if the prices are defined
  const runnerBack = backPrice !== undefined ? backPrice : 0;
  const runnerLay = layPrice !== undefined ? layPrice : 0;

  // Checks if the prices are positive
  const isRunnerBackValid = runnerBack > 0;
  const isRunnerLayValid = runnerLay > 0;

  if (!isRunnerBackValid || !isRunnerLayValid) {
    return undefined;
  }

  const runnersPrices = {
    back: runnerBack,
    lay: runnerLay,
  };

  return runnersPrices;
};

export const createRunnersForExchangeMarketVm = () =>
  createSelector(
    [
      ({ marketRunners }: { marketRunners: MarketRunner[]; displayRunnersUrns: URN[] }) => marketRunners,
      ({ displayRunnersUrns }: { marketRunners: MarketRunner[]; displayRunnersUrns: URN[] }) => displayRunnersUrns,
    ],
    (marketRunners, displayRunnersUrns) => {
      const exhangeMarketRunners = marketRunners || [];
      return getMarketRunnersByDisplayRunners(exhangeMarketRunners, displayRunnersUrns).map((runner) => ({
        urn: runner.urn,
        name: runner.name,
        selectionId: runner.selectionId,
        handicap: runner.handicap,
      }));
    },
  );

export const createBookPercentageForExchangeMarketVm = () =>
  createSelector([(runners: ExchangeRunner[]) => runners], (runners): ExchangeBookPercentage => {
    const runnersPrices = runners.reduce((acc: { [key: number]: ExchangeBookPercentage }, runner: ExchangeRunner) => {
      const runnerPrices = buildRunnersPrices(runner);

      if (runnerPrices === undefined) {
        return acc;
      }

      acc[runner.selectionId] = {
        back: runnerPrices.back,
        lay: runnerPrices.lay,
      };

      return acc;
    }, {});

    return calc.totalBookPercentage(runnersPrices);
  });
