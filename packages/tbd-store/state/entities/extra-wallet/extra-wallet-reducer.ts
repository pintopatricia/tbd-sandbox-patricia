import { ExtraWallets } from "./ExtraWallet.types";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";
import { EXTERNAL_PUSH, ExternalPushAction, GENERIC_PUSH, GenericPushAction } from "../../../actions";
import { UI__SWITCH_PRODUCT_PREFERENCE, SwitchProductPreferenceAction } from "../../../actions/preferences";
import { GenerosityWalletCloseClickAction, UI__GENEROSITY_WALLET_CLOSE_CLICK } from "../../../actions/interface";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BettingSportsbookAccaInsuranceToggleAction,
  BettingSportsbookGhostLegToggleAction,
  BettingSportsbookApplyFreeBetsWalletsAction,
  BettingSportsbookMoneyBackToggleAction,
  BettingSportsbookPriceBoostToggleAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
} from "../../../actions/betting";

const INITIAL_STATE: ExtraWallets = {};

type ActionTypes =
  | FetchCatalogueSuccessAction
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

export default (currentState: undefined | ExtraWallets, action: ActionTypes): ExtraWallets => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      return reduceEntities(state, action.payload, "ExtraWallet");
    }
    case UI__GENEROSITY_WALLET_CLOSE_CLICK:
    case BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION:
    case BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION:
    case BETTING__SBK_ACCA_INSURANCE_TOGGLE:
    case BETTING__SBK_PRICE_BOOST_TOGGLE:
    case BETTING__SBK_MONEY_BACK_TOGGLE:
    case BETTING__SBK_GHOST_LEG_TOGGLE:
    case GENERIC_PUSH:
    case EXTERNAL_PUSH:
    case UI__SWITCH_PRODUCT_PREFERENCE:
      return INITIAL_STATE;

    default:
      return state;
  }
};
