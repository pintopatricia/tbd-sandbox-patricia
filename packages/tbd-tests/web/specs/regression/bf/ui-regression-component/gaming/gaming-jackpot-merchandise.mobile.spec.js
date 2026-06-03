const {
  GamingPagePO,
  ScrollableSwimlanePO,
  JackpotMerchandisePO,
  JackpotPO,
  GameTilePO,
} = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");

const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const gamingPagePO = new GamingPagePO();
const jackpotMerchandisingPO = new JackpotMerchandisePO();
const valueBasedJackpot = new JackpotPO(jackpotMerchandisingPO.jackpotItems[0]);
const progressiveJackpot = new JackpotPO(jackpotMerchandisingPO.jackpotItems[1]);
const timeBasedJackpot = new JackpotPO(jackpotMerchandisingPO.jackpotItems[2]);
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[0]);
const secondGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[1]);
const thirdGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[2]);
const fourthGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[3]);

const BFF_GAMING_JACKPOT_MODULE = {
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
                logo: "https://images.prismic.io/betfair-com-dev/29ddc91c-0d6e-4328-a5b4-8c6a8b1c27cc_BF_Daily_Jackpots.png?auto=compress,format&rect=0,0,438,334&w=189&h=144",
                jackpots: [
                  {
                    dropTime: "2021-01-04T13:11:15.283Z",
                    name: "Time Based Jackpot",
                    progress: 45,
                    state: "COLD",
                    urn: "ppb:gaming:jackpot:id/randomTimeBasedJackpotId",
                    value: 49298.33,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropText: "Can be won on any spin at any stake",
                    name: "Progressive Jackpot",
                    progress: 0,
                    state: "HOT",
                    urn: "ppb:gaming:jackpot:id/randomProgressiveJackpotId",
                    value: 1126562.78,
                    __typename: "GamingJackpot",
                  },
                  {
                    dropValue: 2000,
                    name: "Value Based Jackpot",
                    progress: 37,
                    state: "HOT",
                    urn: "ppb:gaming:jackpot:id/randomValueBasedJackpotId",
                    value: 750.26,
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

describe("Jackpot Merchandise - When user lands on gaming view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAMING_JACKPOT_MODULE.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
        pause: true,
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_JACKPOT_MODULE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(jackpotMerchandisingPO.logo);
    await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
    await browser.waitUntilDisplayed(valueBasedJackpot.title);
    await browser.waitUntilDisplayed(progressiveJackpot.title);
    await browser.waitUntilDisplayed(timeBasedJackpot.title);
  });

  it("[PRPI-5841] Then It should see the jackpot merchandising module displayed", async () => {
    expect(await jackpotMerchandisingPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5842] And it should see the JackpotZoneEligibleGames module displayed as a swimlane", async () => {
    expect(await scrollableSwimlanePO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5843] And jackpot background should be displayed", async () => {
    expect(await jackpotMerchandisingPO.background.isDisplayed()).toBe(true);
  });

  it("[PRPI-5844] And jackpot logo should be displayed", async () => {
    expect(await jackpotMerchandisingPO.logo.isDisplayed()).toBe(true);
  });

  it("[PRPI-5845] And there should be 3 jackpots displayed", async () => {
    expect(await jackpotMerchandisingPO.jackpotItems.length).toBe(3);
  });

  it("[PRPI-5846] And the first jackpot title should be: Value Based Jackpot", async () => {
    expect(await valueBasedJackpot.title.getText()).toBe("Value Based Jackpot");
  });

  it("[PRPI-5847] And the first jackpot badge label should be: $750.26 - 6 which is equal to: $744.26'", async () => {
    expect(await valueBasedJackpot.label.getText()).toBe("$744.26");
  });

  it("[PRPI-5848] And the first jackpot description should be: Must drop before $2,000", async () => {
    expect(await valueBasedJackpot.description.getText()).toBe("Must drop before $2,000");
  });

  it("[PRPI-5849] And the first jackpot should have the progress bar displayed", async () => {
    expect(await valueBasedJackpot.progressBar.isDisplayed()).toBe(true);
  });

  it("[PRPI-5850] And the second jackpot title should be: Progressive Jackpot", async () => {
    expect(await progressiveJackpot.title.getText()).toBe("Progressive Jackpot");
  });

  it("[PRPI-5851] And the second jackpot badge label should be: $1,126,562.78 - 6 which is equal to: $1,126,556.78", async () => {
    expect(await progressiveJackpot.label.getText()).toBe("$1,126,556.78");
  });

  it("[PRPI-5852] And the second jackpot description should be: Can be won on any spin at any stake", async () => {
    expect(await progressiveJackpot.description.getText()).toBe("Can be won on any spin at any stake");
  });

  it("[PRPI-5853] And the second jackpot should not have the progress bar displayed", async () => {
    expect(await progressiveJackpot.progressBar.isDisplayed()).toBe(false);
  });

  it("[PRPI-5854] And the third jackpot title should be: Time Based Jackpot", async () => {
    expect(await timeBasedJackpot.title.getText()).toBe("Time Based Jackpot");
  });

  it("[PRPI-5855] And the third jackpot badge label should be: $49,298.33 - 6 which is equal to: $49,292.33", async () => {
    expect(await timeBasedJackpot.label.getText()).toBe("$49,292.33");
  });

  it("[PRPI-5856] And the third jackpot description should be: Must drop by 13:11", async () => {
    expect(await timeBasedJackpot.description.getText()).toBe("Must drop by 13:11");
  });

  it("[PRPI-5857] And the third jackpot should have the progress bar displayed", async () => {
    expect(await timeBasedJackpot.progressBar.isDisplayed()).toBe(true);
  });

  it("[PRPI-5858] And I should see a total of 4 Game cards on the swimlane", async () => {
    expect(await scrollableSwimlanePO.gameTiles.length).toBe(4);
  });

  it("[PRPI-5859] And the category link button should be visible", async () => {
    expect(await gamingPagePO.categoryLinkButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5860] And it should have a text of: Random Category", async () => {
    expect(await gamingPagePO.categoryLinkButton.getText()).toBe("Random Category");
  });

  it("[PRPI-5861] And Game cards on the swimlane should contain favourite button", async () => {
    expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await thirdGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await fourthGameTile.getFavouriteButton.isDisplayed()).toBe(true);
  });
});
