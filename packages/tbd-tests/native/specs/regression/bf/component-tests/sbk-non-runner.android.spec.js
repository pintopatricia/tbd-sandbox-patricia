const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getConnectivityCheck } = require("@ppb/tbd-shared/mocks/connectivity-check/connectivity-check.controller");
const { HorseRacingRunnerSO, NonRunnerSO, SportsbookMarketSO, GenericScreenSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const sportsbookMarketSO = new SportsbookMarketSO();
const sportsbookNonRunnerSO = new NonRunnerSO(sportsbookMarketSO.horseRunnerList[1]);
const sportsbookRunnerSO = new HorseRacingRunnerSO(sportsbookMarketSO.horseRunnerList[0]);

const SPORTSBOOK_MARKET_ID = "924.222615412";
const EVENT_ID = "29682729";

const BFF_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  title: "Horse Racing",
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.177579912|6",
        cardTitle: "Each Fds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "HR",
                sportId: 7,
              },
              sportevent: {
                name: "Wolves v Man Utd",
                urn: `ppb:event:${EVENT_ID}`,
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
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  __typename: "Runner",
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351`,
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48351` },
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

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          runnerStatus: "REMOVED",
        },
      ],
    },
  ],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

describe("Non-runners", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getConnectivityCheck({}));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    const url = "horse-racing/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When the user is on a given screen and a marketcard is retrieved with pre-play SBK markets with 1 runner and 1 non-runner", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(sportsbookRunnerSO.runnerHorseName);
    });

    it("[PRPI-4256] The non-runner should be visible with 'Non Runner' label", async () => {
      expect(await sportsbookNonRunnerSO.nonRunnerTitle.getText()).toEqual("Non Runner");
    });
  });
});
