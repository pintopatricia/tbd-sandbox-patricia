const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getSportsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const CouponHeaderCardSO = require("@ppb/tbd-shared/components/CouponHeaderCard/CouponHeaderCard.so");

const { GenericScreenSO, InlineSportsbookMarketSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const eventMarketsCardCouponSO = new FilteredCouponCardGroupSO();
const firstSbkMarketSO = new InlineSportsbookMarketSO();
const firstCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[0]);
const couponHeaderCardSO = new CouponHeaderCardSO();

const EVENT_TYPE_ID = 1;
const EVENT_ID_1 = 29359895;
const EVENT_ID_2 = 26666666;

const BFF_SBK_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        filteredCouponTitle: "What is on Today",
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID_1}`,
                  viewUrl: `/event/${EVENT_ID_1}`,
                },
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID_1}`,
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Wolves v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID_1}`,
                  __typename: "SportsEvent",
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
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${EVENT_ID_1}`,
                        },
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
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48352",
                          selectionId: 48351,
                          name: "Extra Runner to Filter",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48352" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
                title: "Bayern v Dortmund",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID_2}`,
                  viewUrl: `/event/${EVENT_ID_2}`,
                },
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID_2}`,
                  home: {
                    name: "Bayern",
                  },
                  away: {
                    name: "Dortmund",
                  },
                },
                sportevent: {
                  name: "Bayern v Dortmund",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID_2}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "Fifth Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.555555555",
                      noLiveData: true,
                      name: "Probabilidades",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Bayern v Dortmund",
                          urn: `ppb:event:${EVENT_ID_2}`,
                        },
                        competition: {
                          urn: "ppb:competition:1234565",
                          name: "Fifth Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.555555555/33333",
                          selectionId: 33333,
                          name: "Bayern",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.555555555/22222",
                          selectionId: 22222,
                          name: "Dortmund",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.555555555/55555",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.555555555/33333" },
                      { runnerURN: "ppb:sbkRunner:924.555555555/22222" },
                      { runnerURN: "ppb:sbkRunner:924.555555555/55555" },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          label: "View All",
          icon: null,
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/s-1",
          },
        },
      },
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

const BFF_SBK_CARDS_MOCK = {
  cards: [
    {
      __typename: "EventMarketCard",
      urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
      title: "Bayern v Dortmund",
      eventViewLink: {
        viewUrn: `ppb:tbd:view:event:${EVENT_ID_2}`,
        viewUrl: `/event/${EVENT_ID_2}`,
      },
      fixture: {
        urn: `ppb:fixture:${EVENT_ID_2}`,
        home: {
          name: "Bayern",
        },
        away: {
          name: "Dortmund",
        },
      },
      sportevent: {
        name: "Bayern v Dortmund",
        openDate: "2010-10-14T18:45Z",
        urn: `ppb:event:${EVENT_ID_2}`,
        __typename: "SportsEvent",
        competition: {
          urn: "ppb:competition:1234561",
          name: "Fifth Competition Name",
        },
      },
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.555555555",
            name: "Probabilidades",
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              sportevent: {
                name: "Bayern v Dortmund",
                urn: `ppb:event:${EVENT_ID_2}`,
              },
              competition: {
                urn: "ppb:competition:1234565",
                name: "Fifth Competition Name",
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.555555555/33333/0",
                selectionId: 33333,
                name: "Bayern",
              },
              {
                runnerURN: "ppb:excRunner:1.555555555/22222/0",
                selectionId: 22222,
                name: "Dortmund",
              },
              {
                runnerURN: "ppb:excRunner:1.555555555/55555/0",
                selectionId: 55555,
                name: "The Draw",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.555555555/33333/0" },
            { runnerURN: "ppb:excRunner:1.555555555/22222/0" },
            { runnerURN: "ppb:excRunner:1.555555555/55555/0" },
          ],
        },
        sportsbook: {
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.555555555",
            noLiveData: true,
            name: "Probabilidades",
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              sportevent: {
                name: "Bayern v Dortmund",
                urn: `ppb:event:${EVENT_ID_2}`,
              },
              competition: {
                urn: "ppb:competition:1234565",
                name: "Fifth Competition Name",
              },
            },
            runners: [
              {
                runnerURN: "ppb:sbkRunner:924.555555555/33333",
                selectionId: 33333,
                name: "Bayern",
              },
              {
                runnerURN: "ppb:sbkRunner:924.555555555/22222",
                selectionId: 22222,
                name: "Dortmund",
              },
              {
                runnerURN: "ppb:sbkRunner:924.555555555/55555",
                selectionId: 55555,
                name: "The Draw",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:sbkRunner:924.555555555/33333" },
            { runnerURN: "ppb:sbkRunner:924.555555555/22222" },
            { runnerURN: "ppb:sbkRunner:924.555555555/55555" },
          ],
        },
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48352",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

describe("Coupons Sportsbook", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_SBK_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_SBK_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstCoupon.element);
  });

  describe("When the user is on a Generic View with coupons", () => {
    it("[PRPI-2524] the title of the coupon should be displayed", async () => {
      expect(await eventMarketsCardCouponSO.title.getText()).toEqual("What is on Today");
    });

    it("[PRPI-2525] the link `View All` should be displayed", async () => {
      expect(await eventMarketsCardCouponSO.viewAllButton.getText()).toEqual("View All");
    });

    it("[PRPI-2526] the coupon header card should be 'Friendly Matches 1 X 2'", async () => {
      expect(await couponHeaderCardSO.title.getText()).toBe("Friendly Matches");
      expect(await couponHeaderCardSO.columnLabels[0].getText()).toBe("1");
      expect(await couponHeaderCardSO.columnLabels[1].getText()).toBe("X");
      expect(await couponHeaderCardSO.columnLabels[2].getText()).toBe("2");
    });

    it("[PRPI-8740]the coupon should filter market to 3 runners", async () => {
      expect(await firstSbkMarketSO.sbkBetButtons.length).toBe(3);
    });
  });
});
