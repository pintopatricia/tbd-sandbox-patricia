import { UserDetails } from "@ppb/tbd-store";
import { getPreciseSubtraction } from "@ppb/tbd-store/helpers/math";
import { i18n } from "./i18n";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";

const NOT_AVAILABLE_KEY = "I18N.BETSLIP.NOT_AVAILABLE";

export type BalanceAfterBetLabelConfig = {
  accountBalance: number;
  totalStake: number;
  isOldUseBonusActive?: boolean;
  isLoggedIn?: boolean;
};

export const buildSbkBalanceAfterBetLabel = (
  userDetails: UserDetails,
  { accountBalance, totalStake, isOldUseBonusActive = false, isLoggedIn }: BalanceAfterBetLabelConfig,
): string => {
  if (isOldUseBonusActive) {
    return i18n({ key: NOT_AVAILABLE_KEY });
  }

  const newAccountBalance = isLoggedIn ? getPreciseSubtraction(accountBalance, totalStake) : 0;

  return newAccountBalance >= 0
    ? currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: newAccountBalance,
      })
    : i18n({ key: NOT_AVAILABLE_KEY });
};
