import sportsbookbetsReducer from "./sportsbook-bet-legs-reducer";
import {
  NETWORK__FETCH_BETS_RESULT_SUCCESS,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
} from "../../../actions/my-bets";
import { LegType } from "../../constants";
import { NETWORK__FREEZE_BET_FAILURE, NETWORK__FREEZE_BET_SUCCESS } from "../../../actions/bet-mutation";

const stateMock = {
  "ppb:sbkBetLeg:31241921/0": {
    urn: "ppb:sbkBetLeg:31241921/0",
    typename: "BetLeg",
    type: LegType.SS,
    parts: [],
    legNumber: 1,
    mutations: null,
  },
};

describe("`sportsbookbetlegs` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the current state", () => {
      const state = sportsbookbetsReducer(stateMock, {});
      expect(state).toEqual(stateMock);
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = sportsbookbetsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "sportsbook-bet-legs"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            BetLeg: [
              {
                urn: "ppb:sbkBetLeg:31241921/0",
                type: LegType.SS,
                result: "LOST",
                resultType: "CONFIRMED",
                legNumber: 1,
                parts: [],
              },
              {
                urn: "ppb:sbkBetLeg:31241921/1",
                type: LegType.SS,
                result: "WON",
                resultType: "CONFIRMED",
                legNumber: 2,
                parts: [],
              },
            ],
          },
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:sbkBetLeg:31241921/0": {
          urn: "ppb:sbkBetLeg:31241921/0",
          type: LegType.SS,
          result: "LOST",
          resultType: "CONFIRMED",
          legNumber: 1,
          parts: [],
        },
        "ppb:sbkBetLeg:31241921/1": {
          urn: "ppb:sbkBetLeg:31241921/1",
          type: LegType.SS,
          result: "WON",
          resultType: "CONFIRMED",
          legNumber: 2,
          parts: [],
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_BETS_RESULT_SUCCESS"', () => {
    it('must return the new state with "sportsbook-bet-legs"', () => {
      const legsMapperMock = new Map()
        .set("ppb:sbkBet:31241921", {
          1: "ppb:sbkBetLeg:31241921/0",
          2: "ppb:sbkBetLeg:31241921/1",
        })
        .set("ppb:sbkBet:31241922", {
          1: "ppb:sbkBetLeg:31241922/0",
        });

      const action = {
        type: NETWORK__FETCH_BETS_RESULT_SUCCESS,
        payload: {
          bets: [
            {
              result: "WIN",
              resultType: "POTENTIAL",
              urn: "ppb:sbkBet:31241921",
              __typename: "BetResult",
              legs: [
                {
                  legNumber: 1,
                  runners: [
                    {
                      id: "1",
                      marketId: "1312",
                      result: "LOSE",
                      resultType: "POTENTIAL",
                      __typename: "Runner",
                    },
                  ],
                },
                {
                  legNumber: 2,
                  runners: [
                    {
                      id: "2",
                      marketId: "1312",
                      result: "WIN",
                      resultType: "POTENTIAL",
                      __typename: "Runner",
                    },
                  ],
                },
              ],
            },
            {
              result: "PENDING",
              resultType: "UNKNOWN",
              urn: "ppb:sbkBet:31241922",
              __typename: "BetResult",
              legs: [
                {
                  legNumber: 1,
                  runners: [
                    {
                      id: "1",
                      marketId: "1312",
                      result: "LOSE",
                      resultType: "POTENTIAL",
                      __typename: "Runner",
                    },
                  ],
                },
              ],
            },
          ],
          legsMapper: legsMapperMock,
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          result: "LOSING",
          resultType: "POTENTIAL",
        },
        "ppb:sbkBetLeg:31241921/1": {
          result: "WINNING",
          resultType: "POTENTIAL",
        },
        "ppb:sbkBetLeg:31241922/0": {
          result: "LOSING",
          resultType: "POTENTIAL",
        },
      });
    });
    describe("when the leg is already with the CONFIRMED resultType in state", () => {
      it("must return the same state", () => {
        const legsMapperMock = new Map().set("ppb:sbkBet:31241921", {
          1: "ppb:sbkBetLeg:31241921/0",
          2: "ppb:sbkBetLeg:31241921/1",
        });
        const action = {
          type: NETWORK__FETCH_BETS_RESULT_SUCCESS,
          payload: {
            bets: [
              {
                result: "WIN",
                resultType: "POTENTIAL",
                urn: "ppb:sbkBet:31241921",
                __typename: "BetResult",
                legs: [
                  {
                    legNumber: 1,
                    runners: [
                      {
                        id: "1",
                        marketId: "1312",
                        result: "LOSE",
                        resultType: "POTENTIAL",
                        __typename: "Runner",
                      },
                    ],
                  },
                  {
                    legNumber: 2,
                    runners: [
                      {
                        id: "2",
                        marketId: "1312",
                        result: "WIN",
                        resultType: "POTENTIAL",
                        __typename: "Runner",
                      },
                    ],
                  },
                ],
              },
            ],
            legsMapper: legsMapperMock,
          },
        };
        const state = sportsbookbetsReducer(
          {
            "ppb:sbkBetLeg:31241921/0": {
              ...stateMock["ppb:sbkBetLeg:31241921/0"],
              result: "LOST",
              resultType: "CONFIRMED",
            },
            "ppb:sbkBetLeg:31241921/1": {
              result: "LOSING",
              resultType: "POTENTIAL",
            },
          },
          action,
        );
        expect(state).toEqual({
          "ppb:sbkBetLeg:31241921/0": {
            ...stateMock["ppb:sbkBetLeg:31241921/0"],
            result: "LOST",
            resultType: "CONFIRMED",
          },
          "ppb:sbkBetLeg:31241921/1": {
            result: "WINNING",
            resultType: "POTENTIAL",
          },
        });
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS"', () => {
    it('must return the new state with "sportsbook-bet-legs"', () => {
      const action = {
        type: NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
        payload: {
          betEligibilities: [
            {
              betId: "31241922",
              betMutationEligibility: [
                {
                  mutation: "AccaFreeze",
                  promoCode: "ACCAFREEZE2",
                },
              ],
              legs: [
                {
                  legRef: "1",
                  legMutationEligibility: [
                    {
                      mutation: "AccaFreeze",
                      mutationAvailability: "Available",
                      details: {
                        gameDetails: {
                          minute: 90,
                          homeTeamName: "Ajax Amsterdam",
                          homeTeamScore: 5,
                          awayTeamName: "Maccabi Tel Aviv FC",
                          awayTeamScore: 0,
                        },
                      },
                    },
                  ],
                  legMutationDetails: [],
                },
                {
                  legRef: "2",
                  legMutationEligibility: [
                    {
                      mutation: "AccaFreeze",
                      mutationAvailability: "Unavailable",
                      details: null,
                    },
                  ],
                  legMutationDetails: [],
                },
              ],
            },
          ],
        },
      };
      const defaultState = {
        ...stateMock,
        "ppb:sbkBetLeg:31241922/0": {
          urn: "ppb:sbkBetLeg:31241922/0",
          typename: "BetLeg",
          type: LegType.SS,
          parts: [],
          legNumber: 1,
          mutations: null,
        },
      };
      const state = sportsbookbetsReducer(defaultState, action);

      expect(state).toEqual({
        ...defaultState,
        "ppb:sbkBetLeg:31241922/0": {
          ...defaultState["ppb:sbkBetLeg:31241922/0"],
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  gameDetails: {
                    minute: 90,
                    homeTeamName: "Ajax Amsterdam",
                    homeTeamScore: 5,
                    awayTeamName: "Maccabi Tel Aviv FC",
                    awayTeamScore: 0,
                  },
                },
              },
            ],
            details: [],
          },
        },
      });
    });

    it("should not overwrite a leg mutation failure", () => {
      const action = {
        type: NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
        payload: {
          betEligibilities: [
            {
              betId: "31241921",
              betMutationEligibility: [
                {
                  mutation: "AccaFreeze",
                  promoCode: "ACCAFREEZE2",
                },
              ],
              legs: [
                {
                  legRef: "1",
                  legMutationEligibility: [
                    {
                      mutation: "AccaFreeze",
                      mutationAvailability: "Available",
                      details: {
                        gameDetails: {
                          minute: 90,
                          homeTeamName: "Ajax Amsterdam",
                          homeTeamScore: 5,
                          awayTeamName: "Maccabi Tel Aviv FC",
                          awayTeamScore: 0,
                        },
                      },
                    },
                  ],
                  legMutationDetails: [],
                },
                {
                  legRef: "2",
                  legMutationEligibility: [
                    {
                      mutation: "AccaFreeze",
                      mutationAvailability: "Unavailable",
                      details: null,
                    },
                  ],
                  legMutationDetails: [],
                },
              ],
            },
          ],
        },
      };
      const startingState = JSON.parse(JSON.stringify(stateMock));
      startingState["ppb:sbkBetLeg:31241921/0"].mutations = {
        failure: true,
      };
      const state = sportsbookbetsReducer(startingState, action);

      expect(state).toEqual({
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
                details: {
                  gameDetails: {
                    minute: 90,
                    homeTeamName: "Ajax Amsterdam",
                    homeTeamScore: 5,
                    awayTeamName: "Maccabi Tel Aviv FC",
                    awayTeamScore: 0,
                  },
                },
              },
            ],
            details: [],
            failure: true,
          },
        },
      });
    });
  });

  describe('when action type is "NETWORK__FREEZE_BET_SUCCESS"', () => {
    it("returns current state when leg mutations is null", () => {
      const action = {
        type: NETWORK__FREEZE_BET_SUCCESS,
        payload: {
          freezeLiveDataDetails: {
            minute: 5,
            homeTeamName: "Manchester United",
            homeTeamScore: 5,
            awayTeamName: "Stockport County",
            awayTeamScore: 2,
          },
          betId: "31241921",
          legRef: 1,
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
    it("adds the freezeDetails to the leg's mutation details", () => {
      const action = {
        type: NETWORK__FREEZE_BET_SUCCESS,
        payload: {
          freezeLiveDataDetails: {
            minute: 5,
            homeTeamName: "Manchester United",
            homeTeamScore: 5,
            awayTeamName: "Stockport County",
            awayTeamScore: 2,
          },
          betId: "31241921",
          legRef: 1,
        },
      };
      const currentState = {
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
              },
            ],
            failure: true,
          },
        },
      };
      const state = sportsbookbetsReducer(currentState, action);
      expect(state).toEqual({
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          mutations: {
            ...currentState["ppb:sbkBetLeg:31241921/0"].mutations,
            details: [
              {
                freezeDetails: {
                  ...action.payload.freezeLiveDataDetails,
                },
              },
            ],
            failure: undefined,
          },
        },
      });
    });
  });

  describe('when action type is "NETWORK__FREEZE_BET_FAILURE"', () => {
    it("adds failures to the bet leg mutations", () => {
      const action = {
        type: NETWORK__FREEZE_BET_FAILURE,
        payload: {
          betId: "31241921",
          legRef: 1,
          respStatus: "NOT_ELIGIBLE",
        },
      };
      const currentState = {
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
                mutationAvailability: "Available",
              },
            ],
          },
        },
      };
      const state = sportsbookbetsReducer(currentState, action);
      expect(state).toEqual({
        "ppb:sbkBetLeg:31241921/0": {
          ...stateMock["ppb:sbkBetLeg:31241921/0"],
          mutations: {
            ...currentState["ppb:sbkBetLeg:31241921/0"].mutations,
            failure: true,
          },
        },
      });
    });
  });
});
