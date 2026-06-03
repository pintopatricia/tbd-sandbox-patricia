const {
  AvBFixturePO,
  InlineSportsbookMarketPO,
  BetslipDrawerPO,
  ExchangeInlinePlacePanelPO,
  BottomBarPO,
  SportsbookBetButtonPO,
  ExchangeBetButtonPO,
  InlineExchangeMarketPO,
  SportPagePO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");

const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const couponCardGroupPO = new CouponCardGroupPO(sportPagePO.element);
const inlineSportsbookMarketPO = new InlineSportsbookMarketPO();

const excCouponCardGroupPO = new CouponCardGroupPO();

const inlineExchangeMarketPO = new InlineExchangeMarketPO(excCouponCardGroupPO.eventCoupons[0]);
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const bottomBarPO = new BottomBarPO();
const betslipDrawerPO = new BetslipDrawerPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const EVENT_ID_1 = 29359895;
const EVENT_ID_2 = 29999999;

const BFF_SBK_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID_1}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID_1),
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
                  urn: `ppb:fixture:${EVENT_ID_1}`,
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
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
                        competition: {
                          urn: "ppb:competition:12345",
                          name: "English Premier League",
                          competitionId: 12345,
                        },
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${EVENT_ID_1}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58806",
                          selectionId: 58805,
                          name: "Extra Runner",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58806" },
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

const BFF_EXC_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_1}`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID_1}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID_1),
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
                  urn: `ppb:fixture:${EVENT_ID_1}`,
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
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:12345",
                          name: "English Premier League",
                          competitionId: 12345,
                        },
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${EVENT_ID_1}`,
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

const CARDS_SBK_MOCK = {
  cards: [
    {
      __typename: "EventMarketCard",
      urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
      title: "Man Utd vs Sporting",
      eventViewLink: {
        viewUrn: `ppb:tbd:view:event:${EVENT_ID_2}`,
        viewUrl: `/event/${EVENT_ID_2}`,
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
        urn: `ppb:fixture:${EVENT_ID_2}`,
        home: {
          name: "Sporting",
        },
        away: {
          name: "Man Utd",
        },
      },
      displayRunners: {
        sportsbook: {
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.222222222",
            noLiveData: true,
            name: "Match Odds",
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              sportevent: {
                name: "Sporting v Man Utd",
                urn: `ppb:event:${EVENT_ID_2}`,
              },
              competition: {
                urn: "ppb:competition:1234562",
                name: "Second Competition Name",
              },
            },
            runners: [
              {
                runnerURN: "ppb:sbkRunner:924.1111111/33333",
                selectionId: 33333,
                name: "Sporting",
              },
              {
                runnerURN: "ppb:sbkRunner:924.1111111/22222",
                selectionId: 22222,
                name: "Man Utd",
              },
              {
                runnerURN: "ppb:sbkRunner:924.1111111/55555",
                selectionId: 55555,
                name: "The Draw",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:sbkRunner:924.1111111/33333" },
            { runnerURN: "ppb:sbkRunner:924.1111111/22222" },
            { runnerURN: "ppb:sbkRunner:924.1111111/55555" },
          ],
        },
      },
    },
  ],
};

const CARDS_EXC_MOCK = {
  cards: [
    {
      __typename: "EventMarketCard",
      urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID_2}`,
      title: "Man Utd vs Sporting",
      eventViewLink: {
        viewUrn: `ppb:tbd:view:event:${EVENT_ID_2}`,
        viewUrl: `/event/${EVENT_ID_2}`,
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
        urn: `ppb:fixture:${EVENT_ID_2}`,
        home: {
          name: "Sporting",
        },
        away: {
          name: "Man Utd",
        },
      },
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.222222222",
            name: "Match Odds",
            hierarchy: {
              __typename: "EventCompetitionHierarchy",
              sportevent: {
                name: "Sporting v Man Utd",
                urn: `ppb:event:${EVENT_ID_2}`,
              },
              competition: {
                urn: "ppb:competition:1234562",
                name: "Second Competition Name",
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.111111111/33333/0",
                selectionId: 33333,
                name: "Sporting",
              },
              {
                runnerURN: "ppb:excRunner:1.111111111/22222/0",
                selectionId: 22222,
                name: "Man Utd",
              },
              {
                runnerURN: "ppb:excRunner:1.111111111/55555/0",
                selectionId: 55555,
                name: "The Draw",
              },
            ],
          },
          runners: [
            { runnerURN: "ppb:excRunner:1.111111111/33333/0" },
            { runnerURN: "ppb:excRunner:1.111111111/22222/0" },
            { runnerURN: "ppb:excRunner:1.111111111/55555/0" },
          ],
        },
      },
    },
  ],
};

const ERO_MOCK = [
  {
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

describe("Given I am on the Football Sports Page", () => {
  describe("on EXC", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getWallets([{ amount: "25.00", walletName: "MAIN" }]));
      await mockService.mockHttpRequest(await getIndexHTML(BFF_EXC_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_EXC_MOCK));
      await mockService.mockHttpRequest(getCardResults(CARDS_EXC_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    });

    it("[PRPI-7186] should render the correct number of coupons", async () => {
      expect(await excCouponCardGroupPO.eventCoupons.length).toBe(2);
    });

    it("[PRPI-7187] The events are shown in list mode scrollable", async () => {
      expect(await excCouponCardGroupPO.element.isDisplayed()).toBe(true);
    });

    describe("User clicks on the 'Back' button", () => {
      beforeAll(async () => {
        await inlineExchangeMarketPO.element.scrollIntoView({ block: "start" });
        await browser.waitUntilDisplayed(inlineExchangeMarketPO.betButtons[1]);
        await inlineExchangeMarketPO.betButtons[1].click();
        await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);
      });

      it("[PRPI-7188] The button became selected", async () => {
        expect(
          await browser.containsClass(inlineExchangeMarketPO.betButtons[1], ExchangeBetButtonPO.states.selected),
        ).toBe(true);
      });

      describe("User clicks on the 'Back' button", () => {
        beforeAll(async () => {
          await inlineExchangeMarketPO.betButtons[1].click();
          await browser.waitUntilNotInViewport(exchangeInlinePlacePanelPO.element, "Betslip is visible");
        });

        it("[PRPI-7189] The button became unselected and betslip closes", async () => {
          expect(
            await browser.containsClass(inlineExchangeMarketPO.betButtons[1], ExchangeBetButtonPO.states.selected),
          ).toBe(false);

          expect(await exchangeInlinePlacePanelPO.element.isDisplayedInViewport()).toBe(false);
        });
      });
    });

    describe("User swipe on the odds buttons and clicks on the 'Lay' button", () => {
      beforeAll(async () => {
        await inlineExchangeMarketPO.groups[1].scrollIntoView(false);
        await browser.waitUntilInViewport(inlineExchangeMarketPO.groups[1]);
        await inlineExchangeMarketPO.betButtons[4].click();
        await browser.waitUntilInViewport(exchangeInlinePlacePanelPO.element);
      });

      it("[PRPI-7190] The button became selected", async () => {
        expect(
          await browser.containsClass(inlineExchangeMarketPO.betButtons[4], ExchangeBetButtonPO.states.selected),
        ).toBe(true);
      });

      describe("User clicks on the 'Lay' button", () => {
        beforeAll(async () => {
          await browser.waitUntilInViewport(inlineExchangeMarketPO.groups[1]);
          await inlineExchangeMarketPO.betButtons[4].waitForClickable();
          await inlineExchangeMarketPO.betButtons[4].click();
          await browser.waitUntilNotInViewport(exchangeInlinePlacePanelPO.element, "Betslip is visible");
        });

        it("[PRPI-7191] The button became unselected and betslip closes", async () => {
          expect(
            await browser.containsClass(inlineExchangeMarketPO.betButtons[4], ExchangeBetButtonPO.states.selected),
          ).toBe(false);
        });
      });
    });

    it("[PRPI-7192] The events are shown in list mode scrollable composed by the competition name", async () => {
      expect(await couponCardGroupPO.headerTitle.getText()).toBe("UEFA Champions League");
    });
  });

  describe("On SBK", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getWallets([{ amount: "25.00", walletName: "MAIN" }]));
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SBK_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SBK_MOCK));
      await mockService.mockHttpRequest(getCardResults(CARDS_SBK_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    });

    const sbkCouponCardGroupPO = new CouponCardGroupPO();
    const sbkAvBFixturePO = new AvBFixturePO(sbkCouponCardGroupPO.eventCoupons[0]);

    beforeAll(async () => {
      await browser.waitUntilDisplayed(inlineSportsbookMarketPO.element);
      await browser.waitUntilDisplayed(inlineSportsbookMarketPO.betButtons[0]);
    });

    it("[PRPI-7193] The selections are displayed and filtered to 3 runners", async () => {
      expect(await sbkAvBFixturePO.element.isDisplayed()).toBe(true);
      expect(await inlineSportsbookMarketPO.betButtons.length).toBe(3);
      expect(await inlineSportsbookMarketPO.betButtons[0].isDisplayed()).toBe(true);
      expect(await inlineSportsbookMarketPO.betButtons[1].isDisplayed()).toBe(true);
      expect(await inlineSportsbookMarketPO.betButtons[2].isDisplayed()).toBe(true);
    });

    describe("User clicks on the odd button", () => {
      beforeAll(async () => {
        await inlineSportsbookMarketPO.betButtons[0].click();
        await browser.waitUntilInViewport(betslipDrawerPO.header);
        await betslipDrawerPO.header.click();
        await browser.waitUntilNotInViewport(betslipDrawerPO.element, "Betslip is not collapsed to check button");
        await browser.waitUntilDisplayed(inlineSportsbookMarketPO.betButtons[0]);
      });

      it("[PRPI-7194] The button became selected", async () => {
        expect(
          await browser.containsClass(inlineSportsbookMarketPO.betButtons[0], SportsbookBetButtonPO.states.selected),
        ).toBe(true);
      });

      describe("User clicks on the odd button", () => {
        beforeAll(async () => {
          await inlineSportsbookMarketPO.betButtons[0].click();
          await browser.waitUntilNotInViewport(betslipDrawerPO.element, "Betslip is visible");
          await browser.waitUntilDisplayed(bottomBarPO.element);
        });

        it("[PRPI-7195] The button became unselected and betslip closes", async () => {
          expect(await browser.containsClass(inlineSportsbookMarketPO.betButtons[0], "Selected")).toBe(false);
          expect(await betslipDrawerPO.element.isDisplayedInViewport()).toBe(false);
        });
      });
    });
  });
});
