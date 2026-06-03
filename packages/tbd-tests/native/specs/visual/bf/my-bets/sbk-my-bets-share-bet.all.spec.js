const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  getAppContext,
  getMyBetsLayout,
  getGenericLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const {
  SportsbookBetPanelSO,
  BottomBarSO,
  MyBetsScreenSO,
  ShareSO,
  BottomSheetSO,
  SupportingContentButtonSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const myBetsScreenSO = new MyBetsScreenSO();
const shareSO = new ShareSO();
const bottomSheetSO = new BottomSheetSO();
const sportsbookBetPanelSO = new SportsbookBetPanelSO();
const shareButtonSO = new SupportingContentButtonSO(sportsbookBetPanelSO.buttons[0]);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const CARD_NAME = "my_bets_page";
const BET_ID = "32483331";

const BET_MOCK_SKELETON = {
  betType: "SGL",
  isOpen: true,
  product: "SPORTSBOOK",
  currentSize: 0.1,
  betSharingViewLink: {
    viewUrn: `ppb:tbd:view:generic:betSharing:${BET_ID}`,
  },
  lowestEventStartTime: "2023-05-25T19:00:00.000Z",
  profitAndLoss: 0.17,
  navigationLinks: {
    upperLevel: [
      {
        marketBetUrn: "ppb:marketBet:924.333333333",
      },
    ],

    innerLevel: {
      marketBetUrn: "ppb:marketBet:924.333333333",
    },
  },
  edges: {
    legCardGroups: [
      {
        legs: [
          {
            type: "SS",
            parts: [
              {
                price: buildPrice(1.65),
                sportId: "1",
                originalPrice: buildPrice(1.65),
                priceType: "LIVE",
                eventUrn: "ppb:event:32483335",
                eventDescription: "Man Utd v Chelsea",
                eventMarketDescription: "To Score Or To Be Shown A Card",
                selectionName: "Bruno Fernandes",
                startTime: "2023-05-25T19:00:00.000Z",
                competitionName: "English Premier League",
              },
            ],
          },
          {
            type: "SS",
            parts: [
              {
                price: buildPrice(1.25),
                sportId: "1",
                originalPrice: buildPrice(1.25),
                priceType: "LIVE",
                eventUrn: "ppb:event:32483335",
                eventDescription: "Man Utd v Chelsea",
                eventMarketDescription: "To Score",
                selectionName: "Bruno Fernandes",
                startTime: "2023-05-25T19:00:00.000Z",
                competitionName: "English Premier League",
              },
            ],
          },
        ],

        footballFixture: {
          homeName: "Man Utd",
          awayName: "Chelsea",
          scheduledAt: "2023-05-25T19:00:00.000Z",
          eventId: "32483335",
        },
      },
    ],
  },
};

const SBK_SINGLE_OVER_UNDER_MOCK = {
  ...BET_MOCK_SKELETON,
  betId: BET_ID,
  edges: {
    legCardGroups: [
      {
        ...BET_MOCK_SKELETON.edges.legCardGroups[0],
        legs: [
          {
            ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0],
            parts: [
              {
                ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0].parts[0],
                eventMarketDescription: "Over/Under Total Goals 3.5",
                selectionName: "Man Utd",
                outcomeDefinitionExp: {
                  operands: [
                    {
                      outcomeDefinition: {
                        query: {
                          sport: "football",
                          periodDefinition: {
                            period: "REGULAR",
                            periodStatus: "INPLAY_FIRST_HALF",
                          },
                          outcome: "goals",
                          participant: {
                            type: "TEAM",
                            side: "HOME",
                          },
                        },
                        statsThresholdDef: {
                          threshold: 4,
                          comparison: "LESS_THAN",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          {
            ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[1],
            parts: [
              {
                ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0].parts[0],
                eventMarketDescription: "Over/Under Total Goals 4.5",
                selectionName: "Man Utd",
                outcomeDefinitionExp: {
                  operands: [
                    {
                      outcomeDefinition: {
                        query: {
                          sport: "football",
                          periodDefinition: {
                            period: "REGULAR",
                            periodStatus: "INPLAY_FIRST_HALF",
                          },
                          outcome: "goals",
                          participant: {
                            type: "TEAM",
                            side: "HOME",
                          },
                        },
                        statsThresholdDef: {
                          threshold: 5,
                          comparison: "LESS_THAN",
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

const MY_BETS_VIEW_MOCK = getMyBetsSBKViewMock([SBK_SINGLE_OVER_UNDER_MOCK], {
  hasBottomBar: true,
});

const BET_SHARING_GENERIC_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:generic:betSharing:${BET_ID}`,
  url: `view/d-${BET_ID}`,
  category: "MODAL",
  viewHeader: {
    title: null,
  },
  edges: [
    {
      node: {
        __typename: "BetSharingCardGroup",
        urn: `ppb:tbd:cardgroup:betSharing:${BET_ID}`,
        bet: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[0].node.bet,
        full: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[1].node.full,
        partials: MY_BETS_VIEW_MOCK.edges[0].node.full.edges[1].node.partials,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "BetSharingCardGroup",
        urn: `ppb:tbd:cardgroup:betSharing:${BET_ID}`,
      },
    },
  ],
};

describe("My bets - Share Bet", () => {
  describe("When a bet has the Share button available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getAppContext({
          products: ["SPORTSBOOK"],
          throttles: {
            MY_BETS_WIN_LOSE_VOID: {
              isActive: true,
            },
          },
        }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(MY_BETS_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getGenericLayout(BET_SHARING_GENERIC_VIEW_MOCK));

      await startApp("home");

      await browser.waitUntilClickableNative(BottomBarSO.myBets);
      await BottomBarSO.myBets.click();

      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");
    });

    describe("And the user presses the Share button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(shareButtonSO.element);
        await shareButtonSO.element.click();
        await browser.waitUntilDisplayed(shareSO.element, "Share element not displayed");
      });

      it("[PRPI-4498]_sharing_component_with_multiple_legs", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4498]_sharing_component_with_multiple_legs`))
            .misMatchPercentage,
        ).toEqual(0);
      });

      describe("And when the user presses the Close button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(bottomSheetSO.headerButton);
          await bottomSheetSO.headerButton.click();
          await browser.waitUntilNotDisplayed(shareSO.element, "Share element still displayed");
        });

        it("[PRPI-1637] the Share module should no longer be visible", async () => {
          expect(await shareSO.element.isDisplayed()).toEqual(false);
        });
      });
    });
  });
});
