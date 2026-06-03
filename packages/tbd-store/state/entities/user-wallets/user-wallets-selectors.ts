import { createSelector } from "reselect";
import { UserWallets } from "./UserWallets.types";
import { ApplicationState } from "../../ApplicationState.types";
import { WalletNames } from "../../constants";

/** ********************************
 *  User wallets state selectors  *
 ********************************* */
/**
 * Get user wallets
 */
export const getUserWallets = (state: ApplicationState): UserWallets => {
  if (!(state.entities && state.entities.wallets)) {
    return null;
  }

  return state.entities.wallets;
};

/**
 * User main wallet selector
 */
export const createGetUserMainWalletValueSelector = () =>
  createSelector([getUserWallets], (userWallets) => {
    if (userWallets && userWallets.MAIN && userWallets.MAIN.status === "SUCCESS") {
      return userWallets.MAIN.amount;
    }
    if (userWallets && userWallets.ITA && userWallets.ITA.status === "SUCCESS") {
      return userWallets.ITA.availabletobet;
    }
    return null;
  });

/**
 * User specific wallet selector
 */
export const createGetUserSpecificWalletSelector = (wallet: WalletNames) =>
  createSelector([getUserWallets], (userWallets) => (userWallets && userWallets[wallet] ? userWallets[wallet] : null));
