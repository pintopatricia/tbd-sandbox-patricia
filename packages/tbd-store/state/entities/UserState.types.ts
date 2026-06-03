import { AppVersion } from "./app-version/AppVersion.types";
import { UserPreferencesState } from "./user-preferences/UserPreferences.types";
import { UserDetailsState } from "./user-details/UserDetailsState";
import { UserWallets } from "./user-wallets/UserWallets.types";
import { ThrottlesState } from "./throttles/Throttles.types";
import { ExperimentsState } from "./experiments/Experiments.types";
import { BrandSettings } from "./brand-settings/BrandSettings.types";

export type UserState = {
  readonly productId: string | null;
  readonly appversion: AppVersion;
  readonly preferences: UserPreferencesState;
  readonly userdetails: UserDetailsState;
  readonly wallets: UserWallets;
  readonly throttles: ThrottlesState;
  readonly brandSettings: BrandSettings;
  readonly experiments: ExperimentsState;
};
