import { removeHashMark } from "./remove-hash-mark.web";

describe("removeHashMark", () => {
  beforeEach(() => {
    jest.spyOn(window, "location", "get").mockReturnValue({ replace: jest.fn() });
  });

  describe("when hash doesn't have `?`", () => {
    it("should not call `window.location.replace`", () => {
      const basePath = "basepath/";
      const hash = "#/foo/bar=123";
      removeHashMark(basePath, hash);

      expect(window.location.replace).not.toHaveBeenCalled();
    });
  });

  describe("when hash is empty", () => {
    it("should not call `window.location.replace`", () => {
      const basePath = "basepath/";
      const hash = "";
      removeHashMark(basePath, hash);

      expect(window.location.replace).not.toHaveBeenCalled();
    });
  });

  describe("when hash is not empty", () => {
    it("should call `window.location.replace` without hash mark fragment", () => {
      const basePath = "basepath/";
      const hash = "#/foo?bar=123";
      removeHashMark(basePath, hash);

      expect(window.location.replace).toHaveBeenCalledWith("basepath/?bar=123");
    });
  });
});
