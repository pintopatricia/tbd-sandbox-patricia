import { updateApolloCacheWithNewPreferences } from "./Preferences.graphql";

export function singleChoicePreferencesUpdate() {
  updateApolloCacheWithNewPreferences();
  return;
}
