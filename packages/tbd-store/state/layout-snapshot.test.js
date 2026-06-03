import { generateLayoutSnapshot, resetSnapshot, getLayoutMetadata, findParentMetadata } from "./layout-snapshot";

const getStateSpy = jest.fn().mockReturnValue({
  router: {
    currentUrn: "ppb:tbd:view:sport:1",
    currentTabUrn: undefined,
  },
});

jest.mock("../create-store", () => ({
  getStore: jest.fn(() => ({
    getState: getStateSpy,
  })),
}));

describe("Layout Snapshot", () => {
  afterEach(() => {
    resetSnapshot();
  });

  describe("generateLayoutSnapshot", () => {
    it("should generate a flat tree representing the ppb:tbd:view:sport:1 view UI layout", () => {
      const result = generateLayoutSnapshot(
        {
          data: {
            SportView: [
              {
                typename: "SportView",
                urn: "ppb:tbd:view:sport:1 ",
                title: {
                  translated: "View Title",
                },
                items: [{ typename: "SwimlaneCardGroup", urn: "ppb:tbd:cardgroup:1" }],
              },
            ],
            SwimlaneCardGroup: [
              {
                typename: "SwimlaneCardGroup",
                urn: "ppb:tbd:cardgroup:1",
                title: "Card Group Title",
                items: [
                  { typename: "RandomCard", urn: "ppb:tbd:card:0" },
                  { typename: "RandomCard", urn: "ppb:tbd:card:1" },
                ],
              },
            ],
            RandomCard: [
              {
                typename: "RandomCard",
                urn: "ppb:tbd:card:1",
              },
            ],
          },
        },
        "ppb:tbd:view:sport:1",
      );

      expect(result).toEqual({
        "ppb:tbd:view:sport:1": {
          "ppb:tbd:card:0": {
            parent: "ppb:tbd:cardgroup:1",
            parentTypename: "SwimlaneCardGroup",
            position: 1,
            typename: "RandomCard",
          },
          "ppb:tbd:card:1": {
            parent: "ppb:tbd:cardgroup:1",
            parentTypename: "SwimlaneCardGroup",
            position: 2,
            title: undefined,
            typename: "RandomCard",
          },
          "ppb:tbd:cardgroup:1": {
            parent: "ppb:tbd:view:sport:1 ",
            parentTypename: "SportView",
            position: 1,
            title: "Card Group Title",
            typename: "SwimlaneCardGroup",
          },
          "ppb:tbd:view:sport:1 ": {
            title: "View Title",
            typename: "SportView",
          },
        },
      });
    });

    describe("when displayName is present", () => {
      it("should extract title from displayName", () => {
        const result = generateLayoutSnapshot(
          {
            data: {
              PackagedCreatedBetsCard: [
                {
                  typename: "RandomCard",
                  urn: "ppb:tbd:card:displayName-1",
                  displayName: {
                    name: "Display Name",
                    translationKey: "I18N.KEY",
                  },
                },
              ],
              RandomCard: [
                {
                  typename: "RandomCard",
                  urn: "ppb:tbd:card:displayName-2",
                  displayName: {
                    translationKey: "I18N.TRANSLATION_KEY",
                  },
                },
              ],
            },
          },
          "ppb:tbd:view:sport:6",
        );

        expect(result["ppb:tbd:view:sport:6"]["ppb:tbd:card:displayName-1"].title).toBe("Display Name");
        expect(result["ppb:tbd:view:sport:6"]["ppb:tbd:card:displayName-2"].title).toBe("I18N.TRANSLATION_KEY");
      });

      it("should handle null or undefined displayName", () => {
        const result = generateLayoutSnapshot(
          {
            data: {
              RandomCard: [
                {
                  typename: "RandomCard",
                  urn: "ppb:tbd:card:displayName-null",
                  displayName: null,
                },
                {
                  typename: "RandomCard",
                  urn: "ppb:tbd:card:displayName-undefined",
                  displayName: undefined,
                },
              ],
            },
          },
          "ppb:tbd:view:sport:7",
        );

        expect(result["ppb:tbd:view:sport:7"]["ppb:tbd:card:displayName-null"].title).toBeUndefined();
        expect(result["ppb:tbd:view:sport:7"]["ppb:tbd:card:displayName-undefined"].title).toBeUndefined();
      });
    });
  });

  describe("getLayoutMetadata", () => {
    describe("when has apolloCurrentURN defined", () => {
      it("should return the correct metadata for a given urn", () => {
        const data = {
          __typename: "StatsContentCardGroup",
          urn: "ppb:tbd:stats:cardgroup:statsContent:1",
          partials: {
            edges: [
              {
                displayName: {
                  translationKey: "Pitch",
                },
                type: "PITCH",
                node: {
                  __typename: "StatsBroadcastsCard",
                  urn: "ppb:tbd:stats:card:broadcasts:1",
                },
              },
              {
                displayName: {
                  translationKey: "Match Stats",
                },
                type: "STATS",
                node: {
                  __typename: "StatsMatchStatsCard",
                  urn: "ppb:tbd:stats:card:matchstats:1",
                },
              },
            ],
          },
        };

        const snapshot = {
          data: { StatsContentCardGroup: [data] },
        };

        const urn = "ppb:tbd:stats:cardgroup:statsContent:1";
        generateLayoutSnapshot(snapshot, urn);

        const result = getLayoutMetadata("ppb:tbd:stats:card:broadcasts:1", urn);
        expect(result).toEqual({
          tabName: "Pitch",
          title: "Pitch",
        });
      });
    });

    it("should retrieve the view urn data that was generated and stored into a singleton", () => {
      generateLayoutSnapshot(
        {
          data: {
            SportView: [
              {
                typename: "SportView",
                urn: "ppb:tbd:view:sport:1",
                title: {
                  translated: "View Title",
                },
                items: [{ typename: "SwimlaneCardGroup", urn: "ppb:tbd:cardgroup:1" }],
              },
            ],
            SwimlaneCardGroup: [
              {
                typename: "SwimlaneCardGroup",
                urn: "ppb:tbd:cardgroup:1",
                title: "Card Group Title",
              },
            ],
          },
        },
        "ppb:tbd:view:sport:1",
      );

      expect(getLayoutMetadata("ppb:tbd:cardgroup:1")).toEqual({
        viewTitle: "View Title",
        cardGroupTitle: "Card Group Title",
        title: "Card Group Title",
        verticalPosition: 1,
        cardGroupUrn: "ppb:tbd:cardgroup:1",
        viewUrn: "ppb:tbd:view:sport:1",
      });
    });

    describe("tabName", () => {
      it("should not set tabName when typename is undefined", () => {
        const currentUrn = "ppb:tbd:card:market:popular:1";

        generateLayoutSnapshot(
          {
            data: {
              PebbleCardGroup: [
                {
                  urn: "ppb:tbd:cardgroup:pebble:popular",
                  items: [{ urn: "ppb:tbd:card:market:popular:1" }],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBeUndefined();
      });

      it("should not set tabName when card is nested under a NavigationTabsList but has no title", () => {
        const currentUrn = "ppb:tbd:card:market:popular:1";

        generateLayoutSnapshot(
          {
            data: {
              NavigationTabsList: [
                {
                  urn: "ppb:tbd:navigationTabsList:event:34892548",
                  typename: "NavigationTabsList",
                  selectedTabUrn: "ppb:tbd:view:navigationTab:popular",
                  items: [
                    {
                      typename: "NavigationTab",
                      urn: "ppb:tbd:view:navigationTab:popular",
                      items: [
                        {
                          typename: "PebbleCardGroup",
                          urn: "ppb:tbd:cardgroup:pebble:popular",
                          items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:popular:1" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              NavigationTab: [
                {
                  typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:popular",
                  items: [
                    {
                      typename: "PebbleCardGroup",
                      urn: "ppb:tbd:cardgroup:pebble:popular",
                    },
                  ],
                },
              ],
              PebbleCardGroup: [
                {
                  typename: "PebbleCardGroup",
                  urn: "ppb:tbd:cardgroup:pebble:popular",
                  items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:popular:1" }],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "ppb:tbd:view:navigationTab:popular",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBeUndefined();
      });

      it("should set tabName when card is nested under a NavigationTabsList", () => {
        const currentUrn = "ppb:tbd:card:market:popular:1";

        generateLayoutSnapshot(
          {
            data: {
              NavigationTabsList: [
                {
                  urn: "ppb:tbd:navigationTabsList:event:34892548",
                  typename: "NavigationTabsList",
                  selectedTabUrn: "ppb:tbd:view:navigationTab:popular",
                  items: [
                    {
                      typename: "NavigationTab",
                      urn: "ppb:tbd:view:navigationTab:popular",
                      items: [
                        {
                          typename: "PebbleCardGroup",
                          urn: "ppb:tbd:cardgroup:pebble:popular",
                          items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:popular:1" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              NavigationTab: [
                {
                  typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:popular",
                  title: "Popular",
                  items: [
                    {
                      typename: "PebbleCardGroup",
                      urn: "ppb:tbd:cardgroup:pebble:popular",
                    },
                  ],
                },
              ],
              PebbleCardGroup: [
                {
                  typename: "PebbleCardGroup",
                  urn: "ppb:tbd:cardgroup:pebble:popular",
                  items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:popular:1" }],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "ppb:tbd:view:navigationTab:popular",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe("Popular");
      });

      it("should set tabName when card is nested under a FavouriteMarketsNavigationTab", () => {
        const currentUrn = "ppb:tbd:card:market:favourite:1";

        generateLayoutSnapshot(
          {
            data: {
              NavigationTabsList: [
                {
                  urn: "ppb:tbd:navigationTabsList:event:34892548",
                  typename: "NavigationTabsList",
                  selectedTabUrn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/34892548",
                  items: [
                    {
                      typename: "FavouriteMarketsNavigationTab",
                      urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/34892548",
                      items: [
                        {
                          typename: "PebbleCardGroup",
                          urn: "ppb:tbd:cardgroup:pebble:favourite",
                          items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:favourite:1" }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/34892548",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe("favourite");
      });

      it("should use fallback title when currentTabUrn is not provided", () => {
        const currentUrn = "ppb:tbd:card:market:default:1";
        const fallbackTabTitle = "Fallback Tab Title";

        generateLayoutSnapshot(
          {
            data: {
              NavigationTabsList: [
                {
                  urn: "ppb:tbd:navigationTabsList:event:34892548",
                  typename: "NavigationTabsList",
                  items: [
                    {
                      typename: "NavigationTab",
                      urn: "ppb:tbd:view:navigationTab:default",
                      items: [
                        {
                          typename: "PebbleCardGroup",
                          urn: "ppb:tbd:cardgroup:pebble:default",
                          items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:default:1" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              NavigationTab: [
                {
                  typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:default",
                  title: fallbackTabTitle,
                  items: [
                    {
                      typename: "PebbleCardGroup",
                      urn: "ppb:tbd:cardgroup:pebble:default",
                    },
                  ],
                },
              ],
              PebbleCardGroup: [
                {
                  typename: "PebbleCardGroup",
                  urn: "ppb:tbd:cardgroup:pebble:default",
                  items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:default:1" }],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: undefined,
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe(fallbackTabTitle);
      });

      it("should use fallback title when snapshot item is not found", () => {
        const currentUrn = "ppb:tbd:card:market:missing:1";
        const fallbackTabTitle = "Fallback Tab Title";

        generateLayoutSnapshot(
          {
            data: {
              NavigationTabsList: [
                {
                  urn: "ppb:tbd:navigationTabsList:event:34892548",
                  typename: "NavigationTabsList",
                  title: fallbackTabTitle,
                  items: [
                    {
                      typename: "NavigationTab",
                      urn: "ppb:tbd:view:navigationTab:missing",
                      items: [
                        {
                          typename: "PebbleCardGroup",
                          urn: "ppb:tbd:cardgroup:pebble:missing",
                          items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:missing:1" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              PebbleCardGroup: [
                {
                  typename: "PebbleCardGroup",
                  urn: "ppb:tbd:cardgroup:pebble:missing",
                  items: [{ typename: "MarketCard", urn: "ppb:tbd:card:market:missing:1" }],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "ppb:tbd:view:navigationTab:non-existing",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe(fallbackTabTitle);
      });

      it("should set tabName when card is nested under an ObbSquadBetCard", () => {
        const currentUrn = "ppb:tbd:card:opp:squad:1";

        generateLayoutSnapshot(
          {
            data: {
              ObbSquadBetCard: [
                {
                  typename: "ObbSquadBetCard",
                  urn: "ppb:tbd:opp:squad:card:1",
                  title: "Squad Bets",
                  items: [
                    {
                      typename: "ObbCardGroup",
                      urn: "ppb:tbd:opp:cardgroup:squad:1",
                      items: [{ typename: "RandomCard", urn: "ppb:tbd:card:opp:squad:1" }],
                    },
                  ],
                },
              ],
              ObbCardGroup: [
                {
                  typename: "ObbCardGroup",
                  urn: "ppb:tbd:opp:cardgroup:squad:1",
                  title: "Squad Group",
                  items: [{ typename: "RandomCard", urn: "ppb:tbd:card:opp:squad:1" }],
                },
              ],
              NavigationTab: [
                {
                  typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:squadBets",
                  title: "Squad Bets",
                  items: [
                    {
                      typename: "ObbSquadBetCard",
                      urn: "ppb:tbd:opp:squad:card:1",
                    },
                  ],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe("Squad Bets");
      });

      it("should set tabName when card is nested under an ObbCreatedBetsCardGroup", () => {
        const currentUrn = "ppb:tbd:card:opp:created:1";

        generateLayoutSnapshot(
          {
            data: {
              ObbCreatedBetsCardGroup: [
                {
                  typename: "ObbCreatedBetsCardGroup",
                  urn: "ppb:tbd:opp:created:group:1",
                  items: [
                    {
                      typename: "ObbCreatedBetsCard",
                      urn: "ppb:tbd:opp:created:card:1",
                      items: [{ typename: "RandomCard", urn: "ppb:tbd:card:opp:created:1" }],
                    },
                  ],
                },
              ],
              NavigationTab: [
                {
                  typename: "NavigationTab",
                  urn: "ppb:tbd:view:navigationTab:obbCreatedBets",
                  title: "OBB Created Bets",
                  items: [
                    {
                      typename: "ObbCreatedBetsCardGroup",
                      urn: "ppb:tbd:opp:created:group:1",
                    },
                  ],
                },
              ],
            },
          },
          currentUrn,
        );

        getStateSpy.mockReturnValueOnce({
          router: {
            currentUrn,
            currentTabUrn: "",
          },
        });

        const result = getLayoutMetadata(currentUrn);

        expect(result.tabName).toBe("OBB Created Bets");
      });
    });
  });

  describe("resetSnapshot", () => {
    it("should clear the previous generated state", () => {
      generateLayoutSnapshot(
        {
          data: {
            SportView: [
              {
                typename: "SportView",
                urn: "ppb:tbd:view:sport:1",
                title: {
                  translated: "View Title",
                },
              },
            ],
          },
        },
        "ppb:tbd:view:sport:1",
      );

      resetSnapshot();

      expect(getLayoutMetadata("ppb:tbd:view:sport:1")).toEqual({});
    });
  });

  describe("findParentMetadata", () => {
    const snapshotSlice = {
      node1: { typename: "ChildType", parent: "node2" },
      node2: { typename: "ParentType", parent: "node3" },
      node3: { typename: "RootType" },
      node4: { typename: "LeafType" },
    };

    it("should return current node when typename are equal", () => {
      const result = findParentMetadata("ChildType", snapshotSlice.node1, snapshotSlice);
      expect(result).toBe(snapshotSlice.node1);
    });

    it("should return the parent node", () => {
      const result = findParentMetadata("ParentType", snapshotSlice.node1, snapshotSlice);
      expect(result).toBe(snapshotSlice.node2);
    });

    it("should return matching node using regex", () => {
      const result = findParentMetadata("^Parent", snapshotSlice.node1, snapshotSlice, true);
      expect(result).toBe(snapshotSlice.node2);
    });

    it("should return null when no match is found", () => {
      const result = findParentMetadata("non-existing-type", snapshotSlice.node4, snapshotSlice);
      expect(result).toBeNull();
    });
  });
});
