import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { FETCH_CATALOGUE_FAILURE } from "../../actions/catalogue";
import { REFRESH_IN_PROGRESS, PUSH, BOTTOM_BAR_PUSH, APOLLO_VIEW_PUSH, LOCATION_KEY } from "../../actions/router";
import routerReducer from "./router-slice";

const URN = {
  type: "urnType",
  uid: "urnUid",
  referenceId: "urn",
};

jest.mock("@ppb/tbd-urn-codecs", () => {
  const { EntityType } = jest.requireActual("@ppb/tbd-urn-codecs");

  return {
    codecs: {
      parse: jest.fn(() => URN),
      maintenanceView: {
        encode: jest.fn(() => URN),
      },
    },
    EntityType,
  };
});

describe("routerReducer", () => {
  describe("when state is not defined", () => {
    it("should set all props to default values", () => {
      const action = { type: "invalid" };
      const state = routerReducer(undefined, action);

      expect(state).toStrictEqual({
        currentView: null,
        currentUrn: null,
        currentTabUrn: null,
        locationKey: null,
        firstLocationKey: null,
        currentRoute: null,
        currentUrl: null,
        isRefreshing: false,
        showBackButton: false,
      });
    });
  });

  describe("when the action is invalid", () => {
    const currentState = { currentRoute: "/" };
    const action = { type: "invalid" };

    it("should return the current state", () => {
      const state = routerReducer(currentState, action);
      expect(state).toStrictEqual(currentState);
    });
  });

  describe("when it receives a PUSH action", () => {
    const currentRouterState = {
      currentUrn: "currentViewUrn",
      currentUrl: "currentViewUrl",
      firstLocationKey: "fakeKey",
      locationKey: "anotherFakeKey",
    };

    const action = {
      type: PUSH,
      payload: {
        viewUrn: "currentViewUrn",
        viewUrl: "currentViewUrl",
      },
    };

    const newState = {
      currentUrn: "urnUid",
      currentView: "urnType",
      currentUrl: "currentViewUrl",
      firstLocationKey: "fakeKey",
      locationKey: "anotherFakeKey",
      showBackButton: true,
    };

    it("should return the new state", () => {
      const state = routerReducer(currentRouterState, action);

      expect(state).toStrictEqual(newState);
    });
  });

  describe("when it receives a FETCH_CATALOGUE_SUCCESS action", () => {
    describe("when action payload has a different view from the requested (invalid) one", () => {
      describe("and the requested view is not homepage", () => {
        const currentRouterState = {
          currentUrn: "currentViewUrn",
          currentUrl: "currentViewUrl",
        };

        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            layouts: {
              views: {},
            },
            router: {
              currentUrn: "newViewUrn",
              currentUrl: "newViewUrl",
              currentView: "newViewType",
            },
          },
          requestedUrns: ["currentViewUrn"],
        };

        const newState = {
          currentUrn: "newViewUrn",
          currentView: "newViewType",
          currentUrl: "newViewUrl",
          isRefreshing: false,
        };

        it("should return the new state", () => {
          const state = routerReducer(currentRouterState, action);

          expect(state).toStrictEqual(newState);
        });
      });

      describe("and the requested view is homepage and the current url is ''", () => {
        const currentRouterState = {
          currentUrn: "currentViewUrn",
          currentUrl: "currentViewUrl",
          isRefreshing: false,
        };

        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            layouts: {
              views: {},
            },
            router: {
              currentUrn: "newViewUrn",
              currentUrl: "", // homepage url
              currentView: "newViewType",
            },
          },
          requestedUrns: ["currentViewUrn"],
        };

        const newState = {
          currentUrn: "newViewUrn",
          currentView: "newViewType",
          currentUrl: "", // homepage url
          isRefreshing: false,
        };

        it("should return the new state", () => {
          const state = routerReducer(currentRouterState, action);

          expect(state).toStrictEqual(newState);
        });
      });
    });

    describe("when action payload has the same view as the requested(current) one", () => {
      const currentRouterState = {
        currentUrn: "currentViewUrn",
        currentUrl: "currentViewUrl",
        isRefreshing: false,
      };

      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          layouts: {
            views: {},
          },
        },
        requestedUrns: ["currentViewUrn"],
      };

      it("should return the current state", () => {
        const state = routerReducer(currentRouterState, action);

        expect(state).toStrictEqual(currentRouterState);
      });
    });

    describe("when the requested view is homepage and the current url is ''", () => {
      const currentRouterState = {
        currentUrn: "currentViewUrn",
        currentUrl: "",
        isRefreshing: false,
      };

      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          layouts: {
            views: {},
          },
          router: {
            currentUrn: "newViewUrn",
            currentUrl: "",
            currentView: "newViewType",
          },
        },
        requestedUrns: ["currentViewUrn"],
      };

      const newState = {
        currentUrn: "newViewUrn",
        currentView: "newViewType",
        currentUrl: "",
        isRefreshing: false,
      };

      it("should return the new state", () => {
        const state = routerReducer(currentRouterState, action);

        expect(state).toStrictEqual(newState);
      });
    });
  });

  describe("when it receives a REFRESH_IN_PROGRESS action", () => {
    it("should set route as refreshing", () => {
      const currentState = {};
      const action = {
        type: REFRESH_IN_PROGRESS,
        payload: { urn: "fakeUrn" },
      };

      const state = routerReducer(currentState, action);

      expect(state).toStrictEqual({
        isRefreshing: true,
      });
    });
  });

  describe("when it receives a FETCH_CATALOGUE_FAILURE action", () => {
    it("should set route as not refreshing", () => {
      const currentState = {};
      const action = {
        type: FETCH_CATALOGUE_FAILURE,
        payload: { urn: "fakeUrn" },
      };

      const state = routerReducer(currentState, action);

      expect(state).toStrictEqual({
        isRefreshing: false,
      });
    });
  });

  describe("when it receives an LOCATION_KEY action", () => {
    it("should return the new state", () => {
      const currentState = {};
      const action = {
        type: LOCATION_KEY,
        payload: "fakeKey",
      };

      const state = routerReducer(currentState, action);
      expect(state).toStrictEqual({
        firstLocationKey: "fakeKey",
        locationKey: "fakeKey",
      });
    });
    it("should set showBackButton true if it is a second navigation", () => {
      const currentState = {};
      const action = {
        type: LOCATION_KEY,
        payload: "anotherFakeKey",
      };

      const state = routerReducer(currentState, action);
      expect(state).toStrictEqual({
        firstLocationKey: "anotherFakeKey",
        locationKey: "anotherFakeKey",
      });
    });
  });

  describe("when it receives an BOTTOM_BAR_PUSH action", () => {
    it("should return the new state", () => {
      const currentState = {};
      const action = {
        type: BOTTOM_BAR_PUSH,
        payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
      };

      const state = routerReducer(currentState, action);
      expect(state).toStrictEqual({
        currentRoute: {
          viewUrl: "fakeUrl",
          viewUrn: "fakeUrn",
        },
      });
    });
  });

  describe("when it receives an APOLLO_VIEW_PUSH action", () => {
    it.each([EntityType.PlayerView, EntityType.RaceView])(
      "should return the new state with currentView set to %s",
      (type) => {
        const currentState = {};
        const action = {
          type: APOLLO_VIEW_PUSH,
          payload: {
            viewUrn: "fakeUrn",
            viewUrl: "fakeUrl",
            type,
          },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentUrl: "fakeUrl",
          currentUrn: "fakeUrn",
          currentView: type,
        });
      },
    );
  });

  describe("when it receives an UI__MY_BETS_ORDER_TYPE_FILTER_CLICK action", () => {
    describe("when viewUrn codec parse doesn't decode type or uid", () => {
      it("should return the new state with null values", () => {
        codecs.parse.mockReturnValueOnce({});
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_ORDER_TYPE_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: null,
          currentUrn: null,
          currentUrl: null,
        });
      });
    });

    describe("when viewUrn codec parse decodes type and uid", () => {
      it("should return the new state with correct values", () => {
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_ORDER_TYPE_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: "urnType",
          currentUrn: "urnUid",
          currentUrl: null,
        });
      });
    });
  });

  describe("when it receives an UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK action", () => {
    describe("when viewUrn codec parse doesn't decode type or uid", () => {
      it("should return the new state with null values", () => {
        codecs.parse.mockReturnValueOnce({});
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: null,
          currentUrn: null,
          currentUrl: null,
        });
      });
    });

    describe("when viewUrn codec parse decodes type and uid", () => {
      it("should return the new state with correct values", () => {
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: "urnType",
          currentUrn: "urnUid",
          currentUrl: null,
        });
      });
    });
  });

  describe("when it receives an UI__MY_BETS_ORDER_STATUS_FILTER_CLICK action", () => {
    describe("when viewUrn codec parse doesn't decode type or uid", () => {
      it("should return the new state with null values", () => {
        codecs.parse.mockReturnValueOnce({});
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_ORDER_STATUS_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: null,
          currentUrn: null,
          currentUrl: null,
        });
      });
    });

    describe("when viewUrn codec parse decodes type and uid", () => {
      it("should return the new state with correct values", () => {
        const currentState = {};
        const action = {
          type: "UI/MY_BETS_ORDER_STATUS_FILTER_CLICK",
          payload: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: "urnType",
          currentUrn: "urnUid",
          currentUrl: null,
        });
      });
    });
  });

  describe("when it receives an MY_BETS_RESET_FILTERS action", () => {
    describe("when viewUrn codec parse doesn't decode type or uid", () => {
      it("should return the new state with null values", () => {
        codecs.parse.mockReturnValueOnce({});
        const currentState = {};
        const action = {
          type: "MY_BETS_RESET_FILTERS",
          payload: { viewUrn: "fakeUrn" },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentView: null,
          currentUrn: null,
          currentUrl: null,
        });
      });
    });

    describe("when viewUrn codec parse decodes type and uid", () => {
      describe("when payload does not have payload", () => {
        it("should return the state", () => {
          const currentState = {
            hasState: "itShould",
          };
          const action = {
            type: "MY_BETS_RESET_FILTERS",
          };

          const state = routerReducer(currentState, action);
          expect(state).toStrictEqual({
            hasState: "itShould",
          });
        });
      });
      describe("when payload has payload", () => {
        it("should return the new state with correct values", () => {
          const currentState = {};
          const action = {
            type: "MY_BETS_RESET_FILTERS",
            payload: {
              payload: { viewUrn: "fakeUrn" },
            },
          };

          const state = routerReducer(currentState, action);
          expect(state).toStrictEqual({
            currentView: "urnType",
            currentUrn: "urnUid",
            currentUrl: null,
          });
        });
      });
    });
  });

  describe("when it receives a TAB_ROUTE_UPDATE action", () => {
    describe("when selectedTabUrn is provided", () => {
      it("should set currentTabUrn to the selectedTabUrn", () => {
        const currentState = {
          currentTabUrn: null,
          currentUrn: "ppb:tbd:view:event:123",
        };
        const action = {
          type: "Router/tabRouteUpdate",
          payload: {
            selectedTabUrn: "ppb:tbd:view:navigationTab:popular",
          },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentTabUrn: "ppb:tbd:view:navigationTab:popular",
          currentUrn: "ppb:tbd:view:event:123",
        });
      });
    });

    describe("when selectedTabUrn is not provided", () => {
      it("should set currentTabUrn to null", () => {
        const currentState = {
          currentTabUrn: "ppb:tbd:view:navigationTab:popular",
          currentUrn: "ppb:tbd:view:event:123",
        };
        const action = {
          type: "Router/tabRouteUpdate",
          payload: {},
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentTabUrn: null,
          currentUrn: "ppb:tbd:view:event:123",
        });
      });
    });

    describe("when selectedTabUrn is null", () => {
      it("should set currentTabUrn to null", () => {
        const currentState = {
          currentTabUrn: "ppb:tbd:view:navigationTab:old-tab",
          currentUrn: "ppb:tbd:view:event:123",
        };
        const action = {
          type: "Router/tabRouteUpdate",
          payload: {
            selectedTabUrn: null,
          },
        };

        const state = routerReducer(currentState, action);
        expect(state).toStrictEqual({
          currentTabUrn: null,
          currentUrn: "ppb:tbd:view:event:123",
        });
      });
    });
  });
});
