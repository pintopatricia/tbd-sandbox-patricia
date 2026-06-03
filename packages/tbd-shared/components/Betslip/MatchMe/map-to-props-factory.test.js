import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

describe("MatchMe map-to-props-factory", () => {
  describe("makeMapStateToProps", () => {
    it("should return a mapStateToProps function", () => {
      const mapStateToProps = makeMapStateToProps();

      expect(typeof mapStateToProps).toBe("function");
    });

    it("should return default state props", () => {
      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps({}, { selectionUrn: "ppb:selection:123" });

      expect(result).toEqual({
        isEnabled: false,
        oddsRange: null,
        label: "MatchMe",
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("should return dispatch props with onToggle", () => {
      const result = mapDispatchToProps(jest.fn(), { selectionUrn: "ppb:selection:123" });

      expect(result).toHaveProperty("onToggle");
      expect(typeof result.onToggle).toBe("function");
    });
  });
});
