import { ExtraWalletCards } from "../Card.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  DeleteLayoutAction,
  DELETE_LAYOUT,
} from "../../../../actions/catalogue";
import { UI__GENEROSITY_WALLET_CLOSE_CLICK, GenerosityWalletCloseClickAction } from "../../../../actions/interface";
import { EXTERNAL_PUSH, ExternalPushAction, GENERIC_PUSH, GenericPushAction } from "../../../../actions";
import { SwitchProductPreferenceAction, UI__SWITCH_PRODUCT_PREFERENCE } from "../../../../actions/preferences";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BettingSportsbookAccaInsuranceToggleAction,
  BettingSportsbookApplyFreeBetsWalletsAction,
  BettingSportsbookGhostLegToggleAction,
  BettingSportsbookMoneyBackToggleAction,
  BettingSportsbookPriceBoostToggleAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
} from "../../../../actions/betting";

const INITIAL_STATE: ExtraWalletCards = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
  | DeleteLayoutAction
  | GenerosityWalletCloseClickAction
  | GenericPushAction
  | ExternalPushAction
  | BettingSportsbookApplyFreeBetsWalletsAction
  | BettingSportsbookRemoveAllCombinationWalletsAction
  | BettingSportsbookAccaInsuranceToggleAction
  | BettingSportsbookGhostLegToggleAction
  | BettingSportsbookMoneyBackToggleAction
  | BettingSportsbookPriceBoostToggleAction
  | SwitchProductPreferenceAction;

export default (currentState: undefined | ExtraWalletCards, action: ActionTypes): ExtraWalletCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const cards = action.payload.data.ExtraWalletCard || [];

      return cards.reduce<ExtraWalletCards>(
        (acc, extrawallet) => ({
          ...acc,
          [extrawallet.urn]: {
            ...extrawallet,
          },
        }),
        { ...state },
      );
    }
    case UI__GENEROSITY_WALLET_CLOSE_CLICK:
    case BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION:
    case BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION:
    case BETTING__SBK_ACCA_INSURANCE_TOGGLE:
    case BETTING__SBK_MONEY_BACK_TOGGLE:
    case BETTING__SBK_PRICE_BOOST_TOGGLE:
    case BETTING__SBK_GHOST_LEG_TOGGLE:
    case GENERIC_PUSH:
    case EXTERNAL_PUSH:
    case UI__SWITCH_PRODUCT_PREFERENCE:
    case DELETE_LAYOUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
