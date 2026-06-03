import { MessageCode, MessageType } from "../state/constants";

/**
 * Action types
 */
export const MESSAGING__ADD = "MESSAGING/ADD";
export const MESSAGING__REMOVE = "MESSAGING/REMOVE";
export const UI__MESSAGING_REMOVE = "UI/MESSAGING_REMOVE";

export type MessagingAddPayload = {
  title: string;
  description?: string;
  type: MessageType;
  code: MessageCode;
  icon?: string;
  iconCentered?: boolean;
};

export type MessagingRemovePayload = {
  code: MessageCode;
};

export type MessagingAdd = {
  type: typeof MESSAGING__ADD;
  payload: MessagingAddPayload;
};

export type MessagingRemove = {
  type: typeof MESSAGING__REMOVE;
  payload: MessagingRemovePayload;
};

export type MessagingUIRemove = {
  type: typeof UI__MESSAGING_REMOVE;
  payload: MessagingRemovePayload;
};
