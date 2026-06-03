export const PREDICTS_URL = "https://predicts.betfair.com";

export const PredictsMessageType = {
  Ready: "PREDICTS_READY",
  Exit: "PREDICTS_EXIT",
} as const;

export type PredictsMessageType = (typeof PredictsMessageType)[keyof typeof PredictsMessageType];

export type PredictsMessage = { type: PredictsMessageType };
