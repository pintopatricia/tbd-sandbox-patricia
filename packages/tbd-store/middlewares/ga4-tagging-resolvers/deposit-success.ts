import { DepositSuccessEvent, buildDepositSuccessEvent } from "tagging-library";
import { DepositSuccessAction } from "../../actions/deposit";
import { getDepositSuccessEventObject } from "./helpers";

export const getDepositSuccessEvent = (action: DepositSuccessAction): DepositSuccessEvent => {
  const { data } = action.payload;

  return buildDepositSuccessEvent(getDepositSuccessEventObject(data));
};
