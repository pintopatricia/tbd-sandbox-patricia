import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { BettingState, RUNNER_FAILURE_CODES, VALIDATION_TYPES } from "@ppb/betslip-core";
import {
  BetslipAccordionHeaderClick,
  BetslipSportsbookTabSwitchAction,
  BetslipSportsbookLoginToPlaceBetClickAction,
  BetslipSportsbookDepositToPlaceBetClick,
  BetslipSportsbookPlaceBetsClick,
  BetslipSportsbookRemoveLegClick,
  BetslipSportsbookRemoveSelectionsClick,
  BetslipSportsbookIncrementStakeAction,
  BetslipSportsbookOddsMovementPrefChange,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_DEPOSIT_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_PLACE_BETS_CLICK,
  UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
  UI__BETSLIP_SBK_INCREMENT_STAKE_ACTION,
  UI__BETSLIP_SBK_TAB_SWITCH,
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import {
  BettingDepositToPlaceBetAction,
  BettingSportsbookPlaceBetsAction,
  BettingSportsbookBonusToggleAction,
  BettingSportsbookRemoveLegAction,
  BettingSportsbookConfirmBetsAction,
  BettingSportsbookRemoveAllWalletsAction,
  BettingSportsbookIncrementStakeAction,
  BETTING__SBK_PLACE_BETS,
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_BONUS_TOGGLE_ACTION,
  BETTING__SBK_REMOVE_LEG_ACTION,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION,
  BETTING__SBK_INCREMENT_STAKE_ACTION,
  BETTING__SBK_CLEAR_ACTION,
  BettingSportsbookClearAction,
} from "@ppb/tbd-store/actions/betting";
import {
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  isCast,
  isMultiBetBuilder,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  createCombinationGroupFailuresSelector,
  createGetBetBuilderCombinationIdsSelector,
  createGetBoostedCombinationsSelector,
  getSportsbookBettingImplyRunnerFailures,
  createGetCombinationsSelectedWalletsAmounts,
  getSportsbookBettingState,
  getSingleCombinationIds,
  createGetBoostedUncombinedGroupIdsSelector,
  createHasMultiplesSelector,
  createGetCastGroupIdsSelector,
  getSportsbookBettingRunners,
  getAllUniqueRunnersFailures,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { AlertType, QuickStakesProps, KeyboardSeparator, SwitchOnChange } from "@ppb/the-wall-common/types";
import { EXTERNAL_PUSH, ExternalPushAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { SelectionRemovePayload } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { Product } from "@ppb/tbd-store/state/entities";

import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { SportsbookPlacePanelViewModel } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { BetslipSection } from "../Betslip.types";
import { currencyFormatWithDecimalPlaces, getCurrencySymbol } from "../../../formatters/currency-formatters";
import { i18n } from "../../../helpers/i18n";
import { buildCombinationOdds, buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";
import {
  buildSportsbookTransactionalError,
  createAreAllCombinationsClosedOrSuspendedSelector,
  createMultiplesNotificationsSelector,
} from "../connected-sportsbook-betslip-mapper";
import { createValidationsSelector } from "../Notifier/notifier-mapper";
import {
  buildQuickStakesSelector,
  createGetSbkIsDepositRequiredSelector,
  createGetSbkRequiredDepositValueSelector,
} from "../betslip-mapper";
import { getBetslipConfig, getEndpoint } from "../../../config/endpoints";

import { createGetMultipleCombinations } from "./sportsbook-place-mapper";
import { createIsConfirmStepActive } from "../sportsbook-betslip-confirm-mapper";
import { buildFreeBetsAlertMessage, sumWalletsAmounts } from "../../../helpers/generosity-wallets";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { BetslipCollapseStrategy } from "./hooks/useCollapseStrategy";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";

type BetslipCardsOrder = {
  id: string;
  cardsOrder: BetslipSection[];
};

export type ContainerProps = {
  experimentVariant?: string;
};

export type MarketSelection = {
  selectionId: number;
  marketId: string;
};

type CardProps = {
  betslipCardsOrder: BetslipCardsOrder[];
  collapseStrategy: BetslipCollapseStrategy;
  betBuilderIds: string[];
  boostedCombinationIds: string[];
  failedCombinationGroups: number[];
  failedCombinationGroupIds: string[];
  hasPlaceError: SportsbookPlacePanelViewModel["hasPlaceError"];
  i18n: SportsbookPlacePanelViewModel["i18n"];
  isPanelDisabled?: SportsbookPlacePanelViewModel["isPanelDisabled"];
  isPlaceDisabled: SportsbookPlacePanelViewModel["isPlaceDisabled"];
  isSummaryDisabled?: SportsbookPlacePanelViewModel["isSummaryDisabled"];
  totalReturns: SportsbookPlacePanelViewModel["totalReturns"];
  totalOriginalReturns: SportsbookPlacePanelViewModel["totalOriginalReturns"];
  hasSingles: boolean;
  hasOnlyOneSingle: boolean;
  hasOneLineMultiple: boolean;
  hasMultipleLinesMultiples: boolean;
  hasMultiBetBuilder: boolean;
  hasCastBets: boolean;
  hasPriceBoost: boolean;
  hasBetBuilders: boolean;
  shouldFocusMultiple?: boolean;
  shouldFocusBetBuilder?: boolean;
  shouldFocusCastBet?: boolean;
  focusedCard?: BetslipSection;
  firstCombinationId?: string;
  isFreeBetsSelected: boolean;
  isEligibleToBonus: boolean;
  isBetConfirmationStepActive: boolean;
  isCollapsed?: boolean;
  isOddsMovementOn: boolean;
  showAcceptOddsMovementAlert: boolean;
  oddsMovementLabels: { message: string; detailMessage: string };
  placeBtnLabel: string;
  placeBtnSecondaryLabel?: string;
  placeBtnLoadingLabel?: string;
  reversePlaceBtnLabels: boolean;
  isLoggedIn: boolean;
  isDepositRequired: boolean;
  requiredDepositValue: number;
  isOddsBoosted: boolean;
  termsUrl?: string;
  shouldDisplayPlaceholder: boolean;
  freeBetsAlertMessage?: string;
  balanceAfterBet?: string;
  currencySymbol: string;
  quickStakes: QuickStakesProps["quickStakes"];
  separator: KeyboardSeparator;
  marketSelections: MarketSelection[];
};
export type StateProps = CardProps | Record<string, never>;

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

const evaluateCardFocus = ({
  hasPriceBoost,
  hasMultiBetBuilder,
  hasBetBuilders,
  hasOneLineMultiple,
  hasMultipleLinesMultiples,
  hasCastBets,
  hasSingles,
}: Pick<
  CardProps,
  | "hasPriceBoost"
  | "hasMultiBetBuilder"
  | "hasBetBuilders"
  | "hasOneLineMultiple"
  | "hasMultipleLinesMultiples"
  | "hasCastBets"
  | "hasSingles"
>): BetslipSection => {
  const sectionMap: Record<BetslipSection, boolean> = {
    [BetslipSection.upsellSuggestions]: false,
    [BetslipSection.priceBoostMultis]: hasPriceBoost,
    [BetslipSection.bbMulti]: hasMultiBetBuilder,
    [BetslipSection.betBuilders]: hasBetBuilders,
    [BetslipSection.oneLineMultiple]: hasOneLineMultiple,
    [BetslipSection.multiLinesMultiples]: hasMultipleLinesMultiples,
    [BetslipSection.castBets]: hasCastBets,
    [BetslipSection.singles]: hasSingles,
  };

  const section = Object.keys(sectionMap).find((key) => sectionMap[key as BetslipSection]) as BetslipSection;

  return section ?? BetslipSection.singles;
};

const createBetslipCardsOrder = ({
  hasSingles,
  hasPriceBoost,
  hasMultiBetBuilder,
  hasBetBuilders,
  hasOneLineMultiple,
  hasCastBets,
  hasMultipleLinesMultiples,
  isUpsellSuggestionsActive,
}: Pick<
  CardProps,
  | "hasSingles"
  | "hasMultiBetBuilder"
  | "hasBetBuilders"
  | "hasPriceBoost"
  | "hasOneLineMultiple"
  | "hasCastBets"
  | "hasMultipleLinesMultiples"
> & { isUpsellSuggestionsActive?: boolean }): BetslipCardsOrder[] => {
  const i18nLabels = {
    singlesGroup: i18n({ key: "I18N.BETSLIP.GROUPS.SINGLES" }),
    multiplesGroup: i18n({ key: "I18N.BETSLIP.GROUPS.MULTIPLES" }),
    priceBoostGroup: i18n({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" }),
    castBetGroup: i18n({ key: "I18N.BETSLIP.CASTS" }),
  };

  const hasMultiples = hasMultiBetBuilder || hasBetBuilders || hasOneLineMultiple || hasMultipleLinesMultiples;

  const upsellSuggestionsEntry = {
    id: "upsellSuggestions",
    cardsOrder: [BetslipSection.upsellSuggestions],
  };

  const singlesEntry = {
    id: i18nLabels.singlesGroup,
    cardsOrder: [BetslipSection.singles],
  };

  const priceBoostMultisEntry = {
    id: i18nLabels.priceBoostGroup,
    cardsOrder: [BetslipSection.priceBoostMultis],
  };

  const multiplesEntry = {
    id: i18nLabels.multiplesGroup,
    cardsOrder: [
      BetslipSection.bbMulti,
      BetslipSection.betBuilders,
      BetslipSection.oneLineMultiple,
      BetslipSection.multiLinesMultiples,
    ],
  };

  const castBetsEntry = {
    id: i18nLabels.castBetGroup,
    cardsOrder: [BetslipSection.castBets],
  };

  const possibleEntries = [
    {
      condition: isUpsellSuggestionsActive && (hasMultiBetBuilder || hasBetBuilders),
      entry: upsellSuggestionsEntry,
    },
    {
      condition: hasPriceBoost,
      entry: priceBoostMultisEntry,
    },
    {
      condition: hasMultiples,
      entry: multiplesEntry,
    },
    {
      condition: hasCastBets,
      entry: castBetsEntry,
    },
    {
      condition: hasSingles,
      entry: singlesEntry,
    },
  ];

  return possibleEntries.reduce<BetslipCardsOrder[]>((betslipCardsOrder, { condition, entry }) => {
    if (condition) {
      betslipCardsOrder.push(entry);
    }
    return betslipCardsOrder;
  }, []);
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const betslipConfig = getBetslipConfig();
  const collapseStrategy =
    betslipConfig?.collapseStrategy === "FIRST_OPEN"
      ? BetslipCollapseStrategy.FirstOpen
      : BetslipCollapseStrategy.AllOpen;

  const i18nLabels = {
    totalReturns: i18n({ key: "I18N.BETSLIP.TOTAL_RETURNS" }),
    multiples: i18n({ key: "I18N.BETSLIP.MULTIPLES" }),
    additionalMultiples: i18n({ key: "I18N.BETSLIP.ADDITIONAL_MULTIPLES" }),
    singles: i18n({ key: "I18N.BETSLIP.SINGLES" }),
    casts: i18n({ key: "I18N.BETSLIP.CASTS" }),
    removeLabel: i18n({ key: "I18N.BETSLIP.REMOVE_ALL" }),
    oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stakeLabel: i18n({ key: "I18N.BETSLIP.STAKE" }),
    freeBetsLabel: i18n({ key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" }),
    oddsMovementUp: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" }),
    oddsMovementDown: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" }),
    eachWay: i18n({ key: "I18N.BETSLIP.EACHWAY" }),
    eachWaySubtitle: i18n({ key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES" }),
    betBuilder: i18n({ key: "I18N.BETSLIP.BET_BUILDER" }),
    multiBetBuilder: i18n({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" }),
    termsLabel: i18n({ key: "I18N.BETSLIP.BETS_ACCEPTED_IN_ACCORDANCE_WITH" }),
    termsLinkLabel: i18n({ key: "I18N.BETSLIP.SKYBETS_RULES" }),
    freeBetsAlertRemoveLabel: i18n({ key: "I18N.BETSLIP.REMOVE" }),
    priceBoosts: i18n({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" }),
    balanceAfterBet: i18n({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" }),
    voidBlurbText: i18n({ key: "I18N.BETSLIP.OBB.VOID_BLURB" }),
    tabAllTitle: i18n({ key: "I18N.BETSLIP.TABS.ALL" }),
    tabBetBuildersTitle: i18n({ key: "I18N.BETSLIP.TABS.BET_BUILDER" }),
    tabMultiplesTitle: i18n({ key: "I18N.BETSLIP.TABS.MULTIPLES" }),
    tabCastTitle: i18n({ key: "I18N.BETSLIP.TABS.CAST_BET" }),
    tabSinglesTitle: i18n({ key: "I18N.BETSLIP.TABS.SINGLES" }),
    betslipAriaTitle: i18n({ key: "I18N.BETSLIP.TITLE" }),
  };
  const getBetBuilderCombinationIds = createGetBetBuilderCombinationIdsSelector();
  const getBoostedCombinations = createGetBoostedCombinationsSelector();
  const getFailedCombinationGroups = createCombinationGroupFailuresSelector();
  const getBoostedUncombinedGroupIds = createGetBoostedUncombinedGroupIdsSelector();
  const getMultipleCombinations = createGetMultipleCombinations();
  const getOddsMovementState = createOddsMovementSelector();
  const getValidations = createValidationsSelector();
  const getIsDepositRequired = createGetSbkIsDepositRequiredSelector();
  const getSbkRequiredDepositValueSelector = createGetSbkRequiredDepositValueSelector();
  const getThrottle = createGetThrottleSelector();
  const getIsSportsbookConfirmationStepActive = createIsConfirmStepActive();
  const getCombinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts();
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getQuickStakes = buildQuickStakesSelector();
  const getHasMultiples = createHasMultiplesSelector();
  const getCastGroupIds = createGetCastGroupIdsSelector();

  let termsUrl: undefined | string;
  try {
    termsUrl = getEndpoint("GENERAL_TERMS_AND_COND");
  } catch {
    termsUrl = undefined;
  }

  return (state: ApplicationState): StateProps => {
    if (!state.betslip) {
      return {};
    }

    const { hasGenerosityWallets, hasGenerosityTokens, sportsbookOddsMovement, isCollapsed } = state.betslip;

    const oddsMovementMap = getOddsMovementState(sportsbookOddsMovement);
    const { oneLineCombination, multiLinesCombinations } = getMultipleCombinations(state) || {};
    const card = getBetslipCard(state);
    const runnerFailures = getSportsbookBettingImplyRunnerFailures(state);
    const {
      totalPotentialReturns,
      totalOriginalPotentialReturns,
      totalCombinedStake,
      totalStake,
      combinations,
      legs,
      isBonusSelected,
      hasBonusMoney,
    } = getSportsbookBettingState(state);

    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const combinationsValues = Object.values(combinations);
    const { loggedIn, isAuthenticating } = userDetails;
    const isSummaryDisabled = !totalCombinedStake;
    const hasValidStakedCombinations = combinationsValues.some((combination) => {
      const validCombination = !!combination.totalCombinedStake;
      return validCombination && !hasLegsWithMarketFailures(combination, legs, runnerFailures);
    });
    const hasPriceBoostedCombination = combinationsValues.some(
      (combination) => combination.isPriceBoostSelected && !!combination.stake,
    );
    const isPlacing = card?.placeStatus === "INPROGRESS";
    const totalReturns = buildPotentialReturns(totalCombinedStake, totalPotentialReturns, userDetails);
    const totalOriginalReturns = buildTotalOriginalReturns(
      totalCombinedStake,
      totalPotentialReturns,
      totalOriginalPotentialReturns,
      hasPriceBoostedCombination,
      userDetails,
    );
    const validations = getValidations(state);
    const isDepositRequired = getIsDepositRequired(state);
    const requiredDepositValue = getSbkRequiredDepositValueSelector(state);
    const castBetsCombinationIds = combinationsValues
      .filter((combination) => isCast(combination, legs))
      .map((combination) => combination.id);
    const hasCastBets = castBetsCombinationIds.length > 0;
    const multiBetBuilderIds = combinationsValues
      .filter((combination) => isMultiBetBuilder(combination))
      .map((combination) => combination.id);
    const hasMultiBetBuilder = multiBetBuilderIds.length > 0;
    const firstCombinationId = combinationsValues?.[0]?.id;
    const betBuilderIds = getBetBuilderCombinationIds(state);
    const failedCombinationGroups = getFailedCombinationGroups(state);
    const failedCombinationGroupIds = getBoostedUncombinedGroupIds(state);
    const uniqueRunnersFailures = getAllUniqueRunnersFailures(state);
    const hasBetBuilders = !!(betBuilderIds.length || failedCombinationGroups.length);
    const hasMultipleLinesMultiples = !!multiLinesCombinations?.length;
    const hasOneLineMultiple = !!oneLineCombination?.id;
    const buildMultiplesNotifications = createMultiplesNotificationsSelector();
    const multiplesNotifications = buildMultiplesNotifications(state);
    const oddsWithMovement = Object.values(oddsMovementMap).filter((each) => each.movement !== null);
    const hasAnyOddChanged = oddsWithMovement.length >= 1;
    const transactionalError = buildSportsbookTransactionalError(state);
    const isBetConfirmationStepActive = getIsSportsbookConfirmationStepActive(state);
    const boostedCombinations = getBoostedCombinations(state);
    const boostedCombinationIds = boostedCombinations.map((combination) => combination.id);
    const hasPriceBoost = boostedCombinationIds.length > 0 || failedCombinationGroupIds.length > 0;
    const singlesCombinationIds = getSingleCombinationIds(state);
    const hasSingles = singlesCombinationIds.length > 0;
    const hasOnlyOneSingle = !getHasMultiples(state) && singlesCombinationIds.length === 1;
    const castGroupIds = getCastGroupIds(state);
    const { sportsbookOddsDisplay, oddsMovement } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const runners = getSportsbookBettingRunners(state);
    const isUpsellSuggestionsActive = getThrottle(state.entities.throttles, "UPSELL_BETSLIP")?.isActive;

    const isOddsMovementTransactionalError = uniqueRunnersFailures.includes(
      RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE,
    );
    const isOddsMovementAlertSwitchEnabled = getThrottle(state.entities.throttles, "ODDS_MOVEMENT_ALERT_SWITCH")
      ?.isActive;
    const hasUserChangedOddsMovement = state.betslip.hasUserChangedOddsMovementPreference;

    const betslipCardsOrder = createBetslipCardsOrder({
      hasSingles,
      hasPriceBoost,
      hasMultiBetBuilder,
      hasBetBuilders,
      hasOneLineMultiple,
      hasCastBets,
      hasMultipleLinesMultiples,
      isUpsellSuggestionsActive,
    });

    const hasBlockingValidations = validations.some(
      (validation) =>
        validation.type !== VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE &&
        validation.notification?.type === AlertType.Error,
    );
    const isPlaceDisabled = !hasValidStakedCombinations || hasBlockingValidations;

    const formattedTotalCombinedStake = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalCombinedStake,
      decimalPlaces: 2,
    });

    const isStakeFocusActive = getThrottle(state.entities.throttles, "STAKE_FOCUS")?.isActive;
    const defaultSectionFocus = hasOnlyOneSingle ? BetslipSection.singles : undefined;
    const focusedCard = isStakeFocusActive
      ? evaluateCardFocus({
          hasPriceBoost,
          hasMultiBetBuilder,
          hasBetBuilders: !!betBuilderIds?.length,
          hasOneLineMultiple: hasOneLineMultiple && !multiplesNotifications.length,
          hasMultipleLinesMultiples,
          hasCastBets,
          hasSingles,
        })
      : defaultSectionFocus;

    const shouldDisplayPlaceholder = !legs || !Object.keys(legs).length;

    let freeBetsAlertMessage: string | undefined;

    if (hasGenerosityWallets) {
      const allSelectedWalletsAmounts = Object.values(
        getCombinationsSelectedWalletsAmounts(state.betting.sportsbookBetting),
      );
      const combination = hasOnlyOneSingle ? allSelectedWalletsAmounts?.[0] : undefined;
      const totalWalletsAmounts = allSelectedWalletsAmounts.reduce(
        (accAmount, { combinationAmount }) => sumWalletsAmounts(accAmount, combinationAmount),
        0,
      );

      freeBetsAlertMessage = buildFreeBetsAlertMessage({
        numLines: combination?.numLines,
        combinationAmountPerLine: combination?.combinationAmountPerLine,
        userDetails,
        combinationAmount: totalWalletsAmounts,
      });
    }

    const quickStakes = getQuickStakes(state);
    const areAllClosedOrSuspended = getAreAllCombinationsClosedOrSuspended(state);
    const [firstMovement] = oddsWithMovement;
    const latestOddsMovement =
      firstMovement && hasOnlyOneSingle && combinations[firstMovement.id]
        ? buildCombinationOdds(combinations[firstMovement.id], sportsbookOddsDisplay)
        : undefined;

    const { label, secondaryLabel, loadingLabel, reverseLabels } = buildSbkPlaceBetButtonLabels({
      isPlacing,
      isAuthenticating,
      isDepositRequired,
      isLoggedIn: loggedIn,
      hasStake: !!totalCombinedStake,
      hasOddsChanged: hasAnyOddChanged,
      hasGenerosityWallets,
      hasGenerosityTokens,
      isSuspended: areAllClosedOrSuspended,
      shouldAcceptOddsMovement: oddsMovement,
      interpolatedValues: {
        odds: latestOddsMovement,
        stake: formattedTotalCombinedStake,
      },
    });

    const accountBalance = getUserMainWalletValue(state) ?? 0;

    const balanceAfterBet = buildSbkBalanceAfterBetLabel(userDetails, {
      accountBalance,
      totalStake: totalStake ?? 0,
      isOldUseBonusActive: isBonusSelected,
      isLoggedIn: loggedIn,
    });

    const isTabbedBetslipAutoFocusActive = getThrottle(state.entities.throttles, "TABBED_BETSLIP_AUTO_FOCUS")?.isActive;

    const shouldFocusMultiple =
      (hasOneLineMultiple && !hasPriceBoost && !hasMultipleLinesMultiples) ||
      (hasPriceBoost && boostedCombinationIds.length === 1 && !hasOneLineMultiple && !hasMultipleLinesMultiples);

    const shouldFocusBetBuilder = hasMultiBetBuilder ? false : hasBetBuilders && betBuilderIds.length === 1;

    const shouldFocusCastBet = hasCastBets && castGroupIds.length === 1;

    const marketSelections: MarketSelection[] = Object.values(runners).map((runner) => ({
      selectionId: runner.selectionId,
      marketId: runner.marketId,
    }));

    const oddsMovementLabels = acceptOddsMovementLabels(oddsMovement, hasUserChangedOddsMovement);

    return {
      marketSelections,
      betslipCardsOrder,
      collapseStrategy,
      failedCombinationGroups,
      failedCombinationGroupIds,
      betBuilderIds,
      hasSingles,
      hasOnlyOneSingle,
      hasPriceBoost,
      boostedCombinationIds,
      totalReturns,
      totalOriginalReturns,
      isPlaceDisabled,
      isPanelDisabled: isPlacing || !!isAuthenticating,
      isSummaryDisabled,
      hasOneLineMultiple,
      hasMultipleLinesMultiples,
      hasMultiBetBuilder,
      hasCastBets,
      hasBetBuilders,
      shouldFocusMultiple: isTabbedBetslipAutoFocusActive ? shouldFocusMultiple : false,
      shouldFocusBetBuilder: isTabbedBetslipAutoFocusActive ? shouldFocusBetBuilder : false,
      shouldFocusCastBet: isTabbedBetslipAutoFocusActive ? shouldFocusCastBet : false,
      hasPlaceError: !!transactionalError,
      focusedCard,
      firstCombinationId,
      isFreeBetsSelected: !!isBonusSelected && !hasGenerosityWallets,
      isEligibleToBonus: !!hasBonusMoney && !hasGenerosityWallets,
      isLoggedIn: loggedIn,
      isDepositRequired,
      requiredDepositValue,
      isCollapsed,
      isOddsMovementOn: oddsMovement,
      showAcceptOddsMovementAlert: isOddsMovementAlertSwitchEnabled ? isOddsMovementTransactionalError : false,
      oddsMovementLabels,
      i18n: i18nLabels,
      placeBtnLabel: label,
      placeBtnSecondaryLabel: secondaryLabel,
      placeBtnLoadingLabel: loadingLabel,
      reversePlaceBtnLabels: reverseLabels,
      isOddsBoosted: hasPriceBoostedCombination,
      termsUrl,
      shouldDisplayPlaceholder,
      isBetConfirmationStepActive,
      freeBetsAlertMessage,
      balanceAfterBet,
      quickStakes,
      currencySymbol: getCurrencySymbol(userDetails) || "",
      separator: getSeparatorByLocale(userDetails.localeCode),
    };
  };
};

export type DispatchProps = {
  dispatchSelectionRemove: (payload: SelectionRemovePayload) => void;
  dispatchPlacement: () => void;
  dispatchRemoveAll: () => void;
  dispatchSportsbookBonusToggle: (isFreeBetsSelected: boolean) => void;
  dispatchAccordionToggle: (isExpanded: boolean) => void;
  dispatchTabSwitch: (tabName: string) => void;
  dispatchLogin: (url: string) => void;
  dispatchConfirmBet: () => void;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
  dispatchLoginToPlaceBetAction: () => void;
  dispatchFreeBetsRemoveAction: () => void;
  dispatchIncrementPress: (combinationId: string, quickStakeValue: number, currencySymbol?: string) => void;
  dispatchOddsMovementChange: SwitchOnChange;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchSelectionRemove: ({ legId, runnerUrn }: SelectionRemovePayload) => {
    dispatch<BetslipSportsbookRemoveLegClick>({
      type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
      payload: { legId, runnerUrn },
    });
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId },
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
  dispatchRemoveAll: (): void => {
    dispatch<BetslipSportsbookRemoveSelectionsClick>({
      type: UI__BETSLIP_SBK_REMOVE_SELECTIONS,
    });

    dispatch<BettingSportsbookClearAction>({
      type: BETTING__SBK_CLEAR_ACTION,
    });
  },
  dispatchAccordionToggle: (isExpanded: boolean) => {
    dispatch<BetslipAccordionHeaderClick>({
      type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
      payload: { isExpanded },
    });
  },
  dispatchTabSwitch: (tabName: string) => {
    dispatch<BetslipSportsbookTabSwitchAction>({
      type: UI__BETSLIP_SBK_TAB_SWITCH,
      payload: { tabName },
    });
  },
  dispatchSportsbookBonusToggle: (isFreeBetsSelected: boolean) => {
    dispatch<BettingSportsbookBonusToggleAction>({
      type: BETTING__SBK_BONUS_TOGGLE_ACTION,
      payload: {
        isFreeBetsSelected: !isFreeBetsSelected,
        product: Product.Sportsbook,
      },
    });
  },
  dispatchLogin: (url: string) => {
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: url,
      },
    });
  },
  dispatchConfirmBet: () => {
    dispatch<BetslipSportsbookPlaceBetsClick>({
      type: UI__BETSLIP_SBK_PLACE_BETS_CLICK,
    });
    dispatch<BettingSportsbookConfirmBetsAction>({
      type: BETTING__SBK_CONFIRM_BETS,
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
  dispatchLoginToPlaceBetAction: () => {
    dispatch<BetslipSportsbookLoginToPlaceBetClickAction>({
      type: UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
    });
  },
  dispatchFreeBetsRemoveAction: () => {
    dispatch<BettingSportsbookRemoveAllWalletsAction>({
      type: BETTING__SPORTSBOOK_REMOVE_ALL_FREE_BETS_WALLETS_ACTION,
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
