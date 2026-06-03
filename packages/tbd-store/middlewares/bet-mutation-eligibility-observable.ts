import { BetEligibilityResponse } from "../clients/__generated__/bme";
import { getInterval } from "../config";
import { getBetEligibility } from "../services/bme/bme-service";
import HttpPollerObservable from "./http-poller/http-poller-observable";
import RichContentUpdatesObservable from "./rich-content-updates-observable";
import { ResponseError } from "../clients/__generated__/bme/runtime";

type AddToPoolParams = {
  betId: string;
};

export type BetEligibilityCallbackPayload = {
  updates?: BetEligibilityResponse;
  error?: string;
};

type PoolMetadata = {
  count: number;
};

const richContentUpdatesObservable = RichContentUpdatesObservable.getInstance();

export default class BetMutationEligibilityObservable extends HttpPollerObservable<
  PoolMetadata,
  BetEligibilityCallbackPayload
> {
  private static instance: BetMutationEligibilityObservable;

  private inPlay = false;

  constructor(defaultPollInterval: number) {
    super(defaultPollInterval);

    richContentUpdatesObservable.subscribe(({ inplay }) => {
      if (!this.inPlay && inplay) {
        this.inPlay = true;

        this.setPollInterval(getInterval("BME", { inPlay: true }));
        this.restart();
      } else if (this.inPlay && !inplay) {
        this.inPlay = false;

        this.setPollInterval(getInterval("BME", { inPlay: false }));
        this.restart();
      }
    });
  }

  public static getInstance(): BetMutationEligibilityObservable {
    if (!BetMutationEligibilityObservable.instance) {
      BetMutationEligibilityObservable.instance = new BetMutationEligibilityObservable(
        getInterval("BME", { inPlay: false }),
      );
    }
    return BetMutationEligibilityObservable.instance;
  }

  private async request() {
    return getBetEligibility([...this.POOL.keys()]);
  }

  protected async tick() {
    const makeEmptyEligibility = (betId: string) => ({
      betId,
      betMutationEligibility: [],
      legs: [],
    });

    const requestedKeys = [...this.POOL.keys()]; // Capture to avoid pool mutation during await

    try {
      const response = await this.request();
      if (!response) {
        return;
      }

      const betEligibilities = response.betEligibilities ?? [];
      const idsInResponse = new Set(betEligibilities.map((betEligibility) => betEligibility.betId ?? ""));
      const removedBetIds = requestedKeys.filter((requestedId) => !idsInResponse.has(requestedId));

      const responsePlusMissing = {
        betEligibilities: [...betEligibilities, ...removedBetIds.map((betId) => makeEmptyEligibility(betId))],
      };

      removedBetIds.forEach((betId) => this.removeBet(betId));

      this.notify({ updates: responsePlusMissing });
      return;
    } catch (e) {
      if (e instanceof ResponseError && e.response.status === 404) {
        const emptyBetsUpdate = {
          betEligibilities: requestedKeys.map((betId) => makeEmptyEligibility(betId)),
        };
        requestedKeys.forEach((betId) => this.removeBet(betId));
        this.notify({ updates: emptyBetsUpdate });
        return;
      }

      const errorMsg = e instanceof Error ? e.message : `Unknown error ${e}`;
      this.notify({ error: errorMsg });
    }
  }

  public addBet(params: AddToPoolParams): void {
    const { betId } = params;
    const existingEntry = this.POOL.get(betId);
    let metadata;

    if (existingEntry) {
      metadata = {
        count: existingEntry.count + 1,
      };
    } else {
      metadata = {
        count: 1,
      };
    }

    this.add(betId, metadata);
  }

  public removeBet(betId: string): void {
    this.remove(betId);
  }

  public resetBets(): void {
    this.reset();
  }
}
