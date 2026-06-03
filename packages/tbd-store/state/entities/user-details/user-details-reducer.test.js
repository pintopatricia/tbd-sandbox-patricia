import userDetailsReducer from "./user-details-reducer";

describe("user details reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = userDetailsReducer(undefined, {});

      expect(state).toEqual({
        loggedIn: false,
        isAuthenticating: false,
        localeCode: "en_GB",
        localeCodeBcp47: "en-GB",
        timezone: "Europe/London",
        countryCode: "GB",
      });
    });
  });

  describe("when action type is NETWORK/FETCH_APP_CONTEXT_SUCCESS", () => {
    it("must return the state populated with the user details", () => {
      const state = userDetailsReducer(
        { isAuthenticating: false },
        {
          type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
          payload: { initialState: { entities: { userdetails: { accountId: "accountId" }, preferences: {} } } },
        },
      );

      expect(state).toEqual({
        accountId: "accountId",
        isAuthenticating: false,
      });
    });

    it("must clear isAuthenticating when the refetch confirms loggedIn:true", () => {
      const state = userDetailsReducer(
        { isAuthenticating: true },
        {
          type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
          payload: { initialState: { entities: { userdetails: { loggedIn: true } } } },
        },
      );

      expect(state).toEqual({
        loggedIn: true,
        isAuthenticating: false,
      });
    });

    it("must preserve isAuthenticating when an interim refetch still reports loggedIn:false", () => {
      const state = userDetailsReducer(
        { isAuthenticating: true },
        {
          type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
          payload: { initialState: { entities: { userdetails: { loggedIn: false } } } },
        },
      );

      expect(state).toEqual({
        loggedIn: false,
        isAuthenticating: true,
      });
    });

    it("should return the same unchanged state object", () => {
      const oldState = {};
      const state = userDetailsReducer(oldState, {
        type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
        payload: { initialState: null },
      });

      expect(state).toEqual({});
      expect(state).toBe(oldState);
    });
  });

  describe("when action type is AUTH__LOGIN_INITIATED", () => {
    it("must set isAuthenticating to true", () => {
      const state = userDetailsReducer({ loggedIn: false }, { type: "AUTH__LOGIN_INITIATED" });

      expect(state).toEqual({
        loggedIn: false,
        isAuthenticating: true,
      });
    });
  });

  describe("when action type is AUTH__LOGIN_RESOLVED", () => {
    it("must set isAuthenticating to false", () => {
      const state = userDetailsReducer({ loggedIn: false, isAuthenticating: true }, { type: "AUTH__LOGIN_RESOLVED" });

      expect(state).toEqual({
        loggedIn: false,
        isAuthenticating: false,
      });
    });
  });
});
