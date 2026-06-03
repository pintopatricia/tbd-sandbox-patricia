import {
  createSportsbookMarketByURNSelector,
  getSportsbookMarketRunners,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createSelectorCreator, defaultMemoize } from "reselect";

type OutrightMarket = {
  marketName: string;
  marketUrn: string;
  runnersUrns: string[];
};

function isOutrightMarketUrnEqual(previous: string[], current: string[]): boolean {
  return previous.toString() === current.toString();
}

const createOutrightMarketListViewModelSelector = createSelectorCreator(defaultMemoize, isOutrightMarketUrnEqual);

export const createOutrightMarketListViewModel = () => {
  const getSportsbookMarketByURNSelector = createSportsbookMarketByURNSelector();

  return createOutrightMarketListViewModelSelector(
    [(state: ApplicationState) => state, (_: ApplicationState, markets: string[]) => markets],
    (state: ApplicationState, markets: string[]): OutrightMarket[] =>
      markets.reduce<OutrightMarket[]>((acc, marketUrn) => {
        const sportsbookMarket = getSportsbookMarketByURNSelector(state.entities.sportsbookmarkets, marketUrn);

        if (!sportsbookMarket) return acc;

        const { name: marketName } = sportsbookMarket;

        const runners = getSportsbookMarketRunners(state, marketUrn);
        const runnersUrns = runners.map((runner) => runner.urn);

        acc.push({
          marketName,
          marketUrn,
          runnersUrns,
        });

        return acc;
      }, []),
  );
};
