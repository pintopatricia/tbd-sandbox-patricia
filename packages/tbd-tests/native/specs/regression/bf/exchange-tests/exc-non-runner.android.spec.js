const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getConnectivityCheck } = require("@ppb/tbd-shared/mocks/connectivity-check/connectivity-check.controller");

const { NonRunnerSO, GenericScreenSO, ExchangeMarketSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const exchangeMarketSO = new ExchangeMarketSO();
const exchangeNonRunnerSO = new NonRunnerSO(exchangeMarketSO.runnerList[1]);
const MARKET_ID = "1.160337355";

const BFF_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  title: "Horse Racing",
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.177579912|6",
        cardTitle: "Each Way",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              marketType: "EACH_WAY",
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
              bettingType: "ODDS",
              eachWayDivisor: 5,
              numberOfWinners: 3,
              runners: [
                {
                  __typename: "Runner",
                  name: "Shakalakaboomboom",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  name: "Top Garry",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  selectionId: 48351,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0` },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.177579912|6",
      },
    },
  ],
};

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "48351",
        availableToBack: [],
        availableToLay: [],
        state: {
          adjustmentFactor: 2.0,
          sortPriority: 11,
          removalDate: "2021-11-13T14:40:00Z",
          status: "REMOVED",
        },
      },
    ],
  },
];

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

describe("Non-runners", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getConnectivityCheck({}));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(
      getMarketPositionViews({
        marketPositions: [],
      }),
    );
    const url = "horse-racing/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When the user is on a given screen and a marketcard is retrieved with pre-play EXC markets with 1 runner and 1 non-runner", () => {
    it("[PRPI-4247] The non-runner should be visible with 'Non Runner' label", async () => {
      expect(await exchangeNonRunnerSO.nonRunnerTitle.getText()).toEqual("Non Runner");
    });

    it("[PRPI-4248] The date should be visible: '14:40 NOV 13'", async () => {
      expect(await exchangeNonRunnerSO.nonRunnerDate.getText()).toEqual("14:40 NOV 13");
    });

    it("[PRPI-4249] The reduction factor should be visible: '2.0% REDUCTION'", async () => {
      expect(await exchangeNonRunnerSO.nonRunnerReduction.getText()).toEqual("2.0% REDUCTION");
    });
  });
});
