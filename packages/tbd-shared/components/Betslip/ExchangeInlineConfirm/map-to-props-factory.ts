import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { StyledProps } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  BetslipCloseAction,
  BetslipExchangeConfirmBetsClickAction,
  BetslipExchangeConfirmPanelBackClickAction,
  UI__BETSLIP_CLOSE_CLICK,
  UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
  UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { getBetslipExchangeContext, getIsFreeBetsSelected } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import {
  getExchangeEligibleBonusByMarketId,
  getRunnerPotentialBetWithBonus,
} from "@ppb/tbd-store/state/betting/exchange-betting-bonus/exchange-betting-bonus-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { BETTING__DEPOSIT_TO_PLACE_BET, BettingDepositToPlaceBetAction } from "@ppb/tbd-store/actions/betting";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { i18n } from "../../../helpers/i18n";
import { getCurrencySymbol } from "../../../formatters/currency-formatters";
import {
  buildExchangeTransactionalError,
  buildFreeBetsLabel,
  ConfirmBet,
  getBetData,
  getPotentialExposure,
} from "../betslip-formatters";
import type { ExchangeInlineConfirmPanelProps } from "./snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.types";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";

export type ContainerProps = {};

type CardProps = {
  labels: ExchangeInlineConfirmPanelProps["labels"];
  urn?: URN;
  title: ExchangeInlineConfirmPanelProps["title"];
  titlePrefix?: ExchangeInlineConfirmPanelProps["titlePrefix"];
  freeBets?: ExchangeInlineConfirmPanelProps["freeBets"];
  side?: ExchangeInlineConfirmPanelProps["side"];
  price?: ExchangeInlineConfirmPanelProps["price"];
  size?: ExchangeInlineConfirmPanelProps["size"];
  currencySymbol?: ExchangeInlineConfirmPanelProps["currencySymbol"];
  profitLabel: ExchangeInlineConfirmPanelProps["profitLabel"];
  profitValue: ExchangeInlineConfirmPanelProps["profitValue"];
  profitRawValue: ExchangeInlineConfirmPanelProps["profitRawValue"];
  confirm: StyledProps["translation"];
  loading: ExchangeInlineConfirmPanelProps["loading"];
  error?: ExchangeInlineConfirmPanelProps["error"];
  betDelay?: ExchangeInlineConfirmPanelProps["betDelay"];
  isDepositRequired: boolean;
  isFreeBetsSelected: ExchangeInlineConfirmPanelProps["isFreeBetsSelected"];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRunnerPotentialBets = createExcRunnerPotentialBetsByRunnerURNSelector();
  const labels = {
    edit: i18n({ key: "I18N.BETSLIP.EDIT_BET" }),
    price: i18n({ key: "I18N.BETSLIP.ODDS" }),
    size: i18n({ key: "I18N.BETSLIP.STAKE" }),
  };
  const noStateProps = {
    labels,
    isFreeBetsSelected: false,
    isDepositRequired: false,
    profitLabel: "",
    profitValue: "",
    profitRawValue: 0,
    confirm: "",
    loading: "",
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
    const currencySymbol = getCurrencySymbol(userDetails);

    if (!betslipContext || !currencySymbol) {
      return noStateProps;
    }

    const [potentialBet] = getRunnerPotentialBets(appState, betslipContext.runner);
    const runnerTree = getExchangeRunnerTree(entities, betslipContext.runner);

    if (!potentialBet || !runnerTree) {
      return noStateProps;
    }

    const { exchangePlaceError } = betslip;
    const { runner, market } = runnerTree;
    const { betDelay, marketId, bettingType, marketType } = market;
    const { size, price, side } = potentialBet;

    const isFreeBetsSelected = getIsFreeBetsSelected(appState);
    const isDepositRequired = exchangePlaceError?.errorCode === "INSUFFICIENT_FUNDS";

    const potentialBetData = isFreeBetsSelected
      ? getRunnerPotentialBetWithBonus(appState, runner, marketId, marketType, bettingType)
      : potentialBet;
    const betData = getBetData({ ...potentialBetData, side }, userDetails, isDepositRequired);
    const loadingLabel = isDepositRequired ? "" : i18n({ key: "I18N.BETSLIP.PLACING_BET" });

    let freeBetsLabel;

    if (isFreeBetsSelected) {
      const eligibleBonus = getExchangeEligibleBonusByMarketId(
        appState,
        marketId,
        runner.selectionId,
        marketType,
        bettingType,
      );

      if (eligibleBonus > 0) {
        const potentialExposure = getPotentialExposure(potentialBet as ConfirmBet);

        const bonusUsed = potentialExposure > eligibleBonus ? eligibleBonus : potentialExposure;

        freeBetsLabel = buildFreeBetsLabel("I18N.BETSLIP.USING_BONUS", userDetails, bonusUsed);
      }
    }

    return {
      ...noStateProps,
      urn: runner.urn,
      freeBets: freeBetsLabel,
      titlePrefix:
        side === ExchangeSide.BACK
          ? i18n({ key: "I18N.BETSLIP.BACK_BET_FOR" })
          : i18n({ key: "I18N.BETSLIP.LAY_BET_AGAINST" }),
      title: getInlineBetslipTitle(appState),
      side,
      price,
      size,
      currencySymbol,
      profitLabel: betData.label,
      profitValue: betData.value,
      profitRawValue: betData.rawValue,
      loading: loadingLabel,
      confirm: isDepositRequired
        ? i18n({ key: "I18N.BETSLIP.DEPOSIT_TO_PLACE_BET" })
        : i18n({ key: "I18N.BETSLIP.CONFIRM_BET" }),
      betDelay,
      error: exchangePlaceError ? buildExchangeTransactionalError(exchangePlaceError, currencySymbol) : undefined,
      isDepositRequired,
      isFreeBetsSelected,
    };
  };
};

export type DispatchActions =
  | BetslipCloseAction
  | BetslipExchangeConfirmPanelBackClickAction
  | BetslipExchangeConfirmBetsClickAction
  | BettingDepositToPlaceBetAction
  | PushAction;

export type DispatchProps = {
  dispatchConfirmBet: (runner: URN) => void;
  dispatchEdit: () => void;
  dispatchClose: () => void;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchConfirmBet(runner) {
    dispatch<BetslipExchangeConfirmBetsClickAction>({
      type: UI__BETSLIP_EXC_CONFIRM_BET_CLICK,
      payload: {
        runner,
      },
    });
  },
  dispatchEdit() {
    dispatch<BetslipExchangeConfirmPanelBackClickAction>({ type: UI__BETSLIP_EXC_CONFIRM_PANEL_BACK_CLICK });
  },
  dispatchClose() {
    dispatch<BetslipCloseAction>({ type: UI__BETSLIP_CLOSE_CLICK });
  },
  dispatchDepositRedirect() {
    dispatch<BettingDepositToPlaceBetAction>({ type: BETTING__DEPOSIT_TO_PLACE_BET });
  },
  dispatchNavigate(viewUrn, viewUrl) {
    dispatch<PushAction>({
      type: PUSH,
      payload: {
        viewUrn,
        viewUrl,
      },
    });
  },
});
