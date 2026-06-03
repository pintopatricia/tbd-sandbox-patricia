import { codecs } from "@ppb/tbd-urn-codecs";
import sportsbookService, { SportsbookServiceGetPricesResult } from "../services/sportsbook-market-service";
import { getInterval } from "../config";
import HttpPollerObservable from "./http-poller/http-poller-observable";
import { SportsbookMarketStatus } from "../state";

type AddToPoolParams = {
  marketId: string;
  isRacing: boolean;
  subscriberId: string;
};

export type SportsbookMarketPricesCallbackPayload = {
  updates?: SportsbookServiceGetPricesResult;
  error?: string;
};

type PoolMetadata = {
  marketId: string;
  isRacing: boolean;
  consumers: Set<string>;
};

/**
 * Observable that will poll sportsbook market prices from SMP
 *
 * Every subscription is based on marketId and a subscriberId that is based on
 * a component reference given by useId hook.
 */
export default class SportsbookMarketPricesObservable extends HttpPollerObservable<
  PoolMetadata,
  SportsbookMarketPricesCallbackPayload
> {
  private static instance: SportsbookMarketPricesObservable;

  public static getInstance(): SportsbookMarketPricesObservable {
    if (!SportsbookMarketPricesObservable.instance) {
      const defaultPollInterval = getInterval("SMP");

      SportsbookMarketPricesObservable.instance = new SportsbookMarketPricesObservable(defaultPollInterval);
    }

    return SportsbookMarketPricesObservable.instance;
  }

  private async request(): Promise<SportsbookServiceGetPricesResult | undefined> {
    const marketIds: string[] = [];
    let priceHistory = 1;

    this.POOL.forEach((value) => {
      marketIds.push(value.marketId);

      // Racing markets require price history of 3
      if (value.isRacing) {
        priceHistory = 3;
      }
    });

    if (marketIds.length === 0) {
      return undefined;
    }

    const response: SportsbookServiceGetPricesResult = await sportsbookService.getPrices(marketIds, priceHistory);

    const marketIdsAvailableFromSMP = response.markets.map((market) => "marketId" in market && market.marketId);
    const marketsToUnsubscribe = marketIds.filter((marketId) => !marketIdsAvailableFromSMP.includes(marketId));

    // Unsubscribe markets that are no longer available and flag them as closed
    marketsToUnsubscribe.forEach((marketId) => {
      this.remove(marketId);

      response.markets.push({
        urn: codecs.market.encode(marketId).uid,
        status: "CLOSED" as SportsbookMarketStatus,
      });
    });

    return response;
  }

  protected async tick() {
    try {
      const response = await this.request();

      if (response) {
        this.notify({ updates: response });
      }

      return;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : `Unknown error ${e}`;

      this.notify({ error: errorMsg });
    }
  }

  public addMarket(params: AddToPoolParams): void {
    const { marketId, subscriberId, isRacing } = params;
    const existingEntry = this.POOL.get(marketId);

    // No market subscription found, creating a new one
    if (!existingEntry) {
      const metadata: PoolMetadata = {
        marketId,
        isRacing,
        consumers: new Set([subscriberId]),
      };

      this.add(marketId, metadata);

      return;
    }

    existingEntry.consumers.add(subscriberId);
  }

  public removeMarket(marketId: string, subscriberId: string): void {
    const subscription = this.POOL.get(marketId);

    if (subscription) {
      subscription.consumers.delete(subscriberId);
      if (subscription.consumers.size === 0) {
        this.remove(marketId);
      }
    }
  }

  public resetMarkets(exclusions: string[] = []): void {
    this.POOL.forEach((value) => {
      const excludedConsumers = exclusions.filter((exclusion) => value.consumers.has(exclusion));

      if (!excludedConsumers.length) {
        this.remove(value.marketId);
      } else {
        value.consumers = new Set(excludedConsumers);
      }
    });
  }
}
