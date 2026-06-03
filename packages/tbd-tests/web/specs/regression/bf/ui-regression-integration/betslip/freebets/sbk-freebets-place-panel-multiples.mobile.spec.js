const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  CardPO,
  FreeBetsPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  BetDetailsPO,
  FreeBetsCardLabelPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const eventMarketCardPO = {
  first: new EventMarketCardPO(sportPagePO.primaryEventCards[0]),
  second: new EventMarketCardPO(sportPagePO.primaryEventCards[1]),
  third: new EventMarketCardPO(sportPagePO.primaryEventCards[2]),
};
const matchOddsCard = {
  first: new CardPO(eventMarketCardPO.first.market),
  second: new CardPO(eventMarketCardPO.second.market),
  third: new CardPO(eventMarketCardPO.third.market),
};
const sportsbookMarketPO = {
  first: new InlineSportsbookMarketPO(matchOddsCard.first.inlineSportsbookMarket),
  second: new InlineSportsbookMarketPO(matchOddsCard.second.inlineSportsbookMarket),
  third: new InlineSportsbookMarketPO(matchOddsCard.third.inlineSportsbookMarket),
};
const marketRunnerSportsbookPO = {
  first: new SportsbookBetButtonPO(sportsbookMarketPO.first.betButtons[0]),
  second: new SportsbookBetButtonPO(sportsbookMarketPO.second.betButtons[0]),
  third: new SportsbookBetButtonPO(sportsbookMarketPO.third.betButtons[0]),
};

const placePanelPO = new SportsbookPlacePanelPO();
const singlesCardPO = new SinglesCardPO();
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const thirdSinglePO = new SinglePO(singlesCardPO.singles[2]);
const betDetailsPO = new BetDetailsPO();
const freeBetsCardLabelPO = {
  first: new FreeBetsCardLabelPO(firstSinglePO.element),
  second: new FreeBetsCardLabelPO(secondSinglePO.element),
  third: new FreeBetsCardLabelPO(thirdSinglePO.element),
};

const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const firstAdditionalMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[0]);
const firstAdditionalMultipleFreeBetsCardLabelPO = new FreeBetsCardLabelPO(firstAdditionalMultipleControlsPO.element);

const sportsbookMultiplesControlsPO = new BetControlsPO();
const multipleFreeBetsCardLabelPO = new FreeBetsCardLabelPO(sportsbookMultiplesControlsPO.element);

const freeBetsPO = new FreeBetsPO();
const placeButtonPO = new PrimaryButtonPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();
const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const FRACTIONAL_DISPLAY_ODDS_MOCK = {
  fractionalDisplayOdds: { numerator: 1, denominator: 2 },
};

const RUNNER_DETAILS_MOCK = [
  {
    selectionId: "1",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.1 },
    },
  },
  {
    selectionId: "2",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
  },
  {
    selectionId: "3",
    runnerOdds: {
      ...FRACTIONAL_DISPLAY_ODDS_MOCK,
      decimalDisplayOdds: { decimalOdds: 1.3 },
    },
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: RUNNER_DETAILS_MOCK,
    },
    {
      marketId: "924.2",
      runnerDetails: RUNNER_DETAILS_MOCK,
    },
    {
      marketId: "924.3",
      runnerDetails: RUNNER_DETAILS_MOCK,
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
        cardGroupTitle: "League",
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
                        runnerURN: "ppb:sbkRunner:924.1/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/3",
                      },
                    ],

                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
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
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
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
                        runnerURN: "ppb:sbkRunner:924.2/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.2/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.2/3",
                      },
                    ],

                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/3",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team B 3",
                  },
                  away: {
                    name: "Team A 3",
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
                        runnerURN: "ppb:sbkRunner:924.3/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.3/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.3/3",
                      },
                    ],

                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
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
};

const FIRST_SINGLE_MOCK_WITH_BONUS = {
  ...FIRST_SINGLE_MOCK,
  hasBonusMoney: true,
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
        },
      ],
    },
  ],
};

const SECOND_SINGLE_MOCK_WITH_BONUS = {
  ...SECOND_SINGLE_MOCK,
  hasBonusMoney: true,
};

const THIRD_SINGLE_MOCK_WITH_BONUS = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.3",
          selectionId: 1,
        },
      ],
    },
  ],

  hasBonusMoney: true,
};

const SINGLE_ODDS_BASE_MOCK = {
  trueOdds: {
    decimalOdds: { decimalOdds: 1.1 },
  },
  decimalDisplayOdds: {
    decimalOdds: 1.1,
  },
  ...FRACTIONAL_DISPLAY_ODDS_MOCK,
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: SINGLE_ODDS_BASE_MOCK.trueOdds,
    fractionalDisplayOdds: SINGLE_ODDS_BASE_MOCK.fractionalDisplayOdds,
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: SINGLE_ODDS_BASE_MOCK,
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.3",
    selectionId: 1,
  },
  odds: SINGLE_ODDS_BASE_MOCK,
};

const DOUBLE_AND_TREBLE_BASE_MOCK = {
  legCombinations: [],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const DOUBLE_COMBINATION = {
  ...DOUBLE_AND_TREBLE_BASE_MOCK,
  betType: "DOUBLE",
  winAvgOdds: {
    ...FRACTIONAL_DISPLAY_ODDS_MOCK,
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
  },
};

const DOUBLE_COMBINATION_WITH_BONUS = {
  ...DOUBLE_COMBINATION,
  hasBonusMoney: true,
};

const TREBLE_COMBINATION = {
  ...DOUBLE_AND_TREBLE_BASE_MOCK,
  betType: "TREBLE",
  winAvgOdds: {
    ...FRACTIONAL_DISPLAY_ODDS_MOCK,
    decimalDisplayOdds: {
      decimalOdds: 3.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 3.4 },
    },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SINGLE_MOCK_WITH_BONUS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_BONUS],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK_WITH_BONUS = {
  betCombinations: [FIRST_SINGLE_MOCK_WITH_BONUS, SECOND_SINGLE_MOCK_WITH_BONUS, DOUBLE_COMBINATION_WITH_BONUS],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK_WITH_BONUS = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK_WITH_BONUS,
    THIRD_SINGLE_MOCK_WITH_BONUS,
    TREBLE_COMBINATION,
    { ...DOUBLE_COMBINATION_WITH_BONUS, numLines: 3 },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK_DOUBLE_WITHOUT_BONUS = {
  betCombinations: [
    FIRST_SINGLE_MOCK_WITH_BONUS,
    SECOND_SINGLE_MOCK_WITH_BONUS,
    THIRD_SINGLE_MOCK_WITH_BONUS,
    TREBLE_COMBINATION,
    { ...DOUBLE_COMBINATION, numLines: 3 },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("Multiple Singles Experience", () => {
  describe("When the user has betslip open with two selections with bonus", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_WITH_BONUS));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");
      await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

      await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilInViewport(
        marketRunnerSportsbookPO.second.sportsbookBetButton,
        "Second market bet button not in viewport",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_BONUS));
      await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

      await sportsbookMinimizedPO.element.waitForClickable();
      await sportsbookMinimizedPO.element.click();

      await browser.waitUntilEquals(
        freeBetsPO.label,
        "Use Free Bet Balance",
        "Freebets label is not equal to 'Use Free Bet Balance'",
      );
    });

    afterAll(async () => {
      await placePanelPO.removeAll.waitForClickable();
      await placePanelPO.removeAll.click();

      await browser.waitUntilNotDisplayed(placePanelPO.element);
    });

    it("[PRPI-7822] the bonus component is displayed", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(true);
    });

    describe("And next imply polling request returns no bonus", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilNotDisplayed(freeBetsPO.element, "Freebets component is displayed");
      });

      it("[PRPI-7823] the bonus component is not displayed", async () => {
        expect(await browser.waitUntilNotDisplayed(freeBetsPO.element, "Freebets component is displayed")).toBe(true);
      });
    });
  });

  describe("When the user has two selections without bonus in betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");
      await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

      await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilInViewport(
        marketRunnerSportsbookPO.second.sportsbookBetButton,
        "Second market bet button not in viewport",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");
    });

    afterAll(async () => {
      await placePanelPO.removeAll.waitForClickable();
      await placePanelPO.removeAll.click();

      await browser.waitUntilNotDisplayed(placePanelPO.element);
    });

    describe("When the user adds another selection with bonus and taps to expand the betslip", () => {
      beforeAll(async () => {
        await marketRunnerSportsbookPO.third.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          marketRunnerSportsbookPO.third.sportsbookBetButton,
          "Third market bet button not in viewport",
        );

        await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK_WITH_BONUS));
        await marketRunnerSportsbookPO.third.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "3", "Third selection not added");

        await sportsbookMinimizedPO.element.waitForClickable();
        await sportsbookMinimizedPO.element.click();

        await browser.waitUntilEquals(
          freeBetsPO.label,
          "Use Free Bet Balance",
          "Freebets is not equal to 'Use Free Bet Balance'",
        );
      });

      it("[PRPI-7824] the bonus component is displayed", async () => {
        expect(await freeBetsPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-7825] The bonus component radio button is OFF", async () => {
        expect(await freeBetsPO.input.isSelected()).toBe(false);
      });
    });
  });

  describe("When the user is in betslip with one selection with bonus component radio button active", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_WITH_BONUS));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

      await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");
      await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
      await freeBetsPO.activateBonus("Use Free Bet Balance");
    });

    afterAll(async () => {
      await betDetailsPO.remove.waitForClickable();
      await betDetailsPO.remove.click();
      await browser.waitUntilNotDisplayed(freeBetsPO.element);
    });

    describe("When the user taps to add another bet to betslip and taps to expand it", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

        await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(
          marketRunnerSportsbookPO.second.sportsbookBetButton,
          "Second market bet button not in viewport",
        );

        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_BONUS));
        await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
        await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

        await sportsbookMinimizedPO.element.waitForClickable();
        await sportsbookMinimizedPO.element.click();
        await browser.waitUntilEquals(
          freeBetsPO.label,
          "Use Free Bet Balance",
          "Freebets label is not equal to 'Use Free Bet Balance'",
        );
      });

      it("[PRPI-7826] the bonus component radio button is ON", async () => {
        expect(await freeBetsPO.input.isSelected()).toBe(true);
      });

      describe("When the user adds another selection to betslip and taps to expand it", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.click();
          await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

          await marketRunnerSportsbookPO.third.sportsbookBetButton.scrollIntoView();
          await browser.waitUntilInViewport(
            marketRunnerSportsbookPO.third.sportsbookBetButton,
            "Third market bet button not in viewport",
          );

          await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK_WITH_BONUS));
          await marketRunnerSportsbookPO.third.sportsbookBetButton.click();
          await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "3", "Third selection not added");

          await sportsbookMinimizedPO.element.waitForClickable();
          await sportsbookMinimizedPO.element.click();
          await browser.waitUntilEquals(
            freeBetsPO.label,
            "Use Free Bet Balance",
            "Freebets label is not equal to 'Use Free Bet Balance'",
          );
        });

        it("[PRPI-7827] the bonus component radio button is ON", async () => {
          expect(await freeBetsPO.input.isSelected()).toBe(true);
        });

        describe("When the user taps to remove one selection from betslip", () => {
          beforeAll(async () => {
            await betslipDrawerPO.header.click();
            await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

            await marketRunnerSportsbookPO.third.sportsbookBetButton.scrollIntoView();
            await browser.waitUntilInViewport(
              marketRunnerSportsbookPO.third.sportsbookBetButton,
              "Third market bet button not in viewport",
            );

            await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_BONUS));
            await marketRunnerSportsbookPO.third.sportsbookBetButton.click();
            await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Third selection not removed");

            await sportsbookMinimizedPO.element.waitForClickable();
            await sportsbookMinimizedPO.element.click();
            await browser.waitUntilEquals(
              freeBetsPO.label,
              "Use Free Bet Balance",
              "Freebets label is not equal to 'Use Free Bet Balance'",
            );
          });

          it("[PRPI-7827] the bonus component radio button is ON", async () => {
            expect(await freeBetsPO.input.isSelected()).toBe(true);
          });

          describe("When the user taps to remove another selection from betslip", () => {
            beforeAll(async () => {
              await betslipDrawerPO.header.click();
              await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

              await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
                block: "center",
              });
              await browser.waitUntilInViewport(
                marketRunnerSportsbookPO.second.sportsbookBetButton,
                "Second market bet button not in viewport",
              );

              await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_WITH_BONUS));
              await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
              await browser.waitUntilEquals(
                freeBetsPO.label,
                "Use Free Bet Balance",
                "Freebets label is not equal to 'Use Free Bet Balance'",
              );
            });

            it("[PRPI-7827] the bonus component radio button is ON", async () => {
              expect(await freeBetsPO.input.isSelected()).toBe(true);
            });
          });
        });
      });
    });
  });

  describe("When user adds three selections to betslip: one multiple with bonus and two singles with bonus", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", countryCode: "US" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(marketRunnerSportsbookPO.first.odd, "1.1");
      await marketRunnerSportsbookPO.first.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");

      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedPO.element, "Minimized betslip not found");

      await marketRunnerSportsbookPO.second.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilInViewport(
        marketRunnerSportsbookPO.second.sportsbookBetButton,
        "Second market bet button not in viewport",
      );
      await browser.waitUntilDisplayed(
        marketRunnerSportsbookPO.second.sportsbookBetButton,
        "Second runner bet button not visible",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK_WITH_BONUS));
      await marketRunnerSportsbookPO.second.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "2", "Second selection not added");

      await marketRunnerSportsbookPO.third.sportsbookBetButton.scrollIntoView();
      await browser.waitUntilInViewport(
        marketRunnerSportsbookPO.third.sportsbookBetButton,
        "Third market bet button not in viewport",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK_WITH_BONUS));
      await marketRunnerSportsbookPO.third.sportsbookBetButton.click();
      await browser.waitUntilEquals(sportsbookMinimizedPO.counter, "3", "Third selection not added");

      await sportsbookMinimizedPO.element.waitForClickable();
      await sportsbookMinimizedPO.element.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");
    });

    it("[PRPI-7828] The 'Bonus not available' label is not displayed in multiple", async () => {
      expect(await multipleFreeBetsCardLabelPO.label.isDisplayed()).toBe(false);
    });

    it("[PRPI-7829] The 'Bonus not available' label is not displayed in every single", async () => {
      expect(await freeBetsCardLabelPO.first.label.isDisplayed()).toBe(false);
      expect(await freeBetsCardLabelPO.second.label.isDisplayed()).toBe(false);
      expect(await freeBetsCardLabelPO.third.label.isDisplayed()).toBe(false);
    });

    describe("When user taps to activate bonus", () => {
      beforeAll(async () => {
        await freeBetsPO.activateBonus("Use Free Bet Balance");
        await browser.waitUntilEquals(
          multipleFreeBetsCardLabelPO.label,
          "Bonus not available",
          "Freebets label is not equal to 'Bonus not available'",
        );
      });

      it("[PRPI-7830] The 'Bonus not available' label is displayed in multiple", async () => {
        expect(await multipleFreeBetsCardLabelPO.label.isDisplayed()).toBe(true);
      });

      it("[PRPI-7831] The 'Bonus not available' label is displayed the first single", async () => {
        expect(await freeBetsCardLabelPO.first.label.isDisplayed()).toBe(true);
      });

      it("[PRPI-7832] The 'Bonus not available' label is not displayed in the second and third single", async () => {
        expect(await freeBetsCardLabelPO.second.label.isDisplayed()).toBe(false);
        expect(await freeBetsCardLabelPO.third.label.isDisplayed()).toBe(false);
      });

      it("[PRPI-7833] The 'Bonus not available' label is not displayed in double multiple", async () => {
        expect(await firstAdditionalMultipleFreeBetsCardLabelPO.label.isDisplayed()).toBe(false);
      });

      describe("And imply request returns the currently observed multiple without bonus available and all singles with bonus", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK_DOUBLE_WITHOUT_BONUS));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(
            firstAdditionalMultipleFreeBetsCardLabelPO.label,
            "Bonus not available",
            "Freebets label is not equal to 'Bonus not available'",
          );
        });

        it("[PRPI-7834] The 'Bonus not available' label is displayed in doublemultiple", async () => {
          expect(await firstAdditionalMultipleFreeBetsCardLabelPO.label.isDisplayed()).toBe(true);
        });

        it("[PRPI-7834] The 'Bonus not available' label is not displayed inevery single", async () => {
          expect(await freeBetsCardLabelPO.first.label.isDisplayed()).toBe(false);
          expect(await freeBetsCardLabelPO.second.label.isDisplayed()).toBe(false);
          expect(await freeBetsCardLabelPO.third.label.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
