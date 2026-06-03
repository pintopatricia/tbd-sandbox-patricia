import { PYWDepositSuccessEvent } from "../state";

export const FIRST_DEPOSIT_SUCCESS = "NETWORK/FIRST_DEPOSIT_SUCCESS";
export const DEPOSIT_SUCCESS = "NETWORK/DEPOSIT_SUCCESS";
export const DEPOSIT_FLOW = "NETWORK/DEPOSIT_FLOW";

export type DepositSuccessAction = {
  type: typeof DEPOSIT_SUCCESS;
  payload: { data: PYWDepositSuccessEvent };
};

export type FirstDepositSuccessAction = {
  type: typeof FIRST_DEPOSIT_SUCCESS;
  payload: { data: PYWDepositSuccessEvent };
};

export type DepositFlowAction = {
  type: typeof DEPOSIT_FLOW;
  payload: { data: PYWDepositSuccessEvent; referrerLocation: string; message: string };
};
