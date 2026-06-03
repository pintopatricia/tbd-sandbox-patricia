const {
  EventPagePO,
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  AppPO,
  RunnerPO,
  CardPO,
  FreeBetsPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  SportsbookMarketPO,
  BetDetailsPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.scrollableSwimlanes[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.scrollableSwimlanes[1]);

const sportFirstCardPO = new CardPO(firstEventMarketCardPO.market);
const sportFirstSportsbookMarketPO = new InlineSportsbookMarketPO(sportFirstCardPO.inlineSportsbookMarket);

const sportSecondCardPO = new CardPO(secondEventMarketCardPO.market);
const sportSecondSportsbookMarketPO = new InlineSportsbookMarketPO(sportSecondCardPO.inlineSportsbookMarket);

const firstMarketRunnerSportsbookPO = new SportsbookBetButtonPO(sportFirstSportsbookMarketPO.betButtons[0]);
const secondMarketRunnerSportsbookPO = new SportsbookBetButtonPO(sportSecondSportsbookMarketPO.betButtons[0]);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const singlesCardsPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const secondSingle = new SinglePO(singlesCardsPO.singles[1]);

const placeButton = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const freeBetsPO = new FreeBetsPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();
const betDetailsPO = new BetDetailsPO();
const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const EVENT_ID = "29359895";
const MARKET_ID = "924.193270252";

const OTHER_EVENT_ID = "29359896";
const OTHER_MARKET_ID = "924.193270253";

const DECIMAL_ODDS_1 = {
  decimalOdds: 1.1,
};

const FRACTIONAL_DISPLAY_ODDS_MOCK = {
  fractionalDisplayOdds: { numerator: 1, denominator: 2 },
};

const RUNNER_ODDS = {
  runnerOdds: {
    ...FRACTIONAL_DISPLAY_ODDS_MOCK,
    decimalDisplayOdds: DECIMAL_ODDS_1,
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          ...RUNNER_ODDS,
          selectionId: "48044",
        },
        {
          runnerOdds: {
            ...FRACTIONAL_DISPLAY_ODDS_MOCK,
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          selectionId: "58805",
        },
        {
          noOdds: true,
          selectionId: "48351",
        },
      ],
    },
    {
      marketId: OTHER_MARKET_ID,
      runnerDetails: [
        {
          ...RUNNER_ODDS,
          selectionId: "1",
        },
        {
          noOdds: true,
          selectionId: "2",
        },
        {
          noOdds: true,
          selectionId: "3",
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
      urn: `ppb:eventType:${EVENT_TYPE_ID}`,
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29436223:MATCH_ODDS",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29436223:MATCH_ODDS",
                cardTitle: "Match Odds",
                displayRunners: {
                  sportsbook: {
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
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351` },
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
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
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351` },
                    ],
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
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/1` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/2` },
                      { runnerURN: `ppb:sbkRunner:${OTHER_MARKET_ID}/3` },
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

const ODDS_MOCK = {
  ...FRACTIONAL_DISPLAY_ODDS_MOCK,
  trueOdds: {
    decimalOdds: DECIMAL_ODDS_1,
  },
};

const FIRST_SINGLE_MOCK = {
  averageOdds: 1.1,
  betMaxStake: 1000,
  betMinStake: 0.12,
  betMinStakeIncrement: 0.01,
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

  winAvgOdds: ODDS_MOCK,
  winAverageOdds: 1.1,
};

const FIRST_SINGLE_ODDS_MOCK = {
  odds: ODDS_MOCK,
  runner: {
    marketId: MARKET_ID,
    selectionId: 48044,
  },
};

const LEG_COMBINATIONS_MOCK = {
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

const SECOND_SINGLE_MOCK = {
  ...LEG_COMBINATIONS_MOCK,
};

const SECOND_SINGLE_MOCK_WITH_BONUS = {
  ...LEG_COMBINATIONS_MOCK,
  hasBonusMoney: true,
};

const SECOND_SINGLE_ODDS_MOCK = {
  odds: ODDS_MOCK,
  runner: {
    marketId: OTHER_MARKET_ID,
    selectionId: 1,
  },
};

const DOUBLE_BASE_MOCK = {
  averageOdds: 1.1,
  betMaxStake: 1000,
  betMinStake: 0.12,
  betMinStakeIncrement: 0.01,
  betType: "DOUBLE",
  legCombinations: [],
  winAverageOdds: 1.1,
};

const WIN_AVG_ODDS_MOCK = {
  winAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
    ...FRACTIONAL_DISPLAY_ODDS_MOCK,
  },
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      ...DOUBLE_BASE_MOCK,
      ...WIN_AVG_ODDS_MOCK,
      hasBonusMoney: true,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK_WITHOUT_BONUS = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK_WITH_BONUS,
    {
      ...DOUBLE_BASE_MOCK,
      ...WIN_AVG_ODDS_MOCK,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const IMPLY_BET_SERVICE_MOCK = {
  betCombinations: [
    {
      ...FIRST_SINGLE_MOCK,
      hasBonusMoney: true,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const MODULE_NAME = "free_bets";

describe("Freebets", () => {
  describe("When an user with SBK bonus is on market view ", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(EVENT_PAGE_BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(EVENT_PAGE_BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: eventPagePO.markets[0],
          price: 1.1,
        }),
      );
      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButton.element, "Place button is not visible");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1309]_should_see_betslip_is_opened_and_the_bonus_component_without_bonus_value_and_radio_button_off`,
      );
    });

    afterAll(async () => {
      await betDetailsPO.remove.waitForClickable();
      await betDetailsPO.remove.click();
      await browser.waitUntilNotDisplayed(freeBetsPO.element);
    });

    describe("[684418] and the user taps to select a bet", () => {
      it("[PRPI-1309]_should_see_betslip_is_opened_and_the_bonus_component_without_bonus_value_and_radio_button_off", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1309]_should_see_betslip_is_opened_and_the_bonus_component_without_bonus_value_and_radio_button_off`,
          ),
        ).toBe(0);
      });
    });
  });

  describe("When a user with SBK bonus is on sport view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(SPORT_PAGE_BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getSportsLayout(SPORT_PAGE_BFF_MOCK));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(firstMarketRunnerSportsbookPO.odd, "1.1");
    });

    describe("When user adds two selections with bonus to betslip and expands it", () => {
      beforeAll(async () => {
        await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(placeButton.element, "Place button is not visible");

        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

        await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          secondMarketRunnerSportsbookPO.sportsbookBetButton,
          "Second market runner bet button not in viewport",
        );

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

        await sportsbookMinimizedPO.element.click();
        await browser.waitUntilEquals(
          freeBetsPO.label,
          "Use Free Bet Balance",
          "Freebets label is not equal to 'Use Free Bet Balance'",
        );
      });

      describe("When user taps to activate bonus and one of the selections has no bonus", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITHOUT_BONUS));
          await browser.tickFakeClock();
          await freeBetsPO.activateBonus("Use Free Bet Balance");
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1310]_should_see_multiple_is_shown_with_label_bonus_not_available_and_bonus_component_is_displayed_and_still_active`,
          );
        });

        it("[PRPI-1310]_should_see_multiple_is_shown_with_label_bonus_not_available_and_bonus_component_is_displayed_and_still_active", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1310]_should_see_multiple_is_shown_with_label_bonus_not_available_and_bonus_component_is_displayed_and_still_active`,
            ),
          ).toBe(0);
        });

        describe("And one of the singles has no bonus", () => {
          beforeAll(async () => {
            await secondSingle.element.scrollIntoView();
            await browser.waitUntilInViewport(secondSingle.element, "Second single not in viewport");

            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1311]_should_see_single_without_bonus_is_shown_with_label_bonus_not_available`,
            );
          });

          it("[PRPI-1311]_should_see_single_without_bonus_is_shown_with_label_bonus_not_available", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1311]_should_see_single_without_bonus_is_shown_with_label_bonus_not_available`,
              ),
            ).toBe(0);
          });
        });
      });
    });
  });
});
