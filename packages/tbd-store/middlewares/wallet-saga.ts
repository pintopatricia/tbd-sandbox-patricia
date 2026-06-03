import { call, debounce, delay, put, select, takeLatest, race, take, SagaReturnType } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

import { EntityType } from "@ppb/tbd-urn-codecs";
import { Wallet } from "@flutter-global/uki-channels-http-clients/src/clients/WalletService/WalletService";
import { Jurisdiction, WalletNames } from "../state/constants";
import walletService from "../services/wallet-service";
import { getInterval } from "../config";
import {
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
} from "../actions/betslip";
import { NETWORK__CASHOUT_TAKE_SUCCESS } from "../actions/cashout";
import {
  FetchUserWalletsAction,
  FETCH_USER_WALLETS,
  FetchUserMainWalletAction,
  FETCH_USER_MAIN_WALLET,
  FetchUserWalletsSuccessAction,
  FETCH_USER_WALLETS_SUCCESS,
  FetchUserWalletsFailureAction,
  FETCH_USER_WALLETS_FAILURE,
  FetchUserWalletsAuthFailureAction,
  FETCH_USER_WALLETS_AUTH_FAILURE,
} from "../actions/user-wallets";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
} from "../actions/my-bets";
import { FetchAppContextSuccessAction, NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";

const wallets = (jurisdiction: string): WalletNames[] => {
  const mainWallet = jurisdiction === Jurisdiction.ITALY ? WalletNames.ITA : WalletNames.MAIN;
  return [
    mainWallet,
    WalletNames.SPORTSBOOK_BONUS,
    WalletNames.EXCHANGE_BONUS_CASH,
    WalletNames.BOOST_TOKENS,
    WalletNames.SPORTSBOOK_BONUS_WAGERING,
    WalletNames.ACCA_INSURANCE_TOKENS,
    WalletNames.MONEY_BACK_TOKENS,
  ];
};

/**
 * Request data and put the payload
 */
function* request(walletsList: WalletNames[]): SagaIterator {
  try {
    const response: Wallet[] = yield call(walletService.getWallets, walletsList);
    yield put<FetchUserWalletsSuccessAction>({
      type: FETCH_USER_WALLETS_SUCCESS,
      payload: response,
    });
  } catch (error) {
    const isErrorInstance = error instanceof Error;
    if (isErrorInstance && isHttpUnauthorizedError(error)) {
      yield put<FetchUserWalletsAuthFailureAction>({
        type: FETCH_USER_WALLETS_AUTH_FAILURE,
      });
    } else {
      yield put<FetchUserWalletsFailureAction>({
        type: FETCH_USER_WALLETS_FAILURE,
        error: isErrorInstance ? error.message : `Unknown error ${error}`,
      });
    }
  }
}

/**
 * Method that will handle requesting and polling
 */
function* pollUserMainWallet(jurisdiction: string): SagaIterator {
  // Polling
  while (true) {
    const isUnderMaintenance = (yield select((state) => state.router.currentView)) === EntityType.MaintenanceView;

    if (isUnderMaintenance) {
      return;
    }

    yield call(request, wallets(jurisdiction));
    yield delay(getInterval("WAS"));
  }
}

/**
 * Method that will handle a single WAS request
 */
function* requestUserWallets(action: FetchUserWalletsAction): SagaIterator {
  yield call(request, action.payload);
}

/**
 * Start polling when APP_CONTEXT__FETCH is dispatched and change the loggedIn data to true
 */
function* requestWallet(jurisdiction: string, action: FetchAppContextSuccessAction): SagaIterator {
  if (action.payload.initialState?.entities?.userdetails?.loggedIn) {
    yield call(pollUserMainWallet, jurisdiction);
  }
}

/**
 * Saga that takes every `FETCH_USER_MAIN_WALLET`, `NETWORK__PLACE_SBK_BET_SUCCESS`,
 * `NETWORK__PLACE_EXC_BET_SUCCESS`, `NETWORK__UPDATE_EXC_BET_SUCCESS and
 * `NETWORK__CANCEL_EXC_BET_SUCCESS`, `NETWORK__FETCH_APP_CONTEXT_SUCCESS` request and triggers the polling
 * Saga that takes every `FETCH_USER_MAIN_WALLET` and `FETCH_USER_WALLET` and
 * triggers the polling for main wallet and request the full wallets
 */
export function* fetchUserWalletsSaga(): SagaIterator {
  const {
    loggedIn,
    jurisdiction: { jurisdiction },
  } = yield select(getUserDetails);

  if (loggedIn) {
    yield takeLatest(
      [
        FETCH_USER_MAIN_WALLET,
        NETWORK__PLACE_SBK_BET_SUCCESS,
        NETWORK__PLACE_EXC_BET_SUCCESS,
        NETWORK__OBB_PLACE_BET_SUCCESS,
        NETWORK__UPDATE_EXC_BET_SUCCESS,
        NETWORK__CANCEL_EXC_BET_SUCCESS,
        NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
        NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
      ],
      pollUserMainWallet,
      jurisdiction,
    );

    // Debounce due to some delays on WAS update after a cashout
    yield debounce(200, NETWORK__CASHOUT_TAKE_SUCCESS, request, wallets(jurisdiction));
    yield takeLatest(FETCH_USER_WALLETS, requestUserWallets);
  }

  yield takeLatest(NETWORK__FETCH_APP_CONTEXT_SUCCESS, requestWallet, jurisdiction);
}

type WalletRaceResult = {
  success: FetchUserWalletsSuccessAction;
  failure: FetchUserWalletsFailureAction;
};

export function* refreshWallet(): SagaIterator<WalletRaceResult> {
  yield put<FetchUserMainWalletAction>({ type: FETCH_USER_MAIN_WALLET });

  const { success, failure }: WalletRaceResult = yield race({
    success: take(FETCH_USER_WALLETS_SUCCESS),
    failure: take(FETCH_USER_WALLETS_FAILURE),
  });

  return { success, failure };
}

export type RefreshWalletReturn = SagaReturnType<typeof refreshWallet>;
