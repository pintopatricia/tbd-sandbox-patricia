import {
  getBrowseInterfaceOpenState,
  getBrowseInterfaceSearchResult,
  getBrowseInterfaceInputSearchTerm,
  createBrowseInterfaceSearchSelector,
  createGamingBrowseInterfaceSearchSelector,
  createPartialCardsBySearchCardGroupSelector,
  createFullCardsForSearch,
} from "./browse-view-selectors";
import { createFindCardbyURNSelector } from "../../cards/cards-selectors";

jest.mock("../../cards/cards-selectors", () => {
  const mockSelector = jest.fn();

  return {
    createFindCardbyURNSelector: jest.fn(() => mockSelector),
  };
});

const urn = "ppb:tbd:view:browse:browse";

const stateMock = {
  layouts: {
    views: {
      browse: {
        [urn]: {
          isOpen: false,
          search: {
            inputSearchTerm: "search term",
            result: {
              query: "",
              pageSize: 0,
              startIndex: 0,
              items: [],
            },
          },
        },
        typename: "BrowseView",
        url: "betting/browse/",
        urn,
      },
    },
  },
};

const stateMock2 = {
  layouts: {
    views: {
      browse: {
        [urn]: {
          isOpen: true,
          search: {
            inputSearchTerm: "search term",
            result: {
              query: "Por",
              pageSize: 0,
              startIndex: 0,
              items: [
                {
                  urn: "ppb:tbd:view:event:29672603",
                  name: "Setubal v Porto",
                  competition: "Portuguese Primeira Liga",
                  date: "2020-02-01T18:00:00.000Z",
                },
              ],
            },
          },
        },
        typename: "BrowseView",
        url: "betting/browse/",
        urn,
      },
    },
  },
};

const stateMockGaming = {
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:gaming": {
          isOpen: true,
          search: {
            inputSearchTerm: "search term",
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
        },
        typename: "BrowseView",
        url: "betting/browse/",
        urn,
      },
      market: {
        "ppb:tbd:marketview:1": {
          urn: "ppb:tbd:marketview:1",
          items: ["ppb:tbd:fixture#29606443", "ppb:tbd:card:market#1.123123"],
          mainMarket: "ppb:tbd:market:urn",
        },
        "ppb:tbd:marketview:2": {
          urn: "ppb:tbd:marketview:2",
          items: [
            "ppb:tbd:fixture#29606443",
            "ppb:tbd:card:market#1.123123",
            "ppb:tbd:card:pebbleMarkets:924.229966790",
          ],
          mainMarket: "ppb:tbd:market:urn",
        },
      },
      event: {
        "ppb:tbd:view:event:29768117": {
          urn: "ppb:tbd:view:event:29768117",
          items: ["ppb:tbd:card:fixture:29768117", "ppb:tbd:card:matchStats:29768117"],
        },
      },
    },
    cards: {
      markets: {
        "ppb:tbd:card:market#1.123123": {
          urn: "ppb:tbd:card:market#1.123123",
          title: "Over/Under 0.5",
        },
        "ppb:tbd:card:market#1.222222": {
          urn: "ppb:tbd:card:market#1.222222",
        },
      },
      marketsextended: {
        "ppb:tbd:card:marketExtended#1.123123": {
          urn: "ppb:tbd:card:marketExtended#1.123123",
          title: "Over/Under 0.5",
        },
        "ppb:tbd:card:marketExtended#1.222222": {
          urn: "ppb:tbd:card:marketExtended#1.222222",
        },
      },
      fixtures: {
        "ppb:tbd:card:fixture:29768117": {
          urn: "ppb:tbd:card:fixture:29768117",
          fixtureURN: "ppb:tbd:fixture:29768117",
        },
        "ppb:tbd:fixture#29606443": { urn: "ppb:tbd:fixture#29606443", fixtureURN: "ppb:tbd:fixture:29606443" },
      },
      eventmarkets: {
        "event:market:1": {},
        "event:market:2": {},
        "event:market:3": {},
      },
      games: {
        urn: {},
      },
    },
    swimlanecardgroups: {
      "card:group:1": {
        items: [
          "event:market:1",
          "event:market:2",
          "event:market:3",
          "event:market:4",
          "event:market:5",
          "event:market:6",
          "event:market:7",
          "event:market:8",
          "event:market:9",
          "event:market:10",
        ],
      },
      "card:group:2": {
        items: ["event:market:1", "event:market:2"],
      },
    },
    pebblecardgroups: {
      "ppb:tbd:card:pebbleMarkets:924.229966790": {
        urn: "ppb:tbd:card:pebbleMarkets:924.229966790",
        items: [
          {
            urn: "ppb:tbd:card:market#1.123123",
          },
          {
            urn: "ppb:tbd:card:market#1.222222",
            name: "Pebble Title",
          },
        ],
      },
      "ppb:tbd:card:pebbleExtendedMarkets:924.229966790": {
        urn: "ppb:tbd:card:pebbleExtendedMarkets:924.229966790",
        items: [
          {
            urn: "ppb:tbd:card:marketExtended#1.123123",
          },
          {
            urn: "ppb:tbd:card:marketExtended#1.222222",
            name: "Pebble Title",
          },
        ],
      },
    },
  },
};

describe('"browse" selectors', () => {
  describe("getBrowseInterfaceOpenState selector", () => {
    it("must return the search state from the state", () => {
      expect(getBrowseInterfaceOpenState(stateMock, urn)).toEqual(false);
    });
  });

  describe("getBrowseInterfaceInputSearchTerm selector", () => {
    it("must return the search state from the state", () => {
      expect(getBrowseInterfaceInputSearchTerm(stateMock.layouts.views.browse, urn)).toEqual("search term");
    });
  });

  describe("getBrowseInterfaceSearchResult selector", () => {
    it("must return the search state from the state", () => {
      expect(getBrowseInterfaceSearchResult(stateMock.layouts.views.browse, urn)).toEqual({
        query: "",
        pageSize: 0,
        startIndex: 0,
        items: [],
      });
    });
  });

  describe("createBrowseInterfaceSearchSelector", () => {
    it("should be a function factory", () => {
      expect(createBrowseInterfaceSearchSelector()).not.toBe(createBrowseInterfaceSearchSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getBrowseInterfaceSearchResultState = createBrowseInterfaceSearchSelector();
        getBrowseInterfaceSearchResultState(stateMock, urn);
        getBrowseInterfaceSearchResultState(stateMock, urn);

        expect(getBrowseInterfaceSearchResultState.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getBrowseInterfaceSearchResultState = createBrowseInterfaceSearchSelector();
        getBrowseInterfaceSearchResultState(stateMock, urn);
        getBrowseInterfaceSearchResultState(stateMock2, urn);
        getBrowseInterfaceSearchResultState(stateMock2, urn);

        expect(getBrowseInterfaceSearchResultState.recomputations()).toEqual(2);
      });

      describe("when query has matches", () => {
        it("should highlight searched query in results", () => {
          const searchResult = createBrowseInterfaceSearchSelector()(stateMock2, urn);
          expect(searchResult).toEqual({
            query: "Por",
            didYouMean: undefined,
            formattedResults: [
              {
                urn: "ppb:tbd:view:event:29672603",
                name: "Setubal v Porto",
                competition: "Portuguese Primeira Liga",
                date: "2020-02-01T18:00:00.000Z",
              },
            ],
            inputSearchTerm: "search term",
          });
        });
      });

      describe("when query has a suggestion", () => {
        it("should highlight suggestion in results", () => {
          const searchResult = createBrowseInterfaceSearchSelector()(
            {
              layouts: {
                views: {
                  browse: {
                    [urn]: {
                      isOpen: true,
                      search: {
                        result: {
                          query: "Porrrr",
                          didYouMean: "Porto",
                          pageSize: 0,
                          startIndex: 0,
                          items: [
                            {
                              urn: "ppb:tbd:view:event:29672603",
                              name: "Setubal v Porto",
                              competition: "Portuguese Primeira Liga",
                              date: "2020-02-01T18:00:00.000Z",
                            },
                          ],
                        },
                      },
                    },
                    typename: "BrowseView",
                    url: "betting/browse/",
                    urn,
                  },
                },
              },
            },
            urn,
          );

          expect(searchResult).toEqual({
            query: "Porrrr",
            didYouMean: "Porto",
            formattedResults: [
              {
                urn: "ppb:tbd:view:event:29672603",
                name: "Setubal v Porto",
                competition: "Portuguese Primeira Liga",
                date: "2020-02-01T18:00:00.000Z",
              },
            ],
          });
        });
      });

      describe("when input search term changes", () => {
        it("should recompute the selector", () => {
          const getBrowseInterfaceSearchResultState = createBrowseInterfaceSearchSelector();
          const stateMockChanged = JSON.parse(JSON.stringify(stateMock));
          stateMockChanged.layouts.views.browse[urn].search.inputSearchTerm = "search term CHANGED";

          getBrowseInterfaceSearchResultState(stateMock, urn);
          getBrowseInterfaceSearchResultState(stateMockChanged, urn);

          expect(getBrowseInterfaceSearchResultState.recomputations()).toEqual(2);
        });
      });
    });
  });

  describe("createGamingBrowseInterfaceSearchSelector", () => {
    it("should be a function factory", () => {
      expect(createGamingBrowseInterfaceSearchSelector()).not.toBe(createGamingBrowseInterfaceSearchSelector());
    });

    it("should return query and inputSearchTerm properties", () => {
      const searchResult = createGamingBrowseInterfaceSearchSelector()(stateMock, urn);
      expect(searchResult).toEqual({
        query: "",
        inputSearchTerm: "search term",
      });
    });
  });
  describe("createPartialCardsBySearchCardGroupSelector", () => {
    it("should be a function factory", () => {
      expect(createPartialCardsBySearchCardGroupSelector()).not.toBe(createPartialCardsBySearchCardGroupSelector());
    });

    it("should return the partial urns", () => {
      createFindCardbyURNSelector().mockReturnValue(null);
      expect(createPartialCardsBySearchCardGroupSelector()(stateMockGaming, "ppb:tbd:view:browse:gaming")).toEqual([
        "urn",
        "urn1",
        "urn2",
      ]);
    });
  });
  describe("createFullCardsForSearch", () => {
    it("should be a function factory", () => {
      expect(createFullCardsForSearch()).not.toBe(createFullCardsForSearch());
    });

    it("should return the full game", () => {
      createFindCardbyURNSelector().mockReturnValue({
        anything: true,
      });
      expect(createFullCardsForSearch()(stateMockGaming, "ppb:tbd:view:browse:gaming")).toEqual([
        {
          name: "name",
          type: "test",
          urn: "urn",
        },
        {
          name: "name1",
          type: "test1",
          urn: "urn1",
        },
        {
          name: "name2",
          type: "test2",
          urn: "urn2",
        },
      ]);
    });
    it("should return all games when no partials remaining", () => {
      createFindCardbyURNSelector().mockReturnValue(null);
      expect(createFullCardsForSearch()(stateMockGaming, "ppb:tbd:view:browse:gaming")).toEqual([
        {
          name: "name",
          type: "test",
          urn: "urn",
        },
        {
          name: "name1",
          type: "test1",
          urn: "urn1",
        },
        {
          name: "name2",
          type: "test2",
          urn: "urn2",
        },
      ]);
    });
  });
});
