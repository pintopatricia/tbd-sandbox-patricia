import { ExchangeMarketStatus } from "../clients/catalogue/catalogue-response-types";
import { SportsbookRunnerStatus, SportsbookMarketStatus } from "../state";

/**
 * Transforms a status (string) from getByMarkets into an enum from ExchangeMarketStatus
 * @param status Market status from ERO
 *
 * @returns The market status of the exchange market
 */
function getExchangeMarketStatus(status: string): ExchangeMarketStatus {
  if (status === "CLOSED") {
    return ExchangeMarketStatus.Closed;
  }

  if (status === "SUSPENDED") {
    return ExchangeMarketStatus.Suspended;
  }

  return ExchangeMarketStatus.Open;
}

/**
 * Transforms a status (string) from getMarketPrices into an enum from SportsbookRunnerStatus
 * @param status Runners status from smp
 *
 * @returns The runners status of the sportsbook market runner
 */
function getSportsbookRunnerStatus(status: string): SportsbookRunnerStatus {
  if (status === "SUSPENDED") {
    return "SUSPENDED";
  }

  if (status === "REMOVED") {
    return "REMOVED";
  }

  return "ACTIVE";
}

/**
 * Transforms a status (string) from getMarketPrices into an enum from SportsbookMarketStatus
 * @param status Market status from ERO
 *
 * @returns The market status of the exchange market
 */
function getSportsbookMarketStatus(status: string): SportsbookMarketStatus {
  return status === "SUSPENDED" ? "SUSPENDED" : "OPEN";
}

export { getSportsbookMarketStatus, getSportsbookRunnerStatus, getExchangeMarketStatus };
