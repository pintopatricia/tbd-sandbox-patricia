import { createSelector, ParametricSelector, Selector } from "reselect";

import { ApplicationState } from "../../ApplicationState.types";

import { BrandSettings } from "./BrandSettings.types";

export const createGetBrandSettingsSelector = (): Selector<ApplicationState, BrandSettings | null> =>
  createSelector(
    [(state: ApplicationState): ApplicationState => state],
    (state): BrandSettings | null => state.entities.brandSettings,
  );

export const createIsBrandSettingEnabledSelector = (): ParametricSelector<ApplicationState, string, boolean> => {
  const getBrandSettings = createGetBrandSettingsSelector();

  return createSelector(
    [getBrandSettings, (_, setting: string): string => setting],
    (brandSettings, setting): boolean => !!brandSettings?.[setting],
  );
};
