import { AlertType, AlertProps } from "@ppb/the-wall-common/types";
import { PriceValidation } from "@ppb/tbd-store/state/entities/PriceValidation.types";
import { SizeValidation } from "@ppb/tbd-store/state/entities/SizeValidation.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { BettingMetadata } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import { BettingState, LEG_TYPES } from "@ppb/betslip-core";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ExchangeBetTransactionError } from "@ppb/tbd-store/state/betting/ExchangeBetTransactionError.types";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { ExchangeMarketStatus } from "@ppb/tbd-store";
import { ObbPotentialBet } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";

import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { TranslationKey } from "../../translations/keys";
import { i18n } from "../../helpers/i18n";
import { formatTime } from "../../helpers/dates";

const ORDINAL_MAPPING: (keyof TranslationKey)[] = [
  "I18N.BETSLIP.SBK.ORDINAL.FIRST",
  "I18N.BETSLIP.SBK.ORDINAL.SECOND",
  "I18N.BETSLIP.SBK.ORDINAL.THIRD",
];

function buildErrorInterpolationValues(
  e: ExchangeBetTransactionError,
  currencySymbol: string | undefined,
): { price: string; size: string; currencySymbol: string } | undefined {
  const { details } = e;
  if (details?.price && details?.size && currencySymbol) {
    return {
      price: `${details.price}`,
      size: `${details.size}`,
      currencySymbol,
    };
  }
  return undefined;
}

export function buildRacingTitle(metadata: BettingMetadata, userDetails: UserDetails): string {
  if (metadata.type !== "RACING") {
    return metadata.eventName;
  }

  const { localeCodeBcp47, timezone } = userDetails;

  const { racing } = metadata;
  const formattedRaceTime = formatTime(racing.time, localeCodeBcp47, timezone);

  return `${formattedRaceTime} ${racing.venue}`;
}

export const buildExchangeTransactionalError = (
  e: ExchangeBetTransactionError,
  currencySymbol: string | undefined,
): AlertProps => {
  const key = `I18N.BETSLIP.ERROR.${e.errorCode}` as keyof TranslationKey;
  const interpolationValues = buildErrorInterpolationValues(e, currencySymbol);
  const message = i18n({ key, interpolationValues }) || i18n({ key: "I18N.BETSLIP.ERROR.UNKNOWN" });

  return { type: AlertType.Error, message };
};

const getMarketStatusTranslation = (marketStatus: ExchangeMarketStatus): string => {
  switch (marketStatus) {
    case ExchangeMarketStatus.Suspended: {
      return i18n({ key: "I18N.BETSLIP.EXC.MARKET_SUSPENDED" });
    }
    case ExchangeMarketStatus.Closed: {
      return i18n({ key: "I18N.BETSLIP.EXC.MARKET_CLOSED" });
    }
    default:
      throw new Error("Unexpected market status, must be SUSPENDED or CLOSED");
  }
};

export const getCastOrdinal = (value: number): string => {
  // There is no possibility of more than 3 runners in a cast
  const ordinalMapping = ORDINAL_MAPPING[value - 1];

  return i18n({ key: ordinalMapping }) || i18n({ key: "I18N.BETSLIP.SBK.ORDINAL.OTHER" });
};

export const buildMarketNotification = (marketStatus: ExchangeMarketStatus): AlertProps => ({
  type: AlertType.Warning,
  message: getMarketStatusTranslation(marketStatus),
});

export const buildPriceNotification = (validation: PriceValidation): AlertProps => {
  switch (validation.reason) {
    case "ABOVE_MAX_PRICE": {
      return {
        type: AlertType.Warning,
        message: i18n({
          key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_PRICES",
          interpolationValues: { maximumOdds: `${validation.maximum}` },
        }),
        detail: i18n({ key: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE" }),
      };
    }
    case "INVALID_STEP": {
      return {
        type: AlertType.Warning,
        message: i18n({
          key: "I18N.BETSLIP.VALIDATION_INVALID_STEP",
          interpolationValues: {
            intervalMin: `${validation.interval.minimum}`,
            intervalMax: `${validation.interval.maximum}`,
            increment: `${validation.increment}`,
          },
        }),
        detail: i18n({ key: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE" }),
      };
    }
    case "BELOW_MIN_PRICE": {
      return {
        type: AlertType.Warning,
        message: i18n({
          key: "I18N.BETSLIP.VALIDATION_BELOW_MIN_PRICE",
          interpolationValues: { minimumOdds: `${validation.minimum}` },
        }),
        detail: i18n({ key: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE" }),
      };
    }
    default:
      throw new Error("Unexpected price ladder validation reason");
  }
};

export const buildSizeNotification = (validation: SizeValidation, newSize: string): AlertProps => {
  switch (validation.reason) {
    case "BELOW_MIN_SIZE": {
      return {
        type: AlertType.Warning,
        message: i18n({
          key: "I18N.BETSLIP.EXC.MIN_STAKE",
          interpolationValues: {
            minStake: `${newSize}`,
          },
        }),
      };
    }
    case "ABOVE_MAX_SIZE": {
      return {
        type: AlertType.Warning,
        message: i18n({
          key: "I18N.BETSLIP.VALIDATION_ABOVE_MAX_STAKE",
          interpolationValues: {
            maxStake: `${newSize}`,
          },
        }),
      };
    }
    case "INVALID_STEP": {
      return {
        type: AlertType.Warning,
        message: i18n({ key: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE" }),
      };
    }
    default:
      return {
        type: AlertType.Warning,
        message: i18n({ key: "I18N.BETSLIP.VALIDATION_SNAPPED_VALUE" }),
      };
  }
};

type BaseBet = {
  profit?: number;
  liability?: number;
};

type Bet = BaseBet & {
  side: keyof typeof ExchangeSide;
};

export type ConfirmBet = BaseBet & {
  side: keyof typeof ExchangeSide;
  size: number;
  liability: number;
};

type BetData = {
  label: string;
  value: string;
  rawValue: number;
};

const formatCalculation = (value: number, userDetails: UserDetails): string =>
  currencyFormatWithDecimalPlaces({
    ...userDetails,
    value,
    decimalPlaces: 2,
  });

export const getBetData = (bet: Bet, userDetails: UserDetails, isDepositRequired: boolean): BetData => {
  const defaultBetData = {
    label: "",
    value: "",
    rawValue: 0,
  };

  if (isDepositRequired) {
    return defaultBetData;
  }

  if (bet.side === ExchangeSide.BACK && bet.profit !== undefined) {
    return {
      label: `${i18n({ key: "I18N.BETSLIP.PROFIT" })}:`,
      value: formatCalculation(bet.profit, userDetails),
      rawValue: bet.profit,
    };
  }

  if (bet.side === ExchangeSide.LAY && bet.liability !== undefined) {
    const liability = Math.max(0, bet.liability);

    return {
      label: `${i18n({ key: "I18N.BETSLIP.LIABILITY" })}:`,
      value: formatCalculation(liability, userDetails),
      rawValue: liability,
    };
  }

  return defaultBetData;
};

export const getPotentialExposure = <T extends ConfirmBet>(bet: T): number =>
  bet.side === ExchangeSide.LAY ? bet.liability : bet.size;

export const buildFreeBetsLabel = (
  translationKey: keyof TranslationKey,
  userDetails: UserDetails,
  bonusUsed: number,
): string => {
  const valueWithCurrency = currencyFormatWithDecimalPlaces({ ...userDetails, value: bonusUsed });

  return i18n({
    key: translationKey,
    interpolationValues: { bonus: valueWithCurrency },
  });
};

export const buildAccaInsuranceLabels = (
  isAccaInsuranceSelected: boolean,
): {
  accaInsuranceTitle: string;
  accaInsuranceSubtitle: string;
  accaInsuranceTermsLabel: string;
} => {
  const accaInsuranceTitle = isAccaInsuranceSelected
    ? i18n({ key: "I18N.BETSLIP.ACCA_INSURANCE_APPLIED" })
    : i18n({ key: "I18N.BETSLIP.APPLY_ACCA_INSURANCE" });

  const accaInsuranceSubtitle = i18n({ key: "I18N.BETSLIP.MESSAGING.DESCRIPTION.ACCA_INSURANCE_PLACE" });
  const accaInsuranceTermsLabel = i18n({ key: "I18N.BETSLIP.ACCA_INSURANCE_TERMS_LABEL" });

  return {
    accaInsuranceTitle,
    accaInsuranceSubtitle,
    accaInsuranceTermsLabel,
  };
};

export const buildOriginalPotentialReturns = (
  totalStake: number | null,
  totalOriginalPotentialReturns: number | null,
  userDetails: UserDetails,
): string | undefined => {
  if (!totalStake) {
    return currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: 0,
      decimalPlaces: 2,
    });
  }

  if (!totalOriginalPotentialReturns) {
    return undefined;
  }

  return currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: totalOriginalPotentialReturns,
    decimalPlaces: 2,
  });
};
export const buildPotentialReturns = (
  totalStake: number | null,
  totalPotentialReturns: number | null,
  userDetails: UserDetails,
): string => {
  if (!totalStake) {
    return currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: 0,
      decimalPlaces: 2,
    });
  }

  if (!totalPotentialReturns) {
    return i18n({ key: "I18N.BETSLIP.TBD" });
  }

  return currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: totalPotentialReturns,
    decimalPlaces: 2,
  });
};

export const buildTotalOriginalReturns = (
  totalStake: number | null,
  totalPotentialReturns: number | null,
  totalOriginalReturns: number | null,
  hasPriceBoostedCombination: boolean,
  userDetails: UserDetails,
): string | undefined => {
  if (!totalStake || !totalPotentialReturns || !totalOriginalReturns || !hasPriceBoostedCombination) {
    return undefined;
  }

  return currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: totalOriginalReturns,
    decimalPlaces: 2,
  });
};

const isStartingPrice = (combination: BettingState.Combination, legs: BettingState.LegsMap | undefined) =>
  (!!legs && combination.legs.some((legId) => !legs[legId].odds)) ||
  (combination.isSPAvailable && combination.isSPSelected);

const isOneLineBetOnly = (combination: BettingState.Combination, legs: BettingState.LegsMap | undefined) =>
  !!legs && !!combination && combination.legs.every((legId) => legs[legId].legType === LEG_TYPES.ONE_LINE_BET);

export const buildOdds = (
  displayOdds: null | BettingState.Odds,
  preference: OddsDisplayPreference,
  isPriceBoostSelected = false,
): string =>
  displayOdds
    ? formatOdds(displayOdds, preference, isPriceBoostSelected)
    : i18n({ key: "I18N.BETSLIP.STARTING_PRICE" });

export const buildCombinationOdds = (
  combination: BettingState.Combination,
  preference: OddsDisplayPreference,
  legs?: BettingState.LegsMap,
): string => {
  if (isOneLineBetOnly(combination, legs)) {
    return buildOdds(combination.displayOdds, preference);
  }

  if (isStartingPrice(combination, legs)) {
    return buildOdds(null, preference);
  }

  if (combination.isAccaInsuranceSelected && combination.accaInsuranceDisplayOdds) {
    return buildOdds(combination.accaInsuranceDisplayOdds, preference);
  }

  if (combination.isPriceBoostSelected && combination.priceBoostDisplayOdds) {
    return buildOdds(combination.priceBoostDisplayOdds, preference);
  }

  return buildOdds(combination.displayOdds, preference);
};

export const buildObbPotentialBetOdds = (
  quote: ObbPotentialBet["quote"],
  preference: OddsDisplayPreference,
): string => {
  if (!quote) {
    return i18n({ key: "I18N.BETSLIP.NOT_AVAILABLE" });
  }

  const {
    price: { decimal, fractional },
  } = quote;

  return buildOdds({ decimalOdds: decimal, fractionalOdds: fractional }, preference);
};

export const buildCombinationPreviousOdds = (
  currentOdds: BettingState.Odds | null,
  previousOdds: SportsbookOdds | undefined,
  isPriceBoostSelected: boolean,
  sportsbookOddsDisplay: OddsDisplayPreference,
): string | undefined => {
  if (isPriceBoostSelected && currentOdds) {
    return formatOdds(currentOdds, sportsbookOddsDisplay);
  }

  return previousOdds ? formatOdds(previousOdds, sportsbookOddsDisplay) : undefined;
};

export const buildSportsbookFreeBetsLabel = (
  totalBonusUsed: number | undefined,
  userDetails: UserDetails,
  translationKey: keyof TranslationKey,
): string => {
  if (typeof totalBonusUsed === "undefined") {
    return "";
  }

  if (totalBonusUsed === 0) {
    return i18n({ key: "I18N.BETSLIP.BONUS_NOT_AVAILABLE" });
  }

  return buildFreeBetsLabel(translationKey, userDetails, totalBonusUsed);
};
