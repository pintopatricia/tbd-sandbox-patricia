import sportsbookbetsReducer from "./sportsbook-bet-cards-reducer";

// Define mock data
const urnMock = "ppb:tbd:card:sbkBet:897923807";

const betMock = {
  urn: urnMock,
  betURN: "ppb:sbkBet:897923807",
  type: "SPORTSBOOK_BET_CARD",
};

const stateMock = {
  [urnMock]: betMock,
};

describe("`sportsbookbets` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = sportsbookbetsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when don't have any action type", () => {
    it("must return the same state", () => {
      const state = sportsbookbetsReducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "sportsbookbets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            SportsbookBetCard: [betMock],
          },
        },
      };
      const state = sportsbookbetsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = sportsbookbetsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
