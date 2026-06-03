import { LEG_TYPES } from "@ppb/betslip-core";
import { BetLeg } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookImplyBets/SportsbookImplyBets";
import { FetchCombinationsArguments, ImplyBetsScope, PricePolicy } from "@ppb/platform-services";
import { getInterval } from "../config";
import HttpPollerObservable from "./http-poller/http-poller-observable";
import { fetchCombinations, SportsbookImplyBetsSuccess } from "../services/sportsbook-imply-bets-service";
import SportsbookMarketPricesObservable from "./sportsbook-market-prices-observable";
import { SportsbookServiceGetPricesResult } from "../services/sportsbook-market-service";

export type BettingOpportunityType =
  | "POPULAR"
  | "POPULAR_MULTIPLES"
  | "MANUAL_MULTIPLES"
  | "CREATED_BETS"
  | "ENTITY"
  | "BOOSTED_BETS";

type Selection = {
  marketId: string;
  selectionId: number;
  odds?: number;
};

type AddToPoolParams = {
  bettingOpportunityUrn: string;
  bettingOpportunityType: BettingOpportunityType | null;
  bettingOpportunityId: string;
  selections: Selection[];
  subscriberId: string;
};

type BettingOpportunityPricesUpdate = {
  results: SportsbookImplyBetsSuccess[];
  combinationGroups: Record<string | number, string>;
};

export type BettingOpportunityPricesCallbackPayload = {
  updates?: BettingOpportunityPricesUpdate;
  error?: string;
};

type PoolMetadata = {
  bettingOpportunityUrn: string;
  bettingOpportunityType: BettingOpportunityType | null;
  bettingOpportunityId: string;
  lastUpdateAt?: number;
  selections: Selection[];
  consumers: Set<string>;
};

const sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();

// Combine only:
// - Recently added opportunities, with no lastUpdateAt
// - Opportunities that have been added longer than the interval window
//
// This avoid requests with ALL opportunities
// just because one new opportunity has been added (e.g. scrolled into view for example)
const isStale = (value: PoolMetadata) => {
  if (!value.lastUpdateAt) {
    return true;
  }

  const defaultPollInterval = getInterval("POPULAR_BETS");
  const delta = Date.now() - value.lastUpdateAt;

  return delta >= defaultPollInterval;
};

/**
 * Observable that will poll betting opportunity prices from SIB
 *
 * Every subscription is based on marketId, selectionId and a subscriberId that is based on
 * a component reference given by useId hook.
 */
export default class BettingOpportunityPricesObservable extends HttpPollerObservable<
  PoolMetadata,
  BettingOpportunityPricesCallbackPayload
> {
  private static instance: BettingOpportunityPricesObservable;

  private isOutdated = true;

  constructor(defaultPollInterval: number) {
    super(defaultPollInterval);

    sportsbookMarketPricesObservable.subscribe((response) => {
      if (!response.updates) {
        return;
      }

      if (this.areSelectionsOutdated(response.updates)) {
        this.isOutdated = true;
      }
    });
  }

  // This method is not 100% correct since it is comparing selectionIds only and
  // ignoring the marketId
  private areSelectionsOutdated(updates: SportsbookServiceGetPricesResult): boolean {
    let areOutdated = false;

    // Build a map of selectionId to odds
    const selectionIdToOdds = new Map<number, number>();

    updates.runners.forEach((runner) => {
      selectionIdToOdds.set(runner.selectionId, runner.odds?.decimal ?? 0);
    });

    this.POOL.forEach((value) => {
      value.selections.forEach((selection) => {
        if (selection.odds !== selectionIdToOdds.get(selection.selectionId)) {
          // eslint-disable-next-line no-param-reassign
          selection.odds = selectionIdToOdds.get(selection.selectionId);
          areOutdated = true;
        }
      });
    });

    return areOutdated;
  }

  public static getInstance(): BettingOpportunityPricesObservable {
    if (!BettingOpportunityPricesObservable.instance) {
      const defaultPollInterval = getInterval("POPULAR_BETS");

      BettingOpportunityPricesObservable.instance = new BettingOpportunityPricesObservable(defaultPollInterval);
    }

    return BettingOpportunityPricesObservable.instance;
  }

  private async request(): Promise<BettingOpportunityPricesUpdate | undefined> {
    const combinationGroups: Record<string | number, string> = {};

    const betLegs: BetLeg[] = [];

    const selections: {
      marketId: string;
      selectionId: number;
      combinationGroup?: number;
      combinationGroupId?: string;
      isBoostedLeg: boolean;
    }[] = [];

    let combinationGroupIndex = 0;

    // Build selections
    Array.from(this.POOL.values())
      .filter((value) => isStale(value))
      .forEach((value) => {
        const isBoostedLeg = value.bettingOpportunityType === "BOOSTED_BETS";
        const combinationGroupKey = isBoostedLeg ? value.bettingOpportunityId : combinationGroupIndex;

        const bettingOpportunitySelections = value.selections.map((selection) => ({
          marketId: selection.marketId,
          selectionId: selection.selectionId,
          combinationGroup: !isBoostedLeg ? combinationGroupIndex : undefined,
          combinationGroupId: isBoostedLeg ? value.bettingOpportunityId : undefined,
          isBoostedLeg,
        }));

        selections.push(...bettingOpportunitySelections);

        // Update timestamp of the last attempted update run
        this.POOL.set(value.bettingOpportunityUrn, { ...value, lastUpdateAt: Date.now() });

        // Increment combination group
        combinationGroupIndex += 1;

        // Append bet legs configuration and store the betting
        // opportunity and the combination group used
        combinationGroups[combinationGroupKey] = value.bettingOpportunityUrn;
      });

    // Build bet legs
    for (let index = 0; index < selections.length; index += 1) {
      const { marketId, selectionId, combinationGroup, combinationGroupId, isBoostedLeg } = selections[index];

      betLegs.push({
        legType: LEG_TYPES.SIMPLE_SELECTION,
        betRunners: [
          {
            runner: {
              marketId,
              selectionId,
            },
          },
        ],
        combinationGroup,
        combinationGroupId,
        isBoostedLeg,
      });
    }

    if (!betLegs.length) {
      return undefined;
    }

    if (!this.isOutdated) {
      return undefined;
    }

    const options: FetchCombinationsArguments = {
      betLegs,
      pricePolicy: PricePolicy.SUGGESTED,
      scope: ImplyBetsScope.MULTIPLES,
    };

    const results: SportsbookImplyBetsSuccess[] = await fetchCombinations(options, {
      combinationsGroupLimit: 5,
      betLegsLimit: 25,
    });

    this.isOutdated = false;

    return {
      results,
      combinationGroups,
    };
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

  public addBettingOpportunity(params: AddToPoolParams): void {
    const { bettingOpportunityUrn, bettingOpportunityType, bettingOpportunityId, selections, subscriberId } = params;
    const existingEntry = this.POOL.get(bettingOpportunityUrn);

    // Add market subscriptions
    selections.forEach((selection) => {
      sportsbookMarketPricesObservable.addMarket({
        marketId: selection.marketId,
        subscriberId: "betting-opportunity-prices-observable",
        isRacing: false,
      });
    });

    // No betting opportunity subscription found, creating a new one
    if (!existingEntry) {
      const metadata: PoolMetadata = {
        bettingOpportunityUrn,
        bettingOpportunityType,
        bettingOpportunityId,
        selections,
        consumers: new Set([subscriberId]),
      };

      this.add(bettingOpportunityUrn, metadata);
      this.isOutdated = true;

      return;
    }

    existingEntry.consumers.add(subscriberId);
  }

  public removeBettingOpportunity(bettingOpportunityUrn: string, subscriberId: string): void {
    const subscription = this.POOL.get(bettingOpportunityUrn);

    if (subscription) {
      // Remove market subscriptions
      subscription.selections.forEach((selection) => {
        sportsbookMarketPricesObservable.removeMarket(selection.marketId, "betting-opportunity-prices-observable");
      });

      // Delete the subscription
      subscription.consumers.delete(subscriberId);
      if (subscription.consumers.size === 0) {
        this.remove(bettingOpportunityUrn);
      }
    }
  }

  public resetBettingOpportunities(): void {
    this.isOutdated = true;

    this.POOL.forEach((value) => {
      this.remove(value.bettingOpportunityUrn);
    });
  }
}
