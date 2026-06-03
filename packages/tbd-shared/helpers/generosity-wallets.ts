import { ApplicationState, OddsDisplayPreference, UserDetails } from "@ppb/tbd-store";
import { ValueIconName } from "@ppb/the-wall-icons";
import { BettingState, PlaceResult } from "@ppb/betslip-core";
import { PRICE_BOOST_MODE } from "@ppb/betslip-core/src/enums/price-boost-mode";
import { createSelector } from "reselect";
import { ExtraWallets } from "@ppb/tbd-store/state/entities/extra-wallet/ExtraWallet.types";
import { ExtraWalletCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { GenerosityIconName } from "@ppb/the-wall-common/types/Betslip/GenerosityIcon.types";
import {
  WalletToken,
  WalletsTokensMap,
  createGetCombinationEligibleGenerosityWalletsSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";
import type { TranslationKey } from "../translations/keys";
import { i18n } from "./i18n";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";

export type OptionWallet = {
  isSelected: boolean;
  isDisabled: boolean;
} & WalletToken;

export type OptionWallets = {
  [id: string]: OptionWallet;
};

export type GenerosityCardsURNByType = {
  [key: string]: URN[];
};

export const sumWalletsAmounts = (value1 = 0, value2 = 0): number =>
  value1 || value2 ? (value1 * 100 + value2 * 100) / 100 : 0;

/**
 * Formats decimal odds to show minimum 1dp, maximum 2dp when needed.
 * e.g. 2 → "2.0", 2.5 → "2.5", 2.75 → "2.75"
 */
export const formatDecimalOdds = (value: number): string => value.toFixed(2).replace(/(\.[0-9])0$/, "$1");

/**
 * Formats fixed odds based on the user's display preference.
 * For decimal: shows 1-2 decimal places as required.
 * For default and fractional: uses the tbd standard for fractional odds.
 */
export const formatFixedOdds = (decimalOdds: number, oddsDisplayPreference: OddsDisplayPreference): string =>
  oddsDisplayPreference === OddsDisplayPreference.Decimal
    ? formatDecimalOdds(decimalOdds)
    : formatOdds({ decimal: decimalOdds }, OddsDisplayPreference.Fractional, false);

export enum PebbleFilterOptions {
  All = "ALL",
  AccaInsuranceToken = WalletTypes.AccaInsuranceToken,
  MoneyBackToken = WalletTypes.MoneyBackToken,
  FreeBets = WalletTypes.BonusCash,
  PriceBoostToken = WalletTypes.PriceBoostToken,
  GhostLegToken = WalletTypes.GhostLegToken,
}

export const MAP_PEBBLE_OPTION_TO_GA_LABEL: Record<PebbleFilterOptions, string> = {
  [PebbleFilterOptions.All]: "all",
  [PebbleFilterOptions.FreeBets]: "free bets",
  [PebbleFilterOptions.AccaInsuranceToken]: "money back",
  [PebbleFilterOptions.MoneyBackToken]: "money back",
  [PebbleFilterOptions.PriceBoostToken]: "boost",
  [PebbleFilterOptions.GhostLegToken]: "ghost leg",
};

const getPlaceWithEnding = (place: number) => {
  const keyMap: Record<number, keyof TranslationKey> = {
    2: "I18N.MONEY_BACK_REWARD.PLACED_SECOND",
    3: "I18N.MONEY_BACK_REWARD.PLACED_THIRD",
  };

  const key = keyMap[place] ?? "I18N.MONEY_BACK_REWARD.PLACED_OTHER";
  return `${place}${i18n({ key })}`;
};

export const getPlacesListed = (maxFinPos?: number | null) => {
  if (!maxFinPos || maxFinPos < 2) {
    return "";
  }

  const normalSeparator = ", ";
  const finalSeparator = ` ${i18n({ key: "I18N.MONEY_BACK_REWARD.SEPARATOR" })} `;

  const placesLabels = Array.from({ length: maxFinPos - 1 }, (_, idx) => getPlaceWithEnding(idx + 2));

  const places = placesLabels.map((placeLabel, idx) => {
    if (idx === 0) {
      return placeLabel;
    }

    const isLastLabel = idx === placesLabels.length - 1;
    const labelSeparator = isLastLabel ? finalSeparator : normalSeparator;

    return `${labelSeparator}${placeLabel}`;
  });

  return places.join("");
};

export const pickMoneyBackAlertMessage = ({
  maxFinPos,
  formattedAmount,
}: {
  maxFinPos?: number | null;
  formattedAmount: string;
}) => {
  if (maxFinPos) {
    const placesListed = getPlacesListed(maxFinPos);
    return i18n({
      key: "I18N.MONEY_BACK_REWARD.RUN_PLACES",
      interpolationValues: { places: placesListed, amount: formattedAmount },
    });
  }

  return i18n({ key: "I18N.MONEY_BACK_REWARD.HORSE_LOSES", interpolationValues: { amount: formattedAmount } });
};

export const buildFreeBetsAlertMessage = ({
  userDetails,
  combinationAmount,
  numLines = 1,
  combinationAmountPerLine,
}: {
  userDetails: UserDetails;
  combinationAmount?: number;
  numLines?: number;
  combinationAmountPerLine?: number;
}): string | undefined => {
  const isMultiLine = numLines > 1;

  const messageAmount = isMultiLine ? combinationAmountPerLine : combinationAmount;

  if (!messageAmount) {
    return undefined;
  }

  const formattedAmountLabel = currencyFormatWithDecimalPlaces({
    ...userDetails,
    value: messageAmount,
    decimalPlaces: 2,
  });

  const freeBetsWalletsAmountsLabel = isMultiLine ? `${numLines} x ${formattedAmountLabel}` : formattedAmountLabel;

  return i18n({
    key: "I18N.LABEL.BETSLIP_FREEBETS",
    interpolationValues: { bonus: freeBetsWalletsAmountsLabel },
  });
};

export const getGenerosityBetslipAlertData = ({
  combination,
  isAccaInsuranceTokenSelected,
  isGhostLegTokenSelected,
  isFreeBetsSelected,
  isPriceBoostSelected,
  isMoneyBackTokenSelected,
  isSingleBetBetslip,
  userDetails,
  numLines,
  combinationAmountPerLine,
  combinationAmount,
  ghostLegs,
  oddsDisplayPreference,
}: {
  combination: BettingState.Combination;
  isAccaInsuranceTokenSelected: boolean;
  isGhostLegTokenSelected: boolean;
  isFreeBetsSelected: boolean;
  isPriceBoostSelected: boolean;
  isMoneyBackTokenSelected: boolean;
  isSingleBetBetslip: boolean;
  userDetails: UserDetails;
  numLines: number;
  combinationAmountPerLine: number | undefined;
  combinationAmount: number | undefined;
  ghostLegs?: number;
  oddsDisplayPreference: OddsDisplayPreference;
}): {
  message?: string;
  icon?: GenerosityIconName;
  type?: WalletTypes;
} => {
  const { accaInsuranceNumberOfLegs, accaInsuranceAmountLimit, moneyBackNumberOfPlaces, moneyBackAmountLimit } =
    combination;

  if (isAccaInsuranceTokenSelected && accaInsuranceNumberOfLegs && accaInsuranceAmountLimit) {
    const formattedAccaInsuranceAmountLimit = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: accaInsuranceAmountLimit,
      decimalPlaces: 2,
    });

    return {
      message: i18n({
        key: "I18N.MONEY_BACK_ACCA_CONDITION",
        interpolationValues: { numberOfLegs: accaInsuranceNumberOfLegs, value: formattedAccaInsuranceAmountLimit },
      }),
      icon: ValueIconName.MONEY_BACK,
      type: WalletTypes.AccaInsuranceToken,
    };
  }

  if (isPriceBoostSelected) {
    const priceBoostOffer = combination.priceBoostOffers?.find(
      (offer) => offer.tokenId === combination.priceBoostTokenId,
    );

    if (priceBoostOffer?.mode === PRICE_BOOST_MODE.FIXED_ODDS && priceBoostOffer.odds?.decimalOdds) {
      const formattedFixedOdds = formatFixedOdds(priceBoostOffer.odds?.decimalOdds, oddsDisplayPreference);

      return {
        message: i18n({
          key: "I18N.BOOST_FIXED_ODDS_VALUE_APPLIED",
          interpolationValues: {
            value: formattedFixedOdds,
          },
        }),
        icon: ValueIconName.BOOSTER,
        type: WalletTypes.PriceBoostToken,
      };
    }

    if (priceBoostOffer?.generosity) {
      return {
        message: i18n({
          key: "I18N.BOOST_VALUE_APPLIED",
          interpolationValues: {
            value: priceBoostOffer.generosity,
          },
        }),
        icon: ValueIconName.BOOSTER,
        type: WalletTypes.PriceBoostToken,
      };
    }
  }

  if (isFreeBetsSelected) {
    const generosityAlertMessage = !isSingleBetBetslip
      ? buildFreeBetsAlertMessage({
          userDetails,
          numLines,
          combinationAmountPerLine,
          combinationAmount,
        })
      : undefined;

    return { message: generosityAlertMessage, icon: ValueIconName.FREE_BET, type: WalletTypes.BonusCash };
  }

  if (isMoneyBackTokenSelected && moneyBackAmountLimit) {
    const formattedMaxReturn = currencyFormatWithDecimalPlaces({
      ...userDetails,
      value: moneyBackAmountLimit,
    });

    const message = pickMoneyBackAlertMessage({
      maxFinPos: moneyBackNumberOfPlaces,
      formattedAmount: formattedMaxReturn,
    });

    return {
      message,
      icon: ValueIconName.MONEY_BACK,
      type: WalletTypes.MoneyBackToken,
    };
  }

  if (isGhostLegTokenSelected && ghostLegs) {
    return {
      message: i18n({
        key: "I18N.GHOST_LEG_CONDITION",
        interpolationValues: {
          numberOfLegs: ghostLegs,
        },
      }),
      icon: ValueIconName.GHOST_LEG,
      type: WalletTypes.GhostLegToken,
    };
  }

  return {};
};

export const getGenerosityReceiptAlertData = ({
  combination,
  userDetails,
  isFreeBetsWalletsActive,
}: {
  combination: PlaceResult.PlacedCombination;
  userDetails: UserDetails;
  isFreeBetsWalletsActive: boolean;
}): {
  message?: string;
  icon?: GenerosityIconName;
} => {
  const { hasBonusUsed, totalBonusUsed, isAccaInsuredToken, isPriceBoosted, hasMoneyBackUsed, hasGhostLeg } =
    combination;

  if (isFreeBetsWalletsActive && hasBonusUsed)
    return {
      message: buildFreeBetsAlertMessage({ userDetails, combinationAmount: totalBonusUsed }),
      icon: ValueIconName.FREE_BET,
    };
  if (isAccaInsuredToken)
    return {
      message: i18n({
        key: "I18N.MONEY_BACK_ACCA_APPLIED",
      }),
      icon: ValueIconName.MONEY_BACK,
    };
  if (isPriceBoosted)
    return {
      message: i18n({
        key: "I18N.BOOST_APPLIED",
      }),
      icon: ValueIconName.BOOSTER,
    };
  if (hasMoneyBackUsed) {
    return {
      message: i18n({
        key: "I18N.MONEY_BACK_REWARD.MONEY_BACK_APPLIED",
      }),
      icon: ValueIconName.MONEY_BACK,
    };
  }

  if (hasGhostLeg) {
    return {
      message: i18n({
        key: "I18N.GHOST_LEG_APPLIED",
      }),
      icon: ValueIconName.GHOST_LEG,
    };
  }

  return {};
};

const mapWalletTypeToPebble = {
  [WalletTypes.BonusCash]: PebbleFilterOptions.FreeBets,
  [WalletTypes.AccaInsuranceToken]: PebbleFilterOptions.AccaInsuranceToken,
  [WalletTypes.MoneyBackToken]: PebbleFilterOptions.AccaInsuranceToken,
  [WalletTypes.PriceBoostToken]: PebbleFilterOptions.PriceBoostToken,
  [WalletTypes.GhostLegToken]: PebbleFilterOptions.GhostLegToken,
};

export const createGenerosityCardsURNByTypeSelector = () => {
  const getCombinationEligibleGenerosityWallets = createGetCombinationEligibleGenerosityWalletsSelector();

  return createSelector(
    [
      (state: ApplicationState): ExtraWallets => state.entities.extraWallets,
      (state: ApplicationState): ExtraWalletCards => state.layouts.cards.extrawallet,
      (state: ApplicationState) => getCombinationEligibleGenerosityWallets(state),
    ],
    (
      extraWallets: ExtraWallets,
      extraWalletCards: ExtraWalletCards,
      eligibleGenerosityWallets: WalletsTokensMap,
    ): GenerosityCardsURNByType => {
      const isBetslipMode = Object.keys(eligibleGenerosityWallets).length;

      return Object.values(extraWalletCards).reduce<GenerosityCardsURNByType>((acc, { urn, extraWalletURN }) => {
        const { walletType } = extraWallets[extraWalletURN];

        if (isBetslipMode) {
          const isGenerosityWalletEligible = Object.keys(eligibleGenerosityWallets).some((walletId) =>
            urn.includes(walletId),
          );

          if (!isGenerosityWalletEligible) return acc;
        }

        const mappedWalletType = walletType && mapWalletTypeToPebble[walletType];

        if (mappedWalletType) {
          acc[mappedWalletType] = [...(acc[mappedWalletType] ?? []), urn];
        }

        return acc;
      }, {});
    },
  );
};

export const updateOptionWallets = (
  prev: OptionWallets,
  walletId: string,
  isSelected: boolean,
  selectedCombinationId: string | undefined,
): OptionWallets => {
  const { type } = prev[walletId];

  if (!isSelected)
    return {
      ...prev,
      [walletId]: { ...prev[walletId], isSelected, combinationId: undefined },
    };

  if (type === WalletTypes.BonusCash) {
    const updatedWallets = Object.fromEntries(
      Object.entries(prev).map(([id, wallet]) => [
        id,
        wallet.type === WalletTypes.BonusCash
          ? wallet
          : {
              ...wallet,
              isSelected: wallet.isDisabled ? wallet.isSelected : false,
              combinationId: wallet.isDisabled ? wallet.combinationId : undefined,
            },
      ]),
    );
    return {
      ...updatedWallets,
      [walletId]: { ...prev[walletId], isSelected, combinationId: selectedCombinationId },
    };
  }

  const updatedWallets = Object.fromEntries(
    Object.entries(prev).map(([id, wallet]) => [
      id,
      {
        ...wallet,
        isSelected: wallet.isDisabled ? wallet.isSelected : false,
        combinationId: wallet.isDisabled ? wallet.combinationId : undefined,
      },
    ]),
  );

  return {
    ...updatedWallets,
    [walletId]: { ...prev[walletId], isSelected, combinationId: selectedCombinationId },
  };
};
