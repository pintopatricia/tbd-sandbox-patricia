import { UserWallets } from "./UserWallets.types";
import {
  FETCH_USER_WALLETS_SUCCESS,
  FETCH_USER_WALLETS_FAILURE,
  FetchUserWalletsSuccessAction,
  FetchUserWalletsFailureAction,
} from "../../../actions/user-wallets";

type ActionTypes = FetchUserWalletsSuccessAction | FetchUserWalletsFailureAction;

/** **********************
 *  User wallets state reducer  *
 *********************** */
export default (currentState: undefined | UserWallets, action: ActionTypes): UserWallets => {
  const state = currentState || null;

  switch (action.type) {
    /**
     * Update user wallets balance
     */
    case FETCH_USER_WALLETS_SUCCESS: {
      const newState = state || {};

      const userWallets = action.payload.reduce<UserWallets>(
        (acc, wallet) => {
          if (!wallet) {
            return acc;
          }

          const accum: UserWallets = {
            ...acc,
            [wallet.walletName]: {
              ...wallet,
            },
          };
          return accum;
        },
        { ...newState },
      );

      return Object.keys(userWallets as Record<string, unknown>).length > 0 ? userWallets : null;
    }
    case FETCH_USER_WALLETS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};
