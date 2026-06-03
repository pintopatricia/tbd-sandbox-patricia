const ImsPromotionErrorCardPO = require("@ppb/tbd-shared/components/ImsPromotionErrorCard/ImsPromotionErrorCard.web.po");
const { ScrollableSwimlanePO, AlertPO, GameTilePO } = require("../../../../../page-objects");
const { getImsPromotionLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const scrollableSwimlanePO = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[0]);
const secondGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[1]);
const imsPromotionErrorCardPO = new ImsPromotionErrorCardPO();
const alertPO = new AlertPO(imsPromotionErrorCardPO.notification);

const mockService = new MockService();

const BFF_IMS_PROMO = {
  __typename: "ImsPromotionView",
  urn: "ppb:tbd:view:imsPromotion:gaming-promotion-1",
  url: "betting/casino/promotions/gaming-promotion-1/imsPromotion:gaming-promotion-1",
  edges: [
    {
      node: {
        __typename: "ImsPromotionErrorCard",
        urn: "ppb:tbd:card:imsPromotionError:gaming-promotion-1",
        errorCode: "ALREADY_COMPLETED",
        seeAll: {},
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:imsPromotionEligibleGames:gaming-promotion-1",
        cardGroupTitle: "Recommended Games",
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
          ],
        },
      },
    },
  ],
};

describe("When the user is on a Promo Error Message page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_IMS_PROMO.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getImsPromotionLayout(BFF_IMS_PROMO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getImsPromotionViewUrl("gaming-promotion-1"));
    await browser.waitUntilDisplayed(imsPromotionErrorCardPO.element);
  });

  it("[PRPI-5991] the promo error card should be displayed", async () => {
    expect(await imsPromotionErrorCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5992] the notification should be: Promotion Completed", async () => {
    expect(await alertPO.message.getText()).toBe("Promotion Completed");
  });

  it("[PRPI-5993] the promo error message should be displayed", async () => {
    expect(await imsPromotionErrorCardPO.text.getText()).toBe(
      "Not to worry, you can tap the button below to view all eligible promotions:",
    );
  });

  it("[PRPI-5994] the See All Our Promotions button should be displayed", async () => {
    expect(await imsPromotionErrorCardPO.button.getText()).toBe("See All Our Promotions");
  });

  it("[PRPI-5995] the card group should display 2 games", async () => {
    expect(await scrollableSwimlanePO.title.getText()).toBe("Recommended Games");
    expect(await scrollableSwimlanePO.gameTiles.length).toBe(2);
  });

  it("[PRPI-5996] And Game tiles on the swimlane should contain favourite button", async () => {
    expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(true);
  });
});
