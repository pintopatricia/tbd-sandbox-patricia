// eslint-disable-next-line import/no-extraneous-dependencies
import {
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
  OBB_CARD__FETCH_SQUADBET_QUOTES,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
  OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
  ObbToggleSquadBetModalParticipantAction,
  OBB_CARD__SET_SQUADBET_MODAL_ERROR,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
  OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
} from "@ppb/tbd-store/actions/obb";
import catalogueService from "../services/catalogue/catalogue-service";
import { SquadBetQuotesRequestInput, Supplier } from "../clients/catalogue/catalogue-response-types";
import { buildValuesRange, ERROR_CODES, getHighestPriorityError } from "../helpers/obb";
import { SelectorSquadBetCardWithModalFields } from "../state/layout/cards/obb-card/ObbCard.types";
import { createObbSquadBetCardWithModalFieldsByURNSelector } from "../state/layout/cards/obb-card/obb-card-selectors";
import { ObbQuoteError } from "../state/entities/obb-legs/ObbLegs.types";
import { ThrottleOverrides } from "../state";
import { ObbCardStrategy } from "./obb-saga-strategy";
import { ObbQuotesRequest, ObbSquadBetQuotesResponse, QuotesApiFn } from "./obb-saga-strategy.types";

const SQUADBET_QUANTIFIER = "AT_LEAST";
const SQUADBET_TIME_PERIOD = "MATCH";

const getObbSquadBetCardByURN = createObbSquadBetCardWithModalFieldsByURNSelector();

export const SquadBetStrategy: ObbCardStrategy = {
  getEventParticipantsAction: (cardUrn, eventUrn, incidentType) => ({
    type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
    payload: {
      cardUrn,
      event: eventUrn,
      incidentType,
      period: SQUADBET_TIME_PERIOD,
    },
  }),
  updateParticipantsAction: (cardUrn, isModal) => ({
    type: isModal ? OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS : OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
    payload: { cardUrn },
  }),
  setModalDefaultStateAction: (cardUrn) => ({
    type: OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
    payload: { cardUrn },
  }),
  setModalErrorAction: (cardUrn, errors, modalError) => ({
    type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
    payload: {
      cardUrn,
      errorCode: getHighestPriorityError(errors, modalError),
    },
  }),
  setPlayerRemovedModalErrorAction: (cardUrn, errors, modalError) =>
    SquadBetStrategy.setModalErrorAction(
      cardUrn,
      [
        ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP,
        ...errors.filter((error) => error !== ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND),
      ],
      modalError,
    ),
  clearModalErrorAction: (cardUrn) => ({
    type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
    payload: {
      cardUrn,
    },
  }),
  setQuotesIsLoadingAction: (cardUrn, isLoadingQuotes) => ({
    type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
    payload: { cardUrn, isLoadingQuotes },
  }),
  fetchQuotesAction: (cardUrn, isModal) => ({
    type: isModal ? OBB_CARD__FETCH_SQUADBET_QUOTES : OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
    payload: { cardUrn },
  }),
  fetchQuotesSuccessAction: (cardUrn, isModal, quotes: ObbSquadBetQuotesResponse | undefined) => ({
    type: isModal ? NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS : NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
    payload: {
      cardUrn,
      obbQuotes: quotes?.legs || [],
      defaultOutcomeIndex: quotes?.defaultOutcomeIndex || 0,
    },
  }),
  fetchQuotesFailureAction: (error, isModal) => ({
    type: isModal ? NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE : NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
    payload: { error },
  }),
  updateParticipantsSuccessAction: (cardUrn, isModal, newParticipants: string[]) => ({
    type: isModal
      ? OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS
      : OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
    payload: {
      cardUrn,
      participants: newParticipants,
    },
  }),
  toggleModalParticipantAction: (
    card: SelectorSquadBetCardWithModalFields,
    action: ObbToggleSquadBetModalParticipantAction,
  ) => {
    const { cardUrn, participantUrn } = action.payload;
    const currentModalParticipants = card.modalParticipants.map((participant) => participant.urn);
    const newModalParticipants = currentModalParticipants.includes(participantUrn)
      ? currentModalParticipants.filter((urn) => urn !== participantUrn)
      : [...currentModalParticipants, participantUrn];
    return SquadBetStrategy.updateParticipantsSuccessAction(cardUrn, true, newModalParticipants);
  },
  getParticipants: (card: SelectorSquadBetCardWithModalFields, isModal) =>
    (isModal ? card.modalParticipants : card.squadParticipants)
      .filter((participant) => participant.incidentTypes[card.incidentType])
      .map((participant) => participant.urn),
  hasParticipantsChanged: (card: SelectorSquadBetCardWithModalFields, isModal, newParticipants: string[]) =>
    (isModal ? card.modalParticipants.length : card.squadParticipants.length) !== newParticipants.length,
  hasEmptyParticipants: (card: SelectorSquadBetCardWithModalFields, isModal) =>
    isModal ? !card.modalParticipants.length : !card.squadParticipants.length,
  getObbQuotesRequestInput: (card: SelectorSquadBetCardWithModalFields, isModal) => {
    const { incidentType, sportevent } = card;
    const participants = isModal ? card.modalParticipants : card.squadParticipants;
    const valuesRange = buildValuesRange(participants, incidentType);

    return {
      eventId: {
        id: sportevent.eventId.toString(),
        supplier: Supplier.Sportex,
      },
      incidentTypeId: incidentType,
      participantIds: participants
        .filter((participant) => !!participant.player?.id)
        .map((participant) => participant.player?.id as string),
      quantifier: SQUADBET_QUANTIFIER,
      timePeriodId: SQUADBET_TIME_PERIOD,
      valuesRange,
    };
  },
  getCardWithModalFields: (state, cardUrn) => getObbSquadBetCardByURN(state, cardUrn),
  getQuotesApi: (): QuotesApiFn => async (req: ObbQuotesRequest, throttleOverrides?: ThrottleOverrides) => {
    const response = await catalogueService.getObbSquadbetQuotes(req as SquadBetQuotesRequestInput, throttleOverrides);
    return response;
  },
  getQuotesErrors: (quotes: ObbSquadBetQuotesResponse) =>
    quotes.legs.filter((leg) => "errorCode" in leg.quote).map((leg) => (leg.quote as ObbQuoteError).errorCode),
};
