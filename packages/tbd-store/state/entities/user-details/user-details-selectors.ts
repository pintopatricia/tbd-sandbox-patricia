import { createSelectorCreator, defaultMemoize } from "reselect";
import { isOnlineUserDetails, OfflineUserDetails, UserDetails, UserDetailsState } from "./UserDetailsState";
import { ApplicationState } from "../../ApplicationState.types";
import { Jurisdiction } from "../../../config/Jurisdiction";

export const getUserDetails = (state: ApplicationState): UserDetails | OfflineUserDetails => {
  if (!(state.entities && state.entities.userdetails)) {
    throw new Error("non existent userdetails");
  }

  return state.entities.userdetails;
};

export const getIsAuthenticating = (state: ApplicationState): boolean => {
  if (!(state.entities && state.entities.userdetails)) return false;
  return !!state.entities.userdetails.isAuthenticating;
};

export const getUserFirstName = (state: ApplicationState): string | null => {
  if (!(state.entities && state.entities.userdetails)) return null;
  if (isOnlineUserDetails(state.entities.userdetails)) return state.entities.userdetails.firstName;
  return null;
};

/*
 * Check if exist any different between the previous and current state
 */
const isCountryLocalCurrencyCodeEquals: (previous: UserDetails, current: UserDetails) => boolean = (
  previous,
  current,
) =>
  previous?.countryCode === current?.countryCode &&
  previous?.localeCode === current?.localeCode &&
  previous?.localeCodeBcp47 === current?.localeCodeBcp47 &&
  previous?.currencyCode === current?.currencyCode &&
  previous?.timezone === current?.timezone;

export const createGetCountryLocalCurrencyCodeSelector = () =>
  createSelectorCreator(defaultMemoize, isCountryLocalCurrencyCodeEquals)(getUserDetails, (userDetails) => userDetails);

export const getUserJurisdiction = (userDetails: UserDetailsState): Jurisdiction | null => {
  if (isOnlineUserDetails(userDetails)) {
    if (!userDetails || !userDetails.jurisdiction) {
       
      return null;
    }
    return userDetails.jurisdiction.jurisdiction as Jurisdiction;
  }

  return null;
};

export const getUserRegion = (userDetails: UserDetailsState): string | null => {
  if (isOnlineUserDetails(userDetails)) {
    if (!userDetails || !userDetails.region) {
       
      return null;
    }
    return userDetails.region;
  }

  return null;
};
