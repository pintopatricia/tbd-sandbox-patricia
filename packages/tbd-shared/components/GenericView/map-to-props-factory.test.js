import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => {
  const getViewByURN = jest.fn();
  const { createItemsByThemeSelector } = jest.requireActual("@ppb/tbd-store/state/layout/views/view-selectors");

  return {
    createFindViewByURNSelector: jest.fn(() => getViewByURN),
    createItemsByThemeSelector,
  };
});

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => `${key} translated`),
}));

describe("makeMapStateToProps", () => {
  const FAKE_SPORT_VIEW = {
    typename: "fakeViewType",
    urn: "fakeSportViewUrn",
    sport: "ppb:eventType:1",
    items: [
      { urn: "1", typename: "Card", theme: "HIGHLIGHTED" },
      { urn: "2", typename: "Card", theme: null },
    ],
    title: "Sport Title",
  };
  const SPORT_VIEWS = {
    router: {},
    layouts: {
      views: {
        sport: {
          fakeSportViewUrn: FAKE_SPORT_VIEW,
          fakeSportViewUrnWithViewHeader: {
            ...FAKE_SPORT_VIEW,
            urn: "fakeSportViewUrnWithViewHeader",
            viewHeader: {
              title: "VIEW HEADER TITLE",
              subTitle: "VIEW HEADER SUBTITLE",
              badge: "ODDSONTHAT",
            },
          },
        },
      },
    },
    entities: {
      brandSettings: {
        HIGHLIGHTED_SPORTS_RIBBON: false,
        HIGHLIGHTED_TABS_LIST: false,
      },
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  const SPORT_VIEW_WITHOUT_ITEMS = {
    router: {},
    layouts: {
      views: {
        sport: {
          fakeSportViewUrn: {
            urn: "fakeSportViewUrn",
            sport: "ppb:eventType:1",
            title: "",
          },
        },
      },
    },
    entities: {
      brandSettings: {
        HIGHLIGHTED_SPORTS_RIBBON: false,
        HIGHLIGHTED_TABS_LIST: false,
      },
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  const FAKE_IMS_PROMOTION_VIEW = {
    typename: "ImsPromotionView",
    urn: "fakePromotionViewUrn",
    url: "fakePromotionViewUrl",
    items: [
      { urn: "1", typename: "Card" },
      { urn: "2", typename: "Card" },
    ],
    title: "Promotion Title",
  };

  const FAKE_MARKET_RULES_VIEW = {
    typename: "MarketRulesView",
    urn: "ppb:tbd:view:marketRules:fake",
    url: "fakeMarketRulesViewUrl",
    items: [
      { urn: "1", typename: "Card" },
      { urn: "2", typename: "Card" },
    ],
    title: "",
  };

  const IMS_PROMOTION_VIEWS = {
    router: {},
    layouts: {
      views: {
        imspromotion: {
          fakePromotionViewUrn: FAKE_IMS_PROMOTION_VIEW,
        },
      },
    },
    entities: {
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  const MARKET_RULES_VIEWS = {
    router: {},
    layouts: {
      views: {
        marketrules: {
          "ppb:tbd:view:marketRules:fake": FAKE_MARKET_RULES_VIEW,
        },
      },
    },
    entities: {
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  const FAKE_SETTINGS_VIEW = {
    typename: "SettingsView",
    urn: "fakeSettingsViewUrn",
    url: "fakeSettingsViewUrl",
    items: [
      { urn: "1", typename: "Card" },
      { urn: "2", typename: "Card" },
    ],
  };
  const FAKE_STATISTICS_VIEW = {
    urn: "ppb:tbd:view:generic:statistics",
  };
  const SETTINGS_VIEWS = {
    router: {},
    layouts: {
      views: {
        settings: {
          fakeSettingsViewUrn: FAKE_SETTINGS_VIEW,
        },
      },
    },
    entities: {
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  const STATISTICS_VIEWS = {
    router: {},
    layouts: {
      views: {
        statistics: {
          "ppb:tbd:view:generic:statistics": FAKE_STATISTICS_VIEW,
        },
      },
    },
    entities: {
      throttles: {
        PIN_GAMING_SEARCH: { isActive: false },
      },
    },
  };

  function setup(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ sport = {} }) => sport[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  function setupMarketRulesView(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ marketrules = {} }) => marketrules[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  function setupImsPromotionView(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ imspromotion = {} }) => imspromotion[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  function setupSettingsView(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ settings = {} }) => settings[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  function setupStatisticsView(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ statistics = {} }) => statistics[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  beforeEach(jest.clearAllMocks);

  describe("when there is layout for provided URN", () => {
    it("should getSportViewbyURN from state", () => {
      setup(SPORT_VIEWS, "fakeSportViewUrn");
      expect(createFindViewByURNSelector()).toHaveBeenCalledWith(SPORT_VIEWS.layouts.views, "fakeSportViewUrn");
    });

    it("should getImsPromotionViewbyURN from state", () => {
      setupImsPromotionView(IMS_PROMOTION_VIEWS, "fakePromotionViewUrn");
      expect(createFindViewByURNSelector()).toHaveBeenCalledWith(
        IMS_PROMOTION_VIEWS.layouts.views,
        "fakePromotionViewUrn",
      );
    });

    it("should getMarketRulesViewbyURN from state", () => {
      setupImsPromotionView(MARKET_RULES_VIEWS, "ppb:tbd:view:marketRules:fake");
      expect(createFindViewByURNSelector()).toHaveBeenCalledWith(
        MARKET_RULES_VIEWS.layouts.views,
        "ppb:tbd:view:marketRules:fake",
      );
    });

    describe("and there is no viewHeader", () => {
      it("should return page layout", () => {
        const view = setup(SPORT_VIEWS, "fakeSportViewUrn");

        expect(view).toEqual({
          items: [
            { urn: "1", typename: "Card", theme: "HIGHLIGHTED" },
            { urn: "2", typename: "Card", theme: null },
          ],
          itemsByTheme: [
            {
              theme: "HIGHLIGHTED",
              itemsThemed: [{ urn: "1", typename: "Card", theme: "HIGHLIGHTED" }],
            },
            {
              theme: null,
              itemsThemed: [{ urn: "2", typename: "Card", theme: null }],
            },
          ],
          isModalView: false,
          title: "Sport Title",
          badge: undefined,
          subtitle: undefined,
          areTabsHighlighted: false,
          pinGamingSearch: false,
        });
      });
    });

    describe("and there is viewHeader", () => {
      it("should return page layout with viewHeader properties", () => {
        const view = setup(SPORT_VIEWS, "fakeSportViewUrnWithViewHeader");

        expect(view).toEqual({
          items: [
            { urn: "1", typename: "Card", theme: "HIGHLIGHTED" },
            { urn: "2", typename: "Card", theme: null },
          ],
          itemsByTheme: [
            {
              theme: "HIGHLIGHTED",
              itemsThemed: [{ urn: "1", typename: "Card", theme: "HIGHLIGHTED" }],
            },
            {
              theme: null,
              itemsThemed: [{ urn: "2", typename: "Card", theme: null }],
            },
          ],
          isModalView: false,
          title: "VIEW HEADER TITLE",
          badge: undefined,
          subtitle: "VIEW HEADER SUBTITLE",
          areTabsHighlighted: false,
          pinGamingSearch: false,
        });
      });
    });

    describe("when we have MarketRulesView", () => {
      it("should return page layout with viewHeader properties", () => {
        const view = setupMarketRulesView(MARKET_RULES_VIEWS, "ppb:tbd:view:marketRules:fake");

        expect(i18n).toHaveBeenCalledTimes(1);
        expect(view).toEqual(
          {
            items: [
              { urn: "1", typename: "Card" },
              { urn: "2", typename: "Card" },
            ],
            itemsByTheme: [
              {
                theme: null,
                itemsThemed: [
                  { urn: "1", typename: "Card" },
                  { urn: "2", typename: "Card" },
                ],
              },
            ],
            isModalView: true,
            title: "I18N.MARKET_RULES translated",
            badge: undefined,
            subtitle: undefined,
            pinGamingSearch: false,
          },
          {},
        );
      });
    });

    describe("when we have imspromotionView", () => {
      it("should return page layout", () => {
        const view = setupImsPromotionView(IMS_PROMOTION_VIEWS, "fakePromotionViewUrn");

        expect(view).toEqual(
          {
            items: [
              { urn: "1", typename: "Card" },
              { urn: "2", typename: "Card" },
            ],
            itemsByTheme: [
              {
                theme: null,
                itemsThemed: [
                  { urn: "1", typename: "Card" },
                  { urn: "2", typename: "Card" },
                ],
              },
            ],
            isModalView: true,
            title: "Promotion Title",
            badge: undefined,
            subtitle: undefined,
            pinGamingSearch: false,
          },
          {},
        );
      });
    });

    describe("when we have settings view", () => {
      it("should return page layout", () => {
        const view = setupSettingsView(SETTINGS_VIEWS, "fakeSettingsViewUrn");

        expect(view).toEqual(
          {
            items: [
              { urn: "1", typename: "Card" },
              { urn: "2", typename: "Card" },
            ],
            itemsByTheme: [
              {
                theme: null,
                itemsThemed: [
                  { urn: "1", typename: "Card" },
                  { urn: "2", typename: "Card" },
                ],
              },
            ],
            isModalView: true,
            title: "",
            badge: undefined,
            subtitle: undefined,
            pinGamingSearch: false,
          },
          {},
        );
      });

      describe("when we have statistics view", () => {
        it("should return page layout", () => {
          const view = setupStatisticsView(STATISTICS_VIEWS, "ppb:tbd:view:generic:statistics");

          expect(view).toEqual(
            {
              isModalView: true,
              title: "",
              badge: undefined,
              subtitle: undefined,
              items: [],
              itemsByTheme: [],
              pinGamingSearch: false,
            },
            {},
          );
        });
      });
    });
  });

  describe("when there is no layout for provided URN", () => {
    it("should getSportViewbyURN from state", () => {
      setup(
        {
          layouts: {
            views: {},
          },
          router: {},
        },
        "fakeSportViewUrn",
      );
      expect(createFindViewByURNSelector()).toHaveBeenCalledWith({}, "fakeSportViewUrn");
    });

    it("should return an empty object when no view is found", () => {
      const result = setup(
        {
          layouts: {
            views: {},
          },
          router: {},
        },
        "fakeSportViewUrn",
      );

      expect(result).toEqual({});
    });
  });

  describe("when there are no items for provided URN", () => {
    it("should return empty items", () => {
      const { items } = setup(SPORT_VIEW_WITHOUT_ITEMS, "fakeSportViewUrn");

      expect(items).toEqual([]);
    });

    it("return title as empty string if no title is provided to the view", () => {
      const { title } = setup(SPORT_VIEW_WITHOUT_ITEMS, "fakeSportViewUrn");

      expect(title).toEqual("");
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards from list action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;
      const urn = "fakeMyBetsViewUrn";
      const partials = ["fakeMyBetsViewUrn", "fakeUrn"];

      expect(dispatchFetchCards(urn, partials)).toEqual({
        payload: {
          urn,
          partials,
        },
        type: FETCH_CARDS_FROM_LIST,
      });
    });
  });
});
