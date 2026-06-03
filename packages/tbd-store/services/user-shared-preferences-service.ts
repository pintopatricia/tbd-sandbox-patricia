/**
 * @file Manages preferences.
 */
import { UserSharedPreferencesService } from "@flutter-global/uki-channels-http-clients";
import { createClientFactory } from "./client-factory";

export type PreferenceApiResponse = {
  status?: string;
};

type Preference = Record<string, string>;

type PreferenceResponse = {
  status?: string;
  error?: string;
};

const userSharedPreferencesClientFactory = createClientFactory(UserSharedPreferencesService);

export default {
  /**
   * Set preference
   *
   * @returns Returns the status code of the set user preference call
   */
  async setPreference(preference: Preference): Promise<PreferenceResponse> {
    const userSharedPreferencesClient = userSharedPreferencesClientFactory("USP");
    const userSharedPreferenceResponse: PreferenceApiResponse =
      await userSharedPreferencesClient.setUserPreferences(preference);

    if (userSharedPreferenceResponse.status !== "SUCCESS") {
      throw new Error("could not update the preferences");
    }

    return userSharedPreferenceResponse;
  },
};
