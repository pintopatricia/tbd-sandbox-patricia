import { buildBetslipEvent } from "tagging-library";
import { ProductsOption } from "../../state";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getBetslipBetBuilderRemoveSelections,
  getBetslipSportsbookRemoveSelectionEvent,
  getBetslipExchangeLoginToPlaceBetClickEvent,
  getBetslipSportsbookLoginToPlaceBetClickEvent,
  getDontUpdateBetClickEvent,
  getExchangeOnClickEdit,
  getMyBetsCancelAllUnmatchedExchangeBetsFailure,
  getMyBetsCancelAllUnmatchedExchangeBetsSuccess,
  getMyBetsCancelUnmatchedExchangeBetFailure,
  getMyBetsCancelUnmatchedExchangeBetSuccess,
  getUpdateBetClickEvent,
  getBetslipCancelUnmatchedBetClickEvent,
  getBetslipCancelBetSuccessClickEvent,
  getBetslipCancelBetFailureClickEvent,
  getBetslipExchangeRemovePotentialSelectionEvent,
  getBetslipSportsbookRemovePotentialSelectionEvent,
  getBetslipExchangeRemovePotentialBetClickEvent,
} from "./betslip";
import { getBettingResolvers } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import {
  createExcRunnerPotentialBetsByRunnerURNSelector,
  getExchangeRunnerTree,
} from "../../state/entities/entities-selectors";
import { getBetslipCard, getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import { ExchangeSide } from "../../state/constants";
import { getSportsbookRunnerMetrics, getVirtualRunnerMetrics } from "./helpers";

jest.mock("tagging-library", () => ({
  buildBetslipEvent: jest.fn().mockReturnValue("betslip event"),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn(),
}));

jest.mock("../../state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn().mockReturnValue({ runner: "betslip:context:runner:urn", side: "BACK" }),
  getBetslipExchangeReportUnmatched: jest.fn().mockReturnValue({ betId: "mocked bet id" }),
  getBetslipCard: jest.fn(() => ({
    taggingMetadata: {
      selections: {
        "runner:urn:1": {
          id: "runner:urn:1",
        },
      },
    },
  })),
}));

jest.mock("../../state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn().mockReturnValue({
    marketRunner: {
      selectionId: 123,
      name: "some runner name",
    },
    market: {
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
      },
      marketId: "1.170230394",
      name: "some market name",
      inplay: false,
    },
    runner: {
      market: "market:urn",
      selectionId: 123,
    },
    event: {
      eventId: "event:id",
      name: "event:name",
    },
    sport: {
      name: "some sport name",
      sportId: "sport:id:123",
    },
  }),
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => jest.fn(() => [])),
  createGetVirtualMarketRunnerIdAssociationSelector: jest
    .fn()
    .mockReturnValue("getVirtualMarketRunnerIdAssociationSelector"),
  createGetVirtualMarketRunnerURNAssociationSelector: jest
    .fn()
    .mockReturnValue("getVirtualMarketRunnerURNAssociationSelector"),
  createGetVirtualAddPayloadSelector: jest.fn().mockReturnValue("getVirtualAddPayloadSelector"),
  createVirtualBettingRunnersMetadataSelector: jest.fn().mockReturnValue("virtualBettingRunnersMetadataSelector"),
  createGetMarketRunnerIdAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerIdAssociationSelector"),
  createGetMarketRunnerURNAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerURNAssociationSelector"),
  createGetAddPayloadSelector: jest.fn().mockReturnValue("getAddPayloadSelector"),
  createBettingRunnersMetadataSelector: jest.fn().mockReturnValue("createBettingRunnersMetadataSelector"),
}));

const metadataMock = {
  titles: { pebbleCardGroup: "pebbleCardGroup", tab: "tab" },
  horizontalPosition: 1,
  verticalPosition: 2,
};

jest.mock("../../state/layout/layout-selectors", () => {
  const getLayoutMetadata = jest.fn(() => metadataMock);

  return {
    createCardParentTitlesByURNSelector: jest.fn(() =>
      jest.fn().mockReturnValue({
        groupTitle: "groupTitle",
        tabTitle: "tabTitle",
        groupUrn: "ppb:group:card:urn",
      }),
    ),
    createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("home")),
    createGetLayoutMetadataSelector: jest.fn(() => getLayoutMetadata),
    createNavTabTitleByURNSelector: jest.fn(() => jest.fn(() => "tabTitle")),
  };
});

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn().mockReturnValue(
    jest.fn(() => ({
      sport: "exc:market:urn",
    })),
  ),
}));

jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({ currencyCode: "eur" }),
}));

jest.mock("../../state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn().mockReturnValue({
    competitionId: "c123",
    name: "some competition name",
  }),
}));

jest.mock("../../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn().mockReturnValue({
    eventId: "e123",
    name: "some event name",
  }),
}));

jest.mock("../../state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn().mockReturnValue({
    sportId: "sport:id:123",
  }),
}));

jest.mock("../../state/betting/exchange-orders/exchange-order-selectors", () => ({
  getExchangeOrder: jest.fn().mockReturnValue({
    price: "1.3",
  }),
}));

jest.mock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getBettingResolvers: jest.fn().mockReturnValue({
    getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
      marketId: "930.360303491",
      selectionId: 5851483,
    }),
    getMetadata: jest.fn().mockReturnValue({
      "930.360303491-5851483": {
        eventUrn: "event:urn:1",
        eventName: "Event Name",
        bettingGroup: "REAL",
      },
    }),
  }),
}));

jest.mock("./helpers", () => ({
  ...jest.requireActual("./helpers"),
  getSportsbookRunnerMetrics: jest.fn(),
  getVirtualRunnerMetrics: jest.fn(),
}));

describe("betslip events", () => {
  afterEach(jest.clearAllMocks);

  describe("getDontUpdateBetClickEvent", () => {
    it("should return event", () => {
      const result = getDontUpdateBetClickEvent();

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.DONT_UPDATE,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getUpdateBetClickEvent", () => {
    const action = {
      payload: {
        betId: "12345",
        market: "market:URN",
        runner: "runner:URN",
        betOriginURL: "betOriginURL mock",
      },
    };

    describe("when exchange runner tree is defined", () => {
      it("should return the correct event payload", () => {
        const result = getUpdateBetClickEvent(action, {});

        expect(buildBetslipEvent).toHaveBeenCalledWith({
          action: TaggingAction.SUBMITTED_UPDATE_UNMATCHED_BET,
          betId: "12345",
          selection: "some runner name",
          selectionId: "123",
          bettingProduct: ProductsOption.exchange,
        });

        expect(result).toEqual("betslip event");
      });
    });

    describe("when exchange runner tree is not defined", () => {
      it("should not call buildBetslipEvent and return null", () => {
        getExchangeRunnerTree.mockReturnValueOnce(undefined);
        const result = getUpdateBetClickEvent(action, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();

        expect(result).toEqual(null);
      });
    });
  });

  describe("getBetslipCancelUnmatchedBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          instructions: {
            betIds: ["12345"],
            runner: "runner:URN",
          },
        },
      };

      const result = getBetslipCancelUnmatchedBetClickEvent(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_BET,
        betId: "mocked bet id",
        selection: "some runner name",
        selectionId: "123",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipCancelBetSuccessClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          instructions: {
            betIds: ["12345"],
            runner: "runner:URN",
          },
        },
      };

      const result = getBetslipCancelBetSuccessClickEvent(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_BET_SUCCESS,
        betId: "mocked bet id",
        selection: "some runner name",
        selectionId: "123",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipCancelBetFailureClickEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          instructions: {
            betIds: ["12345"],
            runner: "runner:URN",
          },
        },
      };

      const result = getBetslipCancelBetFailureClickEvent(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_BET_FAILURE,
        betId: "mocked bet id",
        selection: "some runner name",
        selectionId: "123",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getExchangeOnClickEdit", () => {
    const action = {
      payload: {
        betId: "12345",
        isPersistenceTypeMenuExpanded: false,
        betOriginURL: "betOriginURL",
      },
    };

    const appState = {
      entities: {
        sports: "sports",
        competitions: "competitions",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        exchangePotentialBets: [],
      },
    };

    describe("when bet metrics are defined", () => {
      it("should return the correct event payload", () => {
        const result = getExchangeOnClickEdit(action, appState);

        expect(buildBetslipEvent).toHaveBeenCalledWith({
          action: TaggingAction.EDIT_UNMATCHED_BET,
          betId: "12345",
          selection: "some runner name",
          selectionId: "123",
          bettingProduct: ProductsOption.exchange,
        });

        expect(result).toEqual("betslip event");
      });
    });

    describe("when bet metrics are not defined", () => {
      it("should return the correct event payload", () => {
        getSportByURN.mockReturnValueOnce(undefined);
        const result = getExchangeOnClickEdit(action, appState);

        expect(buildBetslipEvent).not.toHaveBeenCalled();

        expect(result).toEqual(null);
      });
    });
  });

  describe("getBetslipSportsbookRemoveSelectionEvent", () => {
    describe("when there's no runner urn", () => {
      it("should not call buildBetslipEvent", () => {
        const action = { payload: {} };
        const result = getBetslipSportsbookRemoveSelectionEvent(action, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when the betting group is REAL", () => {
      describe("and when sportsbook runnerMetrics are null", () => {
        it("should not call buildBetslipEvent", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMetadata: jest.fn().mockReturnValueOnce({
              "RUNNER:1": {
                bettingGroup: "REAL",
              },
            }),
          });
          getSportsbookRunnerMetrics.mockReturnValue(null);

          const action = {
            payload: {
              runnerUrn: "runnerUrn",
            },
          };
          const result = getBetslipSportsbookRemoveSelectionEvent(action, {
            betting: { sportsbookBetting: { legs: { "RUNNER:1": { runners: ["RUNNER:1"] } } } },
          });

          expect(buildBetslipEvent).not.toHaveBeenCalled();
          expect(result).toBe(null);
        });
      });

      describe("and when sportsbook runnerMetrics are defined", () => {
        it("should call buildBetslipEvent with correct parameters", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMetadata: jest.fn().mockReturnValueOnce({
              "RUNNER:1": {
                bettingGroup: "REAL",
              },
            }),
          });
          getSportsbookRunnerMetrics.mockReturnValue({ selection: "real selection", selection_id: 123 });

          const action = {
            payload: {
              runnerUrn: "runnerUrn",
            },
          };
          const result = getBetslipSportsbookRemoveSelectionEvent(action, {
            betting: { sportsbookBetting: { legs: { "RUNNER:1": { runners: ["RUNNER:1"] } } } },
          });

          expect(buildBetslipEvent).toHaveBeenCalledWith({
            action: TaggingAction.REMOVED_SELECTION,
            betId: "null",
            bettingProduct: ProductsOption.sportsbook,
            selection: "real selection",
            selectionId: "123",
          });
          expect(result).toBe("betslip event");
        });
      });
    });

    describe("when the betting group is VIRTUAL", () => {
      describe("and when virtual runnerMetrics are null", () => {
        it("should not call buildBetslipEvent", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMetadata: jest.fn().mockReturnValueOnce({
              "RUNNER:1": {
                bettingGroup: "VIRTUAL",
              },
            }),
          });
          getVirtualRunnerMetrics.mockReturnValue(null);

          const action = {
            payload: {
              runnerUrn: "runnerUrn",
            },
          };
          const result = getBetslipSportsbookRemoveSelectionEvent(action, {
            betting: { sportsbookBetting: { legs: { "RUNNER:1": { runners: ["RUNNER:1"] } } } },
          });

          expect(buildBetslipEvent).not.toHaveBeenCalled();
          expect(result).toBe(null);
        });
      });

      describe("and when sportsbook runnerMetrics are defined", () => {
        it("should call buildBetslipEvent with correct parameters", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMetadata: jest.fn().mockReturnValueOnce({
              "RUNNER:1": {
                bettingGroup: "VIRTUAL",
              },
            }),
          });
          getVirtualRunnerMetrics.mockReturnValue({ selection: "virtual selection", selection_id: 321 });

          const action = {
            payload: {
              runnerUrn: "runnerUrn",
            },
          };
          const result = getBetslipSportsbookRemoveSelectionEvent(action, {
            betting: { sportsbookBetting: { legs: { "RUNNER:1": { runners: ["RUNNER:1"] } } } },
          });

          expect(buildBetslipEvent).toHaveBeenCalledWith({
            action: TaggingAction.REMOVED_SELECTION,
            betId: "null",
            bettingProduct: ProductsOption.sportsbook,
            selection: "virtual selection",
            selectionId: "321",
          });
          expect(result).toBe("betslip event");
        });
      });
    });
  });

  describe("getBetslipExchangeRemovePotentialBetClickEvent", () => {
    describe("when there's runner info in app state", () => {
      it("should call buildBetslipEvent with the correct payload", () => {
        getExchangeRunnerTree.mockReturnValueOnce({
          marketRunner: { name: "runner name" },
          runner: { selectionId: 123 },
        });
        const action = {
          payload: {
            runner: "runnerUrn",
          },
        };

        const result = getBetslipExchangeRemovePotentialBetClickEvent(action, {});

        expect(buildBetslipEvent).toHaveBeenCalledWith({
          action: TaggingAction.REMOVED_SELECTION,
          betId: "null",
          bettingProduct: ProductsOption.exchange,
          selection: "runner name",
          selectionId: "123",
        });
        expect(result).toBe("betslip event");
      });
    });

    describe("when there's no runner info in app state", () => {
      it("should not call buildBetslipEvent", () => {
        getExchangeRunnerTree.mockReturnValueOnce(null);
        const action = {
          payload: {
            runner: "runnerUrn",
          },
        };

        const result = getBetslipExchangeRemovePotentialBetClickEvent(action, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when there's no runner urn", () => {
      it("should not call buildBetslipEvent", () => {
        const action = { payload: {} };
        const result = getBetslipExchangeRemovePotentialBetClickEvent(action, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });
  });

  describe("getMyBetsCancelUnmatchedExchangeBetSuccess", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          selectionName: "selection name",
          side: ExchangeSide.BACK,
          betId: "12345",
        },
      };

      const result = getMyBetsCancelUnmatchedExchangeBetSuccess(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_BET_SUCCESS,
        betId: "12345",
        selection: "selection name",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getMyBetsCancelUnmatchedExchangeBetFailure", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          selectionName: "selection name",
          side: ExchangeSide.BACK,
          betId: "12345",
          errorCode: "error",
        },
      };

      const result = getMyBetsCancelUnmatchedExchangeBetFailure(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_BET_FAILURE,
        betId: "12345",
        selection: "selection name",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getMyBetsCancelAllUnmatchedExchangeBetsSuccess", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {},
      };

      const result = getMyBetsCancelAllUnmatchedExchangeBetsSuccess(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_ALL_BETS_SUCCESS,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getMyBetsCancelAllUnmatchedExchangeBetsFailure", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {},
      };

      const result = getMyBetsCancelAllUnmatchedExchangeBetsFailure(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.CANCELLED_ALL_BETS_FAILURE,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipBetBuilderRemoveSelections", () => {
    const action = {
      payload: {
        selection: {
          marketUrn: "market:urn",
          runnerUrn: "runner:urn",
        },
      },
    };

    it("should return the correct event payload", () => {
      const result = getBetslipBetBuilderRemoveSelections(action, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.REMOVED_ALL_SELECTIONS,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.sportsbook,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipSportsbookLoginToPlaceBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getBetslipSportsbookLoginToPlaceBetClickEvent({}, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.LOGIN_TO_PLACE_BET,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.sportsbook,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipExchangeLoginToPlaceBetClickEvent", () => {
    it("should return the correct event payload", () => {
      const result = getBetslipExchangeLoginToPlaceBetClickEvent({}, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.LOGIN_TO_PLACE_BET,
        betId: "null",
        selection: "null",
        selectionId: "null",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });
  });

  describe("getBetslipExchangeRemovePotentialSelectionEvent", () => {
    it("should return the correct event payload", () => {
      createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(() => [
        { side: "BACK", selectionId: 123, handicap: 0, price: 1.23 },
      ]);
      const result = getBetslipExchangeRemovePotentialSelectionEvent({}, {});

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: TaggingAction.REMOVED_SELECTION,
        betId: "null",
        selection: "some runner name",
        selectionId: "123",
        bettingProduct: ProductsOption.exchange,
      });

      expect(result).toEqual("betslip event");
    });

    describe("when betslipContext is not defined", () => {
      it("should return null", () => {
        getBetslipExchangeContext.mockReturnValueOnce(null);

        const result = getBetslipExchangeRemovePotentialSelectionEvent({}, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when potential bet to be removed is not defined", () => {
      it("should return null", () => {
        createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(() => []);

        const result = getBetslipExchangeRemovePotentialSelectionEvent({}, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when runner tree is not defined", () => {
      it("should return null", () => {
        getExchangeRunnerTree.mockReturnValueOnce(null);

        const result = getBetslipExchangeRemovePotentialSelectionEvent({}, {});

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });
  });

  describe("getBetslipSportsbookRemovePotentialSelectionEvent", () => {
    const runnerId = "930.360303491-5851483";
    const appState = {
      betting: {
        sportsbookBetting: {
          legs: [
            {
              runners: [runnerId],
            },
          ],
        },
      },
      entities: {
        sports: "sports",
        competitions: "competitions",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        exchangePotentialBets: [],
      },
    };

    const action = {
      payload: {
        urn: "runner:urn:1",
      },
    };

    describe("when all the information is available", () => {
      describe("and when the bettingGroup is REAL", () => {
        it("should return the correct event payload", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
              marketId: "930.360303491",
              selectionId: 5851483,
            }),
            getMetadata: jest.fn().mockReturnValueOnce({
              [runnerId]: {
                bettingGroup: "REAL",
              },
            }),
          });
          getSportsbookRunnerMetrics.mockReturnValue({ selection: "real selection", selection_id: 123 });

          const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

          expect(buildBetslipEvent).toHaveBeenCalledWith({
            action: TaggingAction.REMOVED_SELECTION,
            betId: "null",
            selection: "real selection",
            selectionId: "123",
            bettingProduct: ProductsOption.sportsbook,
          });

          expect(result).toEqual("betslip event");
        });
      });

      describe("and when the bettingGroup is VIRTUAL", () => {
        it("should return the correct event payload", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
              marketId: "930.360303491",
              selectionId: 5851483,
            }),
            getMetadata: jest.fn().mockReturnValueOnce({
              [runnerId]: {
                bettingGroup: "VIRTUAL",
              },
            }),
          });
          getVirtualRunnerMetrics.mockReturnValue({ selection: "virtual selection", selection_id: 123 });

          const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

          expect(buildBetslipEvent).toHaveBeenCalledWith({
            action: TaggingAction.REMOVED_SELECTION,
            betId: "null",
            selection: "virtual selection",
            selectionId: "123",
            bettingProduct: ProductsOption.sportsbook,
          });

          expect(result).toEqual("betslip event");
        });
      });
    });

    describe("when the runner metrics are null", () => {
      describe("and when the bettingGroup is REAL", () => {
        it("should return null", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
              marketId: "930.360303491",
              selectionId: 5851483,
            }),
            getMetadata: jest.fn().mockReturnValueOnce({
              [runnerId]: {
                bettingGroup: "REAL",
              },
            }),
          });
          getSportsbookRunnerMetrics.mockReturnValue(null);

          const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

          expect(buildBetslipEvent).not.toHaveBeenCalled();
          expect(result).toEqual(null);
        });
      });

      describe("and when the bettingGroup is VIRTUAL", () => {
        it("should return null", () => {
          getBettingResolvers.mockReturnValueOnce({
            getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
              marketId: "930.360303491",
              selectionId: 5851483,
            }),
            getMetadata: jest.fn().mockReturnValueOnce({
              [runnerId]: {
                bettingGroup: "VIRTUAL",
              },
            }),
          });
          getVirtualRunnerMetrics.mockReturnValue(null);

          const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

          expect(buildBetslipEvent).not.toHaveBeenCalled();
          expect(result).toEqual(null);
        });
      });
    });

    describe("when betslip card is not defined", () => {
      it("should return null", () => {
        getBetslipCard.mockReturnValueOnce(null);

        const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when runners metadata are not defined", () => {
      it("should return null", () => {
        getBettingResolvers.mockReturnValueOnce({
          getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
            marketId: "930.360303491",
            selectionId: 5851483,
          }),
          getMetadata: jest.fn().mockReturnValueOnce({
            "RUNNER:2": {
              racing: { urn: "race:urn:1", venue: "Venue" },
            },
          }),
        });

        const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when sportsbook runner tree is not defined", () => {
      it("should return null", () => {
        getBettingResolvers.mockReturnValueOnce({
          getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
            marketId: "930.360303491",
            selectionId: 5851483,
          }),
          getMetadata: jest.fn().mockReturnValueOnce({
            [runnerId]: {
              bettingGroup: "REAL",
            },
          }),
        });
        getSportsbookRunnerMetrics.mockReturnValue(null);

        const result = getBetslipSportsbookRemovePotentialSelectionEvent(action, appState);

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the action urn is not on the current betslip", () => {
      it("should return null", () => {
        getBettingResolvers.mockReturnValueOnce({
          getMarketRunnerIdAssociation: jest.fn().mockReturnValue({
            marketId: "930.360303492",
            selectionId: 5851484,
          }),
          getMetadata: jest.fn().mockReturnValueOnce({
            "930.360303492-5851484": {
              bettingGroup: "REAL",
            },
          }),
        });
        const result = getBetslipSportsbookRemovePotentialSelectionEvent(
          {
            payload: {
              urn: "runner:urn:2",
            },
          },
          appState,
        );

        expect(buildBetslipEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });
  });
});
