const SportsbookExpandableLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native.so");
const SportsbookBetLegCardGroupSO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native.so");

const {
  getAppContext,
  getMyBetsLayout,
  getNotFoundLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  BottomBarSO,
  CardSO,
  BetSelectionDetailsSO,
  AvBFixtureSO,
  EmptyStateSO,
  EventHeaderSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const cardSO = new CardSO();
const emptyStateSO = new EmptyStateSO();

const sportsbookExpandableLegCardGroupSO = new SportsbookExpandableLegCardGroupSO();
const firstSportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupSO(sportsbookExpandableLegCardGroupSO.cards[0]);

// 1st bet leg card group
const firstEventAvBFixtureSO = new AvBFixtureSO(firstSportsbookBetLegCardGroupSO.cards[1]);
const firstEventEventHeaderSO = new EventHeaderSO(firstSportsbookBetLegCardGroupSO.cards[1]);
const firstEventFirstBetSelectionDetailsSO = new BetSelectionDetailsSO(firstSportsbookBetLegCardGroupSO.cards[0]);

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
    isOpen: true,
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
    isOpen: true,
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

let firstLoad = true;

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  if (firstLoad) {
    firstLoad = false;
    await startApp("home");
  }

  await browser.waitUntilClickableNative(BottomBarSO.myBets);
  await BottomBarSO.myBets.click();

  await browser.waitUntilDisplayed(cardSO.element);
};

describe("My bets - SBK Navigation", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await mockService.mockHttpRequest(getNotFoundLayout(BFF_MOCK_NOT_FOUND));
  });

  describe("When the user have a single bet from a SCA sport available", () => {
    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK);
        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
      });

      it("[PRPI-3140] should display the Football fixture", async () => {
        expect(await firstEventAvBFixtureSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3141] should display the bet leg details", async () => {
        expect(await firstEventFirstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
      });

      describe("and then clicks on Football fixture", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstEventAvBFixtureSO.element);
          await firstEventAvBFixtureSO.element.click();
          await browser.waitUntilDisplayed(emptyStateSO.title);
        });

        // Reset back to My Bets with open card
        afterAll(async () => {
          await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK);
          await browser.waitUntilDisplayed(cardSO.contentWrapper);
        });

        it("[PRPI-3142] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStateSO.title.isDisplayed()).toBe(true);
        });
      });

      describe("and then clicks on the bet leg details", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstEventFirstBetSelectionDetailsSO.element);
          await firstEventFirstBetSelectionDetailsSO.element.click();
          await browser.waitUntilDisplayed(emptyStateSO.title);
        });

        it("[PRPI-3143] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStateSO.title.isDisplayed()).toBe(true);
        });
      });
    });
  });

  describe("When the user have a single bet from a NON-SCA sport available", () => {
    describe("and clicks to expand the card", () => {
      beforeAll(async () => {
        await browseToMyBets(SBK_SINGLE_SPECIAL);

        await browser.waitUntilClickableNative(cardSO.header);
        await cardSO.header.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);
      });

      it("[PRPI-3144] should display the Event Header", async () => {
        expect(await firstEventEventHeaderSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-3145] should display the bet leg details", async () => {
        expect(await firstEventFirstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
      });

      describe("and then clicks on the Event Header", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstEventEventHeaderSO.element);
          await firstEventEventHeaderSO.element.click();
        });

        it("[PRPI-3146] should not redirect the user to any page", async () => {
          expect(await firstEventFirstBetSelectionDetailsSO.element.isDisplayed()).toEqual(true);
        });
      });

      describe("and then clicks on the bet leg details", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstEventFirstBetSelectionDetailsSO.element);
          await firstEventFirstBetSelectionDetailsSO.element.click();
          await browser.waitUntilDisplayed(emptyStateSO.title);
        });

        it("[PRPI-3147] should redirect the user to the given ViewLink page", async () => {
          expect(await emptyStateSO.title.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
