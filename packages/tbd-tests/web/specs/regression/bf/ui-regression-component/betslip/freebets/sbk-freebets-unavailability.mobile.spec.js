const {
  AppPO,
  CardPO,
  FreeBetsPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  SportsbookMarketPO,
  BetDetailsPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  EventPagePO,
  MinimizedPO,
  SportPagePO,
  RunnerPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.scrollableSwimlanes[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.scrollableSwimlanes[1]);
const sportFirstCardPO = new CardPO(firstEventMarketCardPO.market);
const sportSecondCardPO = new CardPO(secondEventMarketCardPO.market);
const sportFirstSportsbookMarketPO = new InlineSportsbookMarketPO(sportFirstCardPO.inlineSportsbookMarket);
const sportSecondSportsbookMarketPO = new InlineSportsbookMarketPO(sportSecondCardPO.inlineSportsbookMarket);
const firstMarketRunnerSportsbookPO = new SportsbookBetButtonPO(sportFirstSportsbookMarketPO.betButtons[0]);
const secondMarketRunnerSportsbookPO = new SportsbookBetButtonPO(sportSecondSportsbookMarketPO.betButtons[0]);

const freeBetsPO = new FreeBetsPO();
const sportsbookMinimizedPO = new MinimizedPO();
const betDetailsPO = new BetDetailsPO();
const betslipDrawerPO = new BetslipDrawerPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;
const EVENT_ID = "29359895";
const MARKET_ID = "924.1";
const OTHER_EVENT_ID = "29351234";
const OTHER_MARKET_ID = "924.2";

const DECIMAL_ODDS = { decimalOdds: 1.1 };

const RUNNER_ODDS_MOCK = {
  runnerOdds: {
    decimalDisplayOdds: DECIMAL_ODDS,
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          ...RUNNER_ODDS_MOCK,
          selectionId: "48044",
        },
      ],
    },
    {
      marketId: OTHER_MARKET_ID,
      runnerDetails: [
        {
          ...RUNNER_ODDS_MOCK,
          selectionId: "1",
        },
      ],
    },
  ],
};

const EVENT_PAGE_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID}`,
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
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
      },
    },
  ],
};

const SPORT_PAGE_BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
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
                title: "Team A vs Team B",
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
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
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                      },
                    ],

                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A v Team B",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Team A",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Team B",
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${OTHER_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${OTHER_EVENT_ID}`,
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: `ppb:fixture:${OTHER_EVENT_ID}`,
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
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
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/3`,
                      },
                    ],

                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${OTHER_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: `ppb:event:${OTHER_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/2`,
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Team A 2",
                        },
                      ],
                    },
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

const TRUE_ODDS_MOCK = {
  trueOdds: {
    decimalOdds: DECIMAL_ODDS,
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  odds: {
    ...TRUE_ODDS_MOCK,
  },
  runner: {
    marketId: MARKET_ID,
    selectionId: 48044,
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  odds: {
    ...TRUE_ODDS_MOCK,
  },
  runner: {
    marketId: OTHER_MARKET_ID,
    selectionId: 1,
  },
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 48044,
        },
      ],
    },
  ],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: OTHER_MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],
};

const SIB_SINGLE_NO_BONUS = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_MULTIPLE_NO_BONUS = {
  betCombinations: [
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.54,
      winAverageOdds: 1.54,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.54,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.54 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("Free bets unavailability - singles", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(EVENT_PAGE_BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(EVENT_PAGE_BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
  });

  describe("when there are freebets", () => {
    describe("when an user with only EXC bonus available is on SBK market view and taps to make a Bet", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse());
        await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
        await browser.waitUntil(
          AppPO.sportsbookRunnerBetButtonHasPrice({
            market: eventPagePO.markets[0],
            price: 1.1,
          }),
        );
        await firstRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");
      });

      afterAll(async () => {
        await betDetailsPO.remove.waitForClickable();
        await betDetailsPO.remove.click();
        await browser.waitUntilNotDisplayed(freeBetsPO.element);
      });

      it("[PRPI-8104] the bonus component should not be displayed", async () => {
        expect(await freeBetsPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});

describe("Free bets unavailability - multiples", () => {
  describe("When user adds two selections without bonus to betslip and taps to expand it", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(SPORT_PAGE_BFF_MOCK.urn));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getSportsLayout(SPORT_PAGE_BFF_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_NO_BONUS));
      await browser.url(`${routes.getSportViewUrl(EVENT_TYPE_ID)}`);

      await browser.waitUntilEquals(firstMarketRunnerSportsbookPO.odd, "1.1");
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedPO.counter, "Minimized betslip counter not displayed");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MULTIPLE_NO_BONUS));
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView();
      await browser.waitUntilInViewport(
        secondMarketRunnerSportsbookPO.sportsbookBetButton,
        "Second market runner bet button not in viewport",
      );
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

      await sportsbookMinimizedPO.element.waitForClickable();
      await sportsbookMinimizedPO.element.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Multiples Place button is not visible");

      await browser.waitUntilNotDisplayed(freeBetsPO.element);
    });

    it("[PRPI-8105] the bonus component should not be displayed", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(false);
    });
  });
});
