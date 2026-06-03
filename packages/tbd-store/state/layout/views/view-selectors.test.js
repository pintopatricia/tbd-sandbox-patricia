import {
  createFindViewByURNSelector,
  createFindViewItemByURNSelector,
  createFindCachedViewByURNSelector,
  createItemsByThemeSelector,
} from "./view-selectors";

const layoutsMock = {
  sport: {},
  runner: {},
  allmarkets: {},
  allcompetitions: {},
  browse: {},
  competition: {},
  error: {},
  gaming: {},
  game: {},
  gamingcategory: {},
  gamingsegmentation: {},
  mybets: {},
  myAccount: {},
  race: {},
  maintenance: {},
  notfound: {},
  event: {},
  market: {},
  generic: {},
  settings: {},
  selfexcluded: {},
  imspromotion: {},
  promotions: {},
  promotionshub: {},
  marketrules: {},
  obblandingpage: {},
};

const cardsMock = {
  fixtures: {
    "ppb:tbd:fixture#29606443": { urn: "ppb:tbd:fixture#29606443" },
  },
  markets: {
    "ppb:tbd:card:market#1.123123": {
      urn: "ppb:tbd:card:market#1.123123",
    },
  },
};

const viewsMock = {
  market: {
    "ppb:tbd:marketview:1": {
      urn: "ppb:tbd:marketview:1",
      items: [
        { urn: "ppb:tbd:fixture#29606443", typename: "FixtureCard" },
        { urn: "ppb:tbd:card:market#1.123123", typename: "MarketCard" },
        { urn: "ppb:tbd:card:pebbleMarkets:924.229966790", typename: "PebbleCardGroup" },
      ],
      mainMarket: "ppb:tbd:market:urn",
    },
  },
};

const stateMock = {
  layouts: {
    views: viewsMock,
    cards: cardsMock,
    viewzones: {},
    searchzones: {},
    navigationtabslists: {},
    navigationtabs: {},
    cardgroups: {
      swimlanecardgroups: {},
      halftimespecialsswimlanecardgroups: {},
      couponcardgroups: {},
      segmentedcardgroups: {},
      pebblecardgroups: {},
      filteredcouponcardgroups: {},
      racesbytimerangecardgroups: {},
      futureracingcardgroups: {},
      expandablecardgroups: {},
      gamingcardgroups: {},
      swimlaneindexedcardgroups: {},
      selectableitemscardgroups: {},
      quicklinksgridcardgroups: {},
      sportribboncardgroups: {},
      marketbetcardgroups: {},
      marketbetselectioncardgroups: {},
      marketbetexpandablecardgroups: {},
      betsharingcardgroups: {},
      obbcardgroups: {},
      bytimerangemeetingcardgroup: {},
      racingswimlanecardgroups: {},
      popularswimlanecardgroups: {},
      obbcreatedbetscardgroups: {},
      promotionshubcardgroups: {},
      obbonboardingcardsgroups: {},
    },
  },
  entities: {
    throttles: {},
  },
};

jest.mock("../cards/cards-selectors", () => {
  const mockSelector = jest.fn();

  return {
    createFindCardbyURNSelector: jest.fn(() => mockSelector),
  };
});

const mockTimestamp = 1739542487386;

describe('"views" selectors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date(mockTimestamp));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("createFindCachedViewByURNSelector", () => {
    it("should return null when receiving an URN for a non-existing view", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();

      const view = getCachedViewByURN({ layouts: { views: layoutsMock }, entities: { throttles: {} } }, "urn");

      expect(view).toEqual(null);
    });

    it("should return a view entity when receiving an URN for an existing view", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();
      const mockState = {
        ...stateMock,
        layouts: {
          ...stateMock.layouts,
          views: {
            ...layoutsMock,
            event: {
              urn: { prop: "random" },
            },
          },
        },
        entities: { throttles: {} },
      };
      const view = getCachedViewByURN(mockState, "urn");

      expect(view).toEqual({ prop: "random" });
    });

    it("should return a view entity when receiving an URN for an existing view when VIEW_CACHE_LIFESPAN throttle isn't active", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();
      const mockState = {
        ...stateMock,
        layouts: {
          ...stateMock.layouts,
          views: {
            ...layoutsMock,
            event: {
              urn: { prop: "random" },
            },
          },
        },
        entities: { throttles: { VIEW_CACHE_LIFESPAN: { isActive: false } } },
      };
      const view = getCachedViewByURN(mockState, "urn");

      expect(view).toEqual({ prop: "random" });
    });

    it("should return a view entity when receiving an URN for an existing view when VIEW_CACHE_LIFESPAN throttle active and no metadata", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();
      const mockState = {
        ...stateMock,
        layouts: {
          ...stateMock.layouts,
          views: {
            ...layoutsMock,
            event: {
              urn: { prop: "random" },
            },
          },
        },
        entities: { throttles: { VIEW_CACHE_LIFESPAN: { isActive: true } } },
      };
      const view = getCachedViewByURN(mockState, "urn");

      expect(view).toEqual({ prop: "random" });
    });

    it("should return a view entity when receiving an URN for an existing view when VIEW_CACHE_LIFESPAN throttle active and metadata cache timestamp sill valid", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();
      const mockState = {
        ...stateMock,
        layouts: {
          ...stateMock.layouts,
          views: {
            ...layoutsMock,
            event: {
              urn: { prop: "random", metadata: { cacheTimestamp: mockTimestamp } },
            },
          },
        },
        entities: { throttles: { VIEW_CACHE_LIFESPAN: { isActive: true } } },
      };
      const view = getCachedViewByURN(mockState, "urn");

      expect(view).toEqual({ prop: "random", metadata: { cacheTimestamp: mockTimestamp } });
    });

    it("should return null when receiving an URN for an existing view when VIEW_CACHE_LIFESPAN throttle active but metadata cache timestamp isn't valid", () => {
      const getCachedViewByURN = createFindCachedViewByURNSelector();
      const mockState = {
        ...stateMock,
        layouts: {
          ...stateMock.layouts,
          views: {
            ...layoutsMock,
            event: {
              urn: { prop: "random", metadata: { cacheTimestamp: mockTimestamp - 3600001 } },
            },
          },
        },
        entities: { throttles: { VIEW_CACHE_LIFESPAN: { isActive: true } } },
      };
      const view = getCachedViewByURN(mockState, "urn");

      expect(view).toBeNull();
    });
  });

  describe("createFindViewByURNSelector", () => {
    it("must return null when receiving an URN for a non-existing view", () => {
      const getViewByUrn = createFindViewByURNSelector();

      const view = getViewByUrn(layoutsMock, "urn");

      expect(view).toEqual(null);
    });

    it("must return a view entity when receiving an URN for an existing view", () => {
      const getViewByUrn = createFindViewByURNSelector();

      const view = getViewByUrn(
        {
          ...layoutsMock,
          event: {
            urn: { prop: "random" },
          },
        },
        "urn",
      );

      expect(view).toEqual({ prop: "random" });
    });
  });

  describe("createItemsByThemeSelector", () => {
    const makeItem = (urn, theme) => ({ urn, typename: "Card", theme });

    it("should return an empty array when view has no items", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      expect(getItemsByTheme({ items: [] })).toEqual([]);
    });

    it("should return an empty array when view items is undefined", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      expect(getItemsByTheme({ items: undefined })).toEqual([]);
    });

    it("should group consecutive items with the same theme into one entry", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      const item1 = makeItem("1", "HIGHLIGHTED");
      const item2 = makeItem("2", "HIGHLIGHTED");

      expect(getItemsByTheme({ items: [item1, item2] })).toEqual([
        { theme: "HIGHLIGHTED", itemsThemed: [item1, item2] },
      ]);
    });

    it("should create separate groups for items with different themes", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      const item1 = makeItem("1", "HIGHLIGHTED");
      const item2 = makeItem("2", null);

      expect(getItemsByTheme({ items: [item1, item2] })).toEqual([
        { theme: "HIGHLIGHTED", itemsThemed: [item1] },
        { theme: null, itemsThemed: [item2] },
      ]);
    });

    it("should treat undefined theme as null", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      const item1 = makeItem("1", undefined);
      const item2 = makeItem("2", undefined);

      expect(getItemsByTheme({ items: [item1, item2] })).toEqual([{ theme: null, itemsThemed: [item1, item2] }]);
    });

    it("should create a new group each time the theme changes", () => {
      const getItemsByTheme = createItemsByThemeSelector();
      const item1 = makeItem("1", "HIGHLIGHTED");
      const item2 = makeItem("2", null);
      const item3 = makeItem("3", "HIGHLIGHTED");

      expect(getItemsByTheme({ items: [item1, item2, item3] })).toEqual([
        { theme: "HIGHLIGHTED", itemsThemed: [item1] },
        { theme: null, itemsThemed: [item2] },
        { theme: "HIGHLIGHTED", itemsThemed: [item3] },
      ]);
    });
  });

  describe("createFindViewItemByURNSelector", () => {
    it("must return null when receiving an URN for a non-existing view item", () => {
      const getViewItemByURN = createFindViewItemByURNSelector();

      const viewItem = getViewItemByURN(stateMock.layouts, "urn");

      expect(viewItem).toEqual(null);
    });

    it("must return a view item entity when receiving an URN for an existing view", () => {
      const getViewItemByURN = createFindViewItemByURNSelector();

      const viewItem = getViewItemByURN(
        {
          ...stateMock.layouts,
          cardgroups: {
            ...stateMock.layouts.cardgroups,
            swimlanecardgroups: {
              urn: { prop: "random" },
            },
          },
        },
        "urn",
      );

      expect(viewItem).toEqual({ prop: "random" });
    });
  });
});
