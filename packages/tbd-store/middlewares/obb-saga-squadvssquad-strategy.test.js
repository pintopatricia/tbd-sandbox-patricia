// eslint-disable-next-line import/no-extraneous-dependencies
import {
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
  OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING,
  OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES,
  OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS,
  OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
} from "@ppb/tbd-store/actions/obb";
import catalogueService from "../services/catalogue/catalogue-service";
import { Supplier } from "../clients/catalogue/catalogue-response-types";
import { SquadVsSquadStrategy } from "./obb-saga-squadvssquad-strategy";
import {
  buildCardQuoteInputSquadVsSquadLegs,
  buildUnquotedLegsForSquadVsSquad,
  buildObbQuote,
  ERROR_CODES,
  getHighestPriorityError,
} from "../helpers/obb";

const CARD_URN = "card:123";
const EVENT_URN = "event:456";
const EVENT_ID = 999;
const PARTICIPANT_1_URN = "participant:101";
const PARTICIPANT_2_URN = "participant:102";
const PARTICIPANT_3_URN = "participant:103";
const PLAYER_1_ID = "player:101";
const PLAYER_2_ID = "player:102";
const PLAYER_3_ID = "player:103";
const INCIDENT_TYPE = "SHOTS_ON_TARGET";

const PARTICIPANT_1 = { urn: PARTICIPANT_1_URN, incidentTypes: { [INCIDENT_TYPE]: true }, player: { id: PLAYER_1_ID } };
const PARTICIPANT_2 = { urn: PARTICIPANT_2_URN, incidentTypes: { [INCIDENT_TYPE]: true }, player: { id: PLAYER_2_ID } };
const PARTICIPANT_3 = { urn: PARTICIPANT_3_URN, incidentTypes: { [INCIDENT_TYPE]: true }, player: { id: PLAYER_3_ID } };

const mockCard = {
  urn: CARD_URN,
  typename: "ObbSquadVsSquadCard",
  incidentType: INCIDENT_TYPE,
  sportevent: { eventId: EVENT_ID },
  firstSquadParticipants: [PARTICIPANT_1, PARTICIPANT_2],
  secondSquadParticipants: [PARTICIPANT_3],
  firstSquadModalParticipants: [PARTICIPANT_1],
  secondSquadModalParticipants: [PARTICIPANT_3],
  eventParticipants: [PARTICIPANT_1, PARTICIPANT_2, PARTICIPANT_3],
};

const mockState = {
  layouts: {
    cards: {
      obbcards: {
        [CARD_URN]: { ...mockCard },
      },
    },
  },
  entities: {
    obbLegs: [],
    obbParticipants: [PARTICIPANT_1, PARTICIPANT_2, PARTICIPANT_3],
  },
};

const mockQuotesResponse = {
  obb: {
    quotes: {
      eventId: EVENT_ID,
      prices: [
        {
          result: { resultCode: "OUTCOME_DEFINITION_NOT_FOUND", errorDetails: "error text" },
        },
      ],
    },
  },
};

jest.mock("../services/catalogue/catalogue-service", () => ({
  getObbQuotes: jest.fn(),
}));

jest.mock("../helpers/obb", () => ({
  buildCardQuoteInputSquadVsSquadLegs: jest.fn(),
  buildObbQuote: jest.fn(),
  buildUnquotedLegsForSquadVsSquad: jest.fn(),
  getHighestPriorityError: jest.fn(),
  ERROR_CODES: {
    OUTCOME_DEFINITION_NOT_FOUND: "OUTCOME_DEFINITION_NOT_FOUND",
    IMPOSSIBLE_OBB_CHOICE: "IMPOSSIBLE_OBB_CHOICE",
    PLAYER_REMOVED_FROM_LINEUP: "PLAYER_REMOVED_FROM_LINEUP",
  },
}));

jest.mock("../state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadVsSquadCardWithModalFieldsByURNSelector: jest.fn(() => jest.fn(() => mockCard)),
}));

describe("SquadVsSquadStrategy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getEventParticipantsAction should return ObbGetEventParticipantsStateAction", () => {
    const action = SquadVsSquadStrategy.getEventParticipantsAction(CARD_URN, EVENT_URN, INCIDENT_TYPE);
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

  it("updateParticipantsAction should return ObbUpdateSquadVsSquadModalParticipantsAction when isModal is true", () => {
    const action = SquadVsSquadStrategy.updateParticipantsAction(CARD_URN, true);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("updateParticipantsAction should return ObbUpdateSquadVsSquadMainCardParticipantsAction when isModal is false", () => {
    const action = SquadVsSquadStrategy.updateParticipantsAction(CARD_URN, false);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setModalDefaultStateAction should return ObbSetSquadVsSquadModalDefaultStateAction", () => {
    const action = SquadVsSquadStrategy.setModalDefaultStateAction(CARD_URN);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setModalErrorAction should return ObbSetSquadVsSquadModalErrorAction", () => {
    const errors = [ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND];
    const modalError = ERROR_CODES.BETTING_IN_PLAY_NOT_ALLOWED;
    getHighestPriorityError.mockReturnValueOnce(modalError);
    const action = SquadVsSquadStrategy.setModalErrorAction(CARD_URN, errors, modalError);

    expect(getHighestPriorityError).toHaveBeenCalledWith(errors, modalError);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
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

    const action = SquadVsSquadStrategy.setPlayerRemovedModalErrorAction(CARD_URN, errors, modalError);

    expect(getHighestPriorityError).toHaveBeenCalledWith([ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP, "OTHER"], modalError);
    expect(action).toEqual({
      type: OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
      payload: {
        cardUrn: CARD_URN,
        errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP,
      },
    });
  });

  it("clearModalErrorAction should return ObbClearSquadVsSquadModalErrorAction", () => {
    const action = SquadVsSquadStrategy.clearModalErrorAction(CARD_URN);
    expect(action).toEqual({
      type: OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("setQuotesIsLoadingAction should return ObbSquadVsSquadQuotesIsLoadingAction", () => {
    const action = SquadVsSquadStrategy.setQuotesIsLoadingAction(CARD_URN, true);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING,
      payload: {
        cardUrn: CARD_URN,
        isLoadingQuotes: true,
      },
    });
  });

  it("fetchQuotesAction should return OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES when isModal is true", () => {
    const action = SquadVsSquadStrategy.fetchQuotesAction(CARD_URN, true);
    expect(action).toEqual({
      type: OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("fetchQuotesAction should return OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES when isModal is false", () => {
    const action = SquadVsSquadStrategy.fetchQuotesAction(CARD_URN, false);
    expect(action).toEqual({
      type: OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES,
      payload: {
        cardUrn: CARD_URN,
      },
    });
  });

  it("fetchQuotesSuccessAction should return NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS when isModal is true", () => {
    const mockQuotes = {
      obb: {
        quotes: {
          prices: [],
        },
      },
    };
    const action = SquadVsSquadStrategy.fetchQuotesSuccessAction(CARD_URN, true, mockQuotes, []);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        legs: [],
      },
    });
  });

  it("fetchQuotesSuccessAction should attach quotes to legs when prices exist", () => {
    const mockLegs = [{ id: 1 }, { id: 2 }];
    const mockQuotes = {
      obb: { quotes: { prices: [{ price: 10 }, { price: 20 }] } },
    };

    buildObbQuote.mockImplementation((p) => ({ quoted: p.price }));

    const action = SquadVsSquadStrategy.fetchQuotesSuccessAction(CARD_URN, true, mockQuotes, mockLegs);

    expect(action.payload.legs).toEqual([
      { id: 1, quote: { quoted: 10 } },
      { id: 2, quote: { quoted: 20 } },
    ]);
  });

  it("fetchQuotesSuccessAction should return NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS when isModal is false", () => {
    const mockQuotes = {
      obb: {
        quotes: {
          prices: [],
        },
      },
    };
    const action = SquadVsSquadStrategy.fetchQuotesSuccessAction(CARD_URN, false, mockQuotes, []);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        legs: [],
      },
    });
  });

  it("fetchQuotesFailureAction should return NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_FAILURE when isModal is true", () => {
    const error = "ERROR";
    const action = SquadVsSquadStrategy.fetchQuotesFailureAction(error, true);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE,
      payload: {
        error,
      },
    });
  });

  it("fetchQuotesFailureAction should return NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE when isModal is false", () => {
    const error = "ERROR";
    const action = SquadVsSquadStrategy.fetchQuotesFailureAction(error, false);
    expect(action).toEqual({
      type: NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE,
      payload: {
        error,
      },
    });
  });

  it("updateParticipantsSuccessAction should return OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS when isModal is true", () => {
    const action = SquadVsSquadStrategy.updateParticipantsSuccessAction(CARD_URN, true, [[], []]);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        firstSquadParticipants: [],
        secondSquadParticipants: [],
      },
    });
  });

  it("updateParticipantsSuccessAction should return OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS when isModal is false", () => {
    const action = SquadVsSquadStrategy.updateParticipantsSuccessAction(CARD_URN, false, [[], []]);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        firstSquadParticipants: [],
        secondSquadParticipants: [],
      },
    });
  });

  it("toggleModalParticipantAction should remove a participant if they are already in the selected squad", () => {
    const mockAction = {
      type: OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
      payload: {
        cardUrn: CARD_URN,
        participantUrn: PARTICIPANT_1_URN,
        selectedSquadId: "1",
      },
    };

    const action = SquadVsSquadStrategy.toggleModalParticipantAction(mockCard, mockAction);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        firstSquadParticipants: [],
        secondSquadParticipants: [PARTICIPANT_3_URN],
      },
    });
  });

  it("toggleModalParticipantAction should add a participant if they are not in the selected squad", () => {
    const mockAction = {
      type: OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT,
      payload: {
        cardUrn: CARD_URN,
        participantUrn: PARTICIPANT_2_URN,
        selectedSquadId: "1",
      },
    };

    const action = SquadVsSquadStrategy.toggleModalParticipantAction(mockCard, mockAction);
    expect(action).toEqual({
      type: OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
      payload: {
        cardUrn: CARD_URN,
        firstSquadParticipants: [PARTICIPANT_1_URN, PARTICIPANT_2_URN],
        secondSquadParticipants: [PARTICIPANT_3_URN],
      },
    });
  });

  it("getParticipants should return the correct modal participants when isModal is true", () => {
    const result = SquadVsSquadStrategy.getParticipants(mockCard, true);
    expect(result).toEqual([[PARTICIPANT_1_URN], [PARTICIPANT_3_URN]]);
  });

  it("getParticipants should return the correct squad participants when isModal is false", () => {
    const result = SquadVsSquadStrategy.getParticipants(mockCard, false);
    expect(result).toEqual([[PARTICIPANT_1_URN, PARTICIPANT_2_URN], [PARTICIPANT_3_URN]]);
  });

  it("hasParticipantsChanged should return compare with modal participants when isModal is true", () => {
    const result = SquadVsSquadStrategy.hasParticipantsChanged(mockCard, true, [
      [PARTICIPANT_1_URN],
      [PARTICIPANT_3_URN],
    ]);
    expect(result).toEqual(false);
  });

  it("hasParticipantsChanged should return compare with squad prticipants when isModal is false", () => {
    const result = SquadVsSquadStrategy.hasParticipantsChanged(mockCard, false, [
      PARTICIPANT_1_URN,
      [PARTICIPANT_2_URN],
    ]);
    expect(result).toEqual(true);
  });

  it("hasEmptyParticipants should return compare with modalParticipants when isModal is true", () => {
    const result = SquadVsSquadStrategy.hasEmptyParticipants(mockCard, true);
    expect(result).toEqual(false);
  });

  it("hasEmptyParticipants should return compare with squadParticipants when isModal is false", () => {
    const result = SquadVsSquadStrategy.hasEmptyParticipants(mockCard, false);
    expect(result).toEqual(false);
  });

  it("getObbQuotesRequestInput builds correct payload", () => {
    buildCardQuoteInputSquadVsSquadLegs.mockReturnValueOnce([]);
    const req = SquadVsSquadStrategy.getObbQuotesRequestInput(mockCard, true, []);
    expect(req).toEqual({
      eventId: { id: `${EVENT_ID}`, supplier: Supplier.Sportex },
      toQuote: [],
    });
  });

  it("getCardWithModalFields should return card with modal fields", () => {
    const cardWithModalFields = SquadVsSquadStrategy.getCardWithModalFields(mockState, CARD_URN);
    expect(cardWithModalFields).toEqual(mockCard);
  });

  it("getQuotesApi should return a function that calls catalogueService", async () => {
    const mockResp = { data: "quotes" };
    catalogueService.getObbQuotes.mockResolvedValue(mockResp);

    const apiFn = SquadVsSquadStrategy.getQuotesApi();
    const req = { some: "request" };
    const result = await apiFn(req, {});

    expect(catalogueService.getObbQuotes).toHaveBeenCalledWith(req, {});
    expect(result).toBe(mockResp);
  });

  it("getQuotesErrors should extract error codes from legs", () => {
    const errors = SquadVsSquadStrategy.getQuotesErrors(mockQuotesResponse);
    expect(errors).toEqual([ERROR_CODES.OUTCOME_DEFINITION_NOT_FOUND]);
  });

  it("filterNewModalErrors should return no errors if all legs have different errors", () => {
    const mockTotalLegs = {
      obb: {
        quotes: {
          prices: [{}, {}],
        },
      },
    };
    const errors = SquadVsSquadStrategy.filterNewModalErrors([ERROR_CODES.IMPOSSIBLE_OBB_CHOICE], mockTotalLegs);
    expect(errors).toEqual([]);
  });

  it("filterNewModalErrors should return array of ERROR_CODES.IMPOSSIBLE_OBB_CHOICE if all legs have that error", () => {
    const mockTotalLegs = {
      obb: {
        quotes: {
          prices: [{}, {}],
        },
      },
    };
    const errors = SquadVsSquadStrategy.filterNewModalErrors(
      [ERROR_CODES.IMPOSSIBLE_OBB_CHOICE, ERROR_CODES.IMPOSSIBLE_OBB_CHOICE],
      mockTotalLegs,
    );
    expect(errors).toEqual([ERROR_CODES.IMPOSSIBLE_OBB_CHOICE, ERROR_CODES.IMPOSSIBLE_OBB_CHOICE]);
  });

  it("buildUnquotedLegs should build legs using normal participants when isModal is false", () => {
    const result = SquadVsSquadStrategy.buildUnquotedLegs(mockCard, false);

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenCalledTimes(2);

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenNthCalledWith(
      1,
      mockCard.firstSquadParticipants,
      mockCard.secondSquadParticipants,
      "SHOTS_ON_TARGET",
      expect.any(String),
      expect.any(String),
      expect.any(String),
      mockCard.sportevent,
    );

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenNthCalledWith(
      2,
      mockCard.firstSquadParticipants,
      mockCard.secondSquadParticipants,
      "SHOTS_ON_TARGET",
      expect.any(String),
      expect.any(String),
      expect.any(String),
      mockCard.sportevent,
    );

    expect(result.length).toBe(2);
  });

  it("should build legs using modal participants when isModal is true", () => {
    const result = SquadVsSquadStrategy.buildUnquotedLegs(mockCard, true);

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenCalledTimes(2);

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenNthCalledWith(
      1,
      mockCard.firstSquadModalParticipants,
      mockCard.secondSquadModalParticipants,
      "SHOTS_ON_TARGET",
      expect.any(String),
      expect.any(String),
      expect.any(String),
      mockCard.sportevent,
    );

    expect(buildUnquotedLegsForSquadVsSquad).toHaveBeenNthCalledWith(
      2,
      mockCard.firstSquadModalParticipants,
      mockCard.secondSquadModalParticipants,
      "SHOTS_ON_TARGET",
      expect.any(String),
      expect.any(String),
      expect.any(String),
      mockCard.sportevent,
    );

    expect(result.length).toBe(2);
  });
});
