// All code here shouldn't depend on client only frameworks/code (e.g. react)

import { createSelector } from "reselect";
import { Entities, RouterState } from "..";
import { getFormattedExperiments } from "./experiments/experiments-selectors";
import { getOverridenThrottles } from "./throttles/throttles-selectors";
import {
  createUserPreferencesWithProductSwitcherSelector,
  getProductExclusions,
} from "./user-preferences/user-preferences-selectors";

export const createContextForBFFSelector = () => {
  const getUserPreferences = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [
      (entities: Entities) => getUserPreferences(entities.preferences),
      (entities: Entities) => getProductExclusions(entities),
      (entities: Entities) => getFormattedExperiments(entities),
      (entities: Entities) => getOverridenThrottles(entities),
      (_: Entities, router?: RouterState) => router || undefined,
    ],
    (userPreferences, productExclusions, experiments, throttleOverrides, router) => ({
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
    }),
  );
};
