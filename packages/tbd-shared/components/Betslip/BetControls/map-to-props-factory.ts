import type { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import type { Dispatch } from "redux";

import { BettingState, LEG_TYPES, PRICE_TYPES, VALIDATION_TYPES } from "@ppb/betslip-core";
import { FETCH_CARDS, FetchCardsAction } from "@ppb/tbd-store";
import {
  UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
  UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
  UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
  UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
  type BetslipSportsbookAccaInsuranceToggleAction,
  type BetslipSportsbookEachWayToggleAction,
  type BetslipSportsbookPriceBoostToggleAction,
  type BetslipSportsbookStakeInputChange,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_EACH_WAY_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SBK_STARTING_PRICE_TOGGLE,
  BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
  BETTING__SBK_VALIDATE_STAKE,
  BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
  BettingSportsbookGenerosityWalletBetAction,
  BettingSportsbookMoneyBackToggleAction,
  BettingSportsbookRemoveAllCombinationWalletsAction,
  BettingSportsbookRemoveGenerosityWalletsAction,
  UI__GENEROSITY_WALLET_REMOVE_CLICK,
  type BettingSportsbookAccaInsuranceToggleAction,
  type BettingSportsbookGhostLegToggleAction,
  type BettingSportsbookEachWayToggleAction,
  type BettingSportsbookPriceBoostToggleAction,
  type BettingSportsbookSPToggleAction,
  type BettingSportsbookUpdateCombinationStakeAction,
  type BettingSportsbookValidateStake,
} from "@ppb/tbd-store/actions/betting";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { isStakeValid } from "@ppb/tbd-store/helpers/sportsbook-betting";
import type { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  getBetslipCard,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
  getSportsbookConfirmationRunners,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  createGetCombinationsSelectedWalletsAmounts,
  getBettingResolvers,
  getSportsbookBettingState,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import type { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { codecs } from "@ppb/tbd-urn-codecs";
import type { BetControlsProps } from "@ppb/the-wall-common/types";

import { currencyFormatWithDecimalPlaces, getCurrencySymbol } from "../../../formatters/currency-formatters";
import { getExternalLink } from "../../../helpers/external-links";
import { getGenerosityBetslipAlertData } from "../../../helpers/generosity-wallets";
import { i18n } from "../../../helpers/i18n";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { buildAccaInsuranceLabels, buildCombinationOdds, buildCombinationPreviousOdds } from "../betslip-formatters";
import { translateMultiple } from "../connected-sportsbook-betslip-mapper";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { buildSingleLegExtraDetails } from "./bet-controls-mapper";

function isLegSP(leg: BettingState.Leg) {
  return !leg.odds && LEG_TYPES.ONE_LINE_BET !== leg.legType;
}

export type BetControlsLabels = {
  odds: BetControlsProps["oddsLabel"];
  stake: BetControlsProps["stakeLabel"];
  generosityAlertRemoveLabel: BetControlsProps["generosityAlertRemoveLabel"];
} & Pick<BetControlsProps, "eachWayTitle" | "startingPriceTitle" | "oddsMovementUp" | "oddsMovementDown">;

type CardProps = {
  combinationId: string;
  labels: BetControlsLabels;
  isGenerosityDisabled: boolean;
  isSingleBetBetslip: boolean;
  hasStakeCaret: boolean;
  generosityType?: WalletTypes;
  generosityAlertMessage?: string;
  isGenerosityWalletSelected: boolean;
} & Pick<
  BetControlsProps,
  | "betType"
  | "currencySymbol"
  | "bonusAvailabilityLabel"
  | "linesLabel"
  | "dividendBetLabel"
  | "formattedOriginalPotentialReturns"
  | "formattedPotentialReturns"
  | "returnsLabel"
  | "odds"
  | "oddsAccessibilityLabel"
  | "previousOdds"
  | "stake"
  | "separator"
  | "multiplier"
  | "hasEachWay"
  | "hasAccaInsurance"
  | "hasGenerosity"
  | "hasStartingPrice"
  | "isPanelDisabled"
  | "isStakeValid"
  | "isEachWaySelected"
  | "isPriceBoostSelected"
  | "isGenerositySelected"
  | "isStartingPriceSelected"
  | "isAccaInsuranceSelected"
  | "isAccaInsuranceReadonly"
  | "isAccaInsuranceDisabled"
  | "accaInsuranceTitle"
  | "accaInsuranceSubtitle"
  | "accaInsuranceTermsLabel"
  | "accaInsuranceTermsUrl"
  | "hintType"
  | "hintMessage"
  | "eachWaySubtitle"
  | "oddsMovement"
  | "displayReturns"
  | "generosityIconName"
>;

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  combinationId: string;
  isDividend?: boolean;
  hasAvailabilityHints?: boolean;
  shouldFocusStakeField?: boolean;
  title?: string;
};

const buildBonusAvailabilityString = (
  isBonusSelected: boolean | undefined,
  isBonusAvailable: boolean,
  isBonusUsageIncompatible: boolean,
): string => {
  if (isBonusSelected && !isBonusAvailable) return i18n({ key: "I18N.BETSLIP.BONUS_NOT_AVAILABLE" });
  if (isBonusSelected && isBonusUsageIncompatible) return i18n({ key: "I18N.BETSLIP.FREE_BET_INELIGIBLE" });
  return "";
};

const buildOddsAccessibilityLabel = (label: string, odds: string | undefined) => `${label}: ${odds ?? ""}`.trim();

const EXTRA_WALLET_CARD_GROUP_URN = codecs.cardGroup.extraWallet.encode().uid;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const labels = {
    odds: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stake: i18n({ key: "I18N.BETSLIP.STAKE_PLACEHOLDER" }),
    eachWayTitle: i18n({ key: "I18N.BETSLIP.EACHWAY" }),
    startingPriceTitle: i18n({ key: "I18N.BETSLIP.TITLE.STARTING_PRICE" }),
    oddsMovementUp: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" }),
    oddsMovementDown: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" }),
    generosityAlertRemoveLabel: i18n({ key: "I18N.BETSLIP.REMOVE" }),
  };

  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getOddsMovement = createOddsMovementSelector();
  const getIsConfirmStep = createIsConfirmStep();
  const getCombinationsSelectedWalletsAmounts = createGetCombinationsSelectedWalletsAmounts();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { combinationId, hasAvailabilityHints, isDividend, title }): StateProps => {
    const isHasStakeCaretActive = getThrottle(state.entities.throttles, "INPUT_MARKER")?.isActive;
    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return {};
    }

    const {
      combinations: bettingCombinations,
      validations: { combinations: validations },
      legs: bettingLegs,
      runners: bettingRunners,
      failures,
      isBonusSelected,
      wallets,
    } = getSportsbookBettingState(state);

    const isConfirmStep = getIsConfirmStep(state);
    const combinations = isConfirmStep ? getSportsbookConfirmationCombinations(state) : bettingCombinations;
    const isSingleBetBetslip = Object.keys(combinations).length === 1;

    const legs = isConfirmStep ? getSportsbookConfirmationLegs(state) : bettingLegs;
    const runners = isConfirmStep ? getSportsbookConfirmationRunners(state) : bettingRunners;
    const card = getBetslipCard(state);
    const preferences = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const combination = combinations[combinationId];

    const isFreeBetsSelected =
      !!wallets && !!Object.values(wallets).find(({ combinationId: combId }) => combId === combinationId);

    if (!card || !combination) {
      return {};
    }

    const hasAllStartingPriceLegSelected = combination.legs.every((legId) => isLegSP(legs[legId]));
    const hasSomeStartingPriceLegSelected = combination.legs.some((legId) => isLegSP(legs[legId]));
    const hasStartingPriceLegAvailable = combination.legs
      .flatMap((legId) => legs[legId].runners)
      .every((runnerId) => runners[runnerId].availablePriceTypes?.includes(PRICE_TYPES.STARTING_PRICE));

    const { placeStatus, group, sportsbookOddsMovement } = card;

    const metadata = getBettingResolvers(group).getMetadata(state);
    const oddsMovementMap = getOddsMovement(sportsbookOddsMovement);

    const currentValidations = validations[combinationId] || [];
    const isBonusUsageIncompatible = currentValidations.some(
      ({ type }) =>
        type === VALIDATION_TYPES.BONUS_USAGE_ACCA_INSURANCE_INCOMPATIBLE ||
        type === VALIDATION_TYPES.BONUS_USAGE_PRICE_BOOST_INCOMPATIBLE,
    );

    const bonusAvailabilityLabel: string = buildBonusAvailabilityString(
      isBonusSelected,
      combination.isBonusAvailable,
      isBonusUsageIncompatible,
    );

    const isPlacing = placeStatus === "INPROGRESS";
    let odds: string | undefined;
    let linesLabel: string | undefined;

    if (combination.numLines === 1 && !isDividend) {
      odds = buildCombinationOdds(combination, preferences.sportsbookOddsDisplay, legs);
    } else {
      linesLabel = !isDividend
        ? `${translateMultiple(combination.betType)} (x${combination.numLines})`
        : i18n({
            key: "I18N.BETSLIP.NUM_LINES",
            interpolationValues: {
              numLines: `${combination.numLines}`,
            },
          });
    }

    const singleDetails =
      combination.legs.length === 1
        ? buildSingleLegExtraDetails(combination, legs, failures.imply, metadata)
        : undefined;
    const hasHints = hasAvailabilityHints && singleDetails?.hasFailure;

    const isReturnWithValue = !hasSomeStartingPriceLegSelected && (combination?.potentialReturns || combination?.odds);
    const returnsLabel = isReturnWithValue
      ? i18n({ key: "I18N.BETSLIP.RETURNS" })
      : i18n({ key: "I18N.BETSLIP.BET_RETURNS_TBD" });

    let formattedPotentialReturns;
    let formattedOriginalPotentialReturns;

    const displayReturns = !isSingleBetBetslip;

    // Returns
    if (displayReturns && isReturnWithValue) {
      formattedPotentialReturns = currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: combination.potentialReturns ?? 0,
        decimalPlaces: 2,
      });

      formattedOriginalPotentialReturns =
        combination?.originalPotentialReturns && combination.isPriceBoostSelected
          ? currencyFormatWithDecimalPlaces({
              ...userDetails,
              value: combination.originalPotentialReturns,
              decimalPlaces: 2,
            })
          : undefined;
    }

    const isAccaInsuranceTokenSelected = !!combination.accaInsuranceTokenId;
    const isPriceBoostSelected = !!combination.isPriceBoostSelected;
    const isMoneyBackTokenSelected = !!combination.isMoneyBackSelected;
    const isGhostLegTokenSelected = !!combination.isGhostLegSelected;

    const ghostLegs = combination.ghostLegTokenId
      ? combination.ghostLegOffers.find(({ tokenId }) => tokenId === combination.ghostLegTokenId)?.numberOfLegs
      : undefined;

    let combinationsSelectedWalletsAmount;

    if (isFreeBetsSelected && !isSingleBetBetslip) {
      combinationsSelectedWalletsAmount = getCombinationsSelectedWalletsAmounts(state.betting?.sportsbookBetting)[
        combinationId
      ];
    }

    const { numLines = 0, combinationAmountPerLine, combinationAmount } = combinationsSelectedWalletsAmount ?? {};

    const {
      message: generosityAlertMessage,
      icon: generosityIconName,
      type: generosityType,
    } = getGenerosityBetslipAlertData({
      combination,
      numLines,
      combinationAmountPerLine,
      combinationAmount,
      isAccaInsuranceTokenSelected,
      isGhostLegTokenSelected,
      isFreeBetsSelected,
      isPriceBoostSelected,
      isMoneyBackTokenSelected,
      isSingleBetBetslip,
      userDetails,
      ghostLegs,
      oddsDisplayPreference: preferences.sportsbookOddsDisplay,
    });

    const hasGenerosity =
      !!combination.applicableWallets?.length ||
      !!combination.priceBoostOffers?.length ||
      !!combination.accaInsuranceOffers?.length ||
      !!combination.moneyBackOffers?.length ||
      !!combination.ghostLegOffers?.length;

    return {
      combinationId,
      betType: title,
      stake: combination.stake ?? undefined,
      separator: getSeparatorByLocale(userDetails.localeCode),
      hasGenerosity,
      hasStartingPrice: hasStartingPriceLegAvailable && !!combination.odds && combination.numLines === 1,
      hasEachWay: !!combination.isEachWayAvailable,
      hasAccaInsurance: !!combination.isAccaInsuranceAvailable && !combination.accaInsuranceOffers?.length,
      isPanelDisabled: singleDetails?.hasFailure || isPlacing,
      isEachWaySelected: !!combination.isEachWaySelected,
      isAccaInsuranceSelected: !!combination.isAccaInsuranceSelected,
      isAccaInsuranceReadonly: isConfirmStep ? false : hasSomeStartingPriceLegSelected,
      isAccaInsuranceDisabled: isConfirmStep,
      isPriceBoostSelected,
      isGenerosityWalletSelected:
        isFreeBetsSelected ||
        isPriceBoostSelected ||
        !!combination.accaInsuranceTokenId ||
        !!combination.moneyBackTokenId ||
        !!combination.ghostLegTokenId,
      isStartingPriceSelected: combination.isSPSelected || hasAllStartingPriceLegSelected,
      isStakeValid: isStakeValid(userDetails, validations[combinationId]),
      multiplier: combination.isEachWaySelected ? `2x` : undefined,
      oddsMovement: hasSomeStartingPriceLegSelected ? undefined : oddsMovementMap[combinationId]?.movement,
      currencySymbol: getCurrencySymbol(userDetails) || "",
      bonusAvailabilityLabel,
      linesLabel,
      dividendBetLabel: isDividend
        ? i18n({
            key: "I18N.BETSLIP.DIVIDEND_BET",
          })
        : undefined,
      labels,
      eachWaySubtitle: singleDetails?.eachWaySubtitle,
      hintType: hasHints ? singleDetails?.hintType : undefined,
      hintMessage: hasHints ? singleDetails?.hintMessage : undefined,
      odds,
      oddsAccessibilityLabel: buildOddsAccessibilityLabel(labels.odds, odds),
      previousOdds: buildCombinationPreviousOdds(
        combination.displayOdds,
        singleDetails?.previousOdds,
        combination.isPriceBoostSelected,
        preferences.sportsbookOddsDisplay,
      ),
      formattedOriginalPotentialReturns,
      formattedPotentialReturns,
      returnsLabel,
      displayReturns,
      accaInsuranceTermsUrl: getExternalLink(
        "ACCA_INSURANCE",
        userDetails.jurisdiction.jurisdiction,
        userDetails.localeCode,
      ),
      generosityAlertMessage,
      isGenerosityDisabled: isConfirmStep,
      ...buildAccaInsuranceLabels(!!combination.isAccaInsuranceSelected),
      isSingleBetBetslip,
      hasStakeCaret: !!isHasStakeCaretActive,
      generosityType,
      generosityIconName,
    };
  };
};

export type DispatchProps = {
  dispatchStakeChange: ({ id, newValue }: { id: string; newValue?: number }) => void;
  dispatchStakeValidate: ({ id }: { id: string }) => void;
  dispatchStartPricePress: (combinationId: string, isSelected: boolean) => void;
  dispatchEachWayPress: (combinationId: string, isSelected: boolean) => void;
  dispatchAccaInsurancePress: (combinationId: string, isSelected: boolean) => void;
  dispatchPriceBoostPress: (combinationId: string, isSelected: boolean) => void;
  dispatchGenerosityPress: (combinationId: string, isSelected: boolean) => void;
  dispatchGenerosityWalletRemoveAction: (combinationId: string, type?: WalletTypes) => void;
  dispatchGenerosityRemoveAction: () => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchStartPricePress: (combinationId, isStartingPriceSelected) => {
    const isSelected = !isStartingPriceSelected;

    dispatch<BettingSportsbookSPToggleAction>({
      type: BETTING__SBK_STARTING_PRICE_TOGGLE,
      payload: {
        combinationId,
        isSelected,
      },
    });
  },
  dispatchEachWayPress: (combinationId, isEachWaySelected) => {
    const isSelected = !isEachWaySelected;
    dispatch<BettingSportsbookEachWayToggleAction>({
      type: BETTING__SBK_EACH_WAY_TOGGLE,
      payload: {
        combinationId,
        isSelected,
      },
    });
    dispatch<BetslipSportsbookEachWayToggleAction>({
      type: UI__BETSLIP_SBK_EACH_WAY_TOGGLE,
      payload: {
        isSelected,
      },
    });
  },
  dispatchAccaInsurancePress: (combinationId, isAccaInsuranceSelected) => {
    const isSelected = !isAccaInsuranceSelected;
    dispatch<BettingSportsbookAccaInsuranceToggleAction>({
      type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
      payload: {
        combinationId,
      },
    });
    dispatch<BetslipSportsbookAccaInsuranceToggleAction>({
      type: UI__BETSLIP_SBK_ACCA_INSURANCE_TOGGLE,
      payload: {
        isSelected,
      },
    });
  },
  dispatchStakeChange: ({ id, newValue }: { id: string; newValue?: number }): void => {
    dispatch<BetslipSportsbookStakeInputChange>({
      type: UI__BETSLIP_SBK_STAKE_INPUT_CHANGE,
      payload: { combinationId: id, stake: newValue },
    });
    dispatch<BettingSportsbookUpdateCombinationStakeAction>({
      type: BETTING__SBK_UPDATE_COMBINATION_STAKE_ACTION,
      payload: { combinationId: id, stake: newValue },
    });
  },
  dispatchStakeValidate: ({ id }: { id: string }) => {
    dispatch<BettingSportsbookValidateStake>({
      type: BETTING__SBK_VALIDATE_STAKE,
      payload: { combinationId: id },
    });
  },
  dispatchPriceBoostPress: (combinationId, isPriceBoostSelected) => {
    const isSelected = !isPriceBoostSelected;
    dispatch<BettingSportsbookPriceBoostToggleAction>({
      type: BETTING__SBK_PRICE_BOOST_TOGGLE,
      payload: {
        combinationId,
      },
    });
    dispatch<BetslipSportsbookPriceBoostToggleAction>({
      type: UI__BETSLIP_SBK_PRICE_BOOST_TOGGLE,
      payload: {
        isSelected,
      },
    });
  },
  dispatchGenerosityPress: (combinationId, isSelected) => {
    dispatch<BettingSportsbookGenerosityWalletBetAction>({
      type: BETTING__SPORTSBOOK_GENEROSITY_WALLET_BET_ACTION,
      payload: {
        combinationId,
        isSelected,
      },
    });
    dispatch<FetchCardsAction>({
      type: FETCH_CARDS,
      payload: {
        urns: [EXTRA_WALLET_CARD_GROUP_URN],
      },
    });
  },
  dispatchGenerosityWalletRemoveAction: (combinationId: string, type?: WalletTypes) => {
    if (type === WalletTypes.BonusCash) {
      dispatch<BettingSportsbookRemoveAllCombinationWalletsAction>({
        type: BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
        payload: { combinationId },
      });
      return;
    }

    if (type === WalletTypes.AccaInsuranceToken) {
      dispatch<BettingSportsbookAccaInsuranceToggleAction>({
        type: BETTING__SBK_ACCA_INSURANCE_TOGGLE,
        payload: {
          combinationId,
        },
      });
      return;
    }

    if (type === WalletTypes.PriceBoostToken) {
      dispatch<BettingSportsbookPriceBoostToggleAction>({
        type: BETTING__SBK_PRICE_BOOST_TOGGLE,
        payload: {
          combinationId,
        },
      });
    }

    if (type === WalletTypes.MoneyBackToken) {
      dispatch<BettingSportsbookMoneyBackToggleAction>({
        type: BETTING__SBK_MONEY_BACK_TOGGLE,
        payload: {
          combinationId,
        },
      });
    }

    if (type === WalletTypes.GhostLegToken) {
      dispatch<BettingSportsbookGhostLegToggleAction>({
        type: BETTING__SBK_GHOST_LEG_TOGGLE,
        payload: {
          combinationId,
        },
      });
    }
  },
  dispatchGenerosityRemoveAction: () => {
    dispatch<BettingSportsbookRemoveGenerosityWalletsAction>({
      type: UI__GENEROSITY_WALLET_REMOVE_CLICK,
    });
  },
});
