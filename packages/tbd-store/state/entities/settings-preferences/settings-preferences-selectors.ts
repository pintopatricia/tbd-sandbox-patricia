import { createSelector, OutputParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { SettingsPreferences, SettingsPreference } from "./SettingsPreferences.types";

export const createSettingsPreferenceSelector = (): OutputParametricSelector<
  SettingsPreferences,
  string,
  SettingsPreference | undefined,
  (res1: SettingsPreferences, res2: string) => SettingsPreference | undefined
> =>
  createSelector(
    [
      (settingsPreferences: SettingsPreferences) => settingsPreferences,
      (_: SettingsPreferences, settingsPreferenceURN: URN) => settingsPreferenceURN,
    ],
    (settingsPreferences, settingsPreferenceURN): SettingsPreference | undefined =>
      settingsPreferences[settingsPreferenceURN],
  );
