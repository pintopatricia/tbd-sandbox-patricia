import { ActionLike, ConfirmationCode } from "../state/confirmation/Confirmation.types";
import URN from "../state/layout/URN";

export const UI__ACTION_CONFIRMATION = "UI/ACTION_CONFIRMATION";
export const UI__REFUSE_CONFIRMATION = "UI/REFUSE_CONFIRMATION";
export const UI__ACCEPT_CONFIRMATION = "UI/ACCEPT_CONFIRMATION";

type ConfirmationActionPayload = {
  id: ConfirmationCode;
  cardUrn?: URN;
  eventName?: string;
  runnerUrn?: string;
  group?: string;
  refuseActions: ActionLike[];
  acceptActions: ActionLike[];
};

export type ConfirmationAction = {
  type: typeof UI__ACTION_CONFIRMATION;
  payload: ConfirmationActionPayload;
};

export type ConfirmationRefuse = {
  type: typeof UI__REFUSE_CONFIRMATION;
  payload: { clickedOutside: boolean };
};

export type ConfirmationAccept = {
  type: typeof UI__ACCEPT_CONFIRMATION;
};
