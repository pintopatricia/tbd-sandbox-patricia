const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  TrackingBarPO,
  StatusLabelPO,
  CardPO,
  BetSelectionDetailsPO,
  ObbEnhancedTrackingCardPO,
  ShowMorePO,
} = require("../../../../../page-objects");
const SportsbookBetLegCardPO = require("@ppb/tbd-shared/components/SportsbookBetLegCard/SportsbookBetLegCard.web.po");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const cardPO = new CardPO();
const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const firstBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);

const firstSportsbookBetLegCardPO = new SportsbookBetLegCardPO(myBetsPO.betCardGroups[0]);

const firstEnhancedTrackingPO = new ObbEnhancedTrackingCardPO(firstSportsbookBetLegCardPO.contentCards[0]);
const secondEnhancedTrackingPO = new ObbEnhancedTrackingCardPO(firstSportsbookBetLegCardPO.contentCards[1]);

const firstBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardPO.contentCards[0]);
const secondBetSelectionDetailsPO = new BetSelectionDetailsPO(firstSportsbookBetLegCardPO.contentCards[1]);

const firstTrackingBarPO = new TrackingBarPO(firstEnhancedTrackingPO.trackingBar);
const secondTrackingBarPO = new TrackingBarPO(secondEnhancedTrackingPO.trackingBar);

const firstShowMoreButtonPO = new ShowMorePO(firstEnhancedTrackingPO.showMoreButton);
const secondShowMoreButtonPO = new ShowMorePO(secondEnhancedTrackingPO.showMoreButton);

const betStatusLabelPO = new StatusLabelPO(firstBetPanelPO.statusLabel);

const firstPrimeStatusLabelPO = new StatusLabelPO(firstBetSelectionDetailsPO.element);
const secondPrimeStatusLabelPO = new StatusLabelPO(secondBetSelectionDetailsPO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_MULTIPLE_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "IN_PLAY",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
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
                      subExpressionInfos: [],
                    },
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["SHOTS_ON_TARGET"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 8,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "SHOTS_ON_TARGET",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "SHOTS_ON_TARGET",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 8,
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_ACTIVE_BET_MOCK_DIFFERENT_OUTCOMES = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "IN_PLAY_FIRST_HALF",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404040",
                            name: "João",
                          },
                          { id: "404041", name: "Carlos" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS_WON"],
                        timePeriodId: "MATCH",
                        participantIds: ["404040", "404041"],
                        value: 3,
                        quantifier: "MORE_THAN",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS_WON",
                            timePeriodId: "MATCH",
                            participantId: "404040",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS_WON",
                            timePeriodId: "MATCH",
                            participantId: "404041",
                          },
                        ],

                        operator: ">",
                        rightOperand: [
                          {
                            decimal: 3,
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404040",
                            name: "João",
                          },
                          { id: "404041", name: "Carlos" },
                        ],
                      },
                      params: {
                        outcomeIds: ["GOALS"],
                        timePeriodId: "MATCH",
                        participantIds: ["404040", "404041"],
                        value: 4,
                        quantifier: "AT_LEAST",
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

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 4,
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_BET_ONE_LOST_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    result: "LOST",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
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
              legNumber: 0,
              result: "LOST",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      result: "WON",
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
                      subExpressionInfos: [],
                    },
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS_COMMITTED"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 7,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS_COMMITTED",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS_COMMITTED",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 7,
                          },
                        ],
                      },
                      result: "LOST",
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_PVP_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            typename: "FootballFixture",
            duration: {
              period: "REGULAR",
              status: "IN_PLAY",
              clock: null,
              stoppageMinutes: null,
            },
          },
          legs: [
            {
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
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
                    {
                      templateId: "playerVsPlayer",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Leonel Messi",
                          },
                          { id: "404043", name: "Neymar Jr." },
                        ],
                      },
                      params: {
                        participantIdA: "404042",
                        participantIdB: "404043",
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "GOALS_TIME_ADJUSTED",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                        ],

                        operator: ">",
                        rightOperand: [
                          {
                            outcomeId: "GOALS_TIME_ADJUSTED",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],
                      },
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const OBB_MULTIPLE_BET_ONE_VOID_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.46,
    currentSize: 0.1,
    betPrice: buildPrice(4.6),
    product: "OUTCOME_BASED_BETTING",
    result: "VOID",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            eventId: "32483335",
            scheduledAt: "2023-05-18T18:30:00.000Z",
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
              legNumber: 0,
              result: "VOID",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "xOfN",
                  templateVersion: 1,
                  expressionMetadata: null,
                  params: {
                    x: 2,
                  },
                  expressionComponents: null,
                  subExpressionInfos: [
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      result: "WON",
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
                      subExpressionInfos: [],
                    },
                    {
                      templateId: "participantsCombined",
                      templateVersion: 1,
                      expressionMetadata: {
                        participants: [
                          {
                            id: "404042",
                            name: "Miguel",
                          },
                          { id: "404043", name: "Lira" },
                        ],
                      },
                      params: {
                        outcomeIds: ["FOULS_COMMITTED"],
                        timePeriodId: "MATCH",
                        participantIds: ["404042", "404043"],
                        value: 7,
                        quantifier: "AT_LEAST",
                      },
                      expressionComponents: {
                        leftOperand: [
                          {
                            outcomeId: "FOULS_COMMITTED",
                            timePeriodId: "MATCH",
                            participantId: "404042",
                          },
                          {
                            operator: "+",
                          },
                          {
                            outcomeId: "FOULS_COMMITTED",
                            timePeriodId: "MATCH",
                            participantId: "404043",
                          },
                        ],

                        operator: ">=",
                        rightOperand: [
                          {
                            decimal: 7,
                          },
                        ],
                      },
                      result: "VOID",
                      subExpressionInfos: [],
                    },
                  ],
                },
              },
              parts: [
                {
                  price: buildPrice(4.6),
                  originalPrice: buildPrice(4.6),
                  eventMarketDescription: "Match Ups Multi",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                  eventUrn: "ppb:event:32483335",
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

const SCA_INPLAY_MOCK = {
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
              shotsOnTarget: 5,
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
              shotsOnTarget: 0,
            },
          ],
        },
        {
          id: 404042,
          name: "MIGUEL",
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
              fouls: 3,
              totalCards: 1,
              totalShots: 10,
              shotsOnTarget: 3,
            },
          ],
        },
        {
          id: 404043,
          name: "LIRA",
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
              fouls: 2,
              totalCards: 1,
              totalShots: 10,
              shotsOnTarget: 2,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_INPLAY_MOCK_NO_STAT = {
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
        status: "INPLAY_FIRST_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 23,
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
              foulsWon: null,
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
              goals: 1,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
              foulsWon: null,
            },
          ],
        },
        {
          id: 404041,
          name: "Carlos",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 3,
              fouls: 2,
              totalCards: 1,
              totalShots: 1,
              shotsOnTarget: 4,
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
              goals: 3,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
              shotsOnTarget: 4,
              foulsWon: 4,
            },
          ],
        },
      ],
    },
  ],
};

const SCA_FINAL_MOCK = {
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
              goals: 3,
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
              goals: 4,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 4,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404042,
          name: "MIGUEL",
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
              fouls: 3,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404043,
          name: "LIRA",
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
              fouls: 2,
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

describe("OBB Enhanced Tracking My Bets Page.", () => {
  describe("Given I'm on my bets.", () => {
    describe("[SHMRCK-551] And I have a multiple obb bet with an inplay event.", () => {
      describe("[SHMRCK-551] And I already achieved one outcome.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));
          await browseToMyBets(OBB_MULTIPLE_ACTIVE_BET_MOCK);

          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.waitUntilDisplayed(firstTrackingBarPO.element);
          await browser.waitUntilDisplayed(secondTrackingBarPO.element);
        });
        it("[PRPI-7030] And the outcome is displayed.", async () => {
          expect(await firstBetSelectionDetailsPO.subtitle.getText()).toEqual("7+ Goals Between Them");
          expect(await secondBetSelectionDetailsPO.subtitle.getText()).toEqual("8+ Shots On Target Between Them");
        });
        it("[PRPI-7031] And the first tracking bar outcomes is 7.", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("7");
        });
        it("[PRPI-7032] And the first tracking bar outcomes is 8.", async () => {
          expect(await secondTrackingBarPO.goalValue.getText()).toBe("8");
        });
        it("[PRPI-7033] Then the counter for the first outcome is displayed with 7.", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-7034] And the second counter is displayed with 5.", async () => {
          expect(await secondTrackingBarPO.currentValue.getText()).toBe("5");
        });
        it("[PRPI-7035] And the bet is in progress.", async () => {
          expect(await betStatusLabelPO.element.isDisplayed()).toBe(false);
        });

        describe("[SHMRCK-563] When I click on the first show more button.", () => {
          beforeAll(async () => {
            await firstShowMoreButtonPO.element.click();
            await browser.waitUntilEquals(firstShowMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7036] Then the first player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
            expect(await firstEnhancedTrackingPO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-7036] Then the second player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingPO.playerStats[1].getText()).toBe("4");
            expect(await firstEnhancedTrackingPO.playerName[1].getText()).toBe("Mota");
          });
        });

        describe("[SHMRCK-563] When I click on the second show more button.", () => {
          beforeAll(async () => {
            await secondShowMoreButtonPO.element.scrollIntoView(false);
            await browser.waitUntilInViewport(secondShowMoreButtonPO.element, "switcher card not in viewport");
            await secondShowMoreButtonPO.element.click();
            await browser.waitUntilEquals(secondShowMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7037] Then the first player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
            expect(await secondEnhancedTrackingPO.playerName[0].getText()).toBe("Miguel");
          });

          it("[PRPI-7037] Then the second player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[1].getText()).toBe("2");
            expect(await secondEnhancedTrackingPO.playerName[1].getText()).toBe("Lira");
          });
        });
      });
    });

    describe("[SHMRCK-563] And I have another a multiple obb bet with an inplay event.", () => {
      describe("[SHMRCK-563] And the player 1 has no stats for the first selection outcome.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK_NO_STAT));
          await browseToMyBets(OBB_MULTIPLE_ACTIVE_BET_MOCK_DIFFERENT_OUTCOMES);

          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.waitUntilDisplayed(secondShowMoreButtonPO.element);
          await browser.waitUntilDisplayed(secondTrackingBarPO.element);
        });

        it("[PRPI-7038] And the first tracking bar is not displayed.", async () => {
          expect(await firstTrackingBarPO.element).not.toBeDisplayed();
        });

        it("[PRPI-7039] And the second counter is displayed with 4.", async () => {
          expect(await secondTrackingBarPO.currentValue.getText()).toBe("4");
        });

        describe("[SHMRCK-563] When I click on the second show more button.", () => {
          beforeAll(async () => {
            await secondShowMoreButtonPO.element.scrollIntoView(false);
            await secondShowMoreButtonPO.element.click();
            await secondShowMoreButtonPO.element.scrollIntoView(false);

            await browser.waitUntilEquals(secondShowMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7040] Then the first player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[0].getText()).toBe("1");
            expect(await secondEnhancedTrackingPO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-7040] Then the second player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[1].getText()).toBe("3");
            expect(await secondEnhancedTrackingPO.playerName[1].getText()).toBe("Carlos");
          });
        });
      });
    });

    describe("[SHMRCK-552] When I have a VOIDED multiple obb participantsCombined bet.", () => {
      describe("[SHMRCK-552] And I achieve one outcome.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_FINAL_MOCK));
          await browseToMyBets(OBB_MULTIPLE_BET_ONE_VOID_MOCK);

          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.waitUntilDisplayed(firstBetSelectionDetailsPO.element);
          await browser.waitUntilDisplayed(secondBetSelectionDetailsPO.element);
        });

        it("[PRPI-7041] The bet is settled as Void.", async () => {
          expect(await betStatusLabelPO.element.isDisplayed()).toBe(true);
          expect(await betStatusLabelPO.text.getText()).toBe("Void");
        });

        it("[PRPI-7042] And the first prime bet does not show a status label.", async () => {
          expect(await firstPrimeStatusLabelPO.text.isDisplayed()).toBe(false);
        });

        it("[PRPI-7043] And the second prime bet does not show a status label.", async () => {
          expect(await secondPrimeStatusLabelPO.text.isDisplayed()).toBe(false);
        });
      });
    });

    describe("[SHMRCK-552] And the event is finished.", () => {
      describe("[SHMRCK-552] And I achieve one outcome.", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_FINAL_MOCK));
          await browseToMyBets(OBB_MULTIPLE_BET_ONE_LOST_MOCK);

          await cardPO.title.waitForClickable();
          await cardPO.title.click();

          await browser.waitUntilDisplayed(firstTrackingBarPO.element);
          await browser.waitUntilDisplayed(secondTrackingBarPO.element);
        });
        it("[PRPI-7044] And the goals of outcomes are 7.", async () => {
          expect(await firstTrackingBarPO.goalValue.getText()).toBe("7");
          expect(await secondTrackingBarPO.goalValue.getText()).toBe("7");
        });
        it("[PRPI-7045] And the first outcome value is 7.", async () => {
          expect(await firstTrackingBarPO.currentValue.getText()).toBe("7");
        });
        it("[PRPI-7046] And the counter of the other outcome is on 5.", async () => {
          expect(await secondTrackingBarPO.currentValue.getText()).toBe("5");
        });
        it("[PRPI-7047] And the bet is settled as LOST.", async () => {
          expect(await betStatusLabelPO.element.isDisplayed()).toBe(true);
          expect(await betStatusLabelPO.text.getText()).toBe("Lost");
        });

        describe("[SHMRCK-563] When I click on the first show more button.", () => {
          beforeAll(async () => {
            await firstShowMoreButtonPO.element.click();
            await browser.waitUntilEquals(firstShowMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7048] Then the first player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
            expect(await firstEnhancedTrackingPO.playerName[0].getText()).toBe("João");
          });

          it("[PRPI-7049] Then the second player statistics and name are displayed.", async () => {
            expect(await firstEnhancedTrackingPO.playerStats[1].getText()).toBe("4");
            expect(await firstEnhancedTrackingPO.playerName[1].getText()).toBe("Mota");
          });
          it("[PRPI-7050] And the prime bet is settled as WON.", async () => {
            expect(await firstPrimeStatusLabelPO.text.getText()).toBe("Won");
          });
        });

        describe("[SHMRCK-563] When I click on the second show more button.", () => {
          beforeAll(async () => {
            await secondShowMoreButtonPO.element.scrollIntoView(false);
            await browser.waitUntilInViewport(secondShowMoreButtonPO.element, "switcher card not in viewport");
            await secondShowMoreButtonPO.element.click();
            await browser.waitUntilEquals(secondShowMoreButtonPO.element, "Hide Player Progress");
          });

          it("[PRPI-7051] Then the first player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
            expect(await secondEnhancedTrackingPO.playerName[0].getText()).toBe("Miguel");
          });

          it("[PRPI-7052] Then the second player statistics and name are displayed.", async () => {
            expect(await secondEnhancedTrackingPO.playerStats[1].getText()).toBe("2");
            expect(await secondEnhancedTrackingPO.playerName[1].getText()).toBe("Lira");
          });
          it("[PRPI-7053] And the prime bet is settled as WON.", async () => {
            expect(await secondPrimeStatusLabelPO.text.getText()).toBe("Lost");
          });
        });
      });
    });

    describe("[SHMRCK-597] When I have a multiple obb pvp bet with an inplay event and I click on the show more button.", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_MOCK));
        await browseToMyBets(OBB_MULTIPLE_PVP_ACTIVE_BET_MOCK);

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstShowMoreButtonPO.element);
        await browser.waitUntilDisplayed(secondShowMoreButtonPO.element);
      });

      it("[PRPI-7054] And no tracking bars are displayed.", async () => {
        expect(await firstTrackingBarPO.element.isDisplayed()).toBe(false);
        expect(await secondTrackingBarPO.element.isDisplayed()).toBe(false);
      });

      describe("[SHMRCK-597] When I click on the first show more button.", () => {
        beforeAll(async () => {
          await firstShowMoreButtonPO.element.click();
          await browser.waitUntilEquals(firstShowMoreButtonPO.element, "Hide Player Progress");
        });

        it("[PRPI-7055] Then the first player statistics and name are displayed.", async () => {
          expect(await firstEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
          expect(await firstEnhancedTrackingPO.playerName[0].getText()).toBe("Bukayo Saka");
        });

        it("[PRPI-7056] Then the second player statistics and name are displayed.", async () => {
          expect(await firstEnhancedTrackingPO.playerStats[1].getText()).toBe("4");
          expect(await firstEnhancedTrackingPO.playerName[1].getText()).toBe("Cristiano Ronaldo");
        });
      });

      describe("[SHMRCK-597] When I click on the second show more button.", () => {
        beforeAll(async () => {
          await secondShowMoreButtonPO.element.scrollIntoView(false);
          await browser.waitUntilInViewport(secondShowMoreButtonPO.element, "switcher card not in viewport");
          await secondShowMoreButtonPO.element.click();
          await browser.waitUntilEquals(secondShowMoreButtonPO.element, "Hide Player Progress");
        });

        it("[PRPI-7057] Then the first player statistics and name are displayed.", async () => {
          expect(await secondEnhancedTrackingPO.playerStats[0].getText()).toBe("3");
          expect(await secondEnhancedTrackingPO.playerName[0].getText()).toBe("Leonel Messi");
        });

        it("[PRPI-7058] Then the second player statistics and name are displayed.", async () => {
          expect(await secondEnhancedTrackingPO.playerStats[1].getText()).toBe("4");
          expect(await secondEnhancedTrackingPO.playerName[1].getText()).toBe("Neymar Jr.");
        });
      });
    });
  });
});
