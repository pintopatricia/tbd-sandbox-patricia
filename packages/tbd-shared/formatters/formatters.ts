import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Distance } from "@ppb/tbd-store/state/entities/races/Race.types";

export type CurrencyArguments = {
  currencyCode: string;
  localeCodeBcp47: string;
  value: number;
  decimalPlaces?: number;
  useCustomCurrencyFormat?: boolean;
};

export type CurrencyUserDetails = Pick<CurrencyArguments, "currencyCode" | "localeCodeBcp47">;

export type CurrencyFormatters = {
  currencyFormatWithoutDecimalPlaces: (args: CurrencyArguments) => string;
  currencyFormatWithDecimalPlaces: (args: CurrencyArguments) => string;
  getCurrencySymbol: (userDetails: UserDetails, isNarrowSymbol?: boolean) => string | undefined;
};

export type DistanceFormatters = {
  raceDistance: (raceDistance: Distance) => string;
};

export type TimeFormatters = {
  secondsToDh: (seconds: number) => string;
  timeLeftFormatter: (locale: string, milisecondsLeft: number, shouldCeilAndOnlyDisplayLargestUnit?: boolean) => string;
};
