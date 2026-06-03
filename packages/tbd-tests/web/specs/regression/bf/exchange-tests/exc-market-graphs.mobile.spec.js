const {
  CardPO,
  ExchangeMarketPO,
  RunnerPO,
  FullScreenModalPO,
  RichTextPO,
  HorseRacingRunnerPO,
  MarketBlurbsPO,
} = require("../../../../page-objects");
const MarketGraphPO = require("@ppb/tbd-shared/components/MarketGraph/MarketGraph.po");
const MarketPO = require("@ppb/tbd-shared/components/Market/Market.po");

const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketLayout, getRaceRunners, getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getExchangeGraphsAggregations } = require("../../../../mock-essentials/controllers/html/html-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const fullScreenModalPO = new FullScreenModalPO();
const marketGraphPO = new MarketGraphPO(fullScreenModalPO.element);
const richTextPO = new RichTextPO(marketGraphPO.header);

const marketPO = new MarketPO();
const marketCardPO = new CardPO(marketPO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);

const firstFootballRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondFootballRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[1]);
const thirdFootballRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[2]);

const firstHorseRacingRunnerPO = new HorseRacingRunnerPO(exchangeMarketPO.horseRacingRunnerList[0]);

const marketBlurbsPO = new MarketBlurbsPO(exchangeMarketPO.element);

const mockService = new MockService();

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
      urn: "ppb:meeting:29901908",
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
                race: HORSE_RACE,
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                  venue: "Aintree",
                  countryFlag: {
                    medium: "http://example.test.com/mockedImage/image.png",
                  },
                },
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
            viewUrn: "ppb:tbd:view:market:1.171344945",
            viewUrl: "horse-racing/here-13th-oct/3m1f-hcap-hrd/rc-1.171344945",
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
  runners: FOOTBALL_RUNNERS,
};

const BFF_FOOTBALL_MOCK = {
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  url: `football/english-premier-league/chelsea-v-tottenham/match-odds/m-${MARKET_ID}`,
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
      },
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
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getExchangeGraphsAggregations());
  });

  describe("when navigating to a race market page", () => {
    beforeAll(async () => {
      const currentUrl = routes.getRacingViewUrl();

      await mockService.mockHttpRequest(await getIndexHTML(BFF_HORSE_RACING_MOCK.urn, { currentUrl }));
      await mockService.mockHttpRequest(getRaceRunners(BFF_RACING_RUNNERS_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_HORSE_RACING_MOCK));

      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntilDisplayed(marketCardPO.title);

      // Open expandable details section to show "Market Graphs"
      await firstHorseRacingRunnerPO.getRunnerInformationContainers()[0].waitForClickable();
      await firstHorseRacingRunnerPO.getRunnerInformationContainers()[0].click();
      await browser.waitUntilDisplayed(firstHorseRacingRunnerPO.expandableDetails);
    });

    it("[PRPI-3606] the market blurb should display the market graphs icon", async () => {
      expect(await marketBlurbsPO.marketGraphButton.isDisplayed()).toBe(true);
    });

    describe("and then when clicking on the market graphs icon", () => {
      beforeAll(async () => {
        await marketBlurbsPO.marketGraphButton.waitForClickable();
        await marketBlurbsPO.marketGraphButton.click();

        await browser.waitUntilDisplayed(fullScreenModalPO.element);
        await browser.waitUntilDisplayed(marketGraphPO.element);
      });

      it("[PRPI-3607] the market graphs header should display the event name, market type and 'X' button", async () => {
        expect(await fullScreenModalPO.headerTitle.getText()).toBe("Market Graphs");
        expect(await fullScreenModalPO.closeBtn.isDisplayed()).toBe(true);

        // NOTE: RichTextPO does not export heading validation
        expect(await richTextPO.element.getText()).toMatch("Wind 13th Jul\n1m2f Nov Stks");
      });

      it("[PRPI-3608] the market graphs should display the information of the first runner", async () => {
        expect(await marketGraphPO.iframe.isDisplayed()).toBe(true);
      });

      describe("and when clicking on the 'X' button", () => {
        beforeAll(async () => {
          await fullScreenModalPO.closeBtn.waitForClickable();
          await fullScreenModalPO.closeBtn.click();

          await browser.waitUntilNotDisplayed(fullScreenModalPO.element);
        });

        it("[PRPI-3609] the market page should be displayed ", async () => {
          expect(await exchangeMarketPO.element).toBeDisplayed();
        });
      });
    });
  });

  describe("when navigating to a non-racing market page (e.g. football)", () => {
    beforeAll(async () => {
      const currentUrl = routes.getMarketViewUrl();
      await mockService.mockHttpRequest(await getIndexHTML(BFF_FOOTBALL_MOCK.urn, { currentUrl }));
      await mockService.mockHttpRequest(getMarketLayout(BFF_FOOTBALL_MOCK));

      await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
      await browser.waitUntilDisplayed(marketCardPO.title);
    });

    it("[PRPI-3610] the market blurb should not display the market graphs icon", async () => {
      expect(await marketBlurbsPO.marketGraphButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-3611] all runners should display the market graphs icon", async () => {
      expect(await firstFootballRunnerPO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
      expect(await secondFootballRunnerPO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
      expect(await thirdFootballRunnerPO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
    });

    describe("and then when clicking on a runner", () => {
      beforeAll(async () => {
        await secondFootballRunnerPO.runnerButton.waitForClickable();
        await secondFootballRunnerPO.runnerButton.click();

        await browser.waitUntilDisplayed(fullScreenModalPO.element);
        await browser.waitUntilDisplayed(marketGraphPO.element);
      });

      it("[PRPI-5433] the market graphs header should display the event name, market type and 'X' button", async () => {
        expect(await fullScreenModalPO.headerTitle.getText()).toBe("Market Graphs");
        expect(await fullScreenModalPO.closeBtn.isDisplayed()).toBe(true);

        // NOTE: RichTextPO does not export heading validation
        expect(await richTextPO.element.getText()).toMatch("Chelsea v Tottenham\nMatch Odds");
      });

      it("[PRPI-5434] the market graphs should display the information of the second runner", async () => {
        expect(await marketGraphPO.iframe.isDisplayed()).toBe(true);
      });

      describe("and when clicking on the 'X' button", () => {
        beforeAll(async () => {
          await fullScreenModalPO.closeBtn.waitForClickable();
          await fullScreenModalPO.closeBtn.click();

          await browser.waitUntilNotDisplayed(fullScreenModalPO.element);
        });

        it("[PRPI-5435] the market page should be displayed ", async () => {
          expect(await exchangeMarketPO.element).toBeDisplayed();
        });
      });
    });
  });
});
