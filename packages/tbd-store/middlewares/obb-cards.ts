import { Middleware } from "redux";
import { ApplicationState } from "../state";
import {
  FetchObbEventParticipantsSuccessAction,
  NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
  OBB_CARD__SET_SQUADBET_MODAL_ERROR,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
  OBB_PARTICIPANTS_STATE_UPDATE,
  ObbParticipantsStateUpdateAction,
  ObbSetSquadBetModalErrorAction,
  ObbSetSquadVsSquadModalErrorAction,
} from "../actions/obb";
import { ObbGetEventParticipantsQuery } from "../clients/catalogue/catalogue-response-types";
import { ObbParticipants } from "../state/entities/obb-participants/ObbParticipants.types";
import { ERROR_CODES } from "../helpers/obb";
import { createCardByURNSelector } from "../state/layout/cards/cards-selectors";
import { ObbCards } from "../state/layout/cards/obb-card/ObbCard.types";
import URN from "../state/layout/URN";

type ActionTypes =
  | FetchObbEventParticipantsSuccessAction
  | ObbSetSquadBetModalErrorAction
  | ObbSetSquadVsSquadModalErrorAction;
const getCardByURN = createCardByURNSelector<ObbCards, URN>();

export const obbCardsMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action: ActionTypes) => {
    const state = getState();
    const {
      entities: { obbParticipants },
    } = state;
    const result = next(action);

    switch (action.type) {
      case NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS: {
        let participantsRemoved = false;
        const { eventParticipants, cardParticipants, requestInput, cardUrn } = action.payload;

        const typename = getCardByURN(state.layouts.cards.obbcards, cardUrn)?.typename;

        const eventParticipantMap = new Map<
          string,
          NonNullable<ObbGetEventParticipantsQuery["obb"]>["eventParticipants"][0]
        >();

        eventParticipants.forEach((participant) => {
          eventParticipantMap.set(participant.urn, participant);
        });

        // We loop only through the card participants, which are the ones we have full information available
        const updatedParticipants = cardParticipants.reduce<ObbParticipants>((acc, currUrn) => {
          const currentStateParticipant = obbParticipants[currUrn];

          if (!currentStateParticipant) {
            return acc;
          }

          // if the participant exists in the card and not on the eventParticipants response
          // this mean the player was removed from the catalog
          // remove incidentTypes from the participant
          if (!eventParticipantMap.has(currUrn)) {
            acc[currUrn] = {
              ...currentStateParticipant,
              incidentTypes: {},
            };

            participantsRemoved = true;

            return acc;
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newEventParticipantData = eventParticipantMap.get(currUrn)!;

          const participantIncidentTypesMap = new Map<
            string,
            NonNullable<ObbGetEventParticipantsQuery["obb"]>["eventParticipants"][0]["incidentTypes"][0]
          >();

          newEventParticipantData.incidentTypes.forEach((incidentType) => {
            participantIncidentTypesMap.set(incidentType.id, incidentType);
          });

          // if the participant previously had the incident type, and on the eventsParticipants response it does not
          // we remove the incident type from the participant
          if (
            obbParticipants[currUrn].incidentTypes[requestInput.incidentType] &&
            !participantIncidentTypesMap.has(requestInput.incidentType)
          ) {
            const currentIncidentTypes = currentStateParticipant.incidentTypes;
            const { [requestInput.incidentType]: _, ...restIncidentTypes } = currentIncidentTypes;

            acc[currUrn] = {
              ...currentStateParticipant,
              incidentTypes: restIncidentTypes,
            };

            participantsRemoved = true;

            return acc;
          }

          // otherwise, we add the incident types from the eventParticipants response
          acc[currUrn] = {
            ...currentStateParticipant,
            incidentTypes: {
              ...currentStateParticipant.incidentTypes,
              ...Object.fromEntries(participantIncidentTypesMap.entries()),
            },
          };

          return acc;
        }, {});

        if (participantsRemoved) {
          if (typename === "ObbSquadBetCard") {
            dispatch<ObbSetSquadBetModalErrorAction>({
              type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
              payload: { cardUrn, errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP },
            });
          } else if (typename === "ObbSquadVsSquadCard") {
            dispatch<ObbSetSquadVsSquadModalErrorAction>({
              type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
              payload: { cardUrn, errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP },
            });
          }
        }

        dispatch<ObbParticipantsStateUpdateAction>({
          type: OBB_PARTICIPANTS_STATE_UPDATE,
          payload: { participants: updatedParticipants },
        });

        break;
      }

      default:
        break;
    }

    return result;
  };
