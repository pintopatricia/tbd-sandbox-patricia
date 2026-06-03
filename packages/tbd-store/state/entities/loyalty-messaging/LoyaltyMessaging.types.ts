import { TopicMessage } from "@ppb/onsite-gateway-client";

export type RelevantMessagingMessage = {
  urn: string;
  displayType: string;
  template: {
    header: string;
    text: string;
  };
  params: {
    [k: string]: string;
  };
  [k: string]: unknown;
};

export type SubscriptionMessage = {
  subscriptionId: string;
  topic: string;
  [k: string]: unknown;
};

export type LoyaltyMessageToastTemplate = {
  header: string;
  text: string;
  icon: string;
};

export type LoyaltyMessageFullScreenTemplate = {
  header: string;
  text: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  imageAlt?: string;
  tcText?: string;
  tcUrl?: string;
};

export type LoyaltyMessageTemplate = LoyaltyMessageToastTemplate | LoyaltyMessageFullScreenTemplate;

export type LoyaltyMessage = {
  content: TopicMessage;
  acknowledged: boolean;
  isDisplayed: boolean;
};

export type LoyaltyMessagingState = {
  messages: LoyaltyMessage[];
};
