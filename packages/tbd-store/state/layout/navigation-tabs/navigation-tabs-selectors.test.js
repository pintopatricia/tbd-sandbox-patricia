import { createNavigationTabByURNSelector } from "./navigation-tabs-selectors";

describe("NavigationTabs selector", () => {
  describe("createNavigationTabByURNSelector", () => {
    const state = {
      layouts: {
        navigationtabs: { "urn:1": "first", "urn:2": "second" },
      },
    };

    it("should return the navigation tab based on the urn provided", () => {
      expect(createNavigationTabByURNSelector()(state.layouts.navigationtabs, "urn:1")).toEqual("first");
    });
  });
});
