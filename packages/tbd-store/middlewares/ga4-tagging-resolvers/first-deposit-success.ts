import { FirstDepositSuccessEvent, buildFirstDepositSuccessEvent } from "tagging-library";
import { FirstDepositSuccessAction } from "../../actions/deposit";
import { getDepositSuccessEventObject } from "./helpers";

export const getFirstDepositSuccessEvent = (action: FirstDepositSuccessAction): FirstDepositSuccessEvent => {
  const { data } = action.payload;

  return buildFirstDepositSuccessEvent(getDepositSuccessEventObject(data));
};
