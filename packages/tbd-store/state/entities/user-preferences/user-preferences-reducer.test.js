import { LastViewedProductOption, ProductsOption } from "./UserPreferences.types";

import { UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE } from "../../../actions/betslip";
import { UI__USER_PROFILE_EYE_ICON_CLICK } from "../../../actions/user-profile";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";
import {
  UPDATE_MARKET_DEPTH,
  UPDATE_TIME_FORM_COLLAPSE,
  UPDATE_PRODUCT_PREFERENCE,
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
  UPDATE_EMBEDDED_CONTENT_COLLAPSE,
  NETWORK__SET_USER_PREFERENCE_FAILURE,
} from "../../../actions/preferences";
import { UPDATE_PREFERENCE_SUCCESS } from "../../../actions/catalogue";
import { UI__MAINTENANCE_TO_PRODUCT } from "../../../actions/navigation";

import userPreferencesReducer from "./user-preferences-reducer";

jest.mock("../../../actions/app-context", () => ({
  NETWORK__FETCH_APP_CONTEXT_SUCCESS: "FAKE_NETWORK__FETCH_APP_CONTEXT_SUCCESS",
}));

jest.mock("../../../actions/betslip", () => ({
  UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE: "FAKE_UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE",
}));

jest.mock("../../../actions/catalogue", () => ({
  UPDATE_PREFERENCE_SUCCESS: "FAKE_UPDATE_PREFERENCE_SUCCESS",
  UPDATE_PREFERENCE_FAILURE: "FAKE_UPDATE_PREFERENCE_FAILURE",
}));

jest.mock("../../../actions/navigation", () => ({
  UI__MAINTENANCE_TO_PRODUCT: "FAKE_UI__MAINTENANCE_TO_PRODUCT",
}));

jest.mock("../../../actions/preferences", () => ({
  UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS: "FAKE_UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS",
  UPDATE_MARKET_DEPTH: "FAKE_UPDATE_MARKET_DEPTH",
  UPDATE_PRODUCT_PREFERENCE: "FAKE_UPDATE_PRODUCT_PREFERENCE",
  UPDATE_TIME_FORM_COLLAPSE: "FAKE_UPDATE_TIME_FORM_COLLAPSE",
  UPDATE_EMBEDDED_CONTENT_COLLAPSE: "UPDATE_EMBEDDED_CONTENT_COLLAPSE",
  NETWORK__SET_USER_PREFERENCE_FAILURE: "FAKE_NETWORK__SET_USER_PREFERENCE_FAILURE",
}));

jest.mock("../../../actions/user-profile", () => ({
  UI__USER_PROFILE_EYE_ICON_CLICK: "FAKE_UI__USER_PROFILE_EYE_ICON_CLICK",
}));

describe('"preferences" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = userPreferencesReducer({ stateA: "value for state A" }, {});

      expect(state).toEqual({ stateA: "value for state A" });
    });
  });

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    it("should update state preferences if the payload preferences are defined", () => {
      const state = userPreferencesReducer(
        {
          showBalances: false,
          oddsMovement: false,
        },
        {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                userdetails: {},
                preferences: {
                  showBalances: true,
                  oddsMovement: true,
                },
              },
            },
          },
        },
      );

      expect(state).toEqual({
        showBalances: true,
        oddsMovement: true,
      });
    });

    it("should return the same unchanged object if payload is not defined correctly", () => {
      const oldState = {
        showBalances: false,
        oddsMovement: false,
      };
      const state = userPreferencesReducer(oldState, {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          initialState: null,
        },
      });

      expect(state).toEqual({
        showBalances: false,
        oddsMovement: false,
      });

      expect(state).toEqual(oldState);

      const state2 = userPreferencesReducer(oldState, {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          initialState: { entities: null },
        },
      });

      expect(state2).toEqual({
        showBalances: false,
        oddsMovement: false,
      });
    });
  });

  describe("when action type is UI__USER_PROFILE_EYE_ICON_CLICK", () => {
    it("must 'toggle' the showBalances preference", () => {
      const state = userPreferencesReducer(
        {
          showBalances: false,
        },
        {
          type: UI__USER_PROFILE_EYE_ICON_CLICK,
          payload: {
            showBalances: true,
          },
        },
      );

      expect(state).toEqual({
        showBalances: true,
      });
    });
  });

  describe("when action type is UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE", () => {
    it("must 'toggle' the oddsMovement preference", () => {
      const state = userPreferencesReducer(
        {
          oddsMovement: false,
        },
        {
          type: UI__BETSLIP_SBK_ODDS_MOVEMENT_PREFERENCE_CHANGE,
          payload: {
            isOddsMovementAccepted: true,
          },
        },
      );

      expect(state).toEqual({
        oddsMovement: true,
      });
    });
  });

  describe("when action type is UPDATE_MARKET_DEPTH", () => {
    it("must return the updated state", () => {
      const state = userPreferencesReducer(
        { isMarketDepthActive: false },
        {
          type: UPDATE_MARKET_DEPTH,
          payload: { isActive: true, urn: "urn" },
        },
      );

      expect(state).toEqual({ isMarketDepthActive: true });
    });
  });

  describe("when action type is UPDATE_TIME_FORM_COLLAPSE", () => {
    it("must return the updated state", () => {
      const state = userPreferencesReducer(
        { isTimeFormCardCollapsed: false },
        {
          type: UPDATE_TIME_FORM_COLLAPSE,
          payload: { isCollapsed: true },
        },
      );

      expect(state).toEqual({ isTimeFormCardCollapsed: true });
    });
  });

  describe("when action type is UPDATE_EMBEDDED_CONTENT_COLLAPSE", () => {
    it("must return the updated state", () => {
      const state = userPreferencesReducer(
        { isEmbeddedCardCollapsed: false },
        {
          type: UPDATE_EMBEDDED_CONTENT_COLLAPSE,
          payload: { isCollapsed: true },
        },
      );

      expect(state).toEqual({ isEmbeddedCardCollapsed: true });
    });
  });

  describe("when action type is UPDATE_PREFERENCE_SUCCESS", () => {
    it("must return the updated state", () => {
      const state = userPreferencesReducer(
        { sportsbookOddsDisplay: "FRACTIONAL" },
        {
          type: UPDATE_PREFERENCE_SUCCESS,
          payload: { userPreferences: { sportsbookOddsDisplay: "DECIMAL" } },
        },
      );

      expect(state).toEqual({ sportsbookOddsDisplay: "DECIMAL" });
    });

    describe("when updated preference is 'oddsMovement'", () => {
      describe("when 'oddsMovement' is a string", () => {
        it("should return mapped value to boolean", () => {
          const state = userPreferencesReducer(
            {},
            {
              type: UPDATE_PREFERENCE_SUCCESS,
              payload: { userPreferences: { oddsMovement: "ON" } },
            },
          );

          expect(state).toEqual({ oddsMovement: true });
        });
      });
    });
  });

  describe("when action type is NETWORK__SET_USER_PREFERENCE_FAILURE", () => {
    it("must return the state with NO update", () => {
      const prevState = userPreferencesReducer(
        { sportsbookOddsDisplay: "FRACTIONAL" },
        {
          type: UPDATE_PREFERENCE_SUCCESS,
          payload: { userPreferences: { oddsMovement: "ON" } },
        },
      );

      const state = userPreferencesReducer(
        { ...prevState },
        {
          type: NETWORK__SET_USER_PREFERENCE_FAILURE,
          payload: { userPreferences: { sportsbookOddsDisplay: "DECIMAL" } },
        },
      );

      expect(state).toEqual({ sportsbookOddsDisplay: "FRACTIONAL", oddsMovement: true });
    });

    describe("when updated preference is 'oddsMovement'", () => {
      describe("when previous state oddsMovement was true, and new 'oddsMovement' is a string", () => {
        it("should return previously mapped value to boolean and not update the state", () => {
          const prevState = userPreferencesReducer(
            {},
            {
              type: UPDATE_PREFERENCE_SUCCESS,
              payload: { userPreferences: { oddsMovement: "ON" } },
            },
          );

          const state = userPreferencesReducer(
            { ...prevState },
            {
              type: NETWORK__SET_USER_PREFERENCE_FAILURE,
              payload: { userPreferences: { oddsMovement: "OFF" } },
            },
          );

          expect(state).toEqual({ oddsMovement: true });
        });
      });

      describe("when previous state oddsMovement was false, and new 'oddsMovement' is a string", () => {
        it("should return previously mapped value to boolean and not update the state", () => {
          const prevState = userPreferencesReducer(
            {},
            {
              type: UPDATE_PREFERENCE_SUCCESS,
              payload: { userPreferences: { oddsMovement: "OFF" } },
            },
          );

          const state = userPreferencesReducer(
            { ...prevState },
            {
              type: NETWORK__SET_USER_PREFERENCE_FAILURE,
              payload: { userPreferences: { oddsMovement: "ON" } },
            },
          );

          expect(state).toEqual({ oddsMovement: false });
        });
      });

      describe("when oddsMovement is not a string", () => {
        it("should return provided value", () => {
          const prevState = userPreferencesReducer(
            {},
            {
              type: UPDATE_PREFERENCE_SUCCESS,
              payload: { userPreferences: { oddsMovement: "ON" } },
            },
          );

          const state = userPreferencesReducer(
            { ...prevState },
            {
              type: NETWORK__SET_USER_PREFERENCE_FAILURE,
              payload: { userPreferences: { oddsMovement: false } },
            },
          );

          expect(state).toEqual({ oddsMovement: true });
        });
      });
    });
  });

  describe("when action type is UPDATE_PRODUCT_PREFERENCE", () => {
    describe("and selected product is games", () => {
      it("must return the same state", () => {
        const state = userPreferencesReducer(
          { productSwitcherPreference: ProductsOption.sportsbook },
          {
            type: UPDATE_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: ProductsOption.games },
          },
        );

        expect(state).toEqual({ productSwitcherPreference: ProductsOption.sportsbook });
      });
    });

    describe.each`
      product
      ${ProductsOption.sportsbook}
      ${ProductsOption.exchange}
    `("and selected product is $product", ({ product }) => {
      it("must return the updated state", () => {
        const state = userPreferencesReducer(
          { productSwitcherPreference: ProductsOption.exchange },
          {
            type: UPDATE_PRODUCT_PREFERENCE,
            payload: { productSwitcherPreference: product },
          },
        );

        expect(state).toEqual({ productSwitcherPreference: product });
      });
    });
  });

  describe("when action type is UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS", () => {
    it("must return the updated state", () => {
      const state = userPreferencesReducer(
        {},
        {
          type: UPDATE_LAST_VIEWED_PRODUCT_PREFERENCE_SUCCESS,
          payload: { lastViewedProductPreference: LastViewedProductOption.sportsbook },
        },
      );

      expect(state).toEqual({ lastViewedProduct: LastViewedProductOption.sportsbook });
    });
  });

  describe("when action type is UI__MAINTENANCE_TO_PRODUCT", () => {
    describe("and selected product is games", () => {
      it("must return the same state", () => {
        const state = userPreferencesReducer(
          { productSwitcherPreference: ProductsOption.exchange },
          {
            type: UI__MAINTENANCE_TO_PRODUCT,
            payload: { product: ProductsOption.games, view: "some:view:urn" },
          },
        );

        expect(state).toEqual({ productSwitcherPreference: ProductsOption.exchange });
      });
    });

    describe.each`
      product
      ${ProductsOption.sportsbook}
      ${ProductsOption.exchange}
    `("and selected product is $product", ({ product }) => {
      it("must return the updated state", () => {
        const state = userPreferencesReducer(
          { productSwitcherPreference: "Exchange" },
          {
            type: UI__MAINTENANCE_TO_PRODUCT,
            payload: { product, view: "some:view:urn" },
          },
        );

        expect(state).toEqual({ productSwitcherPreference: product });
      });
    });
  });
});
