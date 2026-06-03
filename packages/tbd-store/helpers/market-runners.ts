import { ExchangeRunner, SportsbookRunner } from "../state/entities";

/**
 * An exchange runner has updates if the number of back prices changes, the number of lay prices
 * changes, the price or liquidity of a back or lay price object changes
 *
 * @param runner - Old runner
 * @param updatedRunner - New runner
 * @returns {boolean} true if the runner has updates and should be updated
 */
function exchangeRunnerHasUpdates(runner: ExchangeRunner, updatedRunner: ExchangeRunner): boolean {
  // if the number of back prices changes
  if (runner.back && updatedRunner.back && runner.back.length !== updatedRunner.back.length) {
    return true;
  }

  // if the number of lay prices changes
  if (runner.lay && updatedRunner.lay && runner.lay.length !== updatedRunner.lay.length) {
    return true;
  }

  // if the price or liquidity of any back price changes
  if (runner.back && updatedRunner.back) {
    for (let i = 0; i < runner.back.length; i += 1) {
      if (
        runner.back[i].price !== updatedRunner.back[i].price ||
        runner.back[i].liquidity !== updatedRunner.back[i].liquidity
      ) {
        return true;
      }
    }
  }

  // if the price or liquidity of any lay price changes
  if (runner.lay && updatedRunner.lay) {
    for (let i = 0; i < runner.lay.length; i += 1) {
      if (
        runner.lay[i].price !== updatedRunner.lay[i].price ||
        runner.lay[i].liquidity !== updatedRunner.lay[i].liquidity
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * A sportsbook runner has updates if the odds are added or removed, if the decimal odds changes
 * or if the runner status changes
 *
 * @param runner - Old runner
 * @param updatedRunner - New runner
 * @returns {boolean} true if the runner has updates and should be updated
 */
function sportsbookRunnerStatusHasUpdates(runner: SportsbookRunner, updatedRunner: SportsbookRunner): boolean {
  // if the runner status changed
  if (runner.status !== updatedRunner.status) {
    return true;
  }

  return false;
}

/**
 * An exchange runner has prices updates (Back or Lay)
 * @param runner - Old runner
 * @param updatedRunner - New Runner
 * @returns {boolean} true if runner prices has updates
 */
function exchangeRunnerPricesHasUpdates(runner: ExchangeRunner, updatedRunner: ExchangeRunner): boolean {
  // if the price of any back price changes
  if (runner.back && updatedRunner.back) {
    for (let i = 0; i < runner.back.length; i += 1) {
      if (runner.back[i].price !== updatedRunner.back[i].price) {
        return true;
      }
    }
  }

  // if the price of any lay price changes
  if (runner.lay && updatedRunner.lay) {
    for (let i = 0; i < runner.lay.length; i += 1) {
      if (runner.lay[i].price !== updatedRunner.lay[i].price) {
        return true;
      }
    }
  }

  return false;
}

export { exchangeRunnerHasUpdates, sportsbookRunnerStatusHasUpdates, exchangeRunnerPricesHasUpdates };
