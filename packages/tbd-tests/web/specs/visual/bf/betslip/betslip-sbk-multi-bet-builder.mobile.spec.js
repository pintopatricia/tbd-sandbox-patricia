const {
  MinimizedPO,
  SportPagePO,
  MultiBetBuilderPO,
  ScrollableSwimlanePO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  PrimaryButtonPO,
  AlertPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const sportPagePO = new SportPagePO();
const firstEventSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const firstCardPO = new CardPO(firstEventSwimlanePO.scrollItems[0]);
const secondCardPO = new CardPO(firstEventSwimlanePO.scrollItems[1]);
const secondEventSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[1]);
const thirdCardPO = new CardPO(secondEventSwimlanePO.scrollItems[0]);
const firstMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const thirdMarketPO = new SportsbookMarketPO(thirdCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstMarketPO.runnerList[0]);
const secondRunnerPO = new RunnerPO(secondMarketPO.runnerList[0]);
const thirdRunnerPO = new RunnerPO(thirdMarketPO.horseRacingRunnerList[0]);

const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const multiBetBuilderPO = new MultiBetBuilderPO(sportsbookPlacePanelPO.element);
const firstBetControlsPO = new BetControlsPO(multiBetBuilderPO.element);
const multiBetBuilderStakePO = new CurrencyNumberInputFieldPO(firstBetControlsPO.currencyInput);
const alertPO = new AlertPO();
const cardPO = new CardPO(betslipDrawerPO.element);

const mockService = new MockService();
const EVENT_TYPE_ID = 1;
const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 1 };
const THIRD_RUNNER = { marketId: "924.3", selectionId: 1 };

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST", "COUPON"],
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29359895:MATCH_ODDS",
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29359895:BOTH_TEAMS_TO_SCORE",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29359895:MATCH_ODDS",
                title: "Team A vs Team B",
                marketsHierarchy: {
                  __typename: "EventHierarchy",
                  sportevent: {
                    name: "Home Team vs Away Team",
                    urn: `ppb:event:29359895`,
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      marketType: "MATCH_ODDS_90",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Home Team vs Away Team",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Home Team",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Away Team",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:29359895:BOTH_TEAMS_TO_SCORE",
                cardTitle: "Both teams to score",
                marketsHierarchy: {
                  __typename: "EventHierarchy",
                  sportevent: {
                    name: "Home Team vs Away Team",
                    urn: `ppb:event:29359895`,
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",

                      noLiveData: true,
                      name: "Both teams to score",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Home Team vs Away Team",
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Yes",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "No",
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
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST", "COUPON"],
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 1,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                defaultIndex: 0,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      marketTypeName: "Win",
                      liveData: {
                        inplay: false,
                        turnInPlayEnabled: false,
                        bspMarket: true,
                      },
                      sport: {
                        __typename: "Sport",
                        name: "Horse Racing",
                        sportId: 7,
                        urn: "ppb:eventType:7",
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T14:40:00",
                          name: "Windsor",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:30061949",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: {
                              vector: "http://example.test.com/mockedImage/image.png",
                            },
                            venue: "Windsor",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:30061949",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: {
                            vector: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Windsor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          name: "Shakalakaboomboom",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          name: "Shakalakaboomboom",
                          selectionId: 3,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
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
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:40:00.000Z",
                  name: "Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/1",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 1,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/2",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 2,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/3",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 3,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30061949",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 3,
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
    },
  ],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_MULTI_SGM_MOCK = {
  betType: "TREBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const MULTI_BET_BUILDER_MOCK = {
  betCombinations: [TREBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM_MULTIPLES"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }, { runner: THIRD_RUNNER }],
      legs: [
        { leg: { betRunners: [{ runner: FIRST_RUNNER }] } },
        { leg: { betRunners: [{ runner: SECOND_RUNNER }] } },
        { leg: { betRunners: [{ runner: THIRD_RUNNER }] } },
      ],

      totalPotentialWin: 2,
      totalStake: 0.12,
    },
  ],
};

const MODULE_NAME = "betslip_sbk";

describe("SBK Multi Bet Builder", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        MULTI_BET_BUILDER_ONBOARDING: { isActive: true },
      }),
    );
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));

    await browser.waitUntilEquals(firstRunnerPO.sportsbookBetButton, "1.1");

    await firstRunnerPO.sportsbookBetButton.waitForClickable();
    await firstRunnerPO.sportsbookBetButton.click();

    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");
    await betslipDrawerPO.header.waitForClickable();
    await betslipDrawerPO.header.click();
  });

  describe("when adding a second selection", () => {
    beforeAll(async () => {
      await secondRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
        inline: "nearest",
      });

      await browser.waitUntilDisplayed(secondRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLES_MOCK));

      await secondRunnerPO.sportsbookBetButton.waitForClickable();
      await secondRunnerPO.sportsbookBetButton.click();

      await browser.waitUntilEquals(minimizedPO.counter, "2");
    });

    describe("when adding the last selection", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK));

        await thirdRunnerPO.sportsbookBetButton.scrollIntoView({
          block: "center",
          inline: "nearest",
        });
        await thirdRunnerPO.sportsbookBetButton.waitForClickable();
        await thirdRunnerPO.sportsbookBetButton.click();

        await browser.waitUntilEquals(minimizedPO.counter, "3");

        await minimizedPO.element.waitForClickable();
        await minimizedPO.element.click();

        await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples betslip not displayed");

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1252]_should_render_multi_bet_builder_with_onboarding_message`,
        );
      });

      it("[PRPI-1251]_should_render_multi_bet_builder_with_onboarding_message", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1252]_should_render_multi_bet_builder_with_onboarding_message`,
          ),
        ).toEqual(0);
      });

      describe("when closing the on boarding message", () => {
        beforeAll(async () => {
          await alertPO.action.waitForClickable();
          await alertPO.action.click();

          await browser.waitUntilNotDisplayed(alertPO.element, "Alert message not removed");

          await addStake(multiBetBuilderStakePO, "0.12");

          await cardPO.header.scrollIntoView();

          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1252]_should_render_multi_bet_builder`);
        });

        it("[PRPI-1252]_should_render_multi_bet_builder", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1252]_should_render_multi_bet_builder`)).toEqual(0);
        });
      });

      describe("when collapsing betslip", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.waitForClickable();
          await betslipDrawerPO.header.click();
          await browser.waitUntilDisplayed(minimizedPO.counter, "Betslip is not collapsed");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1253]_should_render_multi_bet_builder_info_in_collapsed_betslip`,
          );
        });

        it("[PRPI-1253]_should_render_multi_bet_builder_info_in_collapsed_betslip", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1253]_should_render_multi_bet_builder_info_in_collapsed_betslip`,
            ),
          ).toEqual(0);
        });

        describe("when placing the multi", () => {
          beforeAll(async () => {
            await minimizedPO.element.waitForClickable();
            await minimizedPO.element.click();
            await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples betslip not displayed");

            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

            await placeButtonPO.element.waitForClickable();
            await placeButtonPO.element.click();

            await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element, "Receipt was not displayed");

            await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1254]_should_render_multi_bet_builder_receipt`);
          });

          it("[PRPI-1254]_should_render_multi_bet_builder_receipt", async () => {
            expect(
              await browser.checkScreen(`${MODULE_NAME}_[PRPI-1254]_should_render_multi_bet_builder_receipt`),
            ).toEqual(0);
          });
        });
      });
    });
  });
});
