import produce from "immer";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { OBB_PARTICIPANTS_STATE_UPDATE, ObbParticipantsStateUpdateAction } from "../../../actions/obb";
import { ObbParticipants } from "./ObbParticipants.types";
import { getParticipantsFromCard } from "../../../helpers/obb";

type ActionTypes = FetchCatalogueSuccessAction | ObbParticipantsStateUpdateAction;

export default (currentState: undefined | ObbParticipants, action: ActionTypes): ObbParticipants => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbCards = [
        ...(action.payload.data.ObbPvpCard || []),
        ...(action.payload.data.ObbSquadBetCard || []),
        ...(action.payload.data.ObbCreatedBetsCard || []),
        ...(action.payload.data.ObbSquadVsSquadCard || []),
        ...(action.payload.data.ObbEventPopularsCard || []),
      ];

      return obbCards.reduce<ObbParticipants>(
        (acc, obbCard) => {
          const participants = getParticipantsFromCard(obbCard);

          if (!participants.length) {
            return acc;
          }

          participants.forEach((participant) => {
            acc[participant.urn] = currentState?.[participant.urn]
              ? {
                  ...participant,
                  incidentTypes: {
                    ...currentState[participant.urn].incidentTypes,
                  },
                }
              : participant;
          });

          return acc;
        },
        { ...state },
      );
    }

    case OBB_PARTICIPANTS_STATE_UPDATE: {
      const { payload } = action;

      return produce(state, (draft) => {
        Object.entries(payload.participants).forEach(([urn, participant]) => {
          draft[urn] = participant;
        });
      });
    }

    default:
      return state;
  }
};
