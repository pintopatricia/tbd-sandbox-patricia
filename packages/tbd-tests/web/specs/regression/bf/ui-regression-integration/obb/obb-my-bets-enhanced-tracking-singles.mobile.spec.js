const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");
const SportsbookBetLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web.po");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  AvBFixturePO,
  TrackingBarPO,
  StatusLabelPO,
  CardPO,
  BetSelectionDetailsPO,
  ObbEnhancedTrackingCardPO,
  ShowMorePO,
} = require("../../../../../page-objects");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const cardPO = new CardPO();
const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const firstBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const firstSportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO(myBetsPO.betCardGroups[0]);
const firstAvBFixturePO = new AvBFixturePO(firstSportsbookExpandableLegCardGroupPO.cards[0]);

const sportsbookBetLegCardGroupSO = new SportsbookBetLegCardGroupPO(firstSportsbookExpandableLegCardGroupPO.cards[0]);

const betSelectionDetailsPO = new BetSelectionDetailsPO(sportsbookBetLegCardGroupSO.cards[0]);

const enhancedTrackingPO = new ObbEnhancedTrackingCardPO(myBetsPO.betCardGroups[0]);

const firstTrackingBarPO = new TrackingBarPO(enhancedTrackingPO.trackingBar);

const showMoreButtonPO = new ShowMorePO();

const betStatusLabelPO = new StatusLabelPO(firstBetPanelPO.statusLabel);

const primeStatusLabelPO = new StatusLabelPO(betSelectionDetailsPO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_SINGLE_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "João",
                      },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  result: null,
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_WON_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    result: "WON",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "WON",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "João",
                      },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  result: "WON",
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_LOST_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    result: "LOST",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "FULL",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "João",
                      },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  result: "LOST",
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_LOST_BET_MOCK_FAKE_OUTCOME = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    result: "LOST",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "FULL",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "João",
                      },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "FAKE_GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  result: "LOST",
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_ACTIVE_PVP_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "Bukayo Saka",
                      },
                      { id: "404041", name: "Cristiano Ronaldo" },
                    ],
                  },
                  params: {
                    participantIdA: "404040",
                    participantIdB: "404041",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
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
      stats: [],
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
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
          minute: 30,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
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
        {
          id: 404041,
          name: "MOTA",
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

const SCA_INPLAY_SECOND_HALF_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 6,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 85,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
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
              goals: 2,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 3,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
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
              goals: 1,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_INPLAY_SECOND_HALF_UPDATE_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 8,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 2,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 2,
              fouls: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              fouls: 5,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: 2,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 3,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              fouls: null,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_FINAL = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 7,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "FULL",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 2,
              fouls: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 3,
              fouls: 5,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: 2,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 1,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
              fouls: null,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
};

describe("OBB Enhanced Tracking Singles My Bets Page", () => {
  describe("Given I'm on my bets", () => {
    describe("[SHMRCK-547] And I have a single obb bet open with a preplay event.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarPO.element);
      });
      it("[PRPI-7059] Then the leg section is displayed", async () => {
        expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.getText()).toEqual("Squad Bet Single @1.9");
      });
      it("[PRPI-7060] And the counter is displayed with 0.", async () => {
        expect(await firstTrackingBarPO.currentValue.getText()).toBe("0");
      });

      it("[PRPI-7061] And the outcome is displayed.", async () => {
        expect(await betSelectionDetailsPO.subtitle.getText()).toEqual("7+ Goals Between Them");
      });

      describe("[SHMRCK-563] When I click on the show more button.", () => {
        beforeAll(async () => {
          await showMoreButtonPO.element.click();
          await browser.waitUntilEquals(showMoreButtonPO.element, "Hide Player Progress");
        });

        it("[PRPI-7062] Then the first player statistics and name are displayed.", async () => {
          expect(await enhancedTrackingPO.playerStats[0].getText()).toBe("0");
          expect(await enhancedTrackingPO.playerName[0].getText()).toBe("João");
        });

        it("[PRPI-7063] Then the second player statistics and name are displayed.", async () => {
          expect(await enhancedTrackingPO.playerStats[1].getText()).toBe("0");
          expect(await enhancedTrackingPO.playerName[1].getText()).toBe("Mota");
        });
      });
    });
    describe("[SHMRCK-548] And the event turns inplay but I didn't achieve the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarPO.element);
        await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "2");
      });
      it("[PRPI-7064] The counter is displayed with 2.", async () => {
        expect(await firstTrackingBarPO.currentValue.getText()).toBe("2");
      });

      describe("[SHMRCK-548] And a new SCA update is coming, but I haven't reached the outcome yet.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_MOCK));
          await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "5");
        });

        it("[PRPI-7065] Then the counter is displayed with 5", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("5");
        });
        it("[PRPI-7066] And the outcome is with 7", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("7");
        });
        describe("[SHMRCK-563] When I click on the show more button.", () => {
          beforeAll(async () => {
            await showMoreButtonPO.element.click();
            await browser.waitUntilEquals(showMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7067] Then the first player statistics and name are updated.", async () => {
            expect(await enhancedTrackingPO.playerStats[0].getText()).toBe("3");
            expect(await enhancedTrackingPO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-7067] Then the second player statistics and name are updated.", async () => {
            expect(await enhancedTrackingPO.playerStats[1].getText()).toBe("2");
            expect(await enhancedTrackingPO.playerName[1].getText()).toBe("Mota");
          });
        });
      });
    });
    describe("[SHMRCK-549] And I already achieve the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_SECOND_HALF_UPDATE_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
        await browser.waitUntilEquals(firstTrackingBarPO.currentValue, "8");
      });
      it("[PRPI-7068] Then the counter is on 8.", async () => {
        expect(await firstTrackingBarPO.currentValue.getText()).toBe("8");
      });
      it("[PRPI-7069] And the outcome is with 7.", async () => {
        expect(await firstTrackingBarPO.goalValue.getText()).toBe("7");
      });
      it("[PRPI-7070] And the bet is not settled.", async () => {
        expect(await betStatusLabelPO.element.isDisplayed()).toBe(false);
      });
      describe("[SHMRCK-563] When I click on the show more button.", () => {
        beforeAll(async () => {
          await showMoreButtonPO.element.click();
          await browser.tickFakeClock();
          await browser.waitUntilEquals(showMoreButtonPO.element, "Hide Player Progress");
        });

        it("[PRPI-7071] Then the first player statistics and name are updated.", async () => {
          expect(await enhancedTrackingPO.playerStats[0].getText()).toBe("4");
          expect(await enhancedTrackingPO.playerName[0].getText()).toBe("João");
        });

        it("[PRPI-7072] Then the second player statistics and name are updated.", async () => {
          expect(await enhancedTrackingPO.playerStats[1].getText()).toBe("4");
          expect(await enhancedTrackingPO.playerName[1].getText()).toBe("Mota");
        });
      });

      describe("[SHMRCK-549] And a new update comes from SCA and the bet change to settle as WON.", () => {
        beforeAll(async () => {
          await browseToMyBets(OBB_SINGLE_WON_BET_MOCK);

          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
        });
        it("[PRPI-7073] And the bet is settled as WON.", async () => {
          expect(await betStatusLabelPO.text.getText()).toBe("Won");
        });
        it("[PRPI-7074] And the prime bet is settled as WON.", async () => {
          await browser.waitUntilDisplayed(primeStatusLabelPO.text);
          expect(await primeStatusLabelPO.text.getText()).toBe("Won");
        });
      });
    });
    describe("[SHMRCK-550] And the event finished without me achieving the outcome.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL));

        await browseToMyBets(OBB_SINGLE_LOST_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstTrackingBarPO.progressBar);
      });
      it("[PRPI-7075] Then the counter is on 5.", async () => {
        expect(await firstTrackingBarPO.currentValue.getText()).toBe("5");
      });
      it("[PRPI-7076] And the outcome is with 7.", async () => {
        expect(await firstTrackingBarPO.goalValue.getText()).toBe("7");
      });
      it("[PRPI-7077] And the bet is settled as Lost.", async () => {
        expect(await betStatusLabelPO.element.isDisplayed()).toBe(true);
        expect(await betStatusLabelPO.text.getText()).toBe("Lost");
      });
      it("[PRPI-7078] And the prime bet is settled as Lost", async () => {
        await browser.waitUntilDisplayed(primeStatusLabelPO.text);
        expect(await primeStatusLabelPO.text.getText()).toBe("Lost");
      });
    });

    describe("[SHMRCK-597] When I have a single obb pvp bet in pre-play and click on the show more button.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));

        await browseToMyBets(OBB_SINGLE_ACTIVE_PVP_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await showMoreButtonPO.element.click();
        await browser.waitUntilEquals(showMoreButtonPO.element, "Hide Player Progress");
      });

      it("[PRPI-7079] No tracking bar is displayed", async () => {
        expect(await firstTrackingBarPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-7080] And the counters for each player are displayed correctly", async () => {
        expect(await enhancedTrackingPO.playerStats[0].getText()).toBe("0");
        expect(await enhancedTrackingPO.playerName[0].getText()).toBe("Bukayo Saka");
        expect(await enhancedTrackingPO.playerStats[1].getText()).toBe("0");
        expect(await enhancedTrackingPO.playerName[1].getText()).toBe("Cristiano Ronaldo");
      });

      describe("[SHMRCK-597] And the event starts and stats are changed", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
          await browser.waitUntilEquals(enhancedTrackingPO.playerStats[0], "1");
        });

        it("[PRPI-7081] The counters for each player are updated correctly", async () => {
          expect(await enhancedTrackingPO.playerStats[0].getText()).toBe("1");
          expect(await enhancedTrackingPO.playerName[0].getText()).toBe("Bukayo Saka");
          expect(await enhancedTrackingPO.playerStats[1].getText()).toBe("1");
          expect(await enhancedTrackingPO.playerName[1].getText()).toBe("Cristiano Ronaldo");
        });
      });
    });

    describe("[#GRNFLDS-77] And i have a settled bet and the outcome is not supported", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL));

        await browseToMyBets(OBB_SINGLE_LOST_BET_MOCK_FAKE_OUTCOME);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();
      });
      it("[PRPI-7082] NO tracking bar is displayed", async () => {
        expect(await firstTrackingBarPO.element.isDisplayed()).toBe(false);
      });
      it("[PRPI-7083] And the bet is settled as Lost.", async () => {
        expect(await betStatusLabelPO.element.isDisplayed()).toBe(true);
        expect(await betStatusLabelPO.text.getText()).toBe("Lost");
      });

      it("[PRPI-7084] And the prime bet is settled as Lost", async () => {
        await browser.waitUntilDisplayed(primeStatusLabelPO.text);
        expect(await primeStatusLabelPO.text.getText()).toBe("Lost");
      });
    });
  });
});
