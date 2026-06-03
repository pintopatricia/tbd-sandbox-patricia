// eslint-disable-next-line import/no-extraneous-dependencies
import {
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING,
  OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES,
  ObbToggleSquadVsSquadModalParticipantAction,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS,
  OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE,
  OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
} from "@ppb/tbd-store/actions/obb";
import catalogueService from "../services/catalogue/catalogue-service";
import { ObbQuotesQuery, QuotesRequestInput, Supplier } from "../clients/catalogue/catalogue-response-types";
import {
  buildCardQuoteInputSquadVsSquadLegs,
  buildObbQuote,
  buildUnquotedLegsForSquadVsSquad,
  ERROR_CODES,
  getHighestPriorityError,
} from "../helpers/obb";
import { SelectorSquadVsSquadCardWithModalFields } from "../state/layout/cards/obb-card/ObbCard.types";
import { createObbSquadVsSquadCardWithModalFieldsByURNSelector } from "../state/layout/cards/obb-card/obb-card-selectors";
import { ObbLeg, ObbLegTemplateId } from "../state/entities/obb-legs/ObbLegs.types";
import { ThrottleOverrides } from "../state";
import { ObbCardStrategy } from "./obb-saga-strategy";
import { ObbQuotesRequest, QuotesApiFn } from "./obb-saga-strategy.types";

const SQUADVSSQUAD_TEMPLATE_ID: ObbLegTemplateId = "squadVsSquad";
const SQUADVSSQUAD_QUANTIFIER_FIRST_SQUAD_WIN = "GREATER_THAN";
const SQUADVSSQUAD_QUANTIFIER_SECOND_SQUAD_WIN = "LESS_THAN";
const SQUADVSSQUAD_TIME_PERIOD = "MATCH";

const getObbSquadVsSquadCardByURN = createObbSquadVsSquadCardWithModalFieldsByURNSelector();

const SQUADVSSQUAD_ERROR_TYPES = [
  "IMPOSSIBLE_OBB_CHOICE",
  "EVENT_SUSPENDED",
  "OUTCOME_DEFINITION_SUSPENDED",
  "OUTCOME_DEFINITION_NOT_FOUND",
  "INVALID_BET_DEFINITION",
  "GENERAL_FAILURE",
];

export const SquadVsSquadStrategy: ObbCardStrategy = {
  getEventParticipantsAction: (cardUrn, eventUrn, incidentType) => ({
    type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
    payload: {
      cardUrn,
      event: eventUrn,
      incidentType,
      period: SQUADVSSQUAD_TIME_PERIOD,
    },
  }),
  updateParticipantsAction: (cardUrn, isModal) => ({
    type: isModal
      ? OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS
      : OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS,
    payload: { cardUrn },
  }),
  setModalDefaultStateAction: (cardUrn) => ({
    type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE,
    payload: { cardUrn },
  }),
  setModalErrorAction: (cardUrn, errors, modalError) => ({
    type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
    payload: {
      cardUrn,
      errorCode: getHighestPriorityError(errors, modalError),
    },
  }),
  setPlayerRemovedModalErrorAction: (cardUrn, errors, modalError) =>
    SquadVsSquadStrategy.setModalErrorAction(
      cardUrn,
      [ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP, ...errors.filter((error) => !SQUADVSSQUAD_ERROR_TYPES.includes(error))],
      modalError,
    ),
  clearModalErrorAction: (cardUrn) => ({
    type: OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
    payload: {
      cardUrn,
    },
  }),
  setQuotesIsLoadingAction: (cardUrn, isLoadingQuotes) => ({
    type: NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING,
    payload: { cardUrn, isLoadingQuotes },
  }),
  fetchQuotesAction: (cardUrn, isModal) => ({
    type: isModal ? OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES : OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES,
    payload: { cardUrn },
  }),
  fetchQuotesSuccessAction: (cardUrn, isModal, quotes?: ObbQuotesQuery, obbLegs?: ObbLeg[]) => {
    const prices = quotes?.obb?.quotes.prices ?? [];

    const legs: ObbLeg[] = (obbLegs || []).flatMap((leg, idx) =>
      prices[idx] ? [{ ...leg, quote: buildObbQuote(prices[idx]) }] : [],
    );

    return {
      type: isModal
        ? NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS
        : NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
      payload: {
        cardUrn,
        legs,
      },
    };
  },
  fetchQuotesFailureAction: (error, isModal) => ({
    type: isModal
      ? NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE
      : NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE,
    payload: { error },
  }),
  updateParticipantsSuccessAction: (cardUrn, isModal, newParticipants: [string[], string[]]) => ({
    type: isModal
      ? OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS
      : OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS,
    payload: {
      cardUrn,
      firstSquadParticipants: newParticipants[0],
      secondSquadParticipants: newParticipants[1],
    },
  }),
  toggleModalParticipantAction: (
    card: SelectorSquadVsSquadCardWithModalFields,
    action: ObbToggleSquadVsSquadModalParticipantAction,
  ) => {
    const { cardUrn, participantUrn, selectedSquadId } = action.payload;
    const firstSquadModalParticipantIds = card.firstSquadModalParticipants.map((participant) => participant.urn);
    const secondSquadModalParticipantIds = card.secondSquadModalParticipants.map((participant) => participant.urn);
    const toggleUrn = (list: string[], urn: string) =>
      list.includes(urn) ? list.filter((u) => u !== urn) : [...list, urn];

    const newFirstSquadModalParticipantIds =
      selectedSquadId === "1"
        ? toggleUrn(firstSquadModalParticipantIds, participantUrn)
        : firstSquadModalParticipantIds;

    const newSecondSquadModalParticipantIds =
      selectedSquadId === "2"
        ? toggleUrn(secondSquadModalParticipantIds, participantUrn)
        : secondSquadModalParticipantIds;

    return SquadVsSquadStrategy.updateParticipantsSuccessAction(cardUrn, true, [
      newFirstSquadModalParticipantIds,
      newSecondSquadModalParticipantIds,
    ]);
  },
  getParticipants: (card: SelectorSquadVsSquadCardWithModalFields, isModal) => {
    const newFirstSquadParticipants = (isModal ? card.firstSquadModalParticipants : card.firstSquadParticipants)
      .filter((participant) => participant.incidentTypes[card.incidentType])
      .map((participant) => participant.urn);
    const newSecondSquadParticipants = (isModal ? card.secondSquadModalParticipants : card.secondSquadParticipants)
      .filter((participant) => participant.incidentTypes[card.incidentType])
      .map((participant) => participant.urn);
    return [newFirstSquadParticipants, newSecondSquadParticipants];
  },
  hasParticipantsChanged: (
    card: SelectorSquadVsSquadCardWithModalFields,
    isModal,
    newParticipants: [string[], string[]],
  ) =>
    (isModal ? card.firstSquadModalParticipants.length : card.firstSquadParticipants.length) !==
      newParticipants[0].length ||
    (isModal ? card.secondSquadModalParticipants.length : card.secondSquadParticipants.length) !==
      newParticipants[1].length,
  hasEmptyParticipants: (card: SelectorSquadVsSquadCardWithModalFields, isModal) =>
    isModal
      ? !card.firstSquadModalParticipants.length || !card.secondSquadModalParticipants.length
      : !card.firstSquadParticipants.length || !card.secondSquadParticipants.length,
  getObbQuotesRequestInput: (card: SelectorSquadVsSquadCardWithModalFields, _, obbLegs) => {
    const { sportevent, eventParticipants } = card;

    const unquotedLegs = buildCardQuoteInputSquadVsSquadLegs(obbLegs || [], eventParticipants);

    return {
      eventId: {
        id: sportevent.eventId.toString(),
        supplier: Supplier.Sportex,
      },
      toQuote: unquotedLegs,
    };
  },
  getCardWithModalFields: (state, cardUrn) => getObbSquadVsSquadCardByURN(state, cardUrn),
  getQuotesApi: (): QuotesApiFn => async (req: ObbQuotesRequest, throttleOverrides?: ThrottleOverrides) => {
    const response = await catalogueService.getObbQuotes(req as QuotesRequestInput, throttleOverrides);
    return response;
  },
  getQuotesErrors: (quotes: ObbQuotesQuery) =>
    quotes.obb?.quotes.prices
      .filter((price) => price.result.resultCode !== "SUCCESS")
      .map((price) => price.result.resultCode) || [],
  filterNewModalErrors: (modalErrors, quotes: ObbQuotesQuery) => {
    const totalLegs = (quotes.obb?.quotes.prices || []).length;

    // only display these error messages if all legs contain the same error
    return SQUADVSSQUAD_ERROR_TYPES.reduce(
      (errors, errorType) => {
        const allSameError = errors.length === totalLegs && errors.every((err) => err === errorType);
        return allSameError ? errors : errors.filter((err) => err !== errorType);
      },
      [...modalErrors],
    );
  },
  buildUnquotedLegs: (card: SelectorSquadVsSquadCardWithModalFields, isModal) => {
    const { incidentType, sportevent } = card;

    const firstSquadParticipants = isModal ? card.firstSquadModalParticipants : card.firstSquadParticipants;
    const secondSquadParticipants = isModal ? card.secondSquadModalParticipants : card.secondSquadParticipants;

    const firstSquadLeg = buildUnquotedLegsForSquadVsSquad(
      firstSquadParticipants,
      secondSquadParticipants,
      incidentType,
      SQUADVSSQUAD_QUANTIFIER_FIRST_SQUAD_WIN,
      SQUADVSSQUAD_TIME_PERIOD,
      SQUADVSSQUAD_TEMPLATE_ID,
      sportevent,
    );
    const secondSquadLeg = buildUnquotedLegsForSquadVsSquad(
      firstSquadParticipants,
      secondSquadParticipants,
      incidentType,
      SQUADVSSQUAD_QUANTIFIER_SECOND_SQUAD_WIN,
      SQUADVSSQUAD_TIME_PERIOD,
      SQUADVSSQUAD_TEMPLATE_ID,
      sportevent,
    );
    return [firstSquadLeg, secondSquadLeg];
  },
};
