import { createNavigationTabsListByURNSelector } from "./navigation-tabs-list-selectors";

describe("NavigationTabsList selector", () => {
  describe("createNavigationTabsListByURNSelector", () => {
    const state = {
      layouts: {
        navigationtabslist: { "urn:1": "first", "urn:2": "second" },
      },
    };

    it("should return the navigation tabs list based on the provided urn", () => {
      expect(createNavigationTabsListByURNSelector()(state.layouts.navigationtabslist, "urn:1")).toEqual("first");
    });
  });
});
