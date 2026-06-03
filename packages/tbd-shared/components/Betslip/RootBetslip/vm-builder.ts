import { ApplicationState } from "@ppb/tbd-store";
import { isBoostedMultiple } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  createGetCalculatedCombination,
  createGetGreatestOddCombinationSelector,
  createSimpleSelectionsCounterSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createSelector } from "reselect";
import { i18n } from "../../../helpers/i18n";
import { DemonstrationCombination, createBuildDemonstrationCombination } from "../betslip-mapper";
import { BET_TYPES } from "@ppb/betslip-core";

function buildCollapsedTitle(combination: DemonstrationCombination, context: string) {
  return i18n({
    key: "I18N.BETSLIP.COLLAPSED.TITLE",
    interpolationValues: {
      stake: combination.stake,
      context,
      odds: combination.odds,
      potentialReturns: combination.potentialReturns,
    },
  });
}

export const createMinimizedTitleSelector = () => {
  const DEFAULT_STAKE = 10;
  const getCalculatedCombination = createGetCalculatedCombination();
  const buildDemonstrationCombination = createBuildDemonstrationCombination();
  const getCombination = createGetGreatestOddCombinationSelector();
  const getTotalSimpleSelections = createSimpleSelectionsCounterSelector();

  return createSelector(
    [
      (state: ApplicationState) => state,
      (state: ApplicationState) => getCombination(state),
      (state: ApplicationState) => getTotalSimpleSelections(state),
    ],
    (state, combination, totalSelections): string | null => {
      // exclude boosted multiples because there were no product requirements
      if (!combination || isBoostedMultiple(combination)) return null;

      const calculatedCombination = getCalculatedCombination(state, {
        combinationId: combination.id,
        stake: DEFAULT_STAKE / combination.numLines,
      });

      if (!calculatedCombination) {
        return null;
      }

      const acca = buildDemonstrationCombination(state, calculatedCombination);

      if (!acca) {
        return null;
      }

      if (acca.betType !== BET_TYPES.SINGLE) {
        return buildCollapsedTitle(acca, acca.translatedBetType);
      }

      if (totalSelections !== 1) {
        return null;
      }

      return buildCollapsedTitle(acca, acca.translatedBetType);
    },
  );
};

export const createQuickBetslipTitleSelector = () => {
  const DEFAULT_STAKE = 10;
  const getCalculatedCombination = createGetCalculatedCombination();
  const buildDemonstrationCombination = createBuildDemonstrationCombination();
  const getCombination = createGetGreatestOddCombinationSelector();
  const getTotalSimpleSelections = createSimpleSelectionsCounterSelector();

  return createSelector(
    [
      (state: ApplicationState) => state,
      (state: ApplicationState) => getCombination(state),
      (state: ApplicationState) => getTotalSimpleSelections(state),
    ],
    (state, combination): string | null => {
      if (!combination) {
        return null;
      }

      const calculatedCombinationStake = combination.stake ? combination.stake : DEFAULT_STAKE;

      const calculatedCombination = getCalculatedCombination(state, {
        combinationId: combination.id,
        stake: calculatedCombinationStake / combination.numLines,
      });

      if (!calculatedCombination) {
        return null;
      }

      const acca = buildDemonstrationCombination(state, calculatedCombination);

      if (!acca) {
        return null;
      }

      return buildCollapsedTitle(acca, acca.translatedBetType);
    },
  );
};
