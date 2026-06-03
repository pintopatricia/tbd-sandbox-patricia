import walletsReducer from "./user-wallets-reducer";
import { FETCH_USER_WALLETS_SUCCESS, FETCH_USER_WALLETS_FAILURE } from "../../../actions/user-wallets";

describe('"wallets" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = walletsReducer(undefined, {});

      expect(state).toEqual(null);
    });
  });

  describe("when action type is FETCH_USER_WALLETS_SUCCESS", () => {
    it("must return the state populated with the wallets indexed by name", () => {
      const state = walletsReducer(
        {},
        {
          type: FETCH_USER_WALLETS_SUCCESS,
          payload: [
            { walletName: "MAIN", amount: 123 },
            { walletName: "SECONDARY", amount: 21, real: 1, bonus: 10 },
          ],
        },
      );

      expect(state).toEqual({
        MAIN: {
          amount: 123,
          walletName: "MAIN",
        },
        SECONDARY: {
          amount: 21,
          walletName: "SECONDARY",
          real: 1,
          bonus: 10,
        },
      });
    });
  });

  describe("when action type is FETCH_USER_WALLETS_FAILURE", () => {
    it("must return the state populated with the wallets indexed by name", () => {
      const state = walletsReducer(
        {
          MAIN: {
            walletName: "MAIN",
            amount: 123,
          },
        },
        {
          type: FETCH_USER_WALLETS_FAILURE,
          error: "Error fetching wallets",
        },
      );

      expect(state).toEqual({
        MAIN: {
          amount: 123,
          walletName: "MAIN",
        },
        error: "Error fetching wallets",
      });
    });
  });
});
