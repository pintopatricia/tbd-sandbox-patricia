import { closePredicts, openPredicts, UI__CLOSE_PREDICTS, UI__OPEN_PREDICTS } from "./predicts";

describe("predicts action creators", () => {
  describe("openPredicts", () => {
    it("should create an action with the type UI__OPEN_PREDICTS", () => {
      expect(openPredicts()).toEqual({
        type: UI__OPEN_PREDICTS,
      });
    });
  });

  describe("closePredicts", () => {
    it("should create an action with the type UI__CLOSE_PREDICTS", () => {
      expect(closePredicts()).toEqual({
        type: UI__CLOSE_PREDICTS,
      });
    });
  });
});
