const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const {
  getEventLayout,
  getMarketLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { BetSegmentsSO, GenericScreenSO, PrimaryButtonSO, PNLAndWhatIfSO, SelectionSegmentSO, OddsSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();

const betSegmentsSO = new BetSegmentsSO();
const liabilityLabelSO = new SelectionSegmentSO(betSegmentsSO.leftSegment);
const liabilityValueSO = new OddsSO(betSegmentsSO.leftSegment);
const primaryButtonSO = new PrimaryButtonSO();
const primaryButtonProfitSO = new PNLAndWhatIfSO(primaryButtonSO.element);

const EVENT_ID = "29359895";
const MARKET_ID = "1.123456789";

const CASHOUT_QUOTE = {
  urn: `ppb:excCashoutQuote:${MARKET_ID}/0`,
  marketURN: `ppb:excMarket:${MARKET_ID}`,
  value: 1.98,
  profit: -0.02,
  currentLiability: 2,
  status: "AVAILABLE",
};

const EXCHANGE_MARKET = {
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
      runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
  ],

  liveData: {
    cashoutQuotes: [CASHOUT_QUOTE],
  },
};

const BFF_EVENT_VIEW_MOCK = {
  __typename: "EventView",
  urn: "ppb:tbd:view:event:29682729",
  sportevent: {
    eventId: 29682729,
    name: "Chelsea v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        away: "Chelsea",
        home: "Man Utd",
        sportevent: {
          eventName: "Chelsea v Man Utd",
          urn: "ppb:event:29682729",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture##29682729",
        fixture: {
          urn: "ppb:fixture:29682729",
          home: {
            name: "Chelsea",
            color: "f9f9fa",
          },
          away: {
            name: "Man Utd",
            color: "050b5c",
          },
          scheduledAt: "2021-02-17T20:00Z",
          duration: {},
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.179657117;924.254652329",
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${MARKET_ID}`,
            viewUrl: `/football/english-premier-league/chelsea-man-utd/match-odds/m-${MARKET_ID}`,
          },
        ],

        title: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:12345",
                  name: "English Premier League",
                  competitionId: 12345,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29682729",
                  name: "Chelsea v Tottenham",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/48044/0",
                  name: "Chelsea",
                  selectionId: 48044,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/48351/0",
                  name: "Tottenham",
                  selectionId: 48351,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/58805/0",
                  name: "The Draw",
                  selectionId: 58805,
                },
              ],
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.987654321/48044/0",
              },
              {
                runnerURN: "ppb:excRunner:1.987654321/48351/0",
              },
              {
                runnerURN: "ppb:excRunner:1.987654321/58805/0",
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
        urn: "ppb:tbd:card:fixture##29682729",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.179657117;924.254652329",
      },
    },
  ],
};

const BFF_MARKET_VIEW_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${MARKET_ID}`,
        displayRunners: {
          exchange: {
            market: EXCHANGE_MARKET,
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
              },
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
              },
            ],
          },
        },
        numberOfRunnersToDisplay: 3,
      },
    },
  ],
};

const ERO_RUNNERS_MOCK = [
  {
    selectionId: "55190",
    availableToBack: [{ price: 2.5, size: 100 }],
    availableToLay: [{ price: 5.8, size: 110 }],
  },
  {
    selectionId: "48224",
    availableToBack: [{ price: 3.5, size: 100 }],
    availableToLay: [{ price: 6.8, size: 110 }],
  },
  {
    selectionId: "58805",
    availableToBack: [{ price: 1.5, size: 100 }],
    availableToLay: [{ price: 1.8, size: 110 }],
  },
];

const ERO_MOCK = [
  {
    marketId: MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

describe("Cashout - Exchange Market", () => {
  describe("When the user opens an Exchange market view with cashout available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
      const url = "sport/competition/event/market/m-1.123456789";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-10364] the liability info should be displayed", async () => {
      expect(await liabilityLabelSO.term.getText()).toBe("Liability");
      expect(await liabilityValueSO.odds.getText()).toBe("$2.00");
    });

    it("[PRPI-1807] The cashout button should show the correct info", async () => {
      expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $1.98");
      expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonProfitSO.pnl.getText()).toBe("-$0.02");
    });
  });
});
