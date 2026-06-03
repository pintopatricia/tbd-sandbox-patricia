import { isDGALogo } from "./SectionElements.helper";

describe("isDGALogo", () => {
  describe("when the viewLink is undefined", () => {
    it("should return false", () => {
      const item = { viewLink: undefined };

      expect(isDGALogo(item)).toBe(false);
    });
  });

  describe("when the viewLink is defined", () => {
    describe("and the viewUrl is empty", () => {
      it("should return false", () => {
        const item = { viewLink: { viewUrl: "" } };

        expect(isDGALogo(item)).toBe(false);
      });
    });

    describe("and the viewUrl does not contain 'www.spillemyndigheden.dk'", () => {
      it("should return false", () => {
        const item = { viewLink: { viewUrl: "viewUrl" } };

        expect(isDGALogo(item)).toBe(false);
      });
    });

    describe("and the viewUrl contains 'www.spillemyndigheden.dk'", () => {
      it("should return true", () => {
        const item = { viewLink: { viewUrl: "https://www.spillemyndigheden.dk/" } };

        expect(isDGALogo(item)).toBe(true);
      });
    });
  });
});
