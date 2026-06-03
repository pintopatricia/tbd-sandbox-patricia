/**
 * Manages sportsbook prices.
 */
import { codecs } from "@ppb/tbd-urn-codecs";
import { FixedOddsReadOnly, utils } from "@flutter-global/uki-channels-http-clients";
import {
  Odds,
  RunnerDetails,
  MarketDetails,
} from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookMarketPrices/FixedOddsReadOnly";
import { SportsbookMarket, SportsbookRunner } from "../state/entities";
import { SportsbookOdds } from "../state/entities/SportsbookOdds.types";
import { createClientFactory } from "./client-factory";
import { getSportsbookMarketStatus, getSportsbookRunnerStatus } from "./types-converter";

type SportsbookMarketUpdate =
  | Pick<
      SportsbookMarket,
      | "urn"
      | "marketId"
      | "status"
      | "eachWayAvailable"
      | "guaranteedPriceAvailable"
      | "inplay"
      | "eachWayPlaces"
      | "eachWayPlaceFraction"
    >
  | Pick<SportsbookMarket, "urn" | "status">;

export type SportsbookServiceGetPricesResult = {
  markets: SportsbookMarketUpdate[];
  runners: SportsbookRunner[];
  runnerDetails?: { [marketUrn: string]: RunnerDetails[] | undefined };
};

const MARKET_LIMIT = 70;

const fixedOddsReadOnlyClientFactory = createClientFactory(FixedOddsReadOnly);

/**
 * Maps SMP Odds to SportsbookOdds
 * According to SMP IDD, decimalDisplayOdds and fractionalDisplayOdds are optional.
 * However, when Odds exists, both values are returned and IDD types are incorrect.
 */
function mapOddsToSportsbookOdds(odds?: Odds): SportsbookOdds | undefined {
  return odds && odds.decimalDisplayOdds && odds.fractionalDisplayOdds
    ? {
        decimal: odds.decimalDisplayOdds.decimalOdds,
        fractional: odds.fractionalDisplayOdds,
        american: odds.americanDisplayOdds?.americanOddsInt,
      }
    : undefined;
}

/**
 * Maps SMP True Odds to SportsbookOdds
 * According to SMP IDD, decimalDisplayOdds and fractionalDisplayOdds are optional.
 * However, when Odds exists, both values are returned and IDD types are incorrect.
 */
function mapTrueOddsToSportsbookOdds(odds?: Odds): SportsbookOdds | undefined {
  return odds && odds.trueOdds && odds.trueOdds.decimalOdds
    ? {
        decimal: odds.trueOdds.decimalOdds.decimalOdds,
        fractional: odds.trueOdds.fractionalOdds,
      }
    : undefined;
}

/**
 * Maps SMP Previous Win Runner Odds to an array of SportsbookOdds
 * According to SMP IDD, decimalDisplayOdds and fractionalDisplayOdds are optional.
 * However, when Odds exists, both values are returned and IDD types are incorrect.
 */
function mapPreviousWinRunnersOddsToSportsbookOdds(previousWinRunnerOdds?: Odds[]): SportsbookOdds[] | undefined {
  if (!previousWinRunnerOdds) {
    return undefined;
  }

  const previousOdds: SportsbookOdds[] = [];

  previousWinRunnerOdds.forEach((previousWinRunnerOdd) => {
    if (previousWinRunnerOdd && previousWinRunnerOdd.decimalDisplayOdds && previousWinRunnerOdd.fractionalDisplayOdds) {
      previousOdds.push({
        decimal: previousWinRunnerOdd.decimalDisplayOdds.decimalOdds,
        fractional: previousWinRunnerOdd.fractionalDisplayOdds,
        american: previousWinRunnerOdd.americanDisplayOdds?.americanOddsInt,
      });
    }
  });
  return previousOdds;
}

/**
 * Sportsbook Prices Service interface
 */
export default {
  /**
   * Retrieve prices for sportsbook runners.
   *
   * @param marketIds List of sportsbook runner ids.
   * @return Returns a map between runner id and its sportsbook odds.
   */
  async getPrices(marketIds: string[], priceHistory = 0): Promise<SportsbookServiceGetPricesResult> {
    const fixedOddsReadOnlyClient = fixedOddsReadOnlyClientFactory("SMP");

    // SMP has a request size limit of a number of markets
    const chunkResponse: MarketDetails[][] = await Promise.all(
      utils
        .splitIntoChunks(marketIds, MARKET_LIMIT)
        .map(
          (marketChunk: string[]): Promise<MarketDetails[]> =>
            fixedOddsReadOnlyClient.getMarketPrices(marketChunk, { priceHistory }),
        ),
    );

    const response = chunkResponse.reduce((acc, responseChunk) => {
      acc.push(...responseChunk);
      return acc;
    }, []);

    return response.reduce<SportsbookServiceGetPricesResult>(
      (acc, market) => {
        const { marketId, marketStatus, bettingType } = market;
        const marketURN = codecs.sportsbookMarket.encode(marketId).uid;

        const marketData: SportsbookMarketUpdate = {
          urn: marketURN,
          marketId,
          status: getSportsbookMarketStatus(marketStatus),
          eachWayAvailable: market.eachwayAvailable,
          guaranteedPriceAvailable: market.guaranteedPriceAvailable,
          inplay: market.inplay,
        };

        if (market.eachwayAvailable) {
          marketData.eachWayPlaces = market.numberOfPlaces;
          marketData.eachWayPlaceFraction = market.placeFraction;
        }

        acc.markets.push(marketData);

        if (bettingType === "MOVING_HANDICAP" && acc.runnerDetails) {
          acc.runnerDetails[marketURN] = market.runnerDetails;
        }

        market.runnerDetails.forEach((runner) => {
          const { handicap, selectionId, runnerStatus, winRunnerOdds, previousWinRunnerOdds, eachwayRunnerOdds } =
            runner;

          const odds = mapOddsToSportsbookOdds(winRunnerOdds);
          const trueOdds = mapTrueOddsToSportsbookOdds(winRunnerOdds);

          const previousOdds = mapPreviousWinRunnersOddsToSportsbookOdds(previousWinRunnerOdds);

          const marketRunner: SportsbookRunner = {
            urn: codecs.sportsbookRunner.encode(marketId, selectionId).uid,
            market: marketURN,
            selectionId,
            handicap,
            status: getSportsbookRunnerStatus(runnerStatus),
            odds,
            trueOdds,
            previousOdds,
          };
          if (market.eachwayAvailable) {
            marketRunner.eachWayOdds = {
              trueOdds: eachwayRunnerOdds?.trueOdds.decimalOdds
                ? {
                    decimal: eachwayRunnerOdds.trueOdds.decimalOdds.decimalOdds,
                    fractional: eachwayRunnerOdds?.trueOdds.fractionalOdds,
                  }
                : undefined,
              displayDecimal: eachwayRunnerOdds?.decimalDisplayOdds?.decimalOdds,
              displayFractional: eachwayRunnerOdds?.fractionalDisplayOdds,
            };
          }

          acc.runners.push(marketRunner);
        });
        return acc;
      },
      { markets: [], runners: [], runnerDetails: {} },
    );
  },
};
