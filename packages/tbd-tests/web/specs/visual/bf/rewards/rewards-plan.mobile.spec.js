const { UserProfileHeaderPO } = require("../../../../page-objects");
const { getMyAccountLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const routes = require("../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const mockService = new MockService();
const EVENT_ID = "29359895";

const OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myyAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
            chosenBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myyAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            qualifiedBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BETTER",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};

const OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myyAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "OPTED_IN",
            lastMonthTradedMarkets: 20,
            currentMonthTradedMarkets: 20,
            currentMonth: "SEPTEMBER",
            nextMonth: "OCTOBER",
            qualifiedBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "EXCH_MARKETS",
            },
            chosenBenefitsPackage: {
              packageLevel: "BEST",
              requiredMarketBets: 20,
              criteriaType: "SUM_EXCH_SBK",
            },
          },
        },
      },
    ],
  },
};
const NOT_OPTED_IN_WITH_EXCLUSIONS = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "RewardsCard",
          benefitsPackages: {
            rewardsStatus: "NOT_OPTED_IN",
            lastMonthTradedMarkets: 1,
            currentMonthTradedMarkets: 18,
            currentMonth: "JULY",
            nextMonth: "AUGUST",
            availablePackages: [
              {
                packageLevel: "GOOD",
                requiredMarketBets: 20,
                commissionRate: 10,
                benefits: [
                  {
                    hidden: false,
                    accessLevel: "NONE",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                ],
              },
              {
                packageLevel: "BETTER",
                requiredMarketBets: 20,
                commissionRate: 8,
                excludedBenefits: [
                  { type: "FREE_SPINS", accessLevel: "STANDARD" },
                  { type: "CASINO_BONUS", accessLevel: "STANDARD" },
                ],

                benefits: [
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_SPINS",
                    valueLookup: {
                      quantity: {
                        type: "INTEGER",
                        value: "25",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "CASINO_BONUS",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "50.0",
                      },
                    },
                  },
                ],
              },
              {
                packageLevel: "BEST",
                commissionRate: 1,
                requiredMarketBets: 20,
                excludedBenefits: [],
                benefits: [
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_ACCA",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "10",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "FREE_SPINS",
                    valueLookup: {
                      quantity: {
                        type: "INTEGER",
                        value: "25",
                      },
                    },
                  },
                  {
                    hidden: false,
                    accessLevel: "STANDARD",
                    type: "CASINO_BONUS",
                    valueLookup: {
                      quantity: {
                        type: "CURRENCY",
                        value: "50.0",
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
};
const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:1`,
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        filteredCouponTitle: "UEFA Champions League",
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
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
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
                  urn: `ppb:fixture:${EVENT_ID}`,
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
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      noLiveData: true,
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
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
      },
    },
  ],
};

const MODULE_NAME = "rewards";

xdescribe("Rewards", () => {
  describe("When the user opens the event page and is logged in", () => {
    describe("and the user is OPTED_IN while the Qualified package was Exchange Only and the chosen is a Dual Usage package", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL.urn, { firstName: "valer" }),
        );
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_QUALIFIED_EXCH_CHOSEN_DUAL));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1533]_should_display_qualified_exch_chosen_dual_rewards`,
        );
      });
      it("[PRPI-1533]_should_display_qualified_exch_chosen_dual_rewards", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1533]_should_display_qualified_exch_chosen_dual_rewards`),
        ).toEqual(0);
      });
    });

    describe("and the user is OPTED_IN while the Qualified package was Dual Usage and the chosen is an Exchange Only package", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH.urn, { firstName: "valer" }),
        );
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getMyAccountLayout(OPTED_IN_QUALIFIED_DUAL_CHOSEN_EXCH));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1534]_should_display_qualified_dual_chosen_exch_rewards`,
        );
      });
      it("[PRPI-1534]_should_display_qualified_dual_chosen_exch_rewards", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1534]_should_display_qualified_dual_chosen_exch_rewards`),
        ).toEqual(0);
      });
    });

    describe("and the user is OPTED_IN to the Rewards+ plan with completed required bets for two months", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS.urn, {
            firstName: "valer",
          }),
        );
        await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          getMyAccountLayout(OPTED_IN_REWARDS_PLUS_PLAN_COMPLETED_REQUIRED_BETS_FOR_TWO_MONTHS),
        );
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1535]_should_display_rewards_plus_sections`);
      });

      it("[PRPI-1535]_should_display_rewards_plus_sections", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1535]_should_display_rewards_plus_sections`)).toEqual(0);
      });
    });

    describe("and the user is NOT_OPTED_IN, while excluded from the Gaming products", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(NOT_OPTED_IN_WITH_EXCLUSIONS.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getMyAccountLayout(NOT_OPTED_IN_WITH_EXCLUSIONS));
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1536]_should_display_the_not_opted_in_with_exclusions_section`,
        );
      });

      it("[PRPI-1536]_should_display_the_not_opted_in_with_exclusions_section", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1536]_should_display_the_not_opted_in_with_exclusions_section`,
          ),
        ).toEqual(0);
      });
    });
  });
});
