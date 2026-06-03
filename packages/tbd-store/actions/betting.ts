import type { PriceLadderValidation, SizeLadderValidation } from "@ppb/bet-engine";
import { ValidationError } from "jsonschema";
import {
  SportsbookOdds,
  SizeValidation,
  PriceValidation,
  Product,
  BetslipSportsbookConfirmationBet,
  ObbTaggingMetadata,
  BettingOpportunityType,
} from "../state";
import { BetslipStorage } from "../helpers";
import URN from "../state/layout/URN";
import {
  BettingGroup,
  SportsbookBettingState,
  AddLegOptions,
} from "../state/betting/sportsbook-betting/SportsbookBetting.types";
import { ExchangeBettingState } from "../state/betting/exchange-betting/ExchangeBetting.types";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";
import { ObbBettingState } from "../state/betting/obb-betting/ObbBetting.types";
import { ObbPositionType } from "../state/layout/cards/obb-card/ObbCard.types";
import type { CardTrackingMetadata } from "../state/layout/cards/Card.types";
import { ObbModuleMetadataTemplate } from "../middlewares/ga4-tagging-resolvers/helpers";

export const UI__MARKET_EXC_BET_BUTTON_CLICK = "UI/MARKET_EXC_BET_BUTTON_CLICK";
export const UI__MARKET_SBK_BET_BUTTON_CLICK = "UI/MARKET_SBK_BET_BUTTON_CLICK";
export const UI__OBB_BET_BUTTON_CLICK = "UI/OBB_BET_BUTTON_CLICK";
export const UI__GENEROSITY_WALLET_REMOVE_CLICK = "UI/GENEROSITY_WALLET_REMOVE_CLICK";

export const BETTING__DEPOSIT_TO_PLACE_BET = "BETTING/DEPOSIT_TO_PLACE_BET";
export const BETTING__DEPOSIT_TO_PLACE_CANCEL = "BETTING/DEPOSIT_TO_PLACE_CANCEL";
export const BETTING__ADD_POTENTIAL_BET_ACTION = "BETTING/ADD_POTENTIAL_BET_ACTION";
export const BETTING__UPDATE_POTENTIAL_BET_ACTION = "BETTING/UPDATE_POTENTIAL_BET_ACTION";
export const BETTING__REMOVE_POTENTIAL_BET_ACTION = "BETTING/REMOVE_POTENTIAL_BET_ACTION";
export const BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION = "BETTING/REMOVE_ALL_POTENTIAL_BETS_ACTION";
export const BETTING__NUDGE_UP_POTENTIAL_BET_ACTION = "BETTING/NUDGE_UP_POTENTIAL_BET_ACTION";
export const BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION = "BETTING/NUDGE_DOWN_POTENTIAL_BET_ACTION";

export const BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION = "BETTING/VALID_UPDATE_POTENTIAL_BET_ACTION";
export const BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION = "BETTING/INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION";
export const BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION = "BETTING/INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION";

export const BETTING__EXC_PLACE_BETS = "BETTING/EXC_PLACE_BETS";
export const BETTING__EXC_UNMATCHED_UPDATE = "BETTING/EXC_UNMATCHED_UPDATE";
export const BETTING__EXC_INCREMENT_SIZE_ACTION = "BETTING/EXC_INCREMENT_SIZE_ACTION";
export const BETTING__EXC_STATE_UPDATE = "BETTING/EXC_STATE_UPDATE";
export const BETTING__UPDATE_UNMATCHED_BET_ACTION = "BETTING/UPDATE_UNMATCHED_BET_ACTION";
export const BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION = "BETTING/INVALID_UPDATE_UNMATCHED_BET_ACTION";
export const BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION = "BETTING/VALID_UPDATE_UNMATCHED_BET_ACTION";
export const BETTING__NUDGE_UP_UNMATCHED_BET_ACTION = "BETTING/NUDGE_UP_UNMATCHED_BET_ACTION";
export const BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION = "BETTING/NUDGE_DOWN_UNMATCHED_BET_ACTION";
export const BETTING__BONUS_TOGGLE_BET_ACTION = "BETTING/BONUS_TOGGLE_BET_ACTION";
export const BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL = "BETTING/EXC_PLACE_DEPOSIT_SUCCESSFUL";
export const BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL = "BETTING/EXC_EDIT_DEPOSIT_SUCCESSFUL";
export const BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION = "BETTING/SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION";
export const BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION = "BETTING/SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION";
export const BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION = "BETTING/SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION";
export const BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION =
  "BETTING/SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION";
export const BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION =
  "BETTING/SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION";
export const BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION = "BETTING/SBK_TOGGLE_ONE_LINE_LEG_ACTION";
export const BETTING__SBK_TOGGLE_LEG_ACTION = "BETTING/SBK_TOGGLE_LEG_ACTION";
export const BETTING__SBK_REMOVE_LEG_ACTION = "BETTING/SBK_REMOVE_LEG_ACTION";
export const BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION = "BETTING/SBK_REMOVE_BOOSTED_COMBINATION_ACTION";
export const BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION = "BETTING/SBK_UPDATE_COMBINATION_STAKE_ACTION";
export const BETTING__SBK_CLEAR_ACTION = "BETTING/SBK_CLEAR_ACTION";
export const BETTING__SBK_INCREMENT_STAKE_ACTION = "BETTING/SBK_INCREMENT_STAKE_ACTION";
export const BETTING__SBK_STATE_UPDATE = "BETTING/SBK_STATE_UPDATE";
export const BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO = "BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO";
export const BETTING__SBK_CONFIRM_BETS = "BETTING/SBK_CONFIRM_BETS";
export const BETTING__SBK_EDIT_BETS = "BETTING/SBK_EDIT_BETS";
export const BETTING__SBK_PLACE_BETS = "BETTING/SBK_PLACE_BETS";
export const BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION = "BETTING/SBK_CREATE_SPORTSBOOK_CONFIRMATION";
export const BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT = "BETTING/SBK_CONFIRMATION_ODDS_MOVEMENT";
export const BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES =
  "BETTING/SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES";
export const BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION = "BETTING/SBK_REMOVE_SPORTSBOOK_CONFIRMATION";
export const BETTING__SBK_PLACE_FAILED_UPDATE = "BETTING/SBK_PLACE_FAILED_UPDATE";
export const BETTING__SBK_COMBINATIONS_OUTDATED = "BETTING/SBK_COMBINATIONS_OUTDATED";
export const BETTING__SBK_VALIDATE_STAKE = "BETTING/SBK_VALIDATE_STAKE";
export const BETTING__SBK_BONUS_TOGGLE_ACTION = "BETTING/SBK_BONUS_TOGGLE_ACTION";
export const BETTING__SBK_STARTING_PRICE_TOGGLE = "BETTING/SBK_STARTING_PRICE_TOGGLE";
export const BETTING__SBK_EACH_WAY_TOGGLE = "BETTING/SBK_EACH_WAY_TOGGLE";
export const BETTING__SBK_PRICE_BOOST_TOGGLE = "BETTING/SBK_PRICE_BOOST_TOGGLE";
export const BETTING__SBK_ACCA_INSURANCE_TOGGLE = "BETTING/SBK_ACCA_INSURANCE_TOGGLE";
export const BETTING__SBK_GHOST_LEG_TOGGLE = "BETTING/SBK_GHOST_LEG_TOGGLE";
export const BETTING__SBK_MONEY_BACK_TOGGLE = "BETTING/SBK_MONEY_BACK_TOGGLE";
export const BETTING__SBK_ORDER_CHANGE = "BETTING/SBK_ORDER_CHANGE";
export const BETTING__SBK_INVALID_LEGS_AMOUNT = "BETTING/SBK_INVALID_LEGS_AMOUNT";
export const BETTING__SBK_MARKETS_REQUEST = "BETTING/SBK_MARKETS_REQUEST";
export const BETTING__SBK_ADD_SELECTION_TAGGING = "BETTING/SBK_ADD_SELECTION_TAGGING";
export const BETTING__SBK_ADD_SELECTIONS = "BETTING/SBK_ADD_SELECTIONS";
export const BETTING__SBK_ADD_SELECTIONS_SUCCESS = "BETTING/SBK_ADD_SELECTIONS_SUCCESS";
export const BETTING__SBK_ENSURE_SELECTION_DATA = "BETTING/SBK_ENSURE_SELECTION_DATA";
export const BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS = "BETTING/SBK_ENSURE_SELECTION_DATA_SUCCESS";
export const BETTING__SBK_ENSURE_SELECTION_DATA_ERROR = "BETTING/SBK_ENSURE_SELECTION_DATA_ERROR";
export const BETTING__SBK_LOAD_STORAGE_SUCCESS = "BETTING/SBK_LOAD_STORAGE_SUCCESS";
export const BETTING__SBK_LOAD_STORAGE_FAILED = "BETTING/SBK_LOAD_STORAGE_FAILED";
export const BETTING__SBK_DEPOSIT_SUCCESSFUL = "BETTING/SBK_DEPOSIT_SUCCESSFUL";
export const BETTING__SBK_SWITCH_GROUP = "BETTING/SBK_SWITCH_GROUP";

export const BETTING__BETSLIP_TYPE_SWITCH_TO_OBB = "UI__BETSLIP_TYPE_SWITCH_TO_OBB";

export const BETTING__OBB_LOADED = "BETTING/OBB_LOADED";
export const BETTING__OBB_CLEAR_ACTION = "BETTING/OBB_CLEAR_ACTION";
export const BETTING__OBB_STATE_UPDATE = "BETTING/OBB_STATE_UPDATE";
export const BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION = "BETTING/OBB_TOGGLE_MULTIPLE_LEG_ACTION";
export const BETTING__OBB_TOGGLE_LEG_ACTION = "BETTING/OBB_TOGGLE_LEG_ACTION";
export const BETTING__OBB_NEW_COMBINATION = "BETTING/OBB_NEW_COMBINATION";
export const BETTING__OBB_REMOVE_LEG_ACTION = "BETTING/OBB_REMOVE_LEG_ACTION";
export const BETTING__OBB_UPDATE_QUOTES = "BETTING/OBB_UPDATE_QUOTES";
export const BETTING__OBB_PLACE_BETS = "BETTING/OBB_PLACE_BETS";
export const BETTING__OBB_PLACE_FAILED_UPDATE = "BETTING/OBB_PLACE_FAILED_UPDATE";
export const BETTING__OBB_INCREMENT_STAKE_ACTION = "BETTING/OBB_INCREMENT_STAKE_ACTION";
export const BETTING__OBB_CHANGE_STAKE_ACTION = "BETTING/OBB_CHANGE_STAKE_ACTION";
export const BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE = "BETTING/OBB_TRANSFER_POTENTIAL_BET_STAKE";
export const BETTING__OBB_IMPLY_BETS = "BETTING/OBB_IMPLY_BETS_ACTION";
export const BETTING__OBB_UPDATE_ODDS_MOVEMENT = "BETTING/OBB_UPDATE_ODDS_MOVEMENT";
export const BETTING__OBB_VALIDATE_STAKE = "BETTING/OBB_VALIDATE_STAKE";
export const BETTING__OBB_LOAD_STORAGE_SUCCESS = "BETTING/OBB_LOAD_STORAGE_SUCCESS";
export const BETTING__OBB_LOAD_STORAGE_FAILURE = "BETTING/OBB_LOAD_STORAGE_FAILURE";
export const BETTING_UPDATE_OBB_TAGGING_METADATA = "BETTING/UPDATE_OBB_TAGGING_METADATA";

export const BETTING__OBB_SBK_CLEAR_ACTION = "BETTING/OBB_SBK_CLEAR_ACTION";
export const BETTING__OBB_SBK_KEEP_ACTION = "BETTING/OBB_SBK_KEEP_ACTION";

export type BetslipEvents = {
  "@@BETSLIP/SBK_RUNNER_ADDED": { marketId: string; selectionId: number };
  "@@BETSLIP/SBK_RUNNER_REMOVED": { marketId: string; selectionId: number };
};

export type BettingSbkDepositSuccessful = {
  type: typeof BETTING__SBK_DEPOSIT_SUCCESSFUL;
};

export type BettingExcPlaceDepositSuccessful = {
  type: typeof BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL;
  payload: {
    runner: URN;
  };
};

export type BettingExcEditDepositSuccessful = {
  type: typeof BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL;
  payload: {
    runner: URN;
    market: URN;
    betId: string;
  };
};

type BetslipSportsbookDeeplink = {
  isBetSharing: boolean;
};

export type ADD_SELECTION_PAYLOAD = {
  selections: {
    marketUrn: URN;
    runnerUrn: URN;
  }[];
  group: BettingGroup;
  bettingOpportunityId?: string;
  bettingOpportunityType?: BettingOpportunityType;
  ensureSelectionsFromStore?: boolean;
  deeplink?: BetslipSportsbookDeeplink;
  cardUrn?: URN;
  cardMetadata?: CardTrackingMetadata;
  odds?: SportsbookOdds;
};

export type ADD_SELECTION_PAYLOAD_SUCCESS = {
  selections: {
    marketUrn: URN;
    runnerUrn: URN;
    uniqueId: string;
  }[];
  group: BettingGroup;
  deeplink?: BetslipSportsbookDeeplink;
  options?: AddLegOptions;
  bettingOpportunityType?: BettingOpportunityType;
  bettingOpportunityId?: string;
};

export type BettingDepositToPlaceCancel = {
  type: typeof BETTING__DEPOSIT_TO_PLACE_CANCEL;
};

export type BettingDepositToPlaceBetAction = {
  type: typeof BETTING__DEPOSIT_TO_PLACE_BET;
};

export type BettingSportsbookAddSelectionTaggingAction = {
  type: typeof BETTING__SBK_ADD_SELECTION_TAGGING;
  payload: MarketSportsbookBetButtonClickAction["payload"] & {
    deeplink?: BetslipSportsbookDeeplink;
  };
};

export type BettingSportsbookAddSelectionAction = {
  type: typeof BETTING__SBK_ADD_SELECTIONS;
  payload: ADD_SELECTION_PAYLOAD;
};

export type BettingSportsbookAddSelectionActionSuccess = {
  type: typeof BETTING__SBK_ADD_SELECTIONS_SUCCESS;
  payload: ADD_SELECTION_PAYLOAD_SUCCESS;
};

export type BettingSportsbookMarketsRequest = {
  type: typeof BETTING__SBK_MARKETS_REQUEST;
  payload: {
    urns: URN[];
    group: BettingGroup;
  };
};

export type BettingSportsbookEnsureSelectionData = {
  type: typeof BETTING__SBK_ENSURE_SELECTION_DATA;
  payload: ADD_SELECTION_PAYLOAD | LOAD_STORAGE_PAYLOAD;
};

export type BettingSportsbookEnsureSelectionDataSuccess = {
  type: typeof BETTING__SBK_ENSURE_SELECTION_DATA_SUCCESS;
  payload: LOAD_STORAGE_PAYLOAD & ADD_SELECTION_PAYLOAD;
};

export type BettingSportsbookEnsureSelectionDataError = {
  type: typeof BETTING__SBK_ENSURE_SELECTION_DATA_ERROR;
};

export type LOAD_STORAGE_PAYLOAD = {
  selections: {
    marketUrn: URN;
    runnerUrn: URN;
    uniqueId?: string;
  }[];
  group: BettingGroup;
};

type LOAD_STORAGE_PAYLOAD_SUCCESS = {
  betslip: BetslipStorage;
  storageBettingState: SportsbookBettingState;
};

export type BettingSportsbookLoadStorageActionSuccess = {
  type: typeof BETTING__SBK_LOAD_STORAGE_SUCCESS;
  payload: LOAD_STORAGE_PAYLOAD_SUCCESS;
};

export type BettingSportsbookLoadStorageFailed = {
  type: typeof BETTING__SBK_LOAD_STORAGE_FAILED;
  payload: { errors: ValidationError[] };
};

export type MarketExchangeBetButtonClickAction = {
  type: typeof UI__MARKET_EXC_BET_BUTTON_CLICK;
  payload: {
    betOriginURL: string;
    cardUrn: URN;
    marketURN: URN;
    side: ExchangeSide;
    uniqueId: string;
    urn: URN;
    marketId?: string;
    price?: number;
  };
};

export type PlacingBetPayload = {
  urn: URN;
  odds?: SportsbookOdds;
};

export type MarketSportsbookBetButtonClickAction = {
  type: typeof UI__MARKET_SBK_BET_BUTTON_CLICK;
  payload: PlacingBetPayload & {
    betOriginURL: string;
    cardUrn: URN;
    group: BettingGroup;
    uniqueId: string;
    cardMetadata?: CardTrackingMetadata;
  };
};

export type ObbBetButtonClickAction = {
  type: typeof UI__OBB_BET_BUTTON_CLICK;
};

export type BettingSportsbookSwitchGroup = {
  type: typeof BETTING__SBK_SWITCH_GROUP;
  payload: {
    urn: URN;
    group: BettingGroup;
  };
};

export type BettingSportsbookToggleLegAction = {
  type: typeof BETTING__SBK_TOGGLE_LEG_ACTION;
  payload: PlacingBetPayload & {
    group: BettingGroup;
    metadata?: { betOriginURL: string; cardUrn?: URN };
  };
};

export type BettingSportsbookToggleOneLineLegAction = {
  type: typeof BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION;
  payload: PlacingBetPayload & {
    marketUrns: URN[];
    marketIds: string[];
    selectionIds: number[];
    group: BettingGroup;
  };
};

export type BettingSportsbookRemoveLegAction = {
  type: typeof BETTING__SBK_REMOVE_LEG_ACTION;
  payload: {
    legId: string;
  };
};

export type BettingSportsbookRemoveBoostedCombinationAction = {
  type: typeof BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION;
  payload: {
    legIds: string[];
  };
};

export type BettingSportsbookUpdateCombinationStakeAction = {
  type: typeof BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION;
  payload: {
    combinationId: string;
    stake?: number;
  };
};

export type BettingSportsbookIncrementStakeAction = {
  type: typeof BETTING__SBK_INCREMENT_STAKE_ACTION;
  payload: {
    combinationId: string;
    increment: number;
  };
};

export type BettingExchangePlaceBetsAction = {
  type: typeof BETTING__EXC_PLACE_BETS;
  payload: { runner: URN; confirmFirst: boolean };
};

export type BettingExchangeUnmatchedUpdate = {
  type: typeof BETTING__EXC_UNMATCHED_UPDATE;
  payload: {
    betId: string;
    market: URN;
    runner: URN;
    betOriginURL: string | null;
  };
};

export type BettingExchangeIncrementSizeAction = {
  type: typeof BETTING__EXC_INCREMENT_SIZE_ACTION;
  payload: {
    runner: URN;
    side: ExchangeSide;
    increment: number;
  };
};

export type BettingExchangeStateUpdatedAction = {
  type: typeof BETTING__EXC_STATE_UPDATE;
  payload: {
    state: ExchangeBettingState;
  };
};

export type BettingSportsbookStateUpdateAction = {
  type: typeof BETTING__SBK_STATE_UPDATE;
  payload: {
    state: SportsbookBettingState;
    group: BettingGroup;
    intercepted?: boolean;
  };
};

export type BettingBetslipLoadMaxPayoutInfoAction = {
  type: typeof BETTING__BETSLIP_LOAD_MAX_PAYOUT_INFO;
  payload: boolean;
};

export type BettingSportsbookConfirmBetsAction = {
  type: typeof BETTING__SBK_CONFIRM_BETS;
};

export type BettingSportsbookEditBetsAction = {
  type: typeof BETTING__SBK_EDIT_BETS;
};

export type BettingSportsbookPlaceBetsAction = {
  type: typeof BETTING__SBK_PLACE_BETS;
};

export type BettingSportsbookCreateSportsbookConfirmationAction = {
  type: typeof BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION;
  payload: BetslipSportsbookConfirmationBet;
};

export type BettingSportsbookConfirmationOddsMovementAction = {
  type: typeof BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT;
  payload: {
    combinations: BetslipSportsbookConfirmationBet["combinations"];
  };
};

export type BettingSportsbookUpdateSportsbookConfirmationFailuresAction = {
  type: typeof BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES;
  payload: {
    failures: BetslipSportsbookConfirmationBet["failures"];
    availabilityChanged: BetslipSportsbookConfirmationBet["availabilityChanged"];
  };
};

export type BettingSportsbookRemoveSportsbookConfirmationAction = {
  type: typeof BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION;
};

export type BettingSportsbookPlaceFailedUpdateAction = {
  type: typeof BETTING__SBK_PLACE_FAILED_UPDATE;
  payload: {
    state: SportsbookBettingState;
  };
};

export type BettingSportsbookCombinationsOutdatedAction = {
  type: typeof BETTING__SBK_COMBINATIONS_OUTDATED;
};

export type BettingSportsbookClearAction = {
  type: typeof BETTING__SBK_CLEAR_ACTION;
};

export type BettingSportsbookValidateStake = {
  type: typeof BETTING__SBK_VALIDATE_STAKE;
  payload: {
    combinationId: string;
  };
};

export type AddPotentialBetAction = {
  type: typeof BETTING__ADD_POTENTIAL_BET_ACTION;
  payload: {
    marketURN: URN;
    runner: URN;
    side: ExchangeSide;
    price?: number;
    size?: number;
    marketDepth: number;
  };
};

export type UpdatePotentialBetAction = {
  type: typeof BETTING__UPDATE_POTENTIAL_BET_ACTION;
  payload: {
    runner: URN;
    price?: number;
    size?: number;
    side: ExchangeSide;
  };
};

export type RemovePotentialBetAction = {
  type: typeof BETTING__REMOVE_POTENTIAL_BET_ACTION;
  payload: {
    runner: URN;
    side: ExchangeSide;
  };
};

export type RemoveAllPotentialBetsAction = {
  type: typeof BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION;
};

export type NudgeUpPotentialBetAction = {
  type: typeof BETTING__NUDGE_UP_POTENTIAL_BET_ACTION;
  payload: {
    runner: URN;
    side: ExchangeSide;
    input: "size" | "price";
  };
};

export type NudgeDownPotentialBetAction = {
  type: typeof BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION;
  payload: {
    runner: URN;
    side: ExchangeSide;
    input: "size" | "price";
  };
};

export type ValidUpdatePotentialBetAction = {
  type: typeof BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION;
  payload: {
    price?: number;
    size?: number;
    runner: URN;
    side: ExchangeSide;
  };
};

export type InvalidUpdatePricePotentialBetAction = {
  type: typeof BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION;
  payload: {
    price?: number;
    runner: URN;
    side: ExchangeSide;
    error: PriceValidation;
  };
};

export type InvalidUpdateSizePotentialBetAction = {
  type: typeof BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION;
  payload: {
    size?: number;
    runner: URN;
    side: ExchangeSide;
    error: SizeValidation;
  };
};

export type BettingSportsbookBonusToggleAction = {
  type: typeof BETTING__SBK_BONUS_TOGGLE_ACTION;
  payload: {
    isFreeBetsSelected: boolean;
    product: Product;
  };
};

export type BettingBonusToggleBetAction = {
  type: typeof BETTING__BONUS_TOGGLE_BET_ACTION;
  payload: {
    isFreeBetsSelected: boolean;
    runner: URN;
    marketEligibleBonus: number;
  };
};

export type BettingSportsbookSPToggleAction = {
  type: typeof BETTING__SBK_STARTING_PRICE_TOGGLE;
  payload: {
    combinationId: string;
    isSelected: boolean;
  };
};

export type BettingSportsbookEachWayToggleAction = {
  type: typeof BETTING__SBK_EACH_WAY_TOGGLE;
  payload: {
    isSelected: boolean;
    combinationId: string;
  };
};

export type BettingSportsbookAccaInsuranceToggleAction = {
  type: typeof BETTING__SBK_ACCA_INSURANCE_TOGGLE;
  payload: {
    combinationId: string;
    selectedTokenId?: string;
  };
};

export type BettingSportsbookGhostLegToggleAction = {
  type: typeof BETTING__SBK_GHOST_LEG_TOGGLE;
  payload: {
    combinationId: string;
    selectedTokenId?: string;
  };
};

export type BettingSportsbookMoneyBackToggleAction = {
  type: typeof BETTING__SBK_MONEY_BACK_TOGGLE;
  payload: {
    combinationId: string;
    selectedTokenId?: string;
  };
};

export type BettingSportsbookPriceBoostToggleAction = {
  type: typeof BETTING__SBK_PRICE_BOOST_TOGGLE;
  payload: {
    combinationId: string;
    selectedTokenId?: string;
  };
};

export type BettingSportsbookOrderChangeAction = {
  type: typeof BETTING__SBK_ORDER_CHANGE;
  payload: {
    order: string[];
  };
};

export type BettingSportsbookInvalidLegsAmountAction = {
  type: typeof BETTING__SBK_INVALID_LEGS_AMOUNT;
  payload: {
    limit: number;
  };
};

export type UpdateUnmatchedBetAction = {
  type: typeof BETTING__UPDATE_UNMATCHED_BET_ACTION;
  payload: {
    runner: URN;
    betId: string;
    price?: number;
    size?: number;
    side: ExchangeSide;
  };
};

export type InvalidUpdateUnmatchedBetAction = {
  type: typeof BETTING__INVALID_UPDATE_UNMATCHED_BET_ACTION;
  payload: {
    betId: string;
    order?: {
      price?: number;
      size?: number;
      validations: {
        price?: PriceLadderValidation;
        size?: SizeLadderValidation;
      };
    };
  };
};

export type ValidUpdateUnmatchedBetAction = {
  type: typeof BETTING__VALID_UPDATE_UNMATCHED_BET_ACTION;
  payload: {
    betId: string;
    order: {
      price?: number;
      size?: number;
    };
  };
};

export type NudgeUpUnmatchedBetAction = {
  type: typeof BETTING__NUDGE_UP_UNMATCHED_BET_ACTION;
  payload: {
    runner: URN;
    betId: string;
    input: "size" | "price";
  };
};

export type NudgeDownUnmatchedBetAction = {
  type: typeof BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION;
  payload: {
    runner: URN;
    betId: string;
    input: "size" | "price";
  };
};

export type BettingObbStateUpdateAction = {
  type: typeof BETTING__OBB_STATE_UPDATE;
  payload: {
    state: ObbBettingState;
  };
};

export type BettingObbPlaceFailedUpdateAction = {
  type: typeof BETTING__OBB_PLACE_FAILED_UPDATE;
  payload: {
    state: ObbBettingState;
  };
};

export type BettingObbToggleMultipleLegAction = {
  type: typeof BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION;
  payload: {
    legIds: Array<string>;
    cardUrn?: URN;
    eventName?: string;
    position?: ObbPositionType;
  };
};

export type BettingObbToggleLegAction = {
  type: typeof BETTING__OBB_TOGGLE_LEG_ACTION;
  payload: {
    legId: string;
    cardUrn?: URN;
    eventName?: string;
    position?: ObbPositionType;
    metadataOverride?: ObbModuleMetadataTemplate;
  };
};

export type BettingObbNewCombinationAction = {
  type: typeof BETTING__OBB_NEW_COMBINATION;
  payload: {
    legId: string;
  };
};

export type BettingObbRemoveLegAction = {
  type: typeof BETTING__OBB_REMOVE_LEG_ACTION;
  payload: { legId: string };
};

export type BettingObbClearAction = {
  type: typeof BETTING__OBB_CLEAR_ACTION;
};

export type BettingObbSbkClearAction = {
  type: typeof BETTING__OBB_SBK_CLEAR_ACTION;
  payload?: { cardUrn?: URN; eventName: string; runnerUrn?: URN; group?: string; actionLabel?: string };
};

export type BettingObbSbkKeepAction = {
  type: typeof BETTING__OBB_SBK_KEEP_ACTION;
  payload: {
    clickedOutside: boolean;
    cardUrn: URN;
    eventName: string;
    runnerUrn?: URN;
    group?: string;
    actionLabel?: string;
  };
};

export type BettingSwitchToObbBetslipAction = {
  type: typeof BETTING__BETSLIP_TYPE_SWITCH_TO_OBB;
  payload: { legIds: Array<string> };
};

export type BettingObbUpdateQuotesAction = {
  type: typeof BETTING__OBB_UPDATE_QUOTES;
  payload?: { clearOnFailure: boolean };
};

export type BettingObbPlaceBetsAction = {
  type: typeof BETTING__OBB_PLACE_BETS;
};

export type BettingObbIncrementStakeAction = {
  type: typeof BETTING__OBB_INCREMENT_STAKE_ACTION;
  payload: {
    potentialBetId: string;
    increment: number;
  };
};

export type BettingObbChangeStakeAction = {
  type: typeof BETTING__OBB_CHANGE_STAKE_ACTION;
  payload: {
    potentialBetId: string;
    newValue: number | null;
  };
};

export type BettingObbImplyBetsAction = {
  type: typeof BETTING__OBB_IMPLY_BETS;
};

export type BettingObbUpdateOddsMovementAction = {
  type: typeof BETTING__OBB_UPDATE_ODDS_MOVEMENT;
  payload: { state: ObbBettingState };
};

export type BettingObbValidateStake = {
  type: typeof BETTING__OBB_VALIDATE_STAKE;
  payload: {
    potentialBetId: string;
  };
};

export type BettingObbTransferPotentialBetStakeAction = {
  type: typeof BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE;
  payload: {
    oldPotentialBetId: string;
    newPotentialBetId: string;
  };
};

export type BettingObbLoadedAction = {
  type: typeof BETTING__OBB_LOADED;
};

export type BettingObbLoadStorageSuccessAction = {
  type: typeof BETTING__OBB_LOAD_STORAGE_SUCCESS;
  payload: {
    obbBettingState: ObbBettingState;
  };
};

export type BettingObbLoadStorageFailureAction = {
  type: typeof BETTING__OBB_LOAD_STORAGE_FAILURE;
};

export type BettingSportsbookGenerosityWalletBetAction = {
  type: typeof BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION;
  payload: {
    combinationId: string;
    isSelected: boolean;
  };
};

export type BettingSportsbookGenerosityWalletsCloseAction = {
  type: typeof BETTING__SPORTSBOOK_GENEROSITY_WALLETS_CLOSE_ACTION;
};

export type BettingObbUpdateTaggingMetadata = {
  type: typeof BETTING_UPDATE_OBB_TAGGING_METADATA;
  payload: {
    metadata: ObbTaggingMetadata;
  };
};

export type BettingSportsbookApplyFreeBetsWalletsAction = {
  type: typeof BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION;
  payload: {
    combinationId: string;
    selectedWallets: number[];
    amount: string;
  };
};

export type BettingSportsbookRemoveAllWalletsAction = {
  type: typeof BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION;
};

export type BettingSportsbookRemoveAllCombinationWalletsAction = {
  type: typeof BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION;
  payload: {
    combinationId: string;
  };
};

export type BettingSportsbookRemoveGenerosityWalletsAction = {
  type: typeof UI__GENEROSITY_WALLET_REMOVE_CLICK;
};

export type BettingUpdateLike = {
  payload: {
    state: SportsbookBettingState;
    group?: BettingGroup;
  };
};
