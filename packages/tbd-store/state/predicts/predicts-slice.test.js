import predictsSlice from "./predicts-slice";

const initialState = {
  isOpen: false,
};

describe("predictsSlice", () => {
  describe("when state is not defined", () => {
    it("should set all props to default values", () => {
      const action = { type: "invalid" };
      const state = predictsSlice.reducer(undefined, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });

  describe("when it receives a UI/OPEN_PREDICTS action", () => {
    it("should set isOpen to true", () => {
      const action = { type: "UI/OPEN_PREDICTS" };
      const state = predictsSlice.reducer(initialState, action);

      expect(state).toStrictEqual({
        isOpen: true,
      });
    });
  });

  describe("when it receives a UI/CLOSE_PREDICTS action", () => {
    it("should set isOpen to false", () => {
      const action = { type: "UI/CLOSE_PREDICTS" };
      const state = predictsSlice.reducer({ isOpen: true }, action);

      expect(state).toStrictEqual({
        isOpen: false,
      });
    });
  });
});
