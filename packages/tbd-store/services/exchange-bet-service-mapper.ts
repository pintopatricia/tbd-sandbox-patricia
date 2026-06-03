import { calc, UnmatchedBet } from "@ppb/bet-engine";
import {
  PlaceExecutionReport,
  CancelExecutionReport,
  UpdateExecutionReport,
  ReplaceExecutionReport,
  PlaceInstructionReport,
  BetId,
  PersistenceType,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";
import { PlacedBetValues, CancelledBetValues } from "../state/betslip/Betslip.types";
import { ExchangeSide } from "../state/betting/exchange-bets/ExchangeBet.types";

function isMatchedBet(instructionReports: PlaceInstructionReport[]): boolean {
  return instructionReports.every(({ orderStatus }) => orderStatus === "EXECUTION_COMPLETE");
}

function isUnmatchedBet(instructionReports: PlaceInstructionReport[]): boolean {
  return instructionReports.every(({ orderStatus, sizeMatched }) => orderStatus === "EXECUTABLE" && sizeMatched === 0);
}

function getBonusSize(report: PlaceInstructionReport): number {
  if (report.bonusUsed) {
    return report.bonusUsed;
  }

  if (report.walletId) {
    return report.instruction.limitOrder?.size || 0;
  }

  return 0;
}

export type InstructionReport = {
  betIds?: string[];
  side: ExchangeSide;
  matched?: PlacedBetValues;
  unmatched?: PlacedBetValues;
  cancelled?: CancelledBetValues;
  availableBonus?: number;
};

type MarketInfo = {
  marketType: string;
  bettingType: string;
};

/**
 * Maps one UnmatchedBet to a PlaceInstructionReport in order to reuse all logic for the report generator
 *
 * @param unmatchedBet
 * @param betId
 * @param persistenceType
 * @param sizeCancelled
 * @param marketInfo
 *
 * @returns PlaceInstructionReport
 */
function mapUnmatchedBetToPlaceInstructionReport(
  unmatchedBet: UnmatchedBet,
  betId: BetId,
  sizeCancelled: number,
  persistenceType?: PersistenceType,
  marketInfo?: MarketInfo,
): PlaceInstructionReport {
  const { selectionId, handicap, size, price, orderType, side, bonus } = unmatchedBet;

  const placeInstruction = {
    selectionId,
    handicap,
    limitOrder: {
      size: size - sizeCancelled,
      price,
      persistenceType,
    },
    orderType,
    side,
  };

  return {
    status: "SUCCESS",
    orderStatus: "EXECUTABLE",
    instruction: placeInstruction,
    betId,
    averagePriceMatched: 0,
    sizeMatched: 0,
    bonusUsed: bonus
      ? calc.liability(
          side,
          placeInstruction.limitOrder.size,
          price,
          marketInfo?.bettingType || "",
          marketInfo?.marketType || "",
        )
      : undefined,
  };
}

/**
 * Builds an Exchange Betslip InstructionReport from a given ETX array of PlaceInstructionReport
 *
 * @param {PlaceInstructionReport[]} instructionReports
 *
 * @returns InstructionReport
 */
function buildInstructionReport(instructionReports: PlaceInstructionReport[]): InstructionReport {
  // - retrieve the betId from the 1st unmatched instruction?
  const [{ betId, instruction }] = instructionReports;

  // betIds to be used on LBR searchOrders
  const betIds = instructionReports.map(({ betId: id }) => id || "");

  if (!instruction.limitOrder) {
    throw new Error("limitOrder must be defined");
  }

  const { side, limitOrder } = instruction;
  const { persistenceType, price } = limitOrder;

  const hasMatchedParts = !isUnmatchedBet(instructionReports);
  const hasUnmatchedParts = !isMatchedBet(instructionReports);

  // All reports must be taken into account under the free bets scope. A free bet with 60€ size and 50€ of eligible
  // bonus wallet will return 2 instructions, one with 50€ free bet and another with 10€ from main wallet
  const { size, totalSizeMatched, bonusSize } = instructionReports.reduce(
    (acc, report) => ({
      size: acc.size + (report.instruction.limitOrder?.size || 0),
      totalSizeMatched: acc.totalSizeMatched + (report.sizeMatched || 0),
      bonusSize: acc.bonusSize + getBonusSize(report),
    }),
    {
      size: 0,
      totalSizeMatched: 0,
      bonusSize: 0,
    },
  );

  const totalSizeUnmatched = size - totalSizeMatched;

  const { averagePriceMatched } = instructionReports.find((report) => report.averagePriceMatched !== undefined) || {
    averagePriceMatched: undefined,
  };

  if (averagePriceMatched === undefined) {
    throw new Error("averagePriceMatched must be defined");
  }

  const matchedProps = hasMatchedParts
    ? {
        matched: { size: totalSizeMatched, price: averagePriceMatched, betId },
      }
    : {};

  const unmatchedBetsProps = hasUnmatchedParts
    ? {
        unmatched: {
          betId,
          size: totalSizeUnmatched,
          price,
          persistenceType,
        },
      }
    : {};

  return {
    side,
    betIds,
    ...matchedProps,
    ...unmatchedBetsProps,
    availableBonus: bonusSize,
  };
}

/**
 * Maps a PlaceExecutionReport into a InstructionReport
 *
 * @param {PlaceExecutionReport} executionReport
 *
 * @return InstructionReport
 */
export function mapPlaceExecutionToInstructionReport(executionReport: PlaceExecutionReport): InstructionReport {
  const { instructionReports } = executionReport;

  if (!instructionReports?.length) {
    throw new Error("instructionReports must be defined");
  }

  return buildInstructionReport(instructionReports);
}

/**
 * Maps a ReplaceExecutionReport into a InstructionReport
 *
 * @param {ReplaceExecutionReport} executionReport
 *
 * @return InstructionReport
 */
export function mapReplaceExecutionToInstructionReport(executionReport: ReplaceExecutionReport): InstructionReport {
  const { instructionReports } = executionReport;

  if (!instructionReports?.length) {
    throw new Error("instructionReports must be defined");
  }

  const [{ placeInstructionReport }] = instructionReports;

  if (!placeInstructionReport) {
    throw new Error("placeInstructionReport must be defined");
  }

  return buildInstructionReport([placeInstructionReport]);
}

/**
 * Maps a CancelExecutionReport into a InstructionReport
 *
 * @param {CancelExecutionReport} cancelReport
 * @param {UnmatchedBet[]} unmatchedBets
 * @param {PersistenceType} persistenceType
 * @param marketInfo
 *
 * @return InstructionReport
 */
export function mapCancelExecutionToInstructionReport(
  cancelReport: CancelExecutionReport,
  unmatchedBets: UnmatchedBet[],
  persistenceType?: PersistenceType,
  marketInfo?: MarketInfo,
): InstructionReport {
  const { instructionReports } = cancelReport;

  if (!instructionReports?.length) {
    throw new Error("instructionReports must be defined");
  }

  const sizeCancelled = instructionReports.reduce((size, report) => size + report.sizeCancelled, 0);

  const [{ price, side }] = unmatchedBets;

  const size = unmatchedBets.reduce((acc, bet) => acc + bet.size, 0);

  const isFullyCancelled = sizeCancelled === size;

  if (isFullyCancelled) {
    const totalBonusUsed = unmatchedBets.reduce((acc, bet) => acc + bet.bonus, 0);

    return {
      side,
      cancelled: {
        price,
        size,
        totalBonusUsed,
      },
    };
  }

  // A bet is not fully canceled only when the user edits an unmatched bet by reducing the stake size
  // Under the hood, this means that the existing unmatched bet was, in fact, replaced by a new bet
  // The edit button is only available when has only one bet
  const [{ instruction }] = instructionReports;

  const mappedPlaceInstruction: PlaceInstructionReport = mapUnmatchedBetToPlaceInstructionReport(
    unmatchedBets[0],
    instruction?.betId || "",
    sizeCancelled,
    persistenceType,
    marketInfo,
  );

  return buildInstructionReport([mappedPlaceInstruction]);
}

/**
 * Maps a UpdateExecutionReport into a InstructionReport
 *
 * @param {UpdateExecutionReport} executionReport
 * @param {UnmatchedBet} unmatchedBet
 * @param {MarketInfo} marketInfo
 *
 * @return InstructionReport
 */
export function mapUpdateExecutionToInstructionReport(
  executionReport: UpdateExecutionReport,
  unmatchedBet: UnmatchedBet,
  marketInfo?: MarketInfo,
): InstructionReport {
  const { instructionReports } = executionReport;

  if (!instructionReports?.length) {
    throw new Error("instructionReports must be defined");
  }

  const [{ instruction }] = instructionReports;

  const mappedPlaceInstruction: PlaceInstructionReport = mapUnmatchedBetToPlaceInstructionReport(
    unmatchedBet,
    instruction.betId,
    0, // sizeCancelled
    instruction.newPersistenceType,
    marketInfo,
  );

  return buildInstructionReport([mappedPlaceInstruction]);
}
