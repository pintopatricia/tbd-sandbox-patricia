import URN from "../state/layout/URN";

export const UI__RECEIPT_CLOSE = "UI/RECEIPT_CLOSE";

export type ReceiptCloseAction = {
  type: typeof UI__RECEIPT_CLOSE;
  payload: {
    entityURN: URN;
  };
};
