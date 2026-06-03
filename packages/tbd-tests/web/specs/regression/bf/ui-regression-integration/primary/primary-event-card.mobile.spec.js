const {
  AppPO,
  SportPagePO,
  ExchangeMarketPO,
  RunnerPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  SnackbarPO,
  MarketStatusPO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const eventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const matchOddsCard = new CardPO(eventMarketCardPO.market);
const sportsbookMarketPO = new InlineSportsbookMarketPO(matchOddsCard.inlineSportsbookMarket);

const exchangeMarketPO = new ExchangeMarketPO(matchOddsCard.exchangeMarket);
const exchangeMarketStatusPO = new MarketStatusPO(matchOddsCard.exchangeMarket);

const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[1]);
const thirdRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[2]);

const firstRunnerSportsbookPO = new SportsbookBetButtonPO(sportsbookMarketPO.betButtons[0]);
const secondRunnerSportsbookPO = new SportsbookBetButtonPO(sportsbookMarketPO.betButtons[1]);
const thirdRunnerSportsbookPO = new SportsbookBetButtonPO(sportsbookMarketPO.betButtons[2]);

const snackbarPO = new SnackbarPO();

const mockService = new MockService();
const EVENT_TYPE_ID = 1;
const EVENT_ID = "29359895";

const BFF_EXCHANGE_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        partials: {
          edges: [
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID, false),
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
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const BFF_SPORTSBOOK_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "UEFA Champions League",
        partials: {
          edges: [
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID, false),
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
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const ERO_MOCK_UPDATE = [
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
      ],
    },
  ],
};

const SMP_MOCK_UPDATE = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 4, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 6, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.3 },
            fractionalDisplayOdds: { numerator: 9, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [
    {
      marketId: "924.193270252",
      noMarketInfo: true,
    },
  ],
};

const LBR_MOCK = {
  marketPositions: [{ marketId: "1.160337355" }],
};

describe("Football Sports Page", () => {
  describe("Exchange Card List View", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_EXCHANGE_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_EXCHANGE_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);

      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: eventMarketCardPO.market,
          price: "1.1",
        }),
      );
    });

    it("[PRPI-7172] Then I should see the scoreboard", async () => {
      expect(await eventMarketCardPO.footballFixtureCard.isDisplayed()).toBe(true);
    });

    it("[PRPI-7173] And I should see the market module", async () => {
      expect(await eventMarketCardPO.market.isDisplayed()).toBe(true);
    });

    it("[PRPI-7174] And that scoreboard should have a link to the event", async () => {
      expect(await eventMarketCardPO.routerLink.getAttribute("href")).toContain(
        routes.getEventViewUrl(EVENT_ID, false),
      );
    });

    it("[PRPI-7175] Then I should see the exchange odds", async () => {
      expect(await firstRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("1.1\n$100");
      expect(await firstRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("1.2\n$110");
      expect(await secondRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("2.1\n$200");
      expect(await secondRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("2.2\n$210");
      expect(await thirdRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("3.1\n$300");
      expect(await thirdRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("3.2\n$310");
    });

    describe("When we have a prices update", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_MOCK_UPDATE));
        await browser.tickFakeClock();
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({ market: eventMarketCardPO.market, price: "0.1" }),
        );
      });

      it("[PRPI-7176] Then I should see the exchange odds change", async () => {
        expect(await firstRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("0.1\n$1");
        expect(await firstRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("0.2\n$10");
        expect(await secondRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("1.1\n$100");
        expect(await secondRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("1.2\n$110");
        expect(await thirdRunnerExchangePO.exchangeBetButtons[0].getText()).toBe("2.1\n$200");
        expect(await thirdRunnerExchangePO.exchangeBetButtons[1].getText()).toBe("2.2\n$210");
      });
    });

    describe("When the event closes", () => {
      beforeAll(async () => {
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(firstRunnerExchangePO.element);

        await mockService.mockHttpRequest(getMarkets(ERO_MOCK_CLOSED));
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(exchangeMarketStatusPO.label);
      });

      it("[PRPI-7177] Then I should see the exchange market closed", async () => {
        expect(await firstRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await firstRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await secondRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await secondRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await thirdRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await thirdRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await exchangeMarketStatusPO.label.getText()).toBe("CLOSED");
        expect(await exchangeMarketStatusPO.indicator.isDisplayed()).toBe(true);
      });

      describe("and the user clicks on the card", () => {
        beforeAll(async () => {
          await eventMarketCardPO.footballFixtureCard.waitForClickable();
          await eventMarketCardPO.footballFixtureCard.click();
        });

        it("[PRPI-7178] should navigate to the event page", async () => {
          const url = await browser.getUrl();
          expect(url).toContain(routes.getEventViewUrl("29359895", false));
        });
      });
    });
  });

  describe("Sportsbook Card List View", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORTSBOOK_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORTSBOOK_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);

      await browser.waitUntilEquals(firstRunnerSportsbookPO.odd, "1.1");
      await browser.tickFakeClock();
    });

    it("[PRPI-7179] Then I should see the sportsbook odds", async () => {
      expect(await firstRunnerSportsbookPO.odd.getText()).toBe("1.1");
      expect(await secondRunnerSportsbookPO.odd.getText()).toBe("1.2");
      expect(await thirdRunnerSportsbookPO.odd.getText()).toBe("1.3");
    });

    describe("When we have a prices update", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_UPDATE));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(firstRunnerSportsbookPO.odd, "2.1");
      });

      it("[PRPI-7180] Then I should see the sportsbook odds change", async () => {
        expect(await firstRunnerSportsbookPO.odd.getText()).toBe("2.1");
        expect(await secondRunnerSportsbookPO.odd.getText()).toBe("2.2");
        expect(await thirdRunnerSportsbookPO.odd.getText()).toBe("2.3");
      });
    });

    describe("When the event closes", () => {
      beforeAll(async () => {
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(firstRunnerSportsbookPO.element);

        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(firstRunnerSportsbookPO.odd, "-");
      });

      it("[PRPI-7181] Then I should see the sportsbook market closed and bet button should present no odd", async () => {
        expect(await firstRunnerSportsbookPO.odd.getText()).toBe("-");
        expect(await secondRunnerSportsbookPO.odd.getText()).toBe("-");
        expect(await thirdRunnerSportsbookPO.odd.getText()).toBe("-");
      });

      describe("When the user taps one of the closed bet button", () => {
        beforeAll(async () => {
          await secondRunnerSportsbookPO.sportsbookBetButton.click();
          await browser.waitUntilEquals(snackbarPO.title, "Closed");
        });

        it("[PRPI-7182] The toast message should be displayed: 'Closed'", async () => {
          expect(await snackbarPO.title.getText()).toBe("Closed");
        });
      });
    });
  });
});
