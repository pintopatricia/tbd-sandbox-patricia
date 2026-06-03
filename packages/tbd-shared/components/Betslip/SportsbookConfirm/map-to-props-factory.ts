import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { BET_TYPES, BettingState, VALIDATION_TYPES } from "@ppb/betslip-core";
import {
  BetslipAccordionHeaderClick,
  BetslipSportsbookLoginToPlaceBetClickAction,
  BetslipSportsbookDepositToConfirmBetClick,
  BetslipSportsbookConfirmBetsClick,
  BetslipSportsbookEditBetsClick,
  BetslipSportsbookRemoveSelectionsClick,
  UI__BETSLIP_ACCORDION_HEADER_CLICK,
  UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
  UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK,
  UI__BETSLIP_SBK_CONFIRM_BETS_CLICK,
  UI__BETSLIP_SBK_EDIT_BETS_CLICK,
  UI__BETSLIP_SBK_REMOVE_SELECTIONS,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__DEPOSIT_TO_PLACE_BET,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_EDIT_BETS,
  BETTING__SBK_PLACE_BETS,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BettingDepositToPlaceBetAction,
  BettingSportsbookClearAction,
  BettingSportsbookCreateSportsbookConfirmationAction,
  BettingSportsbookEditBetsAction,
  BettingSportsbookPlaceBetsAction,
  BettingSportsbookRemoveSportsbookConfirmationAction,
} from "@ppb/tbd-store/actions/betting";
import { isCast, isMultiBetBuilder } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  getBetslipCard,
  getSportsbookConfirmation,
  getSportsbookConfirmationAvailability,
  createGetBetBuilderConfirmationCombinationIdsSelector,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  createGetCombinationsSelectedWalletsAmounts,
  getSportsbookBettingState,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BetslipSportsbookConfirmationBet } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { AlertType } from "@ppb/the-wall-common/types";

import { EXTERNAL_PUSH, ExternalPushAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";

import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import {
  CollapsablesStartsOpen,
  SportsbookPlacePanelContentLayout,
  SportsbookPlacePanelViewModel,
  BetslipSection,
} from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { i18n } from "../../../helpers/i18n";
import { buildPotentialReturns, buildTotalOriginalReturns } from "../betslip-formatters";
import { createValidationsSelector } from "../Notifier/notifier-mapper";
import { createGetSbkIsDepositRequiredSelector } from "../betslip-mapper";

import { createGetConfirmationMultipleCombinations } from "../sportsbook-betslip-confirm-mapper";
import { buildSbkPlaceBetButtonLabels } from "../../../helpers/betslip-place-button-helper";
import { sumWalletsAmounts, buildFreeBetsAlertMessage } from "../../../helpers/generosity-wallets";
import { buildSbkBalanceAfterBetLabel } from "../../../helpers/betslip-balance-helper";
import {
  buildSportsbookTransactionalError,
  createAreAllCombinationsClosedOrSuspendedSelector,
} from "../connected-sportsbook-betslip-mapper";

type SportsbooksConfirmI18N = {
  secondaryButtonLabel: string;
  multiBetBuilder: string;
  betBuilder: string;
  multiples: string;
  additionalMultiples: string;
  casts: string;
  singles: string;
};

type BetslipCardsOrder = {
  id: string;
  cardsOrder: BetslipSection[];
};

export type ContainerProps = {};

type CardProps = {
  isLoggedIn: boolean;
  isDepositRequired: boolean;
  betsWithTotalCombinedStake: Record<BetslipSection, boolean>;
  betBuilderIds: string[];
  sportsbooksConfirmI18N: SportsbooksConfirmI18N;
  sportsbookPlacePanelI18N: SportsbookPlacePanelViewModel["i18n"];
  betslipCardsOrder: BetslipCardsOrder[];
  sectionsInitialState: CollapsablesStartsOpen;
  placeBtnLabel: string;
  contentLayout: SportsbookPlacePanelViewModel["contentLayout"];
  isEligibleToBonus: boolean;
  hasCTALoading: boolean;
  isFreeBetsSelected: boolean;
  isOddsBoosted: boolean;
  totalReturns: SportsbookPlacePanelViewModel["totalReturns"];
  totalOriginalReturns: SportsbookPlacePanelViewModel["totalOriginalReturns"];
  hasPlaceError: SportsbookPlacePanelViewModel["hasPlaceError"];
  isPlaceDisabled: SportsbookPlacePanelViewModel["isPlaceDisabled"];
  isSummaryDisabled?: SportsbookPlacePanelViewModel["isSummaryDisabled"];
  isPanelDisabled?: SportsbookPlacePanelViewModel["isPanelDisabled"];
  placeBtnSecondaryLabel: SportsbookPlacePanelViewModel["placeBtnSecondaryLabel"];
  placeBtnLoadingLabel: SportsbookPlacePanelViewModel["placeBtnLoadingLabel"];
  reversePlaceBtnLabels: SportsbookPlacePanelViewModel["reversePlaceBtnLabels"];
  freeBetsAlertMessage: SportsbookPlacePanelViewModel["freeBetsAlertMessage"];
  balanceAfterBet?: SportsbookPlacePanelViewModel["balanceAfterBet"];
};
export type StateProps = CardProps | Record<string, never>;

const sectionsInitialState: CollapsablesStartsOpen = {
  bbMulti: true,
  betBuilders: true,
  oneLineMultiple: true,
  multiLinesMultiples: true,
  castBets: true,
  singles: true,
};

type BetsWithTotalCombinedStakeEvaluation = {
  hasBetBuilders: boolean;
  hasOneLineMultiple: boolean;
  hasMultipleLinesMultiples: boolean;
  combinationsValues: BettingState.Combination[];
  multiLinesCombinations: BettingState.Combination[];
  legs: BettingState.LegsMap;
};

const evaluateBetsWithTotalCombinedStake = ({
  hasBetBuilders,
  hasOneLineMultiple,
  hasMultipleLinesMultiples,
  combinationsValues,
  multiLinesCombinations,
  legs,
}: BetsWithTotalCombinedStakeEvaluation) => {
  const betsWithTotalCombinedStake = {
    [BetslipSection.bbMulti]: false,
    [BetslipSection.betBuilders]: hasBetBuilders,
    [BetslipSection.oneLineMultiple]: hasOneLineMultiple,
    [BetslipSection.multiLinesMultiples]: false,
    [BetslipSection.castBets]: false,
    [BetslipSection.singles]: false,
  };

  betsWithTotalCombinedStake[BetslipSection.bbMulti] = combinationsValues.some(
    (combination) => isMultiBetBuilder(combination) && combination.totalCombinedStake,
  );

  if (hasMultipleLinesMultiples) {
    betsWithTotalCombinedStake[BetslipSection.multiLinesMultiples] = multiLinesCombinations.some(
      (combination) => combination.totalCombinedStake,
    );
  }

  betsWithTotalCombinedStake[BetslipSection.castBets] = combinationsValues.some(
    (combination) => isCast(combination, legs) && combination.totalCombinedStake,
  );

  betsWithTotalCombinedStake[BetslipSection.singles] = combinationsValues.some(
    (combination) =>
      !isCast(combination, legs) && combination.betType === BET_TYPES.SINGLE && combination.totalCombinedStake,
  );

  return betsWithTotalCombinedStake;
};

const createBetslipCardsOrder = (betsWithTotalCombinedStake: Record<BetslipSection, boolean>): BetslipCardsOrder[] => {
  const {
    bbMulti: hasMultiBetBuilder,
    betBuilders: hasBetBuilders,
    oneLineMultiple: hasOneLineMultiple,
    multiLinesMultiples: hasMultipleLinesMultiples,
    castBets: hasCastBets,
  } = betsWithTotalCombinedStake;

  const i18nLabels = {
    singlesGroup: i18n({ key: "I18N.BETSLIP.GROUPS.SINGLES" }),
    multiplesGroup: i18n({ key: "I18N.BETSLIP.GROUPS.MULTIPLES" }),
    castBetGroup: i18n({ key: "I18N.BETSLIP.CASTS" }),
  };
  const hasMultiples = hasMultiBetBuilder || hasBetBuilders || hasOneLineMultiple || hasMultipleLinesMultiples;

  const singlesEntry = {
    id: i18nLabels.singlesGroup,
    cardsOrder: [BetslipSection.singles],
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

  const castBetEntry = {
    id: i18nLabels.castBetGroup,
    cardsOrder: [BetslipSection.castBets],
  };

  const possibleEntries = [
    {
      condition: hasMultiples,
      entry: multiplesEntry,
    },
    {
      condition: hasCastBets,
      entry: castBetEntry,
    },
  ];

  const betslipCardsOrder = possibleEntries.reduce((acc: BetslipCardsOrder[], { condition, entry }) => {
    if (condition) {
      acc.push(entry);
    }
    return acc;
  }, []);

  return [...betslipCardsOrder, singlesEntry];
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBetBuilderCombinationIds = createGetBetBuilderConfirmationCombinationIdsSelector();
  const getMultipleCombinations = createGetConfirmationMultipleCombinations();
  const getOddsMovementState = createOddsMovementSelector();
  const getValidations = createValidationsSelector();
  const getIsDepositRequired = createGetSbkIsDepositRequiredSelector();
  const getCombinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts();
  const getUserMainWalletValue = createGetUserMainWalletValueSelector();
  const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return (state: ApplicationState): StateProps => {
    if (!state.betslip) {
      return {};
    }
    let userDetails;
    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);
      return {};
    }

    const commonLabelsI18N = {
      multiBetBuilder: i18n({ key: "I18N.BETSLIP.BET_BUILDER_MULTIS" }),
      betBuilder: i18n({ key: "I18N.BETSLIP.BET_BUILDER" }),
      multiples: i18n({ key: "I18N.BETSLIP.MULTIPLES" }),
      additionalMultiples: i18n({ key: "I18N.BETSLIP.ADDITIONAL_MULTIPLES" }),
      casts: i18n({ key: "I18N.BETSLIP.CASTS" }),
      singles: i18n({ key: "I18N.BETSLIP.SINGLES" }),
      tabAllTitle: i18n({ key: "I18N.BETSLIP.TABS.ALL" }),
      tabBetBuildersTitle: i18n({ key: "I18N.BETSLIP.TABS.BET_BUILDER" }),
      tabMultiplesTitle: i18n({ key: "I18N.BETSLIP.TABS.MULTIPLES" }),
      tabCastTitle: i18n({ key: "I18N.BETSLIP.TABS.CAST_BET" }),
      tabSinglesTitle: i18n({ key: "I18N.BETSLIP.TABS.SINGLES" }),
      betslipAriaTitle: i18n({ key: "I18N.BETSLIP.TITLE" }),
    };

    const sportsbookPlacePanelI18N = {
      totalReturns: i18n({ key: "I18N.BETSLIP.TOTAL_RETURNS" }),
      removeLabel: i18n({ key: "I18N.BETSLIP.REMOVE_ALL" }),
      oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
      stakeLabel: i18n({ key: "I18N.BETSLIP.STAKE" }),
      freeBetsLabel: i18n({ key: "I18N.BETSLIP.USE_FREE_BET_WITHOUT_AMOUNT" }),
      oddsMovementUp: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" }),
      oddsMovementDown: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" }),
      eachWay: i18n({ key: "I18N.BETSLIP.EACHWAY" }),
      eachWaySubtitle: i18n({ key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES" }),
      balanceAfterBet: i18n({ key: "I18N.BETSLIP.BALANCE_AFTER_BET" }),
      priceBoosts: i18n({ key: "I18N.BETSLIP.GROUPS.PRICE_BOOST" }),
      ...commonLabelsI18N,
    };

    const sportsbooksConfirmI18N = {
      secondaryButtonLabel: i18n({ key: "I18N.BETSLIP.EDIT_BET" }),
      ...commonLabelsI18N,
    };

    const betslipSportsbookConfirmation = getSportsbookConfirmation(state);

    const { hasGenerosityWallets, hasGenerosityTokens, sportsbookOddsMovement } = state.betslip;

    const oddsMovementMap = getOddsMovementState(sportsbookOddsMovement);
    const card = getBetslipCard(state);
    const {
      totalPotentialReturns,
      totalOriginalPotentialReturns,
      totalCombinedStake,
      totalStake,
      combinations,
      isBonusSelected,
      hasBonusMoney,
      legs: sportsbookBettingLegs,
    } = getSportsbookBettingState(state);

    const { loggedIn, isAuthenticating } = userDetails;
    const isDepositRequired = getIsDepositRequired(state);

    const availabilityChanged = getSportsbookConfirmationAvailability(state);

    const combinationsValues = betslipSportsbookConfirmation?.combinations
      ? Object.values(betslipSportsbookConfirmation?.combinations)
      : Object.values(combinations);
    const legs = betslipSportsbookConfirmation?.legs ? betslipSportsbookConfirmation.legs : sportsbookBettingLegs;

    const betBuilderIdsWithStake = getBetBuilderCombinationIds(state).filter(
      (id: string) => !!combinationsValues.find((comb) => id === comb.id && !!comb.totalCombinedStake),
    );

    const { oneLineCombination, multiLinesCombinations } = getMultipleCombinations(state) || {};

    const betsWithTotalCombinedStake = evaluateBetsWithTotalCombinedStake({
      hasBetBuilders: betBuilderIdsWithStake.length > 0,
      hasOneLineMultiple: !!oneLineCombination?.id && !!oneLineCombination?.totalCombinedStake,
      hasMultipleLinesMultiples: !!multiLinesCombinations?.length,
      combinationsValues,
      multiLinesCombinations,
      legs,
    });

    const hasAnyOddChanged = Object.values(oddsMovementMap).some((each) => each.movement !== null);

    const hasCTALoading = !isDepositRequired && loggedIn;

    const totalReturns = buildPotentialReturns(totalCombinedStake, totalPotentialReturns, userDetails);

    const hasPriceBoostedCombination = combinationsValues.some(
      (combination) => combination.isPriceBoostSelected && !!combination.totalCombinedStake,
    );
    const totalOriginalReturns = buildTotalOriginalReturns(
      totalCombinedStake,
      totalPotentialReturns,
      totalOriginalPotentialReturns,
      hasPriceBoostedCombination,
      userDetails,
    );

    const transactionalError = buildSportsbookTransactionalError(state);

    const hasStakedCombinations = combinationsValues.some((combination) => !!combination.totalCombinedStake);
    const validations = getValidations(state);
    const hasBlockingValidations = validations.some(
      (validation) =>
        validation.type !== VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE &&
        validation.notification?.type === AlertType.Error,
    );

    const hasStakeChanged = combinationsValues.some((combination) => {
      const bettingCombinations = Object.values(combinations);
      const bettingCombinationStake = bettingCombinations.find(
        (bettingCombination) => bettingCombination.id === combination.id,
      )?.totalCombinedStake;

      return !bettingCombinationStake && combination.totalCombinedStake;
    });

    const isPlaceDisabled = !hasStakedCombinations || hasBlockingValidations || hasStakeChanged || availabilityChanged;

    const isSummaryDisabled = !totalCombinedStake;

    const isPlacing = card?.placeStatus === "INPROGRESS";

    let freeBetsAlertMessage: string | undefined;

    if (hasGenerosityWallets) {
      const allSelectedWalletsAmounts = Object.values(
        getCombinationsSelectedWalletsAmounts(state.betting.sportsbookBetting),
      );
      const hasOnlyOneSingle = combinationsValues.length === 1 && combinationsValues[0].betType === BET_TYPES.SINGLE;
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

    const formattedTotalCombinedStake = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: totalCombinedStake,
      decimalPlaces: 2,
    });

    const areAllClosedOrSuspended = getAreAllCombinationsClosedOrSuspended(state);

    const { oddsMovement } = getUserPreferencesWithProductSwitcher(state.entities.preferences);

    const { label, secondaryLabel, loadingLabel, reverseLabels } = buildSbkPlaceBetButtonLabels({
      isPlacing,
      isAuthenticating,
      isDepositRequired,
      isLoggedIn: loggedIn,
      hasStake: !!totalCombinedStake,
      hasOddsChanged: hasAnyOddChanged,
      hasGenerosityWallets,
      hasGenerosityTokens,
      isConfirmationStep: true,
      isSuspended: areAllClosedOrSuspended,
      shouldAcceptOddsMovement: oddsMovement,
      interpolatedValues: { stake: formattedTotalCombinedStake },
    });

    const accountBalance = getUserMainWalletValue(state) ?? 0;

    const balanceAfterBet = buildSbkBalanceAfterBetLabel(userDetails, {
      accountBalance,
      totalStake: totalStake ?? 0,
      isOldUseBonusActive: isBonusSelected,
      isLoggedIn: loggedIn,
    });

    return {
      isLoggedIn: loggedIn,
      isDepositRequired,
      betsWithTotalCombinedStake,
      betBuilderIds: betBuilderIdsWithStake,
      sportsbooksConfirmI18N,
      sportsbookPlacePanelI18N,
      betslipCardsOrder: createBetslipCardsOrder(betsWithTotalCombinedStake),
      sectionsInitialState,
      placeBtnLabel: label,
      placeBtnSecondaryLabel: secondaryLabel,
      placeBtnLoadingLabel: loadingLabel,
      reversePlaceBtnLabels: reverseLabels,
      contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
      hasCTALoading,
      isOddsBoosted: hasPriceBoostedCombination,
      isFreeBetsSelected: !!isBonusSelected && !hasGenerosityWallets,
      isEligibleToBonus: !!hasBonusMoney && !hasGenerosityWallets,
      totalReturns,
      totalOriginalReturns,
      hasPlaceError: !!transactionalError,
      isPlaceDisabled,
      isSummaryDisabled,
      isPanelDisabled: isPlacing || !!isAuthenticating,
      freeBetsAlertMessage,
      balanceAfterBet,
    };
  };
};

export type DispatchProps = {
  dispatchCreateSportsbookConfirmation: (sportsbookConfirmation: BetslipSportsbookConfirmationBet | undefined) => void;
  dispatchRemoveSportsbookConfirmation: () => void;
  dispatchPlacement: () => void;
  dispatchLoginToPlaceBetAction: () => void;
  dispatchLogin: (url: string) => void;
  dispatchDepositRedirect: () => void;
  dispatchNavigate: (viewUrn: string, viewUrl: string) => void;
  dispatchEdit: () => void;
  dispatchRemoveAll: () => void;
  dispatchAccordionToggle: (isExpanded: boolean) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCreateSportsbookConfirmation: (
    betslipSportsbookConfirmation: BetslipSportsbookConfirmationBet | undefined,
  ) => {
    if (betslipSportsbookConfirmation) {
      dispatch<BettingSportsbookCreateSportsbookConfirmationAction>({
        type: BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
        payload: {
          ...betslipSportsbookConfirmation,
        },
      });
    }
  },
  dispatchRemoveSportsbookConfirmation: () => {
    dispatch<BettingSportsbookRemoveSportsbookConfirmationAction>({
      type: BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
    });
  },
  dispatchPlacement: () => {
    dispatch<BetslipSportsbookConfirmBetsClick>({
      type: UI__BETSLIP_SBK_CONFIRM_BETS_CLICK,
    });
    dispatch<BettingSportsbookPlaceBetsAction>({
      type: BETTING__SBK_PLACE_BETS,
    });
  },
  dispatchLoginToPlaceBetAction: () => {
    dispatch<BetslipSportsbookLoginToPlaceBetClickAction>({
      type: UI__BETSLIP_SBK_LOGIN_TO_PLACE_BET_CLICK,
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
  dispatchDepositRedirect: () => {
    dispatch<BetslipSportsbookDepositToConfirmBetClick>({ type: UI__BETSLIP_SBK_DEPOSIT_TO_CONFIRM_BET_CLICK });
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
  dispatchEdit: () => {
    dispatch<BetslipSportsbookEditBetsClick>({
      type: UI__BETSLIP_SBK_EDIT_BETS_CLICK,
    });
    dispatch<BettingSportsbookEditBetsAction>({
      type: BETTING__SBK_EDIT_BETS,
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
});
