import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { fetchUserWalletsSaga } from "../middlewares/wallet-saga";
import { FETCH_USER_MAIN_WALLET, FetchUserMainWalletAction } from "../actions/user-wallets";

const fetchUserMainWalletAction: FetchUserMainWalletAction = {
  type: FETCH_USER_MAIN_WALLET,
};
export const getWalletModule = (): ISagaModule<ApplicationState> => ({
  id: "wallet-module",
  middlewares: [],
  sagas: [fetchUserWalletsSaga],
  initialActions: [fetchUserMainWalletAction],
});
