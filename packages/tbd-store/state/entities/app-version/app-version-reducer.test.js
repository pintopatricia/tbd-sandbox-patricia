import appVersionReducer from "./app-version-reducer";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";
import { NETWORK__FETCH_APP_VERSION_SUCCESS } from "../../../actions/app-version";

describe("appVersionReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = appVersionReducer(null, {});

      expect(state).toBeNull();
    });
  });

  describe("when NETWORK__FETCH_USER_CONTEXT_SUCCESS action type is received", () => {
    describe("and appversion is defined in the payload", () => {
      it("should merge the payload", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                appversion: {
                  android: {
                    playStore: "playStoreUrl",
                  },
                  ios: {
                    appStore: "appStoreUrl",
                  },
                },
              },
            },
          },
        };

        const state = appVersionReducer(
          {
            android: {
              playStore: "androidSomeUrl",
            },
            ios: {
              appStore: "iosSomeUrl",
            },
          },
          action,
        );

        expect(state).toEqual({
          android: {
            playStore: "playStoreUrl",
          },
          ios: {
            appStore: "appStoreUrl",
          },
        });
      });

      it("should still merge the payload when initialState is null", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: null,
          },
        };

        const state = appVersionReducer(
          {
            android: {
              playStore: "androidSomeUrl",
            },
            ios: {
              appStore: "iosSomeUrl",
            },
          },
          action,
        );

        expect(state).toEqual({
          android: {
            playStore: "androidSomeUrl",
          },
          ios: {
            appStore: "iosSomeUrl",
          },
        });
      });
    });

    describe("and appversion is not defined in the payload", () => {
      it("should return null", () => {
        const action = {
          type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
          payload: {
            initialState: {
              entities: {
                appversion: null,
              },
            },
          },
        };

        const state = appVersionReducer(null, action);

        expect(state).toBeNull();
      });
    });
  });

  describe("when NETWORK__FETCH_APP_VERSION_SUCCESS action type is received", () => {
    describe("and appversion is defined in the payload", () => {
      it("should merge the payload", () => {
        const action = {
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: {
            android: {
              playStore: "playStoreUrl",
            },
            ios: {
              appStore: "appStoreUrl",
            },
          },
        };

        const state = appVersionReducer(
          {
            android: {
              playStore: "androidSomeUrl",
            },
            ios: {
              appStore: "iosSomeUrl",
            },
          },
          action,
        );

        expect(state).toEqual({
          android: {
            playStore: "playStoreUrl",
          },
          ios: {
            appStore: "appStoreUrl",
          },
        });
      });
    });

    describe("and appversion is not defined in the payload", () => {
      it("should return null", () => {
        const action = {
          type: NETWORK__FETCH_APP_VERSION_SUCCESS,
          payload: null,
        };

        const state = appVersionReducer(null, action);

        expect(state).toBeNull();
      });
    });
  });
});
