import { Middleware } from "redux";

import { RichContentUpdateCallbackPayload } from "./rich-content-updates-observable";
import { Observer } from "./http-poller/http-poller-observable";
import { PUSH, PushAction } from "../actions";
import {
  FetchFixtureUpdatesSuccessAction,
  NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS,
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "../actions/fixture";
import {
  SubscribeRaceUpdatesAction,
  UnsubscribeRaceUpdatesAction,
  SUBSCRIBE_RACE_UPDATES,
  UNSUBSCRIBE_RACE_UPDATES,
  FetchRaceUpdatesSuccessAction,
  NETWORK__FETCH_RACE_UPDATES_SUCCESS,
} from "../actions/race";

type Actions =
  | SubscribeFixtureUpdatesAction
  | UnsubscribeFixtureUpdatesAction
  | SubscribeRaceUpdatesAction
  | UnsubscribeRaceUpdatesAction
  | PushAction;

let richContentUpdatesObserver: Observer<RichContentUpdateCallbackPayload>;

export const richContentMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action: Actions) => {
    next(action); // foward the action for further processing

    const RichContentUpdatesObservable = await import(
      /* webpackChunkName: "rich-content-updates-observable" */ "./rich-content-updates-observable"
    ).then((module) => module.default);
    const richContentUpdatesObservable = RichContentUpdatesObservable.getInstance();

    // register subscriber to "richContentUpdatesObservable" which produces messages every time
    // there's and update from the polling mechanism
    if (!richContentUpdatesObserver) {
      richContentUpdatesObserver = (response) => {
        if (response.updates) {
          if (
            response.updates.fixtures.americanfootball ||
            response.updates.fixtures.basketball ||
            response.updates.fixtures.cricket ||
            response.updates.fixtures.football ||
            response.updates.fixtures.tabletennis ||
            response.updates.fixtures.tennis
          ) {
            dispatch<FetchFixtureUpdatesSuccessAction>({
              type: NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS,
              payload: response.updates.fixtures,
            });
          }
          if (response.updates.racesStatusAndResultType) {
            dispatch<FetchRaceUpdatesSuccessAction>({
              type: NETWORK__FETCH_RACE_UPDATES_SUCCESS,
              payload: response.updates.racesStatusAndResultType,
            });
          }
        }
      };

      richContentUpdatesObservable.subscribe(richContentUpdatesObserver);
    }

    switch (action.type) {
      case SUBSCRIBE_FIXTURE_UPDATES:
        richContentUpdatesObservable.addEvent(action.payload);
        break;
      case SUBSCRIBE_RACE_UPDATES:
        richContentUpdatesObservable.addEvent({
          typename: "Race",
          ...action.payload,
        });
        break;

      case UNSUBSCRIBE_FIXTURE_UPDATES:
      case UNSUBSCRIBE_RACE_UPDATES:
        richContentUpdatesObservable.removeEvent(action.payload.urn);
        break;
      case PUSH:
        richContentUpdatesObservable.resetEvents();
        break;

      default:
        break;
    }
  };
