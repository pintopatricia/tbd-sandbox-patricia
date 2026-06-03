const { ExchangeBetButtonPO, InlineExchangeMarketPO, SportPagePO } = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const inlineExchangeMarketPO = new InlineExchangeMarketPO();

const mockService = new MockService();
const EVENT_TYPE_ID = 1;
const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        filteredCouponTitle: "First Card",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:228",
                  name: "Friendly Matches",
                  competitionId: 228,
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 1,
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29359895`,
                  viewUrl: routes.getEventViewUrl("29359895"),
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                fixture: {
                  urn: `ppb:fixture:29359895`,
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const ERO_MOCK_CLOSED = [
  {
    state: { status: "CLOSED" },
    runners: [
      { selectionId: "48044", availableToBack: [{ price: 0.1, size: 1 }], availableToLay: [{ price: 0.2, size: 10 }] },
      {
        selectionId: "48351",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const SMP_MOCK_CLOSED = { markets: [] };

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

const secondBackButton = new ExchangeBetButtonPO(inlineExchangeMarketPO.backSelections[1]);

describe("Sport Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED));
    await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(secondBackButton.odd, "2.1");
  });

  it("[PRPI-6280] The back selections are displayed not clickable and a Closed status are displayed before the small scoreboard", async () => {
    expect(await inlineExchangeMarketPO.backSelections[0].isEnabled()).toBe(false);
    expect(await inlineExchangeMarketPO.backSelections[1].isEnabled()).toBe(false);
    expect(await inlineExchangeMarketPO.backSelections[2].isEnabled()).toBe(false);
  });

  it("[PRPI-6281] The lay selections are displayed not clickable", async () => {
    expect(await inlineExchangeMarketPO.laySelections[0].isEnabled()).toBe(false);
    expect(await inlineExchangeMarketPO.laySelections[1].isEnabled()).toBe(false);
    expect(await inlineExchangeMarketPO.laySelections[2].isEnabled()).toBe(false);
  });
});
