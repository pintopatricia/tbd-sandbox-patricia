const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const {
  getSportsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");

const {
  AvBFixtureSO,
  GenericScreenSO,
  InlineExchangeMarketSO,
  ExchangeBetButtonSO,
} = require("../../../../screen-objects");
const { swipeLeftElement } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const eventMarketsCardCouponSO = new FilteredCouponCardGroupSO();
const firstCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[0]);
const secondCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[1]);
const avbFixtureSO = new AvBFixtureSO(secondCoupon.element);
const firstInlineExchangeMarketSO = new InlineExchangeMarketSO(firstCoupon.element);
const secondInlineExchangeMarketSO = new InlineExchangeMarketSO(secondCoupon.element);
let lastExchangeBetButtonSO = new ExchangeBetButtonSO(secondInlineExchangeMarketSO.betButtons[5]);

const EVENT_TYPE_ID = 1;
const EVENT_ID_1 = 29359895;
const EVENT_ID_2 = 26666666;

const BFF_EXC_MOCK = {
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
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
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
                          name: "Man Utd FABIO",
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
                          runnerURN: "ppb:excRunner:1.555555555/55555/0",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                        {
                          runnerURN: "ppb:excRunner:1.555555555/22222/0",
                          selectionId: 22222,
                          name: "Dortmund",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.555555555/33333/0" },
                      { runnerURN: "ppb:excRunner:1.555555555/55555/0" },
                      { runnerURN: "ppb:excRunner:1.555555555/22222/0" },
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

const BFF_EXC_CARDS_MOCK = {
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
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: "1.160337355",
    runners: [
      { selectionId: "48044", availableToBack: [{ price: 1.1, size: 10 }], availableToLay: [{ price: 1.2, size: 10 }] },
      {
        selectionId: "48351",
        availableToBack: [{ price: 1.75, size: 100 }],
        availableToLay: [{ price: 1.77, size: 110 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
  {
    marketId: "1.555555555",
    runners: [
      {
        selectionId: "33333",
        availableToBack: [{ price: 12, size: 2000 }],
        availableToLay: [{ price: 22.2, size: 2100 }],
      },
      {
        selectionId: "55555",
        availableToBack: [{ price: 3, size: 1000 }],
        availableToLay: [{ price: 21.2, size: 1100 }],
      },
      {
        selectionId: "22222",
        availableToBack: [{ price: 7, size: 20 }],
        availableToLay: [{ price: 220, size: 10 }],
      },
    ],
  },
];

describe("Coupons Exchange", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_EXC_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_EXC_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstCoupon.element);
  });

  describe("When the user is on a Generic View with coupons and scrolls until the last event", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstInlineExchangeMarketSO.element, "Exchange coupons are not visible");
      await browser.waitUntilDisplayed(secondInlineExchangeMarketSO.snapGroups[0]);

      // ACTION scroll to lay snap group
      await swipeLeftElement(secondInlineExchangeMarketSO.snapGroups[0]);

      // IOS picks up more betButtons in the view port than Android, so we need to get the value based on length
      const numberOfBetButtons = await secondInlineExchangeMarketSO.betButtons.length;
      lastExchangeBetButtonSO = new ExchangeBetButtonSO(
        secondInlineExchangeMarketSO.betButtons[numberOfBetButtons - 1],
      );

      await browser.waitUntilDisplayed(
        lastExchangeBetButtonSO.element,
        "Second exchange coupon last lay button is not visible",
      );
    });

    it("[PRPI-1691] the scoreboard should be displayed", async () => {
      expect(await avbFixtureSO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-1692] the back and lay group buttons should be displayed", async () => {
      expect(await secondInlineExchangeMarketSO.snapGroups.length).toEqual(2);
    });

    it("[PRPI-1693] the values of betbutton should be displayed", async () => {
      expect(await lastExchangeBetButtonSO.odd.getText()).toEqual("220");
      expect(await lastExchangeBetButtonSO.liquidity.getText()).toEqual("$10");
    });
  });
});
