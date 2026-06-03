import { Races } from "./Race.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";
import { FetchRaceUpdatesSuccessAction, NETWORK__FETCH_RACE_UPDATES_SUCCESS } from "../../../actions/race";
import { RaceStatusAndResultTypeUpdateResult } from "../../../services/sports-content-api-service-mapper";
import URN from "../../layout/URN";

type ActionTypes = SportsbookMarketsSuccessAction | FetchCatalogueSuccessAction | FetchRaceUpdatesSuccessAction;

/** **********************
 *  Races reducer  *
 *********************** */
export default (currentState: undefined | Races, action: ActionTypes): Races => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      const races = action.payload.data.Race || [];

      return races.reduce((acc, race) => {
        // Some fragment don't request details so we shouldn't overwrite with nullish values
        const details = (race.details && { ...acc[race.urn]?.details, ...race.details }) || acc[race.urn]?.details;
        const runners = race.runners?.length ? race.runners : acc[race.urn]?.runners;
        const racingRunners = race.racingRunners?.length ? race.racingRunners : acc[race.urn]?.racingRunners;

        return {
          ...acc,
          [race.urn]: {
            ...state[race.urn],
            ...race,
            details,
            runners,
            racingRunners,
          },
        };
      }, state);
    }
    case NETWORK__FETCH_RACE_UPDATES_SUCCESS:
      if (!action.payload) return state;

      return Object.entries(action.payload).reduce<Races>(
        (acc, entry) => {
          const [urn, { status, resultType }]: [URN, RaceStatusAndResultTypeUpdateResult] = entry;

          if (!state[urn]) return acc;

          const { details } = state[urn];

          if (details) {
            return {
              ...acc,
              [urn]: {
                ...state[urn],
                details: {
                  ...details,
                  status,
                  resultType,
                },
              },
            };
          }

          return acc;
        },
        { ...state },
      );

    default:
      return state;
  }
};
