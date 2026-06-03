import sportsbookbetsReducer from "./sportsbook-bets-reducer";
import {
  NETWORK__FETCH_BETS_RESULT_SUCCESS,
  NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
} from "../../../actions/my-bets";

const stateMock = {
  "ppb:sbkBet:31241921": {
    urn: "ppb:sbkBet:31241921",
    betReceiptId: "1/O 31241921",
    betType: "SGL",
    currentSize: 12.1,
    potentialWin: "312",
  },
};

describe("`sportsbookbets` reducer", () => {
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
    it('must return the new state with "sportsbook-bets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            SportsbookBet: [
              {
                urn: "ppb:sbkBet:32132512",
                betReceiptId: "1/O 32132512",
                betType: "SGL",
                currentSize: 4.76,
                potentialWin: "0.2",
              },
            ],
          },
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:sbkBet:31241921": {
          urn: "ppb:sbkBet:31241921",
          betReceiptId: "1/O 31241921",
          betType: "SGL",
          currentSize: 12.1,
          potentialWin: "312",
        },
        "ppb:sbkBet:32132512": {
          urn: "ppb:sbkBet:32132512",
          betReceiptId: "1/O 32132512",
          betType: "SGL",
          currentSize: 4.76,
          potentialWin: "0.2",
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_BETS_RESULT_SUCCESS"', () => {
    it('must return the new state with "sportsbook-bets"', () => {
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
                  legNumber: "1",
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
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:sbkBet:31241921": {
          ...stateMock["ppb:sbkBet:31241921"],
          resultType: "POTENTIAL",
          result: "WINNING",
        },
      });
    });
  });

  describe("when the bet is already with the CONFIRMED resultType in state", () => {
    it("must return the same state", () => {
      const action = {
        type: NETWORK__FETCH_BETS_RESULT_SUCCESS,
        payload: {
          bets: [
            {
              result: "LOSE",
              resultType: "POTENTIAL",
              urn: "ppb:sbkBet:31241921",
              __typename: "BetResult",
              legs: [
                {
                  legNumber: "1",
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
        },
      };

      const state = sportsbookbetsReducer(
        {
          "ppb:sbkBet:31241921": {
            ...stateMock["ppb:sbkBet:31241921"],
            resultType: "CONFIRMED",
            result: "WON",
          },
        },
        action,
      );

      expect(state).toEqual({
        "ppb:sbkBet:31241921": {
          ...stateMock["ppb:sbkBet:31241921"],
          resultType: "CONFIRMED",
          result: "WON",
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS"', () => {
    it('must return the new state with "sportsbook-bets"', () => {
      const action = {
        type: NETWORK__FETCH_BETS_MUTATION_ELIGIBILITY_SUCCESS,
        payload: {
          betEligibilities: [
            {
              betId: "31241921",
              betMutationEligibility: [
                {
                  mutation: "AccaFreeze",
                },
              ],
              legs: [
                {
                  legRef: "1",
                  legMutationEligibility: [],
                  legMutationDetails: [],
                },
              ],
            },
          ],
        },
      };
      const state = sportsbookbetsReducer(stateMock, action);

      expect(state).toEqual({
        "ppb:sbkBet:31241921": {
          ...stateMock["ppb:sbkBet:31241921"],
          mutations: {
            eligibility: [
              {
                mutation: "AccaFreeze",
              },
            ],
          },
        },
      });
    });
  });
});
