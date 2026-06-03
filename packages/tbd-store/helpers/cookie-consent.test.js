import { getCookieConsentCategories } from "./cookie-consent";

jest.mock("cookie-consent", () => ({
  CATEGORIES: ["category1", "category2", "category3"],
}));

describe("Cookie consent helper", () => {
  describe("getCookieConsentCategories", () => {
    it("should return all categories", () => {
      expect(getCookieConsentCategories()).toEqual(["category1", "category2", "category3"]);
    });
  });
});
