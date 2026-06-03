const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");

const { getMyBetsLayout, getNotFoundLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");

const {
  CardPO,
  BetSelectionDetailsPO,
  AvBFixturePO,
  EmptyStatePO,
  EventHeaderPO,
} = require("../../../../../../page-objects");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();

const cardPO = new CardPO();
const emptyStatePO = new EmptyStatePO();

const sportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO();
const firstSportsbookBetLegCardGroupPO = new SportsbookBetLegCardGroupPO(sportsbookExpandableLegCardGroupPO.cards[0]);

// 1st bet leg card group
const firstEventFirstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardGroupPO.cards[0]);
const firstEventEventHeaderPO = new EventHeaderPO(firstSportsbookBetLegCardGroupPO.cards[1]);
const firstEventAvBFixturePO = new AvBFixturePO(firstSportsbookBetLegCardGroupPO.cards[1]);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const NOT_FOUND_VIEW_LINK = {
  viewUrn: "ppb:tbd:view:notfound:notfound",
  viewUrl: "notfound/404-notfound",
};

const SBK_SINGLE_FOOTBALL_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    betId: "2222222",
    currentSize: 0.1,
    profitAndLoss: 0.17,
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.333333333",
        ...NOT_FOUND_VIEW_LINK,
      },
    ],

    edges: {
      legCardGroups: [
        {
          legs: [
            {
              type: "SS",
              parts: [
                {
                  price: buildPrice(1.65),
                  originalPrice: buildPrice(1.65),
                  priceType: "LIVE",
                  eventDescription: "Man Utd v Chelsea",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Man Utd",
                  startTime: "2023-05-25T19:00:00.000Z",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Man Utd",
            awayName: "Chelsea",
            scheduledAt: "2023-05-25T19:00:00.000Z",
            fixtureEventViewLink: NOT_FOUND_VIEW_LINK,
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const SBK_SINGLE_SPECIAL = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    betId: "3333333",
    currentSize: 0.11,
    profitAndLoss: 0.15,
    originalPotentialWin: 0.14,
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.333333333",
        ...NOT_FOUND_VIEW_LINK,
      },
    ],

    edges: {
      legCardGroups: [
        {
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.4),
                  originalPrice: buildPrice(1.4),
                },
              ],
            },
          ],

          eventHeader: {
            title: "Cheltenham Antepost Doubles",
            tertiaryTitle: "#WhatOddsPaddy",
            date: "2023-04-15T15:50:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-03-13T11:13:24.000Z",
      },
    },
  },
]);

const BFF_MOCK_NOT_FOUND = {
  urn: "ppb:tbd:view:notfound:notfound",
  url: "notfound/notfound/404-notfound",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            title: "title",
            items: [
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
                timeFormat: "HH:mm",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, { products: ["sportsbook"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My bets - SBK Navigation", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["sportsbook"] }));
    await mockService.mockHttpRequest(getNotFoundLayout(BFF_MOCK_NOT_FOUND));
    await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK, true);
  });

  describe("When the user have a single bet from a SCA sport available", () => {
    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(firstEventAvBFixturePO.element);
        await browser.waitUntilDisplayed(firstEventFirstBetSelectionDetailsPO.element);
      });

      it("[PRPI-8274] should display the Football fixture", async () => {
        expect(await firstEventAvBFixturePO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8275] should display the bet leg details", async () => {
        expect(await firstEventFirstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
      });

      describe("and then clicks on Football fixture", () => {
        beforeAll(async () => {
          await firstEventAvBFixturePO.element.waitForClickable();
          await firstEventAvBFixturePO.element.click();
          await browser.waitUntilDisplayed(emptyStatePO.title);
        });

        // Reset back to My Bets with open card
        afterAll(async () => {
          await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK);
          await cardPO.header.waitForClickable();
          await cardPO.header.click();
          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstEventFirstBetSelectionDetailsPO.element);
        });

        it("[PRPI-8276] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStatePO.title.isDisplayed()).toBe(true);
        });
      });

      describe("and then clicks on the bet leg details", () => {
        beforeAll(async () => {
          await firstEventFirstBetSelectionDetailsPO.element.waitForClickable();
          await firstEventFirstBetSelectionDetailsPO.element.click();
          await browser.waitUntilDisplayed(emptyStatePO.title);
        });

        it("[PRPI-8277] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStatePO.title.isDisplayed()).toBe(true);
        });
      });
    });
  });

  describe("When the user have a single bet from a NON-SCA sport available", () => {
    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browseToMyBets(SBK_SINGLE_SPECIAL);

        await cardPO.header.waitForClickable();
        await cardPO.header.click();
        await browser.waitUntilDisplayed(cardPO.content);
        await browser.waitUntilDisplayed(firstEventEventHeaderPO.element);
      });

      it("[PRPI-8278] should display the Event Header", async () => {
        expect(await firstEventEventHeaderPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8279] should display the bet leg details", async () => {
        expect(await firstEventFirstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
      });

      describe("and then clicks on the Event Header", () => {
        beforeAll(async () => {
          await firstEventEventHeaderPO.element.waitForClickable();
          await firstEventEventHeaderPO.element.click();
        });

        it("[PRPI-8280] should not redirect the user to any page", async () => {
          expect(await firstEventFirstBetSelectionDetailsPO.element.isDisplayed()).toEqual(true);
        });
      });

      describe("and then clicks on the bet leg details", () => {
        beforeAll(async () => {
          await firstEventFirstBetSelectionDetailsPO.element.waitForClickable();
          await firstEventFirstBetSelectionDetailsPO.element.click();
          await browser.flushFakeClockTimers();
          await browser.waitUntilDisplayed(emptyStatePO.title);
        });

        it("[PRPI-8281] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStatePO.title.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
