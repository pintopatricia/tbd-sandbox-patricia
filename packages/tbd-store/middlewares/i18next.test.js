import i18next from "i18next";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import { i18nextMiddleware } from "./i18next";

jest.mock("i18next", () => ({
  changeLanguage: jest.fn(),
}));

const storeMock = { getState: jest.fn(() => "getStateMock") };

function setup(nextSpy = jest.fn()) {
  return {
    dispatch: (actionType, payload = {}) =>
      i18nextMiddleware(storeMock)(nextSpy)({
        type: actionType,
        payload,
      }),
  };
}

describe("i18next Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    it("should call changeLanguage with the correct localeCodeBcp47", async () => {
      const nextSpy = jest.fn();
      const payload = {
        initialState: {
          entities: {
            userdetails: { localeCodeBcp47: "localeCode" },
          },
        },
      };

      await setup(nextSpy).dispatch(NETWORK__FETCH_APP_CONTEXT_SUCCESS, payload);

      expect(i18next.changeLanguage).toHaveBeenCalledWith("localeCode");

      expect(nextSpy).toHaveBeenCalledWith({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload,
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call i18next when the userdetails is null", async () => {
      const nextSpy = jest.fn();
      const payload = {
        initialState: {
          entities: { userdetails: null },
        },
      };

      await setup(nextSpy).dispatch(NETWORK__FETCH_APP_CONTEXT_SUCCESS, payload);

      expect(i18next.changeLanguage).not.toHaveBeenCalled();
    });

    it("should not call i18next when the initialState is null", async () => {
      const nextSpy = jest.fn();
      const payload = {
        initialState: null,
      };

      await setup(nextSpy).dispatch(NETWORK__FETCH_APP_CONTEXT_SUCCESS, payload);

      expect(i18next.changeLanguage).not.toHaveBeenCalled();
    });
  });

  describe("when action type is unknown", () => {
    it("should ignore the action", async () => {
      const nextSpy = jest.fn();
      await setup(nextSpy).dispatch("ANY_ACTION", { fake: "payload" });

      expect(i18next.changeLanguage).not.toHaveBeenCalled();

      expect(nextSpy).toHaveBeenCalledWith({ type: "ANY_ACTION", payload: { fake: "payload" } });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });
});
