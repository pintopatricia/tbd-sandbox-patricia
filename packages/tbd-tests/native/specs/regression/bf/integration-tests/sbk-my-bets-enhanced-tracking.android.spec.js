const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const EnhancedTrackingSO = require("@ppb/tbd-shared/components/EnhancedTracking/EnhancedTracking.so");

const MockService = require("../../../../mock-essentials/mocking-service");

const { startApp } = require("../../../../helpers/urls");

const { BottomBarSO, CardSO, TrackingBarSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const enhancedTrackingSO = new EnhancedTrackingSO();
const cardSO = new CardSO();
const firstTrackingBarSO = new TrackingBarSO(enhancedTrackingSO.trackingBars[0]);
const secondTrackingBarSO = new TrackingBarSO(enhancedTrackingSO.trackingBars[1]);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const BET_MOCK_SKELETON = {
  betType: "SGL",
  isOpen: true,
  betId: "32483335",
  currentSize: 0.1,
  profitAndLoss: 0.17,
  navigationLinks: [
    {
      marketBetUrn: "ppb:marketBet:924.333333333",
    },
  ],

  edges: {
    legCardGroups: [
      {
        footballFixture: {
          homeName: "Man Utd",
          awayName: "Chelsea",
          scheduledAt: "2023-05-25T19:00:00.000Z",
          eventId: "32483335",
        },
        legs: [
          {
            type: "SS",
            parts: [
              {
                price: buildPrice(1.65),
                originalPrice: buildPrice(1.65),
                priceType: "LIVE",
                eventUrn: "ppb:event:32483335",
                eventDescription: "Man Utd v Chelsea",
                eventMarketDescription: "To Score Or To Be Shown A Card",
                selectionName: "Bruno Fernandes",
              },
            ],
          },
        ],
      },
    ],

    betInfo: {
      betReceiptId: "O/11037374/0002965",
      placedDate: "2023-04-21T09:45:41.000Z",
    },
  },
};

const SBK_SINGLE_OVER_UNDER_MOCK = {
  ...BET_MOCK_SKELETON,
  edges: {
    ...BET_MOCK_SKELETON.edges,
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
        ],
      },
    ],
  },
};

const SBK_SINGLE_FOOTBALL_MOCK = getMyBetsSBKViewMock([SBK_SINGLE_OVER_UNDER_MOCK], {
  hasBottomBar: true,
});

const SBK_SINGLE_VOIDED_FOOTBALL_MOCK = getMyBetsSBKViewMock([
  {
    ...SBK_SINGLE_OVER_UNDER_MOCK,
    edges: {
      ...SBK_SINGLE_OVER_UNDER_MOCK.edges,
      legCardGroups: [
        {
          ...SBK_SINGLE_OVER_UNDER_MOCK.edges.legCardGroups[0],
          legs: [
            {
              ...SBK_SINGLE_OVER_UNDER_MOCK.edges.legCardGroups[0].legs[0],
              result: "VOID",
              parts: SBK_SINGLE_OVER_UNDER_MOCK.edges.legCardGroups[0].legs[0].parts,
            },
          ],
        },
      ],
    },
  },
]);

const SCORE_OR_CARD_OUTCOME_DEFINITION = {
  operands: [
    {
      outcomeDefinition: {
        query: {
          sport: "football",
          periodDefinition: {
            period: "REGULAR",
            periodStatus: "FULL",
          },
          outcome: "goals",
          participant: {
            type: "PLAYER",
            participantId: "77345663",
          },
        },
        statsThresholdDef: {
          threshold: 1,
          comparison: "GREATER_THAN_OR_EQUAL",
        },
      },
    },
    {
      outcomeDefinition: {
        query: {
          sport: "football",
          periodDefinition: {
            period: "REGULAR",
            periodStatus: "FULL",
          },
          outcome: "totalCards",
          participant: {
            type: "PLAYER",
            participantId: "77345663",
          },
        },
        statsThresholdDef: {
          threshold: 1,
          comparison: "GREATER_THAN_OR_EQUAL",
        },
      },
    },
  ],

  operator: "OR",
};

const TO_SHOT_EACH_HALF_OUTCOME_DEFINITION = {
  operands: [
    {
      outcomeDefinition: {
        query: {
          sport: "football",
          periodDefinition: {
            period: "REGULAR",
            periodStatus: "INPLAY_FIRST_HALF",
          },
          outcome: "totalShots",
          participant: {
            type: "PLAYER",
            participantId: "77345663",
          },
        },
        statsThresholdDef: {
          threshold: 1,
          comparison: "GREATER_THAN_OR_EQUAL",
        },
      },
    },
    {
      outcomeDefinition: {
        query: {
          sport: "football",
          periodDefinition: {
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
          },
          outcome: "totalShots",
          participant: {
            type: "PLAYER",
            participantId: "77345663",
          },
        },
        statsThresholdDef: {
          threshold: 1,
          comparison: "GREATER_THAN_OR_EQUAL",
        },
      },
    },
  ],

  operator: "AND",
};

const SBK_SINGLE_FOOTBALL_MOCK_TO_SCORE_OR_HAVE_A_CARD = getMyBetsSBKViewMock([
  {
    ...BET_MOCK_SKELETON,
    edges: {
      ...BET_MOCK_SKELETON.edges,
      legCardGroups: [
        {
          ...BET_MOCK_SKELETON.edges.legCardGroups[0],
          legs: [
            {
              ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0],
              parts: [
                {
                  ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0].parts[0],
                  eventMarketDescription: "To Score Or To Be Shown A Card",
                  selectionName: "Bruno Fernandes",
                  outcomeDefinitionExp: SCORE_OR_CARD_OUTCOME_DEFINITION,
                },
              ],
            },
          ],
        },
      ],
    },
  },
]);

const SBK_SINGLE_FOOTBALL_MOCK_TO_SHOT_EACH_HALF = getMyBetsSBKViewMock([
  {
    ...BET_MOCK_SKELETON,
    edges: {
      ...BET_MOCK_SKELETON.edges,
      legCardGroups: [
        {
          ...BET_MOCK_SKELETON.edges.legCardGroups[0],
          legs: [
            {
              ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0],
              parts: [
                {
                  ...BET_MOCK_SKELETON.edges.legCardGroups[0].legs[0].parts[0],
                  eventMarketDescription: "Player To Have 1 Or More Shots in Each Half",
                  selectionName: "Bruno Fernandes",
                  outcomeDefinitionExp: TO_SHOT_EACH_HALF_OUTCOME_DEFINITION,
                },
              ],
            },
          ],
        },
      ],
    },
  },
]);

const SCA_PRE_PLAY_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        period: null,
        status: "PRE_MATCH",
        stoppageMinutes: null,
        clock: {
          minute: 0,
          second: 0,
        },
      },
      penaltyShootout: null,
      stats: [],
    },
  ],
};

const SCA_INPLAY_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 1,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 43,
          second: 56,
        },
      },
      penaltyShootout: null,
      stats: [
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            goals: 1,
          },
          away: {
            goals: 0,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            goals: 1234,
          },
          away: {
            goals: 0,
          },
        },
      ],
    },
  ],
};

const SCA_INPLAY_PLAYER_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 1,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 85,
          second: 11,
        },
      },
      players: [
        {
          id: "77345663",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 0,
              totalShots: 2,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
              totalCards: 3,
              totalShots: 2,
            },
          ],
        },
      ],
    },
  ],
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  await startApp("home");
  await browser.waitUntilClickableNative(BottomBarSO.myBets);
  await BottomBarSO.myBets.click();
};

describe("My bets - Enhanced Tracking", () => {
  describe("When the user is on My Bets open bets and has a bet in a `Over/Under` market", () => {
    describe("When the market is in Preplay", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));
        await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK);
      });

      describe("And the user clicks to expand the collapsable section", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(cardSO.header);
          await cardSO.header.click();
          await browser.waitUntilDisplayed(cardSO.contentWrapper);
        });

        it("[PRPI-3133] should display the Enhanced Tracking Component", async () => {
          expect(await firstTrackingBarSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3134] should display the progress bar", async () => {
          expect(await firstTrackingBarSO.progressBar.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3135] should display the current value", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("0");
        });

        it("[PRPI-3136] should display the goal value", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("4");
        });

        describe("And the market enters Inplay and SCA returns an updated value", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));
            await browser.waitUntilEquals(firstTrackingBarSO.currentValue, "1");
          });

          it("[PRPI-3137] should display the current value with the updated data", async () => {
            expect(await firstTrackingBarSO.currentValue.getText()).toBe("1");
          });

          describe("When the bet is Voided", () => {
            beforeAll(async () => {
              await browseToMyBets(SBK_SINGLE_VOIDED_FOOTBALL_MOCK);
              await browser.waitUntilEquals(firstTrackingBarSO.currentValue, "0");
            });

            afterAll(async () => {
              await cardSO.title.click();
            });

            it("[PRPI-3137] should display the current value with 0", async () => {
              expect(await firstTrackingBarSO.currentValue.getText()).toBe("0");
            });

            it("[PRPI-3137] should display the goal value", async () => {
              expect(await firstTrackingBarSO.goalValue.getText()).toBe("4");
            });
          });
        });
      });
    });
  });

  describe("When the user is on My Bets open bets and has a bet in a `To Score Or To Be Shown A Card` market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_PLAYER_MOCK));
      await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK_TO_SCORE_OR_HAVE_A_CARD);
    });

    describe("When the market is in InPlay and the player already scored two goals", () => {
      describe("And the user clicks to expand the card header", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(cardSO.header);
          await cardSO.header.click();
          await browser.waitUntilDisplayed(cardSO.contentWrapper);
          await browser.waitUntilEquals(firstTrackingBarSO.currentValue, "1");
        });

        afterAll(async () => {
          await cardSO.title.click();
        });

        it("[PRPI-3799] should display the Enhanced Tracking Component", async () => {
          expect(await firstTrackingBarSO.element.isDisplayed()).toEqual(true);
        });
        it("[PRPI-3800] should display the progress bar", async () => {
          expect(await firstTrackingBarSO.progressBar.isDisplayed()).toEqual(true);
        });
        it("[PRPI-3801] should display the current value `1`", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("1");
        });
        it("[PRPI-3802] should display the goal value `1`", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("1");
        });
        it("[PRPI-3803] should have only one progress bar", async () => {
          expect(await enhancedTrackingSO.trackingBars.length).toEqual(1);
        });
      });
    });
  });

  describe("When the user is on My Bets open bets and has a bet in a `To Have 1 Or More Shots in Each Half` market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_PLAYER_MOCK));
      await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK_TO_SHOT_EACH_HALF);
    });

    describe("When the market is in First Half and the player has two shots", () => {
      describe("And the user clicks to expand the collapsable section", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(cardSO.title);
          await cardSO.title.click();
          await browser.waitUntilDisplayed(cardSO.contentWrapper);
          await browser.waitUntilEquals(firstTrackingBarSO.currentValue, "2");
          await browser.waitUntilEquals(secondTrackingBarSO.currentValue, "0");
        });

        it("[PRPI-3804] should display two the Enhanced Tracking Components", async () => {
          expect(await firstTrackingBarSO.element.isDisplayed()).toEqual(true);
          expect(await secondTrackingBarSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3805] should display the current value of `2` on the 1st progress bar", async () => {
          expect(await firstTrackingBarSO.currentValue.getText()).toBe("2");
        });

        it("[PRPI-3806] should display the goal value of `1` on the 1st progress bar", async () => {
          expect(await firstTrackingBarSO.goalValue.getText()).toBe("1");
        });

        it("[PRPI-3807] should display the current value of `0` on the 2nd progress bar", async () => {
          expect(await secondTrackingBarSO.currentValue.getText()).toBe("0");
        });

        it("[PRPI-3808] should display the goal value of `1` on the 2nd progress bar", async () => {
          expect(await secondTrackingBarSO.goalValue.getText()).toBe("1");
        });
      });
    });
  });
});
