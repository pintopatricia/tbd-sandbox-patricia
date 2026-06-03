import { Middleware } from "redux";
import { ApplicationState } from "../state/ApplicationState.types";
import { RaceStatusAndResultTypeUpdatesResult } from "../services/sports-content-api-service-mapper";
import { FetchRaceUpdatesSuccessAction, NETWORK__FETCH_RACE_UPDATES_SUCCESS } from "../actions/race";
import { RaceResultsCard } from "../state/layout/cards/Card.types";
import { FETCH_FULL_CARD, FetchFullCardAction } from "../actions";

type ActionTypes = FetchRaceUpdatesSuccessAction;

const getRaceResultsCardToFetch = (
  state: ApplicationState,
  racesStatusAndResultType: RaceStatusAndResultTypeUpdatesResult,
) =>
  Object.values(state.layouts.cards.raceresults).find(({ race: raceUrn }) => {
    if (!racesStatusAndResultType[raceUrn]?.resultType) {
      return false;
    }

    return racesStatusAndResultType[raceUrn].resultType === "QUICK_RESULT"
      ? !state.entities.races[raceUrn].details?.resultType
      : state.entities.races[raceUrn].details?.resultType !== "FULL_RESULT";
  });

export const raceResultsCardUpdatesMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const state = getState();

    if (action.type === NETWORK__FETCH_RACE_UPDATES_SUCCESS) {
      const racesStatusAndResultType = action.payload;

      const raceResultsCardToFetch: RaceResultsCard | undefined = getRaceResultsCardToFetch(
        state,
        racesStatusAndResultType,
      );

      if (raceResultsCardToFetch?.urn) {
        dispatch<FetchFullCardAction>({
          type: FETCH_FULL_CARD,
          payload: raceResultsCardToFetch.urn,
        });
      }
    }
    return next(action);
  };
