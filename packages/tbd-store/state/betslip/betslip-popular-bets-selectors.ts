import { OutputParametricSelector, defaultMemoize, createSelectorCreator, createSelector } from "reselect";
import { PopularBettingOpportunities, BettingOpportunityType } from "../entities";
import { ApplicationState } from "../ApplicationState.types";
import { PopularBettingState } from "../betting/popular-betting/PopularBetting.types";

type BetSelection = {
  urn: string;
};

function hasBettingOpportunitiesChanged(prev: PopularBettingOpportunities, next: PopularBettingOpportunities): boolean {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  return prevKeys.length === nextKeys.length && prevKeys.every((key, i) => key === nextKeys[i]);
}

const createGetBettingOpportunitiesSelector = () =>
  createSelectorCreator(defaultMemoize, hasBettingOpportunitiesChanged)(
    (appState: ApplicationState): PopularBettingOpportunities => appState.entities.popularbettingopportunities,
    (popularBettingOpportunities) => popularBettingOpportunities,
  );

function hasBetSelectionsChanged(prev: BetSelection[], next: BetSelection[]): boolean {
  return prev.length === next.length && prev.every((selection, i) => selection.urn === next[i].urn);
}

const createGetBetSelectionsSelector = () =>
  createSelectorCreator(defaultMemoize, hasBetSelectionsChanged)(
    (betSelections: BetSelection[]): BetSelection[] => betSelections,
    (betSelections) => betSelections,
  );

export const createGetIsCombinationOpportunityType = (
  type: BettingOpportunityType,
): OutputParametricSelector<
  ApplicationState,
  BetSelection[],
  boolean,
  (popularBettingOpportunities: PopularBettingOpportunities, betSelections: BetSelection[]) => boolean
> => {
  const getBettingOpportunities = createGetBettingOpportunitiesSelector();
  const getBetSelections = createGetBetSelectionsSelector();

  return createSelector(
    [
      (appState: ApplicationState): PopularBettingOpportunities => getBettingOpportunities(appState),
      (_: ApplicationState, betSelections: BetSelection[]): BetSelection[] => getBetSelections(betSelections),
    ],
    (popularBettingOpportunities, betSelections) =>
      Object.values(popularBettingOpportunities).some(({ type: ppbType, selections: pbbSelections }) => {
        if (ppbType !== type) {
          return false;
        }

        if (pbbSelections.length !== betSelections.length) {
          return false;
        }

        return betSelections.every((selection) => pbbSelections.some((sel) => sel.runnerUrn === selection.urn));
      }),
  );
};

export const createGetPopularCombination = () => {
  const getBetSelections = createGetBetSelectionsSelector();

  return createSelector(
    [
      (appState: ApplicationState): PopularBettingState => appState.betting.popularBetting,
      (_: ApplicationState, betSelections: BetSelection[]): BetSelection[] => getBetSelections(betSelections),
    ],
    (popularBettingState, betSelections) => {
      const popularCombination = Object.values(popularBettingState).find(({ selections: pbbSelections }) => {
        if (pbbSelections.length !== betSelections.length) {
          return false;
        }

        return betSelections.every((selection) => pbbSelections.some((sel) => sel.runnerUrn === selection.urn));
      });

      return popularCombination;
    },
  );
};
