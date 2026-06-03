import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import type { AlertProps, StyledProps } from "@ppb/the-wall-common/types";
import type { InlinePanelProps, InlinePanelOnAction } from "../InlinePanel/InlinePanel.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  getExchangeEligibleBonusByMarketId,
  getRunnerPotentialBetWithBonus,
} from "@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors";
import { getExchangePotentialState } from "@ppb/tbd-store/state/betting/exchange-betting-potential/exchange-betting-potential-selectors";
import { EXTERNAL_PUSH, ExternalPushAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import {
  BetslipExchangePlaceBetClickAction,
  BetslipExchangePriceInputBlurAction,
  BetslipExchangePriceInputChangeAction,
  BetslipExchangeSizeInputChangeAction,
  BetslipExchangePriceNudgeDownClickAction,
  BetslipExchangePriceNudgeUpClickAction,
  UI__BETSLIP_EXC_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PRICE_INPUT_BLUR,
  UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
  UI__BETSLIP_EXC_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
  BetslipExchangeIncrementSizeAction,
  UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
  BetslipExchangeRemovePotentialBetClickAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
  BetslipExchangeBonusChangeAction,
  UI__BETSLIP_EXC_BONUS_CHANGE,
  UI__BETSLIP_CLOSE_CLICK,
  BetslipCloseAction,
  BetslipExchangeLoginToPlaceBetClickAction,
  UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM,
  BetslipExchangePlaceBetClickAutoConfirm,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__EXC_PLACE_BETS,
  BETTING__EXC_INCREMENT_SIZE_ACTION,
  BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
  BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_POTENTIAL_BET_ACTION,
  BETTING__UPDATE_POTENTIAL_BET_ACTION,
  BETTING__BONUS_TOGGLE_BET_ACTION,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BettingExchangePlaceBetsAction,
  BettingExchangeIncrementSizeAction,
  NudgeDownPotentialBetAction,
  NudgeUpPotentialBetAction,
  RemovePotentialBetAction,
  UpdatePotentialBetAction,
  BettingBonusToggleBetAction,
  BettingDepositToPlaceBetAction,
  RemoveAllPotentialBetsAction,
} from "@ppb/tbd-store/actions/betting";
import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { Product } from "@ppb/tbd-store/state/entities";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { buildFreeBetsLabel, getBetData } from "../betslip-formatters";
import {
  buildMarketError,
  buildPlaceError,
  buildPriceError,
  buildQuickStakesSelector,
  buildSizeError,
} from "../betslip-mapper";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import { i18n } from "../../../helpers/i18n";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

import type { ExchangeInlinePlacePanelProps } from "./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.types";

export type ContainerProps = {
  isEditing?: boolean;
};

type CardProps = {
  prefersConfirm?: boolean;
  runner?: URN;
  isPlacing?: boolean;
  placeError?: {
    notification: AlertProps;
  };
  priceError?: {
    newPrice: number;
    notification: AlertProps;
  };
  sizeError?: {
    newSize: number;
    notification: AlertProps;
  };
  marketError?: {
    notification: AlertProps;
  };
  side?: ExchangeSideType;
  quickStakes?: ExchangeInlinePlacePanelProps["quickStakes"];
  price?: ExchangeInlinePlacePanelProps["price"];
  size?: ExchangeInlinePlacePanelProps["size"];
  profitLabel?: ExchangeInlinePlacePanelProps["profitLabel"];
  profitValue?: ExchangeInlinePlacePanelProps["profitValue"];
  profitRawValue?: ExchangeInlinePlacePanelProps["profitRawValue"];
  titlePrefix?: InlinePanelProps["titlePrefix"];
  title: NonNullable<InlinePanelProps["title"]>;
  currencySymbol?: ExchangeInlinePlacePanelProps["currencySymbol"];
  betDelay?: ExchangeInlinePlacePanelProps["betDelay"];
  placeBtnLabel: NonNullable<StyledProps["translation"]>;
  pricePlaceholder: NonNullable<ExchangeInlinePlacePanelProps["pricePlaceholder"]>;
  sizePlaceholder: NonNullable<ExchangeInlinePlacePanelProps["sizePlaceholder"]>;
  loadingLabel: NonNullable<ExchangeInlinePlacePanelProps["loadingLabel"]>;
  eligibleBonus?: number;
  hasFreeBets?: ExchangeInlinePlacePanelProps["hasFreeBets"];
  isFreeBetsSelected?: ExchangeInlinePlacePanelProps["isFreeBetsSelected"];
  freeBetsLabel?: ExchangeInlinePlacePanelProps["freeBetsLabel"];
  isDepositRequired: boolean;
  isLoggedIn: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRunnerPotentialBets = createExcRunnerPotentialBetsByRunnerURNSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const buildQuickStakes = buildQuickStakesSelector();

  const baseVm = {
    title: "",
    placeBtnLabel: i18n({ key: "I18N.BETSLIP.PLACE_BET" }),
    isDepositRequired: false,
    isLoggedIn: false,
    pricePlaceholder: i18n({ key: "I18N.BETSLIP.ODDS" }),
    sizePlaceholder: i18n({ key: "I18N.BETSLIP.STAKE" }),
    loadingLabel: i18n({ key: "I18N.BETSLIP.PLACING_BET" }),
  };

  return (appState: ApplicationState) => {
    const { betslip, entities } = appState;

    if (!betslip) {
      return {};
    }

    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetails(appState);
    } catch (e) {
      console.error(e);

      return baseVm;
    }

    const betslipContext = getBetslipExchangeContext(appState);

    if (!betslipContext) {
      return baseVm;
    }

    const [potentialBet] = getRunnerPotentialBets(appState, betslipContext.runner);
    const runnerTree = getExchangeRunnerTree(entities, betslipContext.runner);

    if (!potentialBet || !runnerTree) {
      return baseVm;
    }

    const { runner, market } = runnerTree;
    const { size, price, side } = potentialBet;
    const { betDelay, status: marketStatus, marketId, marketType, bettingType } = market;
    const { exchangeConfirmBetPlacement: prefersConfirm } = getUserPreferencesWithProductSwitcher(entities.preferences);
    const eligibleBonus = getExchangeEligibleBonusByMarketId(
      appState,
      marketId,
      runner.selectionId,
      marketType,
      bettingType,
    );
    const hasFreeBets = eligibleBonus > 0;
    const quickStakesFormatted = buildQuickStakes(appState);

    let freeBetsLabel;

    if (hasFreeBets) {
      const translationKey =
        side === ExchangeSide.LAY ? "I18N.BETSLIP.USE_ELIGIBLE_BONUS_LAY" : "I18N.BETSLIP.USE_FREE_BET_BALANCE";

      freeBetsLabel = buildFreeBetsLabel(translationKey, userDetails, eligibleBonus);
    }

    const { exchangePlaceError, placeStatus, isFreeBetsSelected } = betslip;
    const isDepositRequired = exchangePlaceError?.errorCode === "INSUFFICIENT_FUNDS";
    const potentialBetData = isFreeBetsSelected
      ? getRunnerPotentialBetWithBonus(appState, runner, marketId, marketType, bettingType)
      : potentialBet;
    const potentialState = getExchangePotentialState(appState, runner.urn, side);

    const currencySymbol = getCurrencySymbol(userDetails);
    const betData = getBetData({ ...potentialBetData, side }, userDetails, isDepositRequired);

    const { loggedIn: isLoggedIn, isAuthenticating } = userDetails;
    const hasCTALoading = !isDepositRequired && isLoggedIn;
    const loadingLabel = hasCTALoading ? baseVm.loadingLabel : "";

    let placeBtnLabel = isDepositRequired
      ? i18n({ key: "I18N.BETSLIP.DEPOSIT_TO_PLACE_BET" })
      : i18n({ key: "I18N.BETSLIP.PLACE_BET" });

    if (!isLoggedIn) {
      placeBtnLabel = i18n({ key: "I18N.BETSLIP.LOGIN_PLACE_BET" });
    }

    return {
      ...baseVm,
      titlePrefix:
        side === ExchangeSide.BACK
          ? i18n({ key: "I18N.BETSLIP.BACK_BET_FOR" })
          : i18n({ key: "I18N.BETSLIP.LAY_BET_AGAINST" }),
      title: getInlineBetslipTitle(appState),
      side,
      runner: runner.urn,
      prefersConfirm,
      isPlacing: placeStatus === "INPROGRESS" || !!isAuthenticating,
      quickStakes: quickStakesFormatted,
      price,
      size,
      currencySymbol,
      profitLabel: betData.label,
      profitValue: betData.value,
      profitRawValue: betData.rawValue,
      marketError: buildMarketError(marketStatus),
      placeError: buildPlaceError(marketStatus, exchangePlaceError, currencySymbol),
      priceError: buildPriceError(marketStatus, potentialState?.priceValidation, potentialState?.price),
      sizeError: buildSizeError(marketStatus, userDetails, potentialState?.sizeValidation),
      betDelay,
      hasFreeBets,
      eligibleBonus,
      freeBetsLabel,
      isFreeBetsSelected,
      placeBtnLabel,
      isDepositRequired,
      isLoggedIn,
      loadingLabel,
    };
  };
};

export type DispatchActions =
  | BetslipExchangePlaceBetClickAction
  | BetslipExchangePlaceBetClickAutoConfirm
  | BettingExchangePlaceBetsAction
  | BetslipExchangePriceInputChangeAction
  | BetslipExchangeSizeInputChangeAction
  | BetslipExchangePriceInputBlurAction
  | UpdatePotentialBetAction
  | BetslipExchangePriceNudgeUpClickAction
  | BetslipExchangePriceNudgeDownClickAction
  | NudgeUpPotentialBetAction
  | NudgeDownPotentialBetAction
  | BetslipExchangeIncrementSizeAction
  | BettingExchangeIncrementSizeAction
  | RemovePotentialBetAction
  | BetslipExchangeRemovePotentialBetClickAction
  | BetslipExchangeBonusChangeAction
  | BettingBonusToggleBetAction
  | BetslipCloseAction
  | RemoveAllPotentialBetsAction
  | PushAction
  | BettingDepositToPlaceBetAction
  | ExternalPushAction
  | BetslipExchangeLoginToPlaceBetClickAction;

export type DispatchProps = {
  dispatchExchangePlaceBetAction: (runner: URN, confirmFirst: boolean) => void;
  dispatchExchangePriceInputChangeAction: (runner: URN, side: ExchangeSideType, price?: number, size?: number) => void;
  dispatchExchangeSizeInputChangeAction: (runner: URN, side: ExchangeSideType, price?: number, size?: number) => void;
  dispatchExchangePriceInputBlurAction: (runner: URN, side: ExchangeSideType, price?: number, size?: number) => void;
  dispatchExchangeSizeInputBlurAction: (runner: URN, side: ExchangeSideType, price?: number, size?: number) => void;
  dispatchExchangePriceNudgeUpAction: (runner: URN, side: ExchangeSideType) => void;
  dispatchExchangePriceNudgeDownAction: (runner: URN, side: ExchangeSideType) => void;
  dispatchExchangeSizeNudgeUpAction: (runner: URN, side: ExchangeSideType) => void;
  dispatchExchangeSizeNudgeDownAction: (runner: URN, side: ExchangeSideType) => void;
  dispatchIncrementByQuickStakeAction: (
    runner: URN,
    side: ExchangeSideType,
    increment: number,
    currencySymbol?: string,
  ) => void;
  dispatchExchangeSelectionRemoveAction: (runner: URN, side: ExchangeSideType) => void;
  dispatchExchangeBonusChangeAction: (isFreeBetsSelected: boolean, runner: URN, eligibleBonus: number) => void;
  dispatchCloseAction: InlinePanelOnAction;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
  dispatchLogin: (url: string) => void;
  dispatchLoginToPlaceBetAction: (side: ExchangeSideType) => void;
};

const dispatchBetslipExchangePlaceBetAction = (
  dispatch: Dispatch<
    BetslipExchangePlaceBetClickAction | BettingExchangePlaceBetsAction | BetslipExchangePlaceBetClickAutoConfirm
  >,
  runner: URN,
  confirmFirst: boolean,
): void => {
  dispatch<BetslipExchangePlaceBetClickAction>({
    type: UI__BETSLIP_EXC_PLACE_BET_CLICK,
    payload: { runner, confirmFirst },
  });

  if (!confirmFirst) {
    dispatch<BetslipExchangePlaceBetClickAutoConfirm>({
      type: UI__BETSLIP_EXC_PLACE_BET_CLICK_AUTO_CONFIRM,
      payload: { runner },
    });
  }

  dispatch<BettingExchangePlaceBetsAction>({
    type: BETTING__EXC_PLACE_BETS,
    payload: { runner, confirmFirst },
  });
};

const dispatchBetslipExchangePriceInputChangeAction = (
  dispatch: Dispatch<BetslipExchangePriceInputChangeAction>,
  runner: URN,
  side: ExchangeSideType,
  price?: number,
  size?: number,
): void => {
  dispatch<BetslipExchangePriceInputChangeAction>({
    type: UI__BETSLIP_EXC_PRICE_INPUT_CHANGE,
    payload: {
      runner,
      side,
      price,
      size,
    },
  });
};

const dispatchBetslipExchangeSizeInputChangeAction = (
  dispatch: Dispatch<BetslipExchangeSizeInputChangeAction>,
  runner: URN,
  side: ExchangeSideType,
  price?: number,
  size?: number,
): void => {
  dispatch<BetslipExchangeSizeInputChangeAction>({
    type: UI__BETSLIP_EXC_SIZE_INPUT_CHANGE,
    payload: {
      runner,
      side,
      price,
      size,
    },
  });
};

const dispatchBetslipExchangePriceInputBlurAction = (
  dispatch: Dispatch<BetslipExchangePriceInputBlurAction>,
  runner: URN,
  side: ExchangeSideType,
  price?: number,
  size?: number,
): void => {
  dispatch<BetslipExchangePriceInputBlurAction>({
    type: UI__BETSLIP_EXC_PRICE_INPUT_BLUR,
    payload: {
      runner,
      side,
      price,
      size,
    },
  });
};

const dispatchBettingUpdatePotentialBetAction = (
  dispatch: Dispatch<UpdatePotentialBetAction>,
  runner: URN,
  side: ExchangeSideType,
  price?: number,
  size?: number,
): void => {
  dispatch<UpdatePotentialBetAction>({
    type: BETTING__UPDATE_POTENTIAL_BET_ACTION,
    payload: {
      runner,
      side,
      price,
      size,
    },
  });
};

const dispatchBetslipExchangePriceNudgeUpAction = (
  dispatch: Dispatch<BetslipExchangePriceNudgeUpClickAction>,
  runner: URN,
  side: ExchangeSideType,
): void => {
  dispatch<BetslipExchangePriceNudgeUpClickAction>({
    type: UI__BETSLIP_EXC_PRICE_NUDGE_UP,
    payload: {
      runner,
      side,
    },
  });
};

const dispatchBettingNudgeUpPotentialBetAction = (
  dispatch: Dispatch<NudgeUpPotentialBetAction>,
  runner: URN,
  side: ExchangeSideType,
  input: "price" | "size",
): void => {
  dispatch<NudgeUpPotentialBetAction>({
    type: BETTING__NUDGE_UP_POTENTIAL_BET_ACTION,
    payload: {
      runner,
      side,
      input,
    },
  });
};

const dispatchBetslipExchangePriceNudgeDownAction = (
  dispatch: Dispatch<BetslipExchangePriceNudgeDownClickAction>,
  runner: URN,
  side: ExchangeSideType,
): void => {
  dispatch<BetslipExchangePriceNudgeDownClickAction>({
    type: UI__BETSLIP_EXC_PRICE_NUDGE_DOWN,
    payload: {
      runner,
      side,
    },
  });
};

const dispatchBettingNudgeDownPotentialBetAction = (
  dispatch: Dispatch<NudgeDownPotentialBetAction>,
  runner: URN,
  side: ExchangeSideType,
  input: "price" | "size",
): void => {
  dispatch<NudgeDownPotentialBetAction>({
    type: BETTING__NUDGE_DOWN_POTENTIAL_BET_ACTION,
    payload: {
      runner,
      side,
      input,
    },
  });
};

const dispatchBettingExchangeIncrementSizeAction = (
  dispatch: Dispatch<BettingExchangeIncrementSizeAction>,
  runner: URN,
  side: ExchangeSideType,
  increment: number,
): void => {
  dispatch<BettingExchangeIncrementSizeAction>({
    type: BETTING__EXC_INCREMENT_SIZE_ACTION,
    payload: {
      runner,
      side,
      increment,
    },
  });
};

const dispatchBetslipExchangeIncrementSizeAction = (
  dispatch: Dispatch<BetslipExchangeIncrementSizeAction>,
  increment: number,
  currencySymbol?: string,
): void => {
  dispatch<BetslipExchangeIncrementSizeAction>({
    type: UI__BETSLIP_EXC_INCREMENT_SIZE_ACTION,
    payload: {
      increment,
      currencySymbol,
    },
  });
};

const dispatchBettingExchangeRemovePotentialBetAction = (
  dispatch: Dispatch<RemovePotentialBetAction>,
  runner: URN,
  side: ExchangeSideType,
): void => {
  dispatch<RemovePotentialBetAction>({
    type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
    payload: {
      runner,
      side,
    },
  });
};

const dispatchBetslipExchangeRemovePotentialBetAction = (
  dispatch: Dispatch<BetslipExchangeRemovePotentialBetClickAction>,
  runner: URN,
): void => {
  dispatch<BetslipExchangeRemovePotentialBetClickAction>({
    type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
    payload: {
      runner,
    },
  });
};

const dispatchBetslipExchangeBonusChangeAction = (
  dispatch: Dispatch<BetslipExchangeBonusChangeAction>,
  isFreeBetsSelected: boolean,
): void => {
  dispatch<BetslipExchangeBonusChangeAction>({
    type: UI__BETSLIP_EXC_BONUS_CHANGE,
    payload: {
      isFreeBetsSelected: !isFreeBetsSelected,
      product: Product.Exchange,
    },
  });
};

const dispatchBettingExchangeBonusUpdateAction = (
  dispatch: Dispatch<BettingBonusToggleBetAction>,
  isFreeBetsSelected: boolean,
  runner: URN,
  marketEligibleBonus: number,
): void => {
  dispatch<BettingBonusToggleBetAction>({
    type: BETTING__BONUS_TOGGLE_BET_ACTION,
    payload: {
      isFreeBetsSelected: !isFreeBetsSelected,
      runner,
      marketEligibleBonus,
    },
  });
};

const dispatchRemoveAllPotentialBetsAction = (dispatch: Dispatch<RemoveAllPotentialBetsAction>): void => {
  dispatch<RemoveAllPotentialBetsAction>({ type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION });
};

const dispatchBetslipCloseAction = (dispatch: Dispatch<BetslipCloseAction>): void => {
  dispatch<BetslipCloseAction>({ type: UI__BETSLIP_CLOSE_CLICK });
};

const dispatchDepositRedirect = (dispatch: Dispatch<BettingDepositToPlaceBetAction>): void => {
  dispatch<BettingDepositToPlaceBetAction>({ type: BETTING__DEPOSIT_TO_PLACE_BET });
};

const dispatchNavigate = (dispatch: Dispatch<PushAction>, viewUrn: string, viewUrl: string): void => {
  dispatch<PushAction>({
    type: PUSH,
    payload: {
      viewUrn,
      viewUrl,
    },
  });
};

const dispatchLogin = (dispatch: Dispatch<ExternalPushAction>, url: string): void => {
  dispatch<ExternalPushAction>({
    type: EXTERNAL_PUSH,
    payload: {
      viewUrn: "",
      viewUrl: url,
    },
  });
};

const dispatchLoginToPlaceBetAction = (
  dispatch: Dispatch<BetslipExchangeLoginToPlaceBetClickAction>,
  side: ExchangeSideType,
): void => {
  dispatch<BetslipExchangeLoginToPlaceBetClickAction>({
    type: UI__BETSLIP_EXC_LOGIN_TO_PLACE_BET_CLICK,
    payload: {
      side,
    },
  });
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchExchangePlaceBetAction: (runner, confirmFirst) => {
    dispatchBetslipExchangePlaceBetAction(dispatch, runner, confirmFirst);
  },
  dispatchExchangePriceInputChangeAction: (runner, side, newPrice, size) => {
    dispatchBetslipExchangePriceInputChangeAction(dispatch, runner, side, newPrice, size);
    dispatchBettingUpdatePotentialBetAction(dispatch, runner, side, newPrice, size);
  },
  dispatchExchangeSizeInputChangeAction: (runner, side, price, newSize) => {
    dispatchBetslipExchangeSizeInputChangeAction(dispatch, runner, side, price, newSize);
    dispatchBettingUpdatePotentialBetAction(dispatch, runner, side, price, newSize);
  },
  dispatchExchangePriceInputBlurAction: (runner, side, newPrice, size) => {
    dispatchBetslipExchangePriceInputBlurAction(dispatch, runner, side, newPrice, size);
    dispatchBettingUpdatePotentialBetAction(dispatch, runner, side, newPrice, size);
  },
  dispatchExchangeSizeInputBlurAction: (runner, side, price, newSize) => {
    dispatchBettingUpdatePotentialBetAction(dispatch, runner, side, price, newSize);
  },
  dispatchExchangePriceNudgeUpAction: (runner, side) => {
    dispatchBetslipExchangePriceNudgeUpAction(dispatch, runner, side);
    dispatchBettingNudgeUpPotentialBetAction(dispatch, runner, side, "price");
  },
  dispatchExchangePriceNudgeDownAction: (runner, side) => {
    dispatchBetslipExchangePriceNudgeDownAction(dispatch, runner, side);
    dispatchBettingNudgeDownPotentialBetAction(dispatch, runner, side, "price");
  },
  dispatchExchangeSizeNudgeUpAction: (runner, side) => {
    dispatchBettingNudgeUpPotentialBetAction(dispatch, runner, side, "size");
  },
  dispatchExchangeSizeNudgeDownAction: (runner, side) => {
    dispatchBettingNudgeDownPotentialBetAction(dispatch, runner, side, "size");
  },
  dispatchIncrementByQuickStakeAction: (runner, side, increment, currencySymbol) => {
    dispatchBettingExchangeIncrementSizeAction(dispatch, runner, side, increment);
    dispatchBetslipExchangeIncrementSizeAction(dispatch, increment, currencySymbol);
  },
  dispatchExchangeSelectionRemoveAction: (runner, side) => {
    dispatchBetslipExchangeRemovePotentialBetAction(dispatch, runner);
    dispatchBettingExchangeRemovePotentialBetAction(dispatch, runner, side);
  },
  dispatchExchangeBonusChangeAction: (isFreeBetsSelected, runner, eligibleBonus) => {
    dispatchBetslipExchangeBonusChangeAction(dispatch, isFreeBetsSelected);
    dispatchBettingExchangeBonusUpdateAction(dispatch, isFreeBetsSelected, runner, eligibleBonus);
  },
  dispatchCloseAction: () => {
    // Clean potential bets from `bet-engine`, thus cleaning outdated PnL values
    dispatchRemoveAllPotentialBetsAction(dispatch);
    dispatchBetslipCloseAction(dispatch);
  },
  dispatchDepositRedirect: () => dispatchDepositRedirect(dispatch),
  dispatchNavigate: (viewUrn, viewUrl) => dispatchNavigate(dispatch, viewUrn, viewUrl),
  dispatchLogin: (url) => dispatchLogin(dispatch, url),
  dispatchLoginToPlaceBetAction: (side) => dispatchLoginToPlaceBetAction(dispatch, side),
});
