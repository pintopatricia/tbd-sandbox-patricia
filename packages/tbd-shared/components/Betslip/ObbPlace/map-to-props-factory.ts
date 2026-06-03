import { EXTERNAL_PUSH, ExternalPushAction, PUSH, PushAction, UserDetails } from "@ppb/tbd-store";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getObbBettingState } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  BettingObbIncrementStakeAction,
  BettingObbPlaceBetsAction,
  BettingDepositToPlaceBetAction,
  BettingObbClearAction,
  BETTING__OBB_PLACE_BETS,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_INCREMENT_STAKE_ACTION,
} from "@ppb/tbd-store/actions/betting";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { AlertType, QuickStakesProps, KeyboardSeparator, BetControlsProps } from "@ppb/the-wall-common/types";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { BetslipAccordionHeaderClick, UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import { i18n } from "../../../helpers/i18n";
import { currencyFormatWithDecimalPlaces, getCurrencySymbol } from "../../../formatters/currency-formatters";
import { createGetObbIsDepositRequiredSelector, buildQuickStakesSelector } from "../betslip-mapper";
import { createValidationsSelector } from "../ObbNotifier/obb-notifier-mapper";
import { createGetAvailabilityFailuresOnStakedBetsSelector } from "../connected-obb-betslip-mapper";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { getEndpoint } from "../../../config/endpoints";
import { hasSameBaseBets, isCombinedPotentialBet, ObbMultipleDetails } from "../../../helpers/obb";
import { ObbXOfNLegParams } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";

type PlaceFooterI18n = {
  balanceAfterBet: string;
  totalReturns: string;
  removeLabel: string;
  freeBetsLabel?: string;
  freeBetsAlertRemoveLabel?: string;
  termsLabel?: string;
  termsLinkLabel?: string;
  voidBlurbText: string;
  multiples: string;
  additionalMultiples: string;
  singles: string;
  casts: string;
  oddsLabel: string;
  stakeLabel: string;
  oddsMovementUp: string;
  oddsMovementDown: string;
  eachWay: string;
  eachWaySubtitle: string;
  betBuilder: string;
  multiBetBuilder: string;
  priceBoosts: string;
  tabAllTitle: string;
  tabBetBuildersTitle: string;
  tabMultiplesTitle: string;
  tabCastTitle: string;
  tabSinglesTitle: string;
  betslipAriaTitle: string;
};

export type ContainerProps = {};

type CardProps = {
  i18n: PlaceFooterI18n;
  isLoggedIn: boolean;
  totalReturns: string;
  isPanelDisabled: boolean;
  isPlaceDisabled: boolean;
  isCollapsed?: boolean;
  hasError: boolean;
  isDepositRequired: boolean;
  placeBtnLabel: string;
  placeBtnSecondaryLabel?: string;
  placeBtnLoadingLabel?: string;
  reversePlaceBtnLabels: boolean;
  balanceAfterBet?: string;
  currencySymbol: BetControlsProps["currencySymbol"];
  quickStakes: QuickStakesProps["quickStakes"];
  separator: KeyboardSeparator;
  singles: string[];
  multiplesGroups: Array<Array<ObbMultipleDetails>>;
  termsUrl?: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const i18nLabels = {
    balanceAfterBet: i18n({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" }),
    totalReturns: i18n({ key: "I18N.BETSLIP.TOTAL_RETURNS" }),
    removeLabel: i18n({ key: "I18N.BETSLIP.REMOVE_ALL" }),
    freeBetsLabel: i18n({ key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" }),
    freeBetsAlertRemoveLabel: i18n({ key: "I18N.BETSLIP.REMOVE" }),
    termsLabel: i18n({ key: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH" }),
    voidBlurbText: i18n({ key: "I18N.BETSLIP.OBB.VOID_BLURB" }),
    multiples: i18n({ key: "I18N.BETSLIP.MULTIPLES" }),
    additionalMultiples: "",
    singles: i18n({ key: "I18N.BETSLIP.SINGLES" }),
    casts: "",
    oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stakeLabel: i18n({ key: "I18N.BETSLIP.STAKE" }),
    oddsMovementUp: "",
    oddsMovementDown: "",
    eachWay: "",
    eachWaySubtitle: "",
    betBuilder: i18n({ key: "I18N.BETSLIP.BET_BUILDER" }),
    multiBetBuilder: "s",
    termsLinkLabel: i18n({ key: "I18N.BETSLIP.SKYBETS_RULES" }),
    priceBoosts: "",
    totalStake: "",
    placing: "",
    tabAllTitle: i18n({ key: "I18N.BETSLIP.TABS.ALL" }),
    tabBetBuildersTitle: i18n({ key: "I18N.BETSLIP.TABS.BET_BUILDER" }),
    tabMultiplesTitle: i18n({ key: "I18N.BETSLIP.TABS.MULTIPLES" }),
    tabCastTitle: i18n({ key: "I18N.BETSLIP.TABS.CAST_BET" }),
    tabSinglesTitle: i18n({ key: "I18N.BETSLIP.TABS.SINGLES" }),
    betslipAriaTitle: i18n({ key: "I18N.BETSLIP.TITLE" }),
  };

  const getIsDepositRequired = createGetObbIsDepositRequiredSelector();
  const getOddsMovementState = createOddsMovementSelector();
  const getValidations = createValidationsSelector();
  const getAvailabilityFailuresOnStakedBets = createGetAvailabilityFailuresOnStakedBetsSelector();
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getQuickStakes = buildQuickStakesSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return (appState: ApplicationState): StateProps => {
    if (!appState.betslip) {
      return {};
    }

    let userDetails: UserDetails;
    try {
      userDetails = <UserDetails>getUserDetails(appState);
    } catch (e) {
      console.error(e);
      return {};
    }

    let termsUrl: string | undefined;
    try {
      termsUrl = getEndpoint("GENERAL_TERMS_AND_COND");
    } catch {
      termsUrl = undefined;
    }

    const { loggedIn, isAuthenticating } = userDetails;
    const card = getBetslipCard(appState);
    const isDepositRequired = getIsDepositRequired(appState);
    const bettingState = getObbBettingState(appState);
    const oddsMovementMap = getOddsMovementState(appState.betslip.obbOddsMovement);
    const hasAnyOddChanged = Object.values(oddsMovementMap).some((potentialBet) => potentialBet.movement !== null);
    const validations = getValidations(appState);

    const hasStakedPotentialBets = Object.values(bettingState.potentialBets).some((bet) => !!bet.stake);

    const hasAvailabilityFailuresOnStakedBets = getAvailabilityFailuresOnStakedBets(appState);

    const hasError = !!bettingState.failures.betslip;
    const hasBlockingValidations = validations.some((validation) => validation.notification?.type === AlertType.Error);

    const isPlacing = card?.placeStatus === "INPROGRESS";
    const isPlaceDisabled = !hasStakedPotentialBets || hasBlockingValidations || hasAvailabilityFailuresOnStakedBets;

    const singles: string[] = [];
    const multiplesGroups: ObbMultipleDetails[][] = [];

    Object.values(bettingState.potentialBets).forEach(({ id, legs }) => {
      const potentialBetLegs = legs.map((legId) => bettingState.legs[legId]);

      if (!isCombinedPotentialBet(potentialBetLegs)) {
        singles.push(id);
        return;
      }

      const params = bettingState.legs[legs[0]].params as ObbXOfNLegParams;

      const matchingGroup = multiplesGroups.find((group) => {
        const groupLegs = bettingState.potentialBets[group[0].id].legs.map((legId) => bettingState.legs[legId]);
        return hasSameBaseBets(potentialBetLegs, groupLegs);
      });

      matchingGroup ? matchingGroup.push({ id, x: params.x }) : multiplesGroups.push([{ id, x: params.x }]);
    });

    const sortedMultiplesGroups = multiplesGroups.map((group) => {
      return group.sort((a, b) => a.x - b.x);
    });

    const filteredMultiplesGroups = sortedMultiplesGroups.map((group) => {
      const hasMissingQuotes = group.some(({ id: potentialBetId }) => {
        return !bettingState.potentialBets[potentialBetId].quote;
      });

      return hasMissingQuotes ? [group[group.length - 1]] : group;
    });

    const totalStake = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: bettingState.totalStake ?? 0,
      decimalPlaces: 2,
    });

    const { oddsMovement } = getUserPreferencesWithProductSwitcher(appState.entities?.preferences);

    const { label, secondaryLabel, loadingLabel, reverseLabels } = buildSbkPlaceBetButtonLabels({
      isPlacing,
      isAuthenticating,
      isDepositRequired,
      isLoggedIn: loggedIn,
      hasStake: !!bettingState.totalStake,
      hasOddsChanged: hasAnyOddChanged,
      interpolatedValues: { stake: totalStake },
      shouldAcceptOddsMovement: oddsMovement,
    });

    const totalReturns = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: bettingState.totalPotentialReturns ?? 0,
      decimalPlaces: 2,
    });

    const accountBalance = getUserMainWalletValue(appState) ?? 0;

    const balanceAfterBet = buildSbkBalanceAfterBetLabel(userDetails, {
      accountBalance,
      totalStake: bettingState.totalStake ?? 0,
      isLoggedIn: loggedIn,
    });

    if (!appState.betslip) {
      return {};
    }
    const { isCollapsed } = appState.betslip;

    const quickStakes = getQuickStakes(appState);
    return {
      i18n: i18nLabels,
      placeBtnLabel: label,
      placeBtnSecondaryLabel: secondaryLabel,
      placeBtnLoadingLabel: loadingLabel,
      reversePlaceBtnLabels: reverseLabels,
      isLoggedIn: loggedIn,
      isDepositRequired,
      hasError,
      isPanelDisabled: isPlacing || !!isAuthenticating,
      isPlaceDisabled,
      isCollapsed,
      totalReturns,
      balanceAfterBet,
      currencySymbol: `${getCurrencySymbol(userDetails)}`,
      quickStakes,
      separator: getSeparatorByLocale(userDetails.localeCode),
      singles,
      multiplesGroups: filteredMultiplesGroups,
      termsUrl,
    };
  };
};

export type DispatchActions =
  | BettingDepositToPlaceBetAction
  | PushAction
  | ExternalPushAction
  | BettingObbClearAction
  | BettingObbPlaceBetsAction
  | BettingObbIncrementStakeAction
  | BetslipAccordionHeaderClick
  | BettingObbPlaceBetsAction;

export type DispatchProps = {
  dispatchOnRemoveAllClick: () => void;
  dispatchOnPlaceBetsClick: () => void;
  dispatchRedirectToLogin: (ssoWithRedirectUrl: string) => void;
  dispatchDepositRedirect: () => void;
  dispatchAccordionToggle: (isExpanded: boolean) => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
  dispatchIncrementPress: ({
    potentialBetId,
    increment,
    currencySymbol,
  }: {
    potentialBetId: string;
    increment: number;
    currencySymbol?: string;
  }) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
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
  dispatchOnRemoveAllClick: () => {
    dispatch<BettingObbClearAction>({
      type: BETTING__OBB_CLEAR_ACTION,
    });
  },
  dispatchOnPlaceBetsClick: () => {
    dispatch<BettingObbPlaceBetsAction>({
      type: BETTING__OBB_PLACE_BETS,
    });
  },
  dispatchAccordionToggle: (isExpanded: boolean) => {
    dispatch<BetslipAccordionHeaderClick>({
      type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
      payload: { isExpanded },
    });
  },
  dispatchRedirectToLogin: (url: string) => {
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: url,
      },
    });
  },
  dispatchIncrementPress: ({ potentialBetId, increment }) => {
    dispatch<BettingObbIncrementStakeAction>({
      type: BETTING__OBB_INCREMENT_STAKE_ACTION,
      payload: { potentialBetId, increment },
    });
  },
});
