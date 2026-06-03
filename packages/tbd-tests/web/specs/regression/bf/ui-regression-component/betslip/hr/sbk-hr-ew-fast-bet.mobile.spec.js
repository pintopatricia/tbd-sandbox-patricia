const {
  AppPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  SinglesCardPO,
  SinglePO,
  RunnerPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  OptionPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  BetsSummaryPO,
} = require("../../../../../../page-objects");
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
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
const firstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);

// Betslip
const placePanelPO = new SportsbookPlacePanelPO();
const singlesCardPO = new SinglesCardPO(placePanelPO.element);
const singlePO = new SinglePO(singlesCardPO.singles[0]);
const controlsPO = new BetControlsPO(singlePO.element);
const optionPO = new OptionPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const receiptPanelPO = new SportsbookReceiptPanelPO();
const betsSummaryPO = new BetsSummaryPO(placePanelPO.summary);

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
                defaultIndex: 0,
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
            decimalDisplayOdds: { decimalOdds: 4.33 },
            fractionalDisplayOdds: { numerator: 10, denominator: 3 },
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

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 2,
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

const SPB_SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const WALLET_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

describe("HR E/W fast bet placement", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SPB_SINGLE_MOCK));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getRacingViewUrl());

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When the place panel is displayed", () => {
    beforeAll(async () => {
      await firstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
    });

    it("[PRPI-8550] Should show the Each Way section", async () => {
      expect(await optionPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8551] Should have an 'Each Way' title", async () => {
      expect(await optionPO.title.getText()).toBe("Each Way");
    });

    it("[PRPI-8552] Should show '1/5 Odds, 3 Places' terms", async () => {
      expect(await optionPO.subtitle.getText()).toBe("1/5 Odds, 3 Places");
    });

    it("[PRPI-8553] Should have an unselected state", async () => {
      expect(await optionPO.input.isSelected()).toBe(false);
    });

    it("[PRPI-8554] Should have the correct Balance After Bet", async () => {
      expect(await betsSummaryPO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$5.00");
    });

    describe("When the user inserts a stake of 2", () => {
      beforeAll(async () => {
        await stakeInputFieldPO.setValue("2");
      });

      it("[PRPI-8555] Should display a returns label of 'Returns $4.00'", async () => {
        expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
        expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$4.00");
      });

      it("[PRPI-8556] Should display a place button with the text 'Place $2.00 Bet'", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
        expect(await placeButtonPO.element.getText()).toBe("Place $2.00 Bet");
      });

      it("[PRPI-8557] Should have a correct Balance After Bet", async () => {
        expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$3.00");
      });

      describe("When user clicks on the checkbox", () => {
        beforeAll(async () => {
          await optionPO.element.waitForClickable();
          await optionPO.element.click();
          await browser.waitUntil(() => optionPO.input.isSelected(), {
            timeoutMsg: "E/W Checkbox selection timed out",
          });
        });

        it("[PRPI-8558] Should show a selected checkbox", async () => {
          expect(await optionPO.input.isSelected()).toBe(true);
        });

        it("[PRPI-8559] Should update the multiplier to '2x'", async () => {
          expect(await stakeInputFieldPO.prefix.getText()).toContain("2x");
        });

        it("[PRPI-8560] Should update the returns to 'Returns $6.00'", async () => {
          expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
          expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$6.00");
        });

        it("[PRPI-8561] Should display a place button with the text 'Place $4.00 Bet'", async () => {
          expect(await placeButtonPO.element.isEnabled()).toBe(true);
          expect(await placeButtonPO.element.getText()).toBe("Place $4.00 Bet");
        });

        it("[PRPI-8562] Should have a correct Balance After Bet", async () => {
          expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$1.00");
        });

        describe("When user clicks on the checkbox", () => {
          beforeAll(async () => {
            await optionPO.element.click();
            await browser.waitUntil(async () => !(await optionPO.input.isSelected()), {
              timeoutMsg: "E/W Checkbox un-selection timed out",
            });
          });

          it("[PRPI-8563] Should have an unselected state", async () => {
            expect(await optionPO.input.isSelected()).toBe(false);
          });

          it("[PRPI-8564] Should remove the multiplier from the input field", async () => {
            expect(await stakeInputFieldPO.prefix.getText()).toBe("$");
          });

          it("[PRPI-8565] Should update the returns to 'Returns $4.00'", async () => {
            expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
            expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$4.00");
          });

          it("[PRPI-8566] Should display a place button with the text 'Place $2.00 Bet'", async () => {
            expect(await placeButtonPO.element.getText()).toBe("Place $2.00 Bet");
          });

          it("[PRPI-8567] Should have a correct Balance After Bet", async () => {
            expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$3.00");
          });

          describe("[782060] When the user clicks the place button", () => {
            beforeAll(async () => {
              await placeButtonPO.element.waitForClickable();
              await placeButtonPO.element.click();
              await browser.waitUntilDisplayed(receiptPanelPO.element);
            });

            it("[PRPI-8568] Should show a successful bet placement receipt", async () => {
              expect(await receiptPanelPO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
