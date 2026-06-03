import { ApplicationState } from "@ppb/tbd-store";
import { createGetExchangeMarketByMarketIdSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { getExchangeRunnerTree } from "@ppb/tbd-store/state/entities/entities-selectors";

const getExchangeMarketByMarketId = createGetExchangeMarketByMarketIdSelector();

/**
 * Builds the inline exchange betslip title by joining the market name and runner name with " - ".
 *
 * Resolves the runner URN from `appState.betslip.exchangeReport`, looks up the
 * corresponding runner tree and exchange market, then returns a title such as
 * `"Match Odds - Team A"`. Returns an empty string when neither name is available.
 *
 * @param appState - The full application state.
 * @returns A formatted title in the form "MarketName - RunnerName", or a partial/empty string
 *          if either piece of data is missing.
 */
export const getInlineBetslipTitle = (appState: ApplicationState): string => {
  const runnerUrn = appState.betslip?.exchangeContext?.runner ?? "";
  const runnerTree = getExchangeRunnerTree(appState.entities, runnerUrn);

  const marketId = runnerTree?.market.marketId ?? "";
  const runners = runnerTree?.market.runners ?? [];

  const runnerName = runners.find((item) => item.urn === runnerUrn)?.name;
  const marketName = getExchangeMarketByMarketId(appState.entities.exchangemarkets ?? {}, marketId)?.name;

  return [marketName, runnerName].filter(Boolean).join(" - ");
};
