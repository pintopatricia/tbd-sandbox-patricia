import brandSettingsReducer from "./brand-settings-reducer";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";

jest.mock("../../../actions/app-context", () => ({
  NETWORK__FETCH_APP_CONTEXT_SUCCESS: "FAKE_NETWORK__FETCH_APP_CONTEXT_SUCCESS",
}));

describe("brandSettingsReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = brandSettingsReducer(null, {});

      expect(state).toEqual({});
    });
  });

  describe("when NETWORK__FETCH_USER_CONTEXT_SUCCESS action type is received", () => {
    describe("and brandSettings is defined in the payload", () => {
      it("should return the correct payload", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                brandSettings: {
                  settingOne: { active: true },
                },
              },
            },
          },
        };

        const state = brandSettingsReducer(null, action);
        expect(state).toEqual({ settingOne: { active: true } });
      });
    });

    describe("and brandSettings is not defined in the payload", () => {
      it("should return empty object", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {},
          },
        };

        const state = brandSettingsReducer(null, action);
        expect(state).toEqual({});
      });
    });
  });
});
