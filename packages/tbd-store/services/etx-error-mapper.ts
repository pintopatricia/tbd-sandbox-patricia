import {
  PlaceExecutionReport,
  UpdateExecutionReport,
  CancelExecutionReport,
  ReplaceExecutionReport,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";
import { EtxError, ExchangeBetTransactionErrorCode } from "../state/betting/ExchangeBetTransactionError.types";

const EXECUTION_REPORT_SUCCESS = "SUCCESS";
const INSTRUCTION_REPORT_SUCCESS = "SUCCESS";

const KNOWN_ERRORS: EtxError[] = [
  "BET_LAPSED_PRICE_IMPROVEMENT_TOO_LARGE",
  "BET_TAKEN_OR_LAPSED",
  "BONUS_NOT_AVAILABLE_FOR_BET_CONTEXT",
  "BONUS_WALLET_VALIDATION_FAILED",
  "CANCELLED_NOT_PLACED",
  "ERROR_IN_MATCHER",
  "ERROR_IN_ORDER",
  "INSUFFICIENT_BONUS_FUNDS",
  "INSUFFICIENT_FUNDS",
  "INVALID_BET_SIZE",
  "INVALID_MARKET_ID",
  "INVALID_PRICE_EDIT",
  "INVALID_RUNNER",
  "LOSS_LIMIT_EXCEEDED",
  "MARKET_NOT_OPEN_FOR_BETTING",
  "MARKET_NOT_OPEN_FOR_BSP_BETTING",
  "NO_CHASING",
  "RUNNER_REMOVED",
];

function isKnownError(errorCode: string): errorCode is EtxError {
  return KNOWN_ERRORS.includes(errorCode as EtxError);
}

type Instruction = {
  status: string;
  errorCode?: string;
};
function findInstructionWithError(list: Instruction[]): Instruction | undefined {
  return list.find((report) => report.status !== INSTRUCTION_REPORT_SUCCESS);
}

/**
 * try to find an error in the placeExecutionReport
 * returns null if there is no error
 * if the instruction(s) error is not specific (ERROR_IN_ORDER)
 * returns the placeExecutionReport error instead
 */
export default (
  placeExecutionReport: PlaceExecutionReport | UpdateExecutionReport | ReplaceExecutionReport | CancelExecutionReport,
): ExchangeBetTransactionErrorCode | null => {
  const { status, errorCode: executionErrorCode, instructionReports } = placeExecutionReport;

  const instructionError = instructionReports && findInstructionWithError(instructionReports);
  const { errorCode: instructionErrorCode } = instructionError || {};

  // great success
  if (status === EXECUTION_REPORT_SUCCESS && !instructionErrorCode) {
    return null;
  }

  if (instructionErrorCode && isKnownError(instructionErrorCode)) {
    return instructionErrorCode === "ERROR_IN_ORDER" && executionErrorCode && isKnownError(executionErrorCode)
      ? executionErrorCode
      : instructionErrorCode;
  }

  return "UNABLE_PLACE_BET";
};
