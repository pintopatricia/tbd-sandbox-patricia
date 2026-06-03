import obbParticipantsReducer from "./obb-participants-reducer";

const obbParticipants = [
  {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:4404/e/33956657",
    incidentTypes: {},
    player: {
      id: "4404",
      name: "Ashley Barnes",
      position: null,
      seasonStats: {
        averages: {
          goals: 0,
          redCards: 0,
          yellowCards: 0.11,
          yellowRedCards: 0,
          shotsOnTarget: 0.11,
          totalShots: 0.44,
          __typename: "FootballPlayerStat",
        },
        __typename: "FootballPlayerSeasonStats",
      },
      __typename: "FootballPlayer",
    },
    team: {
      name: "Burnley",
      __typename: "FootballTeamDetails",
    },
  },
  {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:4520/e/33956657",
    incidentTypes: {},
    player: {
      id: "4520",
      name: "Jay Rodriguez",
      position: null,
      seasonStats: {
        averages: {
          goals: 0.1,
          redCards: 0,
          yellowCards: 0.05,
          yellowRedCards: 0,
          shotsOnTarget: 0.15,
          totalShots: 0.65,
          __typename: "FootballPlayerStat",
        },
        __typename: "FootballPlayerSeasonStats",
      },
      __typename: "FootballPlayer",
    },
    team: {
      name: "Burnley",
      __typename: "FootballTeamDetails",
    },
  },
];

const stateMock = {
  "ppb:obb:footballPlayer:4404/e/33956657": {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:4404/e/33956657",
    incidentTypes: {},
    player: {
      id: "4404",
      name: "Ashley Barnes",
      position: null,
      seasonStats: {
        averages: {
          goals: 0,
          redCards: 0,
          yellowCards: 0.11,
          yellowRedCards: 0,
          shotsOnTarget: 0.11,
          totalShots: 0.44,
          __typename: "FootballPlayerStat",
        },
        __typename: "FootballPlayerSeasonStats",
      },
      __typename: "FootballPlayer",
    },
    team: {
      name: "Burnley",
      __typename: "FootballTeamDetails",
    },
  },
  "ppb:obb:footballPlayer:4520/e/33956657": {
    __typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:4520/e/33956657",
    incidentTypes: {},
    player: {
      id: "4520",
      name: "Jay Rodriguez",
      position: null,
      seasonStats: {
        averages: {
          goals: 0.1,
          redCards: 0,
          yellowCards: 0.05,
          yellowRedCards: 0,
          shotsOnTarget: 0.15,
          totalShots: 0.65,
          __typename: "FootballPlayerStat",
        },
        __typename: "FootballPlayerSeasonStats",
      },
      __typename: "FootballPlayer",
    },
    team: {
      name: "Burnley",
      __typename: "FootballTeamDetails",
    },
  },
};

describe('"obbParticipants" reducer', () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = obbParticipantsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when the action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('should return the new state with "OBB Participants"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbPvpCard: [{ typename: "ObbPvpCard", participants: obbParticipants }],
            ObbSquadBetCard: [
              {
                typename: "ObbSquadBetCard",
                eventParticipants: obbParticipants,
                squadParticipants: [obbParticipants[0]],
              },
            ],
            ObbCreatedBetsCard: [
              {
                typename: "ObbCreatedBetsCard",
                bettingOpportunities: [
                  {
                    participants: obbParticipants,
                  },
                ],
              },
            ],
            ObbSquadVsSquadCard: [
              {
                typename: "ObbSquadVsSquadCard",
                eventParticipants: obbParticipants,
                firstSquadParticipants: [obbParticipants[0]],
                secondSquadParticipants: [obbParticipants[0]],
              },
            ],
            ObbEventPopularsCard: [
              {
                typename: "ObbEventPopularsCard",
                popularBettingOpportunities: [
                  {
                    participants: obbParticipants,
                  },
                ],
              },
            ],
          },
        },
      };

      const state = obbParticipantsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("should return current state merged with the new one", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbPvpCard: [{ typename: "ObbPvpCard", participants: obbParticipants }],
          },
        },
      };

      const state = obbParticipantsReducer(stateMock, action);

      expect(state).toEqual(stateMock);
    });

    it("should keep the previous incidentTypes", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbPvpCard: [{ typename: "ObbPvpCard", participants: obbParticipants }],
          },
        },
      };

      const stateMockWithIncidentTypes = {
        ...stateMock,
        "ppb:obb:footballPlayer:4404/e/33956657": {
          ...stateMock["ppb:obb:footballPlayer:4404/e/33956657"],
          incidentTypes: { GOALS: { id: "GOALS" } },
        },
      };

      const state = obbParticipantsReducer(stateMockWithIncidentTypes, action);
      expect(state).toEqual({
        ...stateMockWithIncidentTypes,
        "ppb:obb:footballPlayer:4404/e/33956657": {
          ...stateMockWithIncidentTypes["ppb:obb:footballPlayer:4404/e/33956657"],
          incidentTypes: { GOALS: { id: "GOALS" } },
        },
      });
    });

    it("should return the current state", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {},
        },
      };

      const state = obbParticipantsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe("when the action type is OBB_PARTICIPANTS_STATE_UPDATE", () => {
    it("should return the new state", () => {
      const action = {
        type: "OBB_PARTICIPANTS/STATE_UPDATE",
        payload: {
          participants: {
            "urn:participant:1": { urn: "urn:participant:1" },
            "urn:participant:2": { urn: "urn:participant:2" },
          },
        },
      };

      const state = obbParticipantsReducer(undefined, action);

      expect(state).toEqual({
        "urn:participant:1": { urn: "urn:participant:1" },
        "urn:participant:2": { urn: "urn:participant:2" },
      });
    });
  });
});
