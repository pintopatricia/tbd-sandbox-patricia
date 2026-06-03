import { LiveOrderSummary } from "@flutter-global/uki-channels-http-clients/src/clients/LiveBetReporting/LiveBetReporting";
import { InstructionReport } from "./exchange-bet-service-mapper";
import { sanitizeBetId } from "./betting";

export default {
  mapResponseToInstructionReport(orders: LiveOrderSummary[]): InstructionReport {
    const order = orders[0];
    const { persistenceType, betId: lbrBetId, price, averagePriceMatched } = order;

    // All orders must be taken under the free bets scope. A free bet with 60€ size and 50€ of eligible
    // bonus wallet will return 2 orders, one with 50€ free bet and another with 10€ from main wallet
    const { totalSizeMatched, totalBonusSizeMatched, totalSizeUnmatched, totalBonusSizeUnmatched } = orders.reduce(
      (acc, betOrder) => ({
        totalSizeMatched: acc.totalSizeMatched + (betOrder.sizeMatched || 0),
        totalBonusSizeMatched: acc.totalBonusSizeMatched + (betOrder.isFreeBet ? betOrder.sizeMatched || 0 : 0),
        totalSizeUnmatched: acc.totalSizeUnmatched + (betOrder.sizeRemaining || 0),
        totalBonusSizeUnmatched: acc.totalBonusSizeUnmatched + (betOrder.isFreeBet ? betOrder.sizeRemaining || 0 : 0),
      }),
      {
        totalSizeMatched: 0,
        totalBonusSizeMatched: 0,
        totalSizeUnmatched: 0,
        totalBonusSizeUnmatched: 0,
      },
    );

    // This manipulation of betId is needed, since LBR still needs the product qualifier
    // we need to remove it, meanwhile there is a proposal to update the LBR ongoing
    const betId = sanitizeBetId(lbrBetId);

    // This is needed to use on cancelBet to cancel all unmatched bets
    const betIds = orders.map((lbrOrder) => sanitizeBetId(lbrOrder.betId));

    const matched = totalSizeMatched
      ? {
          matched: {
            size: totalSizeMatched,
            price: averagePriceMatched || price || 0,
            betId,
            persistenceType,
            totalBonusUsed: totalBonusSizeMatched,
          },
        }
      : {};

    const unmatched =
      totalSizeUnmatched > 0
        ? {
            unmatched: {
              price: price || 0,
              size: totalSizeUnmatched,
              betId,
              persistenceType,
              totalBonusUsed: totalBonusSizeUnmatched,
            },
          }
        : {};

    return {
      betIds,
      side: order.side,
      ...matched,
      ...unmatched,
    };
  },
};
