const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const EnhancedTrackingPO = require("@ppb/tbd-shared/components/EnhancedTracking/EnhancedTracking.po");

const { CardPO, TrackingBarPO } = require("../../../../../page-objects");
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();

const cardPO = new CardPO();
const enhancedTrackingPO = new EnhancedTrackingPO();
const firstTrackingBarPO = new TrackingBarPO(enhancedTrackingPO.trackingBars[0]);
const secondTrackingBarPO = new TrackingBarPO(enhancedTrackingPO.trackingBars[1]);

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

        footballFixture: {
          homeName: "Man Utd",
          awayName: "Chelsea",
          scheduledAt: "2023-05-25T19:00:00.000Z",
          eventId: "32483335",
        },
      },
    ],

    betInfo: {
      betReceiptId: "O/11037374/0002965",
      placedDate: "2023-04-21T09:45:41.000Z",
    },
  },
};

const BET_MOCK_SKELETON_WITH_SUPER_SUB = {
  ...BET_MOCK_SKELETON,
  edges: {
    ...BET_MOCK_SKELETON.edges,
    legCardGroups: BET_MOCK_SKELETON.edges.legCardGroups.map((group) => ({
      ...group,
      legs: group.legs.map((leg) => ({
        ...leg,
        parts: leg.parts.map((part) => ({
          ...part,
          isSuperSub: true,
        })),
      })),
    })),
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

const SCORE_AND_CARD_OUTCOME_DEFINITION = {
  ...SCORE_OR_CARD_OUTCOME_DEFINITION,
  operator: "AND",
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

const SBK_SINGLE_FOOTBALL_MOCK_TO_SCORE_OR_HAVE_A_CARD = getMyBetsSBKViewMock(
  [
    {
      ...BET_MOCK_SKELETON,
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
  ],

  {
    hasBottomBar: true,
  },
);

const SBK_SINGLE_FOOTBALL_MOCK_TO_SCORE_OR_HAVE_A_CARD_SUPER_SUB = getMyBetsSBKViewMock(
  [
    {
      ...BET_MOCK_SKELETON_WITH_SUPER_SUB,
      edges: {
        legCardGroups: [
          {
            ...BET_MOCK_SKELETON_WITH_SUPER_SUB.edges.legCardGroups[0],
            legs: [
              {
                ...BET_MOCK_SKELETON_WITH_SUPER_SUB.edges.legCardGroups[0].legs[0],
                parts: [
                  {
                    ...BET_MOCK_SKELETON_WITH_SUPER_SUB.edges.legCardGroups[0].legs[0].parts[0],
                    outcomeDefinitionExp: SCORE_AND_CARD_OUTCOME_DEFINITION,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],

  {
    hasBottomBar: true,
  },
);

const SBK_SINGLE_FOOTBALL_MOCK_TO_SHOT_EACH_HALF = getMyBetsSBKViewMock(
  [
    {
      ...BET_MOCK_SKELETON,
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
  ],

  {
    hasBottomBar: true,
  },
);

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

const SCA_INPLAY_PLAYER_WITH_SUB_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 3,
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
          id: 77345663,
          name: "Cristiano Reilando",
          substitutions: [
            {
              id: 111,
              name: "Carlos Augusto",
              stats: [
                {
                  period: "REGULAR",
                  periodStatus: "INPLAY_FIRST_HALF",
                  goals: 1,
                  totalCards: 1,
                  totalShots: 1,
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
                  goals: 1,
                  totalCards: 2,
                  totalShots: 2,
                },
              ],
            },
            {
              id: 222,
              name: "Fernandes Alonso",
              stats: [
                {
                  period: "REGULAR",
                  periodStatus: "INPLAY_FIRST_HALF",
                  goals: 1,
                  totalCards: 1,
                  totalShots: 1,
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
                  goals: 1,
                  totalCards: 3,
                  totalShots: 3,
                },
              ],
            },
          ],

          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              totalCards: 1,
              totalShots: 1,
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
              goals: 1,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const INITIAL_STATE_MOCK = {
  exchangeEnabled: true,
  products: ["sportsbook"],
  PRODUCT_SWITCHER: { isActive: true },
};

const browseToMyBets = async (MOCK, initialState = INITIAL_STATE_MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, initialState));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
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
          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added
          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "0");
        });

        it("[PRPI-6858] should display the Enhanced Tracking Component", async () => {
          expect(await firstTrackingBarPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-6859] should display the progress bar", async () => {
          expect(await firstTrackingBarPO.progressBar.isDisplayed()).toEqual(true);
        });

        it("[PRPI-6860] should display the current value", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("0");
        });

        it("[PRPI-6861] should display the goal value", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("4");
        });

        describe("And the market enters Inplay and SCA returns an updated value", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "1");
          });

          it("[PRPI-3137] should display the current value with the updated data", async () => {
            expect(await firstTrackingBarPO.currentValue.getText()).toBe("1");
          });
        });
      });
    });

    describe("When the bet is Voided", () => {
      beforeAll(async () => {
        await browseToMyBets(SBK_SINGLE_VOIDED_FOOTBALL_MOCK);
      });

      describe("And the user clicks to expand the card header section", () => {
        beforeAll(async () => {
          await cardPO.title.click();
          await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added

          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "0");
        });

        it("[PRPI-6862] should display the current value with 0", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("0");
        });

        it("[PRPI-6863] should display the goal value", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("4");
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
      describe("And the user clicks to expand the collapsable section", () => {
        beforeAll(async () => {
          await cardPO.title.click();
          await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added

          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "1");
        });

        it("[PRPI-6864] should display the Enhanced Tracking Component", async () => {
          expect(await firstTrackingBarPO.element.isDisplayed()).toEqual(true);
        });
        it("[PRPI-6864] should display the progress bar", async () => {
          expect(await firstTrackingBarPO.progressBar.isDisplayed()).toEqual(true);
        });
        it("[PRPI-6864] should display the current value `1`", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("1");
        });
        it("[PRPI-6864] should display the goal value `1`", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("1");
        });

        it("[PRPI-6864] should have only one progress bar", async () => {
          expect(await enhancedTrackingPO.trackingBars.length).toEqual(1);
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
          await cardPO.title.click();

          await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added
          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "2");
        });

        it("[PRPI-3139] should display the two Enhanced Tracking Components", async () => {
          expect(await firstTrackingBarPO.element.isDisplayed()).toEqual(true);
          expect(await secondTrackingBarPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3139] should display the current value of `2` on the 1st progress bar", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("2");
        });

        it("[PRPI-3139] should display the goal value of `1` on the 1st progress bar", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("1");
        });

        it("[PRPI-3139] should display the current value of `0` on the 2nd progress bar", async () => {
          expect(await secondTrackingBarPO.currentValue.getText()).toBe("0");
        });

        it("[PRPI-3139] should display the goal value of `1` on the 2nd progress bar", async () => {
          expect(await secondTrackingBarPO.goalValue.getText()).toBe("1");
        });
      });
    });
  });

  describe("When the user is on My Bets open bets and has a bet in a `SuperSub` market that is Inplay", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_PLAYER_WITH_SUB_MOCK));
      await browseToMyBets(SBK_SINGLE_FOOTBALL_MOCK_TO_SCORE_OR_HAVE_A_CARD_SUPER_SUB);
    });

    describe("When the player and its subs have stats", () => {
      describe("And the user clicks to expand the collapsable section", () => {
        beforeAll(async () => {
          await cardPO.title.click();
          await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added

          await browser.waitUntilDisplayed(cardPO.content);
          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
          await browser.waitUntilDisplayed(secondTrackingBarPO.progressBar);
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "3");
          await browser.waitUntilEquals(secondTrackingBarPO.currentValue, "6");
        });

        it("[PRPI-6865] should display two Enhanced Tracking bars", async () => {
          expect(await firstTrackingBarPO.element.isDisplayed()).toEqual(true);
          expect(await secondTrackingBarPO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-6866] should display the current value of `3` (1+1+1) on the 1st tracking bar", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("3");
        });

        it("[PRPI-6866] should display the current value of `6` (1+2+3) on the 2nd tracking bar", async () => {
          expect(await secondTrackingBarPO.currentValue.getText()).toBe("6");
        });
      });
    });
  });
});
