import { createIsCookieConsentCategoryActiveSelector } from "./cookie-consent-selectors";

const cookieConsentStateMock = {
  activeCategories: ["C0001", "C0002", "C0003", "C0004"],
};

describe("Cookie consent selectors", () => {
  describe("createIsCookieConsentCategoryActiveSelector", () => {
    it("must return true if the category is active", () => {
      const isCookieConsentCategoryActive = createIsCookieConsentCategoryActiveSelector();

      expect(isCookieConsentCategoryActive(cookieConsentStateMock, "C0004")).toBe(true);
    });

    it("must return false if the category is not active", () => {
      const isCookieConsentCategoryActive = createIsCookieConsentCategoryActiveSelector();

      expect(isCookieConsentCategoryActive(cookieConsentStateMock, "INACTIVE_CATEGORY")).toBe(false);
    });
  });
});
