import { buildAddedSelectionEvent } from "tagging-library";

import { Product } from "../../state";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { getExchangeRunnerTree } from "../../state/entities/entities-selectors";
import { getSportsbookRunnerTree } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getLayoutMetadata } from "../../state/layout-snapshot";

import {
  getBetslipBetBuilderAddSelections,
  getExchangeAddSelectionToBetslip,
  getSportsbookAddSelectionToBetslip,
  getObbToggleLegEvent,
  getObbToggleMultipleLegEvent,
} from "./added-selection";

jest.mock("i18next", () => ({ t: jest.fn((t) => t) }));

jest.mock("tagging-library", () => ({
  buildAddedSelectionEvent: jest.fn().mockReturnValue("added selection event"),
}));

jest.mock("../../state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
  getBetslipExchangeReportUnmatched: jest.fn().mockReturnValue({ betId: "mocked bet id" }),
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
  cardGroupTitle: "pebbleCardGroup",
  pebbleCardGroupTitle: "pebbleCardGroup",
  tabName: "tab",
  horizontalPosition: 1,
  verticalPosition: 2,
};

const obbMetadataMock = {
  cardGroupTitle: "obb card group",
  tabName: "obb",
};

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn((cardUrn) => (cardUrn === "obb:card:urn" ? obbMetadataMock : metadataMock)),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createCardParentTitlesByURNSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      groupTitle: "groupTitle",
      tabTitle: "tabTitle",
      groupUrn: "ppb:group:card:urn",
    }),
  ),
  createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("home")),
  createNavTabTitleByURNSelector: jest.fn(() => jest.fn(() => "tabTitle")),
}));

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
  getSportsbookRunnerTree: jest.fn().mockReturnValue({
    marketRunner: { name: "selection name" },
    market: {
      hierarchy: { competition: "competition:urn", sportevent: "ppb:event:2" },
      marketId: "1.170230394",
      name: "some market name",
      inplay: false,
    },
    sport: { sportId: "sport:id:123", name: "some sport name" },
    runner: { selectionId: 123, odds: { decimal: 1.2 } },
  }),
  getSportsbookMarketTree: jest.fn().mockReturnValue({
    marketRunner: {
      name: "market name",
      selectionId: 123,
    },
  }),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
    getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: 1, selectionId: 123 }),
  }),
}));

jest.mock("../../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({ title: "viewTitle" })),
}));

let bettableCardUrn = { typename: "card typename" };

jest.mock("../../state/layout/cards/cards-selectors", () => {
  const getPopularMultiplesBetBuilderCardByURN = jest.fn(() => ({
    popularbettingopportunity: "popularbettingopportunityUrn",
    title: "popular multiples title",
  }));
  return {
    createBettableCardByURNSelector: jest.fn(() => jest.fn(() => bettableCardUrn)),
    createCardByURNSelector: jest.fn(() => getPopularMultiplesBetBuilderCardByURN),
  };
});

describe("added selection", () => {
  beforeEach(jest.clearAllMocks);

  describe("getBetslipBetBuilderAddSelections", () => {
    const action = {
      payload: {
        cardUrn: "card:URN",
        selection: { marketUrn: "market:URN", runnerUrn: "runner:URN", uniqueId: "12345" },
        odds: {
          decimal: 1.2,
        },
        parents: ["URN:1"],
        betOriginURL: "original url",
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
      layouts: {
        cards: {
          popularmultiplesbetbuilders: "popularbettingopportunityUrn",
        },
      },
    };

    it("should return the correct event payload", () => {
      const result = getBetslipBetBuilderAddSelections(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        selection: "selection name",
        selectionId: "123",
        bettingProduct: Product.Sportsbook,
        marketId: "1.170230394",
        sport: "some sport name",
        competition: "some competition name",
        market: "some market name",
        sportId: "sport:id:123",
        competitionId: "c123",
        priceAtSelection: "1.2",
        module: "home - primary swimlane - pebbleCardGroup | popular multiples title - some market name - tab",
        eventName: "some event name",
        eventId: "e123",
        betDirection: "back",
        betIdentifier: "12345",
        position: "1",
        moduleDisplayOrder: "2",
        inPlayIndicator: "no",
        antepostFlag: "no",
        currency: "eur",
      });

      expect(result).toEqual("added selection event");
    });

    describe("when runner metrics are not defined", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        getSportsbookRunnerTree.mockReturnValueOnce(null);

        const result = getBetslipBetBuilderAddSelections(action, appState);

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("for packaged created bets card", () => {
      it("should return the correct event payload", () => {
        createCardByURNSelector().mockReturnValue({
          displayName: {
            name: "packaged created bets card title",
          },
        });
        const result = getBetslipBetBuilderAddSelections(action, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
          selection: "selection name",
          selectionId: "123",
          bettingProduct: Product.Sportsbook,
          marketId: "1.170230394",
          sport: "some sport name",
          competition: "some competition name",
          market: "some market name",
          sportId: "sport:id:123",
          competitionId: "c123",
          priceAtSelection: "1.2",
          module:
            "home - primary swimlane - pebbleCardGroup | packaged created bets card title - some market name - tab",
          eventName: "some event name",
          eventId: "e123",
          betDirection: "back",
          betIdentifier: "12345",
          position: "1",
          moduleDisplayOrder: "2",
          inPlayIndicator: "no",
          antepostFlag: "no",
          currency: "eur",
        });

        expect(result).toEqual("added selection event");
      });

      describe("when runner metrics are not defined", () => {
        it("shouldn't call buildAddedSelectionEvent and return null", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(null);

          const result = getBetslipBetBuilderAddSelections(action, appState);

          expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
          expect(result).toEqual(null);
        });
      });
    });
    describe("for price boost multis card", () => {
      it("should return the correct payload", () => {
        createCardByURNSelector().mockReturnValue({
          displayName: {
            name: "price boost multis",
          },
        });

        const result = getBetslipBetBuilderAddSelections(action, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
          selection: "selection name",
          selectionId: "123",
          bettingProduct: Product.Sportsbook,
          marketId: "1.170230394",
          sport: "some sport name",
          competition: "some competition name",
          market: "some market name",
          sportId: "sport:id:123",
          competitionId: "c123",
          priceAtSelection: "1.2",
          module: "home - primary swimlane - pebbleCardGroup | price boost multis - some market name - tab",
          eventName: "some event name",
          eventId: "e123",
          betDirection: "back",
          betIdentifier: "12345",
          position: "1",
          moduleDisplayOrder: "2",
          inPlayIndicator: "no",
          antepostFlag: "no",
          currency: "eur",
        });

        expect(result).toEqual("added selection event");
      });
    });

    describe("for chatbot card (cardMetadata-driven attribution)", () => {
      const chatbotAction = {
        payload: {
          ...action.payload,
          cardMetadata: {
            cardUrn: "ppb:card:chatbot:1",
            typename: "SportsbookChatbotCard",
            title: "bets you can explore",
            horizontalPosition: 7,
          },
        },
      };

      it("uses cardMetadata.title as cardTitle when no Redux-resolved card matches", () => {
        // No Redux card match — fallthrough to cardMetadata.title.
        createCardByURNSelector().mockReturnValue(undefined);

        const result = getBetslipBetBuilderAddSelections(chatbotAction, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            module: "home - primary swimlane - pebbleCardGroup | bets you can explore - some market name - tab",
          }),
        );
        expect(result).toEqual("added selection event");
      });

      it("falls back to cardMetadata.horizontalPosition when layout metadata has none", () => {
        createCardByURNSelector().mockReturnValue(undefined);
        getLayoutMetadata.mockReturnValueOnce({
          cardGroupTitle: null,
          tabName: "tab",
          horizontalPosition: undefined,
          verticalPosition: 2,
        });

        const result = getBetslipBetBuilderAddSelections(chatbotAction, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            position: "7",
          }),
        );
        expect(result).toEqual("added selection event");
      });

      it("omits cardGroupTitle from the module when it is missing (chatbot cards have no group)", () => {
        createCardByURNSelector().mockReturnValue(undefined);
        getLayoutMetadata.mockReturnValueOnce({
          cardGroupTitle: null,
          tabName: "tab",
          horizontalPosition: null,
          verticalPosition: 2,
        });

        const result = getBetslipBetBuilderAddSelections(chatbotAction, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            module: "home - primary swimlane - bets you can explore - some market name - tab",
          }),
        );
        expect(result).toEqual("added selection event");
      });

      it("prefers layout metadata horizontalPosition when both are present", () => {
        createCardByURNSelector().mockReturnValue(undefined);
        // metadataMock default already has horizontalPosition: 1 — keep it and assert it wins over chatbot's 7.

        const result = getBetslipBetBuilderAddSelections(chatbotAction, appState);

        expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            position: "1",
          }),
        );
        expect(result).toEqual("added selection event");
      });
    });
  });

  describe("getExchangeAddSelectionToBetslip", () => {
    const action = {
      payload: {
        cardUrn: "card:URN",
        price: 1.2,
        parents: ["URN:1"],
        betOriginURL: "original url",
        uniqueId: "uniqueId",
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
      layouts: {
        cards: {
          popularmultiplesbetbuilders: "popularbettingopportunityUrn",
        },
      },
      router: {
        currentUrn: "current:URN",
      },
    };

    afterEach(() => {
      bettableCardUrn = { typename: "card typename" };
    });

    it("should return the correct event payload", () => {
      const result = getExchangeAddSelectionToBetslip(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        selection: "some runner name",
        selectionId: "123",
        bettingProduct: Product.Exchange,
        marketId: "1.170230394",
        sport: "some sport name",
        competition: "some competition name",
        market: "some market name",
        sportId: "sport:id:123",
        competitionId: "c123",
        priceAtSelection: "1.2",
        module: "home - primary swimlane - pebbleCardGroup - some market name - tab",
        eventName: "some event name",
        eventId: "e123",
        betDirection: "back",
        betIdentifier: "uniqueId",
        position: "1",
        moduleDisplayOrder: "2",
        inPlayIndicator: "no",
        antepostFlag: "no",
        currency: "eur",
      });

      expect(result).toEqual("added selection event");
    });

    describe("when view is not defined", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        getViewbyURN.mockReturnValueOnce(null);

        const result = getExchangeAddSelectionToBetslip(action, appState);

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when Bettable Card is not defined", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        bettableCardUrn = null;

        const result = getExchangeAddSelectionToBetslip(action, appState);

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when runner metrics are not defined", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        getExchangeRunnerTree.mockReturnValueOnce(null);

        const result = getExchangeAddSelectionToBetslip(action, appState);

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });
  });

  describe("getSportsbookAddSelectionToBetslip", () => {
    const action = {
      payload: {
        cardUrn: "card:URN",
        parents: ["URN:1"],
        betOriginURL: "original url",
        uniqueId: "uniqueId",
      },
    };

    const appState = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
      },
      layouts: {
        views: "views",
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    afterEach(() => {
      bettableCardUrn = { typename: "card typename" };
    });

    it("should return the correct event payload", () => {
      const result = getSportsbookAddSelectionToBetslip(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        module: "home - primary swimlane - pebbleCardGroup - some market name - tab",
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "uniqueId",
        currency: "eur",
        position: "1",
        moduleDisplayOrder: "2",
        sportId: "sport:id:123",
        sport: "some sport name",
        competitionId: "c123",
        competition: "some competition name",
        eventId: "e123",
        eventName: "some event name",
        marketId: "1.170230394",
        market: "some market name",
        selectionId: "123",
        selection: "selection name",
        priceAtSelection: "1.2",
        inPlayIndicator: "no",
        antepostFlag: "no",
      });

      expect(result).toEqual("added selection event");
    });

    it("should return the correct event payload for MatchStatSelectionCard", () => {
      bettableCardUrn = { typename: "MatchStatSelectionCard" };

      const result = getSportsbookAddSelectionToBetslip(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        module: "home - primary swimlane - pebbleCardGroup - obp",
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "uniqueId",
        currency: "eur",
        position: "1",
        moduleDisplayOrder: "2",
        sportId: "sport:id:123",
        sport: "some sport name",
        competitionId: "c123",
        competition: "some competition name",
        eventId: "e123",
        eventName: "some event name",
        marketId: "1.170230394",
        market: "some market name",
        selectionId: "123",
        selection: "selection name",
        priceAtSelection: "1.2",
        inPlayIndicator: "no",
        antepostFlag: "no",
      });

      expect(result).toEqual("added selection event");
    });

    describe("when runner metrics are not defined", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        getSportsbookRunnerTree.mockReturnValueOnce(null);

        const result = getSportsbookAddSelectionToBetslip(action, appState);

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the leg is still in state", () => {
      it("shouldn't call buildAddedSelectionEvent and return null", () => {
        const result = getSportsbookAddSelectionToBetslip(action, {
          ...appState,
          betting: { sportsbookBetting: { legs: { "SIMPLE_SELECTION:[1-123]": "some leg" } } },
        });

        expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the event is triggered via a deeplink", () => {
      describe("and is a Bet Sharing deeplink", () => {
        it("should return the correct event payload with the bet sharing as module", () => {
          const result = getSportsbookAddSelectionToBetslip(
            {
              payload: {
                ...action.payload,
                deeplink: {
                  isBetSharing: true,
                },
              },
            },
            appState,
          );

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "bet sharing",
              position: "null",
              moduleDisplayOrder: "null",
            }),
          );

          expect(result).toEqual("added selection event");
        });
      });

      describe("and is not a Bet Sharing deeplink", () => {
        it("should return the correct event payload with the deeplink as module", () => {
          const result = getSportsbookAddSelectionToBetslip(
            {
              payload: {
                ...action.payload,
                deeplink: {
                  isBetSharing: false,
                },
              },
            },
            appState,
          );

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "deeplink",
              position: "null",
              moduleDisplayOrder: "null",
            }),
          );

          expect(result).toEqual("added selection event");
        });
      });
    });

    describe("when the event is not triggered via a deeplink", () => {
      describe("and Bettable Card is not defined", () => {
        it("should call buildAddedSelectionEvent and return the event payload", () => {
          bettableCardUrn = null;

          const result = getSportsbookAddSelectionToBetslip(action, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalled();
          expect(result).toEqual("added selection event");
        });
      });

      describe("and Bettable Card is not defined but cardMetadata is provided", () => {
        it("should use cardMetadata as resolvedCard fallback for card type resolution", () => {
          bettableCardUrn = null;

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: { typename: "PopularSelectionsCard", title: "Popular Selections" },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - primary swimlane - pebbleCardGroup - some market name - tab",
            }),
          );
          expect(result).toEqual("added selection event");
        });

        it("should use cardMetadata.title as fallback when cardGroupTitle is not available", () => {
          bettableCardUrn = null;
          getLayoutMetadata.mockReturnValueOnce({
            cardGroupTitle: null,
            tabName: "tab",
            horizontalPosition: 1,
            verticalPosition: 2,
          });

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: { typename: "PopularSelectionsCard", title: "Popular Selections" },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - primary swimlane - Popular Selections - some market name - tab",
            }),
          );
          expect(result).toEqual("added selection event");
        });

        it("should use cardMetadata.typename to resolve secondary swimlane for HighlightedSelectionCard", () => {
          bettableCardUrn = null;
          getLayoutMetadata.mockReturnValueOnce({
            cardGroupTitle: null,
            tabName: "tab",
            horizontalPosition: 1,
            verticalPosition: 2,
          });

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: { typename: "HighlightedSelectionCard", title: "Highlighted" },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - secondary swimlane - Highlighted - some market name - tab",
            }),
          );
          expect(result).toEqual("added selection event");
        });

        it("should use cardMetadata.typename to resolve obp module for MatchStatSelectionCard", () => {
          bettableCardUrn = null;

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: { typename: "MatchStatSelectionCard", title: "Match Stats" },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - primary swimlane - pebbleCardGroup - obp",
            }),
          );
          expect(result).toEqual("added selection event");
        });
      });

      describe("and both Bettable Card and cardMetadata are not defined", () => {
        it("should use the fallback module with selection name", () => {
          bettableCardUrn = null;

          const actionWithoutCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: undefined,
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithoutCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - primary swimlane - pebbleCardGroup - some market name",
            }),
          );
          expect(result).toEqual("added selection event");
        });
      });

      describe("and Bettable Card exists with cardMetadata also provided", () => {
        it("should use card from Redux and not use cardMetadata.title as cardGroupTitle", () => {
          bettableCardUrn = { typename: "card typename" };
          getLayoutMetadata.mockReturnValueOnce({
            cardGroupTitle: null,
            tabName: "tab",
            horizontalPosition: 1,
            verticalPosition: 2,
          });

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: { typename: "PopularSelectionsCard", title: "Popular Selections" },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              module: "home - primary swimlane - null - some market name - tab",
            }),
          );
          expect(result).toEqual("added selection event");
        });
      });

      describe("and cardMetadata.horizontalPosition is provided", () => {
        it("falls back to cardMetadata.horizontalPosition when layout metadata has none", () => {
          bettableCardUrn = { typename: "card typename" };
          getLayoutMetadata.mockReturnValueOnce({
            cardGroupTitle: "pebbleCardGroup",
            tabName: "tab",
            horizontalPosition: null,
            verticalPosition: 2,
          });

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: {
                cardUrn: "ppb:card:chatbot:1",
                typename: "SportsbookChatbotCard",
                title: "bets you can explore",
                horizontalPosition: 7,
              },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              position: "7",
            }),
          );
          expect(result).toEqual("added selection event");
        });

        it("prefers layout metadata horizontalPosition when both are present", () => {
          bettableCardUrn = { typename: "card typename" };
          // metadataMock default already has horizontalPosition: 1 — assert it wins over cardMetadata's 7.

          const actionWithCardMetadata = {
            payload: {
              ...action.payload,
              cardMetadata: {
                cardUrn: "ppb:card:chatbot:1",
                typename: "SportsbookChatbotCard",
                title: "bets you can explore",
                horizontalPosition: 7,
              },
            },
          };

          const result = getSportsbookAddSelectionToBetslip(actionWithCardMetadata, appState);

          expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              position: "1",
            }),
          );
          expect(result).toEqual("added selection event");
        });
      });
    });
  });

  describe("getObbToggleLegEvent", () => {
    const action = {
      payload: {
        legId: "legId1",
        cardUrn: "obb:card:urn",
        position: {
          horizontalPosition: 1,
          verticalPosition: 2,
        },
      },
    };

    const appState = {
      betslip: {
        activeProduct: Product.Sportsbook,
      },
      betting: {
        obbBetting: {
          legs: {},
          potentialBets: {},
        },
      },
      entities: {
        obbLegs: {
          legId1: {
            id: "legId1",
            templateId: "playerVsPlayer",
            templateParams: {
              participantIdA: "participant:1",
              participantIdB: "participant:2",
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
            quote: {
              price: {
                decimal: 1.5,
                fractional: {
                  numerator: 3,
                  denominator: 2,
                },
              },
              typename: "ObbQuoteSuccess",
            },
            event: {
              urn: "sportevent:urn",
              name: "Event Name",
            },
          },
        },
        userdetails: {
          accountId: "accountId",
          currencyCode: "eur",
        },
        obbParticipants: {
          "participant:1": {
            typename: "ObbFootballPlayer",
            urn: "participant:1",
            player: { name: "participant:1", id: "participantId1" },
          },
          "participant:2": {
            typename: "ObbFootballPlayer",
            urn: "participant:2",
            player: { name: "participant:2", id: "participantId2" },
          },
        },
        sportevents: {
          "sportevent:urn": {
            name: "Event Name",
            competition: "competition:urn",
            eventId: "e123",
          },
        },
        sports: {
          "sport:urn": { name: "Some Sport", sportId: "sport:id:123" },
        },
        competitions: {
          "competition:urn": {
            sport: "sport:urn",
            name: "Some Competition",
            competitionId: "c123",
          },
        },
      },
    };

    it("should return the correct event payload", () => {
      const result = getObbToggleLegEvent(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        module: "home - null - obb card group - I18N.OBB.BETTYPE.playerVsPlayer - obb",
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "legId1",
        currency: "eur",
        position: "2",
        moduleDisplayOrder: "1",
        sportId: "sport:id:123",
        sport: "Some Sport",
        competitionId: "c123",
        competition: "Some Competition",
        eventId: "e123",
        eventName: "Event Name",
        marketId: "null",
        market: "I18N.OBB.BETTYPE.playerVsPlayer",
        selectionId: "null",
        selection: "(Build Ups) participant:1 | I18N.OBB.DESCRIPTION.BETSLIP.PVP",
        priceAtSelection: "1.5",
        inPlayIndicator: "no",
        antepostFlag: "no",
      });

      expect(result).toEqual("added selection event");
    });

    it("should use payload metadataOverride card in module parameter when provided", () => {
      const actionWithMetadata = {
        payload: {
          ...action.payload,
          metadataOverride: {
            card: "popular card",
          },
        },
      };

      const result = getObbToggleLegEvent(actionWithMetadata, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          module: "home - null - obb card group - popular card - obb",
        }),
      );

      expect(result).toEqual("added selection event");
    });

    it("should use payload metadataOverride group in module parameter when provided", () => {
      const actionWithMetadata = {
        payload: {
          ...action.payload,
          metadataOverride: {
            group: "onboarding card group",
          },
        },
      };

      const result = getObbToggleLegEvent(actionWithMetadata, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          module: "home - null - onboarding card group - I18N.OBB.BETTYPE.playerVsPlayer - obb",
        }),
      );

      expect(result).toEqual("added selection event");
    });

    it("should use payload metadataOverride tab in module parameter when provided", () => {
      const actionWithMetadata = {
        payload: {
          ...action.payload,
          metadataOverride: {
            tab: "custom tab",
          },
        },
      };

      const result = getObbToggleLegEvent(actionWithMetadata, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          module: "home - null - obb card group - I18N.OBB.BETTYPE.playerVsPlayer - custom tab",
        }),
      );

      expect(result).toEqual("added selection event");
    });

    it("should use payload metadataOverride pageType and swimlane in module parameter when provided", () => {
      const actionWithMetadata = {
        payload: {
          ...action.payload,
          metadataOverride: {
            pageType: "event page",
            swimlaneType: "horizontal",
          },
        },
      };

      const result = getObbToggleLegEvent(actionWithMetadata, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          module: "event page - horizontal - obb card group - I18N.OBB.BETTYPE.playerVsPlayer - obb",
        }),
      );

      expect(result).toEqual("added selection event");
    });
  });

  describe("getObbToggleMultipleLegEvent", () => {
    const action = {
      payload: {
        legIds: ["legId1", "legId2"],
        cardUrn: "obb:card:urn",
        position: {
          horizontalPosition: 1,
          verticalPosition: 2,
        },
      },
    };

    const appState = {
      betslip: {
        activeProduct: Product.Sportsbook,
      },
      betting: {
        obbBetting: {
          legs: {},
          potentialBets: {},
        },
      },
      entities: {
        obbLegs: {
          legId1: {
            id: "legId1",
            templateId: "playerVsPlayer",
            templateParams: {
              participantIdA: "participant:1",
              participantIdB: "participant:2",
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
            quote: {
              price: {
                decimal: 1.5,
                fractional: {
                  numerator: 3,
                  denominator: 2,
                },
              },
              typename: "ObbQuoteSuccess",
            },
            event: {
              urn: "sportevent:urn",
              name: "Event Name",
            },
          },
          legId2: {
            id: "legId2",
            templateId: "playerVsPlayer",
            templateParams: {
              participantIdA: "participant:2",
              participantIdB: "participant:1",
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
            quote: {
              price: {
                decimal: 2,
                fractional: {
                  numerator: 2,
                  denominator: 1,
                },
              },
            },
            event: {},
          },
        },
        userdetails: {
          accountId: "accountId",
          currencyCode: "eur",
        },
        obbParticipants: {
          "participant:1": {
            typename: "ObbFootballPlayer",
            urn: "participant:1",
            player: { name: "participant:1", id: "participantId1" },
          },
          "participant:2": {
            typename: "ObbFootballPlayer",
            urn: "participant:2",
            player: { name: "participant:2", id: "participantId2" },
          },
        },
        sportevents: {
          "sportevent:urn": {
            name: "Event Name",
            competition: "competition:urn",
            eventId: "e123",
          },
        },
        sports: {
          "sport:urn": { name: "Some Sport", sportId: "sport:id:123" },
        },
        competitions: {
          "competition:urn": {
            sport: "sport:urn",
            name: "Some Competition",
            competitionId: "c123",
          },
        },
      },
    };

    it("should return the correct events payload if the leg exists in the entities state", () => {
      const result = getObbToggleMultipleLegEvent(action, appState);

      expect(buildAddedSelectionEvent).toHaveBeenCalledTimes(2);

      expect(buildAddedSelectionEvent).toHaveBeenNthCalledWith(1, {
        module: "home - null - obb card group - player picker - null",
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "legId1",
        currency: "eur",
        position: "2",
        moduleDisplayOrder: "1",
        sportId: "sport:id:123",
        sport: "Some Sport",
        competitionId: "c123",
        competition: "Some Competition",
        eventId: "e123",
        eventName: "Event Name",
        marketId: "null",
        market: "I18N.OBB.BETTYPE.playerVsPlayer",
        selectionId: "null",
        selection: "(Build Ups) participant:1 | I18N.OBB.DESCRIPTION.BETSLIP.PVP",
        priceAtSelection: "1.5",
        inPlayIndicator: "no",
        antepostFlag: "no",
      });

      expect(buildAddedSelectionEvent).toHaveBeenNthCalledWith(2, {
        module: "home - null - obb card group - player picker - null",
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "legId2",
        currency: "eur",
        position: "2",
        moduleDisplayOrder: "1",
        sportId: "undefined",
        sport: undefined,
        competitionId: "",
        competition: "",
        eventId: "",
        eventName: "",
        marketId: "null",
        market: "I18N.OBB.BETTYPE.playerVsPlayer",
        selectionId: "null",
        selection: "(Build Ups) participant:2 | I18N.OBB.DESCRIPTION.BETSLIP.PVP",
        priceAtSelection: "null",
        inPlayIndicator: "no",
        antepostFlag: "no",
      });

      expect(result).toEqual(["added selection event", "added selection event"]);
    });

    it("should return an empty array if the leg does not exist in state", () => {
      const result = getObbToggleMultipleLegEvent(action, {
        ...appState,
        entities: { ...appState.entities, obbLegs: {} },
      });
      expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return an empty array if the leg is already in the betslip", () => {
      const result = getObbToggleMultipleLegEvent(action, {
        ...appState,
        betting: {
          obbBetting: {
            legs: { legId1: "some leg", legId2: "some other leg" },
            potentialBets: {},
          },
        },
      });

      expect(buildAddedSelectionEvent).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
