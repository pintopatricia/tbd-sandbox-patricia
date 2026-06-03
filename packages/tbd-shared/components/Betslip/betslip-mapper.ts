import { createSelector, OutputParametricSelector } from "reselect";

import { QuickStake, UserPreferences } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { PriceValidation } from "@ppb/tbd-store/state/entities/PriceValidation.types";
import { SizeValidation } from "@ppb/tbd-store/state/entities/SizeValidation.types";
import { LADDER_DEFAULT_MIN_SIZE } from "@ppb/tbd-store/config/bet-engine-config";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createUserPreferencesWithProductSwitcherSelector,
  createUserPreferencesQuickStakesSelector,
} from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getCastContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BettingState } from "@ppb/betslip-core";
import { UserDetails, UserDetailsState } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { CastGroup, isOrderableCast } from "@ppb/tbd-store/helpers/sportsbook-betting";
import {
  BettingMetadata,
  RunnersMetadata,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import {
  createGetCastGroupSelector,
  getBettingResolvers,
  getSportsbookBettingState,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  createGetUserMainWalletValueSelector,
  createGetUserSpecificWalletSelector,
} from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { ExchangeMarketStatus, WalletNames } from "@ppb/tbd-store/state/constants";
import {
  BetslipCastContext,
  BetslipSportsbookConfirmationBet,
  CastBetRunnerSelectionProps,
} from "@ppb/tbd-store/state/betslip/Betslip.types";
import { ExchangeBetTransactionError } from "@ppb/tbd-store/state/betting/ExchangeBetTransactionError.types";
import { CastBetCastTypeItem, ForecastTricastSelectionProps, AlertProps } from "@ppb/the-wall-common/types";
import { getObbBettingState } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";

import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { CurrencyUserDetails } from "../../formatters/formatters";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

import {
  buildExchangeTransactionalError,
  buildMarketNotification,
  buildPriceNotification,
  buildRacingTitle,
  buildSizeNotification,
  getCastOrdinal,
} from "./betslip-formatters";
import { buildSelection, translateMultiple } from "./connected-sportsbook-betslip-mapper";

export const isNotification = (n: AlertProps | undefined): n is AlertProps => !!n;

export const getPriceSnapValue = (validation: PriceValidation, currentPrice?: number): number | undefined => {
  switch (validation.reason) {
    case "ABOVE_MAX_PRICE": {
      return validation.maximum;
    }
    case "INVALID_STEP": {
      if (!currentPrice) {
        return undefined;
      }
      const { nextStep, previousStep } = validation;
      const isNextStepNearTheCurrentPrice = Math.abs(nextStep - currentPrice) < Math.abs(previousStep - currentPrice);
      return isNextStepNearTheCurrentPrice ? nextStep : previousStep;
    }
    case "BELOW_MIN_PRICE": {
      return validation.minimum;
    }
    default: {
      // something went really wrong
      return undefined;
    }
  }
};

export const buildQuickStakesSelector = () => {
  const getUserPreferencesQuickStakes = createUserPreferencesQuickStakesSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      (state: ApplicationState): QuickStake[] => getUserPreferencesQuickStakes(state.entities.preferences) || [],
      getUserDetailsSelector,
    ],
    (quickStakes, userDetails) => {
      const { currencyCode, localeCodeBcp47 } = <UserDetails>userDetails;

      return quickStakes.map(({ stake }) => ({
        stake,
        displayStake: `+ ${currencyFormatWithoutDecimalPlaces({ currencyCode, localeCodeBcp47, value: stake })}`,
      }));
    },
  );
};

export type DemonstrationCombination = {
  odds: string;
  betType: string;
  translatedBetType: string;
  stake: string;
  potentialReturns: string;
};

export const createBuildDemonstrationCombination = (): OutputParametricSelector<
  ApplicationState,
  BettingState.Combination,
  DemonstrationCombination | undefined,
  (
    userDetails: UserDetails,
    preferences: UserPreferences,
    combination: BettingState.Combination,
  ) => DemonstrationCombination | undefined
> => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      (state: ApplicationState): UserDetailsState => getUserDetailsSelector(state),
      (state: ApplicationState): UserPreferences => getUserPreferencesWithProductSwitcher(state.entities.preferences),
      (_: ApplicationState, combination: BettingState.Combination) => combination,
    ],
    (userDetails, preferences, combination): DemonstrationCombination | undefined => {
      if (!combination?.betType || !combination?.displayOdds || !combination?.potentialReturns) {
        return undefined;
      }

      const { totalStake, displayOdds, potentialReturns } = combination;
      const formattedStake = currencyFormatWithDecimalPlaces({
        ...(<UserDetails>userDetails),
        value: totalStake,
        decimalPlaces: 2,
      });
      const formattedReturns = currencyFormatWithDecimalPlaces({
        ...(<UserDetails>userDetails),
        value: potentialReturns,
        decimalPlaces: 2,
      });

      return {
        stake: formattedStake,
        betType: combination.betType,
        translatedBetType: translateMultiple(combination.betType),
        odds: formatOdds(displayOdds, preferences.sportsbookOddsDisplay),
        potentialReturns: formattedReturns,
      };
    },
  );
};

export const createGetSbkIsDepositRequiredSelector = () => {
  const getMainWallet = createGetUserMainWalletValueSelector();
  const getWageringWallet = createGetUserSpecificWalletSelector(WalletNames.SPORTSBOOK_BONUS_WAGERING);

  return createSelector(
    [(_, stake?: number) => stake, getSportsbookBettingState, getMainWallet, getWageringWallet],
    (stake, bettingState, mainWallet, wageringWallet) => {
      const { isBonusSelected, totalStake } = bettingState;

      if (mainWallet === null || !wageringWallet) {
        return false;
      }

      const wageringWalletAmmount = wageringWallet?.status === "SUCCESS" ? wageringWallet.amount : 0;
      const stakeToEvaluate = stake ?? totalStake;

      return !isBonusSelected && Number(stakeToEvaluate.toFixed(2)) > mainWallet + wageringWalletAmmount;
    },
  );
};

export const createGetSbkRequiredDepositValueSelector = () => {
  const isDepositRequiredSelector = createGetSbkIsDepositRequiredSelector();
  const getMainWallet = createGetUserMainWalletValueSelector();
  return createSelector(
    [getSportsbookBettingState, isDepositRequiredSelector, getMainWallet],
    (bettingState, isDepositRequired, mainWallet) => {
      if (!isDepositRequired || mainWallet === null) {
        return 0;
      }

      const stake = Number(bettingState.totalStake.toFixed(2));
      return stake > mainWallet ? Math.ceil(stake - mainWallet) : 0;
    },
  );
};

export const createGetObbIsDepositRequiredSelector = () => {
  const getMainWallet = createGetUserMainWalletValueSelector();

  return createSelector([getObbBettingState, getMainWallet], (obbBettingState, mainWallet) => {
    const totalStake = obbBettingState.totalStake || 0;

    if (mainWallet === null) {
      return false;
    }

    return Number(totalStake.toFixed(2)) > mainWallet;
  });
};

export const buildBaseCastRunner = (
  metadata: BettingMetadata,
  userDetails: UserDetails,
): CastBetRunnerSelectionProps => {
  const { title, icon, racingSport, meetingCountry, silkFallbackType, trap } = buildSelection(metadata, userDetails);

  return {
    horse: title,
    icon,
    racingSport,
    trap,
    meetingCountry,
    silkFallbackType,
  };
};

export const buildOrderedCastRunner = (
  runner: BettingState.Runner,
  metadata: BettingMetadata,
  userDetails: UserDetails,
): ForecastTricastSelectionProps => ({
  ...buildBaseCastRunner(metadata, userDetails),
  position: runner.order !== null ? runner.order : undefined,
  positionOrdinal: runner.order ? getCastOrdinal(runner.order) : undefined,
});

export const generateCastTypes = (legs: BettingState.LegsMap, castGroup: CastGroup): CastBetCastTypeItem[] => {
  const { combinations } = castGroup;
  return combinations.map(({ id, legs: [legId] }) => {
    const leg = legs[legId];

    return {
      id,
      text: i18n({ key: `I18N.BETSLIP.SBK.CAST.${leg.legType}` as keyof TranslationKey }),
    };
  });
};

export type CastBet = {
  id: string;
  title: string;
  selectedCastType: string;
  isOrderable?: boolean;
};

export const buildCastBet = (
  castGroup: CastGroup,
  context: BetslipCastContext,
  bettingState: BettingState.Group | BetslipSportsbookConfirmationBet,
  metadata: RunnersMetadata,
  userDetails: UserDetails,
  isOrderable = true,
): CastBet | undefined => {
  const { id: groupId, combinations: castCombinations, metadataRunnerId } = castGroup;
  const { legs, runners } = bettingState;
  const currentCastContext = context[groupId];
  const combination = castCombinations.find(({ id }) => currentCastContext === id);

  if (!combination) {
    return undefined;
  }

  const combinationMetadata = metadata[metadataRunnerId];
  const castRunnerIds = legs[combination.legs[0]]?.runners ?? [];
  const isOrderableCombination = isOrderableCast(combination, legs);
  const isOrderableRunner =
    !!castRunnerIds.length && castRunnerIds.every((runnerId) => runners[runnerId].order !== null);

  return {
    id: groupId,
    title: buildRacingTitle(combinationMetadata, userDetails),
    selectedCastType: currentCastContext,
    isOrderable: isOrderable && isOrderableRunner && isOrderableCombination,
  };
};

export const createGetCastBetSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  CastBet | undefined,
  (
    castGroup: CastGroup,
    castContext: BetslipCastContext | undefined,
    bettingState: BettingState.Group,
    metadata: RunnersMetadata,
    userDetails: UserDetails,
  ) => CastBet | undefined
> => {
  const getCastGroup = createGetCastGroupSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      (state: ApplicationState, castGroupId: string) => getCastGroup(state, castGroupId),
      (state) => (state.betslip ? getCastContext(state.betslip) : undefined),
      getSportsbookBettingState,
      (state) => getBettingResolvers(state.betslip?.group).getMetadata(state),
      getUserDetailsSelector,
    ],
    (castGroup, castContext, bettingState, metadata, userDetails) => {
      const context = castContext || { [castGroup.id]: castGroup.combinations[0].id };

      return buildCastBet(castGroup, context, bettingState, metadata, <UserDetails>userDetails);
    },
  );
};

export const getPriceBoostCount = (
  combinations: { isPriceBoostSelected: boolean }[],
  boostWallet: { amount: number } | null | undefined,
): number => {
  if (!boostWallet) {
    return 0;
  }

  return combinations.reduce(
    (count, combination) => count - (combination.isPriceBoostSelected ? 1 : 0),
    boostWallet.amount,
  );
};

export const isAnyPriceBoostAvailable = (combinations: { isPriceBoostAvailable: boolean }[]): boolean =>
  combinations.some((c) => c.isPriceBoostAvailable);

type Notification = {
  notification: AlertProps;
};

export const buildMarketError = (marketStatus: ExchangeMarketStatus): Notification | undefined => {
  if (marketStatus !== ExchangeMarketStatus.Open) {
    return {
      notification: buildMarketNotification(marketStatus),
    };
  }
  return undefined;
};

export const buildPlaceError = (
  marketStatus: ExchangeMarketStatus,
  exchangePlaceError?: ExchangeBetTransactionError,
  currencySymbol?: string,
): Notification | undefined => {
  if (marketStatus === ExchangeMarketStatus.Open) {
    return exchangePlaceError
      ? { notification: buildExchangeTransactionalError(exchangePlaceError, currencySymbol) }
      : undefined;
  }

  return undefined;
};

type PriceNotification = {
  newPrice: number;
} & Notification;

export const buildPriceError = (
  marketStatus: ExchangeMarketStatus,
  priceValidation?: PriceValidation,
  price?: number,
): PriceNotification | undefined => {
  if (marketStatus === ExchangeMarketStatus.Open && priceValidation) {
    const newPrice = getPriceSnapValue(priceValidation, price);
    return newPrice
      ? {
          newPrice,
          notification: buildPriceNotification(priceValidation),
        }
      : undefined;
  }
  return undefined;
};

type SizeNotification = {
  newSize: number;
} & Notification;

export const buildSizeError = (
  marketStatus: ExchangeMarketStatus,
  userDetails: UserDetails,
  sizeValidation?: SizeValidation,
): SizeNotification | undefined => {
  if (marketStatus === ExchangeMarketStatus.Open && sizeValidation) {
    const newSize = userDetails.excSettings?.currencyDetails?.minStake || LADDER_DEFAULT_MIN_SIZE;
    const formattedNewSize = currencyFormatWithDecimalPlaces({
      ...(<CurrencyUserDetails>userDetails),
      value: newSize,
      decimalPlaces: 2,
    });

    return {
      newSize,
      notification: buildSizeNotification(sizeValidation, formattedNewSize),
    };
  }
  return undefined;
};
