import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";

import { groupCombinationsByMultiLineTypes } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { getCurrentMultipleContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  createGetCastGroupSelector,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PebbleListItem } from "@ppb/the-wall-common/types";

import { generateCastTypes } from "../betslip-mapper";

export const isPebbleItemEqual = (currentPebbles: PebbleListItem[], newPebbles: PebbleListItem[]): boolean => {
  if (currentPebbles.length !== newPebbles.length) {
    return false;
  }

  return newPebbles.every((newPebbleItem, index) => {
    const { checked: newChecked, text: newText, id: newId } = newPebbleItem;
    const { checked: currentChecked, text: currentText, id: currentId } = currentPebbles[index];

    return newText === currentText && newId === currentId && newChecked === currentChecked;
  });
};

const createPebbleEqualSelector = createSelectorCreator(defaultMemoize, isPebbleItemEqual);

export const createGetCurrentMultiple = () =>
  createSelector([getSportsbookBettingCombinations, getCurrentMultipleContext], (combinations, multipleId) => {
    if (!multipleId || !combinations[multipleId]) {
      return undefined;
    }

    return combinations[multipleId];
  });

export const createGetMultipleCombinations = () =>
  createSelector([getSportsbookBettingCombinations], (combinations) => groupCombinationsByMultiLineTypes(combinations));

const buildCastTypes = () => {
  const getCastGroup = createGetCastGroupSelector();

  return createSelector(
    [getSportsbookBettingLegs, (state: ApplicationState, castGroupId: string) => getCastGroup(state, castGroupId)],
    generateCastTypes,
  );
};

export const createCastTypesBuilder = () =>
  createPebbleEqualSelector(buildCastTypes(), (castTypes: PebbleListItem[]) => castTypes);
