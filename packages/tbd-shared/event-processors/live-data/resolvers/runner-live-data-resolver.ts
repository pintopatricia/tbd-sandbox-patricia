import SportsbookMarketPricesObservable from "@ppb/tbd-store/middlewares/sportsbook-market-prices-observable";
import { codecs } from "@ppb/tbd-urn-codecs";
import { SportsbookOdds } from "@ppb/tbd-store";
import { SportsbookServiceGetPricesResult } from "@ppb/tbd-store/services/sportsbook-market-service";
import { getApolloClient } from "../../../apollo-client/client";
import type { SportsbookRunnerLiveDataEventProcessorFragment } from "../../../types/__generated__/graphql";

const sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();

function buildRunnerLiveDataUrn(marketUrn: string, selectionId: number) {
  const marketId = codecs.sportsbookMarket.decode(marketUrn);
  const runnerUrn = marketId && codecs.sportsbookRunner.encode(marketId, selectionId);
  const { uid } = (runnerUrn && codecs.sbkRunnerLiveData.encode(runnerUrn.referenceId)) || {};

  return uid;
}

/**
 * Maps SMP Odds to SportsbookOdds
 * According to SMP IDD, decimalDisplayOdds and fractionalDisplayOdds are optional.
 * However, when Odds exists, both values are returned and IDD types are incorrect.
 */
function mapSportsbookOdds(odds: SportsbookOdds | undefined) {
  if (!odds) {
    return null;
  }

  return {
    decimal: odds.decimal,
    fractional: odds.fractional || null,
  };
}

export function runnerLiveDataResolver(visible: boolean, marketUrn: string, isRacing: boolean, subscriberId: string) {
  const marketId = codecs.sportsbookMarket.decode(marketUrn);

  if (!marketId) {
    return;
  }

  if (visible) {
    sportsbookMarketPricesObservable.addMarket({
      marketId,
      subscriberId,
      isRacing,
    });
  } else {
    sportsbookMarketPricesObservable.removeMarket(marketId, subscriberId);
  }
}

export function updateRunnerLiveData(payload: SportsbookServiceGetPricesResult) {
  if (payload) {
    const { cache } = getApolloClient();

    payload.runners.forEach((runner) => {
      const urn = buildRunnerLiveDataUrn(runner.market, runner.selectionId);

      if (!urn) {
        return;
      }

      const id = cache.identify({
        __typename: "SportsbookRunnerLiveData",
        urn,
      });

      cache.modify<SportsbookRunnerLiveDataEventProcessorFragment>({
        id,
        fields: {
          odds() {
            return mapSportsbookOdds(runner.trueOdds);
          },
          displayOdds() {
            return mapSportsbookOdds(runner.odds);
          },
          previousOdds() {
            return (
              runner.previousOdds?.map((previous) => ({
                odds: mapSportsbookOdds(runner.trueOdds),
                displayOdds: mapSportsbookOdds(previous),
              })) || null
            );
          },
          runnerStatus() {
            return runner.status;
          },
        },
      });
    });
  }
}
