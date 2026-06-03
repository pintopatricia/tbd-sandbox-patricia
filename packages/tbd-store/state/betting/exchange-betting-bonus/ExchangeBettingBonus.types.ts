import { MarketId } from "../../entities/Common.types";

/**
 * Bet Engine Exchange Bonus Discount
 */
export type BonusDiscount = {
  bonus: number;
};

/**
 * Bonus Wallet conditions type
 * Conditions that must be respected to be allowed to spend bonus money from this wallet
 */
export type BonusConditions = {
  /** Type of condition to be validated */
  type: string;
  /** The value of the condition that must be met (e.g. BACK or LAY for type Side) */
  value?: string;
  /** Minimum value to validate the condition (if applicable to this condition type) */
  min?: number;
  /** Maximum value to validate the condition (if applicable to this condition type). Max value is exclusive */
  max?: number;
};

/**
 * Bonus Wallet type
 * Bonus wallets applicable to a market along with bet level conditions that must be achieved in order to spend the bonus money it contains
 */
export type BonusWallet = {
  /** Bonus Wallet type */
  walletType?: string;
  /** Bonus Balance available */
  amount: number;
  /** Bonus Wallet conditions */
  conditions?: BonusConditions[];
};

/** Cumulative amount of all balance that can be used in a selection */
export type EligibleBonus = number;

/** ETX Imply report with all the bonus wallets for a particular market */
export type ExchangeMarketBonus = {
  status: string;
  errorCode?: string;
  marketId?: MarketId;
  hasBonusMoney: boolean;
  wallets: BonusWallet[];
};

/** The Exchange Betting Bonus state */
export type ExchangeBettingBonus = Partial<ExchangeMarketBonus>;
