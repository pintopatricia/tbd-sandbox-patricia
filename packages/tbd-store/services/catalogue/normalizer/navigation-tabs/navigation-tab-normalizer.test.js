import normalizeNavigationTabFragmentIntoNavigationTab, {
  normalizeNavigationTabPartialFragmentIntoNavigationTabPartial,
} from "./navigation-tab-normalizer";

jest.mock("../translatable-text/translatable-text-normalizer", () =>
  jest.fn(() => ({ data: { translated: "mocked translation" } })),
);

const BFF_RESPONSE = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:navigationtab:Today",
  tabTitle: {
    translated: "Today",
    translate: null,
  },
  badgeText: null,
  tabViewLink: {
    viewUrl: "some viewUrl",
    viewUrn: "some viewUrn",
  },
  full: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
        },
      },
    ],
  },
};

describe("NavigationTab Normalizer", () => {
  describe("normalizeNavigationTabFragmentIntoNavigationTab", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970405",
          },
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      const response = BFF_RESPONSE;
      response.partials.edges[0] = null;

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(response);

      expect(data).toEqual({
        typename: "NavigationTab",
        title: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        urn: "ppb:tbd:navigationtab:Today",
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when full is null", () => {
      const response = BFF_RESPONSE;
      response.full.edges[0] = null;

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(response);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventPrimaryMarket:29970406",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are empty", () => {
      const response = BFF_RESPONSE;
      response.partials.edges = [];

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(response);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [],
      });
    });

    it("should correctly transform and return the data object when badgeText is defined", () => {
      const response = BFF_RESPONSE;
      response.badgeText = {
        translated: "NEW",
      };

      const { data } = normalizeNavigationTabFragmentIntoNavigationTab(response);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        badgeText: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
        items: [],
      });
    });
  });

  describe("normalizeNavigationTabPartialFragmentIntoNavigationTabPartial", () => {
    it("should correctly transform and return the data object", () => {
      const partialFragment = {
        __typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      };

      const { data } = normalizeNavigationTabPartialFragmentIntoNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        badgeText: undefined,
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      });
    });

    it("should correctly transform and return the data object with badgeText", () => {
      const partialFragment = {
        __typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: {
          translated: "NEW",
          translate: null,
        },
        tabViewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      };

      const { data } = normalizeNavigationTabPartialFragmentIntoNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        badgeText: {
          translated: "mocked translation",
        },
        viewLink: {
          viewUrl: "some viewUrl",
          viewUrn: "some viewUrn",
        },
      });
    });

    it("should correctly transform and return the data object without viewLink", () => {
      const partialFragment = {
        __typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        tabTitle: {
          translated: "Today",
          translate: null,
        },
        badgeText: null,
        tabViewLink: null,
      };

      const { data } = normalizeNavigationTabPartialFragmentIntoNavigationTabPartial(partialFragment);

      expect(data).toEqual({
        typename: "NavigationTab",
        urn: "ppb:tbd:navigationtab:Today",
        title: {
          translated: "mocked translation",
        },
        badgeText: undefined,
        viewLink: undefined,
      });
    });
  });
});
