import exchangeBettingBonusReducer from "./exchange-betting-bonus-reducer";
import { NETWORK__IMPLY_EXC_BET_SUCCESS, NETWORK__IMPLY_EXC_BET_FAILURE } from "../../../actions/betslip";

const MARKET_BONUS = {
  hasBonusMoney: true,
  wallets: ["some wallet", "some other wallet"],
};

const stateMock = {
  state: "state",
};

describe("exchangeBettingBonusReducer reducer", () => {
  describe("when state is undefined", () => {
    it("should return the default state", () => {
      const state = exchangeBettingBonusReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action is NETWORK__IMPLY_EXC_BET_SUCCESS", () => {
    it("should set the payload as the new state", () => {
      const state = exchangeBettingBonusReducer(stateMock, {
        type: NETWORK__IMPLY_EXC_BET_SUCCESS,
        payload: MARKET_BONUS,
      });

      expect(state).toEqual(MARKET_BONUS);
    });

    describe("and when the action is NETWORK__IMPLY_EXC_BET_FAILURE", () => {
      it("should remove the previous state", () => {
        const state = exchangeBettingBonusReducer(stateMock, {
          type: NETWORK__IMPLY_EXC_BET_FAILURE,
        });

        expect(state).toEqual({});
      });
    });
  });

  describe("when action is not met", () => {
    it("should return the same state", () => {
      const state = exchangeBettingBonusReducer(stateMock, {});

      expect(state).toBe(stateMock);
    });
  });
});
