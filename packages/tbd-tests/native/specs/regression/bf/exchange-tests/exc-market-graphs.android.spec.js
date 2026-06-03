const {
  CardSO,
  ExchangeMarketSO,
  GenericScreenSO,
  HorseRacingRunnerSO,
  RunnerSO,
  RunnerDetailsSO,
  MarketBlurbsSO,
} = require("../../../../screen-objects");

const MarketGraphSO = require("@ppb/tbd-shared/components/MarketGraph/MarketGraph.native.so");

const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const {
  getAppContext,
  getHomeLayoutWithViewLink,
  getMarketLayout,
  getRaceLayout,
  getRaceRunners,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const exchangeMarketSO = new ExchangeMarketSO(cardSO.exchangeMarket);

const marketGraphSO = new MarketGraphSO();

const firstFootballRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const secondFootballRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[1]);
const thirdFootballRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[2]);

const firstHorseRacingRunnerSO = new HorseRacingRunnerSO(exchangeMarketSO.runnerList[0]);
const firstHorseRacingRunnerDetailsSO = new RunnerDetailsSO(firstHorseRacingRunnerSO.element);

const marketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.blurbs);

const MARKET_ID = "1.251865776";
const EVENT_ID = "35074135";
const RACE_ID = "35074135.1410";

// BFF - Horse Racing
const HORSE_RACING_RUNNERS = [
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
    name: "Shakalakaboomboom",
    selectionId: 55190,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
    name: "Dromiskin",
    selectionId: 48224,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
    name: "Fun And Games",
    selectionId: 58805,
    handicap: 0,
    resultType: null,
  },
];

const HORSE_RACE = {
  __typename: "Race",
  urn: `ppb:race:${RACE_ID}`,
  name: "14:40 Aintree",
  meeting: {
    __typename: "Meeting",
    urn: "ppb:meeting:29901908",
    venue: "Aintree",
    countryFlag: {
      medium: "http://example.test.com/mockedImage/image.png",
    },
  },
};

const BFF_HORSE_RACING_MOCK = {
  __typename: "RaceView",
  url: `horse-racing/clairefontaine-3rd-aug/r-7|${RACE_ID}`,
  urn: `ppb:tbd:view:race:7|${RACE_ID}`,
  race: {
    urn: `ppb:race:${RACE_ID}`,
    meeting: {
      urn: `ppb:meeting:${EVENT_ID}`,
    },
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:raceMarket:${RACE_ID};WIN|3`,
        cardTitle: "Win",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              name: "1m2f Nov Stks",
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
                  runners: [
                    {
                      selectionId: 48044,
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
                        trainerName: "Richard Hannon",
                        saddleCloth: "4",
                        weight: {
                          stones: "9-10",
                        },
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      selectionId: 48351,
                      horse: {
                        name: "Ragnar",
                        sireName: "NO NAY NEVER (USA)",
                        damName: "ENHARMONIC (USA)",
                        age: 5,
                        color: "CHESTNUT",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "Fergus Gregory",
                        trainerName: "Garry Henn",
                        saddleCloth: "3",
                        weight: {
                          stones: "9-10",
                        },
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 8,
                      },
                    },
                  ],

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
                  urn: "ppb:meeting:29901908",
                  venue: "Aintree",
                  countryFlag: {
                    medium: "http://example.test.com/mockedImage/image.png",
                  },
                },
              },
              marketRulesViewLink: {
                viewUrn: "ppb:tbd:view:marketRules:1.11111111",
                viewUrl: "",
              },
              runners: HORSE_RACING_RUNNERS,
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0` },
            ],
          },
        },
        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race: {
            ...HORSE_RACE,
            runners: [
              {
                __typename: "RaceRunner",
                urn: `ppb:tbd:racerunner:${RACE_ID}/55190`,
                raceURN: `ppb:race:${RACE_ID}`,
                selectionId: 55190,
                rating: 104,
                comments:
                  "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
                horse: {
                  name: "Shakalakaboomboom",
                  sireName: "NEW APPROACH (IRE)",
                  damName: "HORATIA (IRE)",
                  damSireName: "TEOFILO (IRE)",
                  age: 5,
                  color: "BAY",
                  sex: "COLT",
                  bred: "IRE",
                },
                details: {
                  jockeyName: "John Velazquez",
                  trainerName: "Floki Vahalaa",
                  saddleCloth: 4,
                  silk: "http://example.test.com/mockedImage/image.png",
                  draw: 10,
                  type: "FLAT",
                  weight: { kilograms: 1, pounds: 1, stones: "8-6" },
                  equipmentDescription: "Visor and tongue strap",
                },
                form: "1-15026",
              },
              {
                __typename: "RaceRunner",
                urn: `ppb:tbd:racerunner:${RACE_ID}/48224`,
                raceURN: `ppb:race:${RACE_ID}`,
                selectionId: 48224,
                horse: {
                  name: "DROMISKIN",
                  sireName: "DUNADEN (FR)",
                  damName: "CEILIDH BAND",
                  damSireName: "CELTIC SWING",
                  age: 5,
                },
                details: {
                  jockeyName: "Sophie Ralston",
                  trainerName: "Dean Ivory",
                  saddleCloth: 1,
                  draw: 2,
                  silk: null,
                },
              },
              {
                __typename: "RaceRunner",
                urn: `ppb:tbd:racerunner:${RACE_ID}/58805`,
                raceURN: `ppb:race:${RACE_ID}`,
                selectionId: 58805,
                horse: {
                  name: "Fun And Games",
                },
                details: {
                  jockeyName: "Sophie Ralston",
                  trainerName: "Dean Ivory",
                  saddleCloth: 17,
                  draw: 22,
                  silk: null,
                },
              },
            ],
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
        },
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${MARKET_ID}`,
            viewUrl: `horse-racing/here-13th-oct/3m1f-hcap-hrd/rc-${MARKET_ID}`,
          },
        ],

        runnerViewLinks: [
          {
            runnerUrn: `ppb:excRunner:${MARKET_ID}/55190/0`,
            viewUrl: "Not Implemented",
            viewUrn: `ppb:tbd:view:runner:${MARKET_ID}/55190/0`,
          },
        ],

        isRunnerExpandable: true,
        blurbs: [],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:raceMarket:${RACE_ID};WIN|3`,
      },
    },
  ],
};

const BFF_RACING_RUNNERS_MOCK = {
  RaceRunners: [
    {
      __typename: "RaceRunner",
      urn: `ppb:tbd:racerunner:${RACE_ID}/55190`,
      raceURN: `ppb:race:${RACE_ID}`,
      selectionId: 55190,
      rating: 104,
      comments:
        "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
      horse: {
        name: "Shakalakaboomboom",
        sireName: "NEW APPROACH (IRE)",
        damName: "HORATIA (IRE)",
        damSireName: "TEOFILO (IRE)",
        age: 5,
        color: "BAY",
        sex: "COLT",
        bred: "IRE",
      },
      details: {
        jockeyName: "John Velazquez",
        trainerName: "Floki Vahalaa",
        saddleCloth: 4,
        silk: "http://example.test.com/mockedImage/image.png",
        draw: 10,
        type: "FLAT",
        weight: { kilograms: 1, pounds: 1, stones: "8-6" },
        equipmentDescription: "Visor and tongue strap",
      },
      form: "1-15026",
    },
    {
      __typename: "RaceRunner",
      urn: `ppb:tbd:racerunner:${RACE_ID}/48224`,
      raceURN: `ppb:race:${RACE_ID}`,
      selectionId: 48224,
      horse: {
        name: "John Snow Snowing Snowing Snowing",
        sireName: "DUNADEN (FR)",
        damName: "CEILIDH BAND",
        damSireName: "CELTIC SWING",
        age: 5,
      },
      details: {
        jockeyName: "Sophie Ralston",
        trainerName: "Dean Ivory",
        saddleCloth: 1,
        draw: 2,
        silk: null,
      },
    },
    {
      __typename: "RaceRunner",
      urn: `ppb:tbd:racerunner:${RACE_ID}/58805`,
      raceURN: `ppb:race:${RACE_ID}`,
      selectionId: 58805,
      horse: {
        name: "Shakalala",
      },
      details: {
        jockeyName: "Sophie Ralston",
        trainerName: "Dean Ivory",
        saddleCloth: 17,
        draw: 22,
        silk: null,
      },
    },
  ],
};

// BFF - Football
const FOOTBALL_RUNNERS = [
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
    name: "Chelsea",
    selectionId: 55190,
    handicap: 0,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
    name: "Tottenham",
    selectionId: 48224,
    handicap: 0,
  },
  {
    __typename: "Runner",
    runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
    name: "The Draw",
    selectionId: 58805,
    handicap: 0,
  },
];

const EXCHANGE_FOOTBALL_MARKET = {
  eventId: EVENT_ID,
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${MARKET_ID}`,
  name: "Match Odds",
  marketType: "MATCH_ODDS",
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      name: "Chelsea v Tottenham",
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  marketRulesViewLink: {
    viewUrn: "ppb:tbd:view:marketRules:1.11111111",
    viewUrl: "",
  },
  runners: FOOTBALL_RUNNERS,
  liveData: { inplay: false },
};

const BFF_FOOTBALL_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  url: `sport/competition/event/market/m-${MARKET_ID}`,
  mainMarket: EXCHANGE_FOOTBALL_MARKET,
  edges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended##${MARKET_ID}`,
        cardTitle: "Match Odds",
        defaultIndex: 0,
        displayRunners: {
          exchange: {
            market: EXCHANGE_FOOTBALL_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0` },
            ],
          },
          sportsbook: null,
        },
        runnerViewLinks: [
          {
            runnerUrn: `ppb:excRunner:${MARKET_ID}/55190/0`,
            viewUrn: `ppb:tbd:view:runner:${MARKET_ID}/55190/0`,
          },
          {
            runnerUrn: `ppb:excRunner:${MARKET_ID}/48224/0`,
            viewUrn: `ppb:tbd:view:runner:${MARKET_ID}/48224/0`,
          },
          {
            runnerUrn: `ppb:excRunner:${MARKET_ID}/58805/0`,
            viewUrn: `ppb:tbd:view:runner:${MARKET_ID}/58805/0`,
          },
        ],

        theme: "LIGHT",
      },
    },
  ],

  partialEdges: [
    {
      __typename: "MarketExtendedCard",
      urn: `ppb:tbd:card:marketExtended##${MARKET_ID}`,
    },
  ],
};

// ERO
const ERO_MOCK = [
  {
    marketId: MARKET_ID,
    runners: [
      {
        selectionId: "55190",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
      },
      {
        selectionId: "48224",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

describe("Market Graphs", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
  });

  describe("when navigating to a race market page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_HORSE_RACING_MOCK));
      await mockService.mockHttpRequest(getRaceRunners(BFF_RACING_RUNNERS_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`horse-racing/clairefontaine-3rd-aug/r-7%7C${RACE_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(firstHorseRacingRunnerSO.element);

      await browser.waitUntilClickableNative(firstHorseRacingRunnerSO.innerContainer);
      await firstHorseRacingRunnerSO.innerContainer.click();
      await browser.waitUntilDisplayed(firstHorseRacingRunnerDetailsSO.element);
    });

    it("[PRPI-3606] the market blurb should display the market graphs icon", async () => {
      expect(await marketBlurbsSO.marketGraphButton.isDisplayed()).toBe(true);
    });

    describe("and then when clicking on the market graphs icon", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(marketBlurbsSO.marketGraphButton);
        await marketBlurbsSO.marketGraphButton.click();

        await browser.waitUntilDisplayed(marketGraphSO.element);
      });

      it("[PRPI-3607] the market graphs header should display the event name, market type and 'X' button", async () => {
        expect(await marketGraphSO.headerTitle.getText()).toBe("Market Graphs");
        expect(await marketGraphSO.headerButton.isDisplayed()).toBe(true);

        expect(await marketGraphSO.eventInfo.getText()).toMatch("Wind 13th Jul");
        expect(await marketGraphSO.marketInfo.getText()).toMatch("1m2f Nov Stks");
      });

      it("[PRPI-3608] the market graphs should display the information of the first runner", async () => {
        expect(await marketGraphSO.webview.isDisplayed()).toBe(true);
      });

      describe("and when clicking on the 'X' button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(marketGraphSO.headerButton);
          await marketGraphSO.headerButton.click();

          await browser.waitUntilNotDisplayed(marketGraphSO.element);
        });

        it("[PRPI-3609] the market page should be displayed", async () => {
          expect(await exchangeMarketSO.element).toBeDisplayed();
        });
      });
    });
  });

  describe("when navigating to a non-racing market page (e.g. football)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(BFF_FOOTBALL_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/market/m-${MARKET_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", {
        isViewLinkStartPage: !!HOME_VIEW_LINK,
        shouldTerminateAppBeforeStart: true,
      });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(firstFootballRunnerSO.element);
    });

    it("[PRPI-3610] the market blurb should not display the market graphs icon", async () => {
      expect(await marketBlurbsSO.marketGraphButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-3611] all runners should display the market graphs icon", async () => {
      expect(await firstFootballRunnerSO.runnerMarketGraphIcon.isEnabled()).toBe(true);
      expect(await secondFootballRunnerSO.runnerMarketGraphIcon.isEnabled()).toBe(true);
      expect(await thirdFootballRunnerSO.runnerMarketGraphIcon.isEnabled()).toBe(true);
    });

    describe("and then when clicking on the market graphs icon of the second runner", () => {
      beforeAll(async () => {
        await secondFootballRunnerSO.runnerClickable.click();

        await browser.waitUntilDisplayed(marketGraphSO.element);
      });

      it("[PRPI-3612] the market graphs header should display the event name, market type and 'X' button", async () => {
        expect(await marketGraphSO.headerTitle.getText()).toBe("Market Graphs");
        expect(await marketGraphSO.headerButton.isDisplayed()).toBe(true);

        expect(await marketGraphSO.eventInfo.getText()).toMatch("Chelsea v Tottenham");
        expect(await marketGraphSO.marketInfo.getText()).toMatch("Match Odds");
      });

      it("[PRPI-3613] the market graphs should display the information of the second runner", async () => {
        expect(await marketGraphSO.webview.isDisplayed()).toBe(true);
      });

      describe("and when clicking on the 'X' button", () => {
        beforeAll(async () => {
          await marketGraphSO.headerButton.click();

          await browser.waitUntilNotDisplayed(marketGraphSO.element);
        });

        it("[PRPI-3614] the market page should be displayed", async () => {
          expect(await exchangeMarketSO.element).toBeDisplayed();
        });
      });
    });
  });
});
