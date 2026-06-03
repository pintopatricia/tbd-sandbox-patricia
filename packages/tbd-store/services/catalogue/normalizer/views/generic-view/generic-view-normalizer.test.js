import normalizeGenericViewFragmentIntoGenericView from "./generic-view-normalizer";

const GENERIC_VIEW_URN = "ppb:tbd:view:generic:home";
const GENERIC_VIEW_TYPE = "GenericView";
const URL = "/";
const VIEW_HEADER = { title: "View Title", subTitle: "View Subtitle", badge: "ODDSONTHAT" };
const CANONICAL_URL = "https://www.betfair.com/exchange/plus/en/football/english-premier-league-betting-10932509";

const BFF_RESPONSE = {
  __typename: "GenericView",
  urn: GENERIC_VIEW_URN,
  canonicalUrl: CANONICAL_URL,
  url: URL,
  viewHeader: VIEW_HEADER,
  items: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:1",
        },
        theme: "THEME",
      },
      {
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175350760|15",
        },
        theme: "THEME",
      },
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
        },
        theme: null,
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:market:1",
        theme: "THEME",
      },
      {
        typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.175350760|15",
        theme: "THEME",
      },
      {
        typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
        theme: null,
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:77",
        },
      },
      null,
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("normalizeGenericViewFragmentIntoGenericView", () => {
  describe("and edges have valid nodes", () => {
    const { data } = normalizeGenericViewFragmentIntoGenericView(BFF_RESPONSE);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:market:1",
            theme: "THEME",
          },
          {
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175350760|15",
            theme: "THEME",
          },
          {
            typename: "PebbleCardGroup",
            urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
            theme: null,
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:market:77",
            theme: undefined,
          },
        ],
        typename: GENERIC_VIEW_TYPE,
        url: URL,
        urn: GENERIC_VIEW_URN,
        canonicalUrl: CANONICAL_URL,
        viewHeader: VIEW_HEADER,
      });
    });
  });

  describe("and edges has no valid nodes", () => {
    const { data } = normalizeGenericViewFragmentIntoGenericView({
      ...BFF_RESPONSE,
      items: { edges: [null, null] },
      partialItems: { edges: [null] },
    });

    it("should correctly transform and return the data object with an empty array of items", () => {
      expect(data).toEqual({
        items: [],
        typename: GENERIC_VIEW_TYPE,
        url: URL,
        urn: GENERIC_VIEW_URN,
        canonicalUrl: CANONICAL_URL,
        viewHeader: VIEW_HEADER,
      });
    });
  });

  describe("and ViewHeader is undefined", () => {
    const { data } = normalizeGenericViewFragmentIntoGenericView({ ...BFF_RESPONSE, viewHeader: undefined });

    it("should return undefined viewHeader", () => {
      expect(data.viewHeader).toEqual(undefined);
    });
  });
});
