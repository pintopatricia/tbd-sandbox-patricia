import {
  createFullCardsByCardGroupSelector,
  createCouponProductsByURNSelector,
  createCardParentTitlesByURNSelector,
  createViewTypeSelector,
  createNavTabTitleByURNSelector,
} from "./layout-selectors";
import { getViewbyURN } from "./views/event-view/event-view-selectors";
import { createCardGroupByURNSelector } from "./cardgroups/cardgroups-selectors";
import { createFindCardbyURNSelector, createCardByURNSelector } from "./cards/cards-selectors";
import { isExchangeMarket, isSportsbookMarket } from "../../helpers/markets";
import { createHydratedPebbleCardGroupsSelector } from "./cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";

jest.mock("./views/view-selectors");

jest.mock("./viewzones/viewzone-selectors", () => ({
  createViewZoneByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("./cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => jest.fn()),
}));
jest.mock("./cardgroups/pebble-cardgroups/pebble-cardgroups-selectors", () => ({
  createHydratedPebbleCardGroupsSelector: jest.fn(() => jest.fn()),
}));
jest.mock("./cards/cards-selectors", () => ({
  createFindCardbyURNSelector: jest.fn(() => jest.fn()),
  createCardByURNSelector: jest.fn(() => jest.fn()),
}));
jest.mock("../../helpers/markets", () => ({
  isExchangeMarket: jest.fn(),
  isSportsbookMarket: jest.fn(),
}));

jest.mock("./views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn(() => ({
    urn: "viewURN",
    items: [{ urn: "card:urn:1" }, { urn: "card:urn:2" }, { urn: "card:urn:3" }],
  })),
}));

const TRANSLATABLE_TEXT_1 = {
  translated: "some title 1",
  translate: {
    key: "SOME.I18N.KEY",
  },
};

const TRANSLATABLE_TEXT_2 = {
  translated: "some title 2",
  translate: {
    key: "OTHER.I18N.KEY",
  },
};

const stateMock = {
  layouts: {
    views: {
      market: {
        "ppb:tbd:marketview:1": {
          urn: "ppb:tbd:marketview:1",
          items: [
            { urn: "ppb:tbd:fixture#29606443", typename: "FixtureCard" },
            { urn: "ppb:tbd:card:market#1.123123", typename: "MarketCard" },
          ],
          mainMarket: "ppb:tbd:market:urn",
        },
        "ppb:tbd:marketview:2": {
          urn: "ppb:tbd:marketview:2",
          items: [
            { urn: "ppb:tbd:fixture#29606443", typename: "FixtureCard" },
            { urn: "ppb:tbd:card:market#1.123123", typename: "MarketCard" },
            { urn: "ppb:tbd:card:pebbleMarkets:924.229966790", typename: "PebbleCardGroup" },
            { urn: "ppb:tbd:card:pebbleMarkets:924.229966111", typename: "PebbleCardGroup" },
          ],
          mainMarket: "ppb:tbd:market:urn",
        },
      },
      event: {
        "ppb:tbd:view:event:29768117": {
          urn: "ppb:tbd:view:event:29768117",
          items: [
            { urn: "ppb:tbd:card:fixture:29768117", typename: "FixtureCard" },
            { urn: "ppb:tbd:card:matchstats:29768117", typename: "MatchStatsCard" },
          ],
        },
      },
    },
    cards: {
      markets: {
        "ppb:tbd:card:market#1.123123": {
          urn: "ppb:tbd:card:market#1.123123",
          title: "Over/Under 0.5",
        },
        "ppb:tbd:card:market#1.222222": {
          urn: "ppb:tbd:card:market#1.222222",
        },
        "ppb:tbd:card:market#1.333333": {
          urn: "ppb:tbd:card:market#1.333333",
        },
      },
      marketsextended: {
        "ppb:tbd:card:marketExtended#1.123123": {
          urn: "ppb:tbd:card:marketExtended#1.123123",
          title: "Over/Under 0.5",
        },
        "ppb:tbd:card:marketExtended#1.222222": {
          urn: "ppb:tbd:card:marketExtended#1.222222",
        },
      },
      fixtures: {
        "ppb:tbd:card:fixture:29768117": {
          urn: "ppb:tbd:card:fixture:29768117",
          fixtureURN: "ppb:tbd:fixture:29768117",
        },
        "ppb:tbd:fixture#29606443": { urn: "ppb:tbd:fixture#29606443", fixtureURN: "ppb:tbd:fixture:29606443" },
      },
      eventmarkets: {
        "event:market:1": {
          displayRunners: {
            sportsbook: {
              market: "ppb:tbd:card:market#1.123123",
            },
            exchange: { market: "ppb:tbd:card:market#1.123123" },
          },
        },
        "event:market:2": {},
        "event:market:3": {},
      },
      games: {
        "game:1": {},
        "game:2": {},
      },
    },
    cardgroups: {
      swimlanecardgroups: {
        "card:group:1": {
          items: [
            { urn: "event:market:1", typename: "MarketCard" },
            { urn: "event:market:2", typename: "MarketCard" },
            { urn: "event:market:3", typename: "MarketCard" },
            { urn: "event:market:4", typename: "MarketCard" },
            { urn: "event:market:5", typename: "MarketCard" },
            { urn: "event:market:6", typename: "MarketCard" },
            { urn: "event:market:7", typename: "MarketCard" },
            { urn: "event:market:8", typename: "MarketCard" },
            { urn: "event:market:9", typename: "MarketCard" },
            { urn: "event:market:10", typename: "MarketCard" },
            { urn: "event:market:11", typename: "MarketCard" },
          ],
        },
        "card:group:2": {
          items: [
            { urn: "event:market:1", typename: "MarketCard" },
            { urn: "event:market:100", typename: "MarketCard" },
          ],
        },
        "card:group:3": {
          urn: "card:group:3",
          title: "The best card group around",
          items: [{ urn: "ppb:tbd:card:market#1.54321", typename: "MarketCard" }],
        },
      },
      halftimespecialsswimlanecardgroups: {
        "card:group:1": {
          items: [
            { urn: "event:market:1", typename: "MarketCard" },
            { urn: "event:market:2", typename: "MarketCard" },
            { urn: "event:market:3", typename: "MarketCard" },
            { urn: "event:market:4", typename: "MarketCard" },
            { urn: "event:market:5", typename: "MarketCard" },
            { urn: "event:market:6", typename: "MarketCard" },
            { urn: "event:market:7", typename: "MarketCard" },
            { urn: "event:market:8", typename: "MarketCard" },
            { urn: "event:market:9", typename: "MarketCard" },
            { urn: "event:market:10", typename: "MarketCard" },
            { urn: "event:market:11", typename: "MarketCard" },
          ],
        },
        "card:group:2": {
          items: [
            { urn: "event:market:1", typename: "MarketCard" },
            { urn: "event:market:100", typename: "MarketCard" },
          ],
        },
        "card:group:3": {
          urn: "card:group:3",
          title: "The best card group around",
          items: [{ urn: "ppb:tbd:card:market#1.54321", typename: "MarketCard" }],
        },
      },
      pebblecardgroups: {
        "ppb:tbd:card:pebbleMarkets:924.229966790": {
          urn: "ppb:tbd:card:pebbleMarkets:924.229966790",
          title: { translated: "Blue mind" },
          items: [
            {
              urn: "ppb:tbd:card:market#1.123123",
            },
            {
              urn: "ppb:tbd:card:market#1.222222",
              name: "Pebble Title",
            },
          ],
        },
        "ppb:tbd:card:pebbleExtendedMarkets:924.229966790": {
          urn: "ppb:tbd:card:pebbleExtendedMarkets:924.229966790",
          items: [
            {
              urn: "ppb:tbd:card:marketExtended#1.123123",
            },
            {
              urn: "ppb:tbd:card:marketExtended#1.222222",
              name: "Pebble Title",
            },
          ],
        },
        "ppb:tbd:card:pebbleMarkets:29768117": {
          items: ["event:pebble:1"],
        },
      },
      segmentedcardgroups: {
        "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid":
          {
            urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
            type: "SEGMENTED_CARDGROUP",
            items: [
              "ppb:tbd:card:group:curatedGames:gaming-arcade-zone",
              "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid",
            ],
          },
      },
      filteredcouponcardgroups: {
        "filtered:coupon:card:group:1": {
          items: [
            { urn: "filtered:coupon:event:market:1", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:2", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:3", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:4", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:5", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:6", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:7", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:8", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:9", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:10", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:11", typename: "Filtered Coupon" },
          ],
          title: "eat soup, live better!",
        },
        "filtered:coupon:card:group:2": {
          items: [
            { urn: "filtered:coupon:event:market:1", typename: "Filtered Coupon" },
            { urn: "filtered:coupon:event:market:100", typename: "Filtered Coupon" },
          ],
        },
      },
      racesbytimerangecardgroups: {},
      futureracingcardgroups: {},
      quicklinksgridcardgroups: {},
      sportribboncardgroups: {},
      racingswimlanecardgroups: {},
      popularswimlanecardgroups: {},
    },
    viewzones: {
      "ppb:tbd:view:zone:multifunctionalModule:test-zone": {
        urn: "ppb:tbd:view:zone:multifunctionalModule:test-zone",
        type: "VIEW_ZONE",
        title: "Casino",
        items: [
          "ppb:tbd:card:group:recentlyPlayedGames:gaming-recently-played-zone",
          "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
        ],
      },
    },
    navigationtabslists: {
      "ppb:tbd:card:navigationTabsList:abc": {
        urn: "ppb:tbd:card:navigationTabsList:abc",
        title: {
          translated: "All Chicken Racing",
          translate: {
            key: "SOME.I18N.KEY",
          },
        },
        items: [
          {
            urn: "ppb:tbd:view:navigationTab:123",
            title: TRANSLATABLE_TEXT_1,
          },
          {
            urn: "ppb:tbd:view:navigationTab:456",
            title: TRANSLATABLE_TEXT_2,
          },
        ],
      },
    },
    navigationtabs: {
      "ppb:tbd:view:navigationTab:123": {
        urn: "ppb:tbd:view:navigationTab:123",
        title: {
          translated: "some title 1",
          translate: {
            key: "SOME.I18N.KEY",
          },
        },
        items: [
          { urn: "ppb:tbd:card:market#1.333333", typename: "Card" },
          { urn: "card:group:3", typename: "SwimlaneCardGroup" },
        ],
      },
      "ppb:tbd:view:navigationTab:456": {
        urn: "ppb:tbd:view:navigationTab:456",
        title: {
          translated: "some title 2",
          translate: {
            key: "OTHER.I18N.KEY",
          },
        },
        items: [
          { urn: "ppb:tbd:card:3", typename: "Card" },
          { urn: "ppb:tbd:card:4", typename: "Card" },
        ],
      },
    },
    regulatoryData: {
      typename: "RegulatoryData",
      sections: [
        {
          sectionType: "GENERIC",
          items: [
            {
              type: "TEXT",
              text: "This is a regulatory mandatory text",
              alignment: "right",
            },
          ],
        },
        {
          sectionType: "GENERIC",
          items: [
            {
              type: "LINK",
              alignment: "center",
              text: "Gambling can be addictive, please play responsibly",
              target: "BLANK",
              viewLink: {
                viewUrl: "http://responsiblegambling.betfair.com/",
                viewDisplayMode: "BLANK_INAPP",
              },
            },
          ],
        },
      ],
    },
  },
  router: {
    currentUrn: "ppb:tbd:marketview:1",
    currentUrl: "football/stuff/r-1",
  },
  entities: {
    userdetails: {
      countryCode: "IE",
      currencyCode: "EUR",
      localeCode: "en",
      firstName: "Sebastian",
      localeCodeBcp47: "en_GB",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
    },
    preferences: {
      exchangeOddsDisplay: "DECIMAL",
      sportsbookOddsDisplay: "FRACTIONAL",
      quickStakes: [{ stake: 5 }],
    },
  },
};

describe("layout state selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFullCardsByCardGroupSelector selector", () => {
    beforeEach(() => {
      createFindCardbyURNSelector.mockReturnValue(jest.fn(() => []));
    });
    it("should return all full cards", () => {
      expect(
        createFullCardsByCardGroupSelector()(
          stateMock,
          { urn: "card:group:1" },
          stateMock.layouts.cards,
          stateMock.layouts.swimlanecardgroups,
          "card:group:1",
        ),
      ).toEqual([
        "event:market:1",
        "event:market:2",
        "event:market:3",
        "event:market:4",
        "event:market:5",
        "event:market:6",
        "event:market:7",
        "event:market:8",
        "event:market:9",
        "event:market:10",
        "event:market:11",
      ]);
    });
  });

  describe("createCouponProductsByURNSelector", () => {
    describe("when product markets exist", () => {
      it("should return both products set to true", () => {
        createCardGroupByURNSelector.mockReturnValue(
          jest.fn(() => stateMock.layouts.cardgroups.filteredcouponcardgroups["filtered:coupon:card:group:2"]),
        );
        createCardByURNSelector.mockReturnValue(jest.fn(() => stateMock.layouts.cards.eventmarkets["event:market:1"]));
        isSportsbookMarket.mockReturnValue(true);
        isExchangeMarket.mockReturnValue(true);
        expect(
          createCouponProductsByURNSelector()(
            stateMock.layouts,
            "filtered:coupon:card:group:1",
            stateMock.layouts.cards.eventmarkets,
            [
              "coupon:event:market:1",
              "coupon:event:market:2",
              "coupon:event:market:3",
              "coupon:event:market:4",
              "coupon:event:market:5",
              "coupon:event:market:6",
              "coupon:event:market:7",
              "coupon:event:market:8",
              "coupon:event:market:9",
              "coupon:event:market:10",
              "coupon:event:market:11",
            ],
          ),
        ).toEqual({ Exchange: true, Sportsbook: true });
      });
    });
    describe("when there are no product markets", () => {
      beforeEach(() => {});
      it("should return both products set to false", () => {
        createCardGroupByURNSelector.mockReturnValue(
          jest.fn(() => stateMock.layouts.cardgroups.filteredcouponcardgroups["filtered:coupon:card:group:1"]),
        );
        createCardByURNSelector.mockReturnValue(
          jest.fn(() => stateMock.layouts.cards.eventmarkets["filtered:event:market:2"]),
        );
        isExchangeMarket.mockReturnValue(true);
        isSportsbookMarket.mockReturnValue(false);
        expect(
          createCouponProductsByURNSelector()(
            stateMock.layouts,
            "filtered:coupon:card:group:1",
            stateMock.layouts.cards.eventmarkets,
            [
              "filtered:coupon:event:market:1",
              "filtered:coupon:event:market:2",
              "filtered:coupon:event:market:3",
              "filtered:coupon:event:market:4",
              "filtered:coupon:event:market:5",
              "filtered:coupon:event:market:6",
              "filtered:coupon:event:market:7",
              "filtered:coupon:event:market:8",
              "filtered:coupon:event:market:9",
              "filtered:coupon:event:market:10",
              "filtered:coupon:event:market:11",
            ],
          ),
        ).toEqual({ Exchange: false, Sportsbook: false });
      });
    });
  });

  describe("createCardParentTitlesByURNSelector", () => {
    const urnMock = "ppb:tbd:card:market#1.54321";

    function setup(state = stateMock, urn = urnMock) {
      createHydratedPebbleCardGroupsSelector.mockReturnValue(jest.fn(() => state.layouts.cardgroups.pebblecardgroups));

      const getCardParentTitlesByURN = createCardParentTitlesByURNSelector();

      return getCardParentTitlesByURN(state.layouts, urn);
    }

    describe("when the card urn is in a 'group'", () => {
      it("should return that group title", () => {
        const { groupTitle } = setup();

        expect(groupTitle).toEqual("The best card group around");
      });

      it("should return that group urn", () => {
        const { groupUrn } = setup();

        expect(groupUrn).toEqual("card:group:3");
      });

      describe("when that group is also in a navigation tab", () => {
        it("should return the translated tab title", () => {
          const { tabTitle } = setup({
            layouts: {
              ...stateMock.layouts,
              navigationtabs: {
                ...stateMock.layouts.navigationtabs,
                "ppb:tbd:view:navigationTab:123": {
                  ...stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
                  title: {
                    translated: "some title 1",
                    translate: null,
                  },
                },
              },
            },
          });

          expect(tabTitle).toEqual("some title 1");
        });
      });

      describe("when that group not in a navigation tab", () => {
        it("should return the tab title as null", () => {
          const { tabTitle } = setup(stateMock, "ppb:tbd:card:eventPrimaryMarket:30519176");

          expect(tabTitle).toEqual(null);
        });
      });
    });

    describe("when the card urn is not a 'group'", () => {
      it("should return the group title as null", () => {
        const { groupTitle } = setup(stateMock, "ppb:tbd:card:market#1.333333");

        expect(groupTitle).toEqual(null);
      });

      it("should return the group urn as null", () => {
        const { groupUrn } = setup(stateMock, "ppb:tbd:card:market#1.333333");

        expect(groupUrn).toEqual(null);
      });

      describe("when the card urn is in a navigation tab", () => {
        it("should return the group title as null", () => {
          const { tabTitle } = setup(stateMock, "ppb:tbd:card:market#1.333333");

          expect(tabTitle).toEqual("SOME.I18N.KEY");
        });
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const stateMock2 = {
          ...stateMock,
          layouts: {
            ...stateMock.layouts,
            cardgroups: {
              ...stateMock.layouts.cardgroups,
              pebblecardgroups: {
                "ppb:tbd:card:pebbleMarkets:924.229966790": {
                  urn: "ppb:tbd:card:pebbleMarkets:924.229966790",
                  title: "I'm gonna change",
                  items: [
                    {
                      typename: "EventMarketCard",
                      urn: "ppb:tbd:card:eventPrimaryMarket:30519176",
                    },
                  ],
                },
              },
            },
          },
        };

        createHydratedPebbleCardGroupsSelector.mockImplementation(() => (input) => ({ ...input }));

        const getCardParentTitlesByURN = createCardParentTitlesByURNSelector();

        getCardParentTitlesByURN(stateMock.layouts, urnMock);
        getCardParentTitlesByURN(stateMock2.layouts, urnMock);

        expect(getCardParentTitlesByURN.recomputations()).toEqual(2);
      });
    });

    describe("when state doesn't change", () => {
      it("should not recompute the selector", () => {
        const getCardParentTitlesByURN = createCardParentTitlesByURNSelector();

        getCardParentTitlesByURN(stateMock.layouts, urnMock);
        getCardParentTitlesByURN(stateMock.layouts, urnMock);

        expect(getCardParentTitlesByURN.recomputations()).toEqual(1);
      });
    });
  });

  describe("createViewTypeSelector", () => {
    function setup(state = stateMock) {
      const getViewTypeSelector = createViewTypeSelector();

      return getViewTypeSelector(state);
    }

    describe("when the currentUrn", () => {
      describe("is 'ppb:tbd:view:generic:home'", () => {
        it("should return the 'home'", () => {
          const viewType = setup({
            ...stateMock,
            router: {
              ...stateMock.router,
              currentUrn: "ppb:tbd:view:generic:home",
            },
          });

          expect(viewType).toEqual("home");
        });
      });

      describe("is not 'ppb:tbd:view:generic:home'", () => {
        it("should not return the 'home'", () => {
          const viewType = setup({
            ...stateMock,
          });

          expect(viewType).not.toEqual("home");
        });
      });
    });

    describe("when the currentView", () => {
      describe("is 'ppb:tbd:view:player'", () => {
        it("should return the 'player'", () => {
          const viewType = setup({
            ...stateMock,
            router: {
              ...stateMock.router,
              currentView: "ppb:tbd:view:player",
            },
          });

          expect(viewType).toEqual("player");
        });
      });
    });

    describe("when it gets the current view", () => {
      it("should return the view type", () => {
        getViewbyURN.mockReturnValue({
          urn: "ppb:tbd:marketview:1",
          typename: "MarketView",
        });

        const viewType = setup();

        expect(viewType).toEqual("market");
      });
    });

    describe("when it can't get the current view", () => {
      it("should return null", () => {
        getViewbyURN.mockReturnValue(null);

        const viewType = setup();

        expect(viewType).toEqual(null);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const stateMock2 = {
          ...stateMock,
          router: {
            ...stateMock.router,
            currentUrn: "",
          },
        };

        const getViewTypeSelector = createViewTypeSelector();

        getViewTypeSelector(stateMock);
        getViewTypeSelector(stateMock2);

        expect(getViewTypeSelector.recomputations()).toEqual(2);
      });
    });

    describe("when state doesn't change", () => {
      it("should not recompute the selector", () => {
        const getViewTypeSelector = createViewTypeSelector();

        getViewTypeSelector(stateMock);
        getViewTypeSelector(stateMock);

        expect(getViewTypeSelector.recomputations()).toEqual(1);
      });
    });
  });

  describe("createNavTabTitleByURNSelector", () => {
    describe("when the card urn belongs to a navigation tab item with translate key", () => {
      it("should return that tab translate key", () => {
        expect(
          createNavTabTitleByURNSelector()(stateMock.layouts.navigationtabs, "ppb:tbd:card:market#1.333333"),
        ).toEqual("SOME.I18N.KEY");
      });
    });

    describe("when the card urn belongs to a navigation tab item with translated title", () => {
      it("should return that tab translated title", () => {
        const navigationtabsMock = stateMock.layouts.navigationtabs;

        navigationtabsMock["ppb:tbd:view:navigationTab:123"].title = {
          translated: "Translated Title",
        };

        expect(createNavTabTitleByURNSelector()(navigationtabsMock, "ppb:tbd:card:market#1.333333")).toEqual(
          "Translated Title",
        );
      });
    });

    describe("when the card urn do not belong to a navigation tab item", () => {
      it("should return null", () => {
        expect(
          createNavTabTitleByURNSelector()(stateMock.layouts.navigationtabs, "ppb:tbd:card:market#1.444444"),
        ).toEqual(null);
      });
    });
  });
});
