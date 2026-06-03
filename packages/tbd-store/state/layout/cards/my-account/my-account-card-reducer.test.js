import myAccountReducer from "./my-account-card-reducer";

const INITIAL_STATE = {
  isOpen: false,
};

describe('"myAccountReducer" reducer', () => {
  describe("when action type is not met by the reducer and previous state is undefined", () => {
    it("must return the initial state", () => {
      const state = myAccountReducer(undefined, {});
      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe('when action type is "UI__MY_ACCOUNT_ICON_CLICK"', () => {
    it('must return the new state with "isOpen"', () => {
      const state = myAccountReducer(INITIAL_STATE, {
        type: "UI__MY_ACCOUNT_ICON_CLICK",
        payload: true,
      });

      expect(state).toEqual({
        isOpen: true,
      });
    });
  });

  describe('when action type is "UI__BROWSE_ICON_CLICK"', () => {
    it("must return the the initial state", () => {
      const state = myAccountReducer("fakeOldState", {
        type: "UI__BROWSE_ICON_CLICK",
      });

      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe('when action type is "UI__LOGO_CLICK"', () => {
    it("must return the the initial state", () => {
      const state = myAccountReducer("fakeOldState", {
        type: "UI__LOGO_CLICK",
      });

      expect(state).toEqual(INITIAL_STATE);
    });
  });
});
