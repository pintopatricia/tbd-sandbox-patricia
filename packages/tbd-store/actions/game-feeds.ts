import { FeedData } from "../state/entities";
import { PartialItem } from "../state/layout/views/PartialItem.types";

export const UPDATE_ROULETTE_LAST_NUMBERS = "UPDATE_ROULETTE_LAST_NUMBERS";
export const SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS = "SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS";
export const UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS = "UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS";

export const UPDATE_LAST_NUMBERS = "UPDATE_LAST_NUMBERS";
export const GAME_LAUNCH = "GAME_LAUNCH";

export type SubscribeToUpdateGameFeedResultsAction = {
  type: typeof SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS;
  payload: {
    urn: string;
    tableNames?: string[];
    endpoint: string;
    currencyCode: string;
  };
};

export type UnsubscribeToUpdateGameFeedResultsAction = {
  type: typeof UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS;
  payload: {
    urn: string;
    tableNames?: string[];
    endpoint: string;
    currencyCode: string;
  };
};

export type UpdateLastNumbersAction = {
  type: typeof UPDATE_LAST_NUMBERS;
  payload: {
    data: FeedData;
    urn: string;
  };
};

export type GameLaunchAction = {
  type: typeof GAME_LAUNCH;
  payload: PartialItem;
};
