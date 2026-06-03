import { BetslipState, TaggingMetadataState, TaggingMetadataSelections } from "./Betslip.types";
import {
  BetslipBetBuilderAddSelectionsAction,
  BetslipBetBuilderMultisDismissNotificationAction,
  BetslipCloseAction,
  BetslipCollapseToggleAction,
  BetslipExchangeBonusChangeAction,
  BetslipExchangeConfirmBetsClickAction,
  BetslipExchangeConfirmPanelBackClickAction,
  BetslipExchangeIncrementSizeAction,
  BetslipExchangeMatchedPanelDoneClickAction,
  BetslipExchangePriceInputChangeAction,
  BetslipExchangePriceNudgeDownClickAction,
  BetslipExchangePriceNudgeUpClickAction,
  BetslipExchangeRemovePotentialBetClickAction,
  BetslipExchangeReportBetEditClickAction,
  BetslipExchangeSizeInputChangeAction,
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeUnmatchedDoneClickAction,
  BetslipExchangeUnmatchedPersistenceItemClickAction,
  BetslipExchangeUnmatchedPersistenceListClickAction,
  BetslipExchangeUnmatchedPriceInputChangeAction,
  BetslipExchangeUnmatchedPriceNudgeDownClickAction,
  BetslipExchangeUnmatchedPriceNudgeUpClickAction,
  BetslipExchangeUnmatchedSizeInputChangeAction,
  BetslipHeaderClickAction,
  BetslipMaxPayoutNotificationAcceptedAction,
  BetslipObbReceiptPanelDoneClickAction,
  BetslipSportsbookCastBetChange,
  BetslipSportsbookConfirmCastBetChange,
  BetslipSportsbookMultipleBetTypeClick,
  BetslipSportsbookReAddSelectionsClickAction,
  BetslipSportsbookRemoveLegClick,
  CancelExchangeBetFailureAction,
  CancelExchangeBetInProgressAction,
  CancelExchangeBetSuccessAction,
  PlaceExchangeBetFailureAction,
  PlaceExchangeBetInProgressAction,
  PlaceExchangeBetSuccessAction,
  PlaceSportsbookBetFailureAction,
  PlaceSportsbookBetInProgressAction,
  PlaceSportsbookBetSuccessAction,
  SearchExchangeOrdersSuccessAction,
  SportsbookCombinationsUpdateSuccessAction,
  UpdateExchangeBetFailureAction,
  UpdateExchangeBetInProgressAction,
  UpdateExchangeBetSuccessAction,
  PlaceObbBetInProgressAction,
  PlaceObbBetSuccessAction,
  PlaceObbBetFailureAction,
  BetslipSportsbookOddsMovementPrefChange,
  NETWORK__CANCEL_EXC_BET_FAILURE,
  NETWORK__CANCEL_EXC_BET_IN_PROGRESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_FAILURE,
  NETWORK__PLACE_EXC_BET_IN_PROGRESS,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__PLACE_SBK_BET_FAILURE,
  NETWORK__PLACE_SBK_BET_IN_PROGRESS,
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__SEARCH_EXC_ORDERS_SUCCESS,
  NETWORK__UPDATE_EXC_BET_FAILURE,
  NETWORK__UPDATE_EXC_BET_IN_PROGRESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_IN_PROGRESS,
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  UI__BETSLIP_CLOSE_CLICK,
  UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION,
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
  UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
  UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK,
  UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK,
  UI__BETSLIP_SBK_CAST_BET_CHANGE,
  UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK,
  UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
  NETWORK__OBB_PLACE_BET_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
  UI__BETSLIP_COLLAPSE_ACTION,
  BetslipCollapseAction,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
  BetslipSetLastSuccessfulStakeAction,
} from "../../actions/betslip";
import {
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  MarketExchangeBetButtonClickAction,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  MarketSportsbookBetButtonClickAction,
  BETTING__ADD_POTENTIAL_BET_ACTION,
  AddPotentialBetAction,
  RemovePotentialBetAction,
  BETTING__SBK_STATE_UPDATE,
  BettingSportsbookStateUpdateAction,
  BETTING__SBK_ADD_SELECTION_TAGGING,
  BettingSportsbookAddSelectionTaggingAction,
  BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS,
  BettingSportsbookEnsureSelectionDataSuccess,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BettingSportsbookLoadStorageActionSuccess,
  BettingDepositToPlaceBetAction,
  BettingExchangePlaceBetsAction,
  BettingSportsbookConfirmBetsAction,
  BettingSportsbookEditBetsAction,
  BettingSportsbookPlaceBetsAction,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__EXC_PLACE_BETS,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SBK_EDIT_BETS,
  BETTING__SBK_PLACE_BETS,
  BettingDepositToPlaceCancel,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BettingSportsbookCreateSportsbookConfirmationAction,
  BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
  BettingSportsbookConfirmationOddsMovementAction,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BettingSportsbookRemoveSportsbookConfirmationAction,
  BETTING__DEPOSIT_TO_PLACE_CANCEL,
  BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION,
  InvalidUpdateUnmatchedBetAction,
  BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION,
  ValidUpdateUnmatchedBetAction,
  BETTING__SBK_CLEAR_ACTION,
  BettingSportsbookClearAction,
  BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO,
  BettingBetslipLoadMaxPayoutInfoAction,
  BettingSportsbookUpdateSportsbookConfirmationFailuresAction,
  BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
  BETTING__OBB_UPDATE_ODDS_MOVEMENT,
  BettingObbUpdateOddsMovementAction,
  UI__OBB_BET_BUTTON_CLICK,
  ObbBetButtonClickAction,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BettingObbToggleLegAction,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BettingSportsbookToggleLegAction,
  BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
  BettingSportsbookGenerosityWalletBetAction,
  BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION,
  BettingSportsbookGenerosityWalletsCloseAction,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  BettingObbUpdateTaggingMetadata,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BettingSportsbookApplyFreeBetsWalletsAction,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
  BettingSportsbookToggleOneLineLegAction,
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BettingSportsbookAccaInsuranceToggleAction,
  BettingSportsbookPriceBoostToggleAction,
  BettingSportsbookGhostLegToggleAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BettingSportsbookMoneyBackToggleAction,
  BETTING__SBK_PLACE_FAILED_UPDATE,
  BettingSportsbookPlaceFailedUpdateAction,
  BettingUpdateLike,
} from "../../actions/betting";
import {
  NETWORK__CASHOUT_TAKE_FAILURE,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  TakeCashoutSuccessAction,
  TakeCashoutFailureAction,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
  TakeCashoutFailureSbkAction,
} from "../../actions/cashout";
import { groupCombinationsByMarketId, isMultiple } from "../../helpers/sportsbook-betting";
import { SBK_MAX_LEGS } from "../../config/common-config";
import { obbOddsMovementReducer, sbkOddsMovementReducer } from "./betslip-odds-movement-reducer";
import handicapMovementReducer from "./betslip-handicap-movement-reducer";
import {
  MyBetsExchangeBetEditPressAction,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  MyBetsExchangeBetEditCloseAction,
  UI__MY_BETS_EXC_EDIT_BET_CLOSE,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
  MyBetsSportsbookAddPreviousSelectionsClickAction,
} from "../../actions/my-bets";
import { BOTTOM_BAR_PUSH, BottomBarPushAction, PUSH, PushAction } from "../../actions";
import {
  FetchAppContextAuthFailureAction,
  FetchAppContextSuccessAction,
  InvalidSessionAction,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../../actions/app-context";
import { NavigationTabClickAction, UI__NAVIGATION_TAB_CLICK } from "../../actions/interface";
import { SwitchProductPreferenceAction, UI__SWITCH_PRODUCT_PREFERENCE } from "../../actions/preferences";
import { ProductsOption } from "../entities/user-preferences/UserPreferences.types";

type ActionTypes =
  | AddPotentialBetAction
  | BetslipBetBuilderAddSelectionsAction
  | BetslipBetBuilderMultisDismissNotificationAction
  | BetslipCloseAction
  | BetslipCollapseToggleAction
  | BetslipExchangeBonusChangeAction
  | BetslipExchangeConfirmBetsClickAction
  | BetslipExchangeConfirmPanelBackClickAction
  | BetslipExchangeIncrementSizeAction
  | BetslipExchangeMatchedPanelDoneClickAction
  | BetslipExchangePriceInputChangeAction
  | BetslipExchangePriceNudgeDownClickAction
  | BetslipExchangePriceNudgeUpClickAction
  | BetslipExchangeRemovePotentialBetClickAction
  | BetslipExchangeReportBetEditClickAction
  | BetslipExchangeSizeInputChangeAction
  | BetslipExchangeUnmatchedCancelClickAction
  | BetslipExchangeUnmatchedDoneClickAction
  | BetslipExchangeUnmatchedPersistenceItemClickAction
  | BetslipExchangeUnmatchedPersistenceListClickAction
  | BetslipExchangeUnmatchedPriceInputChangeAction
  | BetslipExchangeUnmatchedPriceNudgeDownClickAction
  | BetslipExchangeUnmatchedPriceNudgeUpClickAction
  | BetslipExchangeUnmatchedSizeInputChangeAction
  | BetslipHeaderClickAction
  | BetslipMaxPayoutNotificationAcceptedAction
  | BetslipObbReceiptPanelDoneClickAction
  | BetslipSportsbookCastBetChange
  | BetslipSportsbookConfirmCastBetChange
  | BetslipSportsbookMultipleBetTypeClick
  | BetslipSportsbookReAddSelectionsClickAction
  | BetslipSportsbookRemoveLegClick
  | BettingBetslipLoadMaxPayoutInfoAction
  | BettingDepositToPlaceBetAction
  | BettingDepositToPlaceCancel
  | BettingExchangePlaceBetsAction
  | BettingObbUpdateOddsMovementAction
  | BettingSportsbookCreateSportsbookConfirmationAction
  | BettingSportsbookConfirmationOddsMovementAction
  | BettingSportsbookUpdateSportsbookConfirmationFailuresAction
  | BettingSportsbookRemoveSportsbookConfirmationAction
  | BettingSportsbookAddSelectionTaggingAction
  | BettingSportsbookClearAction
  | BettingSportsbookConfirmBetsAction
  | BettingSportsbookEditBetsAction
  | BettingSportsbookEnsureSelectionDataSuccess
  | BettingSportsbookLoadStorageActionSuccess
  | BettingSportsbookPlaceBetsAction
  | BettingSportsbookStateUpdateAction
  | CancelExchangeBetFailureAction
  | CancelExchangeBetInProgressAction
  | CancelExchangeBetSuccessAction
  | InvalidUpdateUnmatchedBetAction
  | MarketExchangeBetButtonClickAction
  | MarketSportsbookBetButtonClickAction
  | ObbBetButtonClickAction
  | MyBetsExchangeBetEditCloseAction
  | MyBetsExchangeBetEditPressAction
  | PlaceExchangeBetFailureAction
  | PlaceExchangeBetInProgressAction
  | PlaceExchangeBetSuccessAction
  | PlaceObbBetInProgressAction
  | PlaceObbBetSuccessAction
  | PlaceSportsbookBetFailureAction
  | PlaceSportsbookBetInProgressAction
  | PlaceSportsbookBetSuccessAction
  | RemovePotentialBetAction
  | SearchExchangeOrdersSuccessAction
  | TakeCashoutFailureAction
  | TakeCashoutSuccessAction
  | UpdateExchangeBetFailureAction
  | UpdateExchangeBetInProgressAction
  | UpdateExchangeBetSuccessAction
  | BettingObbToggleLegAction
  | BettingSportsbookToggleLegAction
  | ValidUpdateUnmatchedBetAction
  | PlaceObbBetFailureAction
  | ValidUpdateUnmatchedBetAction
  | BettingSportsbookGenerosityWalletBetAction
  | BettingSportsbookRemoveAllCombinationWalletsAction
  | BettingSportsbookAccaInsuranceToggleAction
  | BettingSportsbookMoneyBackToggleAction
  | BettingSportsbookPriceBoostToggleAction
  | BettingSportsbookGhostLegToggleAction
  | BettingSportsbookGenerosityWalletsCloseAction
  | BettingSportsbookApplyFreeBetsWalletsAction
  | BettingObbUpdateTaggingMetadata
  | BettingObbUpdateTaggingMetadata
  | SportsbookCombinationsUpdateSuccessAction
  | BetslipCollapseAction
  | BottomBarPushAction
  | MyBetsSportsbookAddPreviousSelectionsClickAction
  | BettingSportsbookToggleOneLineLegAction
  | BettingSportsbookPlaceFailedUpdateAction
  | TakeCashoutFailureSbkAction
  | PushAction
  | NavigationTabClickAction
  | BetslipSportsbookOddsMovementPrefChange
  | SwitchProductPreferenceAction
  | BetslipSetLastSuccessfulStakeAction
  | InvalidSessionAction
  | FetchAppContextAuthFailureAction
  | FetchAppContextSuccessAction;

const INITIAL_STATE: BetslipState = {
  activeProduct: "NONE",
  isCollapsed: false,
  isBetBuilderMultisNotificationVisible: true,
  isFreeBetsSelected: false,
  hasSportsbookTechnicalError: false,
  step: "PLACE_POTENTIAL",
  placeStatus: "NONE",
  sportsbookOddsMovement: {},
  obbTaggingMetadata: {},
  obbOddsMovement: {},
  sportsbookHandicapMovement: {},
  taggingMetadata: {
    selections: {},
  },
  isDepositRedirect: false,
  group: "REAL",
  showMaxPayoutNotification: true,
  keepOpenOnNavigation: false,
  hasUserChangedOddsMovementPreference: false,
  lastSuccessfulStake: undefined,
};

const removeRunnerFromTaggingMetadataSelections = (
  selections: TaggingMetadataSelections,
  runnerUrn: string,
): TaggingMetadataSelections =>
  Object.keys(selections)
    .filter((urn) => urn !== runnerUrn)
    .reduce(
      (acc: TaggingMetadataSelections, urn: string) => ({
        ...acc,
        [urn]: selections[urn],
      }),
      {},
    );

function getTaggingMetadata(state: BetslipState, urn: string, uniqueId: string): TaggingMetadataState {
  const { taggingMetadata } = state;

  return {
    ...taggingMetadata,
    selections: {
      ...taggingMetadata.selections,
      [urn]: { urn, uniqueId },
    },
  };
}

function updateTaggingMetadata(
  taggingMetadata: TaggingMetadataState,
  selections: { runnerUrn: string; uniqueId: string }[],
): TaggingMetadataState {
  return {
    ...taggingMetadata,
    selections: selections.reduce(
      (currentTagging, { runnerUrn, uniqueId }) => ({ ...currentTagging, [runnerUrn]: { urn: runnerUrn, uniqueId } }),
      taggingMetadata.selections,
    ),
  };
}

function updateMultipleContext(state: BetslipState, action: BettingUpdateLike): BetslipState {
  const currentMultipleContext = state.sportsbookMultipleContext;
  const { combinations } = action.payload.state;

  if (currentMultipleContext && combinations[currentMultipleContext]) {
    return state;
  }

  const [firstValidAccumulator] = Object.values(combinations)
    .filter((combination) => isMultiple(combination))
    .sort((combinationA, combinationB) => combinationA.numLines - combinationB.numLines);

  return {
    ...state,
    sportsbookMultipleContext: firstValidAccumulator?.id,
  };
}
function updateCastContext(state: BetslipState, action: BettingUpdateLike): BetslipState {
  const currentCastContext = state.sportsbookCastContext;
  const castGroups = groupCombinationsByMarketId(action.payload.state);
  const newCastContext = Object.values(castGroups).reduce((finalCastContext, castGroup) => {
    const { combinations } = castGroup;
    const currentCastGroupCombinationId = currentCastContext && currentCastContext[castGroup.id];
    const chosenCastCombination = combinations.find(({ id }) => id === currentCastGroupCombinationId)
      ? currentCastGroupCombinationId
      : combinations[0].id;

    return {
      ...finalCastContext,
      [castGroup.id]: chosenCastCombination,
    };
  }, {});

  return {
    ...state,
    sportsbookCastContext: newCastContext,
  };
}

/** *********************
 *  Betslip UI Reducer  *
 ********************** */
export default (currentState: undefined | BetslipState, action: ActionTypes): BetslipState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED: {
      return {
        ...state,
        showMaxPayoutNotification: false,
      };
    }
    case BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO: {
      return {
        ...state,
        showMaxPayoutNotification: action.payload,
      };
    }
    case UI__BETSLIP_CLOSE_CLICK: {
      return {
        ...INITIAL_STATE,
        lastSuccessfulStake: state.lastSuccessfulStake,
        exchangeEdit: {
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        },
      };
    }
    case PUSH:
    case UI__NAVIGATION_TAB_CLICK: {
      if (state.activeProduct === "EXCHANGE") {
        if (state.keepOpenOnNavigation) {
          return {
            ...state,
            keepOpenOnNavigation: false,
          };
        }
        return {
          ...state,
          exchangeContext: undefined,
          exchangeReport: undefined,
          exchangePlaceError: undefined,
          exchangeEdit: undefined,
        };
      }
      return state;
    }
    case BETTING__SBK_CONFIRM_BETS:
      return {
        ...state,
        step: "CONFIRM_POTENTIAL",
      };
    case BETTING__SBK_EDIT_BETS:
      return {
        ...state,
        step: "PLACE_POTENTIAL",
      };
    case BETTING__DEPOSIT_TO_PLACE_BET: {
      return {
        ...state,
        exchangePlaceError: undefined,
        isDepositRedirect: true,
      };
    }
    case BETTING__DEPOSIT_TO_PLACE_CANCEL:
    case BETTING__SBK_PLACE_BETS: {
      return {
        ...state,
        isDepositRedirect: false,
        hasUserChangedOddsMovementPreference: false,
      };
    }
    case NETWORK__SBK_COMBINATIONS_UPDATE_SUCCESS: {
      const { wallets, betCombinations } = action.payload.combinations[0];

      const hasGenerosityWallets = !!wallets?.length;
      const hasGenerosityTokens = betCombinations.some(
        ({ tokens: { accaInsuranceTokens, priceBoostTokens, moneyBackTokens, ghostLegTokens } = {} }) =>
          !!accaInsuranceTokens?.length ||
          !!priceBoostTokens?.length ||
          !!moneyBackTokens?.length ||
          !!ghostLegTokens?.length,
      );

      return {
        ...state,
        isGenerosityActive: hasGenerosityWallets || hasGenerosityTokens,
        hasGenerosityWallets,
        hasGenerosityTokens,
      };
    }
    case BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION:
      return {
        ...state,
        sportsbookConfirmation: action.payload,
      };
    case BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT:
    case BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES:
      return {
        ...state,
        sportsbookConfirmation: {
          combinations: {},
          failures: {},
          legs: {},
          availabilityChanged: false,
          runners: {},
          castContext: {},
          ...state.sportsbookConfirmation,
          ...action.payload,
        },
      };
    case BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION:
      return {
        ...state,
        sportsbookConfirmation: undefined,
      };
    case UI__MARKET_EXC_BET_BUTTON_CLICK: {
      const { urn, uniqueId } = action.payload;
      return {
        ...state,
        isCollapsed: false,
        isFreeBetsSelected: false,
        activeProduct: "EXCHANGE",
        step: "PLACE_POTENTIAL",
        exchangeContext: undefined,
        exchangePlaceError: undefined,
        exchangeReport: undefined,
        exchangeEdit: {
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        },
        taggingMetadata: getTaggingMetadata(state, urn, uniqueId),
      };
    }
    case BETTING__ADD_POTENTIAL_BET_ACTION: {
      return {
        ...state,
        exchangeContext: {
          market: action.payload.marketURN,
          runner: action.payload.runner,
          side: action.payload.side,
          marketDepth: action.payload.marketDepth,
        },
      };
    }
    case BETTING__SBK_PLACE_FAILED_UPDATE:
    case BETTING__SBK_STATE_UPDATE: {
      const updatedBetslipCard = sbkOddsMovementReducer(
        updateCastContext(updateMultipleContext(handicapMovementReducer(state, action), action), action),
        action,
      );

      return {
        ...updatedBetslipCard,
        group: "group" in action.payload && action.payload.group ? action.payload.group : state.group,
      };
    }
    case BETTING__OBB_UPDATE_ODDS_MOVEMENT: {
      const updatedBetslipCard = obbOddsMovementReducer(state, action);

      return {
        ...updatedBetslipCard,
      };
    }
    case BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION: {
      return {
        ...state,
        activeProduct: "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        hasSportsbookTechnicalError: false,
        sportsbookReport: undefined,
        exchangeContext: undefined,
      };
    }
    case BETTING__SBK_ADD_SELECTION_TAGGING:
    case UI__MARKET_SBK_BET_BUTTON_CLICK: {
      const { urn, uniqueId } = action.payload;
      const numberOfSelections = Object.keys(state.taggingMetadata.selections).length;
      const taggingMetadata =
        numberOfSelections < SBK_MAX_LEGS ? getTaggingMetadata(state, urn, uniqueId) : state.taggingMetadata;

      return {
        ...state,
        taggingMetadata,
        activeProduct: "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        hasSportsbookTechnicalError: false,
        sportsbookReport: undefined,
        exchangeContext: undefined,
      };
    }
    case UI__OBB_BET_BUTTON_CLICK: {
      return {
        ...state,
        activeProduct: "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        hasSportsbookTechnicalError: false,
        sportsbookReport: undefined,
        exchangeContext: undefined,
      };
    }
    case BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS: {
      return {
        ...state,
        group: action.payload.group,
        activeProduct: "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        taggingMetadata: updateTaggingMetadata(
          state.taggingMetadata,
          action.payload.selections.map((selection) => ({
            runnerUrn: selection.runnerUrn,
            uniqueId: selection.uniqueId || Date.now().toString(),
          })),
        ),
        hasSportsbookTechnicalError: false,
        sportsbookReport: undefined,
        exchangeContext: undefined,
      };
    }
    case UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS: {
      return {
        ...state,
        taggingMetadata: updateTaggingMetadata(state.taggingMetadata, [
          {
            runnerUrn: action.payload.selection.runnerUrn,
            uniqueId: action.payload.selection.uniqueId,
          },
        ]),
      };
    }
    case UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION: {
      return {
        ...state,
        isBetBuilderMultisNotificationVisible: false,
      };
    }
    case UI__BETSLIP_SET_COLLAPSE_ACTION: {
      return {
        ...state,
        isCollapsed: action.payload.collapse,
      };
    }
    case BETTING__EXC_PLACE_BETS:
      return {
        ...state,
        isDepositRedirect: false,
        step: action.payload.confirmFirst ? "CONFIRM_POTENTIAL" : state.step,
      };
    case UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK:
    case UI__BETSLIP_EXC_RECEIPT_PANEL_DONE_CLICK:
      return {
        ...state,
        isCollapsed: true,
        exchangeReport: undefined,
        exchangeEdit: {
          betId: "",
          isPersistenceTypeMenuExpanded: false,
        },
        exchangeContext: undefined,
      };
    case UI__BETSLIP_EXC_REPORT_EDIT_BET_CLICK:
      return {
        ...state,
        step: "EDIT_UNMATCHED",
        exchangePlaceError: undefined,
        exchangeEdit: {
          betId: action.payload.betId,
          isPersistenceTypeMenuExpanded: action.payload.isPersistenceTypeMenuExpanded,
        },
      };
    case UI__MY_BETS_EXC_EDIT_BET_PRESS: {
      const { betId } = action.payload;
      return {
        ...state,
        isCollapsed: false,
        activeProduct: "EXCHANGE",
        step: "EDIT_UNMATCHED",
        keepOpenOnNavigation: true,
        exchangeContext: {
          market: action.payload.marketUrn,
          runner: action.payload.runner,
          side: action.payload.side,
          marketDepth: 0,
        },
        exchangeEdit: {
          betId,
          isPersistenceTypeMenuExpanded: false,
          order: undefined,
        },
      };
    }
    case UI__MY_BETS_EXC_EDIT_BET_CLOSE: {
      return {
        ...state,
        exchangeEdit: undefined,
        exchangeContext: undefined,
      };
    }
    case BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION: {
      const { betId, order } = action.payload;
      return {
        ...state,
        exchangePlaceError: undefined,
        exchangeEdit: {
          betId,
          order,
          isPersistenceTypeMenuExpanded: state.exchangeEdit?.isPersistenceTypeMenuExpanded ?? false,
        },
      };
    }
    case BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION: {
      const {
        betId,
        order: { price, size },
      } = action.payload;

      return {
        ...state,
        exchangePlaceError: undefined,
        exchangeEdit: {
          betId,
          isPersistenceTypeMenuExpanded: state.exchangeEdit?.isPersistenceTypeMenuExpanded ?? false,
          order: {
            ...state.exchangeEdit?.order,
            price: price === undefined ? null : price,
            size: size === undefined ? null : size,
            validations: {},
          },
        },
      };
    }
    case UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK: {
      return {
        ...state,
        exchangeEdit: {
          ...state.exchangeEdit,
          betId: action.payload.betId,
          isPersistenceTypeMenuExpanded: action.payload.isPersistenceTypeMenuExpanded,
        },
      };
    }
    case UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK: {
      const { betId, persistenceType } = action.payload;

      return {
        ...state,
        exchangeEdit: {
          ...state.exchangeEdit,
          betId,
          isPersistenceTypeMenuExpanded: state.exchangeEdit?.isPersistenceTypeMenuExpanded ?? false,
          order: {
            ...state.exchangeEdit?.order,
            validations: {
              ...state.exchangeEdit?.order?.validations,
            },
            persistenceType,
          },
        },
      };
    }
    case UI__BETSLIP_EXC_BONUS_CHANGE: {
      return {
        ...state,
        exchangePlaceError: undefined,
        isFreeBetsSelected: action.payload.isFreeBetsSelected,
      };
    }
    case UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK:
    case BETTING__SBK_CLEAR_ACTION:
      return {
        ...state,
        taggingMetadata: {
          selections: {},
        },
      };
    case UI__BETSLIP_SBK_REMOVE_LEG_CLICK: {
      const { selections } = state.taggingMetadata;
      const { runnerUrn } = action.payload;
      return {
        ...state,
        taggingMetadata: {
          ...state.taggingMetadata,
          selections: removeRunnerFromTaggingMetadataSelections(selections, runnerUrn),
        },
      };
    }
    case UI__BETSLIP_OBB_RECEIPT_PANEL_DONE_CLICK:
      return {
        ...state,
        step: "PLACE_POTENTIAL",
        isCollapsed: true,
        obbReport: undefined,
      };
    case UI__BETSLIP_SBK_MULTIPLE_BET_TYPE_CLICK:
      return {
        ...state,
        sportsbookMultipleContext: action.payload.combinationId,
      };
    case UI__BETSLIP_SBK_CAST_BET_CHANGE:
      return {
        ...state,
        sportsbookCastContext: {
          ...state.sportsbookCastContext,
          [action.payload.castId]: action.payload.combinationId,
        },
      };
    case UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE:
      return {
        ...state,
        sportsbookConfirmation: state.sportsbookConfirmation
          ? {
              ...state.sportsbookConfirmation,
              castContext: {
                ...state.sportsbookConfirmation.castContext,
                [action.payload.castId]: action.payload.combinationId,
              },
            }
          : undefined,
      };
    case UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK:
      return {
        ...state,
        step: "EDIT_POTENTIAL",
        exchangePlaceError: undefined,
        exchangeEdit: {
          betId: "",
          isPersistenceTypeMenuExpanded: state.exchangeEdit?.isPersistenceTypeMenuExpanded ?? false,
        },
      };
    case UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK:
      return {
        ...state,
        step: "CANCEL_BET",
        exchangePlaceError: undefined,
      };
    case UI__BETSLIP_EXC_SIZE_INPUT_CHANGE:
    case UI__BETSLIP_EXC_PRICE_INPUT_CHANGE:
    case UI__BETSLIP_EXC_PRICE_NUDGE_UP:
    case UI__BETSLIP_EXC_PRICE_NUDGE_DOWN:
    case UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION:
    case UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN:
    case UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP:
    case UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE:
    case UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE:
      return {
        ...state,
        exchangePlaceError: undefined,
      };
    case NETWORK__PLACE_EXC_BET_IN_PROGRESS:
      return {
        ...state,
        placeStatus: "INPROGRESS",
        exchangeReport: undefined,
        exchangePlaceError: undefined,
      };
    case NETWORK__PLACE_EXC_BET_SUCCESS:
      return {
        ...state,
        step: "REPORT",
        placeStatus: "SUCCESS",
        exchangeReport: action.payload.report,
        exchangePlaceError: undefined,
        isCollapsed: false,
        taggingMetadata: {
          selections: {},
        },
      };
    case NETWORK__PLACE_EXC_BET_FAILURE:
      return {
        ...state,
        placeStatus: "FAILURE",
        exchangeReport: undefined,
        exchangePlaceError: action.payload.error,
        isCollapsed: false,
      };
    case NETWORK__UPDATE_EXC_BET_IN_PROGRESS:
      return {
        ...state,
        isCollapsed: true, // TODO: this is temporary, in the next US we will do the receipt
        updateStatus: "INPROGRESS",
        placeStatus: "NONE",
        exchangeReport: undefined,
        exchangePlaceError: undefined,
      };
    case NETWORK__UPDATE_EXC_BET_SUCCESS:
      return {
        ...state,
        step: "REPORT",
        updateStatus: "SUCCESS",
        exchangeReport: action.payload.report,
        exchangePlaceError: undefined,
        isCollapsed: false,
        taggingMetadata: {
          selections: {},
        },
      };
    case NETWORK__UPDATE_EXC_BET_FAILURE:
      return {
        ...state,
        updateStatus: "FAILURE",
        isCollapsed: false,
        exchangeReport: undefined,
        exchangePlaceError: action.payload.error,
      };
    case NETWORK__PLACE_SBK_BET_IN_PROGRESS:
      return {
        ...state,
        placeStatus: "INPROGRESS",
        hasSportsbookTechnicalError: false,
      };
    case NETWORK__OBB_PLACE_BET_IN_PROGRESS:
      return {
        ...state,
        placeStatus: "INPROGRESS",
      };
    case NETWORK__PLACE_SBK_BET_SUCCESS:
      return {
        ...state,
        step: "REPORT",
        placeStatus: "SUCCESS",
        sportsbookOddsMovement: {},
        sportsbookHandicapMovement: {},
        hasSportsbookTechnicalError: false,
        sportsbookReport: action.payload.report,
        isCollapsed: false,
        taggingMetadata: {
          selections: {},
        },
      };
    case NETWORK__OBB_PLACE_BET_SUCCESS:
      return {
        ...state,
        step: "REPORT",
        placeStatus: "SUCCESS",
        obbOddsMovement: {},
        obbReport: action.payload,
        isCollapsed: false,
        taggingMetadata: {
          selections: {},
        },
      };
    case NETWORK__OBB_PLACE_BET_FAILURE:
      return {
        ...state,
        placeStatus: "FAILURE",
        obbReport: undefined,
        isCollapsed: false,
      };
    case NETWORK__PLACE_SBK_BET_FAILURE:
      return {
        ...state,
        placeStatus: "FAILURE",
        hasSportsbookTechnicalError: action.payload.isTechnical,
        sportsbookReport: undefined,
        isCollapsed: false,
      };
    case NETWORK__SEARCH_EXC_ORDERS_SUCCESS:
      return {
        ...state,
        step: action.payload.step || state.step,
        exchangeReport: action.payload.report,
        exchangeEdit: action.payload.exchangeEdit,
      };
    case NETWORK__CANCEL_EXC_BET_IN_PROGRESS:
      return {
        ...state,
        step: "REPORT",
        cancelStatus: "INPROGRESS",
        exchangeReport: undefined,
        exchangeCancelError: undefined,
      };
    case NETWORK__CANCEL_EXC_BET_SUCCESS:
      return {
        ...state,
        step: "REPORT",
        cancelStatus: "SUCCESS",
        exchangeReport: action.payload.report,
        exchangeCancelError: undefined,
        isCollapsed: false,
        taggingMetadata: {
          selections: {},
        },
      };
    case NETWORK__CANCEL_EXC_BET_FAILURE:
      return {
        ...state,
        step: "REPORT",
        cancelStatus: "FAILURE",
        exchangeReport: undefined,
        exchangeCancelError: action.payload.error,
        isCollapsed: false,
      };
    case NETWORK__CASHOUT_TAKE_SUCCESS:
    case NETWORK__CASHOUT_TAKE_FAILURE:
    case NETWORK__CASHOUT_TAKE_FAILURE_SBK:
      return {
        ...state,
        step: state.step === "REPORT" ? "PLACE_POTENTIAL" : state.step,
        exchangeReport: undefined,
        exchangeEdit: undefined,
        exchangeContext: undefined,
        sportsbookReport: undefined,
      };
    case BETTING__SBK_LOAD_STORAGE_SUCCESS: {
      return {
        ...state,
        ...action.payload.betslip,
      };
    }
    case UI__BETSLIP_SBK_RE_ADD_SELECTIONS_CLICK:
      return {
        ...state,
        isCollapsed: action.payload.numberOfSelections > 1,
      };
    case BETTING__OBB_TOGGLE_LEG_ACTION:
      return {
        ...state,
        step: "PLACE_POTENTIAL",
        obbReport: undefined,
      };
    case BETTING__SBK_TOGGLE_LEG_ACTION:
      return {
        ...state,
        step: "PLACE_POTENTIAL",
        obbReport: undefined,
      };
    case BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION:
      return {
        ...state,
        selectedCombinationId: action.payload.combinationId,
      };
    case BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION:
    case BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION:
    case BETTING__SBK_ACCA_INSURANCE_TOGGLE:
    case BETTING__SBK_MONEY_BACK_TOGGLE:
    case BETTING__SBK_PRICE_BOOST_TOGGLE:
    case BETTING__SBK_GHOST_LEG_TOGGLE:
    case BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION:
      return {
        ...state,
        selectedCombinationId: undefined,
      };
    case BETTING_UPDATE_OBB_TAGGING_METADATA: {
      return {
        ...state,
        obbTaggingMetadata: action.payload.metadata,
      };
    }
    case UI__BETSLIP_COLLAPSE_ACTION:
    case BOTTOM_BAR_PUSH:
      return {
        ...state,
        isCollapsed: true,
        ...(state.step === "REPORT"
          ? {
              step: "PLACE_POTENTIAL",
              sportsbookReport: undefined,
              obbReport: undefined,
            }
          : {}),
      };
    case UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK:
      return {
        ...state,
        isCollapsed: false,
      };
    case UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE: {
      return {
        ...state,
        hasUserChangedOddsMovementPreference: true,
      };
    }
    case UI__SWITCH_PRODUCT_PREFERENCE:
      return {
        ...state,
        activeProduct: action.payload.productSwitcherPreference === ProductsOption.exchange ? "EXCHANGE" : "SPORTSBOOK",
        step: "PLACE_POTENTIAL",
        isCollapsed: true,
      };
    case UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE:
      return {
        ...state,
        lastSuccessfulStake: action.payload.stake,
      };
    case NETWORK__FETCH_APP_CONTEXT_SUCCESS: {
      const {
        initialState: {
          entities: { userdetails },
        },
      } = action.payload;

      if (!userdetails?.loggedIn) {
        return {
          ...state,
          lastSuccessfulStake: INITIAL_STATE.lastSuccessfulStake,
        };
      }

      return state;
    }
    case NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE:
    case NETWORK__INVALID_SESSION:
      return {
        ...state,
        lastSuccessfulStake: INITIAL_STATE.lastSuccessfulStake,
      };
    default:
      return state;
  }
};
