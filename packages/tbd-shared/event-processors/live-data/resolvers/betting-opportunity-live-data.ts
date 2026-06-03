import BettingOpportunityPricesObservable, {
  BettingOpportunityType,
} from "@ppb/tbd-store/middlewares/betting-opportunity-prices-observable";
import { codecs } from "@ppb/tbd-urn-codecs";
import { PriceBoostMultiplePromoCardCombinedOddsFragment } from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/model/PriceBoostMultiplePromoCard.graphql";
import { getApolloClient } from "../../../apollo-client/client";

type Selection = {
  marketUrn: string;
  runnerUrn: string;
};

type MappedSelection = {
  marketId: string;
  selectionId: number;
};

const bettingOpportunityPricesObservable = BettingOpportunityPricesObservable.getInstance();

export function bettingOpportunityLiveDataResolver(
  visible: boolean,
  bettingOpportunityUrn: string,
  bettingOpportunityType: BettingOpportunityType | null,
  bettingOpportunityId: string,
  selections: Selection[],
  refId: string,
) {
  const mappedSelections = selections.reduce((acc, selection) => {
    const marketId = codecs.sportsbookMarket.decode(selection.marketUrn);
    const runnerUrn = codecs.parse(selection.runnerUrn);
    const runner = runnerUrn && codecs.sportsbookRunner.extract(runnerUrn);

    if (marketId && runner?.selectionId) {
      acc.push({
        marketId,
        selectionId: runner.selectionId,
      });
    }

    return acc;
  }, [] as MappedSelection[]);

  if (visible) {
    bettingOpportunityPricesObservable.addBettingOpportunity({
      bettingOpportunityUrn,
      bettingOpportunityType: bettingOpportunityType as BettingOpportunityType,
      bettingOpportunityId,
      selections: mappedSelections,
      subscriberId: refId,
    });
  } else {
    bettingOpportunityPricesObservable.removeBettingOpportunity(bettingOpportunityUrn, refId);
  }
}

export function subscribeBettingOpportunityLiveData() {
  const { cache } = getApolloClient();

  bettingOpportunityPricesObservable.subscribe((response) => {
    response.updates?.results.forEach((result) => {
      result.betCombinations.forEach((combination) => {
        const combinationGroupId = combination.combinationGroupId || "";
        const bettingOpportunityUrn = response.updates?.combinationGroups[combinationGroupId];

        // Format odds
        const decimalOdds =
          combination.winAvgOdds?.prettyDisplayOdds?.decimalOdds?.decimalOdds ||
          combination.winAvgOdds?.decimalDisplayOdds?.decimalOdds ||
          0;
        const fractionalOdds =
          combination.winAvgOdds?.prettyDisplayOdds?.fractionalOdds ||
          combination.winAvgOdds?.fractionalDisplayOdds ||
          null;
        const americanOdds = combination.winAvgOdds?.americanDisplayOdds?.americanOddsInt || null;
        const originalDecimalOdds = combination.originalWinAvgOdds?.decimalDisplayOdds?.decimalOdds || 0;
        const originalFractionalOdds = combination.originalWinAvgOdds?.fractionalDisplayOdds || null;
        const originalAmericanOdds = combination.originalWinAvgOdds?.americanDisplayOdds?.americanOddsInt || null;

        const id = cache.identify({
          __typename: "PopularBettingOpportunity",
          urn: bettingOpportunityUrn,
          id: combinationGroupId,
        });

        if (bettingOpportunityUrn) {
          cache.writeFragment({
            fragment: PriceBoostMultiplePromoCardCombinedOddsFragment,
            id,
            data: {
              __typename: "PopularBettingOpportunity",
              urn: bettingOpportunityUrn,
              odds: {
                decimal: decimalOdds,
                fractional: fractionalOdds,
                american: americanOdds,
              },
              originalOdds: {
                decimal: originalDecimalOdds,
                fractional: originalFractionalOdds,
                american: originalAmericanOdds,
              },
            },
          });
        }
      });
    });
  });
}
