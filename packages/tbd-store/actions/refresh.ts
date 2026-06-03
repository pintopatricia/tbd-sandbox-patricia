import URN from "../state/layout/URN";

export const START_REFRESH_CARD = "START_REFRESH_CARD";
export const STOP_REFRESH_CARD = "STOP_REFRESH_CARD";

export type StartRefreshCardAction = {
  type: typeof START_REFRESH_CARD;
  payload: URN;
};

export type StopRefreshCardAction = {
  type: typeof STOP_REFRESH_CARD;
  payload: URN;
};
