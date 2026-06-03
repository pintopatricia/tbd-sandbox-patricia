import { RaceStatusAndResultTypeUpdatesResult } from "../services/sports-content-api-service-mapper";
import URN from "../state/layout/URN";

export const SUBSCRIBE_RACE_UPDATES = "SUBSCRIBE_RACE_UPDATES";
export const UNSUBSCRIBE_RACE_UPDATES = "UNSUBSCRIBE_RACE_UPDATES";
export const NETWORK__FETCH_RACE_UPDATES = "NETWORK/FETCH_RACE_UPDATES";
export const NETWORK__FETCH_RACE_UPDATES_SUCCESS = "NETWORK/FETCH_RACE_UPDATES_SUCCESS";
export const NETWORK__FETCH_RACE_UPDATES_FAILURE = "NETWORK/FETCH_RACE_UPDATES_FAILURE";

export type SubscribeRaceUpdatesActionPayload = {
  urn: URN;
};

export type SubscribeRaceUpdatesAction = {
  type: typeof SUBSCRIBE_RACE_UPDATES;
  payload: SubscribeRaceUpdatesActionPayload;
};

export type UnsubscribeRaceUpdatesActionPayload = {
  urn: URN;
};

export type UnsubscribeRaceUpdatesAction = {
  type: typeof UNSUBSCRIBE_RACE_UPDATES;
  payload: UnsubscribeRaceUpdatesActionPayload;
};

export type FetchRaceUpdatesActionPayload = {
  urn: URN;
  inPlay: boolean;
};

export type FetchRaceUpdatesAction = {
  type: typeof NETWORK__FETCH_RACE_UPDATES;
  payload: FetchRaceUpdatesActionPayload;
};

export type FetchRaceUpdatesSuccessAction = {
  type: typeof NETWORK__FETCH_RACE_UPDATES_SUCCESS;
  payload: RaceStatusAndResultTypeUpdatesResult;
};

export type FetchRaceUpdatesFailureAction = {
  type: typeof NETWORK__FETCH_RACE_UPDATES_FAILURE;
  error: string;
};
