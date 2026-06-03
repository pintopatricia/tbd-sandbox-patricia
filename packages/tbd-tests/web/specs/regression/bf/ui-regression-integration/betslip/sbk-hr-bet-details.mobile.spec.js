const {
  AppPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetDetailsPO,
  PrimaryButtonPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  BetslipDrawerPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPage = new SportPagePO();
const raceMarketCardPO = new RaceMarketCardPO(sportPage.scrollableSwimlanes[0]);

// Next Races Card
const firstRaceCardPO = new CardPO(raceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const firstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);

// Betslip
const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const betDetailsPO = new BetDetailsPO(placePanelPO.element);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptBetDetailsPO = new BetDetailsPO(receiptPanelPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const betslipDrawerPO = new BetslipDrawerPO();

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
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Wolverhampton",
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
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/1",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 1,
                      details: {
                        saddleCloth: 4,
                        silk: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                  ],
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      marketType: "WIN",
                      marketTypeName: "Win",
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
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Wolverhampton",
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
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.73 },
            fractionalDisplayOdds: { numerator: 4, denominator: 6 },
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

  averageOdds: 1.73,
  winAverageOdds: 1.73,
  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.73 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 1.73 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

describe("Horse Racing Bet Details", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));

    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getRacingViewUrl());

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 1.73, isHorseRacing: true }),
    );
  });

  describe("When user clicks on 'Shakalakaboomboom' selection", () => {
    beforeAll(async () => {
      await firstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
      await browser.waitUntilDisplayed(betDetailsPO.remove);
    });

    it("[PRPI-8321] Should show a silk on the left", async () => {
      expect(await betDetailsPO.runnerVisual.isDisplayed()).toBe(true);
    });

    it("[PRPI-8322] Should show a runner name of '4 Shakalakaboomboom'", async () => {
      expect(await betDetailsPO.title.getText()).toBe("4 Shakalakaboomboom");
    });

    it("[PRPI-8323] Should show a subtitle 'Win - 15:40 Wolverhampton'", async () => {
      expect(await betDetailsPO.subtitle.getText()).toBe("Win - 15:40 Wolverhampton");
    });

    it("[PRPI-8324] Should show a trash bin icon on the right", async () => {
      expect(await betDetailsPO.remove.isDisplayed()).toBe(true);
    });

    describe("When user clicks on the place button", () => {
      beforeAll(async () => {
        await stakeFieldPO.setValue("1");
        await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
        await placeButtonPO.element.click();
        await browser.waitUntilEquals(betslipDrawerPO.header, "Bet Placed");
      });
      it("[PRPI-8325] Should show a silk on the left", async () => {
        expect(await receiptBetDetailsPO.runnerVisual.isDisplayed()).toBe(true);
      });

      it("[PRPI-8326] Should show a runner name of '4 Shakalakaboomboom'", async () => {
        expect(await receiptBetDetailsPO.title.getText()).toBe("4 Shakalakaboomboom");
      });

      it("[PRPI-8327] Should show a subtitle 'Win - 15:40 Wolverhampton'", async () => {
        expect(await receiptBetDetailsPO.subtitle.getText()).toBe("Win - 15:40 Wolverhampton");
      });
    });
  });
});
