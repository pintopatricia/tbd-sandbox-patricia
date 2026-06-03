const {
  AppPO,
  GenericPagePO,
  SportsbookReceiptPanelPO,
  SportsbookPlacePanelPO,
  HorseRacingRunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetDetailsPO,
  PrimaryButtonPO,
  FixedNumberInputFieldPO,
  BetSegmentsPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  BetsSummaryPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const racePagePO = new GenericPagePO();
const cardPO = new CardPO();
const placePanelPO = new SportsbookPlacePanelPO();
const receiptPanelPO = new SportsbookReceiptPanelPO();
const betDetailsPO = new BetDetailsPO();
const ctaPrimaryButtonPO = new PrimaryButtonPO(placePanelPO.place);
const controlsPO = new BetControlsPO(placePanelPO.element);
const firstSingleSegmentsPO = new BetSegmentsPO(receiptPanelPO.singles[0]);
const placeOddsFieldPO = new FixedNumberInputFieldPO(controlsPO.fixedInput);
const sportsbookMarketPO = new SportsbookMarketPO(cardPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const firstUnnamedFavourite = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[1]);
const secondUnnamedFavourite = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[2]);
const betSummaryPO = new BetsSummaryPO(placePanelPO.summary);

const mockService = new MockService();

const RACE_ID = "7|30264302.1755";
const MARKET_ID = "924.252091866";

const marketCardMock = {
  __typename: "MarketCard",
  cardTitle: "Win",
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
            name: "Aintree",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                vector: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Aintree",
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
            venue: "Aintree",
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
        { runnerURN: "ppb:sbkRunner:924.252091866/1" },
        { runnerURN: "ppb:sbkRunner:924.252091866/7" },
        { runnerURN: "ppb:sbkRunner:924.252091866/8" },
      ],
    },
  },
};

const BFF_RACE_VIEW_MOCK = {
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  race: {
    urn: `ppb:tbd:race:${RACE_ID}`,
    meeting: {
      urn: "30264302",
    },
  },
  edges: [
    {
      node: {
        ...marketCardMock,
        urn: "ppb:tbd:card:raceMarket:30264302.1755;WIN|3",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:30264302.1755;WIN|3",
      },
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
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_RACE_VIEW_MOCK.urn, {
        currentUrl: routes.getRacingViewUrl(),
      }),
    );
    await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await browser.url(routes.getRacingViewUrl(RACE_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: racePagePO.element, price: 5, isHorseRacing: true }),
    );
  });

  describe("When the race card is displayed", () => {
    beforeAll(async () => {
      await secondUnnamedFavourite.element.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondUnnamedFavourite.sportsbookBetButton);
    });

    it("[PRPI-6386] Then should be two Unnamed Favourites", async () => {
      expect(await firstUnnamedFavourite.horseName.getText()).toBe("Unnamed Favourite");
      expect(await secondUnnamedFavourite.horseName.getText()).toBe("Unnamed 2nd Favourite");
    });

    it("[PRPI-6387] And each Unnamed Favourite bet button should have 'SP' as odd", async () => {
      expect(await firstUnnamedFavourite.sportsbookBetButton.getText()).toBe("SP");
      expect(await secondUnnamedFavourite.sportsbookBetButton.getText()).toBe("SP");
    });

    it("[PRPI-6388] And each Unnamed Favourite bet button should be enabled", async () => {
      expect(await firstUnnamedFavourite.sportsbookBetButton.isEnabled()).toBe(true);
      expect(await secondUnnamedFavourite.sportsbookBetButton.isEnabled()).toBe(true);
    });

    describe("When user clicks on an unnamed favourite bet button", () => {
      beforeAll(async () => {
        await firstUnnamedFavourite.sportsbookBetButton.click();
        await browser.waitUntilDisplayed(placePanelPO.element, "Place Panel was not displayed on runner add");
      });

      it("[PRPI-6389] The betslip should open and display 'SP' on odds field", async () => {
        expect(await placeOddsFieldPO.numberField.getValue()).toEqual("SP");
      });

      it("[PRPI-6390] The fallback silk should be displayed", async () => {
        expect(await betDetailsPO.runnerVisual.isDisplayed()).toBe(true);
      });

      describe("When user inserts a 2€ stake", () => {
        beforeAll(async () => {
          await stakeFieldPO.setValue("2");
        });

        it("[PRPI-6391] The returns label should be displayed with the value 'TBD", async () => {
          expect(await betSummaryPO.totalReturnsLabel.getText()).toEqual("Total Returns");
          expect(await betSummaryPO.totalReturnsValue.getText()).toEqual("TBD");
        });

        describe("When user clicks on place button", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
            await ctaPrimaryButtonPO.element.click();
            await browser.waitUntilDisplayed(receiptPanelPO.element);
          });

          it("[PRPI-6392] The receipt panel should be displayed", async () => {
            expect(await receiptPanelPO.element.isDisplayed()).toEqual(true);
          });

          it("[PRPI-6393] Should show 'SP' as the Odds value", async () => {
            expect(await firstSingleSegmentsPO.leftLabel.getText()).toEqual("Odds");
            expect(await firstSingleSegmentsPO.leftValue.getText()).toEqual("SP");
          });

          it("[PRPI-6394] Should show 'TBD' as the Returns value", async () => {
            expect(await firstSingleSegmentsPO.rightLabel.getText()).toEqual("Returns");
            expect(await firstSingleSegmentsPO.rightValue.getText()).toEqual("TBD");
          });

          it("[PRPI-6395] Should show the fall back silk", async () => {
            expect(await betDetailsPO.runnerVisual.isDisplayed()).toBe(true);
          });
        });
      });
    });
  });
});
