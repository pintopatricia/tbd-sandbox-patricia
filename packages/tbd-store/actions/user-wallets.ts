import { Wallet } from "@flutter-global/uki-channels-http-clients/src/clients/WalletService/WalletService";
import { WalletNames } from "../state/constants";

/**
 * Action types
 */
export const FETCH_USER_WALLETS = "NETWORK/USER_WALLETS_FETCH";
export const FETCH_USER_MAIN_WALLET = "NETWORK/USER_MAIN_WALLET_FETCH";
export const FETCH_USER_WALLETS_SUCCESS = "NETWORK/USER_WALLETS_FETCH_SUCCESS";
export const FETCH_USER_WALLETS_FAILURE = "NETWORK/USER_WALLETS_FETCH_FAILURE";
export const FETCH_USER_WALLETS_AUTH_FAILURE = "NETWORK/USER_WALLETS_FETCH_AUTH_FAILURE";

/**
 * Action for fetching user main wallet
 */
export type FetchUserMainWalletAction = {
  type: typeof FETCH_USER_MAIN_WALLET;
};

/**
 * Action for fetching user wallets
 */
export type FetchUserWalletsAction = {
  type: typeof FETCH_USER_WALLETS;
  payload: WalletNames[];
};

/**
 * Action for successful user wallets fetching
 */
export type FetchUserWalletsSuccessAction = {
  type: typeof FETCH_USER_WALLETS_SUCCESS;
  payload: Wallet[];
};

/**
 * Action for failed user wallets fetching
 */
export type FetchUserWalletsFailureAction = {
  type: typeof FETCH_USER_WALLETS_FAILURE;
  error: string;
};

/**
 * Action for failed authentication on user wallets fetching
 */
export type FetchUserWalletsAuthFailureAction = {
  type: typeof FETCH_USER_WALLETS_AUTH_FAILURE;
};
