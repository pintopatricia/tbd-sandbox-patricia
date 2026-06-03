import { NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS } from "../actions/obb";
import { ERROR_CODES } from "../helpers/obb";
import { obbCardsMiddleware } from "./obb-cards";

const obbParticipantsMock = {
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

function setup(
  action,
  nextSpy = jest.fn(),
  dispatchSpy = jest.fn(),
  entities = { obbParticipants: obbParticipantsMock },
  typename = "ObbSquadBetCard",
) {
  const state = {
    entities,
    layouts: {
      cards: {
        obbcards: {
          "card:urn": {
            typename,
          },
        },
      },
    },
  };

  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return obbCardsMiddleware(store)(nextSpy)(action);
}

describe("Obb Cards Middleware", () => {
  describe("when the action type is 'NETWORK/FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS'", () => {
    describe("when the one of the cardParticipants does not exist in the current state", () => {
      it("should dispatch the state update action empty participants", () => {
        const dispatchSpy = jest.fn();

        setup(
          {
            type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
            payload: {
              cardParticipants: ["fake:urn"],
              eventParticipants: [],
              requestInput: {
                event: "event:urn",
                incidentType: "GOALS",
                period: "MATCH",
              },
              cardUrn: "card:urn",
            },
          },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "OBB_PARTICIPANTS/STATE_UPDATE",
          payload: {
            participants: {},
          },
        });
      });
    });

    describe("when the participant exists in the card but not on the eventParticipants", () => {
      it("should return the state with the participant incidentTypes empty", () => {
        const dispatchSpy = jest.fn();

        setup(
          {
            type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
            payload: {
              cardParticipants: ["ppb:obb:footballPlayer:4404/e/33956657"],
              eventParticipants: [],
              requestInput: {
                event: "event:urn",
                incidentType: "GOALS",
                period: "MATCH",
              },
              cardUrn: "card:urn",
            },
          },
          jest.fn(),
          dispatchSpy,
          {
            obbParticipants: {
              ...obbParticipantsMock,
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: { GOALS: { id: "GOALS" } },
              },
            },
          },
        );

        expect(dispatchSpy).toHaveBeenCalledTimes(2);

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: "OBB_CARD/SET_SQUADBET_MODAL_ERROR",
          payload: { cardUrn: "card:urn", errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP },
        });

        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: "OBB_PARTICIPANTS/STATE_UPDATE",
          payload: {
            participants: {
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: {},
              },
            },
          },
        });
      });
    });

    describe("when the participant previously add the incidentType but not on eventParticipants", () => {
      it("should remove the incidentType", () => {
        const dispatchSpy = jest.fn();

        const stateMockWithIncidentTypes = {
          ...obbParticipantsMock,
          "ppb:obb:footballPlayer:4404/e/33956657": {
            ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
            incidentTypes: { GOALS: { id: "GOALS" }, SHOTS: { id: "SHOTS" } },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
            payload: {
              cardParticipants: ["ppb:obb:footballPlayer:4404/e/33956657"],
              eventParticipants: [
                {
                  urn: "ppb:obb:footballPlayer:4404/e/33956657",
                  incidentTypes: [],
                },
              ],
              requestInput: {
                event: "event:urn",
                incidentType: "GOALS",
                period: "MATCH",
              },
              cardUrn: "card:urn",
            },
          },
          jest.fn(),
          dispatchSpy,
          {
            obbParticipants: { ...stateMockWithIncidentTypes },
          },
        );

        expect(dispatchSpy).toHaveBeenCalledTimes(2);

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: "OBB_CARD/SET_SQUADBET_MODAL_ERROR",
          payload: { cardUrn: "card:urn", errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP },
        });

        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: "OBB_PARTICIPANTS/STATE_UPDATE",
          payload: {
            participants: {
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...stateMockWithIncidentTypes["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: { SHOTS: { id: "SHOTS" } },
              },
            },
          },
        });
      });
    });

    describe("when new incidentTypes are added to the participant", () => {
      it("should add the incidentType", () => {
        const dispatchSpy = jest.fn();

        const stateMockWithIncidentTypes = {
          ...obbParticipantsMock,
          "ppb:obb:footballPlayer:4404/e/33956657": {
            ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
            incidentTypes: { GOALS: { id: "GOALS" }, SHOTS: { id: "SHOTS" } },
          },
        };

        setup(
          {
            type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
            payload: {
              cardParticipants: ["ppb:obb:footballPlayer:4404/e/33956657"],
              eventParticipants: [
                {
                  urn: "ppb:obb:footballPlayer:4404/e/33956657",
                  incidentTypes: [
                    {
                      id: "CARDS",
                    },
                  ],
                },
              ],
              requestInput: {
                event: "event:urn",
                incidentType: "CARDS",
                period: "MATCH",
              },
            },
          },
          jest.fn(),
          dispatchSpy,
          {
            obbParticipants: { ...stateMockWithIncidentTypes },
          },
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: "OBB_PARTICIPANTS/STATE_UPDATE",
          payload: {
            participants: {
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...stateMockWithIncidentTypes["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: { GOALS: { id: "GOALS" }, SHOTS: { id: "SHOTS" }, CARDS: { id: "CARDS" } },
              },
            },
          },
        });
      });
    });

    describe("when the card typename is 'ObbSquadVsSquadCard'", () => {
      it("should dispatch the squad vs squad modal error instead of squad bet", () => {
        const dispatchSpy = jest.fn();

        setup(
          {
            type: NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS,
            payload: {
              cardParticipants: ["ppb:obb:footballPlayer:4404/e/33956657"],
              eventParticipants: [],
              requestInput: {
                event: "event:urn",
                incidentType: "GOALS",
                period: "MATCH",
              },
              cardUrn: "card:urn",
            },
          },
          jest.fn(),
          dispatchSpy,
          {
            obbParticipants: {
              ...obbParticipantsMock,
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: { GOALS: { id: "GOALS" } },
              },
            },
          },
          "ObbSquadVsSquadCard",
        );

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: "OBB_CARD/SET_SQUADVSSQUAD_MODAL_ERROR",
          payload: {
            cardUrn: "card:urn",
            errorCode: ERROR_CODES.PLAYER_REMOVED_FROM_LINEUP,
          },
        });

        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: "OBB_PARTICIPANTS/STATE_UPDATE",
          payload: {
            participants: {
              "ppb:obb:footballPlayer:4404/e/33956657": {
                ...obbParticipantsMock["ppb:obb:footballPlayer:4404/e/33956657"],
                incidentTypes: {},
              },
            },
          },
        });
      });
    });
  });
});
