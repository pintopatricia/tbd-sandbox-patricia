const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");

const routes = require("../../../../../utils/routes");

const MODULE_NAME = "gaming_jackpot_merchandise_";

const mockService = new MockService();

const BFF_GAMING_JACKPOT_MODULE_COLD_STATE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/jackpotMerchandisingZoneId",
        __typename: "ViewZone",
        title: "Jackpots Zone Title",
        viewZoneItems: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gaming:jackpot:id/randomJackpotId",
                __typename: "GamingJackpotCard",
                logo: "http://example.test.com/mockedImage/image.png",
                jackpots: [
                  {
                    dropText: "Can be won on any spin at any stake",
                    name: "Progressive Jackpot",
                    progress: 0,
                    state: "COLD",
                    urn: "ppb:gaming:jackpot:id/randomProgressiveJackpotId",
                    value: 1126562.78,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropTime: "2021-01-04T13:11:15.283Z",
                    name: "Time Based Jackpot",
                    progress: 0,
                    state: "COLD",
                    urn: "ppb:gaming:jackpot:id/randomTimeBasedJackpotId",
                    value: 49298.33,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropValue: 2000,
                    name: "Value Based Jackpot",
                    progress: 50,
                    state: "COLD",
                    urn: "ppb:gaming:jackpot:id/randomValueBasedJackpotId",
                    value: 1000,
                    __typename: "GamingJackpot",
                  },
                ],
              },
            },
            {
              node: {
                __typename: "GamingCardGroup",
                urn: "pb:tbd:card:group:gaming:jackpotZoneEligibleGames:id/jackpotZoneEligibleGamesZoneCode",
                cardGroupTitle: "Jackpots Eligible Games",
                defaultLayout: "CARD_LIST",
                layouts: ["CARD_LIST"],
                viewAll: {
                  label: "Random Category",
                  viewLink: {
                    viewUrl: routes.getGamingCategoryViewUrl("randomCategory"),
                    viewUrn: "ppb:tbd:view:gamingCategory:randomCategory",
                  },
                },
                full: {
                  edges: [
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-0",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Game 0",
                          __typename: "Game",
                          urn: "ppb:game:game-0",
                          backgroundColor: "#B22222",
                          flattened: {
                            small: {
                              url: "http://example.test.com/mockedImage/image.png",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-1",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Game 1",
                          __typename: "Game",
                          urn: "ppb:game:game-1",
                          backgroundColor: "#B22222",
                          flattened: {
                            small: {
                              url: "http://example.test.com/mockedImage/image.png",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-2",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Game 2",
                          __typename: "Game",
                          urn: "ppb:game:game-2",
                          backgroundColor: "#B22222",
                          flattened: {
                            small: {
                              url: "http://example.test.com/mockedImage/image.png",
                            },
                          },
                        },
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-3",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Game 3",
                          __typename: "Game",
                          urn: "ppb:game:game-3",
                          backgroundColor: "#B22222",
                          flattened: {
                            small: {
                              url: "http://example.test.com/mockedImage/image.png",
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                partials: {
                  edges: [
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-0",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-1",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-2",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-3",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-4",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-5",
                        __typename: "GameCard",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-6",
                        __typename: "GameCard",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
};

const BFF_GAMING_JACKPOT_MODULE_HOT_STATE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/jackpotMerchandisingZoneId",
        __typename: "ViewZone",
        title: "Jackpots Zone Title",
        viewZoneItems: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gaming:jackpot:id/randomJackpotId",
                __typename: "GamingJackpotCard",
                logo: "http://example.test.com/mockedImage/image.png",
                jackpots: [
                  {
                    dropText: "Can be won on any spin",
                    name: "Progressive Jackpot",
                    progress: 0,
                    state: "COLD",
                    urn: "ppb:gaming:jackpot:id/randomProgressiveJackpotId",
                    value: 1126562.78,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropTime: "2021-01-04T13:11:15.283Z",
                    name: "Time Based Jackpot",
                    progress: 99,
                    state: "HOT",
                    urn: "ppb:gaming:jackpot:id/randomTimeBasedJackpotId",
                    value: 8999,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropValue: 2000,
                    name: "Value Based Jackpot",
                    progress: 10,
                    state: "HOT",
                    urn: "ppb:gaming:jackpot:id/randomValueBasedJackpotId",
                    value: 200.26,
                    __typename: "GamingJackpot",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ],
};

describe("When the user lands on gaming view with Jackpot Merchandise Module Available in Cold and Jackpot Eligible Games are available", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAMING_JACKPOT_MODULE_COLD_STATE.urn, { pause: true, disableCSSAnimations: true }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_JACKPOT_MODULE_COLD_STATE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}[PRPI-1325]_should_display_the_jackpot_merchandise_module_in_cold_state_with_jackpot_eligible_games`,
    );
  });

  it("[PRPI-1325]_should_display_the_jackpot_merchandise_module_in_cold_state_with_jackpot_eligible_games", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}[PRPI-1325]_should_display_the_jackpot_merchandise_module_in_cold_state_with_jackpot_eligible_games`,
      ),
    ).toEqual(0);
  });

  describe("When the user lands on gaming view with Jackpot Merchandise Module in hot state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_GAMING_JACKPOT_MODULE_HOT_STATE.urn, { pause: true, disableCSSAnimations: true }),
      );
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_JACKPOT_MODULE_HOT_STATE));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.flushFakeClockTimers();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}[PRPI-1326]_should_display_the_jackpot_merchandise_module_in_hot_state`,
      );
    });

    it("[PRPI-1326]_should_display_the_jackpot_merchandise_module_in_hot_state", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}[PRPI-1326]_should_display_the_jackpot_merchandise_module_in_hot_state`,
        ),
      ).toEqual(0);
    });
  });
});
