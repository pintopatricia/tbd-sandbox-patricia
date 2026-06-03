import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ExchangePersistenceType } from "@ppb/tbd-store/state/entities";
import URN from "@ppb/tbd-store/state/layout/URN";
import type { AlertProps, StyledProps } from "@ppb/the-wall-common/types";
import type { InlinePanelProps } from "../InlinePanel/InlinePanel.types";
import {
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeUnmatchedDoneClickAction,
  BetslipExchangeUnmatchedPersistenceListClickAction,
  BetslipExchangeUnmatchedUpdateClickAction,
  BetslipExchangeUnmatchedPersistenceItemClickAction,
  UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR,
  UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
  UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
  BetslipExchangeUnmatchedPriceInputBlurAction,
  BetslipExchangeUnmatchedPriceInputChangeAction,
  BetslipExchangeUnmatchedSizeInputChangeAction,
  BetslipExchangeUnmatchedPriceNudgeUpClickAction,
  BetslipExchangeUnmatchedPriceNudgeDownClickAction,
} from "@ppb/tbd-store/actions/betslip";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  getEditingBetState,
  getBetslipExchangeContext,
  getBetslipExchangeEdit,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getExchangeRunnerTree } from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  BettingExchangeUnmatchedUpdate,
  BettingDepositToPlaceBetAction,
  BETTING__EXC_UNMATCHED_UPDATE,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
  BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
  BETTING__UPDATE_UNMATCHED_BET_ACTION,
  NudgeDownUnmatchedBetAction,
  NudgeUpUnmatchedBetAction,
  UpdateUnmatchedBetAction,
} from "@ppb/tbd-store/actions/betting";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import { i18n } from "../../../helpers/i18n";
import { getBetData } from "../betslip-formatters";
import { buildMarketError, buildPlaceError, buildPriceError, buildSizeError } from "../betslip-mapper";

import type { ExchangeInlineEditPanelProps } from "./snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.types";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

type CardProps = {
  title: InlinePanelProps["title"];
  titlePrefix?: InlinePanelProps["titlePrefix"];
  profitLabel?: ExchangeInlineEditPanelProps["profitLabel"];
  profitValue?: ExchangeInlineEditPanelProps["profitValue"];
  profitRawValue?: ExchangeInlineEditPanelProps["profitRawValue"];
  market?: URN;
  runner?: URN;
  side?: ExchangeSideType;
  price?: ExchangeInlineEditPanelProps["price"];
  size?: ExchangeInlineEditPanelProps["size"];
  currencySymbol?: ExchangeInlineEditPanelProps["currencySymbol"];
  betId?: string;
  persistenceListTypes: ExchangeInlineEditPanelProps["persistenceOptions"];
  persistenceListSelectedKey?: ExchangeInlineEditPanelProps["persistenceSelectedId"];
  isPriceDisabled: ExchangeInlineEditPanelProps["isPriceDisabled"];
  isSizeDisabled: ExchangeInlineEditPanelProps["isSizeDisabled"];
  isUpdateButtonDisabled: ExchangeInlineEditPanelProps["isUpdateDisabled"];
  isPersistenceTypeMenuExpanded: ExchangeInlineEditPanelProps["isPersistenceMenuOpen"];
  betDelay?: ExchangeInlineEditPanelProps["betDelay"];
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
  labels: ExchangeInlineEditPanelProps["labels"];
  placeLabel: NonNullable<StyledProps["translation"]>;
  loadingLabel: ExchangeInlineEditPanelProps["loadingLabel"];
  isDepositRequired: boolean;
};
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const PERSISTENCE_TYPE_OPTIONS: StateProps["persistenceListTypes"] = [
    {
      id: "LAPSE",
      text: i18n({ key: "I18N.BETSLIP.CANCEL_BET" }),
    },
    {
      id: "PERSIST",
      text: i18n({ key: "I18N.BETSLIP.KEEP_BET" }),
    },
  ];
  const labels: StateProps["labels"] = {
    cancel: i18n({ key: "I18N.BETSLIP.CANCEL_BET" }),
    price: i18n({ key: "I18N.BETSLIP.ODDS" }),
    size: i18n({ key: "I18N.BETSLIP.STAKE" }),
    persistence: i18n({ key: "I18N.BETSLIP.AT_IN_PLAY" }),
  };

  const baseState: StateProps = {
    isPriceDisabled: false,
    isSizeDisabled: false,
    isPersistenceTypeMenuExpanded: false,
    isUpdateButtonDisabled: false,
    labels,
    placeLabel: i18n({ key: "I18N.BETSLIP.UPDATE_BET" }),
    loadingLabel: i18n({ key: "I18N.BETSLIP.PLACING_BET" }),
    persistenceListTypes: PERSISTENCE_TYPE_OPTIONS,
    isDepositRequired: false,
    title: "",
  };

  return (appState: ApplicationState): StateProps => {
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetails(appState);
    } catch (e) {
      console.error(e);

      return {};
    }

    const { betslip, entities } = appState;

    if (!betslip) {
      return {};
    }

    const betslipContext = getBetslipExchangeContext(appState);

    if (!betslipContext) {
      return baseState;
    }

    const runnerTree = getExchangeRunnerTree(entities, betslipContext.runner);

    if (!runnerTree) {
      return baseState;
    }

    const exchangeEdit = getBetslipExchangeEdit(appState);

    if (!exchangeEdit) {
      return baseState;
    }

    const { runner, market } = runnerTree;
    const { betDelay, status: marketStatus, urn: marketURN } = market;
    const editingBetState = getEditingBetState(appState, marketURN);

    if (!editingBetState) {
      return baseState;
    }

    const { betId, isPersistenceTypeMenuExpanded } = exchangeEdit;
    const {
      isValid,
      persistenceType,
      hasPriceChanged,
      hasSizeChanged,
      hasPersistenceTypeChanged,
      side,
      size,
      price,
      priceValidation,
    } = editingBetState;

    const currencySymbol = getCurrencySymbol(userDetails);

    const selectedPersistenceType = PERSISTENCE_TYPE_OPTIONS.find((type) => type.id === persistenceType);
    const selectedPersistenceTypeID = selectedPersistenceType?.id ?? "";

    const isUpdateEnabled = isValid && (hasSizeChanged || hasPriceChanged || hasPersistenceTypeChanged);

    const titlePrefix =
      side === ExchangeSide.BACK
        ? i18n({ key: "I18N.BETSLIP.BACK_BET_FOR" })
        : i18n({ key: "I18N.BETSLIP.LAY_BET_AGAINST" });
    const title = getInlineBetslipTitle(appState);

    const isDepositRequired = betslip.exchangePlaceError?.errorCode === "INSUFFICIENT_FUNDS";

    const placeLabel = isDepositRequired ? i18n({ key: "I18N.BETSLIP.DEPOSIT_TO_PLACE_BET" }) : baseState.placeLabel;
    const loadingLabel = isDepositRequired ? "" : baseState.loadingLabel;
    const betData = getBetData(editingBetState, userDetails, isDepositRequired);

    const marketError = buildMarketError(marketStatus);
    const placeError = buildPlaceError(marketStatus, betslip.exchangePlaceError, currencySymbol);
    const priceError = buildPriceError(marketStatus, priceValidation, price);
    const sizeError = buildSizeError(marketStatus, userDetails, editingBetState?.sizeValidation);

    return {
      ...baseState,
      placeLabel,
      loadingLabel,
      title,
      titlePrefix,
      profitLabel: betData.label,
      profitValue: betData.value,
      profitRawValue: betData.rawValue,
      runner: runner.urn,
      market: marketURN,
      side,
      price,
      size,
      currencySymbol,
      placeError,
      priceError,
      sizeError,
      marketError,
      betDelay,
      betId,
      persistenceListSelectedKey: selectedPersistenceTypeID,
      isPriceDisabled: hasSizeChanged || hasPersistenceTypeChanged,
      isSizeDisabled: hasPriceChanged || hasPersistenceTypeChanged,
      isUpdateButtonDisabled: !isUpdateEnabled,
      isPersistenceTypeMenuExpanded: !hasSizeChanged && !hasPriceChanged && isPersistenceTypeMenuExpanded,
      isDepositRequired,
    };
  };
};

export type DispatchProps = {
  dispatchUnmatchedCancel: (betIds: string[], runner: URN) => void;
  dispatchUnmatchedUpdate: (betId: string, market: URN, runner: URN, betOriginURL: string | null) => void;
  dispatchUnmatchedDone: () => void;
  dispatchUnmatchedPersistenceItemClick: (betId: string, persistenceType: ExchangePersistenceType) => void;
  dispatchUnmatchedPersistenceListClick: (betId: string, isPersistenceTypeMenuExpanded: boolean) => void;
  dispatchEditPriceInputChange: (
    runner: URN,
    betId: string,
    side: ExchangeSideType,
    price?: number,
    size?: number,
  ) => void;
  dispatchEditPriceInputBlur: (
    runner: URN,
    betId: string,
    side: ExchangeSideType,
    price?: number,
    size?: number,
  ) => void;
  dispatchEditSizeInputChange: (
    runner: URN,
    betId: string,
    side: ExchangeSideType,
    size?: number,
    price?: number,
  ) => void;
  dispatchEditSizeInputBlur: (
    runner: URN,
    betId: string,
    side: ExchangeSideType,
    price?: number,
    size?: number,
  ) => void;
  dispatchEditPriceNudgeUp: (runner: URN, betId: string, side: ExchangeSideType) => void;
  dispatchEditPriceNudgeDown: (runner: URN, betId: string, side: ExchangeSideType) => void;
  dispatchEditSizeNudgeUp: (runner: URN, betId: string) => void;
  dispatchEditSizeNudgeDown: (runner: URN, betId: string) => void;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
};
export type ContainerProps = {};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchUnmatchedCancel: (betIds, runner) => {
    dispatch<BetslipExchangeUnmatchedCancelClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_CANCEL_CLICK,
      payload: {
        instructions: { betIds, runner },
      },
    });
  },
  dispatchUnmatchedUpdate: (betId, market, runner, betOriginURL) => {
    dispatch<BetslipExchangeUnmatchedUpdateClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_UPDATE_CLICK,
      payload: {
        betId,
        market,
        runner,
        betOriginURL,
      },
    });
    dispatch<BettingExchangeUnmatchedUpdate>({
      type: BETTING__EXC_UNMATCHED_UPDATE,
      payload: {
        betId,
        market,
        runner,
        betOriginURL,
      },
    });
  },
  dispatchUnmatchedDone: () => {
    dispatch<BetslipExchangeUnmatchedDoneClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_DONE_CLICK,
    });
  },
  dispatchUnmatchedPersistenceItemClick: (betId, persistenceType) => {
    dispatch<BetslipExchangeUnmatchedPersistenceItemClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK,
      payload: {
        betId,
        persistenceType,
      },
    });
  },
  dispatchUnmatchedPersistenceListClick: (betId, isPersistenceTypeMenuExpanded) => {
    dispatch<BetslipExchangeUnmatchedPersistenceListClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_LIST_CLICK,
      payload: {
        betId,
        isPersistenceTypeMenuExpanded,
      },
    });
  },
  dispatchEditPriceInputChange: (runner: URN, betId: string, side: ExchangeSideType, price?: number, size?: number) => {
    dispatch<BetslipExchangeUnmatchedPriceInputChangeAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_CHANGE,
      payload: {
        runner,
        side,
        price,
        size,
      },
    });
    dispatch<UpdateUnmatchedBetAction>({
      type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        price,
        size,
        side,
      },
    });
  },
  dispatchEditPriceInputBlur: (runner: URN, betId: string, side: ExchangeSideType, price?: number, size?: number) => {
    dispatch<BetslipExchangeUnmatchedPriceInputBlurAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PRICE_INPUT_BLUR,
      payload: {
        runner,
        side,
        price,
        size,
      },
    });
    dispatch<UpdateUnmatchedBetAction>({
      type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        price,
        size,
        side,
      },
    });
  },
  dispatchEditSizeInputChange: (runner: URN, betId: string, side: ExchangeSideType, size?: number, price?: number) => {
    dispatch<BetslipExchangeUnmatchedSizeInputChangeAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_SIZE_INPUT_CHANGE,
      payload: {
        runner,
        side,
        size,
        price,
      },
    });
    dispatch<UpdateUnmatchedBetAction>({
      type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        price,
        size,
        side,
      },
    });
  },
  dispatchEditSizeInputBlur: (runner: URN, betId: string, side: ExchangeSideType, price?: number, size?: number) => {
    dispatch<UpdateUnmatchedBetAction>({
      type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        price,
        size,
        side,
      },
    });
  },
  dispatchEditPriceNudgeUp: (runner: URN, betId: string, side: ExchangeSideType) => {
    dispatch<BetslipExchangeUnmatchedPriceNudgeUpClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_UP,
      payload: {
        runner,
        betId,
        side,
      },
    });
    dispatch<NudgeUpUnmatchedBetAction>({
      type: BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        input: "price",
      },
    });
  },
  dispatchEditPriceNudgeDown: (runner: URN, betId: string, side: ExchangeSideType) => {
    dispatch<BetslipExchangeUnmatchedPriceNudgeDownClickAction>({
      type: UI__BETSLIP_EXC_UNMATCHED_PRICE_NUDGE_DOWN,
      payload: {
        runner,
        betId,
        side,
      },
    });
    dispatch<NudgeDownUnmatchedBetAction>({
      type: BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        input: "price",
      },
    });
  },
  dispatchEditSizeNudgeUp: (runner: URN, betId: string) => {
    dispatch<NudgeUpUnmatchedBetAction>({
      type: BETTING__NUDGE_UP_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        input: "size",
      },
    });
  },
  dispatchEditSizeNudgeDown: (runner: URN, betId: string) => {
    dispatch<NudgeDownUnmatchedBetAction>({
      type: BETTING__NUDGE_DOWN_UNMATCHED_BET_ACTION,
      payload: {
        runner,
        betId,
        input: "size",
      },
    });
  },
  dispatchDepositRedirect: () => {
    dispatch<BettingDepositToPlaceBetAction>({ type: BETTING__DEPOSIT_TO_PLACE_BET });
  },
  dispatchNavigate: (viewUrn: string, viewUrl: string) => {
    dispatch<PushAction>({
      type: PUSH,
      payload: {
        viewUrn,
        viewUrl,
      },
    });
  },
});
