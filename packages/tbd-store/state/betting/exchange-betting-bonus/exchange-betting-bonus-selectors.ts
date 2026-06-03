import { calc, PotentialBet } from "@ppb/bet-engine";
import { createSelector, OutputParametricSelector } from "reselect";
import { ExchangeBettingBonus, EligibleBonus, BonusDiscount } from "./ExchangeBettingBonus.types";
import { ExchangeRunnerTree } from "../../betslip/Betslip.types";
import { ExchangeRunner } from "../../entities";
import { MarketId, SelectionId } from "../../entities/Common.types";
import { ApplicationState } from "../../ApplicationState.types";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../../entities/entities-selectors";
import { calculateEligibleBonus } from "../../../helpers/free-bets";

/** ********************************
 *  Bonus wallets state selectors  *
 ********************************* */

/**
 * For a given market id, returns the corresponding market bonus wallets or null if there's none
 */
export const getExchangeBettingBonusByMarketId = (
  state: ApplicationState,
  marketId: MarketId,
): ExchangeBettingBonus | null => {
  const marketBonus = state.betting.exchangeBettingBonus;

  if (!marketBonus || marketId !== marketBonus.marketId) {
    return null;
  }

  return marketBonus;
};

/**
 * For a given market id, returns the eligible market bonus or 0 if there's none
 */
export const getExchangeEligibleBonusByMarketId = (
  state: ApplicationState,
  marketId: MarketId,
  selectionId: SelectionId,
  marketType: string,
  bettingType: string,
): EligibleBonus => {
  const marketBonus = getExchangeBettingBonusByMarketId(state, marketId);

  if (!marketBonus || !marketBonus.wallets) {
    return 0;
  }

  return calculateEligibleBonus(marketBonus, selectionId, marketType, bettingType);
};

/**
 * Creates the getExchangeLiabilityWithBonus selector
 * For a given runner and market id, returns the liability with bonus for a potential bet
 */
const createGetExchangeLiabilityWithBonus = (): OutputParametricSelector<
  ApplicationState,
  ExchangeRunner,
  number | undefined,
  (potentialBet: PotentialBet[], runnerTree: ExchangeRunnerTree, eligibleBonus: number) => number | undefined
> => {
  const getRunnerPotentialBets = createExcRunnerPotentialBetsByRunnerURNSelector();

  return createSelector(
    [
      (state: ApplicationState, runner: ExchangeRunner) => getRunnerPotentialBets(state, runner.urn) || [],
      (state: ApplicationState, runner: ExchangeRunner) => getExchangeRunnerTree(state.entities, runner.urn),
      (state: ApplicationState, runner: ExchangeRunner, marketId: string, marketType: string, bettingType: string) =>
        getExchangeEligibleBonusByMarketId(state, marketId, runner.selectionId, marketType, bettingType),
    ],
    ([potentialBet], runnerTree, eligibleBonus): number | undefined => {
      if (!runnerTree) return undefined;

      const { size, price, side } = potentialBet;

      if (!size || !price) return undefined;

      const { market } = runnerTree;
      const { bettingType, marketType } = market;

      const bonusDiscount: BonusDiscount = {
        bonus: eligibleBonus,
      };

      return calc.liability(side, size, price, bettingType, marketType, bonusDiscount);
    },
  );
};

/**
 * For a given runner and market id, returns the potential bet with the liability calculated with bonus
 */
export const getRunnerPotentialBetWithBonus = (
  state: ApplicationState,
  runner: ExchangeRunner,
  marketId: string,
  marketType: string,
  bettingType: string,
): PotentialBet => {
  const [potentialBet] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, runner.urn);

  const getExchangeLiabilityWithBonus = createGetExchangeLiabilityWithBonus();

  const liability = getExchangeLiabilityWithBonus(state, runner, marketId, marketType, bettingType);

  return {
    ...potentialBet,
    liability,
  };
};
