import { normalizerEngine } from "./normalizer-engine";
import config from "./normalizer-config";

jest.mock("./normalizer-config", () => ({
  normalizers: {
    GenericViewLinkCard: jest.fn(() => ({
      data: { typename: "GenericViewLinkCard", normalizedValue: "normalized" },
    })),
    SportViewLinkCard: jest.fn(() => ({
      data: { typename: "SportViewLinkCard", normalizedValue: "normalized" },
    })),
    Sport: jest.fn(() => ({
      data: { typename: "Sport", normalizedValue: "normalized" },
    })),
    SwimlaneCardGroup: jest.fn(() => ({
      data: { typename: "SwimlaneCardGroup", normalizedValue: "normalized" },
    })),
    GenericView: jest.fn(() => ({
      data: { typename: "GenericView", normalizedValue: "normalized" },
    })),
    BottomBar: jest.fn(() => ({
      data: { typename: "BottomBar", normalizedValue: "normalized" },
    })),
    PebbleCardGroup: jest.fn(() => ({
      data: { typename: "PebbleCardGroup", normalizedValue: "normalized" },
    })),
    FavouriteMarketsNavigationTab: jest.fn(),
    FavouriteMarketsCountMetadata: jest.fn(),
  },
}));

const BFF_MOCK = {
  data: {
    View: {
      __typename: "GenericView",
      urn: "ppb:tbd:view:generic:home",
      url: "",
      title: null,
      canonicalUrl: "/sport/",
      category: "BETTING",
      viewHeader: {
        title: null,
        titleImage: null,
        subTitle: null,
        badge: null,
      },
      items: {
        edges: [
          {
            node: {
              __typename: "SwimlaneCardGroup",
              urn: "ppb:tbd:cardgroup:swimlane:YLjMkhAAACIAwCzH/cv/home",
              cardGroupTitle: null,
              displayName: null,
              titleImage: null,
              viewAll: null,
              full: {
                edges: [
                  {
                    node: {
                      __typename: "GenericViewLinkCard",
                      urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
                      genericViewLinkTitle: {
                        __typename: "DisplayNameTitle",
                        name: "In-Play",
                      },
                      viewLink: {
                        viewUrn: "ppb:tbd:view:generic:inplay",
                        viewUrl: "inplay/all/i-696e706c6179",
                        viewDisplayMode: null,
                      },
                      badge: "INPLAY",
                      sportIcon: null,
                    },
                  },
                  {
                    node: {
                      __typename: "SportViewLinkCard",
                      urn: "ppb:tbd:card:sportViewLink:1",
                      viewLink: {
                        viewUrn: "ppb:tbd:view:sport:1",
                        viewUrl: "football/s-1",
                      },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                        sportId: 1,
                        shortName: null,
                      },
                    },
                  },
                ],
              },
              partials: {
                edges: [
                  {
                    node: {
                      __typename: "GenericViewLinkCard",
                      urn: "ppb:tbd:card:genericViewLink:generic:cHBiOnRiZDp2aWV3OmdlbmVyaWM6aW5wbGF5",
                    },
                  },
                  {
                    node: {
                      __typename: "SportViewLinkCard",
                      urn: "ppb:tbd:card:sportViewLink:1",
                    },
                  },
                ],
              },
            },
          },
          {
            node: {
              __typename: "NavigationTabsList",
              urn: "ppb:tbd:navTabsList:1",
              full: {
                __typename: "NavigationTabConnection",
                edges: [
                  {
                    node: {
                      __typename: "NavigationTab",
                      urn: "ppb:tbd:tab:1",
                      partials: {
                        __typename: "NavigationTabItems",
                        urn: "ppb:tbd:tabItems:1",
                        edges: [
                          {
                            node: {
                              __typename: "PebbleCardGroup",
                              urn: "ppb:tbd:cardgroup:pebbleCardGroup:1",
                              pebbleExpanded: false,
                              pebbleCardGroupTitle: {
                                translate: null,
                                translated: "Match Result",
                                __typename: "TranslatableText",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
          null,
        ],
        pageInfo: null,
      },
      partialItems: {
        edges: [
          {
            node: {
              __typename: "SwimlaneCardGroup",
              urn: "ppb:tbd:cardgroup:swimlane:YLjMkhAAACIAwCzH/cv/home",
            },
          },
          {
            node: {
              __typename: "SwimlaneCardGroup",
              urn: "ppb:tbd:cardgroup:swimlane:ZRAnFBcAACcAqYVS/cv/home",
            },
          },
          {
            node: {
              __typename: "QuicklinksGridCardGroup",
              urn: "ppb:tbd:cardgroup:quicklinksGrid:Yvz_AhAAACAAFRIN/cv/home",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
        hasProductSwitcher: true,
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
              viewDisplayMode: null,
            },
          },
        ],
      },
      regulatoryData: {
        __typename: "RegulatoryData",
        sections: [],
      },
    },
  },
};

describe("Normalizer Engine", () => {
  beforeEach(jest.clearAllMocks);

  it("should normalize all fragments", () => {
    const data = normalizerEngine(BFF_MOCK);

    expect(data).toEqual({
      GenericView: [{ normalizedValue: "normalized", typename: "GenericView" }],
      GenericViewLinkCard: [{ normalizedValue: "normalized", typename: "GenericViewLinkCard" }],
      Sport: [{ normalizedValue: "normalized", typename: "Sport" }],
      SportViewLinkCard: [{ normalizedValue: "normalized", typename: "SportViewLinkCard" }],
      SwimlaneCardGroup: [{ normalizedValue: "normalized", typename: "SwimlaneCardGroup" }],
      BottomBar: [{ normalizedValue: "normalized", typename: "BottomBar" }],
      PebbleCardGroup: [{ normalizedValue: "normalized", typename: "PebbleCardGroup" }],
    });
  });

  it("should ignore fragments without normalizer", () => {
    config.normalizers = {
      GenericViewLinkCard: jest.fn(() => ({
        data: { typename: "GenericViewLinkCard", normalizedValue: "normalized" },
      })),
    };

    const data = normalizerEngine(BFF_MOCK);

    expect(data).toEqual({ GenericViewLinkCard: [{ normalizedValue: "normalized", typename: "GenericViewLinkCard" }] });
  });

  describe("when fragment has inner partials that are normalizable", () => {
    it("should normalize those inner fragments", () => {
      config.normalizers = {
        FavouriteMarketsNavigationTab: jest.fn(() => ({
          data: { typename: "FavouriteMarketsNavigationTab", normalizedValue: "normalized" },
        })),
        FavouriteMarketsCountMetadata: jest.fn(() => ({
          data: { typename: "FavouriteMarketsCountMetadata", normalizedValue: "normalized" },
        })),
      };

      const data = normalizerEngine({
        partials: {
          __typename: "NavigationTabConnection",
          edges: [
            {
              node: {
                __typename: "FavouriteMarketsNavigationTab",
                urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/35131738",
                tabViewLink: {
                  __typename: "ViewLink",
                  viewUrl:
                    "football/english-premier-league/everton-v-leeds/e-35131738?tabId=favourite-markets#favourite-markets",
                  viewUrn: "ppb:tbd:view:event:35131738?=tabId=favourite-markets",
                },
                metadata: {
                  __typename: "FavouriteMarketsMetadata",
                  total: {
                    __typename: "FavouriteMarketsCountMetadata",
                    urn: "ppb:tbd:favouriteMarkets:metadata:total",
                    limit: 50,
                    currentCount: 0,
                  },
                },
              },
            },
          ],
        },
      });

      expect(data).toEqual({
        FavouriteMarketsCountMetadata: [{ typename: "FavouriteMarketsCountMetadata", normalizedValue: "normalized" }],
      });
    });
  });
});
