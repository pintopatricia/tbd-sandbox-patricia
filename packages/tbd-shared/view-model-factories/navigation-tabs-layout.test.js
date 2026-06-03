import { createNavigationTabsLayoutByURNSelector } from "./navigation-tabs-layout";

const getNavigationTabsList = jest.fn();
const getThrottle = jest.fn();
const mockDispatch = jest.fn();
const mockGetState = jest.fn(() => ({}));

jest.mock("@ppb/tbd-store/state/layout/navigation-tabs-list/navigation-tabs-list-selectors", () => ({
  createNavigationTabsListByURNSelector: jest.fn(() => getNavigationTabsList),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

const getNavigationTab = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/navigation-tabs/navigation-tabs-selectors", () => ({
  createNavigationTabByURNSelector: jest.fn(() => getNavigationTab),
}));

const getFavouriteMarketsCountMetadataByURN = jest.fn();

jest.mock(
  "@ppb/tbd-store/state/entities/favourite-markets-count-metadata/favourite-markets-count-metadata-selectors",
  () => ({
    createGetFavouriteMarketsCountMetadataByURNSelector: jest.fn(() => getFavouriteMarketsCountMetadataByURN),
  }),
);

jest.mock("../helpers/translatable-text", () => ({
  buildTranslatableText: jest.fn(() => "TRANSLATABLE_TEXT_TITLE"),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(() => ({
    getState: mockGetState,
    dispatch: mockDispatch,
  })),
}));

const TRANSLATABLE_TEXT_1 = {
  translated: "some title 1",
  translate: {
    key: "SOME.I18N.KEY",
  },
};

const TRANSLATABLE_TEXT_2 = {
  translated: "some title 2",
  translate: {
    key: "OTHER.I18N.KEY",
  },
};

const stateMock = {
  layouts: {
    navigationtabslists: {
      "ppb:tbd:card:navigationTabsList:abc": {
        urn: "ppb:tbd:card:navigationTabsList:abc",
        title: "SOME.I18N.KEY",
        items: [
          {
            urn: "ppb:tbd:view:navigationTab:123",
            title: TRANSLATABLE_TEXT_1,
            badgeText: "some badge text",
          },
          {
            urn: "ppb:tbd:view:navigationTab:456",
            title: TRANSLATABLE_TEXT_2,
            viewLink: "some viewLink",
          },
        ],
      },
    },
    navigationtabs: {
      "ppb:tbd:view:navigationTab:123": {
        urn: "ppb:tbd:view:navigationTab:123",
        title: {
          translated: "some title 1",
          translate: {
            key: "SOME.I18N.KEY",
          },
        },
        items: [
          { urn: "ppb:tbd:card:market#1.333333", typename: "Card" },
          { urn: "card:group:3", typename: "SwimlaneCardGroup" },
        ],
      },
      "ppb:tbd:view:navigationTab:456": {
        urn: "ppb:tbd:view:navigationTab:456",
        title: {
          translated: "some title 2",
          translate: {
            key: "OTHER.I18N.KEY",
          },
        },
        items: [
          { urn: "ppb:tbd:card:3", typename: "Card" },
          { urn: "ppb:tbd:card:4", typename: "Card" },
        ],
      },
    },
  },
  entities: {
    userdetails: {
      loggedIn: true,
    },
  },
  favouriteMarkets: {
    tooltipClosedCounter: 0,
  },
};

const stateMockFavouriteMarket = {
  layouts: {
    navigationtabslists: {
      "ppb:tbd:card:navigationTabsList:abc": {
        urn: "ppb:tbd:card:navigationTabsList:abc",
        title: "SOME.I18N.KEY",
        items: [
          {
            urn: "ppb:tbd:view:favouriteMarketsNavigationTab:123",
            badgeText: "some badge text",
            typename: "FavouriteMarketsNavigationTab",
          },
        ],
      },
    },
    navigationtabs: {
      "ppb:tbd:view:favouriteMarketsNavigationTab:123": {
        urn: "ppb:tbd:view:favouriteMarketsNavigationTab:123",
        items: [
          { urn: "ppb:tbd:card:1", typename: "Card" },
          { urn: "ppb:tbd:card:2", typename: "Card" },
        ],
      },
    },
  },
  entities: {
    brandSettings: {
      ERROR_VIEW_IMAGE: true,
    },
  },
};

const urnMock = "ppb:tbd:card:navigationTabsList:abc";
const urnAndLocaleCodeMock = {
  urn: urnMock,
  localeCode: "en_PT",
};

const mockNavigationTabsList = (list) => getNavigationTabsList.mockReturnValue(list);
const mockNavigationTabSequence = (...tabs) => tabs.forEach((tab) => getNavigationTab.mockReturnValueOnce(tab));
const computeLayout = (state, params = urnAndLocaleCodeMock) => {
  const selector = createNavigationTabsLayoutByURNSelector();
  return selector(state, params);
};

describe("createNavigationTabsLayoutByURNSelector", () => {
  beforeAll(jest.clearAllMocks);

  describe("when there are no navigationTabsLists", () => {
    it("should return undefined", () => {
      getNavigationTabsList.mockReturnValueOnce(undefined);

      const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();
      const navigationTabsLayout = getNavigationTabsLayout(stateMock, urnAndLocaleCodeMock);

      expect(getNavigationTabsList).toHaveBeenCalledTimes(1);

      expect(navigationTabsLayout).toBeUndefined();
    });
  });

  describe("when there are navigationTabsLists", () => {
    describe("and there are no items", () => {
      it("should return undefined", () => {
        const stateWithNoItems = {
          layouts: {
            ...stateMock.layouts,
            navigationtabslists: {
              ...stateMock.layouts.navigationtabslists,
              "ppb:tbd:card:navigationTabsList:abc": {
                ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"],
                items: [],
              },
            },
          },
          favouriteMarkets: {
            tooltipClosedCounter: 0,
          },
        };

        mockNavigationTabsList(stateWithNoItems.layouts.navigationtabslists[urnMock]);

        const navigationTabsLayout = computeLayout(stateWithNoItems);

        expect(navigationTabsLayout).toBeUndefined();
      });
    });

    describe("when there are no tabs", () => {
      it("should return tab content items as empty and hasContent true", () => {
        mockNavigationTabsList(stateMock.layouts.navigationtabslists[urnMock]);
        getNavigationTab.mockReturnValue(undefined);

        const navigationTabsLayout = computeLayout(stateMock);

        expect(navigationTabsLayout).toEqual({
          title: stateMock.layouts.navigationtabslists[urnMock].title,
          headers: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              title: "TRANSLATABLE_TEXT_TITLE",
              statusLabelText: "TRANSLATABLE_TEXT_TITLE",
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              title: "TRANSLATABLE_TEXT_TITLE",
              viewLink: "some viewLink",
            },
          ],
          contents: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              items: [],
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              items: [],
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
          ],
        });
      });
    });

    describe("and all tabs have items", () => {
      it("should return the navigationTabs", () => {
        mockNavigationTabsList(stateMock.layouts.navigationtabslists[urnMock]);
        mockNavigationTabSequence(
          stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
          stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"],
        );

        const navigationTabsLayout = computeLayout(stateMock);

        expect(navigationTabsLayout).toEqual({
          title: stateMock.layouts.navigationtabslists[urnMock].title,
          headers: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              title: "TRANSLATABLE_TEXT_TITLE",
              statusLabelText: "TRANSLATABLE_TEXT_TITLE",
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              title: "TRANSLATABLE_TEXT_TITLE",
              viewLink: "some viewLink",
            },
          ],
          contents: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              items: stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"].items,
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              items: stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"].items,
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
          ],
        });
      });
    });

    describe("and has a tab of FavouriteMarketsNavigationTab type", () => {
      it("should return the navigationTabs with the correct title, headers and contents", () => {
        mockNavigationTabsList(stateMockFavouriteMarket.layouts.navigationtabslists[urnMock]);
        mockNavigationTabSequence(
          stateMockFavouriteMarket.layouts.navigationtabs["ppb:tbd:view:favouriteMarketsNavigationTab:123"],
        );

        const navigationTabsLayout = computeLayout(stateMockFavouriteMarket);

        expect(navigationTabsLayout).toEqual({
          title: stateMockFavouriteMarket.layouts.navigationtabslists[urnMock].title,
          headers: [
            {
              id: "ppb:tbd:view:favouriteMarketsNavigationTab:123",
              title: "TRANSLATABLE_TEXT_TITLE",
              ariaLabel: "favourite",
              statusLabelText: "TRANSLATABLE_TEXT_TITLE",
              icon: "System--star-filled",
            },
          ],
          contents: [
            {
              id: "ppb:tbd:view:favouriteMarketsNavigationTab:123",
              items:
                stateMockFavouriteMarket.layouts.navigationtabs["ppb:tbd:view:favouriteMarketsNavigationTab:123"].items,
              hasContent: true,
              isFavouriteMarketsTab: true,
              hasEmptyStateImage: stateMockFavouriteMarket.entities.brandSettings.ERROR_VIEW_IMAGE,
            },
          ],
        });
      });

      it("should return the corresponding tab with an IconsList.STAR_FILLED icon", () => {
        const stateWithFavouritesTabMock = {
          ...stateMock,
          layouts: {
            ...stateMock.layouts,
            navigationtabslists: {
              ...stateMock.layouts.navigationtabslists,
              "ppb:tbd:card:navigationTabsList:abc": {
                ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"],
                items: [
                  {
                    ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"].items[0],
                    typename: "FavouriteMarketsNavigationTab",
                  },
                ],
              },
            },
          },
        };
        mockNavigationTabsList(stateWithFavouritesTabMock.layouts.navigationtabslists[urnMock]);
        mockNavigationTabSequence(stateWithFavouritesTabMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"]);

        const navigationTabsLayout = computeLayout(stateWithFavouritesTabMock);

        expect(navigationTabsLayout.headers.some((header) => header.icon === "System--star-filled")).toEqual(true);
      });

      describe("when the tooltip throttle is disabled", () => {
        const stateMockWithIcon = {
          ...stateMock,
          layouts: {
            ...stateMock.layouts,
            navigationtabslists: {
              ...stateMock.layouts.navigationtabslists,
              "ppb:tbd:card:navigationTabsList:abc": {
                ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"],
                items: [
                  {
                    ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"].items[0],
                    typename: "FavouriteMarketsNavigationTab",
                    metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
                  },
                  {
                    ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"].items[1],
                  },
                ],
              },
            },
          },
          entities: {
            favouritemarketsmetadatas: [
              {
                "ppb:tbd:favouriteMarkets:metadata:total": {
                  urn: "ppb:tbd:favouriteMarkets:metadata:total",
                  currentCount: {
                    total: 0,
                  },
                },
              },
            ],
          },
        };

        beforeEach(() => {
          getThrottle.mockReturnValue({ isActive: false });
        });

        it("should not add a tooltip if the throttle is inactive", () => {
          mockNavigationTabsList(stateMockWithIcon.layouts.navigationtabslists[urnMock]);
          getNavigationTab.mockReturnValue(stateMockWithIcon.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"]);
          getFavouriteMarketsCountMetadataByURN.mockReturnValue({
            typename: "FavouriteMarketsCountMetadata",
            urn: "ppb:tbd:favouriteMarkets:metadata:total",
            currentCount: 1,
            limit: 2,
          });

          const navigationTabsLayout = computeLayout(stateMockWithIcon);

          expect(navigationTabsLayout.contents[1].tooltip).toBeUndefined();
        });
      });

      describe("when the tooltip throttle is enabled", () => {
        const stateMockWithIcon = {
          ...stateMock,
          layouts: {
            ...stateMock.layouts,
            navigationtabslists: {
              ...stateMock.layouts.navigationtabslists,
              "ppb:tbd:card:navigationTabsList:abc": {
                ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"],
                items: [
                  {
                    ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"].items[0],
                    typename: "FavouriteMarketsNavigationTab",
                    metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
                  },
                  {
                    ...stateMock.layouts.navigationtabslists["ppb:tbd:card:navigationTabsList:abc"].items[1],
                  },
                ],
              },
            },
          },
          entities: {
            favouritemarketsmetadatas: [
              {
                "ppb:tbd:favouriteMarkets:metadata:total": {
                  urn: "ppb:tbd:favouriteMarkets:metadata:total",
                  currentCount: {
                    total: 0,
                  },
                },
              },
            ],
          },
        };

        beforeEach(() => {
          getThrottle.mockReturnValue({ isActive: true });
        });

        it("should not add a tooltip if the throttle is inactive", () => {
          mockNavigationTabsList(stateMockWithIcon.layouts.navigationtabslists[urnMock]);
          getNavigationTab.mockReturnValue(stateMockWithIcon.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"]);

          const navigationTabsLayout = computeLayout(stateMockWithIcon);

          expect(navigationTabsLayout.contents[0].tooltip).toBeUndefined();
        });

        it("should not add a tooltip if totalFavouritedMarkets is not 0", () => {
          const stateWithAddedFavouritedMarkets = {
            ...stateMockWithIcon,
            layouts: {
              ...stateMockWithIcon.layouts,
              navigationtabslists: {
                ...stateMockWithIcon.layouts.navigationtabslists,
                [urnMock]: {
                  ...stateMockWithIcon.layouts.navigationtabslists[urnMock],
                  items: [
                    {
                      ...stateMockWithIcon.layouts.navigationtabslists[urnMock].items[0],
                      metadataTotalURN: "ppb:tbd:favouriteMarkets:metadata:total",
                    },
                  ],
                },
              },
            },
          };

          mockNavigationTabsList(stateWithAddedFavouritedMarkets.layouts.navigationtabslists[urnMock]);
          getNavigationTab.mockReturnValue(
            stateWithAddedFavouritedMarkets.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
          );
          mockGetState.mockReturnValue(stateWithAddedFavouritedMarkets);

          const navigationTabsLayout = computeLayout(stateWithAddedFavouritedMarkets);

          expect(navigationTabsLayout.contents[0].tooltip).toBeUndefined();
        });

        it("should not add a tooltip if tooltipClosedCounter is equal to its limit", () => {
          const stateWithTooltipClosed = {
            ...stateMockWithIcon,
            favouriteMarkets: {
              ...stateMockWithIcon.favouriteMarkets,
              tooltipClosedCounter: 3,
            },
          };

          mockNavigationTabsList(stateWithTooltipClosed.layouts.navigationtabslists[urnMock]);
          getNavigationTab.mockReturnValue(
            stateWithTooltipClosed.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
          );
          mockGetState.mockReturnValue(stateWithTooltipClosed);

          const navigationTabsLayout = computeLayout(stateWithTooltipClosed);

          expect(navigationTabsLayout.contents[0].tooltip).toBeUndefined();
        });

        it("should not display a tooltip if all conditions are met", () => {
          mockGetState.mockReturnValue(stateMockWithIcon);
          mockNavigationTabsList(stateMockWithIcon.layouts.navigationtabslists[urnMock]);
          getNavigationTab.mockReturnValue(stateMockWithIcon.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"]);
          getFavouriteMarketsCountMetadataByURN.mockReturnValue({
            typename: "FavouriteMarketsCountMetadata",
            urn: "ppb:tbd:favouriteMarkets:metadata:total",
            currentCount: 0,
            limit: 2,
          });

          const navigationTabsLayout = computeLayout(stateMockWithIcon);

          // tooltip is meant to be deleted in near future
          // this is a temporary way to hide it until final decision
          // cleanup in #INCGNT-633
          expect(navigationTabsLayout.contents[1].tooltip).toBeUndefined();
        });
      });
    });

    describe("when a tab has empty items", () => {
      it("should return that tab content items as empty", () => {
        const stateWithEmptyTab = {
          layouts: {
            ...stateMock.layouts,
            navigationtabs: {
              ...stateMock.layouts.navigationtabs,
              "ppb:tbd:view:navigationTab:456": {
                ...stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"],
                items: [],
              },
            },
          },
          favouriteMarkets: {
            tooltipClosedCounter: 0,
          },
          entities: {},
        };

        mockNavigationTabsList(stateWithEmptyTab.layouts.navigationtabslists[urnMock]);
        mockNavigationTabSequence(
          stateWithEmptyTab.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
          stateWithEmptyTab.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"],
        );

        const navigationTabsLayout = computeLayout(stateWithEmptyTab);

        expect(navigationTabsLayout).toEqual({
          title: stateWithEmptyTab.layouts.navigationtabslists[urnMock].title,
          headers: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              title: "TRANSLATABLE_TEXT_TITLE",
              statusLabelText: "TRANSLATABLE_TEXT_TITLE",
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              title: "TRANSLATABLE_TEXT_TITLE",
              viewLink: "some viewLink",
            },
          ],
          contents: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              items: stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"].items,
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              items: [],
              hasContent: false,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
          ],
        });
      });
    });

    describe("when a tab has no items yet", () => {
      it("should return tab content items as empty and hasContent true", () => {
        const stateWithNoItemsTab = {
          layouts: {
            ...stateMock.layouts,
            navigationtabs: {
              "ppb:tbd:view:navigationTab:123": {
                ...stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
                items: undefined,
              },
              "ppb:tbd:view:navigationTab:456": {
                ...stateMock.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"],
                items: undefined,
              },
            },
          },
          favouriteMarkets: {
            tooltipClosedCounter: 0,
          },
          entities: {},
        };

        mockNavigationTabsList(stateWithNoItemsTab.layouts.navigationtabslists[urnMock]);
        mockNavigationTabSequence(
          stateWithNoItemsTab.layouts.navigationtabs["ppb:tbd:view:navigationTab:123"],
          stateWithNoItemsTab.layouts.navigationtabs["ppb:tbd:view:navigationTab:456"],
        );

        const navigationTabsLayout = computeLayout(stateWithNoItemsTab);

        expect(navigationTabsLayout).toEqual({
          title: stateWithNoItemsTab.layouts.navigationtabslists[urnMock].title,
          headers: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              title: "TRANSLATABLE_TEXT_TITLE",
              statusLabelText: "TRANSLATABLE_TEXT_TITLE",
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              title: "TRANSLATABLE_TEXT_TITLE",
              viewLink: "some viewLink",
            },
          ],
          contents: [
            {
              id: "ppb:tbd:view:navigationTab:123",
              items: [],
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
            {
              id: "ppb:tbd:view:navigationTab:456",
              items: [],
              hasContent: true,
              isFavouriteMarketsTab: false,
              hasEmptyStateImage: false,
            },
          ],
        });
      });
    });
  });

  describe("when state changes", () => {
    const stateUpdateMock = {
      ...stateMock,
      layouts: {
        ...stateMock.layouts,
        navigationtabs: {
          "ppb:tbd:view:navigationTab:456": {
            ...stateMock.layouts.navigationtabs[0],
          },
          "ppb:tbd:view:navigationTab:789": {
            ...stateMock.layouts.navigationtabs[1],
          },
        },
      },
      favouriteMarkets: {
        tooltipClosedCounter: 0,
      },
    };

    it("should recompute the selector", () => {
      const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();

      getNavigationTabsLayout(stateMock, urnAndLocaleCodeMock);
      getNavigationTabsLayout(stateUpdateMock, urnAndLocaleCodeMock);

      expect(getNavigationTabsLayout.recomputations()).toEqual(2);
    });
  });

  describe("when state doesn't change", () => {
    it("should not recompute the selector", () => {
      const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();

      getNavigationTabsLayout(stateMock, urnAndLocaleCodeMock);
      getNavigationTabsLayout(stateMock, urnAndLocaleCodeMock);

      expect(getNavigationTabsLayout.recomputations()).toEqual(1);
    });
  });

  describe("when localeCode changes", () => {
    it("should recompute the selector", () => {
      const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();

      getNavigationTabsLayout(stateMock, { ...urnAndLocaleCodeMock, localeCode: "pt-AU" });
      getNavigationTabsLayout(stateMock, { ...urnAndLocaleCodeMock, localeCode: "jp-JP" });

      expect(getNavigationTabsLayout.recomputations()).toEqual(2);
    });
  });

  describe("when localeCode doesn't change", () => {
    it("should not recompute the selector", () => {
      const getNavigationTabsLayout = createNavigationTabsLayoutByURNSelector();

      getNavigationTabsLayout(stateMock, { ...urnAndLocaleCodeMock, localeCode: "pt-AU" });
      getNavigationTabsLayout(stateMock, { ...urnAndLocaleCodeMock, localeCode: "pt-AU" });

      expect(getNavigationTabsLayout.recomputations()).toEqual(1);
    });
  });
});
