import { createSelector, OutputParametricSelector } from "reselect";
import { ApplicationState } from "@ppb/tbd-store";
import { createQuickBetslipTitleSelector } from "../../vm-builder";
import { CardProps } from "./map-to-props-factory";
import {
  createCombinationCounterSelector,
  getBettingResolvers,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { isBoostedMultiple } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { BettingState } from "@ppb/betslip-core";
import { getBetslipGroup } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  BettingGenericMetadata,
  BettingMetadata,
  RunnersMetadata,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { i18n } from "../../../../../helpers/i18n";

function getCombinationFirstLeg(
  combination: BettingState.Combination,
  legs: BettingState.LegsMap,
): BettingState.Leg | null {
  const firstLegId = combination.legs[0];

  const firstLeg = legs[firstLegId];
  if (!firstLeg) {
    return null;
  }

  return firstLeg;
}

function getCombinationFirstRunnerId(
  combination: BettingState.Combination,
  legs: BettingState.LegsMap,
): string | undefined {
  const firstLeg = getCombinationFirstLeg(combination, legs);
  if (!firstLeg) {
    return undefined;
  }

  return firstLeg.runners[0];
}

function getFirstSelectionMetadata(
  combination: BettingState.Combination,
  metadata: RunnersMetadata,
  legs: BettingState.LegsMap,
): BettingMetadata | null {
  const firstRunnerId = getCombinationFirstRunnerId(combination, legs);
  if (!firstRunnerId) {
    return null;
  }

  return metadata[firstRunnerId] ?? null;
}

function getLegFirstRunnerMetadata(
  legs: BettingState.LegsMap,
  legId: string,
  metadata: RunnersMetadata,
): BettingMetadata | undefined {
  const leg = legs[legId];
  const firstRunnerId = leg?.runners[0];

  return metadata[firstRunnerId];
}

function buildPriceBoostMultipleSubtitle(
  combination: BettingState.Combination,
  legs: BettingState.LegsMap,
  metadata: RunnersMetadata,
): string {
  const firstSelectionMetadata = getFirstSelectionMetadata(combination, metadata, legs);
  if (!firstSelectionMetadata) {
    return "";
  }

  const eventNamesAggregation = combination.legs
    .map((legId) => getLegFirstRunnerMetadata(legs, legId, metadata))
    .filter((metadata): metadata is BettingGenericMetadata => metadata?.type === "GENERIC")
    .map((metadata) => metadata.eventName)
    .join(", ");

  return `[name]${firstSelectionMetadata.marketName}[/name]${
    eventNamesAggregation.length > 0 ? ` - ${eventNamesAggregation}` : ""
  }`;
}

function buildGenericSubtitle(
  combination: BettingState.Combination,
  metadata: RunnersMetadata,
  legs: BettingState.LegsMap,
): string {
  const firstSelectionMetadata = getFirstSelectionMetadata(combination, metadata, legs);

  if (!firstSelectionMetadata) {
    return "";
  }

  const { type, runnerName, marketName } = firstSelectionMetadata;
  const eventName = type === "GENERIC" ? firstSelectionMetadata.eventName : "";

  return `[name]${runnerName}[/name] - ${marketName}${eventName.length > 0 ? ` - ${eventName}` : ""}`;
}

const createGetQuickBetslipSubtitleSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  string | null,
  (
    metadata: RunnersMetadata,
    combinations: BettingState.CombinationsMap,
    legs: BettingState.LegsMap,
    combinationId: string,
  ) => string | null
> => {
  const metadataSelector = (state: ApplicationState): RunnersMetadata => {
    const group = getBetslipGroup(state);
    const resolvers = getBettingResolvers(group);

    return resolvers.getMetadata(state);
  };

  return createSelector(
    [metadataSelector, getSportsbookBettingCombinations, getSportsbookBettingLegs, (_, combinationId) => combinationId],
    (metadata, combinations, legs, combinationId): string | null => {
      const combination = combinations[combinationId];
      if (!combination) {
        return null;
      }

      if (combination.isBoosted) {
        return buildPriceBoostMultipleSubtitle(combination, legs, metadata);
      }

      return buildGenericSubtitle(combination, metadata, legs);
    },
  );
};

const createGetQuickBetslipMoreLabelSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  string | null,
  (totalSelections: number, combinations: BettingState.CombinationsMap, combinationId: string) => string | null
> => {
  const getCombinationCounterSelector = createCombinationCounterSelector();

  return createSelector(
    [getCombinationCounterSelector, getSportsbookBettingCombinations, (_, combinationId) => combinationId],
    (totalSelections, combinations, combinationId): string | null => {
      const combination = combinations[combinationId];
      if (!combination || combination.isBoosted || totalSelections < 2) {
        return null;
      }

      return i18n({
        key: "I18N.BETSLIP.QUICK_BETSLIP.MORE",
        interpolationValues: {
          counter: totalSelections - 1,
        },
      });
    },
  );
};

export const createGetBetslipHeaderViewModel = (): OutputParametricSelector<
  ApplicationState,
  string,
  CardProps["header"],
  (
    quickBetTotalSections: number,
    title: string | null,
    subtitle: string | null,
    moreLabel: string | null,
    combinations: BettingState.CombinationsMap,
    combinationId: string,
  ) => CardProps["header"]
> => {
  const getCombinationCounterSelector = createCombinationCounterSelector();
  const getQuickBetslipTitleSelector = createQuickBetslipTitleSelector();
  const getQuickBetslipSubtitleSelector = createGetQuickBetslipSubtitleSelector();
  const getQuickBetslipMoreLabelSelector = createGetQuickBetslipMoreLabelSelector();

  return createSelector(
    [
      getCombinationCounterSelector,
      getQuickBetslipTitleSelector,
      getQuickBetslipSubtitleSelector,
      getQuickBetslipMoreLabelSelector,
      getSportsbookBettingCombinations,
      (_, combinationId) => combinationId,
    ],
    (quickBetTotalSelections, title, subtitle, moreLabel, combinations, combinationId): CardProps["header"] => {
      const combination = combinations[combinationId];
      return {
        counter: quickBetTotalSelections,
        title: title ?? "",
        subtitle: subtitle ?? "",
        moreLabel,
        isPriceBoostMultiple: combination ? isBoostedMultiple(combination) : false,
      };
    },
  );
};
