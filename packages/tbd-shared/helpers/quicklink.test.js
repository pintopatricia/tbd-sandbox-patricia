import { getQuicklinkRoundCorners } from "./quicklink";

describe("getQuicklinkRoundCorners", () => {
  describe("when a quicklink is isolated", () => {
    const links = [{}];
    const result = getQuicklinkRoundCorners(links, 0);

    it("should return all corners as true", () => {
      expect(result).toEqual({
        topLeft: true,
        topRight: true,
        bottomLeft: true,
        bottomRight: true,
      });
    });
  });

  describe("when a quicklink it's contained in a list", () => {
    const links = [{}, {}, {}];

    describe("and it's the first item of the list", () => {
      it("should return the top corners as true", () => {
        const result = getQuicklinkRoundCorners(links, 0);
        expect(result).toEqual({
          topLeft: true,
          topRight: true,
          bottomLeft: false,
          bottomRight: false,
        });
      });
    });

    describe("and it's the middle item of the list", () => {
      it("should return all the corners as false", () => {
        const result = getQuicklinkRoundCorners(links, 1);
        expect(result).toEqual({
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false,
        });
      });
    });

    describe("and it's the last item of the list", () => {
      it("should return the bottom corners as true", () => {
        const result = getQuicklinkRoundCorners(links, 2);
        expect(result).toEqual({
          topLeft: false,
          topRight: false,
          bottomLeft: true,
          bottomRight: true,
        });
      });
    });
  });
});
