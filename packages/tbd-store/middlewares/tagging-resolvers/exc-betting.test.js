import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";
import {
  getDontUpdateBetClickEvent,
  getUpdateBetClickEvent,
  getOpenPersistenceTypeMenuEvent,
  getCancelBetClickEvent,
  getBetslipCancelBetClickEvent,
  getChangePersistenceTypeClickEvent,
  getPlaceExchangeBetClickEvent,
  getBetslipExchangeRemoveSelectionEvent,
  getExchangeAddSelectionToBetslip,
  getExcIncrementSizeEvent,
  getExchangeOnClickEdit,
  getBetReceiptExchangeDoneClickEvent,
  getExchangeBetEditSuccessfull,
  getUpdateBetFailureEvent,
  getExchangeFailedPlaceBetEvent,
  getExchangeSuccessPlaceBetEvent,
  getExchangeSuccessPlaceBetSelectionEvent,
  getExchangePriceChangeEvent,
  getMyBetsEditClickEvent,
  getMyBetsEditBottomSheetCloseEvent,
  getBetslipExchangeLoginToPlaceBetClickEvent,
  getMyBetsExchangeOrderStatusClickEvent,
} from "./exc-betting";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createBettableCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import {
  getExchangeRunnerTree,
  createExcRunnerPotentialBetsByRunnerURNSelector,
} from "../../state/entities/entities-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getExchangeOrder } from "../../state/betting/exchange-orders/exchange-order-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getRunnerUniqueTaggingId } from "../../helpers/betting";
import { ExchangeSide } from "../../state/constants";

const getPreferencesWithProductSwitcherSelector = jest.fn();

jest.mock("../../state/betslip/betslip-card-selectors");
jest.mock("../../state/layout/views/event-view/event-view-selectors");
jest.mock("../../state/entities/entities-selectors");
jest.mock("../../state/layout/cards/cards-selectors");
jest.mock("../../state/entities/competitions/competition-selectors");
jest.mock("../../state/entities/exchange-runners/exchange-runners-reducer");
jest.mock("../../state/entities/user-details/user-details-selectors");
jest.mock("../../state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getPreferencesWithProductSwitcherSelector),
}));
jest.mock("../../state/entities/sport-events/sport-event-selectors");
jest.mock("../../state/entities/exchange-markets/exchange-market-selectors");
jest.mock("../../state/betting/exchange-orders/exchange-order-selectors");
jest.mock("../../state/entities/sports/sport-selectors");
jest.mock("../../state/layout/layout-selectors", () => ({
  createCardParentTitlesByURNSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      groupTitle: "groupTitle",
      tabTitle: "tabTitle",
    }),
  ),
  createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("someViewType")),
}));
jest.mock("../../state/application-state-selectors", () => ({
  createGetSwimlaneUrnByCardUrnSelector: jest.fn(jest.fn),
}));
jest.mock("../../state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(),
}));
jest.mock("../../state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn().mockReturnValue("17:00"),
}));
jest.mock("../../helpers/betting", () => ({
  getRunnerUniqueTaggingId: jest.fn(() => {}),
}));

const getRaceByURN = jest
  .fn()
  .mockReturnValue({ raceId: "raceId", name: "Race Name", startTime: "2020-07-01T16:00:00.000Z" });
const getMeetingByURN = jest
  .fn()
  .mockReturnValue({ meetingId: "meetingId", entityName: "Meeting Name", venue: "Newcastle" });
const getViewTypeSelector = jest.fn().mockReturnValue("EVENT");

const metadata = {
  cardGroupTitle: "In-Play",
  tabName: "null",
};

beforeEach(jest.clearAllMocks);

describe("Exchange Betting gtm resolvers", () => {
  describe("getDontUpdateBetClickEvent", () => {
    it("should return the correct event payload", () => {
      expect(getDontUpdateBetClickEvent()).toEqual({
        event: "ga_event",
        action: "edited bet",
        category: "exchange betting",
        label: "don't update",
        [APPLICATION.MODULE]: "betslip",
      });
    });
  });

  describe("getUpdateBetClickEvent", () => {
    it("should return the correct event payload", () => {
      expect(getUpdateBetClickEvent(ExchangeSide.BACK)).toEqual({
        event: "ga_event",
        action: "submitted bet",
        category: "exchange betting",
        label: "submitted bet - unmatched update",
        [APPLICATION.MODULE]: "betslip",
        [BUSINESS.BET_DIRECTION]: "back",
      });
    });
  });

  describe("getOpenPersistenceTypeMenuEvent", () => {
    it("should return the correct event payload", () => {
      expect(getOpenPersistenceTypeMenuEvent()).toEqual({
        event: "ga_event",
        action: "show",
        category: "exchange betting",
        label: "at in play options",
        [APPLICATION.MODULE]: "betslip",
      });
    });
  });

  describe("getCancelBetClickEvent", () => {
    const cancelBetClickEventSetup = (error) => {
      const label = "mockLabel";
      const action = "taggingActionMock";
      const side = ExchangeSide.BACK;
      const moduleName = "betslipMock";

      return getCancelBetClickEvent(action, label, moduleName, side, error);
    };

    describe("when there is an ETX error", () => {
      it("should return the correct event payload", () => {
        const error = "ETX_ERROR";
        const event = cancelBetClickEventSetup(error);

        expect(event).toEqual({
          event: "ga_event",
          action: "taggingActionMock",
          category: "exchange betting",
          label: "mockLabel",
          [APPLICATION.MODULE]: "betslipMock",
          [BUSINESS.BET_DIRECTION]: "back",
          [BUSINESS.ERROR_CODE]: "ETX_ERROR",
        });
      });
    });

    describe("when there is no error", () => {
      it("should return the correct event payload", () => {
        const event = cancelBetClickEventSetup();

        expect(event).toEqual({
          event: "ga_event",
          action: "taggingActionMock",
          category: "exchange betting",
          label: "mockLabel",
          [APPLICATION.MODULE]: "betslipMock",
          [BUSINESS.BET_DIRECTION]: "back",
        });
      });
    });
  });

  describe("getBetslipCancelBetClickEvent", () => {
    const betslipCancelBetClickEventSetup = (error) => {
      const appState = "stateMock";
      const label = "mockLabel";
      const action = "taggingActionMock";

      getBetslipExchangeContext.mockReturnValue({ side: ExchangeSide.BACK });

      return getBetslipCancelBetClickEvent(appState, action, label, error);
    };

    it("should get BetslipExchangeContext", () => {
      betslipCancelBetClickEventSetup();

      expect(getBetslipExchangeContext).toHaveBeenCalledWith("stateMock");

      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
    });

    describe("when BetslipExchangeContext is not defined", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValueOnce(undefined);
        const event = betslipCancelBetClickEventSetup();

        expect(event).toEqual(null);
      });
    });

    describe("when there is an ETX error", () => {
      it("should return the correct event payload", () => {
        const error = "ETX_ERROR";
        const event = betslipCancelBetClickEventSetup(error);

        expect(event).toEqual({
          event: "ga_event",
          action: "taggingActionMock",
          category: "exchange betting",
          label: "mockLabel",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.BET_DIRECTION]: "back",
          [BUSINESS.ERROR_CODE]: "ETX_ERROR",
        });
      });
    });

    describe("when there is no error", () => {
      it("should return the correct event payload", () => {
        const event = betslipCancelBetClickEventSetup();

        expect(event).toEqual({
          event: "ga_event",
          action: "taggingActionMock",
          category: "exchange betting",
          label: "mockLabel",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.BET_DIRECTION]: "back",
        });
      });
    });
  });

  describe("getUpdateBetFailureEvent", () => {
    const getUpdateBetFailureEventSetup = () => {
      const appState = "stateMock";
      const errorCode = "ETX_ERROR_MOCK";
      getBetslipExchangeContext.mockReturnValue({ side: ExchangeSide.BACK });

      return getUpdateBetFailureEvent(appState, errorCode);
    };

    it("should get BetslipExchangeContext", () => {
      getUpdateBetFailureEventSetup();

      expect(getBetslipExchangeContext).toHaveBeenCalledWith("stateMock");

      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
    });

    it("should return the correct event payload", () => {
      const event = getUpdateBetFailureEventSetup();

      expect(event).toEqual({
        event: "ga_event",
        action: "updated unmatched bet - error",
        category: "exchange betting",
        label: "etx_error_mock",
        [APPLICATION.MODULE]: "betslip",
        [BUSINESS.BET_DIRECTION]: "back",
        [BUSINESS.ERROR_CODE]: "ETX_ERROR_MOCK",
      });
    });
  });

  describe("getExchangeSuccessPlaceBetEvent", () => {
    const APP_STATE = { entities: { preferences: "PREFERENCES" } };

    function setup({ exchangeConfirmBetPlacement = false } = {}) {
      getUserDetails.mockReturnValue({ currencyCode: "EUR" });
      getPreferencesWithProductSwitcherSelector.mockReturnValue({ exchangeConfirmBetPlacement });

      return getExchangeSuccessPlaceBetEvent(APP_STATE, { betId: "some betId" });
    }

    describe("when exchangeConfirmBetPlacement is true", () => {
      it("should send CONFIRM_BETS_INDICATOR as yes", () => {
        const event = setup({ exchangeConfirmBetPlacement: true });
        expect(event[BUSINESS.CONFIRM_BETS_INDICATOR]).toBe("yes");
      });
    });
    describe("when exchangeConfirmBetPlacement is false", () => {
      it("should send CONFIRM_BETS_INDICATOR as no", () => {
        const event = setup({ exchangeConfirmBetPlacement: false });
        expect(event[BUSINESS.CONFIRM_BETS_INDICATOR]).toBe("no");
      });
    });

    it("should call user details with app state", () => {
      setup({ exchangeConfirmBetPlacement: false });

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    it("should call getPreferencesWithProductSwitcherSelector with app state", () => {
      setup({ exchangeConfirmBetPlacement: false });

      expect(getPreferencesWithProductSwitcherSelector).toHaveBeenCalledWith("PREFERENCES");
      expect(getPreferencesWithProductSwitcherSelector).toHaveBeenCalledTimes(1);
    });

    it("should return the correct event payload", () => {
      const event = setup();

      expect(event).toEqual({
        event: "ga_event",
        action: "placed bet",
        category: "exchange betting",
        label: "placed bet",
        [APPLICATION.MODULE]: "betslip",
        [BUSINESS.CURRENCY_CODE]: "EUR",
        [BUSINESS.BET_ID]: "some betId",
        [BUSINESS.BET_TYPE_GROUP]: "single",
        [BUSINESS.BET_TYPE]: "single",
        [BUSINESS.CONFIRM_BETS_INDICATOR]: "no",
      });
    });
  });

  describe("getExchangeSuccessPlaceBetSelectionEvent", () => {
    const APP_STATE = {
      entities: {
        competitions: {
          "COMP:1": {
            name: "some competition",
          },
        },
      },
    };

    function setup({
      currencyCode = "EUR",
      reportMatched = {},
      reportUnmatched = {},
      reportSide = ExchangeSide.BACK,
    } = {}) {
      getUserDetails.mockReturnValue({ currencyCode, accountId: "12345" });
      getExchangeRunnerTree.mockReturnValue({
        market: {
          name: "some market name",
          marketId: "some marketId",
          hierarchy: {
            sportevent: "EVENT:1",
            competition: "COMP:1",
          },
        },
        marketRunner: {
          selectionId: 123,
          name: "some runner name",
        },
        event: {
          name: "some event name",
          eventId: "some eventId",
        },
        sport: {
          sportId: 1,
          name: "some sport name",
        },
        runner: {
          market: "market:urn",
          selectionId: 123,
        },
      });
      getCompetitionByURN.mockReturnValue({
        name: "some competition name",
        competitionId: "COMP:1",
      });

      getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
      createRaceByURNSelector.mockReturnValue(getRaceByURN);
      createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
      createViewTypeSelector.mockImplementation(() => getViewTypeSelector);
      getRunnerUniqueTaggingId.mockReturnValueOnce("uniqueId");

      return getExchangeSuccessPlaceBetSelectionEvent(APP_STATE, {
        report: {
          runner: "some runner URN",
          matched: reportMatched,
          unmatched: reportUnmatched,
          side: reportSide,
        },
        betId: "some betId",
      });
    }

    it("should call user details", () => {
      setup({});

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    it("should call getExchangeRunnerTree", () => {
      setup({});

      expect(getExchangeRunnerTree).toHaveBeenCalledWith(APP_STATE.entities, "some runner URN");
      expect(getExchangeRunnerTree).toHaveBeenCalledTimes(1);
    });

    it("should call getCompetitionByURN", () => {
      setup({});

      expect(getCompetitionByURN).toHaveBeenCalledWith(APP_STATE.entities.competitions, "COMP:1");
      expect(getCompetitionByURN).toHaveBeenCalledTimes(1);
    });

    it("should call getRunnerUniqueTaggingId", () => {
      setup({});

      expect(getRunnerUniqueTaggingId).toHaveBeenCalledWith(APP_STATE, "some runner URN");
      expect(getRunnerUniqueTaggingId).toHaveBeenCalledTimes(1);
    });

    it("should return the correct event payload", () => {
      const event = setup({
        reportMatched: {
          price: 2,
          size: 1,
        },
      });

      expect(event).toEqual({
        event: "ga_event",
        action: "placed bet",
        category: "exchange betting",
        label: "selection",
        [APPLICATION.MODULE]: "betslip",
        [BUSINESS.CURRENCY_CODE]: "EUR",
        [BUSINESS.EACHWAY_INDICATOR]: "no",
        [BUSINESS.BET_ID]: "some betId",
        [BUSINESS.SPORT_ID]: 1,
        [BUSINESS.SPORT_NAME]: "some sport name",
        [BUSINESS.EVENT_ID]: 2,
        [BUSINESS.EVENT_NAME]: "Sporting vs Porto",
        [BUSINESS.MARKET_ID]: "some marketId",
        [BUSINESS.MARKET_NAME]: "some market name",
        [BUSINESS.SELECTION_ID]: 123,
        [BUSINESS.SELECTION_NAME]: "some runner name",
        [BUSINESS.COMPETITION_ID]: "COMP:1",
        [BUSINESS.COMPETITION_NAME]: "some competition name",
        [BUSINESS.ANTEPOST_FLAG]: "no",
        [BUSINESS.IN_PLAY_INDICATOR]: "no",
        [BUSINESS.BET_DIRECTION]: "back",
        [BUSINESS.BET_RESPONSE]: "matched",
        [BUSINESS.PRICE_AT_BET]: 2,
        [BUSINESS.STAKE_AMOUNT]: 1,
        [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
      });
    });

    describe("BET_RESPONSE", () => {
      describe("when the bet was all matched", () => {
        it("should send BET_RESPONSE as matched", () => {
          const event = setup({
            reportMatched: {
              price: 2,
            },
          });
          expect(event[BUSINESS.BET_RESPONSE]).toBe("matched");
        });
      });
      describe("when the bet was all unmatched", () => {
        it("should send BET_RESPONSE as unmatched", () => {
          const event = setup({
            reportUnmatched: {
              price: 2,
            },
          });
          expect(event[BUSINESS.BET_RESPONSE]).toBe("unmatched");
        });
      });
      describe("when the bet was partially matched", () => {
        it("should send BET_RESPONSE as partially matched", () => {
          const event = setup({
            reportMatched: {
              price: 2,
            },
            reportUnmatched: {
              price: 2,
            },
          });
          expect(event[BUSINESS.BET_RESPONSE]).toBe("partially-matched");
        });
      });
    });
  });

  describe("getChangePersistenceTypeClickEvent", () => {
    const changePersistenceTypeSetup = (betslipContextReturn) => {
      const appState = "stateMock";
      const persistenceType = "LAPSE";

      getBetslipExchangeContext.mockReturnValue(betslipContextReturn);

      return getChangePersistenceTypeClickEvent(appState, persistenceType);
    };

    it("should get BetslipExchangeContext", () => {
      changePersistenceTypeSetup();

      expect(getBetslipExchangeContext).toHaveBeenCalledWith("stateMock");

      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
    });

    describe("when there is betslipContext", () => {
      it("should return the correct event payload", () => {
        const betslipContextReturn = { side: ExchangeSide.BACK };
        const event = changePersistenceTypeSetup(betslipContextReturn);

        expect(event).toEqual({
          event: "ga_event",
          action: "toggled on",
          category: "exchange betting",
          label: "LAPSE",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.BET_DIRECTION]: "back",
        });
      });
    });

    describe("when there isn't betslipContext", () => {
      it("should return the correct event payload", () => {
        const event = changePersistenceTypeSetup();

        expect(event).toEqual(null);
      });
    });
  });

  describe("getPlaceExchangeBetClickEvent", () => {
    describe("when there is no betslip exchange context", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValue(undefined);
        const stateMock = {
          mock: "state",
        };
        const event = getPlaceExchangeBetClickEvent(stateMock);

        expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
        expect(getBetslipExchangeContext).toHaveBeenCalledWith(stateMock);
        expect(event).toBe(null);
      });
    });
    describe("when there is no potential bets", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn" });
        const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => []);
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(getExcRunnerPotentialBetsByRunnerURN);
        const stateMock = {
          entities: {},
          mock: "state",
        };
        const event = getPlaceExchangeBetClickEvent(stateMock);

        expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledTimes(1);
        expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(stateMock, "betslip:context:runner:urn");
        expect(event).toBe(null);
      });
    });
    describe("when there is potential bets", () => {
      it("should return event payload", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn", side: ExchangeSide.BACK });
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => [
          {
            some: "potential bet",
            side: ExchangeSide.BACK,
          },
        ]);
        const stateMock = {
          mock: "state",
        };
        const event = getPlaceExchangeBetClickEvent(stateMock);

        expect(event).toEqual({
          event: "ga_event",
          action: "submitted bet",
          category: "exchange betting",
          label: "place bet",
          cd3: "betslip",
          cd11: "back",
        });
      });
    });
  });

  describe("getExchangeFailedPlaceBetEvent", () => {
    describe("when there is no betslip exchange context", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValue(undefined);
        const stateMock = {
          mock: "state",
        };
        const errorMock = {
          errorCode: "theGreatestError",
        };
        const event = getExchangeFailedPlaceBetEvent(stateMock, errorMock, ExchangeSide.BACK);

        expect(getBetslipExchangeContext).toHaveBeenCalledWith(stateMock);
        expect(getBetslipExchangeContext).toHaveBeenCalledTimes(1);
        expect(event).toBe(null);
      });
    });

    describe("when there is potential bets", () => {
      it("should return event payload", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn", side: ExchangeSide.BACK });
        const stateMock = {
          mock: "state",
        };
        const errorMock = {
          errorCode: "theGreatestError",
        };
        const event = getExchangeFailedPlaceBetEvent(stateMock, errorMock, ExchangeSide.BACK);

        expect(event).toEqual({
          event: "ga_event",
          action: "placed bet - error",
          category: "exchange betting",
          label: "theGreatestError",
          cd3: "betslip",
          cd11: "back",
          cd99: "theGreatestError",
        });
      });
    });
  });

  describe("getExcIncrementSizeEvent", () => {
    describe("and currencySymbol exists", () => {
      it("should return event payload label with symbol", () => {
        expect(getExcIncrementSizeEvent("5", "€")).toEqual({
          event: "ga_event",
          action: "selected",
          category: "exchange betting",
          label: "+€5 quick stake",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });

    describe("and currencySymbol is undefined", () => {
      it("should return event payload label without symbol", () => {
        expect(getExcIncrementSizeEvent("10", undefined)).toEqual({
          event: "ga_event",
          action: "selected",
          category: "exchange betting",
          label: "+10 quick stake",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });
  });

  describe("getBetslipExchangeRemoveSelectionEvent", () => {
    function setup(potentialBets) {
      const state = {
        entities: {
          exchangerunners: "exchangerunners",
          exchangemarkets: "exchangemarkets",
          sports: "sports",
        },
      };

      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => potentialBets);

      return getBetslipExchangeRemoveSelectionEvent(state);
    }

    describe("when the selection is not being removed or replaced", () => {
      it("should return null", () => {
        const event = setup([]);

        expect(event).toEqual(null);
      });
    });

    describe("when the selection is being removed or replaced", () => {
      describe("when there is no betslip exchange context", () => {
        function setupMocks() {
          getBetslipExchangeContext.mockReturnValue(undefined);
        }

        it("should call getBetslipExchangeContext with the state", () => {
          setupMocks();

          const state = { entities: "foo" };
          getBetslipExchangeRemoveSelectionEvent(state);

          expect(getBetslipExchangeContext).toHaveBeenCalledWith(state);
        });

        it("should return null", () => {
          setupMocks();

          const event = setup([{ runner: "exc:runner:urn", side: ExchangeSide.BACK }]);

          expect(event).toEqual(null);
        });
      });

      describe("when there are no potential bets", () => {
        const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => []);
        function setupMocks() {
          getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn" });
          createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(getExcRunnerPotentialBetsByRunnerURN);
        }

        it("should call createExcRunnerPotentialBetsByRunnerURNSelector with the betslip context runner", () => {
          setupMocks();
          const state = { entities: "bar" };
          getBetslipExchangeRemoveSelectionEvent(state);

          expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(state, "betslip:context:runner:urn");
        });

        it("should return null", () => {
          setupMocks();

          const event = setup([]);

          expect(event).toEqual(null);
        });
      });

      describe("when there is no exchange runner tree", () => {
        function setupMocks() {
          getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn" });
          getExchangeRunnerTree.mockReturnValue(null);
        }

        it("should call getExchangeRunnerTree with the state and the runner urn", () => {
          setupMocks();
          setup([{ runner: "exc:runner:urn", side: ExchangeSide.BACK }]);

          expect(getExchangeRunnerTree).toHaveBeenCalledWith(
            {
              exchangerunners: "exchangerunners",
              exchangemarkets: "exchangemarkets",
              sports: "sports",
            },
            "betslip:context:runner:urn",
          );
        });

        it("should return null", () => {
          setupMocks();

          const event = setup([{ runner: "exc:runner:urn", side: ExchangeSide.BACK }]);

          expect(event).toEqual(null);
        });
      });

      describe("when there is all necessary data for the formation of the event", () => {
        function setupMocks() {
          getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn" });
          getExchangeRunnerTree.mockReturnValue({
            sport: { name: "Some sport name" },
          });
        }

        it("should return the correct base properties", () => {
          setupMocks();

          const event = setup([{ runner: "exc:runner:urn", side: ExchangeSide.BACK }]);

          expect(event).toEqual(
            expect.objectContaining({
              event: "ga_event",
              action: "removed selection",
              category: "exchange betting",
              label: "Some sport name",
              [APPLICATION.MODULE]: "betslip",
            }),
          );
        });

        describe("when the side is back", () => {
          it("should set the bet direction as back", () => {
            setupMocks();
            getBetslipExchangeContext.mockReturnValue({
              runner: "betslip:context:runner:urn",
              side: ExchangeSide.BACK,
            });

            const event = setup([{ runner: "exc:runner:urn", side: ExchangeSide.BACK }]);

            expect(event[BUSINESS.BET_DIRECTION]).toEqual("back");
          });
        });

        describe("when the side is lay", () => {
          it("should set the bet direction as lay", () => {
            setupMocks();
            getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn", side: ExchangeSide.LAY });

            const event = setup([{ runner: "exc:runner:urn", side: ExchangeSide.LAY }]);

            expect(event[BUSINESS.BET_DIRECTION]).toEqual("lay");
          });
        });
      });
    });
  });

  describe("getBetReceiptExchangeDoneClickEvent", () => {
    it("should return the correct GTM data", () => {
      expect(getBetReceiptExchangeDoneClickEvent()).toEqual({
        event: "ga_event",
        category: "exchange betting",
        action: "closed",
        label: "bet receipt",
        cd3: "bet receipt",
      });
    });
  });
});

describe("getExchangeOnClickEdit", () => {
  const getExchangeMarketByURN = jest.fn(() => ({
    sport: "sport:urn",
    hierarchy: {
      competition: "ppb:competition:1",
      sportevent: "ppb:event:123",
    },
  }));

  const appState = {
    entities: {
      sports: "sports",
      competitions: "competitions",
      exchangemarkets: "exchangemarkets",
      exchangerunners: "exchangerunners",
      sportevents: "sportevents",
      exchangePotentialBets: [],
    },
    layouts: {
      views: "views",
      cards: { markets: "marketcards" },
    },
  };

  const loadSuccessMocks = () => {
    getBetslipExchangeContext.mockReturnValue({ market: "marketURN", runner: "runner:urn", side: ExchangeSide.BACK });
    getUserDetails.mockReturnValue({ currencyCode: "eur" });
    getCompetitionByURN.mockReturnValue({ competitionId: 12005859, name: "friendly matches" });
    getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
    createRaceByURNSelector.mockReturnValue(getRaceByURN);
    createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
    getExchangeOrder.mockReturnValue({
      selectionId: 28251176,
      price: 80,
      orderType: "LIMIT",
      sizeMatched: 0,
      sizeRemaining: 20,
    });
    getExchangeRunnerTree.mockReturnValue({
      marketRunner: {
        selectionId: 28251176,
        name: "marketRunner:name",
      },
      market: {
        hierarchy: {
          sportevent: "sportevent:urn",
          competition: "competition:urn",
        },
        marketId: "1.170230394",
        name: "market:name",
        inplay: false,
      },
      event: {
        eventId: "event:id",
        name: "event:name",
      },
      sport: {
        name: "sport:name",
        sportId: "sport:id",
      },
      runner: {
        selectionId: 123,
      },
    });
    createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN);

    getSportByURN.mockReturnValue({
      sportId: "sport:id",
    });
  };
  let result;
  let payload;

  beforeEach(() => {
    loadSuccessMocks();
    payload = "123";
  });

  describe("when all data is available", () => {
    it("should call all required functions", () => {
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(getBetslipExchangeContext).toHaveBeenCalledWith(appState);
      expect(getUserDetails).toHaveBeenCalledWith(appState);
      expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", "competition:urn");
      expect(getExchangeOrder).toHaveBeenCalledWith(appState, "marketURN", "123");
      expect(getExchangeRunnerTree).toHaveBeenCalledWith(appState.entities, "runner:urn");
      expect(getExchangeMarketByURN).toHaveBeenCalledWith("exchangemarkets", "marketURN");
      expect(getSportByURN).toHaveBeenCalledWith("sports", "sport:urn");
    });

    it("should return the correct gtm data", () => {
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual({
        event: "ga_event",
        category: "exchange betting",
        action: "edited bet",
        label: "edit bet",
        cd3: "betslip",
        cd16: "eur",
        cd14: "sport:id",
        cd5: "sport:name",
        cd84: 2,
        cd7: "Sporting vs Porto",
        cd101: "1.170230394",
        cd8: "market:name",
        cd102: 123,
        cd132: "marketRunner:name",
        cd129: 12005859,
        cd6: "friendly matches",
        cd131: "no",
        cd79: "no",
        cd11: "back",
        cd29: "123",
        cd19: "unmatched",
        cd51: "betslip",
        cd85: "https://www.betfair.com/",
        cd112: 80,
      });
    });
  });

  describe("when currencyCode is missing", () => {
    it("should return null", () => {
      getUserDetails.mockReturnValue({});
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when betId is missing", () => {
    it("should return null", () => {
      result = getExchangeOnClickEdit(appState, null, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when betOriginURL is missing", () => {
    it("should return null", () => {
      result = getExchangeOnClickEdit(appState, payload, null);
      expect(result).toEqual(null);
    });
  });

  describe("when betslipContext is missing", () => {
    it("should return null", () => {
      getBetslipExchangeContext.mockReturnValue(null);
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when competitionId is missing", () => {
    it("should return null", () => {
      getCompetitionByURN.mockReturnValue({ name: "something" });
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when competitionName is missing", () => {
    it("should return null", () => {
      getCompetitionByURN.mockReturnValue({ competitionId: "something" });
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when price is missing", () => {
    it("should return null", () => {
      getExchangeOrder.mockReturnValue({ selectionId: "something" });
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual({
        action: "edited bet",
        category: "exchange betting",
        cd101: "1.170230394",
        cd102: 123,
        cd11: "back",
        cd112: null,
        cd129: 12005859,
        cd131: "no",
        cd132: "marketRunner:name",
        cd14: "sport:id",
        cd16: "eur",
        cd19: "sp",
        cd29: "123",
        cd3: "betslip",
        cd5: "sport:name",
        cd51: "betslip",
        cd6: "friendly matches",
        cd7: "Sporting vs Porto",
        cd79: "no",
        cd8: "market:name",
        cd84: 2,
        cd85: "https://www.betfair.com/",
        event: "ga_event",
        label: "edit bet",
      });
    });
  });

  describe("betResponse", () => {
    const fullResponse = {
      action: "edited bet",
      category: "exchange betting",
      cd101: "1.170230394",
      cd102: 123,
      cd11: "back",
      cd112: null,
      cd129: 12005859,
      cd131: "no",
      cd132: "marketRunner:name",
      cd14: "sport:id",
      cd16: "eur",
      cd29: "123",
      cd3: "betslip",
      cd5: "sport:name",
      cd51: "betslip",
      cd6: "friendly matches",
      cd7: "Sporting vs Porto",
      cd79: "no",
      cd8: "market:name",
      cd84: 2,
      cd85: "https://www.betfair.com/",
      event: "ga_event",
      label: "edit bet",
    };
    describe("when bet is unmatched", () => {
      it("should return null", () => {
        getExchangeOrder.mockReturnValue({
          selectionId: "something",
          orderType: "LIMIT",
          sizeMatched: 0,
          sizeRemaining: 20,
        });
        result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "unmatched",
        });
      });
    });
    describe("when bet is matched", () => {
      it("should return null", () => {
        getExchangeOrder.mockReturnValue({
          selectionId: "something",
          orderType: "LIMIT",
          sizeMatched: 20,
          sizeRemaining: 0,
        });
        result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "matched",
        });
      });
    });
    describe("when bet is partiallyMatched", () => {
      it("should return null", () => {
        getExchangeOrder.mockReturnValue({
          selectionId: "something",
          orderType: "LIMIT",
          sizeMatched: 20,
          sizeRemaining: 20,
        });
        result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "partially-matched",
        });
      });
    });
  });

  describe("when marketRunner is missing", () => {
    it("should return null", () => {
      getExchangeRunnerTree.mockReturnValue(null);
      result = getExchangeOnClickEdit(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });
});

describe("getExchangeBetEditSuccessfull", () => {
  const getExchangeMarketByURN = jest.fn(() => ({
    sport: "sport:urn",
  }));

  const appState = {
    entities: {
      sports: "sports",
      competitions: "competitions",
      exchangemarkets: "exchangemarkets",
      exchangerunners: "exchangerunners",
      sportevents: "sportevents",
      exchangePotentialBets: [],
    },
    layouts: {
      views: "views",
      cards: { markets: "marketcards" },
    },
  };

  const loadSuccessMocks = () => {
    getBetslipExchangeContext.mockReturnValue({ market: "marketURN", runner: "runner:urn", side: ExchangeSide.BACK });
    getUserDetails.mockReturnValue({ currencyCode: "eur" });
    getCompetitionByURN.mockReturnValue({ competitionId: 12005859, name: "friendly matches" });
    getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
    getSportByURN.mockReturnValue({ sportId: "sport:id" });
    createRaceByURNSelector.mockReturnValue(getRaceByURN);
    createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
    getExchangeOrder.mockReturnValue({
      selectionId: 28251176,
      price: 80,
      orderType: "LIMIT",
      sizeMatched: 0,
      sizeRemaining: 20,
    });
    getExchangeRunnerTree.mockReturnValue({
      marketRunner: {
        selectionId: 28251176,
        name: "marketRunner:name",
      },
      market: {
        hierarchy: {
          competition: "competition:urn",
          sportevent: "sportevent:urn",
        },
        marketId: "1.170230394",
        name: "market:name",
        inplay: false,
      },
      event: {
        eventId: "event:id",
        name: "event:name",
      },
      sport: {
        name: "sport:name",
        sportId: "sport:id",
      },
      runner: {
        selectionId: 123,
      },
    });
    createExchangeMarketSelector.mockReturnValue(getExchangeMarketByURN);
  };
  let result;
  let payload;

  beforeEach(() => {
    loadSuccessMocks();
    payload = {
      priceAtSelection: "priceAtSelection",
      matched: {
        betId: "betId",
        price: "price",
        size: "size",
      },
      side: ExchangeSide.BACK,
    };
  });

  describe("when all data is available", () => {
    it("should call all required functions", () => {
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(getBetslipExchangeContext).toHaveBeenCalledWith(appState);
      expect(getUserDetails).toHaveBeenCalledWith(appState);
      expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", "competition:urn");
      expect(getExchangeRunnerTree).toHaveBeenCalledWith(appState.entities, "runner:urn");
    });

    it("should return the correct gtm data", () => {
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual({
        event: "ga_event",
        category: "exchange betting",
        action: "placed bet",
        label: "place bet - unmatched update",
        cd3: "betslip",
        cd16: "eur",
        cd14: "sport:id",
        cd5: "sport:name",
        cd84: 2,
        cd7: "Sporting vs Porto",
        cd101: "1.170230394",
        cd8: "market:name",
        cd102: 123,
        cd132: "marketRunner:name",
        cd129: 12005859,
        cd6: "friendly matches",
        cd131: "no",
        cd79: "no",
        cd11: "back",
        cd29: "betId",
        cd19: "matched",
        cd51: "betslip",
        cd85: "https://www.betfair.com/",
        cd112: "priceAtSelection",
        cd113: "price",
        cm1: "size",
        cd89: true,
      });
    });
  });

  describe("when currencyCode is missing", () => {
    it("should return null", () => {
      getUserDetails.mockReturnValue({});
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when betId is missing", () => {
    it("should return null", () => {
      result = getExchangeBetEditSuccessfull(appState, null, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when betslipContext is missing", () => {
    it("should return null", () => {
      getBetslipExchangeContext.mockReturnValue(null);
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when competitionId is missing", () => {
    it("should return null", () => {
      getCompetitionByURN.mockReturnValue({ name: "something" });
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("when competitionName is missing", () => {
    it("should return null", () => {
      getCompetitionByURN.mockReturnValue({ competitionId: "something" });
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });

  describe("betResponse", () => {
    const fullResponse = {
      event: "ga_event",
      category: "exchange betting",
      action: "placed bet",
      label: "place bet - unmatched update",
      cd3: "betslip",
      cd16: "eur",
      cd14: "sport:id",
      cd5: "sport:name",
      cd84: 2,
      cd7: "Sporting vs Porto",
      cd101: "1.170230394",
      cd8: "market:name",
      cd102: 123,
      cd132: "marketRunner:name",
      cd129: 12005859,
      cd6: "friendly matches",
      cd131: "no",
      cd79: "no",
      cd11: "back",
      cd29: "betId",
      cd19: "matched",
      cd51: "betslip",
      cd85: "https://www.betfair.com/",
      cd112: "priceAtSelection",
      cd113: "price",
      cm1: "size",
      cd89: true,
    };
    describe("when bet is unmatched", () => {
      it("should return null", () => {
        payload = {
          ...payload,
          matched: {},
          unmatched: {
            betId: "betId",
            price: "price",
            size: "size",
          },
        };
        result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "unmatched",
        });
      });
    });
    describe("when bet is matched", () => {
      it("should return null", () => {
        result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "matched",
        });
      });
    });
    describe("when bet is partiallyMatched", () => {
      it("should return null", () => {
        payload = {
          ...payload,
          unmatched: {
            betId: "betId",
            price: "price",
            size: "size",
          },
        };
        result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
        expect(result).toEqual({
          ...fullResponse,
          cd19: "partially-matched",
        });
      });
    });
  });

  describe("when marketRunner is missing", () => {
    it("should return null", () => {
      getExchangeRunnerTree.mockReturnValue(null);
      result = getExchangeBetEditSuccessfull(appState, payload, "https://www.betfair.com/");
      expect(result).toEqual(null);
    });
  });
});

describe("getExchangeAddSelectionToBetslip", () => {
  const appState = {
    entities: {
      competitions: "competitions",
      exchangemarkets: "exchangemarkets",
      exchangerunners: "exchangerunners",
      sportevents: "sportevents",
      exchangePotentialBets: [],
    },
    layouts: {
      views: "views",
      cards: { markets: "marketcards" },
    },
    router: {
      currentUrn: "view:urn",
    },
  };

  const action = {
    payload: {
      urn: "runner:urn",
      price: 2.1,
      side: ExchangeSide.BACK,
      cardUrn: "card:urn",
      uniqueId: "uniqueId",
      betOriginURL: "https://www.betfair.com/",
    },
  };

  const market = {
    sport: "sport:urn",
    hierarchy: {
      sportevent: "sportevent:urn",
      competition: "competition:urn",
    },
  };

  const racingMarket = {
    sport: "sport:urn",
    hierarchy: {
      race: "race:urn",
      meeting: "meeting:urn",
    },
  };

  const defaultRunnerTree = {
    runner: { market: "market:urn", selectionId: 123 },
    marketRunner: { selectionId: 123, name: "Porto" },
    market: { ...market, marketId: 1, name: "Match Odds", inplay: false },
    sport: { sportId: 4, name: "football" },
  };

  const racingRunnerTree = {
    runner: { market: "market:urn", selectionId: 123 },
    marketRunner: { selectionId: 123, name: "Porto" },
    market: { ...racingMarket, marketId: 1, name: "Match Odds", inplay: false },
    sport: { sportId: 7, name: "horse racing" },
  };

  const getBettableCardByURN = jest.fn();

  const setup = ({ runnerTree = defaultRunnerTree } = {}) => {
    createBettableCardByURNSelector.mockImplementation(() => getBettableCardByURN);
    getBetslipExchangeContext.mockReturnValue(null);
    createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);
    getExchangeRunnerTree.mockReturnValue(runnerTree);
    getCompetitionByURN.mockReturnValue({ competitionId: 3, name: "Primeira Liga" });
    getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
    getViewbyURN.mockReturnValue({ typename: "EventView" });
    createRaceByURNSelector.mockReturnValue(getRaceByURN);
    createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
    getBettableCardByURN.mockReturnValue({ title: "Match Odds" });
    createViewTypeSelector.mockImplementation(() => getViewTypeSelector);
  };

  beforeEach(jest.clearAllMocks);

  describe("with missing data", () => {
    describe("when runner tree is null", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "betslip:context:runner:urn" });
        createBettableCardByURNSelector.mockImplementation(() => getBettableCardByURN);
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValue(() => []);
        getExchangeRunnerTree.mockReturnValue(null);
        getViewbyURN.mockReturnValue({ typename: "EventView" });
        getBettableCardByURN.mockReturnValue({ title: "Match Odds" });

        const result = getExchangeAddSelectionToBetslip(appState, action);

        expect(getExchangeRunnerTree).toHaveBeenCalledWith(appState.entities, "runner:urn");
        expect(getExchangeRunnerTree).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
      });
    });

    describe("when runner tree is available", () => {
      describe("without current view", () => {
        it("should return null", () => {
          setup();

          const result = getExchangeAddSelectionToBetslip({ ...appState, router: { currentUrn: null } }, action);

          expect(result).toBeNull();
        });
      });

      describe("without view", () => {
        it("should return null", () => {
          setup();
          getViewbyURN.mockReturnValue(null);

          const result = getExchangeAddSelectionToBetslip(appState, action);

          expect(getViewbyURN).toHaveBeenCalledWith("views", "view:urn");
          expect(getViewbyURN).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without card", () => {
        it("should return null", () => {
          setup();
          getBettableCardByURN.mockReturnValue(null);

          const result = getExchangeAddSelectionToBetslip(appState, action);

          expect(getBettableCardByURN).toHaveBeenCalledWith(appState.layouts.cards, "card:urn");
          expect(getBettableCardByURN).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
          expect(true).toBe(true);
        });
      });

      describe("without competition id", () => {
        it("should return null", () => {
          setup();
          getCompetitionByURN.mockReturnValue({});

          const result = getExchangeAddSelectionToBetslip(appState, action);

          expect(result).toBeNull();
        });
      });

      describe("without event id", () => {
        it("should return null", () => {
          setup();
          getSportEventByURN.mockReturnValue({});

          const result = getExchangeAddSelectionToBetslip(appState, action);

          expect(result).toBeNull();
        });
      });

      describe("without competition.competitionId", () => {
        it("should return null", () => {
          setup();
          getCompetitionByURN.mockReturnValue({});

          const result = getExchangeAddSelectionToBetslip(appState, action);

          expect(result).toBeNull();
        });
      });
    });
  });

  describe("with data available", () => {
    describe("inplay", () => {
      it("should return 'yes' if it's inplay", () => {
        setup({
          runnerTree: { ...defaultRunnerTree, market: { ...market, marketId: 1, name: "Match Odds", inplay: true } },
        });

        const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

        expect(result.cd79).toBe("yes");
      });

      it("should return 'no' if it's NOT inplay", () => {
        setup({
          runnerTree: { ...defaultRunnerTree, market: { ...market, marketId: 1, name: "Match Odds", inplay: false } },
        });

        const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

        expect(result.cd79).toBe("no");
      });
    });

    describe("price", () => {
      it("should return 'null' if there isn't a price", () => {
        setup();

        const result = getExchangeAddSelectionToBetslip(
          appState,
          { payload: { ...action.payload, price: undefined } },
          metadata,
        );

        expect(result.cd112).toBeNull();
      });
    });

    describe("when adding a bet", () => {
      it("should return the correct gtm data for positions and titles", () => {
        setup();
        const result = getExchangeAddSelectionToBetslip(appState, action, {
          cardGroupTitle: "cardGroupTitle",
          horizontalPosition: 1,
          verticalPosition: 2,
          tabName: null,
        });

        expect(result).toEqual({
          event: "ga_event",
          category: "exchange betting",
          action: "added selection",
          label: "football",
          cd3: `EVENT - primary swimlane - cardGroupTitle - Match Odds - null`,
          cd6: "Primeira Liga",
          cd7: "Sporting vs Porto",
          cd8: "Match Odds",
          cd11: "back",
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: 2,
          cd85: "https://www.betfair.com/",
          cd101: 1,
          cd102: 123,
          cd112: 2.1,
          cd129: 3,
          cd130: "uniqueId",
          cd131: "no",
          cd132: "Porto",
        });
      });

      describe("when I do not have card position info", () => {
        it("should return the correct gtm data with card position dimensions as null", () => {
          setup();
          const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

          expect(result).toEqual({
            event: "ga_event",
            category: "exchange betting",
            action: "added selection",
            label: "football",
            cd3: "EVENT - primary swimlane - In-Play - Match Odds - null",
            cd6: "Primeira Liga",
            cd7: "Sporting vs Porto",
            cd8: "Match Odds",
            cd11: "back",
            cd42: null,
            cd43: null,
            cd67: null,
            cd79: "no",
            cd84: 2,
            cd85: "https://www.betfair.com/",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: 3,
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
          });
        });
      });
    });

    describe("when replacing a bet", () => {
      it("should return the correct gtm data", () => {
        setup();
        getBetslipExchangeContext.mockReturnValue({ runner: "runner:urn", side: ExchangeSide.BACK });

        const replaceAction = {
          payload: {
            urn: "runner:urn",
            side: ExchangeSide.LAY,
            price: 9.6,
            cardUrn: "card:urn",
            uniqueId: "uniqueId",
            betOriginURL: "https://www.betfair.com/",
          },
        };

        const result = getExchangeAddSelectionToBetslip(appState, replaceAction, {
          ...metadata,
          horizontalPosition: 1,
          verticalPosition: 2,
        });

        expect(result).toEqual({
          event: "ga_event",
          category: "exchange betting",
          action: "added selection",
          label: "football",
          cd3: "EVENT - primary swimlane - In-Play - Match Odds - null",
          cd6: "Primeira Liga",
          cd7: "Sporting vs Porto",
          cd8: "Match Odds",
          cd11: "lay",
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: 2,
          cd85: "https://www.betfair.com/",
          cd101: 1,
          cd102: 123,
          cd112: 9.6,
          cd129: 3,
          cd130: "uniqueId",
          cd131: "no",
          cd132: "Porto",
        });
      });
    });

    describe("when removing the same bet", () => {
      it("should return null", () => {
        setup();
        getBetslipExchangeContext.mockReturnValue({ runner: action.payload.urn, side: action.payload.side });

        const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

        expect(result).toBeNull();
        expect(getExchangeRunnerTree).not.toHaveBeenCalled();
      });
    });
  });

  describe("if it is a racing market", () => {
    describe("with missing data", () => {
      describe("when the race doesn't exist", () => {
        it("should return null", () => {
          setup({ runnerTree: racingRunnerTree });
          createRaceByURNSelector.mockReturnValue(jest.fn().mockReturnValue(null));

          const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

          expect(result).toBeNull();
        });
      });
      describe("when the meeting doesn't exist", () => {
        it("should return null", () => {
          setup({ runnerTree: racingRunnerTree });
          createMeetingByURNSelector.mockReturnValue(jest.fn().mockReturnValue(null));

          const result = getExchangeAddSelectionToBetslip(appState, action, metadata);

          expect(result).toBeNull();
        });
      });
    });

    describe("with data available", () => {
      it("should return the correct gtm data", () => {
        setup({ runnerTree: racingRunnerTree });

        const result = getExchangeAddSelectionToBetslip(appState, action, {
          ...metadata,
          horizontalPosition: 1,
          verticalPosition: 2,
        });

        expect(result).toEqual({
          event: "ga_event",
          category: "exchange betting",
          action: "added selection",
          label: "horse racing",
          cd3: "EVENT - primary swimlane - In-Play - Match Odds - null",
          cd6: "Meeting Name",
          cd7: "17:00 Newcastle",
          cd8: "Match Odds",
          cd11: "back",
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: "raceId",
          cd85: "https://www.betfair.com/",
          cd101: 1,
          cd102: 123,
          cd112: 2.1,
          cd130: "uniqueId",
          cd129: "meetingId",
          cd131: "no",
          cd132: "Porto",
        });
      });

      it("should return secondary swimlane when the clicked card is HighlightedSelectionCard", () => {
        setup({ runnerTree: racingRunnerTree });
        getBettableCardByURN.mockReturnValue({ typename: "HighlightedSelectionCard" });

        const result = getExchangeAddSelectionToBetslip(appState, action, {
          ...metadata,
          horizontalPosition: 1,
          verticalPosition: 2,
        });

        expect(result).toEqual({
          event: "ga_event",
          category: "exchange betting",
          action: "added selection",
          label: "horse racing",
          cd3: "EVENT - secondary swimlane - In-Play - Match Odds - null",
          cd6: "Meeting Name",
          cd7: "17:00 Newcastle",
          cd8: "Match Odds",
          cd11: "back",
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: "raceId",
          cd85: "https://www.betfair.com/",
          cd101: 1,
          cd102: 123,
          cd112: 2.1,
          cd129: "meetingId",
          cd130: "uniqueId",
          cd131: "no",
          cd132: "Porto",
        });
      });
    });
  });
});

describe("getExchangePriceChangeEvent", () => {
  const stateMock = { entities: { competitions: {} } };
  const payloadMock = { runner: "runnerURN", side: ExchangeSide.BACK };
  const runnerTreeMock = {
    market: {
      name: "some market name",
      marketId: "some marketId",
      hierarchy: {
        competition: "comp:1",
        sportevent: "event:1",
      },
    },
    marketRunner: {
      selectionId: 12345,
      name: "some runner name",
    },
    event: {
      name: "some event name",
      eventId: "some event id",
    },
    sport: {
      sportId: 54321,
      name: "some sport name",
    },
    runner: {
      selectionId: 123,
    },
  };
  const competitionMock = {
    name: "some competition name",
    competitionId: "comp:1",
  };
  const preferencesMock = { exchangeConfirmBetPlacement: true };

  function setup({
    payload = payloadMock,
    state = stateMock,
    runnerTree = runnerTreeMock,
    competition = competitionMock,
    preferences = preferencesMock,
  } = {}) {
    getExchangeRunnerTree.mockReturnValue(runnerTree);
    getCompetitionByURN.mockReturnValue(competition);
    getPreferencesWithProductSwitcherSelector.mockReturnValue(preferences);
    getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
    createRaceByURNSelector.mockReturnValue(getRaceByURN);
    createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
    return getExchangePriceChangeEvent(state, payload);
  }

  it("should call getExchangeRunnerTree", () => {
    setup();

    expect(getExchangeRunnerTree).toHaveBeenCalledWith(stateMock.entities, "runnerURN");
    expect(getExchangeRunnerTree).toHaveBeenCalledTimes(1);
  });

  it("should call getCompetitionByURN", () => {
    setup();

    expect(getCompetitionByURN).toHaveBeenCalledWith(stateMock.entities.competitions, "comp:1");
    expect(getCompetitionByURN).toHaveBeenCalledTimes(1);
  });

  describe("when there's NO runner metrics", () => {
    it("should return null", () => {
      const event = setup({ runnerTree: null });

      expect(event).toBeNull();
    });
  });

  describe("when there's NO competition", () => {
    it("should return null", () => {
      const event = setup({ competition: null });

      expect(event).toBeNull();
    });
  });

  describe("when there's data available", () => {
    it("should return expected event", () => {
      const event = setup();

      expect(event).toStrictEqual({
        action: "changed odds",
        category: "exchange betting",
        event: "ga_event",
        label: "betting",
        cd3: "betslip",
        cd5: "some sport name",
        cd6: "some competition name",
        cd7: "Sporting vs Porto",
        cd8: "some market name",
        cd10: "single",
        cd11: "back",
        cd14: 54321,
        cd28: "single",
        cd79: "no",
        cd84: 2,
        cd89: "no",
        cd94: "yes",
        cd101: "some marketId",
        cd102: 123,
        cd129: "comp:1",
        cd132: "some runner name",
      });
    });

    describe("when exchangeConfirmBetPlacement is true", () => {
      it("should return 'yes'", () => {
        const event = setup({ preferences: { exchangeConfirmBetPlacement: true } });

        expect(event.cd94).toBe("yes");
      });
    });

    describe("when exchangeConfirmBetPlacement is false", () => {
      it("should return 'no'", () => {
        const event = setup({ preferences: { exchangeConfirmBetPlacement: false } });

        expect(event.cd94).toBe("no");
      });
    });
  });
});

describe("getMyBetsEditClickEvent", () => {
  it("should return event payload", () => {
    expect(getMyBetsEditClickEvent("LAY")).toEqual({
      event: "ga_event",
      category: "exchange betting",
      action: "edit unmatched bet",
      label: "my bets",
      [APPLICATION.MODULE]: "my bets",
      [BUSINESS.BET_DIRECTION]: "lay",
    });
  });
});

describe("getMyBetsEditBottomSheetCloseEvent", () => {
  it("should return event payload", () => {
    expect(getMyBetsEditBottomSheetCloseEvent()).toEqual({
      event: "ga_event",
      category: "exchange betting",
      action: "closed",
      label: "edit bet",
      [APPLICATION.MODULE]: "edit bet bottom sheet",
    });
  });
});

describe("getBetslipExchangeLoginToPlaceBetClickEvent", () => {
  describe("when the side is lay", () => {
    it("should return the correct GTM data with bet direction as lay", () => {
      expect(getBetslipExchangeLoginToPlaceBetClickEvent(ExchangeSide.LAY)).toEqual({
        event: "ga_event",
        category: "exchange betting",
        action: "submitted bet",
        label: "login & place bet",
        cd3: "betslip",
        cd11: "lay",
        cd99: null,
      });
    });
  });
  describe("when the side is back", () => {
    it("should return the correct GTM data with bet direction as lay", () => {
      expect(getBetslipExchangeLoginToPlaceBetClickEvent(ExchangeSide.BACK)).toEqual({
        event: "ga_event",
        category: "exchange betting",
        action: "submitted bet",
        label: "login & place bet",
        cd3: "betslip",
        cd11: "back",
        cd99: null,
      });
    });
  });
});

describe("getMyBetsExchangeOrderStatusClickEvent", () => {
  it("should return event payload", () => {
    const moduleName = "myBetsMock";
    expect(getMyBetsExchangeOrderStatusClickEvent("order-status-filter-label-mock", moduleName)).toEqual({
      event: "ga_event",
      category: "interface",
      action: "clicked",
      label: "exchange - order-status-filter-label-mock",
      [APPLICATION.MODULE]: moduleName,
    });
  });
});
