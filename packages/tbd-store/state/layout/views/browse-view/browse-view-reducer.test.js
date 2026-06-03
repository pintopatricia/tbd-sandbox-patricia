import { BOTTOM_BAR_PUSH, PUSH } from "../../../../actions/router";
import browseViewReducer from "./browse-view-reducer";

const stateMock = {
  "ppb:tbd:view:browse:sports": {
    isOpen: true,
    items: [],
    search: {
      inputSearchTerm: "",
      result: {
        items: [],
        pageSize: 0,
        query: "",
        startIndex: 0,
      },
    },
    typename: "BrowseView",
    url: "browse/b-sports",
    urn: "ppb:tbd:view:browse:sports",
  },
  "ppb:tbd:view:browse:gaming": {
    isOpen: true,
    items: [],
    search: {
      inputSearchTerm: "",
      result: {
        items: [],
        pageSize: 0,
        query: "",
        startIndex: 0,
      },
    },
    typename: "BrowseView",
    url: "browse/b-gaming",
    urn: "ppb:tbd:view:browse:gaming",
  },
};

describe("browse reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = browseViewReducer(undefined, {});
      expect(state).toEqual({
        "ppb:tbd:view:browse:sports": {
          isOpen: false,
          items: [],
          search: {
            inputSearchTerm: "",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
        "ppb:tbd:view:browse:gaming": {
          items: [],
          isOpen: false,
          search: {
            inputSearchTerm: "",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
          typename: "BrowseView",
          url: "browse/b-gaming",
          urn: "ppb:tbd:view:browse:gaming",
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS but do not have URN defined"', () => {
    it("must return the new state with updated results", () => {
      const result = {
        pageSize: 2,
        query: "query",
        items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
        startIndex: 3,
      };
      const action = {
        type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
        payload: { results: result },
      };
      const state = browseViewReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS"', () => {
    it("must return the new state with updated results", () => {
      const result = {
        pageSize: 2,
        query: "query",
        items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
        startIndex: 3,
      };
      const action = {
        type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
        payload: { urn: "ppb:tbd:view:browse:sports", results: result },
      };
      const state = browseViewReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
        "ppb:tbd:view:browse:sports": {
          ...stateMock["ppb:tbd:view:browse:sports"],
          isOpen: true,
          search: { result, inputSearchTerm: "" },
        },
      });
    });
  });

  describe('when action type is "DELETE_LAYOUT"', () => {
    it("must return the new state with clean results", () => {
      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          items: [],
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "gaming-item" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-gaming",
          urn: "ppb:tbd:view:browse:gaming",
        },
      };
      const action = { type: "DELETE_LAYOUT" };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:sports"]).toEqual(stateMock["ppb:tbd:view:browse:sports"]);
      expect(state["ppb:tbd:view:browse:gaming"]).toEqual(stateMock["ppb:tbd:view:browse:gaming"]);
    });
  });

  describe('when action type is "UI__CLEAR_SEARCH_RESULTS but do not have URN defined"', () => {
    it("must return the new state with clean results", () => {
      const action = {
        type: "UI__CLEAR_SEARCH_RESULTS",
        payload: {},
      };
      const state = browseViewReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__CLEAR_SEARCH_RESULTS"', () => {
    it("must return the new state with clean results", () => {
      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const action = {
        type: "UI__CLEAR_SEARCH_RESULTS",
        payload: {
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:sports"]).toEqual(stateMock["ppb:tbd:view:browse:sports"]);
    });
  });

  describe('when action type is "UI__SEARCH_CANCEL_CLICK but do not have URN defined"', () => {
    it("must return the new state original state", () => {
      const action = {
        type: "UI__SEARCH_CANCEL_CLICK",
        payload: {},
      };
      const state = browseViewReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_CANCEL_CLICK"', () => {
    it("must return the new state original state", () => {
      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const action = {
        type: "UI__SEARCH_CANCEL_CLICK",
        payload: {
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:sports"]).toEqual(stateMock["ppb:tbd:view:browse:sports"]);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE_CLEAR but do not have URN defined"', () => {
    it("must return the new state with clean results", () => {
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE_CLEAR",
        payload: {},
      };
      const state = browseViewReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE_CLEAR"', () => {
    it("must return the new state with clean results", () => {
      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
            inputSearchTerm: "search term",
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE_CLEAR",
        payload: {
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state).toEqual({
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "search term",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      });
    });
  });

  describe('when action type is "PUSH"', () => {
    it("should flag isOpen when pushing another view", () => {
      const action = {
        type: PUSH,
        payload: {
          viewUrn: "ppb:tbd:view:event:12345",
          viewUrl: "event",
        },
      };

      const mockState = {
        "ppb:tbd:view:browse:browse": {
          isOpen: true,
          search: {
            result: {
              pageSize: 0,
              query: "query",
              items: [],
              startIndex: 0,
            },
            inputSearchTerm: "search term",
          },
          typename: "BrowseView",
          url: "browse/b-browse",
          urn: "ppb:tbd:view:browse:browse",
        },
      };

      const state = browseViewReducer(mockState, action);
      expect(state).toStrictEqual({
        "ppb:tbd:view:browse:browse": {
          ...mockState["ppb:tbd:view:browse:browse"],
          isOpen: false,
        },
      });
    });
    it("should clear state if navigating to same page", () => {
      const action = {
        type: PUSH,
        payload: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse",
        },
      };

      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 0,
            },
            inputSearchTerm: "search term",
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };

      const state = browseViewReducer(mockState, action);
      expect(state).toStrictEqual({
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          search: {
            result: {
              pageSize: 0,
              query: "",
              items: [],
              startIndex: 0,
            },
            inputSearchTerm: "",
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      });
    });
  });

  describe('when action type is "BOTTOM_BAR_PUSH"', () => {
    it("should flag isOpen when pushing another view", () => {
      const action = {
        type: BOTTOM_BAR_PUSH,
        payload: {
          viewUrn: "ppb:tbd:view:event:12345",
          viewUrl: "event",
        },
      };

      const mockState = {
        "ppb:tbd:view:browse:browse": {
          isOpen: true,
          search: {
            result: {
              pageSize: 0,
              query: "query",
              items: [],
              startIndex: 0,
            },
            inputSearchTerm: "search term",
          },
          typename: "BrowseView",
          url: "browse/b-browse",
          urn: "ppb:tbd:view:browse:browse",
        },
      };

      const state = browseViewReducer(mockState, action);
      expect(state).toStrictEqual({
        "ppb:tbd:view:browse:browse": {
          ...mockState["ppb:tbd:view:browse:browse"],
          isOpen: false,
        },
      });
    });

    it("should clear state if navigating to same page", () => {
      const action = {
        type: BOTTOM_BAR_PUSH,
        payload: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse",
        },
      };

      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          search: {
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 0,
            },
            inputSearchTerm: "search term",
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };

      const state = browseViewReducer(mockState, action);
      expect(state).toStrictEqual({
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          search: {
            result: {
              pageSize: 0,
              query: "",
              items: [],
              startIndex: 0,
            },
            inputSearchTerm: "",
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      });
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE but do not have URN defined"', () => {
    it("must return the new state with the payload new inputSearchTerm", () => {
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE",
        payload: { text: "new search term" },
      };
      const state = browseViewReducer(stateMock, action);

      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE"', () => {
    it("must return the new state with the payload new inputSearchTerm", () => {
      const mockState = {
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "old search term",
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      };
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE",
        payload: { urn: "ppb:tbd:view:browse:sports", text: "new search term" },
      };
      const state = browseViewReducer(mockState, action);

      expect(state).toEqual({
        "ppb:tbd:view:browse:sports": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "new search term",
            result: {
              pageSize: 2,
              query: "query",
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-sports",
          urn: "ppb:tbd:view:browse:sports",
        },
      });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it("must return the new state with items field updated", () => {
      const mockState = {
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "",
            result: {},
          },
          typename: "BrowseView",
          url: "",
          urn: "ppb:tbd:view:browse:gaming",
        },
      };
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          urn: "ppb:tbd:view:browse:gaming",
          data: {
            BrowseView: [
              {
                urn: "ppb:tbd:view:browse:gaming",
                url: "newUrl",
                items: [
                  { typename: "RegulatoryCard" },
                  "ppb:tbd:card:group:recentlyPlayedGames:1",
                  "ppb:tbd:card:group:recommendedGames:1",
                ],
              },
            ],
          },
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:gaming"].items).toStrictEqual([
        { typename: "RegulatoryCard" },
        "ppb:tbd:card:group:recentlyPlayedGames:1",
        "ppb:tbd:card:group:recommendedGames:1",
      ]);
    });

    it("should update url", () => {
      const mockState = {
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "",
            result: {},
          },
          typename: "BrowseView",
          url: "",
          urn: "ppb:tbd:view:browse:gaming",
        },
      };
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          urn: "ppb:tbd:view:browse:gaming",
          url: "newUrl",
          data: {
            BrowseView: [
              {
                urn: "ppb:tbd:view:browse:gaming",
                url: "newUrl",
                items: [
                  { typename: "RegulatoryCard" },
                  "ppb:tbd:card:group:recentlyPlayedGames:1",
                  "ppb:tbd:card:group:recommendedGames:1",
                ],
              },
            ],
          },
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:gaming"].url).toStrictEqual("newUrl");
    });

    it("must return same state when views are empty", () => {
      const mockState = {
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "",
            result: {},
          },
          typename: "BrowseView",
          url: "browse/b-gaming",
          urn: "ppb:tbd:view:browse:gaming",
        },
      };
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          urn: "ppb:tbd:view:browse:gaming",
          data: {},
        },
      };
      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:gaming"]).toStrictEqual({
        isOpen: true,
        items: [],
        search: {
          inputSearchTerm: "",
          result: {},
        },
        typename: "BrowseView",
        url: "browse/b-gaming",
        urn: "ppb:tbd:view:browse:gaming",
      });
    });
  });

  describe('when action type is "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS but do not have URN defined"', () => {
    it("must return the new state with items field updated", () => {
      const action = {
        type: "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS",
        payload: {
          itemsUrnsToDelete: ["urn1"],
        },
      };

      const state = browseViewReducer(stateMock, action);
      expect(state).toStrictEqual(stateMock);
    });
  });

  describe('when action type is "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS"', () => {
    it("must return the new state with items field updated", () => {
      const mockState = {
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          items: [],
          search: {
            inputSearchTerm: "test",
            result: {
              pageSize: 2,
              query: "query",
              items: [
                { urn: "urn", name: "name", type: "test" },
                { urn: "urn1", name: "name1", type: "test1" },
                { urn: "urn2", name: "name2", type: "test2" },
              ],
              startIndex: 3,
            },
          },
          typename: "BrowseView",
          url: "browse/b-gaming",
          urn: "ppb:tbd:view:browse:gaming",
        },
      };
      const action = {
        type: "UI__DELETE_ITEMS_FROM_SEARCH_RESULTS",
        payload: {
          urn: "ppb:tbd:view:browse:gaming",
          itemsUrnsToDelete: ["urn1"],
        },
      };

      const state = browseViewReducer(mockState, action);
      expect(state["ppb:tbd:view:browse:gaming"]).toStrictEqual({
        isOpen: true,
        items: [],
        search: {
          inputSearchTerm: "test",
          result: {
            pageSize: 2,
            query: "query",
            items: [
              { urn: "urn", name: "name", type: "test" },
              { urn: "urn2", name: "name2", type: "test2" },
            ],
            startIndex: 3,
          },
        },
        typename: "BrowseView",
        url: "browse/b-gaming",
        urn: "ppb:tbd:view:browse:gaming",
      });
    });
  });
});
