import navigationTabsReducer from "./navigation-tabs-reducer";

const navigationTabsMock = {
  urn: "ppb:tbd:navigationtab:Today",
  title: "Today",
  items: [
    {
      typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:swimlane:428ecc82/s/1",
    },
    {
      typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:swimlane:413abfce/s/1",
    },
  ],
};

const favouriteMarketsTabsMock = {
  ...navigationTabsMock,
  typename: "FavouriteMarketsNavigationTab",
  urn: "ppb:tbd:favouriteMarketsNavigationTab",
};

const stateMock = {
  "ppb:tbd:navigationtab:Today": navigationTabsMock,
  "ppb:tbd:favouriteMarketsNavigationTab": favouriteMarketsTabsMock,
};

describe('"navigationTabs" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = navigationTabsReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "navigationTabs" and "favouriteMarketsNavigationTabs', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            NavigationTab: [navigationTabsMock],
            FavouriteMarketsNavigationTab: [favouriteMarketsTabsMock],
          },
        },
      };
      const state = navigationTabsReducer(undefined, action);

      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS"', () => {
    it("should remove all navigation tabs that have FavouriteMarketsNavigationTab as typename", () => {
      const ACTION = {
        type: "DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS",
      };

      const state = navigationTabsReducer(stateMock, ACTION);

      expect(state).toEqual({ [navigationTabsMock.urn]: navigationTabsMock });
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const ACTION = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:cardgroup:swimlane:428ecc82/s/1"],
      };

      const state = navigationTabsReducer(stateMock, ACTION);

      expect(state["ppb:tbd:navigationtab:Today"].items).toEqual([
        { typename: "SwimlaneCardGroup", urn: "ppb:tbd:cardgroup:swimlane:413abfce/s/1" },
      ]);
    });

    it("should return items empty all items are removed", () => {
      const ACTION = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:cardgroup:swimlane:428ecc82/s/1", "ppb:tbd:cardgroup:swimlane:413abfce/s/1"],
      };

      const state = navigationTabsReducer(stateMock, ACTION);

      expect(state["ppb:tbd:navigationtab:Today"].items).toEqual([]);
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = navigationTabsReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
