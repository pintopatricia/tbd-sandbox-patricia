/**
 * @file Manages exchange prices.
 */
import { codecs } from "@ppb/tbd-urn-codecs";
import { ExchangeReadOnly, utils } from "@flutter-global/uki-channels-http-clients";
import {
  MarketNode,
  QueryType,
  RollupModel,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeReadOnly/ExchangeReadOnly";
import URN from "../state/layout/URN";
import { ExchangeBetAvailability, RunnerStartingPrice, ExchangeRunner, ExchangeMarket } from "../state/entities";
import { createClientFactory } from "./client-factory";
import { getExchangeMarketStatus } from "./types-converter";
import { ExchangeMarketStatus } from "../clients/catalogue/catalogue-response-types";
import { ExchangeRunnerStatus } from "../state/constants";

const exchangeReadOnlyClientFactory = createClientFactory(ExchangeReadOnly);

/**
 * Ero data model type holding data about the market and the runners
 */
export type ExchangeServiceGetPricesResult = {
  markets: Pick<
    ExchangeMarket,
    | "urn"
    | "marketId"
    | "status"
    | "totalMatched"
    | "betDelay"
    | "priceLadderType"
    | "baseRate"
    | "discountAllowed"
    | "bspReconciled"
    | "complete"
    | "numberOfWinners"
    | "inplay"
    | "turnInPlayEnabled"
  >[];
  runners: ExchangeRunner[];
};

/**
 * Ero data model type holding data about the runner
 */
export type RunnerExchangePrices = {
  urn: URN;
  back?: ExchangeBetAvailability[];
  lay?: ExchangeBetAvailability[];
  traded?: ExchangeBetAvailability[];
  lastPriceTraded: number;
  sp?: RunnerStartingPrice;
};

const TYPES: utils.TYPES_WEIGHT_ENUM[] = [
  utils.TYPES_WEIGHT_ENUM.RUNNER_EXCHANGE_PRICES_BEST,
  utils.TYPES_WEIGHT_ENUM.RUNNER_DESCRIPTION,
  utils.TYPES_WEIGHT_ENUM.MARKET_STATE,
  utils.TYPES_WEIGHT_ENUM.RUNNER_STATE,
];
const MARKET_DESCRIPTION_TYPES: utils.TYPES_WEIGHT_ENUM[] = [
  utils.TYPES_WEIGHT_ENUM.MARKET_DESCRIPTION,
  utils.TYPES_WEIGHT_ENUM.MARKET_RATES,
];

/**
 * Exchange Prices Service interface
 */
export default {
  /**
   * Retrieve prices for exchange runners.
   *
   * @param marketIds List of exchange market ids.
   * @param locale
   * @param currencyCode
   * @param withMarketDescription
   *
   * @return Returns a map between runner id and its exchange prices.
   */
  async getPrices(
    marketIds: string[],
    locale: string,
    currencyCode: string,
    withMarketDescription = false,
  ): Promise<ExchangeServiceGetPricesResult> {
    const exchangeReadOnly = exchangeReadOnlyClientFactory("ERO");
    const types: utils.TYPES_WEIGHT_ENUM[] = withMarketDescription ? [...TYPES, ...MARKET_DESCRIPTION_TYPES] : TYPES;
    const options: {
      currencyCode: string;
      locale: string;
      rollupLimit: number;
      rollupModel: RollupModel;
    } = { currencyCode, locale, rollupLimit: 2, rollupModel: "STAKE" };

    // ERO has a request size limit, depending on the data needed for each market
    const marketsChunks: string[][] = utils.createMarketsChunks(marketIds, types);

    const eroByMarketsResponse = await Promise.all(
      marketsChunks.map((marketChunk) => exchangeReadOnly.getByMarkets(marketChunk, types, options)),
    );

    const markets: MarketNode[] = [];

    eroByMarketsResponse.forEach((chunk) => {
      chunk.eventTypes?.forEach((eventType) => {
        eventType.eventNodes?.forEach((eventNode) => {
          if (eventNode.marketNodes) {
            markets.push(...eventNode.marketNodes);
          }
        });
      });
    });

    return markets.reduce<ExchangeServiceGetPricesResult>(
      (acc, market) => {
        const { marketId, runners, description, rates } = market;

        const baseMarket = {
          urn: codecs.market.encode(marketId).uid,
          marketId,
          status: ExchangeMarketStatus.Open,
          totalMatched: 0,
          betDelay: 0,
          ...(description && description.priceLadderDescription
            ? { priceLadderType: description.priceLadderDescription.type }
            : {}),
          ...(description && description.turnInPlayEnabled ? { turnInPlayEnabled: description.turnInPlayEnabled } : {}),
          ...(rates ? { baseRate: rates.marketBaseRate } : {}),
          ...(rates ? { discountAllowed: rates.discountAllowed } : {}),
        };
        if (market.state) {
          const { status, bspReconciled, complete, numberOfWinners, inplay } = market.state;

          acc.markets.push({
            ...baseMarket,
            status: getExchangeMarketStatus(status),
            totalMatched: market.state.totalMatched,
            betDelay: market.state.betDelay,
            bspReconciled,
            complete,
            numberOfWinners,
            inplay,
          });
        } else {
          acc.markets.push(baseMarket);
        }

        if (runners) {
          runners.forEach((runner) => {
            const { handicap, selectionId, state } = runner;
            const { removalDate, adjustmentFactor, status: runnerStatus } = state || {};
            const marketDepthBack =
              runner.exchange &&
              runner.exchange.availableToBack &&
              runner.exchange.availableToBack.map((availability) => ({
                price: availability.price,
                liquidity: availability.size,
              }));

            const marketDepthLay =
              runner.exchange &&
              runner.exchange.availableToLay &&
              runner.exchange.availableToLay.map((availability) => ({
                price: availability.price,
                liquidity: availability.size,
              }));

            // As ExchangeRunnerStatus is a ENUM and runnerStatus is a string we need to check if this string is included in the ENUM
            const runnerStatusParsed = Object.values(ExchangeRunnerStatus).find((elem) => elem === runnerStatus);

            acc.runners.push({
              urn: codecs.exchangeRunner.encode(marketId, selectionId, handicap).uid,
              market: codecs.market.encode(marketId).uid,
              selectionId: Number(selectionId),
              back: marketDepthBack,
              lay: marketDepthLay,
              date: removalDate || null,
              reduction: adjustmentFactor || null,
              status: runnerStatusParsed,
            });
          });
        }
        return acc;
      },
      { markets: [], runners: [] },
    );
  },

  /**
   * Retrieve all exchange prices for an exchange runner with amount traded for each price
   *
   * @param marketId exchange market id.
   * @param selectionId selection id.
   * @param locale locale code.
   * @param currencyCode currency code.
   *
   * @return Returns a map between runner and all exchange prices.
   */
  async getRunnerMarketUpdate(
    marketId: string,
    selectionId: number,
    locale: string,
    currencyCode: string,
  ): Promise<RunnerExchangePrices | null> {
    const exchangeReadOnly = exchangeReadOnlyClientFactory("ERO");
    const types: QueryType[] = [
      "EVENT",
      "MARKET_DESCRIPTION",
      "RUNNER_DESCRIPTION",
      "RUNNER_STATE",
      "RUNNER_EXCHANGE_PRICES_ALL",
      "RUNNER_EXCHANGE_TRADED",
      "RUNNER_SP",
      "MARKET_LINE_RANGE_INFO",
    ];
    const response = await exchangeReadOnly.getByRunner(marketId, selectionId, types, { currencyCode, locale });

    const runner =
      response &&
      response.eventTypes &&
      response.eventTypes[0].eventNodes &&
      response.eventTypes[0].eventNodes[0].marketNodes &&
      response.eventTypes[0].eventNodes[0].marketNodes[0].runners &&
      response.eventTypes[0]?.eventNodes[0]?.marketNodes[0]?.runners[0];

    if (!runner) {
      return null;
    }

    const { sp, exchange } = runner;

    if (!exchange) {
      return null;
    }

    const { handicap } = runner;
    const lastPriceTraded = runner.state?.lastPriceTraded || 0;

    const runnerUrn = codecs.exchangeRunner.encode(marketId, selectionId, handicap).uid;
    const { availableToBack, availableToLay, traded } = exchange;

    const allAvailableToBack = availableToBack?.map((back) => ({
      price: back.price,
      liquidity: back.size,
    }));
    const allAvailableToLay = availableToLay?.map((lay) => ({
      price: lay.price,
      liquidity: lay.size,
    }));

    const allTraded = traded?.map((trade) => ({
      price: trade.price,
      liquidity: trade.size,
    }));

    const runnerExchangePrices = {
      urn: runnerUrn,
      back: allAvailableToBack,
      lay: allAvailableToLay,
      traded: allTraded,
      sp,
      lastPriceTraded,
    };

    return runnerExchangePrices;
  },
};
