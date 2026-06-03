const { MarketPagePO, EventPagePO, AppPO, CardPO, PebbleListPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketLayout, getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const pebblesPO = new PebbleListPO(marketPagePO.element);
const eventPagePO = new EventPagePO();
const eventMarketCardPO = new CardPO(eventPagePO.markets[0]);
const firstPebble = pebblesPO.pebbles[0];
const secondPebble = pebblesPO.pebbles[1];
const thirdPebble = pebblesPO.pebbles[2];
const fourthPebble = pebblesPO.pebbles[3];
const fifthPebble = pebblesPO.pebbles[4];
const sixthPebble = pebblesPO.pebbles[5];
const seventhPebble = pebblesPO.pebbles[6];

const mockService = new MockService();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const OTHER_SPORTSBOOK_MARKET_ID = "924.11111111111";
const EVENT_ID = "29682729";

const BFF_MOCK_MARKET_VIEW = {
  urn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
  mainMarket: { urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}` },
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
          },
          away: {
            name: "Tottenham",
          },
          duration: {},
        },
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
        pebbleCardGroupTitle: { translated: "Over/Under Goals" },
        selectedItemUrn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}`,
        full: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.229299861",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${OTHER_SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805` },
                    ],
                  },
                },
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.229299887",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${OTHER_SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805` },
                    ],
                  },
                },
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}`,
                marketId: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${OTHER_SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805` },
                    ],
                  },
                },
              },
            },
            {
              name: "3.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${OTHER_SPORTSBOOK_MARKET_ID}`,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: `ppb:sbkMarket:${OTHER_SPORTSBOOK_MARKET_ID}`,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224`,
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/48224` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/58805` },
                    ],
                  },
                },
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}`,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
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
              name: "5.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.5555555555555",
                displayRunners: {},
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.666666666666",
                displayRunners: {},
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.229299861",
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.229299887",
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.229299909",
              },
            },
            {
              name: "3.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${OTHER_SPORTSBOOK_MARKET_ID}`,
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}`,
              },
            },
            {
              name: "5.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.5555555555555",
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketExtendedCard",
                urn: "ppb:tbd:card:marketExtended:924.666666666666",
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
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
      },
    },
  ],
};

const BFF_MOCK_EVENT_VIEW = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {},
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:OVER_UNDER",
        __typename: "MarketCard",
        cardTitle: "Over/Under Total Goals 4.5",
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
            viewUrl: routes.getMarketViewUrl(SPORTSBOOK_MARKET_ID),
          },
        ],

        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              eventId: EVENT_ID,
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              name: "Match Odds",
              liveData: {
                inplay: false,
              },
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190`,
                  name: "Under 4.5 Goals",
                  selectionId: 55190,
                  handicap: 0,
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224`,
                  name: "Over 4.5 Goals",
                  selectionId: 48224,
                  handicap: 0,
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/55190` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48224` },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:OVER_UNDER",
        __typename: "MarketCard",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: OTHER_SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48224",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          noOdds: true,
        },
      ],
    },
  ],
};

const SMP_MOCK_2 = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48224",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          noOdds: true,
        },
      ],
    },
  ],
};

describe("Given I am on a Football Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_EVENT_VIEW.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_2));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EVENT_VIEW));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.element,
        price: 1.1,
      }),
    );
  });

  describe("And I navigate to Over/Under market page by tapping 'Over/Under 4.5 Goals' market card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_MARKET_VIEW));
      await eventMarketCardPO.title.click();
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: marketPagePO.element,
          price: 1.1,
        }),
      );
    });

    it("[PRPI-6192] Then I should see a market template with 'Over/Under Goals' title", async () => {
      expect(await marketPagePO.collapseTitle.getText()).toBe("Over/Under Goals");
    });

    it("[PRPI-6193] And I should see a total of 7 pebbles on the page", async () => {
      expect(await pebblesPO.pebbles.length).toBe(7);
    });

    it("[PRPI-6194] And I should see the first pebble name is '0.5'", async () => {
      expect(await firstPebble.getText()).toBe("0.5");
    });

    it("[PRPI-6195] And I should see the fifth pebble name is '4.5'", async () => {
      expect(await fifthPebble.getText()).toBe("4.5");
    });

    it("[PRPI-6196] And I should see the selected pebble is '4.5'", async () => {
      expect(await fifthPebble.getText()).toBe("4.5");
      expect(await browser.containsClass(fifthPebble, PebbleListPO.states.active)).toBe(true);
    });

    describe("When I scroll to the left and tap the second pebble '1.5'", () => {
      beforeAll(async () => {
        await secondPebble.scrollIntoView({ block: "center", inline: "center" });
        await browser.waitUntilInViewport(secondPebble);
        await secondPebble.click();
        await browser.waitUntil(
          AppPO.sportsbookRunnerBetButtonHasPrice({
            market: marketPagePO.element,
            price: 1.1,
          }),
        );
      });

      it("[PRPI-6197] Then I should see the selected pebble is '1.5'", async () => {
        expect(await secondPebble.getText()).toBe("1.5");
        expect(await browser.containsClass(secondPebble, PebbleListPO.states.active)).toBe(true);
      });

      it("[PRPI-6198] And First pebble has unselected state", async () => {
        expect(await browser.containsClass(firstPebble, PebbleListPO.states.active)).toBe(false);
      });

      it("[PRPI-6199] And Third pebble has unselected state", async () => {
        expect(await browser.containsClass(thirdPebble, PebbleListPO.states.active)).toBe(false);
      });

      it("[PRPI-6200] And Fourth pebble has unselected state", async () => {
        expect(await browser.containsClass(fourthPebble, PebbleListPO.states.active)).toBe(false);
      });

      it("[PRPI-6201] And Fifth pebble has unselected state", async () => {
        expect(await browser.containsClass(fifthPebble, PebbleListPO.states.active)).toBe(false);
      });

      it("[PRPI-6202] And Sixth pebble has unselected state", async () => {
        expect(await browser.containsClass(sixthPebble, PebbleListPO.states.active)).toBe(false);
      });

      it("[PRPI-6203] And Seventh pebble has unselected state", async () => {
        expect(await browser.containsClass(seventhPebble, PebbleListPO.states.active)).toBe(false);
      });
    });

    describe("When I scroll till the last pebble", () => {
      beforeAll(async () => {
        // It is mandatory to have { block: "center", inline: "start" }
        // As it is only needed to have a scroll horizontal to the last pebble
        await seventhPebble.scrollIntoView({ block: "center", inline: "start" });
        await browser.waitUntilInViewport(seventhPebble);
      });

      it("[PRPI-6204] Then I should see the 7th pebble on the viewport and the pebble name is '6.5'", async () => {
        expect(await seventhPebble.getText()).toBe("6.5");
        expect(await seventhPebble.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-6205] And I should see the 6th pebble on the viewport and the pebble name is '5.5'", async () => {
        expect(await sixthPebble.getText()).toBe("5.5");
        expect(await sixthPebble.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-6206] And I should not see the 1st pebble on the viewport", async () => {
        expect(await firstPebble.isDisplayedInViewport()).toBe(false);
      });

      it("[PRPI-6207] And I should see the 2st pebble on the viewport", async () => {
        expect(await secondPebble.isDisplayedInViewport()).toBe(true);
      });
    });
  });
});
