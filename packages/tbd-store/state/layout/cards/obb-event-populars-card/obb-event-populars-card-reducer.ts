import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../../actions/catalogue";
import { ObbEventPopularsCards } from "./ObbEventPopularsCard.types";

type ActionTypes = FetchCatalogueSuccessAction;

export default (currentState: undefined | ObbEventPopularsCards, action: ActionTypes): ObbEventPopularsCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbEventPopularsCards = action.payload.data.ObbEventPopularsCard;
      if (!obbEventPopularsCards) {
        return state;
      }

      return obbEventPopularsCards.reduce<ObbEventPopularsCards>(
        (acc, obbEventPopularsCard): ObbEventPopularsCards => {
          if (obbEventPopularsCard.popularBettingOpportunities.length) {
            acc[obbEventPopularsCard.urn] = {
              ...obbEventPopularsCard,
              popularBettingOpportunities: obbEventPopularsCard.popularBettingOpportunities.map((opportunity) => ({
                ...opportunity,
                participants: opportunity.participants.map((participant) => participant.urn),
                legId: opportunity.leg.id,
              })),
            };
          }
          return acc;
        },
        { ...state },
      );
    }

    default:
      return state;
  }
};
