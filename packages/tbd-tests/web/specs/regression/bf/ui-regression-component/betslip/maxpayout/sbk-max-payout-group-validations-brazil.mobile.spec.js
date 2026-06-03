const {
  SportPagePO,
  SportsbookPlacePanelPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  AlertPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  AlertsPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);

const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);

const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);

const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);

const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO();
const notificationsPO = new AlertsPO();
const notificationPO = new AlertPO(notificationsPO.element);
const firstSingleStakeInputField = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 10 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League 1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
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
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team A",
                  },
                  away: {
                    name: "Team B",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B",
                  urn: "ppb:event:29359895",
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
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A v Team B",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team C vs Team D",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team C",
                  },
                  away: {
                    name: "Team D",
                  },
                },
                sportevent: {
                  name: "Team C vs Team D",
                  urn: "ppb:event:29359896",
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
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team C v Team D",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team C",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 100000000,
  betMaxPayout: 100000,
  averageOdds: 10,
  winAverageOdds: 10,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    decimalDisplayOdds: {
      decimalOdds: 10,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
  maxPayout: 100000,
};

describe("Max Payout Group Validation", () => {
  describe("Brazil Jurisdiction", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, { currencyCode: "BRL", countryCode: "BR", jurisdiction: "BRAZIL" }),
      );
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(`${routes.getEventViewUrl(EVENT_TYPE_ID)}`);
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "10");

      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");
    });

    describe("When I add a stake value of 1000000 in the Single", () => {
      beforeAll(async () => {
        await firstSingleStakeInputField.setValue("1000000");
        await browser.waitUntilDisplayed(notificationPO.element, "Notification was not displayed");
      });

      it("[PRPI-8157] Should display the message 'Maximum payout is R$ 4 millions per day'", async () => {
        expect(await notificationPO.items[0].getText()).toBe("Maximum payout is R$ 4 millions per bet");
      });

      it("[PRPI-4085] Should display the url description 'Please review your stake'", async () => {
        expect(await notificationPO.detail.getText()).toBe("Please review your stake");
      });

      it("[PRPI-8158] And the place bet button is disabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(false);
      });

      describe("When I add a stake value of 40000 in the Single", () => {
        beforeAll(async () => {
          await firstSingleStakeInputField.setValue("400000");
          await browser.waitUntilDisplayed(notificationPO.element, "Notification was not displayed");
        });

        it("[PRPI-8159] Should display the message 'Each bet has a max payout limit.'", async () => {
          expect(await notificationPO.items[0].getText()).toBe("Each bet has a max payout limit.");
        });

        it("[PRPI-8160] Should display the detail info 'Max payout is R$ 4 millions.'", async () => {
          expect(await notificationPO.detail.getText()).toBe("Max payout is R$ 4 millions.");
        });

        it("[PRPI-8161] Should display the terms link info 'See T&C\u2019s.'", async () => {
          expect(await notificationPO.link.getText()).toBe("See T&C’s.");
        });
      });
    });
  });
});
