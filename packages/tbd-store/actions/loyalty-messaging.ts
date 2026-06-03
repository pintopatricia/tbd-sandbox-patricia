import { TopicMessage } from "@ppb/onsite-gateway-client";

export const LOYALTY__RECEIVE_MESSAGE = "LOYALTY/RECEIVE_MESSAGE";
export const LOYALTY__ACKNOWLEDGE_MESSAGE = "LOYALTY/ACKNOWLEDGE_MESSAGE";
export const LOYALTY__DISMISS_MESSAGE = "LOYALTY/DISMISS_MESSAGE";

export type ReceiveLoyaltyMessageAction = {
  type: typeof LOYALTY__RECEIVE_MESSAGE;
  payload: {
    content: TopicMessage;
    acknowledged: boolean;
    isDisplayed: boolean;
  };
};

export type AcknowledgeLoyaltyMessageAction = {
  type: typeof LOYALTY__ACKNOWLEDGE_MESSAGE;
  payload: TopicMessage;
};

export type DismissLoyaltyMessageAction = {
  type: typeof LOYALTY__DISMISS_MESSAGE;
  payload: TopicMessage;
};
