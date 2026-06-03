export enum CountryCode {
  IRELAND = "IE",
  PORTUGAL = "PT",
  UNITED_KINGDOM = "GB",
}

export enum ProductExclusion {
  Games = "GAMES",
  Virtuals = "VIRTUALS",
  Sports = "SPORTS",
}

export type JurisdictionCurrencyDetails = {
  minBspLiability: number;
  minStake: number;
  currencyCode: string;
  currencyId: number;
};

export type ExchangeSettings = {
  discount: number;
  currencyDetails: JurisdictionCurrencyDetails | null;
};

export type UserMigrationData = {
  heritageAccountId?: string;
  heritageSecondaryAccountId?: string;
  heritageSystem?: string;
  migrationInformation?: string;
  migrationDate?: string;
};

export type UserDetails = {
  accountId: number;
  loggedIn: boolean;
  isAuthenticating?: boolean;
  jurisdiction: {
    jurisdiction: string;
  };
  region: string;
  bucketId: number;
  countryCode: CountryCode;
  localeCode: string;
  localeCodeBcp47: string;
  timezone: string;
  currencyCode: string;
  excSettings: ExchangeSettings | null;
  firstName: string;
  lastName: string;
  accountOpenDate?: string;
  lastLoginDate?: string;
  jurisdictionalData?: {
    nationalIdentifier?: string;
    contractNumber?: string;
  };
  productExclusions: ProductExclusion[];
  migrationData?: UserMigrationData;
};

export type OfflineUserDetails = {
  loggedIn: boolean;
  isAuthenticating?: boolean;
  localeCode: string;
  localeCodeBcp47: string;
  timezone: string;
  countryCode: CountryCode;
};

export function isOnlineUserDetails(userDetails: UserDetailsState): userDetails is UserDetails {
  return (<UserDetails>userDetails).accountId !== undefined;
}

export type UserDetailsState = UserDetails | OfflineUserDetails;
