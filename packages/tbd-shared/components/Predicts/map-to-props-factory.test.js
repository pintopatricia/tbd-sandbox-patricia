import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

describe("Predicts map-to-props-factory", () => {
  describe("makeMapStateToProps", () => {
    it("should return an empty object when Predicts is closed", () => {
      const mapStateToProps = makeMapStateToProps();
      const state = { predicts: { isOpen: false } };

      expect(mapStateToProps(state)).toEqual({});
    });

    it("should return { isOpen: true } when Predicts is open", () => {
      const mapStateToProps = makeMapStateToProps();
      const state = { predicts: { isOpen: true } };

      expect(mapStateToProps(state)).toEqual({ isOpen: true });
    });
  });

  describe("mapDispatchToProps", () => {
    it("should expose dispatchClosePredicts that returns a UI/CLOSE_PREDICTS action", () => {
      const action = mapDispatchToProps.dispatchClosePredicts();
      expect(action).toEqual({ type: "UI/CLOSE_PREDICTS" });
    });
  });
});
