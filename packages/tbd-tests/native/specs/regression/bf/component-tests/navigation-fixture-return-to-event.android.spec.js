const {
  getMarketLayout,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { AvBFixtureSO, CardSO } = require("../../../../screen-objects");

const mockService = new MockService();

const avbFixtureSO = new AvBFixtureSO();
const cardSO = new CardSO();

const EXCHANGE_MARKET_ID = "924.222222222";
const MARKET_ID = "1.987654321";
const COMPETITION_ID = "12345";
const EVENT_ID = "29682729";

const BFF_MOCK = {
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink`,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
            color: null,
            crest: null,
          },
          away: {
            name: "Tottenham",
            color: null,
            crest: null,
          },
          scheduledAt: "2020-02-22T12:30Z",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          penaltyShootout: null,
        },
        fixtureEventViewLink: {
          viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
          viewUrl: `/soccer/english-premier-league/chelsea-v-tottenham/e-${EVENT_ID}`,
        },
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${MARKET_ID}:${EXCHANGE_MARKET_ID}`,
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              eventId: EVENT_ID,
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              bettingType: "ODDS",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                  name: "Chelsea v Tottenham",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
                  name: "Chelsea",
                  selectionId: 55190,
                  handicap: 0,
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
              },
            ],
          },
        },
      },
    },
  ],
};

const BFF_EVENT_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Chelsea v Tottenham",
    competition: { urn: `ppb:competition:${COMPETITION_ID}`, name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        away: "Tottenham",
        home: "Chelsea",
        sportevent: {
          eventName: "Chelsea v Tottenham",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          __typename: "SportsEvent",
          competition: {
            urn: `ppb:competition:${COMPETITION_ID}`,
            name: "English Premier League",
          },
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
            color: "091453",
          },
          away: {
            name: "Tottenham",
            color: "FC5002",
          },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:${MARKET_ID}:${EXCHANGE_MARKET_ID}`,
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  name: "Chelsea",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
              },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:${MARKET_ID}:${EXCHANGE_MARKET_ID}`,
        __typename: "MarketCard",
      },
    },
  ],
};

describe("When user in market view taps on football fixture card", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_MOCK));
    const url = `sport/competition/event/market/m-${MARKET_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(avbFixtureSO.element);
    await avbFixtureSO.element.click();
    await browser.waitUntilDisplayed(cardSO.element, "Event card was not displayed");
  });

  it("[PRPI-2339] The user lands on the event page for that market", async () => {
    expect(await cardSO.title.getText()).toBe("Match Odds");
  });
});
