const { GamingPagePO, GameTilePO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const gamingPagePO = new GamingPagePO();
const firstGameTilePO = new GameTilePO(gamingPagePO.gameTiles[0]);
const secondGameTilePO = new GameTilePO(gamingPagePO.gameTiles[1]);
const thirdGameTilePO = new GameTilePO(gamingPagePO.gameTiles[2]);
const fourthGameTilePO = new GameTilePO(gamingPagePO.gameTiles[3]);

const mockService = new MockService();

const BFF_CURATED_GAMES_GRID_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:group:curatedGames:curatedGamesZoneCode",
        __typename: "GamingCardGroup",
        cardGroupTitle: "Curated Games Grid",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
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
                  name: "First Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  backgroundColor: "#B22222",
                  copyrightText: "Game Tile Copyright Text",
                  label: "NEW",
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Second Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  backgroundColor: "#B22222",
                  feedData: {
                    lastNumbers: [
                      { color: "red", number: "14" },
                      { color: "green", number: "0" },
                      { color: "black", number: "13" },
                      { color: "black", number: "23" },
                      { color: "red", number: "3" },
                      { color: "black", number: "11" },
                      { color: "black", number: "10" },
                      { color: "black", number: "8" },
                    ],
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
                  name: "Third Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  backgroundColor: "#B22222",
                  feedData: {
                    availableSeats: "8",
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
                  name: "Fourth Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
                  backgroundColor: "#B22222",
                  label: "JACKPOT",
                  feedData: {
                    jackpot: 1000000,
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { urn: "ppb:tbd:card:game:game-0", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-2", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-3", __typename: "GameCard" } },
          ],
        },
      },
    },
  ],
};

describe("Curated Grid - When user lands on gaming view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_CURATED_GAMES_GRID_MOCK.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
        pause: true,
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_CURATED_GAMES_GRID_MOCK));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(gamingPagePO.element);
    await browser.waitUntilEquals(gamingPagePO.title, "Curated Games Grid");
  });

  it("[PRPI-5818] Then the gaming page container should be displayed", async () => {
    expect(await gamingPagePO.gamingPageContainer.isDisplayed()).toBe(true);
  });

  it("[PRPI-5819] And the games grid should be displayed", async () => {
    expect(await gamingPagePO.gamesGrid.isDisplayed()).toBe(true);
  });

  it("[PRPI-5820] And the title of the grid should be: Curated Games Grid", async () => {
    expect(await gamingPagePO.title.getText()).toBe("Curated Games Grid");
  });

  it("[PRPI-5821] And there should be 4 game containers displayed", async () => {
    expect(await gamingPagePO.gameContainers.length).toBe(4);
  });

  it("[PRPI-5822] And there should be 4 game tiles displayed", async () => {
    expect(await gamingPagePO.gameTiles.length).toBe(4);
  });

  it("[PRPI-5823] And the first game tile should have a title of: First Game Tile", async () => {
    expect(await firstGameTilePO.gameTitle.getText()).toBe("First Game Tile");
  });

  it("[PRPI-5824] And it should have favourite button", async () => {
    expect(await firstGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5825] And it should have a copyright text: Game Tile Copyright Text", async () => {
    expect(await firstGameTilePO.gameCopyright.getText()).toBe("Game Tile Copyright Text");
  });

  it("[PRPI-5826] And it should have a badge with the text: NEW", async () => {
    expect(await firstGameTilePO.badge.getText()).toBe("NEW");
  });

  it("[PRPI-5827] And it should have a visible game info button", async () => {
    expect(await firstGameTilePO.gameInfoButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5828] And the second game tile should have a visible badge", async () => {
    expect(await secondGameTilePO.badge.isDisplayed()).toBe(true);
  });

  it("[PRPI-8363] And second game should have favourite button", async () => {
    expect(await secondGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5829] And the badge should contain the 'rouletteNumbers' class", async () => {
    expect(await browser.containsClass(secondGameTilePO.badge, GameTilePO.states.rouletteNumbers)).toBe(true);
  });

  it("[PRPI-5830] And it should contain 8 numbers", async () => {
    expect(await secondGameTilePO.badgeRouletteNumbers.length).toEqual(8);
  });

  it("[PRPI-5831] And the first number should be 14 and the last number should be 8", async () => {
    expect(await secondGameTilePO.badgeRouletteNumbers[0].getText()).toBe("14");
    expect(await secondGameTilePO.badgeRouletteNumbers[7].getText()).toBe("8");
  });

  it("[PRPI-5832] And the third game tile should have a visible badge", async () => {
    expect(await thirdGameTilePO.badge.isDisplayed()).toBe(true);
  });

  it("[PRPI-8364] And third game should have favourite button", async () => {
    expect(await thirdGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5833] And it should contain the 'seatsAvailable' class", async () => {
    expect(await browser.containsClass(thirdGameTilePO.badge, GameTilePO.states.seatsAvailable)).toBe(true);
  });

  it("[PRPI-5834] And the text should be 8 SEATS AVAILABLE", async () => {
    expect(await thirdGameTilePO.badge.getText()).toBe("8 SEATS AVAILABLE");
  });

  it("[PRPI-5835] And the fourth game tile should have a visible badge", async () => {
    expect(await fourthGameTilePO.badge.isDisplayed()).toBe(true);
  });

  it("[PRPI-8365] And fourth game should have favourite button", async () => {
    expect(await fourthGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5836] And it should contain the 'jackpot' class", async () => {
    expect(await browser.containsClass(fourthGameTilePO.badge, GameTilePO.states.jackpot)).toBe(true);
  });

  it("[PRPI-5837] And the value should be displayed", async () => {
    expect(await fourthGameTilePO.badge.getText()).toBe("$1,000,000.00");
  });

  it("[PRPI-5838] And the category link button should be visible", async () => {
    expect(await gamingPagePO.categoryLinkButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-5839] And it should have a text of: See All", async () => {
    expect(await gamingPagePO.categoryLinkButton.getText()).toBe("See All");
  });

  it("[PRPI-5840] And the user should be able to click it", async () => {
    expect(await gamingPagePO.categoryLinkButton.isClickable()).toBe(true);
  });
});
