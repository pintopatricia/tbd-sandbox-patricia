const {
  AppPO,
  SportPagePO,
  MinimizedPO,
  SinglesCardPO,
  SinglePO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  OptionPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPage = new SportPagePO();
const raceMarketCardPO = new RaceMarketCardPO(sportPage.scrollableSwimlanes[0]);

// Next Races Card
const firstRaceCardPO = new CardPO(raceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const secondRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[1]);
const firstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);
const secondRunnerBetButtonPO = new SportsbookBetButtonPO(secondRunnerPO.sportsbookBetButton);

// Betslip
const placePanelPO = new SportsbookPlacePanelPO();
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const singlesCardPO = new SinglesCardPO(placePanelPO.element);
const firstSectionCardPO = new CardPO(betslipDrawerPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const firstStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const secondStakePO = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);
const firstEachWayOptionPO = new OptionPO(firstSingleControlsPO.element);
const secondEachWayOptionPO = new OptionPO(secondSingleControlsPO.element);

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
                raceViewLink: {
                  viewUrn: "ppb:tbd:view:race:29901908.1410",
                  viewUrl: routes.getRaceViewUrl("7", "29901908.1410"),
                },
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      marketType: "WIN",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "HR",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:29901908.1410",
                          startTime: "2020-07-13T14:40:00",
                          name: "14:40 Wolverhampton",
                          details: {
                            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                          },
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: {
                              medium: "http://example.test.com/mockedImage/image.png",
                            },
                            venue: "Wolverhampton",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: {
                            medium: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Wolverhampton",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "John Snow Snowing Snowing Snowing",
                          selectionId: 2,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          name: "Shakalala",
                          selectionId: 3,
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
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1410",
                  startTime: "2020-07-13T14:30:00",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 3,
                numberOfRunners: 14,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
          },
        },
      ],
    },
  ],
};

const FIRST_COMBINATION = {
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

  averageOdds: 2,
  winAverageOdds: 2,
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
  eachwayPlaces: 3,
  placeFraction: {
    numerator: 1,
    denominator: 5,
  },
};

const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 2,
        },
      ],
    },
  ],

  averageOdds: 2,
  winAverageOdds: 2,
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
  betType: "SINGLE",
};

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
  eachwayPlaces: 4,
  placeFraction: {
    numerator: 1,
    denominator: 4,
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const SIB_TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_COMBINATION, SECOND_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS],
};

describe("HR E/W Singles & Multiples panel", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));

    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await browser.url(`${routes.getRacingViewUrl()}`);

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When the place panel is displayed", () => {
    beforeAll(async () => {
      await firstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
      await betslipDrawerPO.header.click();
      await browser.waitUntil(async () => (await minimizedPO.title.getText()) === "$10.00 Single @ 2 returns $20.00");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_TWO_SINGLES_MOCK));
      await secondRunnerBetButtonPO.element.scrollIntoView({
        block: "center",
      });
      await secondRunnerBetButtonPO.element.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
    });

    it("[PRPI-8569] Should display multiples label", async () => {
      expect(await firstSectionCardPO.title.getText()).toBe("SINGLES");
    });

    it("[PRPI-8570] Should two singles cards", async () => {
      expect(await singlesCardPO.singles.length).toBe(2);
    });

    it("[PRPI-8571] Selection A should have an Each Way with 'Each Way' title", async () => {
      expect(await firstEachWayOptionPO.title.getText()).toBe("Each Way");
    });

    it("[PRPI-8572] Selection A should have odds and terms of '1/5 Odds, 3 Places'", async () => {
      expect(await firstEachWayOptionPO.subtitle.getText()).toBe("1/5 Odds, 3 Places");
    });

    it("[PRPI-8573] Selection A should have an unselected checkbox", async () => {
      expect(await firstEachWayOptionPO.input.isSelected()).toBe(false);
    });

    it("[PRPI-8574] Selection B should have an Each Way with 'Each Way' title", async () => {
      expect(await secondEachWayOptionPO.title.getText()).toBe("Each Way");
    });

    it("[PRPI-8575] Selection B should have odds and terms of '1/4 Odds, 4 Places'", async () => {
      expect(await secondEachWayOptionPO.subtitle.getText()).toBe("1/4 Odds, 4 Places");
    });

    it("[PRPI-8576] Selection B should have an unselected checkbox", async () => {
      expect(await secondEachWayOptionPO.input.isSelected()).toBe(false);
    });

    describe("When the user inserts a stake of 2 in Selection A and checks E/W", () => {
      beforeAll(async () => {
        await firstStakePO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(firstStakePO.element);

        await firstStakePO.numberField.waitForClickable();
        await firstStakePO.numberField.click();
        await firstStakePO.setValue("2");

        await firstEachWayOptionPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(firstEachWayOptionPO.element);

        await firstEachWayOptionPO.input.click();
      });

      it("[PRPI-8577] Should show a selected checkbox", async () => {
        expect(await firstEachWayOptionPO.input.isSelected()).toBe(true);
      });

      it("[PRPI-8578] Should update the multiplier to '2x'", async () => {
        expect(await firstStakePO.prefix.getText()).toContain("2x");
      });

      it("[PRPI-8579] Should update the returns to 'Returns $6.00'", async () => {
        expect(await firstSingleControlsPO.returnsLabel.getText()).toBe("Returns");
        expect(await firstSingleControlsPO.returnsValueContainer.getText()).toBe("$6.00");
      });

      describe("When the user inserts a stake of 2 in Selection B and checks E/W", () => {
        beforeAll(async () => {
          await secondStakePO.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(secondStakePO.element);

          await secondStakePO.numberField.waitForClickable();
          await secondStakePO.numberField.click();
          await secondStakePO.setValue("2");

          await secondEachWayOptionPO.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(secondEachWayOptionPO.element);

          await secondEachWayOptionPO.input.click();
        });

        it("[PRPI-8580] Should show a selected checkbox", async () => {
          expect(await secondEachWayOptionPO.input.isSelected()).toBe(true);
        });

        it("[PRPI-8581] Should update the multiplier to '2x'", async () => {
          expect(await secondStakePO.prefix.getText()).toContain("2x");
        });

        it("[PRPI-8582] Should update the returns to 'Returns $6.00'", async () => {
          expect(await secondSingleControlsPO.returnsLabel.getText()).toBe("Returns");
          expect(await secondSingleControlsPO.returnsValueContainer.getText()).toBe("$6.00");
        });

        describe("When removing E/W from Selection A", () => {
          beforeAll(async () => {
            await secondEachWayOptionPO.input.click();
            await browser.waitUntil(async () => !(await secondEachWayOptionPO.input.isSelected()), {
              timeoutMsg: "E/W Checkbox selection timed out",
            });
          });

          it("[PRPI-8583] Should show a un-selected checkbox", async () => {
            expect(await secondEachWayOptionPO.input.isSelected()).toBe(false);
          });

          it("[PRPI-8583] Should remove the multiplier", async () => {
            expect(await secondStakePO.prefix.getText()).toEqual("$");
          });
        });
      });
    });
  });
});
