import {
  getBottomBarTiles,
  createGetBottomBarTilesSelector,
  createHasProductSwitcherSelector,
} from "./bottom-bar-card-selectors";

describe("BottomBar selectors", () => {
  describe("getBottomBarTiles", () => {
    it("should return undefined if bottom bar tiles are not defined", () => {
      expect(getBottomBarTiles({})).toBeUndefined();
    });

    it("should return the bottom bar tiles if bottom bar tiles are defined", () => {
      expect(getBottomBarTiles({ tiles: ["tile1", "tile2"] })).toEqual(["tile1", "tile2"]);
    });
  });

  describe("createGetBottomBarTilesSelector", () => {
    it("should return [] if tiles does not exist", () => {
      expect(createGetBottomBarTilesSelector()({})).toEqual([]);
    });

    it("should return the bottom bar tiles if defined", () => {
      expect(createGetBottomBarTilesSelector()({ tiles: [1, 2] })).toEqual([1, 2]);
    });
  });

  describe("createHasProductSwitcherSelector", () => {
    it("should return undefined if hasProductSwitcher does not exist", () => {
      expect(createHasProductSwitcherSelector()({})).toEqual(undefined);
    });

    it("should return null if hasProductSwitcher is null", () => {
      expect(createHasProductSwitcherSelector()({ hasProductSwitcher: null })).toEqual(null);
    });

    it("should return the bottom bar hasProductSwitcher if defined", () => {
      expect(createHasProductSwitcherSelector()({ hasProductSwitcher: true })).toEqual(true);
    });
  });
});
