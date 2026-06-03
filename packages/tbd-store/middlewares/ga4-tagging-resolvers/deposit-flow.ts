import { DepositFlowEvent, buildDepositFlowEvent } from "tagging-library";
import { DepositFlowAction } from "../../actions/deposit";

export const getDepositFlowEvent = (action: DepositFlowAction): DepositFlowEvent => {
  const { data, referrerLocation, message } = action.payload;

  const {
    payload: { currency, deposited, methodType },
  } = data;

  return buildDepositFlowEvent({
    action: message,
    elementText: "null",
    value: deposited,
    paymentTransactionMethod: methodType,
    referrerModule: "betslip",
    referrerLocation,
    currency,
  });
};
