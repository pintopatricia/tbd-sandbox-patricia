const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const { startApp, getInAppBrowserUrlDomain } = require("../../../../helpers/urls");

const { GenericScreenSO, MarketPromoSO, ActionLinkSO } = require("../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const marketPromoSO = new MarketPromoSO();
const termsConditionsButtonSO = new ActionLinkSO(marketPromoSO.termsAndConditionsButton);

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
    ],
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces:1",
  url: "view/amc-1",
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
  ],
};

describe("When user is on a Generic View with all matches", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    const url = "view/amc-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  it("[PRPI-3074] the marketPromo should be displayed with a title", async () => {
    await browser.waitUntilDisplayed(marketPromoSO.title);
    expect(await marketPromoSO.title.getText()).toBe("Minute Guarantee (Match Odds 90)");
  });

  describe("and I click on the 90 minute blurb", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(marketPromoSO.element);
      await marketPromoSO.element.click();
    });

    it("[PRPI-3075] the 90 min blurb has correct description", async () => {
      const expectedDescription =
        "All pre match bets placed on Match Odds 90 markets will be paid out early if " +
        "winning at 90:00 regardless of the full-time result. To find out more, visit our FAQ page";

      await browser.waitUntilDisplayed(marketPromoSO.description);
      expect(await marketPromoSO.description.getText()).toBe(expectedDescription);
    });

    describe("and I click on the T&Cs", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(termsConditionsButtonSO.element);
        await termsConditionsButtonSO.element.click();
      });

      it("[PRPI-3076] navigates to the support page", async () => {
        expect(await getInAppBrowserUrlDomain()).toContain("support.betfair.com");
      });
    });
  });
});
