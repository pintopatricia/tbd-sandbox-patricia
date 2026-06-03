import normalizeNavigationTabFragmentIntoNavigationTab from "./navigation-tab-list-normalizer";
import { normalizeNavigationTabPartialFragmentIntoNavigationTabPartial } from "./navigation-tab-normalizer";

jest.mock("./navigation-tab-normalizer", () => ({
  normalizeNavigationTabPartialFragmentIntoNavigationTabPartial: jest.fn().mockReturnValue({
    data: {
      typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:mocked",
      title: { translated: "mocked translation" },
      badgeText: undefined,
      viewLink: {
        viewUrl: "some viewUrl",
        viewUrn: "some viewUrn",
      },
    },
  }),
}));

const NORMALIZED_FAVOURITE_MARKETS_NAVIGATION_TAB = {
  data: {
    typename: "FavouriteMarketsNavigationTab",
    urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/1",
    title: {},
    badgeText: "I18N.COMMON.NEW",
    viewLink: {
      viewUrl: "some viewUrl",
      viewUrn: "some viewUrn",
    },
  },
};

jest.mock("./favourite-markets-navigation-tab-normalizer", () => ({
  normalizeFavouriteMarketsNavigationTabPartialFragmentIntoFavouriteMarketsNavigationTabPartial: jest.fn(
    () => NORMALIZED_FAVOURITE_MARKETS_NAVIGATION_TAB,
  ),
}));

const BFF_RESPONSE = {
  __typename: "NavigationTabsList",
  urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
  tabsTitle: "Tab Title",
  full: {
    edges: [
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Today",
          badgeText: null,
          tabTitle: {
            translated: "Today",
            translate: null,
          },
          tabViewLink: null,
          full: { edges: [] },
          partials: { edges: [] },
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Today",
          tabTitle: {
            translated: "Today",
            translate: null,
          },
          badgeText: null,
          tabViewLink: {
            viewUrl: "some viewUrl",
            viewUrn: "some viewUrn",
          },
        },
      },
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Tomorrow",
          tabTitle: {
            translated: null,
            translate: {
              key: "I18N.DATE.TOMORROW",
            },
          },
          badgeText: null,
          tabViewLink: null,
        },
      },
    ],
  },
};

const BFF_RESPONSE_ALT = {
  ...BFF_RESPONSE,
  tabsTitle: null,
  partials: {
    edges: [
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Today",
          badgeText: null,
          tabTitle: {
            translated: "IS.THIS.REAL.LIFE",
            translate: null,
          },
          tabViewLink: null,
        },
      },
    ],
  },
};

const BFF_RESPONSE_MIXED_TYPES = {
  __typename: "NavigationTabsList",
  urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
  tabsTitle: "Valid Tab",
  full: {
    edges: [
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Valid",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "NavigationTab",
          urn: "ppb:tbd:view:navigationTab:Valid",
          tabTitle: {
            translated: "Valid Tab",
          },
        },
      },
      {
        node: {
          __typename: "UnhandledTabType",
          urn: "ppb:tbd:view:navigationTab:Invalid",
          someProperty: "some value",
        },
      },
      {
        node: {
          __typename: "FavouriteMarketsNavigationTab",
          urn: "ppb:tbd:view:navigationTab:ValidFav",
          badgeText: {
            translated: "3",
          },
        },
      },
    ],
  },
};

const BFF_RESPONSE_EMPTY = {
  __typename: "NavigationTabsList",
  urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
  tabsTitle: "Empty",
  full: {
    edges: [],
  },
  partials: {
    edges: [],
  },
};

describe("NavigationTabList Normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeNavigationTabFragmentIntoNavigationTab", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "Tab Title",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Today",
        items: [
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            badgeText: undefined,
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            badgeText: undefined,
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
        ],
      });
    });

    it("should correctly return the expected structure when certain values are not set", () => {
      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE_ALT);

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Today",
        items: [
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            badgeText: undefined,
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are null", () => {
      const BFF_RESPONSE_ALT_EDGE_NULL = {
        ...BFF_RESPONSE,
        partials: {
          edges: [
            null,
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:navigationTab:Tomorrow",
                badgeText: null,
                tabTitle: {
                  translated: null,
                  translate: {
                    key: "I18N.DATE.TOMORROW",
                  },
                },
                tabViewLink: null,
              },
            },
          ],
        },
      };

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE_ALT_EDGE_NULL);

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "Tab Title",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Today",
        items: [
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            badgeText: undefined,
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
        ],
      });
    });

    it("should correctly transform and return the data object when node does not have urn", () => {
      const BFF_RESPONSE_ALT_INVALID_ITEMS = {
        ...BFF_RESPONSE,
        partials: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
              },
            },
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:navigationTab:Tomorrow",
                tabTitle: {
                  translate: {
                    key: "I18N.DATE.TOMORROW",
                  },
                },
                tabViewLink: null,
              },
            },
          ],
        },
      };

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE_ALT_INVALID_ITEMS);

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "Tab Title",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Today",
        items: [
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            badgeText: undefined,
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
        ],
      });
    });

    it("should correctly transform and return the data object when an item has typename FavouriteMarketsNavigationTab", () => {
      const { data } = normalizeNavigationTabFragmentIntoNavigationTab({
        ...BFF_RESPONSE,
        partials: {
          edges: [
            {
              node: {
                __typename: "FavouriteMarketsNavigationTab",
                urn: "ppb:tbd:card:favouriteMarketsNavigationTab:favourite-markets/e/34630163",
                badgeText: {
                  __typename: "TranslatableText",
                  translated: null,
                  translate: {
                    __typename: "TranslateProps",
                    key: "I18N.COMMON.NEW",
                  },
                },
                tabViewLink: null,
                metadata: {
                  total: {
                    __typename: "FavouriteMarketsCountMetadata",
                    urn: "ppb:tbd:favouriteMarkets:metadata:total",
                    currentCount: 0,
                    limit: 0,
                  },
                },
              },
            },
            ...BFF_RESPONSE.partials.edges,
          ],
        },
      });

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "Tab Title",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Today",
        items: [
          NORMALIZED_FAVOURITE_MARKETS_NAVIGATION_TAB.data,
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
        ],
      });
    });

    it("should handle mixed tab types and only process handled types", () => {
      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE_MIXED_TYPES);

      expect(data).toEqual({
        typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
        title: "Valid Tab",
        selectedTabUrn: "ppb:tbd:view:navigationTab:Valid",
        items: [
          {
            typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:mocked",
            title: {
              translated: "mocked translation",
            },
            viewLink: {
              viewUrl: "some viewUrl",
              viewUrn: "some viewUrn",
            },
          },
          NORMALIZED_FAVOURITE_MARKETS_NAVIGATION_TAB.data,
        ],
      });
    });

    it("should call normalizeNavigationTabPartialFragmentIntoNavigationTabPartial for each NavigationTab", () => {
      normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE);

      expect(normalizeNavigationTabPartialFragmentIntoNavigationTabPartial).toHaveBeenCalledTimes(2);
      expect(normalizeNavigationTabPartialFragmentIntoNavigationTabPartial).toHaveBeenCalledWith({
        __typename: "NavigationTab",
        urn: "ppb:tbd:view:navigationTab:Today",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      });
      expect(normalizeNavigationTabPartialFragmentIntoNavigationTabPartial).toHaveBeenCalledWith({
        __typename: "NavigationTab",
        urn: "ppb:tbd:view:navigationTab:Tomorrow",
        tabTitle: {
          translated: null,
          translate: {
            key: "I18N.DATE.TOMORROW",
          },
        },
        badgeText: null,
        tabViewLink: null,
      });
    });

    describe("selectedTabUrn", () => {
      it("should return undefined selectedTabUrn when both full and partials are empty", () => {
        const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE_EMPTY);

        expect(data).toEqual({
          typename: "NavigationTabsList",
          urn: "ppb:tbd:card:navigationTabsList:navigationTabsList",
          title: "Empty",
          selectedTabUrn: undefined,
          items: [],
        });
      });

      it("should select first partial tab urn when full edge is empty", () => {
        const responseWithFullEdgeEmpty = {
          ...BFF_RESPONSE_EMPTY,
          partials: {
            edges: [
              {
                node: {
                  __typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:FirstPartial",
                  tabTitle: {
                    translated: "First Partial",
                  },
                },
              },
            ],
          },
        };

        const { data } = normalizeNavigationTabFragmentIntoNavigationTab(responseWithFullEdgeEmpty);

        expect(data.selectedTabUrn).toBe("ppb:tbd:view:navigationTab:FirstPartial");
        expect(data.items).toHaveLength(1);
      });

      it("should select first partial tab urn when full edge has no urn property", () => {
        const responseWithFullNodeNoUrn = {
          ...BFF_RESPONSE_EMPTY,
          full: {
            edges: [
              {
                node: {
                  __typename: "SomeOtherType",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:PartialFallback",
                  tabTitle: {
                    translated: "Partial Fallback",
                  },
                },
              },
            ],
          },
        };

        const { data } = normalizeNavigationTabFragmentIntoNavigationTab(responseWithFullNodeNoUrn);

        expect(data.selectedTabUrn).toBe("ppb:tbd:view:navigationTab:PartialFallback");
        expect(data.items).toHaveLength(1);
      });
    });
  });
});
