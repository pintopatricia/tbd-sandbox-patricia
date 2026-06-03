import { Sports } from "./Sport.types";
import {
  FetchCatalogueSuccessAction,
  FETCH_CATALOGUE_SUCCESS,
  NETWORK__SBK_MARKETS_SUCCESS,
  SportsbookMarketsSuccessAction,
} from "../../../actions/catalogue";

type ActionTypes = SportsbookMarketsSuccessAction | FetchCatalogueSuccessAction;

export default (currentState: undefined | Sports, action: ActionTypes): Sports => {
  const state = currentState || {};

  switch (action.type) {
    case NETWORK__SBK_MARKETS_SUCCESS:
    case FETCH_CATALOGUE_SUCCESS: {
      const sports = action.payload.data.Sport || [];

      return sports.reduce((acc, sport) => {
        const { urn } = sport;
        const shortName = sport.shortName || acc[urn]?.shortName;

        return {
          ...acc,
          [urn]: {
            ...state[urn],
            ...sport,
            // Not all fragments request the shortName, so we shouldn't overwrite it with null
            shortName,
          },
        };
      }, state);
    }
    default:
      return state;
  }
};
