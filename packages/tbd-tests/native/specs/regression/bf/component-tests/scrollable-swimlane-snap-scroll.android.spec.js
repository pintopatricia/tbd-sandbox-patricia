const {
  getSportsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { ScrollableSwimlaneSO, SportPageScreenSO } = require("../../../../screen-objects");
const Gestures = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
let sportSO = new SportPageScreenSO();
const mockService = new MockService();
const firstEventCard = sportSO.eventMarketCards[0];
const secondEventCard = sportSO.eventMarketCards[1];

const EVENT_TYPE_ID = 1;
const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Football",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:1",
                title: "Match Odds",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.1",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:12345`,
                        },
                      },
                    },
                  },
                },
                fixture: {
                  urn: "ppb:fixture:1",
                  home: { name: "First" },
                  away: { name: "Second" },
                },
                sportevent: {
                  name: "First v Second",
                  urn: `ppb:event:1`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1",
                    name: "English Premier League",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:2",
                title: "Match Odds",
                fixture: {
                  urn: "ppb:fixture:2",
                  home: { name: "Third" },
                  away: { name: "Fourth" },
                },
                sportevent: {
                  name: "Third v Fourth",
                  urn: `ppb:event:2`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:2",
                    name: "English Premier League",
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:3",
                title: "Match Odds",
                fixture: {
                  urn: "ppb:fixture:3",
                  home: { name: "Fifth" },
                  away: { name: "Sixth" },
                },
                sportevent: {
                  name: "Fifth v Sixth",
                  urn: `ppb:event:3`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:3",
                    name: "English Premier League",
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:1" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:2" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:3" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:4" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:5" } },
            { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:6" } },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};
const BFF_CARDS_MOCK = {
  cards: [
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:5",
      title: "Match Odds",
      fixture: {
        urn: "ppb:fixture:5",
        home: { name: "Ninth" },
        away: { name: "Tenth" },
      },
      sportevent: {
        name: "Ninth v Tenth",
        urn: `ppb:event:5`,
        __typename: "SportsEvent",
        competition: {
          urn: "ppb:competition:1",
          name: "English Premier League",
        },
      },
    },
    {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventPrimaryMarket:6",
      title: "Match Odds",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.2",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                urn: `ppb:event:12345`,
              },
            },
          },
        },
      },
      fixture: {
        urn: "ppb:fixture:6",
        home: { name: "Eleventh" },
        away: { name: "Twelfth" },
      },
      sportevent: {
        name: "Eleventh v Twelfth",
        urn: `ppb:event:6`,
        __typename: "SportsEvent",
        competition: {
          urn: "ppb:competition:1",
          name: "English Premier League",
        },
      },
    },
  ],
};

describe("Component - Scrollable Swimlane Snap and Scroll Football", () => {
  describe("When the user is on a SNAP AND SCROLL scrollableswimlane with 3 elements", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(firstEventCard);
      await browser.waitUntilDisplayed(secondEventCard);
    });

    it("[PRPI-3814] The swimlane should display the 1st element with a part of the 2nd element", async () => {
      expect(await firstEventCard.isDisplayed()).toBe(true);
      expect(await secondEventCard.isDisplayed()).toBe(true);
    });

    describe("And the swimlane does not have a ViewAll button", () => {
      it("[PRPI-3815] The viewAll button should not be displayed", async () => {
        expect(await scrollableSwimlaneSO.viewAllButton.isDisplayed()).toBe(false);
      });
    });

    describe("When the user swipe till the 3rd element", () => {
      let numberOfMarketCards;

      beforeAll(async () => {
        Gestures.swipeLeft(0.7);

        // Android needs to update element with new content after swipe left
        sportSO = new SportPageScreenSO();

        // IOS picks up more elements in the view port than Android, so we need to get the value based on length
        numberOfMarketCards = await sportSO.eventMarketCards.length;

        await browser.waitUntilDisplayed(sportSO.eventMarketCards[numberOfMarketCards - 1]);
      });
      it("[PRPI-3816] The swimlane should display the 3rd element loaded", async () => {
        expect(await sportSO.eventMarketCards[numberOfMarketCards - 1].isDisplayed()).toBe(true);
      });
    });
  });
});
