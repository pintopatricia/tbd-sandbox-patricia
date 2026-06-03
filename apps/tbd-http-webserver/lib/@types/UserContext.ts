import { Jurisdiction } from "./Jurisdiction";

export type UserContext = {
  countryCode: string;
  localeCode: string;
  localeCodeBcp47: string;
  currencyCode: string;
  discount: number;
  loggedIn: boolean;
  accountID: number;
  requestCountryCode: string;
  region: string;
  timezone?: string;
  jurisdiction: {
    jurisdiction: Jurisdiction;
    capiJurisdiction: string;
  };
  exchangeLocale: string;
  exchangeContentGroup: {
    language: string;
    regionCode?: string;
  };
  minimumBSPLayLiability: number;
  minimumStake: number;
  betexRegion: string;
  isProspect: boolean;
  firstName: string;
  lastName: string;
  lastLoginDate?: string;
  jurisdictionalData?: {
    nationalIdentifier?: string;
    contractNumber?: string;
  };
};
