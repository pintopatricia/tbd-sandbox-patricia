export type EtxError =
  | "BET_LAPSED_PRICE_IMPROVEMENT_TOO_LARGE"
  | "BET_TAKEN_OR_LAPSED"
  | "BONUS_NOT_AVAILABLE_FOR_BET_CONTEXT"
  | "BONUS_WALLET_VALIDATION_FAILED"
  | "CANCELLED_NOT_PLACED"
  | "ERROR_IN_MATCHER"
  | "ERROR_IN_ORDER"
  | "INSUFFICIENT_BONUS_FUNDS"
  | "INSUFFICIENT_FUNDS"
  | "INVALID_BET_SIZE"
  | "INVALID_MARKET_ID"
  | "INVALID_PRICE_EDIT"
  | "INVALID_RUNNER"
  | "LOSS_LIMIT_EXCEEDED"
  | "MARKET_NOT_OPEN_FOR_BETTING"
  | "MARKET_NOT_OPEN_FOR_BSP_BETTING"
  | "NO_CHASING"
  | "RUNNER_REMOVED";

type UnknownBetTransactionError = "UNABLE_PLACE_BET";

export type ExchangeBetTransactionErrorCode = EtxError | UnknownBetTransactionError;

export type ExchangeBetTransactionError = {
  errorCode: ExchangeBetTransactionErrorCode;
  details?: {
    price?: number;
    size?: number;
  };
};
