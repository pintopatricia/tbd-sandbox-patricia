const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  SingleSO,
  HorseRacingRunnerSO,
  SportsbookBetButtonSO,
  BetSegmentsSO,
  FixedNumberInputFieldSO,
  CurrencyNumberInputFieldSO,
  BetDetailsSO,
  BetControlsSO,
  OddsSO,
  PNLAndWhatIfSO,
  BetsSummarySO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const EVENT_TYPE_ID = 7;
const MARKET_ID = "924.252091866";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Horse Racing",
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
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.252091866",
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
                          urn: "ppb:race:30264302.1755",
                          startTime: "2020-07-13T14:40:00",
                          name: "Windsor",
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
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/7",
                          name: "Unnamed Favourite",
                          runnerOrder: 99,
                          selectionId: 7,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/8",
                          name: "Unnamed 2nd Favourite",
                          runnerOrder: 100,
                          selectionId: 8,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/7",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/8",
                      },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T13:30:00.000Z",
                  name: "14:30 Windsor",
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
                        name: "B",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Sophie Ralston",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/3",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 3,
                      horse: {
                        name: "C",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "Oisin Murphy",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: 7,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 5,
                      },
                    },
                  ],

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
              },
            },
          ],
        },
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

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    // adding more content so it reaches 100% of the viewporty, remove this after the GenericScreen is fixed
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOrder: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5.0 },
              fractionalOdds: { numerator: 4, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 5.0 },
            fractionalDisplayOdds: { numerator: 4, denominator: 1 },
            americanDisplayOdds: { americanOdds: 400.0, americanOddsInt: 400 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 7,
          runnerOrder: 98,
          noOdds: true,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 8,
          runnerOrder: 99,
          noOdds: true,
          runnerStatus: "ACTIVE",
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
          marketId: "924.252091866",
          selectionId: 7,
        },
      ],
    },
  ],

  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: "924.252091866",
    selectionId: 7,
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      runners: [
        {
          runner: { marketId: "924.252091866", selectionId: 7 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.252091866", selectionId: 7 } }],
          },
        },
      ],
    },
  ],
};

describe("Horse Racing - Sportsbook - Starting Price", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    const url = "horse-racing/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("When the SBK race card is displayed", () => {
    beforeAll(async () => {
      const raceMarketCardSO = new RaceMarketCardSO();
      const firstUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[1]);

      await browser.waitUntilEquals(firstUnnamedFavourite.runnerHorseName, "Unnamed Favourite");
    });

    it("[PRPI-3562] Then should be two Unnamed Favourites", async () => {
      const raceMarketCardSO = new RaceMarketCardSO();
      const firstUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[1]);
      const secondUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[2]);

      expect(await firstUnnamedFavourite.runnerHorseName.getText()).toBe("Unnamed Favourite");
      expect(await secondUnnamedFavourite.runnerHorseName.getText()).toBe("Unnamed 2nd Favourite");
    });

    it("[PRPI-3563] And each Unnamed Favourite bet button should have 'SP' as odd", async () => {
      const raceMarketCardSO = new RaceMarketCardSO();
      const firstUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[1]);
      const firstUnnamedFavouriteBetButton = new SportsbookBetButtonSO(firstUnnamedFavourite.sbkBetButtons[0]);
      const secondUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[2]);
      const secondUnnamedFavouriteBetButton = new SportsbookBetButtonSO(secondUnnamedFavourite.sbkBetButtons[0]);

      expect(await firstUnnamedFavouriteBetButton.odd.getText()).toBe("SP");
      expect(await secondUnnamedFavouriteBetButton.odd.getText()).toBe("SP");
    });

    describe("When user clicks on an unnamed favourite bet button", () => {
      beforeAll(async () => {
        const raceMarketCardSO = new RaceMarketCardSO();
        const firstUnnamedFavourite = new HorseRacingRunnerSO(raceMarketCardSO.runners[1]);
        const firstUnnamedFavouriteBetButton = new SportsbookBetButtonSO(firstUnnamedFavourite.sbkBetButtons[0]);
        await browser.waitUntilClickableNative(firstUnnamedFavouriteBetButton.element);
        await firstUnnamedFavouriteBetButton.element.click();

        const placePanelSO = new SportsbookPlacePanelSO();

        await browser.waitUntilDisplayed(placePanelSO.element, "Place Panel was not displayed on runner add");
      });

      it("[PRPI-3564] The betslip should open and display 'SP' on odds field", async () => {
        const placePanelSO = new SportsbookPlacePanelSO();
        const singleSO = new SingleSO(placePanelSO.element);
        const singleControlsSO = new BetControlsSO(singleSO.controls);
        const placeOddsFieldSO = new FixedNumberInputFieldSO(singleControlsSO.fixedInput);

        expect(await placeOddsFieldSO.numberField.getText()).toEqual("SP");
      });

      it("[PRPI-3565] The fallback silk should be displayed", async () => {
        const betDetailsSO = new BetDetailsSO();

        expect(await betDetailsSO.icon.isDisplayed()).toBe(true);
      });

      describe("When user inserts a 2$ stake", () => {
        beforeAll(async () => {
          const placePanelSO = new SportsbookPlacePanelSO();
          const singleSO = new SingleSO(placePanelSO.element);
          const singleControlsSO = new BetControlsSO(singleSO.controls);
          const placeStakeFieldSO = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

          await placeStakeFieldSO.numberField.click();
          await placeStakeFieldSO.numberField.setValue("2");
          await hideKeyboard();
        });

        it("[PRPI-3566] The total returns value should be displayed with the value 'TBD", async () => {
          const betsSummarySO = new BetsSummarySO();

          expect(await betsSummarySO.totalReturnsLabel.getText()).toEqual("Total Returns");
          expect(await betsSummarySO.totalReturnsValue.getText()).toEqual("TBD");
        });

        describe("When user clicks on place button", () => {
          beforeAll(async () => {
            const placeButtonSO = new PrimaryButtonSO();

            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
            await placeButtonSO.element.click();

            const receiptPanelSO = new SportsbookReceiptPanelSO();

            await browser.waitUntilDisplayed(receiptPanelSO.element);
          });

          it("[PRPI-3567] The receipt panel should be displayed", async () => {
            const receiptPanelSO = new SportsbookReceiptPanelSO();

            expect(await receiptPanelSO.element.isDisplayed()).toEqual(true);
          });

          it("[PRPI-3568] Should show 'SP' as the Odds value", async () => {
            const receiptPanelSO = new SportsbookReceiptPanelSO();
            const segments = new BetSegmentsSO(receiptPanelSO.singles[0]);
            const singleOddsSegment = new OddsSO(segments.leftSegment);

            expect(await singleOddsSegment.odds.getText()).toEqual("SP");
          });

          it("[PRPI-3569] Should show 'TBD' as the Returns value", async () => {
            const receiptPanelSO = new SportsbookReceiptPanelSO();
            const segments = new BetSegmentsSO(receiptPanelSO.singles[0]);
            const singleReturnsSegment = new PNLAndWhatIfSO(segments.rightSegment);

            expect(await singleReturnsSegment.pnl.getText()).toEqual("TBD");
          });

          it("[PRPI-3570] Should show the fall back silk", async () => {
            const betDetailsSO = new BetDetailsSO();

            expect(await betDetailsSO.icon.isDisplayed()).toBe(true);
          });
        });
      });
    });
  });
});
