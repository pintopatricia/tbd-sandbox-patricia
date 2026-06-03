import { createAction } from "@reduxjs/toolkit";
import { FixtureUpdatesResult } from "../services/sports-content-api-service-mapper";
import URN from "../state/layout/URN";

export const SUBSCRIBE_FIXTURE_UPDATES = "SUBSCRIBE_FIXTURE_UPDATES";
export const UNSUBSCRIBE_FIXTURE_UPDATES = "UNSUBSCRIBE_FIXTURE_UPDATES";
export const NETWORK__FETCH_FIXTURE_UPDATES = "NETWORK/FETCH_FIXTURE_UPDATES";
export const NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS = "NETWORK/FETCH_FIXTURE_UPDATES_SUCCESS";
export const NETWORK__FETCH_FIXTURE_UPDATES_FAILURE = "NETWORK/FETCH_FIXTURE_UPDATES_FAILURE";

export type SubscribeFixtureUpdatesActionPayload = {
  urn: URN;
  typename: string;
  isLite?: boolean;
  isInplay?: boolean;
  includeStats?: boolean;
  includePlayers?: boolean;
  footballPlayerIds?: string[];
  includePlayerStats?: boolean;
  includeSubstitutions?: boolean;
};

export type SubscribeFixtureUpdatesAction = {
  type: typeof SUBSCRIBE_FIXTURE_UPDATES;
  payload: SubscribeFixtureUpdatesActionPayload;
};

export type UnsubscribeFixtureUpdatesActionPayload = {
  urn: URN;
  typename: string;
};

export type UnsubscribeFixtureUpdatesAction = {
  type: typeof UNSUBSCRIBE_FIXTURE_UPDATES;
  payload: UnsubscribeFixtureUpdatesActionPayload;
};

export type FetchFixtureUpdatesActionPayload = {
  urn: URN;
  inPlay: boolean;
};

export type FetchFixtureUpdatesAction = {
  type: typeof NETWORK__FETCH_FIXTURE_UPDATES;
  payload: FetchFixtureUpdatesActionPayload;
};

export type FetchFixtureUpdatesSuccessAction = {
  type: typeof NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS;
  payload: FixtureUpdatesResult;
};

export const fetchFixtureUpdatesSuccessAction = createAction<
  FixtureUpdatesResult,
  typeof NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS
>(NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS);

export type FetchFixtureUpdatesFailureAction = {
  type: typeof NETWORK__FETCH_FIXTURE_UPDATES_FAILURE;
  error: string;
};
