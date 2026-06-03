const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { MarketPromoPO, ActionLinkPO, InlineSportsbookMarketPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const inlineSportsbookMarketPO = new InlineSportsbookMarketPO();
const marketPromoPO = new MarketPromoPO();
const termsConditionsButtonPO = new ActionLinkPO(marketPromoPO.termsButtonPromoContainer);

const EVENT_TYPE_ID = "1";

const FILTERED_CARD_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  has90Min: true,
  filterOptions: {
    sortOption: {
      defaultOption: "RANK",
      availableOptions: ["RANK", "TIME"],
    },
    dateRangeFilter: {},
    marketTypeFilter: {},
    competitionsFilter: {},
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
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30464707",
            viewUrl: "football/uefa-champions-league/chelsea-v-real-madrid/e-30464707",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182678271/55190/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/55190/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/2426/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/2426/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30464707",
            name: "Chelsea v Real Madrid",
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.262429640",
                name: "Match Odds",
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:228",
                    name: "UEFA Champions League",
                    competitionId: 228,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30464707",
                    name: "Chelsea v Real Madrid",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/55190",
                    name: "Chelsea",
                    selectionId: 55190,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/2426",
                    name: "Real Madrid",
                    selectionId: 2426,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/58805",
                    name: "The Draw",
                    selectionId: 58805,
                    handicap: 0,
                    resultType: null,
                  },
                ],
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/55190",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/2426",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30464707",
            home: {
              name: "Chelsea",
            },
            away: {
              name: "Real Madrid",
            },
            scheduledAt: "2021-05-05T19:00:00Z",
          },
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30482022",
            viewUrl: "football/portuguese-primeira-liga/braga-v-pacos-ferreira/e-30482022",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182896135/48799/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48799/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/48787/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48787/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30482022",
            name: "Braga v Pacos Ferreira",
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.263003281",
                name: "Match Odds",
                marketType: "MATCH_ODDS",

                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:99",
                    name: "Portuguese Primeira Liga",
                    competitionId: 99,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30482022",
                    name: "Braga v Pacos Ferreira",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48799",
                    name: "Braga",
                    selectionId: 48799,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48787",
                    name: "Pacos Ferreira",
                    selectionId: 48787,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/58805",
                    name: "The Draw",
                    selectionId: 58805,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/48799",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/48787",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30482022",
            home: {
              name: "Braga",
            },
            away: {
              name: "Pacos Ferreira",
            },
            scheduledAt: "2021-05-05T18:00:00Z",
          },
        },
      },
    ],
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
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482020/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
        },
      },
    ],
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: FILTERED_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.262429640",
      runnerDetails: [
        {
          selectionId: 55190,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
    {
      marketId: "924.263003281",
      runnerDetails: [
        {
          selectionId: 48799,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 48787,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.75 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.0 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

describe("When user is on a Generic View with all matches", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilEquals(await inlineSportsbookMarketPO.betButtons[0], "5");
  });

  it("[PRPI-6218] the marketPromo should be displayed with a title", async () => {
    expect(await marketPromoPO.title.getText()).toBe("Minute Guarantee (Match Odds 90)");
  });

  describe("and I click the 90 minute blurb", () => {
    beforeAll(async () => {
      await marketPromoPO.element.waitForClickable();
      await marketPromoPO.element.click();
    });

    it("[PRPI-6219] the 90 min blurb as correct description", async () => {
      const expectedDescription =
        "All pre match bets placed on Match Odds 90 markets will be paid out early if" +
        " winning at 90:00 regardless of the full-time result. To find out more, visit our FAQ page";

      expect(await marketPromoPO.description.getText()).toBe(expectedDescription);
    });

    describe("and I click the T&C link", () => {
      beforeAll(async () => {
        await termsConditionsButtonPO.element.waitForClickable();
        await termsConditionsButtonPO.element.click();
        // Wait for the new tab to appear (optional, but good to avoid flakiness)
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2, {
          timeout: 5000,
          timeoutMsg: "Expected a new tab to open",
        });
        const newWindows = await browser.getWindowHandles();
        await browser.switchToWindow(newWindows[1]);
      });

      it("[PRPI-6220] user navigates to support page", async () => {
        expect(await browser.getUrl()).toContain("support.betfair.com");
      });
    });
  });
});
