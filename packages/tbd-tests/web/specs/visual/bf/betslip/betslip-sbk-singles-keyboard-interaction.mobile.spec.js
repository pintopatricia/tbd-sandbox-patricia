const {
  AppPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  CardPO,
  RunnerPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const sportPage = new SportPagePO();
const raceMarketCardPO = new RaceMarketCardPO(sportPage.scrollableSwimlanes[0]);
const firstRaceCardPO = new CardPO(raceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const firstSportsbookBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);
const placePanelPO = new SportsbookPlacePanelPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const BFF_MOCK = {
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

const SIB_MOCK = {
  betCombinations: [
    {
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

      betMinStake: 0.12,
      betMaxStake: 1000,
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
      availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
      betType: "SINGLE",
    },
  ],

  runnerOdds: [
    {
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
      availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
    },
  ],
};

const MODULE_NAME = "betslip_sbk";

describe("SBK Keyboard Interactions - Singles", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { products: ["sportsbook"] }));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
    await firstSportsbookBetButtonPO.element.waitForClickable();
    await firstSportsbookBetButtonPO.element.click();
    await browser.waitUntilDisplayed(placePanelPO.element, "Singles betslip not displayed");
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1270]_should_render_sportsbook_betslip_single_with_keyboard_visible_and_each_way_and_sp_options`,
    );
  });

  it("[PRPI-1270]_should_render_sportsbook_betslip_single_with_keyboard_visible_and_each_way_and_sp_options", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-1270]_should_render_sportsbook_betslip_single_with_keyboard_visible_and_each_way_and_sp_options`,
      ),
    ).toEqual(0);
  });
});
