import hamburgerMenuSlice from "./hamburger-menu-slice";

const initialState = {
  isOpen: false,
};

describe("hamburgerMenuSlice", () => {
  describe("when state is not defined", () => {
    it("should set all props to default values", () => {
      const action = { type: "invalid" };
      const state = hamburgerMenuSlice.reducer(undefined, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });

  describe("when it receives an OPEN action", () => {
    it("should set isOpen to true", () => {
      const action = { type: "HamburgerMenu/open" };
      const state = hamburgerMenuSlice.reducer(initialState, action);

      expect(state).toStrictEqual({
        isOpen: true,
      });
    });
  });

  describe("when it receives a CLOSE action", () => {
    it("should set isOpen to false", () => {
      const action = { type: "HamburgerMenu/close" };
      const state = hamburgerMenuSlice.reducer(initialState, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });

  describe("when it receives a PUSH action", () => {
    it("should set isOpen to false", () => {
      const action = { type: "Router/push" };
      const state = hamburgerMenuSlice.reducer(initialState, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });

  describe("when it receives a PUSH_SAME_VIEW action", () => {
    it("should set isOpen to false", () => {
      const action = { type: "ROUTER/PUSH_SAME_VIEW" };
      const state = hamburgerMenuSlice.reducer(initialState, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });
});
