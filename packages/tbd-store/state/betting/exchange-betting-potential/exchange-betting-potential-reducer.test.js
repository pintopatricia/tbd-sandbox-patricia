import { exchangeBettingPotentialStateReducer } from "./exchange-betting-potential-reducer";
import {
  BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
  BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
  BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
} from "../../../actions/betting";
import { ExchangeSide } from "../../constants";

describe("exchangeBettingPotentialStateReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = exchangeBettingPotentialStateReducer(undefined, {});

      expect(state).toStrictEqual({});
    });
  });

  describe("when 'BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION' action type is met", () => {
    it("should return the state updated", () => {
      const priceValidation = {
        reason: "tell me why",
        value: 2,
        maximum: 2,
      };
      const action = {
        type: BETTING__INVALID_UPDATE_PRICE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
          error: priceValidation,
          price: 99,
        },
      };

      const state = exchangeBettingPotentialStateReducer({}, action);

      expect(state).toStrictEqual({
        "runner:urn": {
          back: {
            price: 99,
            priceValidation: { ...priceValidation },
          },
        },
      });
    });
  });

  describe("when 'BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION' action type is met", () => {
    it("should return the state updated", () => {
      const sizeValidation = "some error";
      const action = {
        type: BETTING__INVALID_UPDATE_SIZE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
          error: sizeValidation,
          size: 0.5,
        },
      };

      const state = exchangeBettingPotentialStateReducer({}, action);

      expect(state).toStrictEqual({
        "runner:urn": {
          back: {
            size: 0.5,
            sizeValidation,
          },
        },
      });
    });
  });

  describe("when 'BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION' action type is met", () => {
    it("should return the state updated", () => {
      const currentState = {
        "runner:urn": {
          back: {
            reason: "tell me why",
            value: 2,
            maximum: 2,
          },
        },
      };
      const action = {
        type: BETTING__VALID_UPDATE_POTENTIAL_BET_ACTION,
        payload: {
          runner: "runner:urn",
          side: ExchangeSide.BACK,
          price: 99,
          size: 10,
        },
      };

      const state = exchangeBettingPotentialStateReducer(currentState, action);

      expect(state).toStrictEqual({
        "runner:urn": {
          back: {
            price: 99,
            priceValidation: undefined,
            size: 10,
            sizeValidation: undefined,
          },
        },
      });
    });
  });

  describe("when 'BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION' action type is met", () => {
    it("should return the state updated", () => {
      const currentState = {
        "runner:urn": {
          back: {
            reason: "tell me why",
            value: 2,
            maximum: 2,
          },
        },
      };
      const action = {
        type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
      };

      const state = exchangeBettingPotentialStateReducer(currentState, action);

      expect(state).toStrictEqual({});
    });
  });
});
