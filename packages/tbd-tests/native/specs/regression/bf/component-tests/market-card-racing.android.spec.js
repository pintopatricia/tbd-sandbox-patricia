const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");
const PriceHistorySO = require("@ppb/tbd-shared/components/PriceHistory/PriceHistory.so");
const {
  getGenericLayout,
  getMarketLayout,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericViewSO,
  HorseRacingRunnerSO,
  CardSO,
  NonRunnerSO,
  SportsbookMarketSO,
  RunnerSO,
  ExchangeMarketSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericViewSO = new GenericViewSO();

const exchangeMarketSO = new ExchangeMarketSO();
const sportsBookMarketSO = new SportsbookMarketSO();
const raceDetailsSO = new RaceDetailsSO();
const cardSO = new CardSO();
const firstMarketSO = new MarketSO(genericViewSO.items[0]);
const firstCardSO = new CardSO(firstMarketSO.element);
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const firstHorseRacingRunnerSO = new HorseRacingRunnerSO(exchangeMarketSO.runnerList[0]);
const secondHorseRacingRunnerSO = new HorseRacingRunnerSO(exchangeMarketSO.runnerList[1]);

const firstSbkHrRunner = sportsBookMarketSO.horseRunnerList[0];
const secondSbkHrRunner = sportsBookMarketSO.horseRunnerList[1];

const firstSbkHorseRacingRunnerSO = new HorseRacingRunnerSO(firstSbkHrRunner);
const firstSbkHorseRacingRunnerPriceHistorySO = new PriceHistorySO(firstSbkHorseRacingRunnerSO.element);
const secondSbkHorseRacingRunnerSO = new HorseRacingRunnerSO(secondSbkHrRunner);
const secondSbkHorseRacingRunnerPriceHistorySO = new PriceHistorySO(secondSbkHorseRacingRunnerSO.element);

const secondSbkHorseRacingRunnerNonRunnerSO = new NonRunnerSO(secondSbkHrRunner);

const horseRacingRunners = [
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30214917.1910/18705425",
    raceURN: "ppb:race:30214917.1910",
    selectionId: 18705425,
    horse: {
      name: "Shakalakaboomboom",
      sireName: "KODIAC",
      damName: "SUPREME OCCASION (IRE)",
      damSireName: "TEOFILO (IRE)",
      age: 3,
      color: "BAY",
      sex: "COLT",
    },
    details: {
      jockeyName: "John Velazquez",
      trainerName: "Floki Vahalaa",
      saddleCloth: "4",
      weight: {
        stones: "9-10",
      },
      silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
      draw: 10,
    },
    form: "22123534",
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30214917.1910/21433708",
    raceURN: "ppb:race:30214917.1910",
    selectionId: 21433708,
    horse: {
      name: "Ragnar",
      sireName: "NO NAY NEVER (USA)",
      damName: "ENHARMONIC (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
    details: {
      saddleCloth: "4",
    },
  },
];

const marketCard = {
  __typename: "MarketCard",
  urn: "ppb:tbd:card:market:924.193270252|6",
  cardTitle: "Win",
  viewLinks: [
    {
      viewUrn: "ppb:tbd:view:market:924.193270252",
      viewUrl: "horse-racing/wolv-5th-jan/each-way/r-924.193270252",
    },
  ],

  marketsHierarchy: {
    __typename: "RaceHierarchy",
    race: {
      __typename: "Race",
      urn: "ppb:race:30214917.1910",
      startTime: "2020-11-13T14:40:00",
      name: "14:40 Aintree",
      details: {
        distance: {
          miles: 0,
          furlongs: 6,
          yards: 22,
        },
        going: "STD",
        status: "DORMANT",
        type: "FLAT",
      },
      runners: horseRacingRunners,
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:30214917",
        name: "Wolv  5th Jan",
        country: "GB",
        countryFlag: {
          small: null,
        },
        venue: "Wolverhampton",
        date: "2021-01-05T16:10:00.000Z",
      },
    },
  },
  displayRunners: {
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.193270252",
        notTotalMatched: true,
        name: "Match Odds",
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
            urn: "ppb:race:30214917.1910",
            startTime: "2020-11-13T14:40:00",
            name: "14:40 Aintree",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:30214917",
              name: "Wolv  5th Jan",
              country: "GB",
              countryFlag: {
                small: null,
              },
              venue: "Wolverhampton",
              date: "2021-01-05T16:10:00.000Z",
            },
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30214917",
            name: "Wolv  5th Jan",
            country: "GB",
            countryFlag: {
              small: null,
            },
            venue: "Wolverhampton",
            date: "2021-01-05T16:10:00.000Z",
          },
        },
        runners: [
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/18705425",
            name: "Shakalakaboomboom",
            selectionId: 18705425,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/21433708",
            name: "Ragnar",
            selectionId: 21433708,
            handicap: 0,
            resultType: null,
          },
        ],
      },
      runners: [
        { runnerURN: "ppb:sbkRunner:924.193270252/18705425" },
        { runnerURN: "ppb:sbkRunner:924.193270252/21433708" },
      ],
    },
  },
  runnerViewLinks: [
    {
      runnerUrn: "ppb:excRunner:1.177579912/18705425/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.177579912/18705425/0",
    },
    {
      runnerUrn: "ppb:excRunner:1.177579912/21433708/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.177579912/21433708/0",
    },
  ],
};

const marketCardExchangeOnly = {
  __typename: "MarketCard",
  urn: "ppb:tbd:card:market:1.177579912|6",
  cardTitle: "Win",
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: "ppb:excMarket:1.177579912",
        name: "Each Way",
        marketType: "EACH_WAY",
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
            urn: "ppb:race:30214917.1910",
            startTime: "2020-11-13T14:40:00",
            name: "14:40 Aintree",
            details: {
              distance: {
                miles: 0,
                furlongs: 6,
                yards: 22,
              },
              going: "STD",
              status: "DORMANT",
              type: "FLAT",
            },
            runners: horseRacingRunners,
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:30214917",
              name: "Wolv  5th Jan",
              country: "GB",
              countryFlag: {
                small: null,
              },
              venue: "Wolverhampton",
              date: "2021-01-05T16:10:00.000Z",
            },
          },
        },
        bettingType: "ODDS",
        eachWayDivisor: 5,
        numberOfWinners: 3,
        runners: [
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.177579912/18705425/0",
            name: "Shakalakaboomboom",
            selectionId: 18705425,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.177579912/21433708/0",
            name: "Ragnar",
            selectionId: 21433708,
            handicap: 0,
            resultType: null,
          },
        ],
      },
      runners: [
        { runnerURN: "ppb:excRunner:1.177579912/18705425/0" },
        { runnerURN: "ppb:excRunner:1.177579912/21433708/0" },
      ],
    },
  },
  raceViewLink: {
    viewUrl: "horse-racing/clairefontaine-3rd-aug/r-7|39061949.1335",
    viewUrn: "ppb:tbd:view:race:7|39061949.1335",
  },
  runnerViewLinks: [],
};

const BFF_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  url: "Not Implemented",
  edges: [
    {
      node: {
        ...marketCardExchangeOnly,
        urn: "ppb:tbd:card:market:1.177579911|6",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.177579911",
            viewUrl: "horse-racing/wolv-5th-jan/each-way/rc-1.177579911",
          },
        ],
      },
    },
    {
      node: marketCard,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.177579911|6",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:924.193270252|6",
      },
    },
  ],
};

const BFF_RACE_MARKET_CARD_VIEW_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:1.177579911`,
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|true",
        numberOfRunners: 14,
        race: {
          __typename: "Race",
          urn: "ppb:race:30061949.1336",
          startTime: "2020-07-13T14:10:00",
          name: "14:10 Aintree",
          runners: horseRacingRunners,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901909",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "Good to firm in places Good to firm in places",
            status: "DORMANT",
          },
        },
        showMeetingInfo: true,
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.241938538",
        ...marketCardExchangeOnly,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.241938538",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "18705425",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
          ],
        },
        {
          selectionId: "21433708",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 2.2 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_UPDATED_PREVIOUS_ODDS_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "18705425",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.5 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.6 },
            },
          ],
        },
        {
          selectionId: "21433708",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 2.5 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "18705425",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.5 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.6 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_TURNS_INPLAY_MOCK = {
  markets: [
    {
      ...SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK.markets[0],
      inplay: true,
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  url: "horse-racing/clairefontaine-3rd-aug/r-7|39061949.1335",
  urn: "ppb:tbd:view:race:7|39061949.1335",
  race: {
    __typename: "Race",
    urn: "ppb:race:30061949.1335",
    name: "14:40 Aintree",
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:29901908",
      venue: "Aintree",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|false",
        numberOfRunners: 14,
        race: {
          __typename: "Race",
          urn: "ppb:race:30061949.1335",
          name: "14:40 Aintree",
          runners: horseRacingRunners,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "Good to firm in places Good to firm in places",
            status: "GOING_DOWN",
            type: "FLAT",
          },
        },
        showMeetingInfo: false,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|false",
      },
    },
  ],
};

describe("Layout Entity - Racing Market Card", () => {
  const urls = ["horse-racing/s-7", "horse-racing/s-7"];
  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  describe("When price history is retrieved for SBK runners", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });
      await browser.waitUntilEquals(firstSbkHorseRacingRunnerPriceHistorySO.value, "1.3 ▸ 1.2 ▸ 1.1");
    });

    it("[PRPI-2258] The 3 previous odds for the 1st runner should be visible: 1.3 \u25B8 1.2 \u25B8 1.1", async () => {
      expect(await firstSbkHorseRacingRunnerPriceHistorySO.value.getText()).toBe("1.3 ▸ 1.2 ▸ 1.1");
    });

    it("[PRPI-2259] The 2 previous odds for the 2nd runner should be visible: '2.2 \u25B8 2.1'", async () => {
      expect(await secondSbkHorseRacingRunnerPriceHistorySO.value.getText()).toBe("2.2 ▸ 2.1");
    });

    describe("And the previous odds are updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_UPDATED_PREVIOUS_ODDS_MOCK));
        await browser.waitUntilEquals(firstSbkHorseRacingRunnerPriceHistorySO.value, "1.6 ▸ 1.5 ▸ 1.4");
      });

      it("[PRPI-2260] The 3 previous odds for the 1st runner should be visible: '1.6 \u25B8 1.5 \u25B8 1.4'", async () => {
        expect(await firstSbkHorseRacingRunnerPriceHistorySO.value.getText()).toBe("1.6 ▸ 1.5 ▸ 1.4");
      });

      it("[PRPI-2261] The 2 previous odds for the 2nd runner should be visible: '2.5 \u25B8 2.4'", async () => {
        expect(await secondSbkHorseRacingRunnerPriceHistorySO.value.getText()).toBe("2.5 ▸ 2.4");
      });

      describe("And the 2nd runner becomes a non-runner", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK));
          await browser.waitUntilEquals(secondSbkHorseRacingRunnerNonRunnerSO.nonRunnerTitle, "Non Runner");
        });

        it("[PRPI-2262] The 2 previous odds for the non-runner should be hidden", async () => {
          expect(await secondSbkHorseRacingRunnerNonRunnerSO.nonRunnerTitle.getText()).toEqual("Non Runner");
          expect(await secondSbkHorseRacingRunnerPriceHistorySO.value.isExisting()).toBe(false);
        });

        describe("And the race turns INPLAY", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_TURNS_INPLAY_MOCK));
            await browser.waitUntilNotInDOM(firstSbkHorseRacingRunnerPriceHistorySO.value);
          });

          it("[PRPI-2263] The 1st runner previous odds should not be visible", async () => {
            expect(await firstSbkHorseRacingRunnerPriceHistorySO.value.isExisting()).toBe(false);
          });
        });
      });
    });
  });

  describe("When the user is on a given view and 2 marketcards are retrieved with 2 HR runners", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

      await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

      await browser.waitUntilEquals(firstHorseRacingRunnerSO.runnerHorseName, "Shakalakaboomboom");
      await browser.waitUntilDisplayed(firstHorseRacingRunnerSO.defaultSilk);
    });

    describe("And the first runner has all optional and mandatory fields", () => {
      it("[PRPI-2264] The first marketcard should be rendered with a total of 2 runners at page load", async () => {
        expect(await exchangeMarketSO.runnerList.length).toBe(2);
      });

      it("[PRPI-2265] The default horse silk should be shown", async () => {
        expect(await firstHorseRacingRunnerSO.defaultSilk.isDisplayed()).toBe(true);
      });

      it("[PRPI-2452] The first runner name should be shown 'Shakalakaboomboom'", async () => {
        expect(await firstHorseRacingRunnerSO.runnerHorseName.getText()).toBe("Shakalakaboomboom");
      });

      it("[PRPI-2453] The first runner number should be shown ('4')", async () => {
        expect(await firstHorseRacingRunnerSO.clothNumber.getText()).toBe("4");
      });

      it("[PRPI-2454] The first Jockey name should be shown ('Jockey: John Velazquez')", async () => {
        expect(await firstHorseRacingRunnerSO.jockeyName.getText()).toContain("Jockey: John Velazquez");
      });

      it("[PRPI-2455] The first draw number should be shown\u200B '(10)'", async () => {
        expect(await firstHorseRacingRunnerSO.drawNumber.getText()).toBe("(10)");
      });

      it("[PRPI-2456] The trainer name should be ('Trainer: Floki Vahalaa')", async () => {
        expect(await firstHorseRacingRunnerSO.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
      });

      it("[PRPI-2457] The form and age info should be 'F: 22123534 | Age: 3 | Weight: 9-10'", async () => {
        expect(await firstHorseRacingRunnerSO.form.getText()).toBe("F: 22123534 | Age: 3 | Weight: 9-10");
      });
    });

    describe("And the second runner only has mandatory fields retrieved by FACET", () => {
      it("[PRPI-2458] The second runner name should be shown 'Ragnar'", async () => {
        expect(await secondHorseRacingRunnerSO.runnerHorseName.getText()).toBe("Ragnar");
      });
    });

    describe("When the user taps on the 'win' market", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketLayout(BFF_RACE_MARKET_CARD_VIEW_MOCK));
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
        await browser.waitUntilClickableNative(firstCardSO.title);
        await firstCardSO.title.click();
        await browser.waitUntilEquals(cardSO.title, "Win");
        await browser.waitUntilDisplayed(exchangeMarketSO.element);
      });

      it("[PRPI-2459] The market view should be visible with title 'Win'", async () => {
        expect(await cardSO.title.getText()).toBe("Win");
      });
    });

    describe("When the user taps on the first runner", () => {
      const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);

      beforeAll(async () => {
        await browser.waitUntilDisplayed(firstExchangeRunnerSO.element);
        await firstExchangeRunnerSO.element.click();
        await browser.waitUntilDisplayed(raceDetailsSO.element);
      });

      it("[PRPI-2460] The race screen should open", async () => {
        expect(await raceDetailsSO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
