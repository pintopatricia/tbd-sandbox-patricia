import cashoutService from "../services/cashout-service";
import {
  SportsbookCashoutQuote,
  SportsbookCashouts,
} from "../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import URN from "../state/layout/URN";
import HttpPollerObservable from "./http-poller/http-poller-observable";

export type FixedOddsCashoutQuotesUpdateCallbackPayload = {
  fcqQuotes?: Record<string, never> | SportsbookCashouts;
  error?: any;
};

type PoolMetadata = {
  betId: string;
};

type AddToPoolParams = {
  betURN: URN;
} & PoolMetadata;

// The max available refresh rate returned from FCQ is 10 seconds
const DEFAULT_REFRESH_RATE = 10000;

export default class FixedOddsCashoutQuotesUpdatesObservable extends HttpPollerObservable<
  PoolMetadata,
  FixedOddsCashoutQuotesUpdateCallbackPayload
> {
  private static instance: FixedOddsCashoutQuotesUpdatesObservable;

  private previousRefreshRate: number = DEFAULT_REFRESH_RATE;

  public static getInstance(): FixedOddsCashoutQuotesUpdatesObservable {
    if (!FixedOddsCashoutQuotesUpdatesObservable.instance) {
      FixedOddsCashoutQuotesUpdatesObservable.instance = new FixedOddsCashoutQuotesUpdatesObservable(
        DEFAULT_REFRESH_RATE,
      );
    }
    return FixedOddsCashoutQuotesUpdatesObservable.instance;
  }

  private async request(): Promise<Record<string, never> | SportsbookCashouts> {
    const betIdsPayload = Array.from(this.POOL.values()).map(({ betId }) => betId);

    return cashoutService.betQuotes(betIdsPayload);
  }

  private updatePollerInterval(quotes: SportsbookCashoutQuote[]): void {
    const eligibleRefreshRates = quotes
      .filter((quote): quote is SportsbookCashoutQuote & { refreshRate: number } => !!quote.refreshRate)
      .map(({ refreshRate }) => refreshRate);

    // If there are no refresh rates from service, we must keep the previous set one
    // e.g.: when a football match is inplay, it shows as 5, but when a penalty is awarded, the market gets suspended
    // and the quote comes undefined, so we want to keep the previous refresh rate
    if (!eligibleRefreshRates.length) {
      return;
    }

    const minRefreshRate = Math.min(...eligibleRefreshRates) * 1000;

    if (minRefreshRate !== this.previousRefreshRate) {
      this.previousRefreshRate = minRefreshRate;
      super.setPollInterval(minRefreshRate);
      super.restart();
    }
  }

  protected async tick() {
    try {
      const fcqQuotes = await this.request();

      if (!fcqQuotes) {
        return;
      }

      super.notify({ fcqQuotes });

      this.updatePollerInterval(Object.values(fcqQuotes));

      return;
    } catch (error) {
      super.notify({ error });
    }
  }

  public addBet(params: AddToPoolParams): void {
    const { betURN } = params;
    const existingEntry = this.POOL.get(betURN);

    if (!existingEntry) {
      super.add(betURN, {
        ...params,
      });
    }
  }

  public removeBet(urn: URN): void {
    super.remove(urn);
  }

  public resetBets(): void {
    super.reset();
    this.previousRefreshRate = DEFAULT_REFRESH_RATE;
  }

  public restart(): void {
    super.restart();
  }
}
