const GameCardSO = require("@ppb/tbd-shared/components/GameCard/GameCard.native.so");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const MockService = require("../../../helpers/mocking-service");
const { swipeLeftElement } = require("../../../utils/gestures");
const { startApp } = require("../../../utils/urls");

const { BottomBarSO, GenericScreenSO, ScrollableSwimlaneSO, GameTileSO } = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const gameCardSO = new GameCardSO(scrollableSwimlaneSO);
const firstGameCardSO = gameCardSO.gameCardsList[0];
const secondGameCardSO = gameCardSO.gameCardsList[1];
const thirdGameCardSO = gameCardSO.gameCardsList[2];
const firstGameTileSO = new GameTileSO(firstGameCardSO.element);
const secondGameTileSO = new GameTileSO(secondGameCardSO.element);
const thirdGameTileSO = new GameTileSO(thirdGameCardSO.element);

const SECTION_TITLE = "Live Casino";
const FIRST_GAME_TITLE = "Deal or No Deal: Box Scratchcard";
const FIRST_GAME_BADGE_JACKPOT = 250472.64;
const FIRST_GAME_COPYRIGHT_TEXT =
  "THUNDERCATS and all related characters and elements are trademarks of Warner Bros. Entertainment Inc. and © of Warner Bros. Entertainment Inc. and Ted Wolf. (s18)";
const SECOND_GAME_TITLE = "DragonFire";
const SECOND_GAME_BADGE_REGULAR = "EXCLUSIVE";
const THIRD_GAME_TITLE = "Roulette";
const THIRD_GAME_BADGE_SEATS = 1;
const THIRD_GAME_BADGE = `${THIRD_GAME_BADGE_SEATS} SEAT AVAILABLE`;
const DAILY_JACKPOT_LOGO = "DAILY_JACKPOT";

const BFF_GAMING_VIEW_SWIMLANE_WITH_3_GAMES = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        cardGroupTitle: SECTION_TITLE,
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
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
                    jackpot: FIRST_GAME_BADGE_JACKPOT,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                  },
                  copyrightText: FIRST_GAME_COPYRIGHT_TEXT,
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
                      url: "http://example.test.com/mockedImage/image.png",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "http://example.test.com/mockedImage/image.png",
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
                  jackpotLogo: null,
                  feedData: null,
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "saddlebrown - brown",
                  label: SECOND_GAME_BADGE_REGULAR,
                  provider: {
                    name: "Gaming Platform - Red Tiger",
                    uid: "gp-rt",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "http://example.test.com/mockedImage/image.png",
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
                    availableSeats: THIRD_GAME_BADGE_SEATS,
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
                      url: "http://example.test.com/mockedImage/image.png",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "http://example.test.com/mockedImage/image.png",
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
          ],
        },
        partials: {
          edges: [
            {
              node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn" },
            },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn" } },
          ],
        },
      },
    },
  ],
};

describe("Game tiles in swimlane", () => {
  describe("When user opens tab with swimlane with 3 games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_SWIMLANE_WITH_3_GAMES));
      await startApp("home");

      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileTitle);
    });

    it("[PRPI-2797] The swimlane should have title 'Live Casino'", async () => {
      expect(await scrollableSwimlaneSO.title.getText()).toEqual(SECTION_TITLE);
    });

    it("[PRPI-2798] The swimlane should display 2 games", async () => {
      expect(await scrollableSwimlaneSO.gameCardsList.length).toBe(2);
    });

    it("[PRPI-2799] The games should be in the next order 'Deal or No Deal: Box Scratchcard', 'DragonFire'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SECOND_GAME_TITLE);
    });

    it("[PRPI-2800] The first game should have Jackpot badge", async () => {
      const firstGameTileBadge = firstGameTileSO.gameTileBadgeText;
      const firstGameTileBadgeText = await firstGameTileBadge.getText();

      expect(await firstGameTileBadge.isDisplayed()).toBe(true);
      expect(firstGameTileBadgeText.substring(1).replace(",", "")).toBeGreaterThanOrEqual(FIRST_GAME_BADGE_JACKPOT);
    });

    it("[PRPI-2801] The first game should have copyright text", async () => {
      expect(await firstGameTileSO.gameTileCopyright.isDisplayed()).toBe(true);
      expect(await firstGameTileSO.gameTileCopyright.getText()).toEqual(FIRST_GAME_COPYRIGHT_TEXT);
    });

    it("[PRPI-2802] The first game should have Jackpot logo", async () => {
      expect(await firstGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-2803] The second game should have 'Exclusive' badge", async () => {
      expect(await secondGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileBadgeText.getText()).toEqual(SECOND_GAME_BADGE_REGULAR);
    });

    describe("When user swipes swimlane left", () => {
      beforeAll(async () => {
        await swipeLeftElement(secondGameTileSO.element, 600);
        await browser.waitUntilDisplayed(thirdGameTileSO.gameTileTitle);
      });

      it("[PRPI-2804] The swimlane should display 3 games", async () => {
        expect(await scrollableSwimlaneSO.gameCardsList.length).toBe(3);
      });

      it("[PRPI-2805] The third game should be 'Roulette'", async () => {
        expect(await thirdGameTileSO.gameTileTitle.getText()).toEqual(THIRD_GAME_TITLE);
      });

      it("[PRPI-2806] The third card should have '1 SEAT AVAILABLE' badge", async () => {
        expect(await thirdGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
        expect(await thirdGameTileSO.gameTileBadgeText.getText()).toEqual(THIRD_GAME_BADGE);
      });
    });
  });
});
