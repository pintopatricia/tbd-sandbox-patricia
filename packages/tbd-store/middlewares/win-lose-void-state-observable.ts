import { InputBet, InputLeg, ResultType } from "../clients/blh/bet-live-hypotheticals-response-types";
import { getInterval } from "../config";
import betLiveHypotheticalsService, { BetsResultServiceResponse } from "../services/bet-live-hypotheticals-service";
import URN from "../state/layout/URN";
import HttpPollerObservable from "./http-poller/http-poller-observable";
import RichContentUpdatesObservable from "./rich-content-updates-observable";

type AddToPoolParams = {
  betURN: URN;
} & InputBet;

export type WinLoseVoidStateUpdateCallbackPayload = {
  updates?: BetsResultServiceResponse;
  error?: string;
};

type PoolMetadata = InputBet;

const richContentUpdatesObservable = RichContentUpdatesObservable.getInstance();

export default class WinLoseVoidStateUpdatesObservable extends HttpPollerObservable<
  PoolMetadata,
  WinLoseVoidStateUpdateCallbackPayload
> {
  private static instance: WinLoseVoidStateUpdatesObservable;

  private inPlay = false;

  constructor(defaultPollInterval: number) {
    super(defaultPollInterval);

    richContentUpdatesObservable.subscribe(({ inplay }) => {
      if (!this.inPlay && inplay) {
        this.inPlay = true;

        this.setPollInterval(getInterval("BLH", { inPlay: true }));
        this.restart();
      } else if (this.inPlay && !inplay) {
        this.inPlay = false;

        this.setPollInterval(getInterval("BLH", { inPlay: false }));
        this.restart();
      }
    });
  }

  public static getInstance(): WinLoseVoidStateUpdatesObservable {
    if (!WinLoseVoidStateUpdatesObservable.instance) {
      WinLoseVoidStateUpdatesObservable.instance = new WinLoseVoidStateUpdatesObservable(
        getInterval("BLH", { inPlay: false }),
      );
    }
    return WinLoseVoidStateUpdatesObservable.instance;
  }

  private async request(): Promise<BetsResultServiceResponse | undefined> {
    const betsPayload = Array.from(this.POOL.values()).map(({ betType, legs }) => ({
      betType,
      legs,
    }));
    const urnListPayload = Array.from(this.POOL.keys());

    return betLiveHypotheticalsService.getBetsResult({
      bets: betsPayload,
      urnList: urnListPayload,
    });
  }

  protected async tick() {
    try {
      const betResultUpdates = await this.request();

      if (!betResultUpdates) {
        return;
      }

      this.notify({ updates: betResultUpdates });

      // check if is required to update subscriptions - if any leg is confirmed, should sent back that to BLH on next call
      betResultUpdates.forEach((bet) => {
        const subscribedBet = this.POOL.get(bet.urn);
        if (!subscribedBet) {
          return;
        }

        if (bet.legs.every((leg) => leg.runners.every(({ resultType }) => resultType === ResultType.CONFIRMED))) {
          this.removeBet(bet.urn);

          return;
        }

        if (bet.legs.some((leg) => leg.runners.some(({ resultType }) => resultType === ResultType.CONFIRMED))) {
          const updatedLegs: InputLeg[] = [];
          bet.legs.forEach((leg) => {
            updatedLegs.push({
              legNumber: leg.legNumber,
              runners: leg.runners.map(({ id, marketId, result, resultType }) => ({
                id,
                marketId,
                result: resultType === ResultType.CONFIRMED ? result : null,
              })),
            });
          });
          this.POOL.set(bet.urn, {
            betType: subscribedBet.betType,
            legs: updatedLegs,
            count: subscribedBet.count,
          });
        }
      });

      return;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : `Unknown error ${e}`;

      this.notify({ error: errorMsg });
    }
  }

  public addBet(params: AddToPoolParams): void {
    const { betURN } = params;
    const existingEntry = this.POOL.get(betURN);
    let metadata: { count: number } & InputBet;

    if (existingEntry) {
      metadata = {
        count: existingEntry.count + 1,
        ...params,
      };
    } else {
      metadata = {
        count: 1,
        ...params,
      };
    }

    this.add(betURN, metadata);
  }

  public removeBet(urn: URN): void {
    this.remove(urn);
  }

  public resetBets(): void {
    this.reset();
  }
}
