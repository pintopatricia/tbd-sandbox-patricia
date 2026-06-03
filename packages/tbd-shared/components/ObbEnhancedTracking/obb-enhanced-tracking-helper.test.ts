import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { FootballFixture, FootballMatchPeriod, FootballMatchStatus } from "@ppb/tbd-store";
import { Result } from "@ppb/tbd-store/state/constants";
import { getEnhancedTrackingData } from "./obb-enhanced-tracking-helper";
import { EnhancedTrackingDataType } from "./ObbEnhancedTracking.types";

const RESULT = Result.WINNING;

const footballType: FootballFixture["typename"] = "FootballFixture";

const FOOTBALL_FIXTURE = {
  urn: "urn:match:1",
  typename: footballType,
  home: {
    name: "Aston Villa",
  },
  away: {
    name: "Liverpool",
  },
  score: {
    home: 4,
    away: 2,
  },
  isAmericanFormat: false,
};

const ExpressionMetadata = {
  participants: [
    {
      id: "6354321",
      name: "Joao",
    },
    {
      id: "6354322",
      name: "Mota",
    },
  ],
  __typename: "ExpressionMetadata",
};

const FOOTBALL_FIXTURE_WITH_PLAYER_STATS = {
  ...FOOTBALL_FIXTURE,
  players: [
    {
      id: "6354321",
      name: "Joao",
      __typename: "FootballPlayer",
      stats: [
        {
          __typename: "FootballParticipantStats",
          periodStatus: FootballMatchStatus.FULL,
          period: FootballMatchPeriod.REGULAR,
          goals: 1,
        },
      ],
    },
    {
      id: "6354322",
      name: "Mota",
      __typename: "FootballPlayer",
      stats: [
        {
          __typename: "FootballParticipantStats",
          periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
          period: FootballMatchPeriod.REGULAR,
          shots: 2,
        },
        {
          __typename: "FootballParticipantStats",
          periodStatus: FootballMatchStatus.FULL,
          period: FootballMatchPeriod.REGULAR,
          goals: 5,
        },
      ],
    },
  ],
  stats: [
    {
      __typename: "FootballMatchStats",
      periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    },
  ],
};

describe("getEnhancedTrackingData", () => {
  describe("when the fixture does not have player stats", () => {
    it("should return an empty array", () => {
      const expressionComponents = {
        leftOperand: [
          {
            outcomeId: "GOALS",
            timePeriodId: "MATCH",
            participantId: "playerId_no_stats_mock",
          },
        ],
        operator: ">",
        rightOperand: [
          {
            decimal: 5,
          },
        ],
      };

      const result = getEnhancedTrackingData(FOOTBALL_FIXTURE, expressionComponents, ExpressionMetadata, RESULT);

      expect(result).toEqual([
        {
          enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
          statsListTrackingData: [],
        },
      ]);
    });
  });
  describe("when the fixture isPending", () => {
    it("should return an empty data", () => {
      const expressionComponents = {
        leftOperand: [
          {
            outcomeId: "GOALS",
            timePeriodId: "MATCH",
            participantId: "playerId_no_stats_mock",
          },
        ],
        operator: ">",
        rightOperand: [
          {
            decimal: 5,
          },
        ],
      };

      const result = getEnhancedTrackingData(FOOTBALL_FIXTURE, expressionComponents, ExpressionMetadata, Result.VOID);

      expect(result).toEqual([
        {
          enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
          statsListTrackingData: [],
        },
      ]);
    });
  });
  describe("when the fixture does have player stats", () => {
    describe("when is isParticipantsCombined type", () => {
      describe("and we have all the data to build both tracking types", () => {
        it("should return a Progress and Individual tracking", () => {
          const expressionComponents = {
            leftOperand: [
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "6354321",
              },
              {
                operator: "+",
              },
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                decimal: 5,
              },
            ],
          };

          const result = getEnhancedTrackingData(
            FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
            expressionComponents,
            ExpressionMetadata,
            RESULT,
          );

          expect(result).toEqual([
            {
              enhancedTrackingType: EnhancedTrackingDataType.PROGRESS,
              goal: 5,
              status: TrackingBarStatus.ACTIVE,
              currentValue: 6,
              outcomeDefinitions: [
                {
                  outcome: "GOALS",
                  participantId: "6354321",
                  periodStatus: "FULL",
                  period: "REGULAR",
                },
                {
                  outcome: "GOALS",
                  participantId: "6354322",
                  periodStatus: "FULL",
                  period: "REGULAR",
                },
              ],
            },
            {
              enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
              statsListTrackingData: [
                {
                  outcome: "GOALS",
                  label: "Joao",
                  stat: 1,
                },
                {
                  outcome: "GOALS",
                  label: "Mota",
                  stat: 5,
                },
              ],
            },
          ]);
        });
      });
      describe("when we receive an invalid outcome", () => {
        it("should not return the tracking data", () => {
          const expressionComponents = {
            leftOperand: [
              {
                outcomeId: "FAKE_GOALS",
                timePeriodId: "MATCH",
                participantId: "6354321",
              },
              {
                operator: "+",
              },
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                decimal: 5,
              },
            ],
          };

          const result = getEnhancedTrackingData(
            FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
            expressionComponents,
            ExpressionMetadata,
            RESULT,
          );

          expect(result).toEqual([
            {
              enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
              statsListTrackingData: [],
            },
          ]);
        });
      });
    });

    describe("when is isPvpOrSquadVsSquad type and their length is one", () => {
      it("should return only Individual tracking", () => {
        const expressionComponents = {
          leftOperand: [
            {
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
              participantId: "6354321",
            },
          ],
          operator: ">",
          rightOperand: [
            {
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
              participantId: "6354322",
            },
          ],
        };

        const result = getEnhancedTrackingData(
          FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
          expressionComponents,
          ExpressionMetadata,
          RESULT,
        );

        expect(result).toEqual([
          {
            enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
            statsListTrackingData: [
              {
                outcome: "GOALS_TIME_ADJUSTED",
                label: "Joao",
                stat: 1,
              },
              {
                outcome: "GOALS_TIME_ADJUSTED",
                label: "Mota",
                stat: 5,
              },
            ],
          },
        ]);
      });
    });

    describe("when is isPvpOrSquadVsSquad", () => {
      describe("and we have all the data to build both tracking types ", () => {
        it("should return only Individual tracking", () => {
          const expressionComponents = {
            leftOperand: [
              {
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "6354321",
              },
              {
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
          };

          const result = getEnhancedTrackingData(
            FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
            expressionComponents,
            ExpressionMetadata,
            RESULT,
          );

          expect(result).toEqual([
            {
              enhancedTrackingType: EnhancedTrackingDataType.SQUAD_TRACKING,
              statsListTrackingData: [
                {
                  outcome: "GOALS_TIME_ADJUSTED",
                  label: "Joao & Mota",
                  stat: 6,
                },
                {
                  outcome: "GOALS_TIME_ADJUSTED",
                  label: "Mota",
                  stat: 5,
                },
              ],
            },
          ]);
        });
      });
      describe("when we receive an invalid outcome", () => {
        it("should return undefined for tracking", () => {
          const expressionComponents = {
            leftOperand: [
              {
                outcomeId: "FAKE_GOALS",
                timePeriodId: "MATCH",
                participantId: "6354321",
              },
              {
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
            operator: "<",
            rightOperand: [
              {
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "6354322",
              },
            ],
          };

          const result = getEnhancedTrackingData(
            FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
            expressionComponents,
            ExpressionMetadata,
            RESULT,
          );

          expect(result).toEqual([
            {
              enhancedTrackingType: EnhancedTrackingDataType.SQUAD_TRACKING,
              statsListTrackingData: [],
            },
          ]);
        });
      });
    });
  });
});
