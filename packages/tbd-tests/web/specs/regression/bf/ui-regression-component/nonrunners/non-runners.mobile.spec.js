const {
  AppPO,
  MarketPagePO,
  ExchangeMarketPO,
  CardPO,
  NonRunnerPO,
  SportsbookMarketPO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const marketCardPO = new CardPO(marketPagePO.element);

const sbkMarketPO = new SportsbookMarketPO(marketCardPO.sportsbookMarket);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);

const excNonRunnerPO = new NonRunnerPO(exchangeMarketPO.horseRacingRunnerList[1]);
const sbkNonRunnerPO = new NonRunnerPO(sbkMarketPO.horseRacingRunnerList[1]);

const mockService = new MockService();
const MARKET_ID = "1.179438989";

const ERO_MOCK = [
  {
    marketId: "1.171344945",
    runners: [
      {
        selectionId: "12804940",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
        state: {
          adjustmentFactor: 2.0,
          sortPriority: 11,
          removalDate: "2021-05-13T14:40:00Z",
          status: "REMOVED",
        },
      },
      {
        selectionId: "16257108",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.234263186",
      runnerDetails: [
        {
          selectionId: "12804940",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          runnerStatus: "REMOVED",
        },
        {
          selectionId: "16257108",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_EXC_VIEW_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  url: "horse-racing/leic-18th-feb/2m6f-nov-chs/rc-1.179438989",
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.253991161",
        cardTitle: "Win",
        marketsHierarchy: {
          race: {
            __typename: "Race",
            urn: "ppb:race:29901908.1410",
            runners: [
              {
                selectionId: 16257108,
                details: {
                  jockeyName: "John Velazquez",
                  trainerName: "Richard Hannon",
                  saddleCloth: 4,
                  silk: "http://example.test.com/mockedImage/image.png",
                  draw: 10,
                },
              },
              {
                selectionId: 12804940,
                horse: {
                  name: "TOP GARRY (FR)",
                  sireName: "BALLINGARRY (IRE)",
                  damName: "TOP FLEUR (FR)",
                  damSireName: "MANSONNIEN (FR)",
                  age: 8,
                  color: "CHESTNUT",
                  sex: "GELDING",
                },
                details: {
                  jockeyName: "Fergus Gregory",
                  trainerName: "Mrs Pauline Harkin",
                  saddleCloth: "11",
                  weight: { stones: "11-2" },
                  equipmentDescription: null,
                  silk: "http://example.test.com/mockedImage/image.png",
                  draw: null,
                },
              },
            ],

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
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                medium: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Aintree",
            },
          },
        },
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.171344945",
              marketType: "WIN",
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1410",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.171344945/16257108/0",
                  name: "Shakalakaboomboom",
                  selectionId: 16257108,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.171344945/12804940/0",
                  name: "Top Garry",
                  selectionId: 12804940,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/12804940/0" },
            ],
          },
        },
        numberOfRunners: 14,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:marketExtended:1.179438989;924.253991161",
      },
    },
  ],
};

const BFF_SBK_VIEW_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  url: "horse-racing/leic-18th-feb/2m6f-nov-chs/rc-1.179438989",
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.253991161",
        cardTitle: "Win",
        marketsHierarchy: {
          race: {
            __typename: "Race",
            urn: "ppb:race:29901908.1410",
            runners: [
              {
                selectionId: 16257108,
                details: {
                  jockeyName: "John Velazquez",
                  trainerName: "Richard Hannon",
                  saddleCloth: 4,
                  silk: "http://example.test.com/mockedImage/image.png",
                  draw: 10,
                },
              },
              {
                selectionId: 12804940,
                horse: {
                  name: "TOP GARRY (FR)",
                  sireName: "BALLINGARRY (IRE)",
                  damName: "TOP FLEUR (FR)",
                  damSireName: "MANSONNIEN (FR)",
                  age: 8,
                  color: "CHESTNUT",
                  sex: "GELDING",
                },
                details: {
                  jockeyName: "Fergus Gregory",
                  trainerName: "Mrs Pauline Harkin",
                  saddleCloth: "11",
                  weight: { stones: "11-2" },
                  equipmentDescription: null,
                  silk: "http://example.test.com/mockedImage/image.png",
                  draw: null,
                },
              },
            ],

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
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                medium: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Aintree",
            },
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.234263186",
              name: "1m2f Nov Stks",
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
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/16257108",
                  name: "Shakalakaboomboom",
                  selectionId: 16257108,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/12804940",
                  name: "Top Garry",
                  selectionId: 12804940,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.234263186/16257108" },
              { runnerURN: "ppb:sbkRunner:924.234263186/12804940" },
            ],
          },
        },
        numberOfRunners: 14,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:marketExtended:1.179438989;924.253991161",
      },
    },
  ],
};

describe("Non Runners", () => {
  describe("Exchange", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_EXC_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getMarketLayout(BFF_EXC_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));

      await browser.url(routes.getMarketViewUrl(MARKET_ID));

      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: 1.1, isHorseRacing: true }),
      );
    });

    it("[PRPI-6221] The non-runner should be visible with 'Non Runner' label", async () => {
      expect(await excNonRunnerPO.title.getText()).toEqual("Non Runner");
    });

    it("[PRPI-6222] The date should be visible: '15:40 MAY 13'", async () => {
      expect(await excNonRunnerPO.date.getText()).toEqual("15:40 MAY 13");
    });

    it("[PRPI-6223] The reduction factor should be visible: '2.0% Reduction'", async () => {
      expect(await excNonRunnerPO.reduction.getText()).toEqual("2.0% REDUCTION");
    });
  });

  describe("Sportsbook", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_SBK_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getMarketLayout(BFF_SBK_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));

      await browser.url(routes.getMarketViewUrl(MARKET_ID));

      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({ market: marketCardPO.element, price: 1.2, isHorseRacing: true }),
      );
    });

    it("[PRPI-6224] The non-runner should be visible with 'Non Runner' label", async () => {
      expect(await sbkNonRunnerPO.title.getText()).toEqual("Non Runner");
    });
  });
});
