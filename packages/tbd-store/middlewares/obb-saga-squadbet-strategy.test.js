// eslint-disable-next-line import/no-extraneous-dependencies
import {
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
  OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
  OBB_CARD__SET_SQUADBET_MODAL_ERROR,
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
  OBB_CARD__FETCH_SQUADBET_QUOTES,
  OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
  OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
} from "@ppb/tbd-store/actions/obb";
import catalogueService from "../services/catalogue/catalogue-service";
import { Supplier } from "../clients/catalogue/catalogue-response-types";
import { SquadBetStrategy } from "./obb-saga-squadbet-strategy";
import { buildValuesRange, ERROR_CODES, getHighestPriorityError } from "../helpers/obb";

const CARD_URN = "card:123";
const EVENT_URN = "event:456";
const EVENT_ID = 999;
const PARTICIPANT_1_URN = "participant:101";
const PARTICIPANT_2_URN = "participant:102";
const PLAYER_1_ID = "player:101";
const PLAYER_2_ID = "player:102";
const INCIDENT_TYPE = "SHOTS_ON_TARGET";

const PARTICIPANT_1 = { urn: PARTICIPANT_1_URN, incidentTypes: { [INCIDENT_TYPE]: true }, player: { id: PLAYER_1_ID } };
const PARTICIPANT_2 = { urn: PARTICIPANT_2_URN, incidentTypes: { [INCIDENT_TYPE]: true }, player: { id: PLAYER_2_ID } };

const mockCard = {
  urn: CARD_URN,
  incidentType: INCIDENT_TYPE,
  sportevent: { eventId: EVENT_ID },
  squadParticipants: [PARTICIPANT_1, PARTICIPANT_2],
  modalParticipants: [PARTICIPANT_1],
  eventParticipants: [PARTICIPANT_1, PARTICIPANT_2],
};

const mockState = {
  layouts: {
    cards: {
      obbcards: {
        [CARD_URN]: {
          typename: "ObbSquadBetCard",
          ...mockCard,
        },
      },
    },
  },
  entities: {
    obbLegs: [],
    obbParticipants: [PARTICIPANT_1, PARTICIPANT_2],
  },
};

const mockQuotesResponse = {
  legs: [{ quote: { price: 1.5 } }, { quote: { errorCode: ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND } }],
  defaultOutcomeIndex: 0,
};

jest.mock("../services/catalogue/catalogue-service", () => ({
  getObbSquadbetQuotes: jest.fn(),
}));

jest.mock("../helpers/obb", () => ({
  buildValuesRange: jest.fn(),
  getHighestPriorityError: jest.fn(),
  ERROR_CODES: {
    OUTCOME_DEFINITION_NOT_FOUND: "OUTCOME_DEFINITION_NOT_FOUND",
    IMPOSSIBLE_OBB_CHOICE: "IMPOSSIBLE_OBB_CHOICE",
    PLAYER_REMOVED_FROM_LINEUP: "PLAYER_REMOVED_FROM_LINEUP",
  },
}));

jest.mock("../state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadBetCardWithModalFieldsByURNSelector: jest.fn(() => jest.fn(() => mockCard)),
}));

describe("SquadBetStrategy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getEventParticipantsAction should return ObbGetEventParticipantsStateAction", () => {
    const action = SquadBetStrategy.getEventParticipantsAction(CARD_URN, EVENT_URN, INCIDENT_TYPE);
    expect(action).toEqual({
      type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
      payload: {
        cardUrn: CARD_URN,
        event: EVENT_URN,
        incidentType: INCIDENT_TYPE,
        period: "MATCH",
      },
    });
  });

  it("updateParticipantsAction should return ObbUpdateSquadbetModalParticipantsAction when isModal is true", () => {
    const action = SquadBetStrategy.updateParticipantsAction(CARD_URN, true);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("updateParticipantsAction should return ObbUpdateSquadbetMainCardParticipantsAction when isModal is false", () => {
    const action = SquadBetStrategy.updateParticipantsAction(CARD_URN, false);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setModalDefaultStateAction should return ObbSetSquadbetModalDefaultStateAction", () => {
    const action = SquadBetStrategy.setModalDefaultStateAction(CARD_URN);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setModalErrorAction should return ObbSetSquadBetModalErrorAction", () => {
    const errors = [ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND];
    const modalError = ERROR_CODES.BETTING_IN_PLAY_NOT_ALLOWED;
    getHighestPriorityError.mockReturnValueOnce(modalError);
    const action = SquadBetStrategy.setModalErrorAction(CARD_URN, errors, modalError);

    expect(getHighestPriorityError).toHaveBeenCalledWith(errors, modalError);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
      payload: {
        cardUrn: CARD_URN,
        errorCode: modalError,
      },
    });
  });

  it("setPlayerRemovedModalErrorAction filters OUTCOME_DEFINITION_NOT_FOUND and adds PLAYER_REMOVED", () => {
    const errors = [ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND, "OTHER"];
    const modalError = null;

    getHighestPriorityError.mockReturnValueOnce(ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP);

    const action = SquadBetStrategy.setPlayerRemovedModalErrorAction(CARD_URN, errors, modalError);

    expect(getHighestPriorityError).toHaveBeenCalledWith([ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP, "OTHER"], modalError);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
      payload: {
        cardUrn: CARD_URN,
        errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP,
      },
    });
  });

  it("clearModalErrorAction should return ObbClearSquadBetModalErrorAction", () => {
    const action = SquadBetStrategy.clearModalErrorAction(CARD_URN);
    expect(action).toEqual({
      type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setQuotesIsLoadingAction should return ObbSquadbetQuotesIsLoadingAction", () => {
    const action = SquadBetStrategy.setQuotesIsLoadingAction(CARD_URN, true);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
      payload: {
        cardUrn: CARD_URN,
        isLoadingQuotes: true,
      },
    });
  });

  it("fetchQuotesAction should return OBB_CARD__FETCH_SQUADBET_QUOTES when isModal is true", () => {
    const action = SquadBetStrategy.fetchQuotesAction(CARD_URN, true);
    expect(action).toEqual({
      type: OBB_CARD__FETCH_SQUADBET_QUOTES,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("fetchQuotesAction should return OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES when isModal is false", () => {
    const action = SquadBetStrategy.fetchQuotesAction(CARD_URN, false);
    expect(action).toEqual({
      type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("fetchQuotesSuccessAction should return NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS when isModal is true", () => {
    const action = SquadBetStrategy.fetchQuotesSuccessAction(CARD_URN, true, { legs: [], defaultOutcomeIndex: 2 });
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        obbQuotes: [],
        defaultOutcomeIndex: 2,
      },
    });
  });

  it("fetchQuotesSuccessAction should return NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS when isModal is false", () => {
    const action = SquadBetStrategy.fetchQuotesSuccessAction(CARD_URN, false, undefined);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        obbQuotes: [],
        defaultOutcomeIndex: 0,
      },
    });
  });

  it("fetchQuotesFailureAction should return NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE when isModal is true", () => {
    const error = "ERROR";
    const action = SquadBetStrategy.fetchQuotesFailureAction(error, true);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
      payload: {
        error,
      },
    });
  });

  it("fetchQuotesFailureAction should return NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE when isModal is false", () => {
    const error = "ERROR";
    const action = SquadBetStrategy.fetchQuotesFailureAction(error, false);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
      payload: {
        error,
      },
    });
  });

  it("updateParticipantsSuccessAction should return OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS when isModal is true", () => {
    const action = SquadBetStrategy.updateParticipantsSuccessAction(CARD_URN, true, []);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        participants: [],
      },
    });
  });

  it("updateParticipantsSuccessAction should return OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS when isModal is false", () => {
    const action = SquadBetStrategy.updateParticipantsSuccessAction(CARD_URN, false, []);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        participants: [],
      },
    });
  });

  it("toggleModalParticipantAction should remove a participant if they are already in modalParticipants", () => {
    const mockAction = {
      type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
      payload: {
        cardUrn: CARD_URN,
        participantUrn: PARTICIPANT_1_URN,
      },
    };

    const action = SquadBetStrategy.toggleModalParticipantAction(mockCard, mockAction);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        participants: [],
      },
    });
  });

  it("toggleModalParticipantAction should add a participant if they are not in modalParticipants", () => {
    const mockAction = {
      type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
      payload: {
        cardUrn: CARD_URN,
        participantUrn: PARTICIPANT_2_URN,
      },
    };

    const action = SquadBetStrategy.toggleModalParticipantAction(mockCard, mockAction);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        participants: [PARTICIPANT_1_URN, PARTICIPANT_2_URN],
      },
    });
  });

  it("getParticipants should return the correct modalParticipants when isModal is true", () => {
    const result = SquadBetStrategy.getParticipants(mockCard, true);
    expect(result).toEqual([PARTICIPANT_1_URN]);
  });

  it("getParticipants should return the correct squadParticipants when isModal is false", () => {
    const result = SquadBetStrategy.getParticipants(mockCard, false);
    expect(result).toEqual([PARTICIPANT_1_URN, PARTICIPANT_2_URN]);
  });

  it("hasParticipantsChanged should return compare with modalParticipants when isModal is true", () => {
    const result = SquadBetStrategy.hasParticipantsChanged(mockCard, true, [PARTICIPANT_1_URN]);
    expect(result).toEqual(false);
  });

  it("hasParticipantsChanged should return compare with squadParticipants when isModal is false", () => {
    const result = SquadBetStrategy.hasParticipantsChanged(mockCard, false, [PARTICIPANT_1_URN]);
    expect(result).toEqual(true);
  });

  it("hasEmptyParticipants should return compare with modalParticipants when isModal is true", () => {
    const result = SquadBetStrategy.hasEmptyParticipants(mockCard, true);
    expect(result).toEqual(false);
  });

  it("hasEmptyParticipants should return compare with squadParticipants when isModal is false", () => {
    const result = SquadBetStrategy.hasEmptyParticipants(mockCard, false);
    expect(result).toEqual(false);
  });

  it("getObbQuotesRequestInput builds correct payload for modal", () => {
    const range = { min: 10, max: 20 };
    buildValuesRange.mockReturnValueOnce(range);
    const req = SquadBetStrategy.getObbQuotesRequestInput(mockCard, true);
    expect(req).toEqual({
      eventId: { id: `${EVENT_ID}`, supplier: Supplier.Sportex },
      incidentTypeId: INCIDENT_TYPE,
      participantIds: [PLAYER_1_ID],
      quantifier: "AT_LEAST",
      timePeriodId: "MATCH",
      valuesRange: range,
    });
  });

  it("getObbQuotesRequestInput builds correct payload for main card", () => {
    const req = SquadBetStrategy.getObbQuotesRequestInput(mockCard, false);
    expect(req.participantIds).toEqual([PLAYER_1_ID, PLAYER_2_ID]);
  });

  it("getCardWithModalFields should return card with modal fields", () => {
    const cardWithModalFields = SquadBetStrategy.getCardWithModalFields(mockState, CARD_URN);
    expect(cardWithModalFields).toEqual(mockCard);
  });

  it("getQuotesApi should return a function that calls catalogueService", async () => {
    const mockResp = { data: "quotes" };
    catalogueService.getObbSquadbetQuotes.mockResolvedValue(mockResp);

    const apiFn = SquadBetStrategy.getQuotesApi();
    const req = { some: "request" };
    const result = await apiFn(req, {});

    expect(catalogueService.getObbSquadbetQuotes).toHaveBeenCalledWith(req, {});
    expect(result).toBe(mockResp);
  });

  it("getQuotesErrors should extract error codes from legs", () => {
    const errors = SquadBetStrategy.getQuotesErrors(mockQuotesResponse);
    expect(errors).toEqual([ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND]);
  });

  it("getQuotesErrors should return empty array when no errors", () => {
    const noErrors = { ...mockQuotesResponse, legs: [{ quote: { price: 2 } }] };
    const errors = SquadBetStrategy.getQuotesErrors(noErrors);
    expect(errors).toEqual([]);
  });
});
