import { EntityType } from "@ppb/tbd-urn-codecs";
import { PUSH, PUSH_SAME_VIEW } from "../../../actions/router";
import navigationTabsReducer from "./navigation-tabs-list-reducer";

const NAVIGATION_TABS_LIST = "ppb:tbd:card:navigationTabsList:navigationTabsList";
const NAVIGATION_TABS_LIST_WITH_TAB_ID = "ppb:tbd:card:navigationTabsList:navigationTabsList?=tabId=Tomorrow";

const navigationTabsListMock = {
  urn: NAVIGATION_TABS_LIST,
  title: "All Races",
  selectedTabUrn: undefined,
  items: [
    {
      typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:Today",
    },
    {
      typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:Tomorrow",
    },
  ],
};

const stateMock = {
  [NAVIGATION_TABS_LIST]: navigationTabsListMock,
};

const stateMockWithSelectedTab = {
  [NAVIGATION_TABS_LIST]: {
    ...navigationTabsListMock,
    selectedTabUrn: "ppb:tbd:view:navigationTab:Tomorrow",
  },
};

describe('"navigationTabsList" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = navigationTabsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each([PUSH, PUSH_SAME_VIEW])('when action type is "%s"', (type) => {
    describe('and urn does not include a "tabId"', () => {
      it("should return the initial state", () => {
        const action = {
          type,
          payload: {
            viewUrn: "",
            viewUrl: "",
          },
        };

        const state = navigationTabsReducer(stateMock, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe('and urn includes a "tabId"', () => {
      describe("and there is no navigationTabsList which includes that tabId", () => {
        it("should return the initial state", () => {
          const action = {
            type,
            payload: {
              viewUrl: "ppb:tbd:view:event?tabId=Yesterday",
              viewUrn: "",
            },
          };

          const expectedState = {
            [NAVIGATION_TABS_LIST]: navigationTabsListMock,
          };

          const state = navigationTabsReducer(expectedState, action);
          expect(state).toEqual(expectedState);
        });

        describe("and there is a navigationTabsList and a navigationTab which include that tabId", () => {
          it("should return the navigationTabsList with the correct selectedTabUrn", () => {
            const action = {
              type,
              payload: {
                viewUrl: "ppb:tbd:view:event?tabId=Tomorrow",
                viewUrn: "",
              },
            };

            const currentState = {
              [NAVIGATION_TABS_LIST_WITH_TAB_ID]: { ...navigationTabsListMock, urn: NAVIGATION_TABS_LIST_WITH_TAB_ID },
            };

            const expectedState = {
              [NAVIGATION_TABS_LIST_WITH_TAB_ID]: {
                ...navigationTabsListMock,
                urn: NAVIGATION_TABS_LIST_WITH_TAB_ID,
                selectedTabUrn: "ppb:tbd:view:navigationTab:Tomorrow",
              },
            };

            const state = navigationTabsReducer(currentState, action);
            expect(state).toEqual(expectedState);
          });
        });
      });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "navigationTabsList"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            NavigationTabsList: [navigationTabsListMock],
          },
        },
      };
      const state = navigationTabsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    describe('and "selectedTabUrn" is defined', () => {
      it('must not override "selectedTabUrn"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              NavigationTabsList: [navigationTabsListMock],
            },
          },
        };

        const expectedState = {
          [NAVIGATION_TABS_LIST]: {
            ...navigationTabsListMock,
            selectedTabUrn: "ppb:tbd:view:navigationTab:Tomorrow",
          },
        };

        const state = navigationTabsReducer(stateMockWithSelectedTab, action);
        expect(state).toEqual(expectedState);
      });
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

  describe.each([EntityType.NavigationTabsList, EntityType.VirtualNavigationTabsList])(
    "when action type is TAB_ROUTE_UPDATE and the tabsList urn type is `%s`",
    (type) => {
      it("should return the state with an updated 'selectedTabUrn'", () => {
        const tabsListMock = {
          urn: `${type}:1337`,
          items: "123",
        };
        const action = {
          type: "Router/tabRouteUpdate",
          payload: {
            tabsListURN: tabsListMock.urn,
            selectedTabUrn: "ppb:tbd:view:navigationTab:Tomorrow",
          },
        };

        const state = navigationTabsReducer(
          {
            [tabsListMock.urn]: tabsListMock,
          },
          action,
        );

        expect(state).toEqual({
          [tabsListMock.urn]: {
            ...tabsListMock,
            selectedTabUrn: "ppb:tbd:view:navigationTab:Tomorrow",
          },
        });
      });
    },
  );

  describe("and the tabsList urn is static", () => {
    it("should return the state without updating it'", () => {
      const action = {
        type: "Router/tabRouteUpdate",
        payload: {
          tabsListURN: "ppb:tbd:card:staticNavigationTabsList:navigationTabsList",
          selectedTabUrn: "ppb:tbd:view:NavigationTab:Tomorrow",
        },
      };

      const state = navigationTabsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });
});
