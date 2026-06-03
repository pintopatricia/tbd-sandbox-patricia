import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  getBettingResolvers,
  getAllUniqueRunnersFailures,
  getSportsbookBettingCombinations,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
  getSportsbookBettingState,
  getSportsbookBettingValidations,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { getCurrencySymbol } from "@ppb/formatters";
import { createGetThrottleSelector, PUSH, PushAction, UserDetails } from "@ppb/tbd-store";
import {
  BetslipSportsbookDepositToPlaceBetClick,
  BetslipSportsbookPlaceBetsClick,
  BetslipSportsbookStakeInputChange,
  BetslipSportsbookIncrementStakeAction,
  BetslipSportsbookOddsMovementPrefChange,
  UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
  BettingDepositToPlaceBetAction,
  BettingSportsbookPlaceBetsAction,
  BettingSportsbookUpdateCombinationStakeAction,
  BettingSportsbookIncrementStakeAction,
} from "@ppb/tbd-store/actions/betting";
import { QuickStakesProps, SwitchOnChange } from "@ppb/the-wall-common/types";
import type { Dispatch } from "redux";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getEndpoint } from "../../../../../config/endpoints";
import { buildSbkBalanceAfterBetLabel } from "../../../../../helpers/betslip-balance-helper";
import { i18n } from "../../../../../helpers/i18n";
import {
  buildQuickStakesSelector,
  createGetSbkIsDepositRequiredSelector,
  createGetSbkRequiredDepositValueSelector,
} from "../../../betslip-mapper";
import {
  buildSportsbookTransactionalError,
  createAreAllCombinationsClosedOrSuspendedSelector,
  hasSGMFailures,
} from "../../../connected-sportsbook-betslip-mapper";
import {
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  isStakeValid,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { buildSbkPlaceBetButtonLabels } from "../../../../../helpers/betslip-place-button-helper";
import { currencyFormatWithDecimalPlaces } from "../../../../../formatters/currency-formatters";
import { buildPotentialReturns } from "../../../betslip-formatters";
import { BettingState, RUNNER_FAILURE_CODES, VALIDATION_TYPES } from "@ppb/betslip-core";
import { createGetBetslipHeaderViewModel } from "./vm-builder";
import { getLastSuccessfulStake } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

type QuickBetslipHeader = {
  counter: number;
  title: string;
  subtitle: string;
  moreLabel: string | null;
  isPriceBoostMultiple: boolean;
};

export type CardProps = {
  header: QuickBetslipHeader;
  isStakeValid: boolean;
  isLastStakeValid: boolean;
  placeButtonLabel: string;
  placeBtnLoadingLabel?: string;
  termsUrl: string | null;
  hasFailures?: boolean;
  balanceAfterBet: string;
  totalStake: number;
  totalReturns: string;
  stake?: number;
  currencySymbol: string;
  isPlaceDisabled: boolean;
  isPlacing: boolean;
  hasPlaceError: boolean;
  hasCTALoading: boolean;
  isDepositRequired: boolean;
  requiredDepositValue: number;
  lastSuccessfulStake?: number;
  isOddsMovementOn: boolean;
  showAcceptOddsMovementAlert: boolean;
  oddsMovementLabels: { message: string; detailMessage: string };
  i18n: {
    termsLabel: string;
    termsLinkLabel: string;
    stakePlaceholder: string;
    totalStakeLabel: string;
    totalReturnsLabel: string;
  };
  quickStakes: QuickStakesProps["quickStakes"];
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  combinationId: string;
  onClick: () => void;
};

const i18nLabels = {
  termsLabel: i18n({ key: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH" }),
  termsLinkLabel: i18n({ key: "I18N.BETSLIP.SKYBETS_RULES" }),
  stakePlaceholder: i18n({ key: "I18N.BETSLIP.STAKE_PLACEHOLDER" }),
  totalStakeLabel: i18n({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" }),
  totalReturnsLabel: i18n({ key: "I18N.BETSLIP.POTENTIAL_RETURNS" }),
};

const hasLegsWithMarketFailures = (
  combination: BettingState.Combination,
  bettingLegs: BettingState.LegsMap,
  runnerFailures: BettingState.ImplyRunnerFailuresMap,
) =>
  combination.legs.some((leg) => {
    const bettingLeg = bettingLegs[leg];
    return bettingLeg.runners.some(
      (runner) =>
        runnerFailures[runner] &&
        (hasAnyMarketClosedFailure(runnerFailures[runner]) || hasAnyMarketSuspendedFailure(runnerFailures[runner])),
    );
  });

function isLastSuccessfulStakeValid(
  lastSuccessfulStake: number | undefined,
  combination: BettingState.Combination,
): lastSuccessfulStake is number {
  if (!lastSuccessfulStake || !combination.minStake || combination.calculatedMaxStake === Number.MAX_VALUE) {
    return false;
  }

  return lastSuccessfulStake >= combination.minStake && lastSuccessfulStake <= combination.calculatedMaxStake;
}
const ACCEPT_ODDS_MOVEMENT_LABELS = {
  message: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT" }),
  detailMessage: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DESCRIPTION" }),
};

const ODDS_MOVEMENT_ON_LABELS = {
  message: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_ON" }),
  detailMessage: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_ON_DESCRIPTION" }),
};

const ODDS_MOVEMENT_OFF_LABELS = {
  message: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_OFF" }),
  detailMessage: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_OFF_DESCRIPTION" }),
};

const acceptOddsMovementLabels = (oddsMovementEnabled: boolean, hasUserChangedOddsMovement: boolean) => {
  if (!hasUserChangedOddsMovement && !oddsMovementEnabled) {
    return ACCEPT_ODDS_MOVEMENT_LABELS;
  }

  if (oddsMovementEnabled) {
    return ODDS_MOVEMENT_ON_LABELS;
  }

  return ODDS_MOVEMENT_OFF_LABELS;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getIsDepositRequired = createGetSbkIsDepositRequiredSelector();
  const getSbkRequiredDepositValueSelector = createGetSbkRequiredDepositValueSelector();
  const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector();
  const getBetslipHeaderViewModel = createGetBetslipHeaderViewModel();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { combinationId }: ContainerProps): StateProps => {
    const { betslip } = state;

    if (!betslip) {
      return {};
    }

    const combinationsState = getSportsbookBettingCombinations(state);
    const combination = combinationsState[combinationId];
    if (!combination) {
      return {};
    }
    const legs = getSportsbookBettingLegs(state);
    const legId = combination.legs[0];
    const runnerId = legs[legId].runners[0];

    const resolvers = getBettingResolvers(betslip.group);
    const bettingRunnersMetadata = resolvers.getMetadata(state);
    const metadata = bettingRunnersMetadata[runnerId];
    if (!metadata) {
      return {};
    }

    const validations = getSportsbookBettingValidations(state);
    const userDetails = getUserDetails(state) as UserDetails;
    const runnerFailures = getSportsbookBettingImplyRunnerFailures(state);
    const isDepositRequired = getIsDepositRequired(state);
    const requiredDepositValue = getSbkRequiredDepositValueSelector(state) ?? 0;
    const areAllClosedOrSuspended = getAreAllCombinationsClosedOrSuspended(state);
    const transactionalError = buildSportsbookTransactionalError(state);

    const combinationsValues = Object.values(combinationsState);
    const combinationValidations = validations.combinations[combinationId] ?? [];
    const hasValidStakedCombinations = combinationsValues.some((combination) => {
      const validCombination = !!combination.totalCombinedStake;
      return validCombination && !hasLegsWithMarketFailures(combination, legs, runnerFailures);
    });
    const isPlacing = betslip?.placeStatus === "INPROGRESS";

    const hasFailures = Object.keys(runnerFailures).some((key) => hasSGMFailures(runnerFailures[key]));
    const { totalStake, isBonusSelected, totalPotentialReturns, totalCombinedStake } = getSportsbookBettingState(state);
    const accountBalance = getUserMainWalletValue(state) ?? 0;

    const hasBlockingValidations = combinationValidations.some(
      (validation) => validation.type !== VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE,
    );

    const isPlaceDisabled = !hasValidStakedCombinations || hasBlockingValidations;
    const hasCTALoading = !isDepositRequired;

    const isOddsMovementAlertSwitchEnabled = getThrottle(state.entities.throttles, "ODDS_MOVEMENT_ALERT_SWITCH")
      ?.isActive;

    const balanceAfterBet = buildSbkBalanceAfterBetLabel(userDetails, {
      accountBalance,
      totalStake: totalStake ?? 0,
      isOldUseBonusActive: isBonusSelected,
      isLoggedIn: true,
    });
    const getQuickStakes = buildQuickStakesSelector();
    const quickStakes = getQuickStakes(state);

    let termsUrl: null | string;
    try {
      termsUrl = getEndpoint("GENERAL_TERMS_AND_COND");
    } catch {
      termsUrl = null;
    }

    const currencySymbol = getCurrencySymbol(userDetails) || "";

    const formattedTotalStake = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalStake,
      decimalPlaces: 2,
    });

    const totalReturns = buildPotentialReturns(totalCombinedStake, totalPotentialReturns, userDetails);

    const { label, loadingLabel } = buildSbkPlaceBetButtonLabels({
      isPlacing,
      isDepositRequired,
      isLoggedIn: true,
      hasStake: !!totalStake,
      isSuspended: areAllClosedOrSuspended,
      interpolatedValues: {
        stake: formattedTotalStake,
      },
    });

    const header = getBetslipHeaderViewModel(state, combinationId);
    const lastSuccessfulStake = getLastSuccessfulStake(state);

    const { oddsMovement } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const hasUserChangedOddsMovement = betslip.hasUserChangedOddsMovementPreference;
    const placeRunnerFailures = getAllUniqueRunnersFailures(state);
    const showAcceptOddsMovementAlert =
      placeRunnerFailures.length > 0 &&
      placeRunnerFailures.some((failure) => failure === RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE);
    const oddsMovementLabels = acceptOddsMovementLabels(oddsMovement, hasUserChangedOddsMovement);

    return {
      isStakeValid: isStakeValid(userDetails, combinationValidations),
      header,
      termsUrl,
      hasFailures,
      balanceAfterBet,
      totalStake,
      stake: combination.stake ? combination.stake : undefined,
      totalReturns: totalReturns,
      currencySymbol,
      isLastStakeValid:
        isLastSuccessfulStakeValid(lastSuccessfulStake, combination) &&
        // FIXME: Ideally this would use a @ppb/betslip-core calculator for the stake value to compare.
        // This is very basic and brittle and contemplates just straight stakes but it is enough for the quick betslip for an experiment.
        // Worst case scenario, this just does not pre-populate the input
        !getIsDepositRequired(state, lastSuccessfulStake * combination.numLines),
      lastSuccessfulStake,
      quickStakes,
      isOddsMovementOn: oddsMovement,
      showAcceptOddsMovementAlert: isOddsMovementAlertSwitchEnabled ? showAcceptOddsMovementAlert : false,
      oddsMovementLabels,
      i18n: i18nLabels,
      isPlaceDisabled,
      isPlacing,
      hasPlaceError: !!transactionalError,
      isDepositRequired,
      requiredDepositValue,
      placeButtonLabel: label,
      placeBtnLoadingLabel: loadingLabel,
      hasCTALoading,
    };
  };
};

export type DispatchProps = {
  dispatchStakeChange: ({ id, newValue }: { id: string; newValue?: number }) => void;
  dispatchIncrementPress: (combinationId: string, quickStakeValue: number, currencySymbol?: string) => void;
  dispatchPlacement: () => void;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
  dispatchOddsMovementChange: SwitchOnChange;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchStakeChange: ({ id, newValue }): void => {
    dispatch<BetslipSportsbookStakeInputChange>({
      type: UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
      payload: { combinationId: id, stake: newValue },
    });
    dispatch<BettingSportsbookUpdateCombinationStakeAction>({
      type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
      payload: { combinationId: id, stake: newValue },
    });
  },
  dispatchPlacement: () => {
    dispatch<BetslipSportsbookPlaceBetsClick>({
      type: UI__BETSLIP_SBK_PLACE_BETS_CLICK,
    });
    dispatch<BettingSportsbookPlaceBetsAction>({
      type: BETTING__SBK_PLACE_BETS,
    });
  },
  dispatchDepositRedirect: () => {
    dispatch<BetslipSportsbookDepositToPlaceBetClick>({ type: UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK });
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
  dispatchIncrementPress: (combinationId, quickStakeValue, currencySymbol) => {
    dispatch<BettingSportsbookIncrementStakeAction>({
      type: BETTING__SBK_INCREMENT_STAKE_ACTION,
      payload: { combinationId, increment: quickStakeValue },
    });
    dispatch<BetslipSportsbookIncrementStakeAction>({
      type: UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
      payload: { increment: quickStakeValue, currencySymbol },
    });
  },
  dispatchOddsMovementChange: (isChecked: boolean) => {
    dispatch<BetslipSportsbookOddsMovementPrefChange>({
      type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
      payload: {
        isOddsMovementAccepted: isChecked,
      },
    });
  },
});
