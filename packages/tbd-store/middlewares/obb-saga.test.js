import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";

import {
  NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE,
  NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
  OBB_LEG_QUOTES_UPDATE_STATE,
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
  OBB_CARD__FETCH_EVENT_PARTICIPANTS,
  OBB_CARD__FETCH_SQUADBET_QUOTES,
  OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
  OBB_CARD__ON_SQUADBET_MODAL_OPEN,
  OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
  OBB_CARD__SET_SQUADBET_MODAL_ERROR,
  OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
  OBB_CARD__UPDATE_LEGS,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
} from "../actions/obb";
import { Supplier } from "../clients/catalogue/catalogue-response-types";
import { buildValuesRange } from "../helpers/obb";
import { getCardStrategy } from "./obb-saga";
import { SquadBetStrategy } from "./obb-saga-squadbet-strategy";
import { SquadVsSquadStrategy } from "./obb-saga-squadvssquad-strategy";

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

const mockLegQuotes = {
  obb: {
    quotes: {
      eventId: {
        id: "123",
        supplier: Supplier.Sportex,
      },
      prices: [
        {
          id: "legId",
          price: {
            decimal: 2,
          },
          result: { resultCode: "SUCCESS" },
        },
      ],
    },
  },
};

const mockLeg1Quotes = {
  obb: {
    quotes: {
      eventId: {
        id: "456",
        supplier: Supplier.Sportex,
      },
      prices: [
        {
          id: "legId1",
          price: {
            decimal: 5,
          },
          result: { resultCode: "SUCCESS" },
        },
      ],
    },
  },
};

const obbLegsEntityStateMock = {
  selectedLeg1: {
    id: "selectedLeg1",
    templateId: "playerVsPlayer",
    firstParticipant: "player-1",
    secondParticipant: "player-2",
    event: {
      urn: "eventUrn",
      name: "eventName",
      eventId: 123,
    },
    aggregator: "aggregator1",
    outcome: {
      incidentType: "incident1",
      operator: "operator1",
      period: "period1",
      value: {
        numericValue: 42,
      },
    },
    quote: {
      price: { deicmal: 2.0 },
    },
  },
  selectedLeg2: {
    id: "selectedLeg2",
    templateId: "squadVsSquad",
    squadAParticipantIds: ["player-1"],
    squadBParticipantIds: ["player-2"],
    event: {
      urn: "eventUrn",
      name: "eventName",
      eventId: 123,
    },
    timePeriodId: "MATCH",
    outcomeIds: ["GOALS_TIME_ADJUSTED"],
    quantifier: "GREATER_THAN",
    quote: {
      price: { decimal: 2.0 },
    },
  },
  selectedLeg3: {
    id: "selectedLeg3",
    templateId: "squadVsSquad",
    squadAParticipantIds: ["player-1"],
    squadBParticipantIds: ["player-2"],
    event: {
      urn: "eventUrn",
      name: "eventName",
      eventId: 123,
    },
    timePeriodId: "MATCH",
    outcomeIds: ["GOALS_TIME_ADJUSTED"],
    quantifier: "GREATER_THAN",
    quote: {
      price: { decimal: 2.0 },
    },
  },
};

const quoteInputLegs = [
  {
    id: "selectedLegId",
    expressionTemplateId: "expressionTemplateId",
    expressionParams: {
      outcomeId: "outcomeId",
      participantIdA: "participantIdA",
      participantIdB: "participantIdB",
      timePeriodId: "timePeriodId",
    },
  },
  {
    id: "selectedLegId1",
    expressionTemplateId: "expressionTemplateId",
    expressionParams: {
      outcomeId: "outcomeId",
      participantIdA: "participantIdB",
      participantIdB: "participantIdA",
      timePeriodId: "timePeriodId",
    },
  },
];

const mappedUnquotedLegsByEvent = {
  123: [
    {
      id: "selectedLegId",
      templateId: "playerVsPlayer",
      firstParticipant: "urn:player-1",
      secondParticipant: "urn:player-2",
      event: { urn: "eventUrn", name: "eventName", eventId: 123 },
      aggregator: "aggregator",
      outcome: { incidentType: "incident", operator: "operator", period: "period", value: { numericValue: 42 } },
    },
  ],
  456: [
    {
      id: "selectedLegId1",
      templateId: "playerVsPlayer",
      firstParticipant: "urn:player-2",
      secondParticipant: "urn:player-1",
      event: { urn: "eventUrn1", name: "eventName", eventId: 456 },
      aggregator: "aggregator",
      outcome: { incidentType: "incident", operator: "operator", period: "period", value: { numericValue: 42 } },
    },
  ],
};

const squadBetCardWithModalFields = {
  typename: "ObbSquadBetCard",
  sportevent: { eventId: "eventId", urn: "eventUrn" },
  modalParticipants: [{ player: { id: "123" } }, { player: { id: "456" } }],
  eventParticipants: [
    { urn: "player1:urn", player: { id: "123" } },
    { urn: "player2:urn", player: { id: "456" } },
  ],
  incidentType: "GOALS",
  modalError: null,
};

const getCardByURN = jest.fn();
const getObbSquadBetCardByURN = jest.fn();
const getObbSquadVsSquadCardByURN = jest.fn();
const getHighestPriorityError = jest.fn();
const buildCardQuoteInputPvpLeg = jest.fn();
const buildUnquotedLegsForSquadVsSquad = jest.fn();

const getCardWithModalFieldsSpy = jest.fn();
const setModalErrorActionSpy = jest.fn();
const setPlayerRemovedModalErrorActionSpy = jest.fn();
const getEventParticipantsActionSpy = jest.fn();
const fetchQuotesActionSpy = jest.fn();
const fetchQuotesSuccessActionSpy = jest.fn();
const fetchQuotesFailureActionSpy = jest.fn();
const setQuotesIsLoadingActionSpy = jest.fn();
const hasEmptyParticipantsSpy = jest.fn();
const buildUnquotedLegsSpy = jest.fn();
const getObbQuotesRequestInputSpy = jest.fn();
const getQuotesApiSpy = jest.fn();
const getQuotesErrorsSpy = jest.fn();
const filterNewModalErrorsSpy = jest.fn();
const setModalDefaultStateActionSpy = jest.fn();
const clearModalErrorActionSpy = jest.fn();
const updateParticipantsActionSpy = jest.fn();
const getParticipantsSpy = jest.fn();
const updateParticipantsSuccessActionSpy = jest.fn();
const hasParticipantsChangedSpy = jest.fn();
const toggleModalParticipantActionSpy = jest.fn();

jest.mock("./obb-saga-squadbet-strategy", () => ({
  SquadBetStrategy: {
    getCardWithModalFields: (...args) => getCardWithModalFieldsSpy(...args),
    setPlayerRemovedModalErrorAction: (...args) => setPlayerRemovedModalErrorActionSpy(...args),
    getEventParticipantsAction: (...args) => getEventParticipantsActionSpy(...args),
    fetchQuotesAction: (...args) => fetchQuotesActionSpy(...args),
    fetchQuotesSuccessAction: (...args) => fetchQuotesSuccessActionSpy(...args),
    fetchQuotesFailureAction: (...args) => fetchQuotesFailureActionSpy(...args),
    setQuotesIsLoadingAction: (...args) => setQuotesIsLoadingActionSpy(...args),
    setModalErrorAction: (...args) => setModalErrorActionSpy(...args),
    clearModalErrorAction: (...args) => clearModalErrorActionSpy(...args),
    setModalDefaultStateAction: (...args) => setModalDefaultStateActionSpy(...args),
    hasEmptyParticipants: (...args) => hasEmptyParticipantsSpy(...args),
    buildUnquotedLegs: (...args) => buildUnquotedLegsSpy(...args),
    getObbQuotesRequestInput: (...args) => getObbQuotesRequestInputSpy(...args),
    getQuotesApi: (...args) => getQuotesApiSpy(...args),
    getQuotesErrors: (...args) => getQuotesErrorsSpy(...args),
    filterNewModalErrors: (...args) => filterNewModalErrorsSpy(...args),
    updateParticipantsAction: (...args) => updateParticipantsActionSpy(...args),
    getParticipants: (...args) => getParticipantsSpy(...args),
    updateParticipantsSuccessAction: (...args) => updateParticipantsSuccessActionSpy(...args),
    hasParticipantsChanged: (...args) => hasParticipantsChangedSpy(...args),
    toggleModalParticipantAction: (...args) => toggleModalParticipantActionSpy(...args),
  },
}));
jest.mock("./obb-saga-squadvssquad-strategy", () => ({
  SquadVsSquadStrategy: {
    getCardWithModalFields: (...args) => getCardWithModalFieldsSpy(...args),
    setPlayerRemovedModalErrorAction: (...args) => setPlayerRemovedModalErrorActionSpy(...args),
    getEventParticipantsAction: (...args) => getEventParticipantsActionSpy(...args),
    fetchQuotesAction: (...args) => fetchQuotesActionSpy(...args),
    fetchQuotesSuccessAction: (...args) => fetchQuotesSuccessActionSpy(...args),
    fetchQuotesFailureAction: (...args) => fetchQuotesFailureActionSpy(...args),
    setQuotesIsLoadingAction: (...args) => setQuotesIsLoadingActionSpy(...args),
    setModalErrorAction: (...args) => setModalErrorActionSpy(...args),
    clearModalErrorAction: (...args) => clearModalErrorActionSpy(...args),
    setModalDefaultStateAction: (...args) => setModalDefaultStateActionSpy(...args),
    hasEmptyParticipants: (...args) => hasEmptyParticipantsSpy(...args),
    buildUnquotedLegs: (...args) => buildUnquotedLegsSpy(...args),
    getObbQuotesRequestInput: (...args) => getObbQuotesRequestInputSpy(...args),
    getQuotesApi: (...args) => getQuotesApiSpy(...args),
    getQuotesErrors: (...args) => getQuotesErrorsSpy(...args),
    filterNewModalErrors: (...args) => filterNewModalErrorsSpy(...args),
    updateParticipantsAction: (...args) => updateParticipantsActionSpy(...args),
    getParticipants: (...args) => getParticipantsSpy(...args),
    updateParticipantsSuccessAction: (...args) => updateParticipantsSuccessActionSpy(...args),
    hasParticipantsChanged: (...args) => hasParticipantsChangedSpy(...args),
    toggleModalParticipantAction: (...args) => toggleModalParticipantActionSpy(...args),
  },
}));

jest.mock("../services/catalogue/catalogue-service", () => ({
  getObbQuotes: jest.fn(),
  getObbEventParticipants: jest.fn(),
  getObbSquadbetQuotes: jest.fn(),
}));

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

jest.mock("../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector:
    () =>
    (...args) =>
      getCardByURN(...args),
}));

jest.mock("../state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbSquadBetCardWithModalFieldsByURNSelector: () => getObbSquadBetCardByURN,
  createObbSquadVsSquadCardWithModalFieldsByURNSelector: () => getObbSquadVsSquadCardByURN,
}));

jest.mock("../helpers/obb", () => ({
  buildCardQuoteInputPvpLeg: jest
    .fn()
    .mockImplementation((props) =>
      props.some((prop) => prop.id === "selectedLegId") ? [quoteInputLegs[0]] : [quoteInputLegs[1]],
    ),
  buildValuesRange: jest.fn(),
  buildUnquotedLegsForSquadVsSquad: jest.fn(() => buildUnquotedLegsForSquadVsSquad),
  mapUnquotedLegsByEvent: jest.fn(() => mappedUnquotedLegsByEvent),
  ERROR_CODES: {
    OUTCOME_DEFINITION_NOT_FOUND: "OUTCOME_DEFINITION_NOT_FOUND",
    IMPOSSIBLE_OBB_CHOICE: "IMPOSSIBLE_OBB_CHOICE",
    PLAYER_REMOVED_FROM_LINEUP: "PLAYER_REMOVED_FROM_LINEUP",
  },
}));

let putActions;
let stopSaga;
let getState;
let dispatch;

const STATE = {
  layouts: {
    cards: {
      obbcards: {
        "URN:1": {
          typename: "ObbSquadBetCard",
        },
        "URN:2": {
          typename: "ObbSquadBetCard",
          eventParticipants: ["some:urn:2"],
          urn: "card:urn",
          sportevent: { eventId: "eventId", urn: "event:urn" },
          incidentType: "GOALS",
        },
        "URN:3": {
          typename: "ObbSquadVsSquadCard",
          eventParticipants: ["some:urn:3"],
        },
      },
    },
  },
  entities: {
    obbLegs: obbLegsEntityStateMock,
  },
};

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ obbSaga: saga } = require("./obb-saga"));
  });
  ({ putActions, stopSaga, getState, dispatch } = setupSagaMocks(saga));

  getState.mockReturnValue(STATE);
}

describe("getObbPvPCardQuotes", () => {
  const urn = "URN:1";
  const unquotedLegs = [
    {
      id: "e1540633973ecb69",
      templateId: "playerVsPlayer",
      firstParticipant: "urn:player-1",
      secondParticipant: "urn:player-2",
      event: { urn: "eventUrn", name: "eventName", eventId: 123 },
      aggregator: "aggregator",
      outcome: { incidentType: "incident", operator: "operator", period: "period", value: { numericValue: 42 } },
    },
    {
      id: "aa3ebf5fd23a1970",
      templateId: "playerVsPlayer",
      firstParticipant: "urn:player-2",
      secondParticipant: "urn:player-1",
      event: { urn: "eventUrn1", name: "eventName", eventId: 456 },
      aggregator: "aggregator",
      outcome: { incidentType: "incident", operator: "operator", period: "period", value: { numericValue: 42 } },
    },
  ];
  const action = {
    type: OBB_LEG_QUOTES_UPDATE_STATE,
    payload: { urn, unquotedLegs },
  };

  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when there are no errors", () => {
    it("should fetch OBB leg quotes and dispatch success action", async () => {
      setup();

      buildCardQuoteInputPvpLeg.mockReturnValueOnce(quoteInputLegs[0]);
      buildCardQuoteInputPvpLeg.mockReturnValueOnce(quoteInputLegs[1]);

      catalogueService.getObbQuotes.mockResolvedValueOnce(mockLegQuotes);
      catalogueService.getObbQuotes.mockResolvedValueOnce(mockLeg1Quotes);

      await putActions([action]);

      expect(catalogueService.getObbQuotes).toHaveBeenNthCalledWith(
        1,
        {
          eventId: { id: "123", supplier: Supplier.Sportex },
          toQuote: [
            {
              id: "selectedLegId",
              expressionTemplateId: "expressionTemplateId",
              expressionParams: {
                outcomeId: "outcomeId",
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                timePeriodId: "timePeriodId",
              },
            },
          ],
        },
        OVERRIDEN_THROTTLES,
      );

      expect(catalogueService.getObbQuotes).toHaveBeenNthCalledWith(
        2,
        {
          eventId: { id: "456", supplier: Supplier.Sportex },
          toQuote: [
            {
              id: "selectedLegId1",
              expressionTemplateId: "expressionTemplateId",
              expressionParams: {
                outcomeId: "outcomeId",
                participantIdA: "participantIdB",
                participantIdB: "participantIdA",
                timePeriodId: "timePeriodId",
              },
            },
          ],
        },
        OVERRIDEN_THROTTLES,
      );

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: OBB_CARD__UPDATE_LEGS,
        payload: { urn: "URN:1", legs: unquotedLegs },
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
        payload: {
          urn: "URN:1",
          obbQuotes: [
            { id: "legId", price: { decimal: 2 }, result: { resultCode: "SUCCESS" } },
            { id: "legId1", price: { decimal: 5 }, result: { resultCode: "SUCCESS" } },
          ],
        },
      });
    });
  });

  describe("when getObbQuotes does not return data", () => {
    it("should default to empty array", async () => {
      setup();

      catalogueService.getObbQuotes.mockResolvedValueOnce({});
      catalogueService.getObbQuotes.mockResolvedValueOnce({});

      buildCardQuoteInputPvpLeg.mockReturnValueOnce(quoteInputLegs[0]);
      buildCardQuoteInputPvpLeg.mockReturnValueOnce(quoteInputLegs[1]);

      await putActions([action]);

      expect(catalogueService.getObbQuotes).toHaveBeenNthCalledWith(
        1,
        {
          eventId: { id: "123", supplier: Supplier.Sportex },
          toQuote: [
            {
              id: "selectedLegId",
              expressionTemplateId: "expressionTemplateId",
              expressionParams: {
                outcomeId: "outcomeId",
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                timePeriodId: "timePeriodId",
              },
            },
          ],
        },
        OVERRIDEN_THROTTLES,
      );

      expect(catalogueService.getObbQuotes).toHaveBeenNthCalledWith(
        2,
        {
          eventId: { id: "456", supplier: Supplier.Sportex },
          toQuote: [
            {
              id: "selectedLegId1",
              expressionTemplateId: "expressionTemplateId",
              expressionParams: {
                outcomeId: "outcomeId",
                participantIdA: "participantIdB",
                participantIdB: "participantIdA",
                timePeriodId: "timePeriodId",
              },
            },
          ],
        },
        OVERRIDEN_THROTTLES,
      );

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: OBB_CARD__UPDATE_LEGS,
        payload: { urn: "URN:1", legs: unquotedLegs },
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
        payload: { urn: "URN:1", obbQuotes: [] },
      });
    });
  });

  describe("when there are errors", () => {
    it("should handle errors and dispatch failure action", async () => {
      setup();

      await putActions([{ ...action, payload: undefined }]);

      expect(catalogueService.getObbQuotes).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE,
        payload: {},
      });
    });
  });
});

describe("getObbEventParticipants Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early without fetching participants", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
          payload: {
            event: "event:urn",
            incidentType: "GOALS",
            period: "MATCH",
            cardUrn: "card:urn",
          },
        },
      ]);

      expect(catalogueService.getObbEventParticipants).not.toHaveBeenCalled();
    });
  });

  describe("when the card as no eventParticipants", () => {
    it("should return early without fetching participants", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:1"]);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
          payload: {
            event: "event:urn",
            incidentType: "GOALS",
            period: "MATCH",
            cardUrn: "card:urn",
          },
        },
      ]);

      expect(catalogueService.getObbEventParticipants).not.toHaveBeenCalled();
    });
  });

  describe("when the result return obb as null", () => {
    it("should return early without fetching participants", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      catalogueService.getObbEventParticipants.mockResolvedValueOnce({ obb: null });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
          payload: {
            event: "event:urn",
            incidentType: "GOALS",
            period: "MATCH",
            cardUrn: "card:urn",
          },
        },
      ]);

      expect(catalogueService.getObbEventParticipants).toHaveBeenCalledWith(
        { event: "event:urn", incidentType: "GOALS", period: "MATCH" },
        { incidentType: "GOALS", period: "MATCH" },
        { throttlesOff: ["3"], throttlesOn: ["1", "2"] },
      );
    });
  });

  describe("when event participants returns data", () => {
    it("should return dispatch the sucess and update squad bet modal participants", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      catalogueService.getObbEventParticipants.mockResolvedValueOnce({
        obb: { eventParticipants: [{ urn: "urn:response:1" }] },
      });
      updateParticipantsActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
        payload: { cardUrn: "card:urn" },
      });
      updateParticipantsActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
        payload: { cardUrn: "card:urn" },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
          payload: {
            event: "event:urn",
            incidentType: "GOALS",
            period: "MATCH",
            cardUrn: "card:urn",
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(3);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
        payload: {
          requestInput: {
            period: "MATCH",
            incidentType: "GOALS",
            event: "event:urn",
          },
          cardParticipants: ["some:urn:2"],
          eventParticipants: [{ urn: "urn:response:1" }],
          cardUrn: "card:urn",
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
        payload: { cardUrn: "card:urn" },
      });

      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
        payload: { cardUrn: "card:urn" },
      });
    });
  });

  describe("when event participants throws an error", () => {
    it("should dispatch FAILURE NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      catalogueService.getObbEventParticipants.mockRejectedValueOnce(new Error("boom"));
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
          payload: {
            event: "event:urn",
            incidentType: "GOALS",
            period: "MATCH",
            cardUrn: "card:urn",
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE,
      });
    });
  });
});

describe("getObbModalQuotes Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(getCardWithModalFieldsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when cardWithModalFields is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(undefined);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(hasEmptyParticipantsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card doesn't have any modalParticipants", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce({ ...squadBetCardWithModalFields, modalParticipants: [] });
      hasEmptyParticipantsSpy.mockReturnValueOnce(true);
      fetchQuotesSuccessActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: { cardUrn: "card:urn", obbQuotes: [], defaultOutcomeIndex: 0 },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });
      expect(getQuotesApiSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card is found and has modalParticipants", () => {
    it("should call the getQuotesApi service", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: true },
      });
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      buildValuesRange.mockReturnValueOnce({ min: 1, max: 10 });
      catalogueService.getObbSquadbetQuotes.mockResolvedValueOnce({ obb: null });
      getQuotesErrorsSpy.mockReturnValueOnce([]);
      clearModalErrorActionSpy.mockReturnValueOnce({
        type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
        payload: { cardUrn: "card:urn" },
      });
      fetchQuotesSuccessActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(setQuotesIsLoadingActionSpy).toHaveBeenCalledTimes(2);

      expect(dispatch).toHaveBeenCalledTimes(4);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: true },
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
        payload: { cardUrn: "card:urn" },
      });

      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: false },
        }),
      );
    });
  });

  describe("when getQuotesApi returns a leg with an 'OUTCOME_DEFINITION_NOT_FOUND'", () => {
    it("should call setPlayerRemovedModalErrorAction and getEventParticipantsAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      buildUnquotedLegsSpy.mockReturnValueOnce([]);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      catalogueService.getObbSquadbetQuotes.mockResolvedValueOnce({
        obb: {
          quotes: {
            prices: [{ id: "someLegId", result: { resultCode: "OUTCOME_DEFINITION_NOT_FOUND" } }],
          },
        },
      });
      getQuotesErrorsSpy.mockReturnValueOnce(["OUTCOME_DEFINITION_NOT_FOUND"]);

      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: true },
      });
      setPlayerRemovedModalErrorActionSpy.mockReturnValueOnce({
        type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
        payload: { cardUrn: "card:urn", errorCode: "PLAYER_REMOVED_FROM_LINEUP" },
      });
      getEventParticipantsActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
        payload: {
          cardUrn: "card:urn",
          event: "eventUrn",
          incidentType: "GOALS",
          period: "MATCH",
        },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });

      setup();
      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(setQuotesIsLoadingActionSpy).toHaveBeenCalledTimes(2);
      expect(setPlayerRemovedModalErrorActionSpy).toHaveBeenCalledTimes(1);
      expect(getEventParticipantsActionSpy).toHaveBeenCalledTimes(1);

      expect(setPlayerRemovedModalErrorActionSpy).toHaveBeenCalledWith(
        "card:urn",
        ["OUTCOME_DEFINITION_NOT_FOUND"],
        null,
      );

      expect(getEventParticipantsActionSpy).toHaveBeenCalledWith("card:urn", "eventUrn", "GOALS");

      expect(dispatch).toHaveBeenCalledTimes(4);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: true },
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
        payload: {
          cardUrn: "card:urn",
          errorCode: "PLAYER_REMOVED_FROM_LINEUP",
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
        payload: {
          cardUrn: "card:urn",
          event: "eventUrn",
          incidentType: "GOALS",
          period: "MATCH",
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: false },
        }),
      );
    });
  });

  describe("when getQuotesApi throws an error", () => {
    it("should dispatch fetchQuotesFailureAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: true },
      });
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      fetchQuotesFailureActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
        payload: { error: "boom" },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });
      catalogueService.getObbSquadbetQuotes.mockRejectedValueOnce(new Error("boom"));

      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(setQuotesIsLoadingActionSpy).toHaveBeenCalledTimes(2);

      expect(dispatch).toHaveBeenCalledTimes(3);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: true },
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE,
          payload: { error: "boom" },
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: false },
        }),
      );
    });
  });

  describe("when the getQuotesApi succeeds but a new error is returned", () => {
    it("should dispatch setModalErrorAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: true },
      });
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      buildValuesRange.mockReturnValueOnce({ min: 1, max: 10 });
      catalogueService.getObbSquadbetQuotes.mockResolvedValueOnce({ obb: null });
      getQuotesErrorsSpy.mockReturnValueOnce(["IMPOSSIBLE_OBB_CHOICE"]);
      setModalErrorActionSpy.mockReturnValueOnce({
        type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
        payload: {
          cardUrn: "card:urn",
          errorCode: "IMPOSSIBLE_OBB_CHOICE",
        },
      });
      fetchQuotesSuccessActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: false },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(setQuotesIsLoadingActionSpy).toHaveBeenCalledTimes(2);

      expect(dispatch).toHaveBeenCalledTimes(4);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: true },
        }),
      );

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        type: OBB_CARD__SET_SQUADBET_MODAL_ERROR,
        payload: {
          cardUrn: "card:urn",
          errorCode: "IMPOSSIBLE_OBB_CHOICE",
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(3, {
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: false },
        }),
      );
    });
  });
});

describe("getObbMainCardQuotes Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(getCardWithModalFieldsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when cardWithModalFields is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(undefined);
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(hasEmptyParticipantsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card doesn't have any squadParticipants", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce({ ...squadBetCardWithModalFields, squadParticipants: [] });
      hasEmptyParticipantsSpy.mockReturnValueOnce(true);
      fetchQuotesSuccessActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
        payload: { cardUrn: "card:urn", obbQuotes: [], defaultOutcomeIndex: 0 },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
      expect(getQuotesApiSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card is found and has squadParticipants", () => {
    it("should call the getQuotesApi service", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      buildValuesRange.mockReturnValueOnce({ min: 1, max: 10 });
      catalogueService.getObbSquadbetQuotes.mockResolvedValueOnce({ obb: null });
      getQuotesErrorsSpy.mockReturnValueOnce([]);
      fetchQuotesSuccessActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          obbQuotes: [],
          defaultOutcomeIndex: 0,
        },
      });
    });
  });

  describe("when getQuotesApi returns a leg with an 'OUTCOME_DEFINITION_NOT_FOUND'", () => {
    it("should call getEventParticipantsAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      buildUnquotedLegsSpy.mockReturnValueOnce([]);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      catalogueService.getObbSquadbetQuotes.mockResolvedValueOnce({
        obb: {
          quotes: {
            prices: [{ id: "someLegId", result: { resultCode: "OUTCOME_DEFINITION_NOT_FOUND" } }],
          },
        },
      });
      getQuotesErrorsSpy.mockReturnValueOnce(["OUTCOME_DEFINITION_NOT_FOUND"]);
      getHighestPriorityError.mockReturnValueOnce("PLAYER_REMOVED_FROM_LINEUP");
      getEventParticipantsActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
        payload: {
          cardUrn: "card:urn",
          event: "eventUrn",
          incidentType: "GOALS",
          period: "MATCH",
        },
      });

      setup();
      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(getEventParticipantsActionSpy).toHaveBeenCalledTimes(1);

      expect(getEventParticipantsActionSpy).toHaveBeenCalledWith("card:urn", "eventUrn", "GOALS");

      expect(dispatch).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
        payload: {
          cardUrn: "card:urn",
          event: "eventUrn",
          incidentType: "GOALS",
          period: "MATCH",
        },
      });
    });
  });

  describe("when getQuotesApi throws an error", () => {
    it("should dispatch fetchQuotesFailureAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      hasEmptyParticipantsSpy.mockReturnValueOnce(false);
      buildUnquotedLegsSpy.mockReturnValueOnce([]);
      getObbQuotesRequestInputSpy.mockReturnValueOnce({});
      getQuotesApiSpy.mockReturnValueOnce(catalogueService.getObbSquadbetQuotes);
      fetchQuotesFailureActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
        payload: { error: "boom" },
      });
      catalogueService.getObbSquadbetQuotes.mockRejectedValueOnce(new Error("boom"));

      setup();

      await putActions([
        {
          type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);

      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE,
          payload: { error: "boom" },
        }),
      );
    });
  });
});

describe("updateModalParticipants Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(getParticipantsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when cardWithModalFields is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(undefined);
      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(toggleModalParticipantActionSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card is valid", () => {
    it("should dispatch updateParticipantsSuccessAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      getParticipantsSpy.mockReturnValueOnce(["urn:123", "urn:456"]);
      updateParticipantsSuccessActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
        payload: {
          cardUrn: "card:urn",
          participants: [],
        },
      });
      hasParticipantsChangedSpy.mockReturnValueOnce(true);
      fetchQuotesActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_SQUADBET_QUOTES,
        payload: { cardUrn: "card:urn" },
      });

      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [] },
      });
    });
  });
});

describe("updateMainCardParticipants Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(getCardWithModalFieldsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when cardWithModalFields is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(undefined);
      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(toggleModalParticipantActionSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the card is valid", () => {
    it("should dispatch the OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS action", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      getParticipantsSpy.mockReturnValueOnce(["urn:123", "urn:456"]);
      updateParticipantsSuccessActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [] },
      });

      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [] },
      });
    });
  });

  describe("when the participants have changed", () => {
    it("should dispatch fetchQuotesAction", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      getParticipantsSpy.mockReturnValueOnce([]);
      hasParticipantsChangedSpy.mockReturnValueOnce(true);
      updateParticipantsSuccessActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [] },
      });
      fetchQuotesActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES,
        payload: { cardUrn: "card:urn" },
      });

      setup();

      await putActions([
        {
          type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [] },
      });
      expect(fetchQuotesActionSpy).toHaveBeenCalledWith("card:urn", false);
    });
  });
});

describe("onModalOpen Saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__ON_SQUADBET_MODAL_OPEN,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the card is valid", () => {
    it("should dispatch setModalDefaultStateAction and setQuotesIsLoadingAction and call getObbEventParticipants and getObbModalQuotes", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      setModalDefaultStateActionSpy.mockReturnValueOnce({
        type: OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
        payload: { cardUrn: "card:urn" },
      });
      setQuotesIsLoadingActionSpy.mockReturnValueOnce({
        type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
        payload: { cardUrn: "card:urn", isLoadingQuotes: true },
      });
      getEventParticipantsActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_EVENT_PARTICIPANTS,
        payload: {
          cardUrn: "card:urn",
          event: "eventUrn",
          incidentType: "GOALS",
          period: "SQUADBET_TIME_PERIOD",
        },
      });
      fetchQuotesActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_SQUADBET_QUOTES,
        payload: { cardUrn: "card:urn" },
      });
      setup();

      await putActions([
        {
          type: OBB_CARD__ON_SQUADBET_MODAL_OPEN,
          payload: { cardUrn: "card:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
          payload: { cardUrn: "card:urn" },
        }),
      );
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
          payload: { cardUrn: "card:urn", isLoadingQuotes: true },
        }),
      );
    });
  });
});

describe("toggleModalParticipantAction saga", () => {
  afterEach(() => {
    jest.clearAllMocks();
    stopSaga();
  });

  describe("when the card is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(null);
      setup();

      await putActions([
        {
          type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
          payload: { cardUrn: "card:urn", participantUrn: "participant:urn" },
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when cardWithModalFields is not found", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce(STATE.layouts.cards.obbcards["URN:2"]);
      getCardWithModalFieldsSpy.mockReturnValueOnce(undefined);
      setup();

      await putActions([
        {
          type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
          payload: { cardUrn: "card:urn", participantUrn: "participant:urn" },
        },
      ]);

      expect(toggleModalParticipantActionSpy).not.toHaveBeenCalled();
    });
  });

  describe("when the participant is not available in the event", () => {
    it("should return early", async () => {
      getCardByURN.mockReturnValueOnce({
        urn: "card:urn",
        typename: "ObbSquadBetCard",
      });
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      setup();

      await putActions([
        {
          type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
          payload: { cardUrn: "card:urn", participantUrn: "participant:urn" },
        },
      ]);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the participant and the card are valid", () => {
    it("should dispatch toggleModalParticipantAction", async () => {
      getCardByURN.mockReturnValueOnce({
        urn: "card:urn",
        typename: "ObbSquadBetCard",
      });
      getCardWithModalFieldsSpy.mockReturnValueOnce(squadBetCardWithModalFields);
      toggleModalParticipantActionSpy.mockReturnValueOnce({
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [squadBetCardWithModalFields.eventParticipants[1].urn] },
      });
      fetchQuotesActionSpy.mockReturnValueOnce({
        type: OBB_CARD__FETCH_SQUADBET_QUOTES,
        payload: { cardUrn: "card:urn" },
      });

      setup();

      await putActions([
        {
          type: OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT,
          payload: { cardUrn: "card:urn", participantUrn: "player1:urn" },
        },
      ]);

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
        payload: { cardUrn: "card:urn", participants: [squadBetCardWithModalFields.eventParticipants[1].urn] },
      });
    });
  });
});

describe("getCardStrategy", () => {
  it("returns SquadBetStrategy when typename is ObbSquadBetCard", () => {
    const card = { typename: "ObbSquadBetCard" };
    const result = getCardStrategy(card);

    expect(result).toBe(SquadBetStrategy);
  });

  it("returns SquadVsSquadStrategy for typename ObbSquadVsSquadCard", () => {
    const card = { typename: "ObbSquadVsSquadCard" };
    const result = getCardStrategy(card);

    expect(result).toBe(SquadVsSquadStrategy);
  });

  it("returns undefined for other typename", () => {
    const card = { typename: "OtherTypename" };
    const result = getCardStrategy(card);

    expect(result).toBe(undefined);
  });
});
