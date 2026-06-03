const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, GamesCardGroupSO, BottomBarSO, GameTileSO } = require("../../../../screen-objects");
const { startApp } = require("../../../utils/urls");

const MockService = require("../../../helpers/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const gamesCardGroupSO = new GamesCardGroupSO();
const firstGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[0]);
const secondGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[1]);
const thirdGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[2]);
const fourthGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[3]);

const RECTNTLY_PLAYED_SECTION_TITLE = "Recently played";
const FIRST_GAME_TITLE = "Age";
const SECOND_GAME_TITLE = "Dragon Wild Fire";
const THIRD_GAME_TITLE = "Roulette";
const FOURTH_GAME_TITLE = "Wild Wild Riches";

const DAILY_JACKPOT_LOGO = "DAILY_JACKPOT";
const JACKPOT_KING_LOGO = "JACKPOT_KING";

const BFF_GAMING_VIEW = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        cardGroupTitle: RECTNTLY_PLAYED_SECTION_TITLE,
        defaultLayout: "GRID_FOUR_COLUMNS",
        layouts: ["GRID_FOUR_COLUMNS"],
        viewAll: null,
        full: {
          edges: [
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
                    viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
                  },
                  name: FIRST_GAME_TITLE,
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: DAILY_JACKPOT_LOGO,
                  feedData: {
                    jackpot: 250472.64,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                  },
                  copyrightText: null,
                  customBackgroundColor: "#744943",
                  backgroundColor: null,
                  label: "JACKPOT",
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },

                  rtp: "95.15%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art",
                game: {
                  urn: "ppb:gaming:game:uid/dragons-fire-art",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:dragons-fire-art",
                    viewUrl: "casino/game/dragons-fire-art/game:dragons-fire-art",
                  },
                  name: SECOND_GAME_TITLE,
                  launchId: "BF_RT_DragonsFire",
                  rgsCodeMobile: "DragonsFire",
                  jackpotLogo: JACKPOT_KING_LOGO,
                  feedData: null,
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "saddlebrown - brown",
                  label: "EXCLUSIVE",
                  provider: {
                    name: "Gaming Platform - Red Tiger",
                    uid: "gp-rt",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Dragon's Fire ",
                    content: [],
                  },
                  rtp: "95.25%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/betfair-bonus-roulette-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:betfair-bonus-roulette-cptn",
                    viewUrl: "casino/game/betfair-bonus-roulette-cptn/game:betfair-bonus-roulette-cptn",
                  },
                  name: THIRD_GAME_TITLE,
                  launchId: "betfair-bonus-roulette-cptn",
                  rgsCodeMobile: "bfro",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: null,
                    availableSeats: 0,
                    lastNumbers: null,
                    physicalTableId: "103131",
                  },
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "brown - brown",
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Betfair Bonus Roulette",
                    content: [
                      {
                        type: "paragraph",
                        text: "",
                        spans: [],
                      },
                    ],
                  },
                  rtp: "98.30%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/wild-wild-riches-apr",
                game: {
                  urn: "ppb:gaming:game:uid/wild-wild-riches-apr",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:wild-wild-riches-apr",
                    viewUrl: "casino/game/wild-wild-riches-apr/game:wild-wild-riches-apr",
                  },
                  name: FOURTH_GAME_TITLE,
                  launchId: "wild-wild-riches-apr",
                  rgsCodeMobile: "vs576treasures",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: null,
                    availableSeats: null,
                    lastNumbers: [
                      {
                        number: 1,
                        color: "red",
                      },
                      {
                        number: 2,
                        color: "black",
                      },
                      {
                        number: 0,
                        color: "green",
                      },
                      {
                        number: 35,
                        color: "black",
                      },
                      {
                        number: 36,
                        color: "red",
                      },
                      {
                        number: 30,
                        color: "red",
                      },
                      {
                        number: 28,
                        color: "black",
                      },
                      {
                        number: 29,
                        color: "black",
                      },
                    ],

                    physicalTableId: "1386",
                  },
                  copyrightText: null,
                  customBackgroundColor: "#1b7e0f",
                  backgroundColor: null,
                  label: null,
                  provider: {
                    name: "Gaming Platform - Pragmatic",
                    uid: "gp-pr",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com/b41c8668-c52e-4369-b836-4329af8b69b6_DESIGNS-72759_BF-ArcadeBingo_Wild_Wild_Riches_flat.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com/b41c8668-c52e-4369-b836-4329af8b69b6_DESIGNS-72759_BF-ArcadeBingo_Wild_Wild_Riches_flat.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Wild Wild Riches",
                    content: [],
                  },
                  rtp: "96.77%",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn" },
            },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/wild-wild-riches-apr" } },
          ],
        },
      },
    },
  ],
};

const BFF_GAMING_VIEW_WITH_EMPTY_RECENTLY_PLAYED = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        cardGroupTitle: RECTNTLY_PLAYED_SECTION_TITLE,
        defaultLayout: "GRID_FOUR_COLUMNS",
        layouts: ["GRID_FOUR_COLUMNS"],
        viewAll: null,
        full: {
          edges: [],
        },
        partials: {
          edges: [],
        },
      },
    },
  ],
};

const BFF_GAMING_VIEW_WITH_ONE_GAME_IN_RECENTLY_PLAYED = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        cardGroupTitle: RECTNTLY_PLAYED_SECTION_TITLE,
        defaultLayout: "GRID_FOUR_COLUMNS",
        layouts: ["GRID_FOUR_COLUMNS"],
        viewAll: null,
        full: {
          edges: [
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
                    viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
                  },
                  name: FIRST_GAME_TITLE,
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: 250472.64,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                  },
                  copyrightText: null,
                  customBackgroundColor: "#744943",
                  backgroundColor: null,
                  label: "JACKPOT",
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },

                  rtp: "95.15%",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn" },
            },
          ],
        },
      },
    },
  ],
};

describe("Recently played section", () => {
  describe("When user opens tab with Recently Played section", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW));
      await startApp("home");

      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2764] \u200BRecently played section is displayed with title 'Recently played'", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.getText()).toEqual(RECTNTLY_PLAYED_SECTION_TITLE);
    });

    it("[PRPI-2765] Should contain 4 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(4);
    });

    it("[PRPI-2766] The cards titles should be 'Age', 'Dragon Wild Fire', 'Roulette', 'Wild Wild Riches'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SECOND_GAME_TITLE);
      expect(await thirdGameTileSO.gameTileTitle.getText()).toEqual(THIRD_GAME_TITLE);
      expect(await fourthGameTileSO.gameTileTitle.getText()).toEqual(FOURTH_GAME_TITLE);
    });

    it("[PRPI-2767] Only the first card should have Jackpot badge", async () => {
      expect(await firstGameTileSO.roundedGameTileBadgeLabel.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.roundedGameTileBadgeLabel.isDisplayed()).toBe(false);
      expect(await thirdGameTileSO.roundedGameTileBadgeLabel.isDisplayed()).toBe(false);
      expect(await fourthGameTileSO.roundedGameTileBadgeLabel.isDisplayed()).toBe(false);
    });

    it("[PRPI-2768] The first and the second cards should have Jackpot logo", async () => {
      expect(await firstGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await thirdGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
      expect(await fourthGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
    });
  });

  describe("When user, who has played one game, opens tab with Recently played section", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_WITH_ONE_GAME_IN_RECENTLY_PLAYED));
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2769] \u200BRecently played section is displayed with title 'Recently played'", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.getText()).toEqual(RECTNTLY_PLAYED_SECTION_TITLE);
    });

    it("[PRPI-2770] Should contain 1 game", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(1);
    });

    it("[PRPI-2771] The card title should be 'Age'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
    });

    it("[PRPI-2772] The card should have Jackpot badge", async () => {
      expect(await firstGameTileSO.roundedGameTileBadgeLabel.isDisplayed()).toBe(true);
    });
  });

  describe("When a new user, who has not played any games, opens tab with Recently played section", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_WITH_EMPTY_RECENTLY_PLAYED));
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-2773] \u200BRecently played section should not be displayed", async () => {
      expect(await gamesCardGroupSO.element.isDisplayed()).toBe(false);
    });
  });
});
