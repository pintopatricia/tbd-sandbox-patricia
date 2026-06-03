const { AllMarketsPagePO, MarketPagePO } = require("../../../../../page-objects");
const { getGenericLayout, getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const allMarketsPagePO = new AllMarketsPagePO();
const mockService = new MockService();
const lastElement = allMarketsPagePO.listOfLinks[9];

const EVENT_ID = 29682729;
const MARKET_ID = "1.5555555555555";

const BFF_MOCK = {
  url: routes.getAllMarketsViewUrl(EVENT_ID, false),
  urn: `ppb:tbd:view:allMarkets:${EVENT_ID}`,
  title: "All Markets",
  pageInfo: null,
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:markets:xxx",
        links: [
          {
            label: "Both Teams to Score",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:924.111111111",
              viewUrl: routes.getMarketViewUrl("111111111"),
            },
          },
          {
            label: "Correct Score",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:924.2222222222",
              viewUrl: routes.getMarketViewUrl("9242222222222"),
            },
          },
          {
            label: "Over/Under 0.5 Goals",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.3333333333",
              viewUrl: routes.getMarketViewUrl("13333333333"),
            },
          },
          {
            label: "Over/Under 1.5 Goals",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.4444444444444",
              viewUrl: routes.getMarketViewUrl("14444444444444"),
            },
          },
          {
            label: "Match Odds",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:924.228905209",
              viewUrl: routes.getMarketViewUrl("924228905209"),
            },
          },
          {
            label: "Half Time",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.170265387",
              viewUrl: routes.getMarketViewUrl("1170265387"),
            },
          },
          {
            label: "Draw No Bet",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.170265349",
              viewUrl: routes.getMarketViewUrl("1170265349"),
            },
          },
          {
            label: "Half Time Score Unmanaged",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.170265388",
              viewUrl: routes.getMarketViewUrl("1170265388"),
            },
          },
          {
            label: "Half Time / Full Time Unmanaged",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.170265389",
              viewUrl: routes.getMarketViewUrl("1170265389"),
            },
          },
          {
            label: "Next Goal",
            viewLink: {
              viewUrn: "ppb:tbd:view:market:1.5555555555555",
              viewUrl: routes.getMarketViewUrl("1.5555555555555"),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:markets:xxx",
      },
    },
  ],
};

const BFF_MOCK_MARKET_VIEW = {
  url: `football/spanish-la-liga/real-madrid-v-atletico-madrid/anytime-correct-score/r-${MARKET_ID}`,
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  mainMarket: { urn: `ppb:excMarket:${MARKET_ID}` },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729",
        sportevent: {
          __typename: "SportsEvent",
          urn: "ppb:event:29682729",
        },
        fixture: {
          urn: "ppb:fixture:29682729",
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
          scheduledAt: "2020-02-22T12:30",
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
          },
          penaltyShootout: null,
        },
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: "ppb:tbd:card:marketExtended:1.123456789:924.222615412",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              eventId: `${EVENT_ID}`,
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.123456789",
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              bettingType: "ODDS",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Chelsea v Tottenham",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.123456789/55190/0",
                  name: "Chelsea",
                  selectionId: 55190,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.123456789/48224/0",
                  name: "Tottenham",
                  selectionId: 48224,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.123456789/58805/0",
                  name: "The Draw",
                  selectionId: 58805,
                  handicap: 0,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.123456789/55190/0" },
              { runnerURN: "ppb:excRunner:1.123456789/48224/0" },
              { runnerURN: "ppb:excRunner:1.123456789/58805/0" },
            ],
          },
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              eventId: `${EVENT_ID}`,
              urn: "ppb:sbkMarket:924.222615412",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
              },
              liveData: {
                inplay: false,
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/55190",
                  name: "Chelsea",
                  selectionId: 55190,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/48224",
                  name: "Tottenham",
                  selectionId: 48224,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/58805",
                  name: "The Draw",
                  selectionId: 58805,
                  handicap: 0,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
              { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
              { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: `pb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
        sportevent: {
          name: "Chelsea v Tottenham",
          eventId: `${EVENT_ID}`,
        },
      },
    },
  ],
};

describe("[635408] Given I am on All Markets page And I have 10 markets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        currentUrl: routes.getAllMarketsViewUrl(EVENT_ID, false),
      }),
    );
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET_VIEW));
    await browser.url(routes.getAllMarketsViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(allMarketsPagePO.listOfLinks[0]);
  });

  it("[PRPI-6736] Then I should see that page title is 'All Markets'", async () => {
    expect(await allMarketsPagePO.title.getText()).toBe("All Markets");
  });

  it("[PRPI-6737] And I should see the first market is 'Both Teams to Score'", async () => {
    expect(await allMarketsPagePO.listOfLinks[0].getText()).toBe("Both Teams to Score");
  });

  it("[PRPI-6738] And I should see the second market is 'Correct Score'", async () => {
    expect(await allMarketsPagePO.listOfLinks[1].getText()).toBe("Correct Score");
  });

  it("[PRPI-6739] And I should see the third\xA0market is 'Over/Under 0.5 Goals'", async () => {
    expect(await allMarketsPagePO.listOfLinks[2].getText()).toBe("Over/Under 0.5 Goals");
  });

  it("[PRPI-6740] And I should see the fourth\xA0market is 'Over/Under 1.5 Goals'", async () => {
    expect(await allMarketsPagePO.listOfLinks[3].getText()).toBe("Over/Under 1.5 Goals");
  });

  describe("When I scroll down till the last market: 'Next Goal'", () => {
    beforeAll(async () => {
      await lastElement.scrollIntoView();
    });

    it("[PRPI-6741] Then I should see 'Next Goal' market link visible", async () => {
      expect(await lastElement.getText()).toBe("Next Goal");
    });

    describe("When I click on 'Next Goal' market link", () => {
      beforeAll(async () => {
        await lastElement.click();
        await browser.waitUntilDisplayed(marketPagePO.element);
      });

      it("[PRPI-6742] Then 'Next Goal' market page is shown", async () => {
        const url = await browser.getUrl();

        expect(url).toContain(BFF_MOCK_MARKET_VIEW.url);
      });

      describe("When I tap the back button", () => {
        beforeAll(async () => {
          await browser.back();
          await browser.waitUntilDisplayed(allMarketsPagePO.listOfLinks[0]);
        });

        it("[PRPI-6743] Then I should see that 'All Markets' page is displayed again", async () => {
          const url = await browser.getUrl();

          expect(url).toContain(routes.getAllMarketsViewUrl(EVENT_ID));
        });
      });
    });
  });
});
