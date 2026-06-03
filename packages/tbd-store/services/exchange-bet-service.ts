import { ExchangeTransactional } from "@flutter-global/uki-channels-http-clients";
import {
  PlaceInstruction,
  UpdateInstruction,
  CancelInstruction,
  ReplaceInstruction,
  PlaceExecutionReport,
  UpdateExecutionReport,
  CancelExecutionReport,
  ReplaceExecutionReport,
  ImplyExecutionReport,
} from "@flutter-global/uki-channels-http-clients/src/clients/ExchangeTransactional/ExchangeTransactional";
import resolveEtxError from "./etx-error-mapper";
import { createClientFactory } from "./client-factory";
import { MarketId } from "../state/entities/Common.types";
import { ExchangeBetTransactionError } from "../state/betting/ExchangeBetTransactionError.types";

const exchangeTransactionalFactory = createClientFactory(ExchangeTransactional);

const FALLBACK_ERROR: ExchangeBetTransactionError = {
  errorCode: "UNABLE_PLACE_BET",
};

type InstructionDetails = {
  price?: number;
  size?: number;
};

function throwOnEtxError(
  executionReport:
    | PlaceExecutionReport
    | UpdateExecutionReport
    | ReplaceExecutionReport
    | CancelExecutionReport
    | ImplyExecutionReport,
  details?: InstructionDetails,
): void {
  const errorCode = resolveEtxError(executionReport);
  if (errorCode !== null) {
    const rejection: ExchangeBetTransactionError = {
      errorCode,
      details,
    };
    throw rejection;
  }
}

export const implyBet = async (marketId: MarketId): Promise<ImplyExecutionReport> => {
  const exchangeTransactional = exchangeTransactionalFactory("ETX");

  let response;
  try {
    response = await exchangeTransactional.imply(marketId);
  } catch {
    throw FALLBACK_ERROR;
  }

  throwOnEtxError(response);
  return response;
};

export const placeBet = async (
  instruction: PlaceInstruction,
  marketId: MarketId,
  instructionDetails: InstructionDetails,
  placeOptions: {
    useAvailableBonus: boolean;
  },
): Promise<PlaceExecutionReport> => {
  const exchangeTransactional = exchangeTransactionalFactory("ETX");

  let response;
  try {
    response = await exchangeTransactional.place([instruction], marketId, placeOptions);
  } catch {
    throw FALLBACK_ERROR;
  }

  throwOnEtxError(response, instructionDetails);
  return response;
};

export const updateBet = async (instruction: UpdateInstruction, marketId: MarketId): Promise<UpdateExecutionReport> => {
  const exchangeTransactional = exchangeTransactionalFactory("ETX");

  let response;
  try {
    response = await exchangeTransactional.update([instruction], marketId, {});
  } catch {
    throw FALLBACK_ERROR;
  }

  throwOnEtxError(response);
  return response;
};

export const cancelBet = async (
  instructions: CancelInstruction[],
  marketId: MarketId,
): Promise<CancelExecutionReport> => {
  const exchangeTransactional = exchangeTransactionalFactory("ETX");

  let response;
  try {
    response = await exchangeTransactional.cancel({ instructions, marketId });
  } catch {
    throw FALLBACK_ERROR;
  }

  throwOnEtxError(response);
  return response;
};

export const replaceBet = async (
  instruction: ReplaceInstruction,
  marketId: MarketId,
  instructionDetails: InstructionDetails,
): Promise<ReplaceExecutionReport> => {
  const exchangeTransactional = exchangeTransactionalFactory("ETX");

  let response;
  try {
    response = await exchangeTransactional.replace([instruction], marketId, {});
  } catch {
    throw FALLBACK_ERROR;
  }

  throwOnEtxError(response, instructionDetails);
  return response;
};
