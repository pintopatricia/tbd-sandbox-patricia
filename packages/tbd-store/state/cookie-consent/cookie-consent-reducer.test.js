import { COOKIE_CONSENT__CATEGORIES_CHANGED } from "../../actions/cookie-consent";
import cookieConsent from "./cookie-consent-reducer";

let state;
const defaultState = { activeCategories: [] };

describe("Cookie consent reducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      state = cookieConsent(undefined, {});

      expect(state).toEqual(defaultState);
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      state = cookieConsent(defaultState, { type: "SOME_ACTION" });

      expect(state).toEqual(defaultState);
    });
  });

  describe('when action type is "COOKIE_CONSENT__CATEGORIES_CHANGED"', () => {
    let action;

    it("should update the state with the categories list", () => {
      action = {
        type: COOKIE_CONSENT__CATEGORIES_CHANGED,
        payload: ["C0001", "C0002", "C0003", "C0004"],
      };

      state = cookieConsent(defaultState, action);

      expect(state).toEqual({ activeCategories: ["C0001", "C0002", "C0003", "C0004"] });
    });

    describe("and the categories changed", () => {
      it("should update the categories list", () => {
        action = {
          type: COOKIE_CONSENT__CATEGORIES_CHANGED,
          payload: ["C0001", "C0003", "C0004"],
        };

        state = cookieConsent(defaultState, action);

        expect(state).toEqual({ activeCategories: ["C0001", "C0003", "C0004"] });
      });
    });
  });
});
