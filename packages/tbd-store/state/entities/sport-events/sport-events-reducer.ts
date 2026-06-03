import { SportEvents } from "./SportEvent.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";
import { FetchFixtureUpdatesSuccessAction } from "../../../actions/fixture";

type ActionTypes = SportsbookMarketsSuccessAction | FetchCatalogueSuccessAction | FetchFixtureUpdatesSuccessAction;

/** **********************
 *  Sport Event reducer  *
 *********************** */
export default (currentState: undefined | SportEvents, action: ActionTypes): SportEvents => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      const sportEvents = action.payload.data.SportsEvent || [];

      return sportEvents.reduce<SportEvents>(
        (acc, sportEvent) => {
          const { urn, competition, eventId, openDate } = sportEvent;

          // Depending where we are, these fields should be kept as they are on store if update doesn't bring them
          const nonMandatoryFields = {
            competition: competition || state[urn]?.competition,
            eventId: eventId || state[urn]?.eventId,
            openDate: openDate || state[urn]?.openDate,
          };

          return {
            ...acc,
            [urn]: {
              ...state[urn],
              ...sportEvent,
              ...nonMandatoryFields,
            },
          };
        },
        { ...state },
      );
    }
    default:
      return state;
  }
};
