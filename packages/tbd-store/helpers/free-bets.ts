import { helpers, CONST } from "@ppb/bet-engine";
import {
  ExchangeBettingBonus,
  EligibleBonus,
  BonusWallet,
} from "../state/betting/exchange-betting-bonus/ExchangeBettingBonus.types";
import { SelectionId } from "../state/entities/Common.types";

/**
 * @param { value } selectionCondition the condition of type "SELECTION_ID"
 * @param selectionId the target selectionId
 * @return boolean
 */
const isWalletSelectionEligible = (wallet: BonusWallet, selectionId: SelectionId): boolean => {
  if (!wallet.conditions?.length) {
    return false;
  }

  const [condition] = wallet.conditions.filter(({ type }) => type === "SELECTION_ID");

  if (!condition) {
    return false;
  }

  return !!condition.value && parseInt(condition.value, 10) === selectionId;
};

export function calculateUsedBonus(liability: number, availableBonus: number | undefined): number {
  if (!availableBonus) {
    return 0;
  }

  return liability < availableBonus ? liability : availableBonus;
}

/**
 * Check if we could use freebets in a specific market type "ODDS_GENERIC"
 * TODO: BSP are not yet implemented so for now the default value is false
 *
 * @param marketType Type of market e.g "MATCH_ODDS"
 * @param bettingType Type of betting e.g "ODDS"
 * @param isBsp Best Starting Price
 * @returns boolean
 */
export function isFreeBetsAvailable(marketType: string, bettingType: string, isBsp = false): boolean {
  return !isBsp && helpers.getBettingBehaviour(marketType, bettingType) === CONST.BETTING_BEHAVIOUR.ODDS_GENERIC;
}

/**
 * For a given selectionId and implyExecutionReport response, returns the eligible bonus or 0 if there's none
 */
export const calculateEligibleBonus = (
  exchangeBettingBonus: ExchangeBettingBonus,
  selectionId: SelectionId,
  marketType: string,
  bettingType: string,
): EligibleBonus => {
  if (!exchangeBettingBonus?.wallets?.length || !isFreeBetsAvailable(marketType, bettingType)) {
    return 0;
  }

  return exchangeBettingBonus.wallets.reduce((acc: EligibleBonus, wallet: BonusWallet) => {
    if (!wallet.conditions?.length) {
      return acc + wallet.amount;
    }

    if (isWalletSelectionEligible(wallet, selectionId)) {
      return acc + wallet.amount;
    }

    return acc;
  }, 0);
};

/**
 * For a partially matched bet returns the bonus left if some of it is used in the matched bet
 * FIXME: Remove this function when ETX returns the totalBonusUsed for each bet
 *
 * @param totalBonusUsed Bonus used in the matched bet
 * @param availableBonus Bonus available for this bet
 */
export const calculateBonusLeft = (totalBonusUsed: number | undefined, availableBonus: number | undefined): number => {
  if (!availableBonus || !totalBonusUsed) {
    return 0;
  }

  return availableBonus - totalBonusUsed;
};
