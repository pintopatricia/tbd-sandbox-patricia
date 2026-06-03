import { call, select, put, takeLatest, all } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  OBB_LEG_QUOTES_UPDATE_STATE,
  ObbLegQuotesUpdateStateAction,
  FetchObbCardQuotesSuccessAction,
  NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
  FetchObbCardQuotesFailureAction,
  NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE,
  ObbCardUpdateLegsAction,
  OBB_CARD__UPDATE_LEGS,
  ObbGetEventParticipantsStateAction,
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE,
  NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
  OBB_CARD__FETCH_SQUADBET_QUOTES,
  FetchObbSquadbetQuotesAction,
  ObbSquadbetOnModalOpenAction,
  OBB_CARD__ON_SQUADBET_MODAL_OPEN,
  ObbUpdateSquadbetModalParticipantsAction,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
  ObbToggleSquadBetModalParticipantAction,
  OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
  ObbUpdateSquadbetMainCardParticipantsAction,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
  FetchObbSquadbetMainCardQuotesAction,
  OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
  ObbSquadVsSquadOnModalOpenAction,
  OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES,
  FetchObbSquadVsSquadQuotesAction,
  OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN,
  ObbToggleSquadVsSquadModalParticipantAction,
  OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS,
  ObbUpdateSquadVsSquadModalParticipantsAction,
  ObbUpdateSquadVsSquadMainCardParticipantsAction,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS,
  OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES,
  FetchObbSquadVsSquadMainCardQuotesAction,
} from "@ppb/tbd-store/actions/obb";
import { ApplicationState } from "../state/ApplicationState.types";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import catalogueService from "../services/catalogue/catalogue-service";
import { ObbGetEventParticipantsQuery, ObbQuotesQuery, Supplier } from "../clients/catalogue/catalogue-response-types";
import { buildCardQuoteInputPvpLeg, ERROR_CODES, mapUnquotedLegsByEvent } from "../helpers/obb";
import { ObbParticipants } from "../state/entities/obb-participants/ObbParticipants.types";
import { createCardByURNSelector } from "../state/layout/cards/cards-selectors";
import { ObbCard, ObbCards } from "../state/layout/cards/obb-card/ObbCard.types";
import URN from "../state/layout/URN";
import { ThrottleOverrides } from "../state";
import { SquadBetStrategy } from "./obb-saga-squadbet-strategy";
import { SquadVsSquadStrategy } from "./obb-saga-squadvssquad-strategy";
import { ObbQuotesResponse, SelectorCardWithModalFields } from "./obb-saga-strategy.types";

export const getCardStrategy = (card: ObbCard | null) => {
  switch (card?.typename) {
    case "ObbSquadBetCard":
      return SquadBetStrategy;
    case "ObbSquadVsSquadCard":
      return SquadVsSquadStrategy;
    default:
      return undefined;
  }
};

const getCardByURN = createCardByURNSelector<ObbCards, URN>();

function* getObbPvPCardQuotes(action: ObbLegQuotesUpdateStateAction): SagaIterator {
  try {
    const { urn, unquotedLegs } = action.payload;

    yield put<ObbCardUpdateLegsAction>({
      type: OBB_CARD__UPDATE_LEGS,
      payload: { urn, legs: unquotedLegs },
    });

    const mappedUnquotedLegsByEvent = mapUnquotedLegsByEvent(unquotedLegs);

    const participants: ObbParticipants = yield select((state: ApplicationState) => state.entities.obbParticipants);

    const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));

    const quotesRequests = Object.keys(mappedUnquotedLegsByEvent).map((eventId) => {
      const legsToQuote = mappedUnquotedLegsByEvent[eventId];
      const quoteInputLegs = buildCardQuoteInputPvpLeg(legsToQuote, participants);

      return call(
        catalogueService.getObbQuotes,
        {
          eventId: {
            id: eventId.toString(),
            supplier: Supplier.Sportex,
          },
          toQuote: quoteInputLegs,
        },
        throttleOverrides,
      );
    });

    const results: ObbQuotesQuery[] = yield all(quotesRequests);

    const obbQuotes = results.flatMap((result) => {
      if (!result.obb) {
        return [];
      }

      const { quotes } = result.obb;

      return quotes.prices;
    });

    yield put<FetchObbCardQuotesSuccessAction>({
      type: NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
      payload: { urn, obbQuotes },
    });
  } catch {
    yield put<FetchObbCardQuotesFailureAction>({
      type: NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE,
      payload: {},
    });
  }
}

function* getObbModalQuotes(
  action:
    | FetchObbSquadbetQuotesAction
    | FetchObbSquadVsSquadQuotesAction
    | FetchObbSquadbetMainCardQuotesAction
    | FetchObbSquadVsSquadMainCardQuotesAction,
): SagaIterator {
  const { cardUrn } = action.payload;

  const [throttleOverrides, card]: [ThrottleOverrides, ObbCard | null] = yield all([
    select((state: ApplicationState) => getOverridenThrottles(state.entities)),
    select((state: ApplicationState) => getCardByURN(state.layouts.cards.obbcards, cardUrn)),
  ]);

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  const cardWithModalFields: SelectorCardWithModalFields | undefined = yield select((state: ApplicationState) =>
    strategy.getCardWithModalFields(state, cardUrn),
  );

  if (!cardWithModalFields) return;

  if (strategy.hasEmptyParticipants(cardWithModalFields, true)) {
    yield all([
      put(strategy.fetchQuotesSuccessAction(cardUrn, true)),
      put(strategy.setQuotesIsLoadingAction(cardUrn, false)),
    ]);
    return;
  }

  const {
    sportevent: { urn: sporteventUrn },
    incidentType,
    modalError,
  } = cardWithModalFields;

  yield put(strategy.setQuotesIsLoadingAction(cardUrn, true));

  const obbLegs = strategy.buildUnquotedLegs?.(cardWithModalFields, true);

  const quotesRequestInput = strategy.getObbQuotesRequestInput(cardWithModalFields, true, obbLegs);
  const getQuotesApi = strategy.getQuotesApi();

  try {
    const response: ObbQuotesResponse = yield call(getQuotesApi, quotesRequestInput, throttleOverrides);

    const quoteErrors = strategy.getQuotesErrors(response);

    const hasOutcomeDefinitionNotFoundError = quoteErrors.some(
      (error) => error === ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND,
    );

    if (hasOutcomeDefinitionNotFoundError) {
      // When the error is OUTCOME_DEFINITION_NOT_FOUND, we will fix the error automatically and only show an info Alert
      // saying that the player was removed from the lineup, thus we will not show the OUTCOME_DEFINITION_NOT_FOUND message itself.
      // Although, if a more priority error is present, we will show that one instead

      yield all([
        put(strategy.setPlayerRemovedModalErrorAction(cardUrn, quoteErrors, modalError)),
        put(strategy.getEventParticipantsAction(cardUrn, sporteventUrn, incidentType)),
      ]);
    } else {
      const newModalErrors = strategy.filterNewModalErrors?.(quoteErrors, response) || quoteErrors;

      if (newModalErrors.length) {
        yield put(strategy.setModalErrorAction(cardUrn, newModalErrors, modalError));
      } else {
        yield put(strategy.clearModalErrorAction(cardUrn));
      }

      yield put(strategy.fetchQuotesSuccessAction(cardUrn, true, response, obbLegs));
    }
  } catch (error) {
    yield put(strategy.fetchQuotesFailureAction(error as string, true));
  } finally {
    yield put(strategy.setQuotesIsLoadingAction(cardUrn, false));
  }
}

function* getObbMainCardQuotes(
  action:
    | FetchObbSquadbetQuotesAction
    | FetchObbSquadVsSquadQuotesAction
    | FetchObbSquadbetMainCardQuotesAction
    | FetchObbSquadVsSquadMainCardQuotesAction,
): SagaIterator {
  const { cardUrn } = action.payload;

  const [throttleOverrides, card]: [ThrottleOverrides, ObbCard | null] = yield all([
    select((state: ApplicationState) => getOverridenThrottles(state.entities)),
    select((state: ApplicationState) => getCardByURN(state.layouts.cards.obbcards, cardUrn)),
  ]);

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  const cardWithModalFields: SelectorCardWithModalFields | undefined = yield select((state: ApplicationState) =>
    strategy.getCardWithModalFields(state, cardUrn),
  );

  if (!cardWithModalFields) return;

  if (strategy.hasEmptyParticipants(cardWithModalFields, false)) {
    yield all([put(strategy.fetchQuotesSuccessAction(cardUrn, false))]);
    return;
  }

  const {
    sportevent: { urn: sporteventUrn },
    incidentType,
  } = cardWithModalFields;

  const obbLegs = strategy.buildUnquotedLegs?.(cardWithModalFields, false);

  const quotesRequestInput = strategy.getObbQuotesRequestInput(cardWithModalFields, false, obbLegs);
  const getQuotesApi = strategy.getQuotesApi();

  try {
    const response: ObbQuotesResponse = yield call(getQuotesApi, quotesRequestInput, throttleOverrides);

    const quoteErrors = strategy.getQuotesErrors(response);

    const hasOutcomeDefinitionNotFoundError = quoteErrors.some(
      (error) => error === ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND,
    );

    if (hasOutcomeDefinitionNotFoundError) {
      yield put(strategy.getEventParticipantsAction(cardUrn, sporteventUrn, incidentType));
    } else {
      yield put(strategy.fetchQuotesSuccessAction(cardUrn, false, response, obbLegs));
    }
  } catch (error) {
    yield put(strategy.fetchQuotesFailureAction(error as string, false));
  }
}

function* getObbEventParticipants(action: ObbGetEventParticipantsStateAction): SagaIterator {
  try {
    const { event, incidentType, period, cardUrn } = action.payload;

    const requestInput = { event, incidentType, period };
    const filterInput = { incidentType, period };

    const [throttleOverrides, card]: [ThrottleOverrides, ObbCard | null] = yield all([
      select((state: ApplicationState) => getOverridenThrottles(state.entities)),
      select((state: ApplicationState) => getCardByURN(state.layouts.cards.obbcards, cardUrn)),
    ]);

    const strategy = getCardStrategy(card);

    if (!card || !strategy) return;

    const cardParticipants = "eventParticipants" in card ? card.eventParticipants : [];

    if (!cardParticipants.length) return;

    const result: ObbGetEventParticipantsQuery = yield call(
      catalogueService.getObbEventParticipants,
      requestInput,
      filterInput,
      throttleOverrides,
    );

    if (!result.obb) return;

    const { eventParticipants } = result.obb;

    yield all([
      put({
        type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
        payload: { cardUrn, cardParticipants, eventParticipants, requestInput },
      }),
      put(strategy.updateParticipantsAction(cardUrn, true)),
      put(strategy.updateParticipantsAction(cardUrn, false)),
    ]);
  } catch {
    yield put({ type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE });
  }
}

function* onObbModalOpen(action: ObbSquadbetOnModalOpenAction | ObbSquadVsSquadOnModalOpenAction): SagaIterator {
  const { cardUrn } = action.payload;

  const card: ObbCard | null = yield select((state: ApplicationState) =>
    getCardByURN(state.layouts.cards.obbcards, cardUrn),
  );

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  yield all([put(strategy.setModalDefaultStateAction(cardUrn)), put(strategy.setQuotesIsLoadingAction(cardUrn, true))]);

  yield call(
    getObbEventParticipants,
    strategy.getEventParticipantsAction(cardUrn, card.sportevent.urn, card.incidentType),
  );

  yield call(getObbModalQuotes, strategy.fetchQuotesAction(cardUrn, true));
}

function* toggleObbModalParticipant(
  action: ObbToggleSquadBetModalParticipantAction | ObbToggleSquadVsSquadModalParticipantAction,
): SagaIterator {
  const { cardUrn, participantUrn } = action.payload;

  const card: ObbCard | null = yield select((state: ApplicationState) =>
    getCardByURN(state.layouts.cards.obbcards, cardUrn),
  );

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  const cardWithModalFields: SelectorCardWithModalFields | undefined = yield select((state: ApplicationState) =>
    strategy.getCardWithModalFields(state, cardUrn),
  );

  if (!cardWithModalFields) return;

  const { eventParticipants } = cardWithModalFields;

  if (!eventParticipants.map((eventParticipant) => eventParticipant.urn).includes(participantUrn)) return;

  yield put(strategy.toggleModalParticipantAction(cardWithModalFields, action));

  yield call(getObbModalQuotes, strategy.fetchQuotesAction(cardUrn, true));
}

function* updateModalParticipants(
  action: ObbUpdateSquadbetModalParticipantsAction | ObbUpdateSquadVsSquadModalParticipantsAction,
): SagaIterator {
  const { cardUrn } = action.payload;

  const card: ObbCard | null = yield select((state: ApplicationState) =>
    getCardByURN(state.layouts.cards.obbcards, cardUrn),
  );

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  const cardWithModalFields: SelectorCardWithModalFields | undefined = yield select((state: ApplicationState) =>
    strategy.getCardWithModalFields(state, cardUrn),
  );

  if (!cardWithModalFields) return;

  const newModalParticipants = strategy.getParticipants(cardWithModalFields, true);

  yield put(strategy.updateParticipantsSuccessAction(cardUrn, true, newModalParticipants));

  if (strategy.hasParticipantsChanged(cardWithModalFields, true, newModalParticipants)) {
    yield call(getObbModalQuotes, strategy.fetchQuotesAction(cardUrn, true));
  }
}

function* updateMainCardParticipants(
  action: ObbUpdateSquadbetMainCardParticipantsAction | ObbUpdateSquadVsSquadMainCardParticipantsAction,
): SagaIterator {
  const { cardUrn } = action.payload;

  const card: ObbCard | null = yield select((state: ApplicationState) =>
    getCardByURN(state.layouts.cards.obbcards, cardUrn),
  );

  const strategy = getCardStrategy(card);

  if (!card || !strategy) return;

  const cardWithModalFields: SelectorCardWithModalFields | undefined = yield select((state: ApplicationState) =>
    strategy.getCardWithModalFields(state, cardUrn),
  );

  if (!cardWithModalFields) return;

  const newMainCardParticipants = strategy.getParticipants(cardWithModalFields, false);

  yield put(strategy.updateParticipantsSuccessAction(cardUrn, false, newMainCardParticipants));

  if (strategy.hasParticipantsChanged(cardWithModalFields, false, newMainCardParticipants)) {
    yield call(getObbMainCardQuotes, strategy.fetchQuotesAction(cardUrn, false));
  }
}

export function* obbSaga(): SagaIterator {
  yield takeLatest(OBB_LEG_QUOTES_UPDATE_STATE, getObbPvPCardQuotes);
  yield takeLatest([OBB_CARD__FETCH_SQUADBET_QUOTES, OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES], getObbModalQuotes);
  yield takeLatest(
    [OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES, OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES],
    getObbMainCardQuotes,
  );
  yield takeLatest(OBB_CARD__FETCH_EVENT_PARTICIPANTS, getObbEventParticipants);
  yield takeLatest([OBB_CARD__ON_SQUADBET_MODAL_OPEN, OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN], onObbModalOpen);
  yield takeLatest(
    [OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT, OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT],
    toggleObbModalParticipant,
  );
  yield takeLatest(
    [OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS, OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS],
    updateModalParticipants,
  );
  yield takeLatest(
    [OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS, OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS],
    updateMainCardParticipants,
  );
}
