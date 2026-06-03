import normalizeGamingViewFragmentIntoGamingView from "./gaming-view-normalizer";

const GAMING_VIEW_URN = "ppb:tbd:view:gaming:1";
const GAMING_VIEW_TYPE = "GamingView";
const URL = "/";

const BFF_RESPONSE = {
  __typename: "GamingView",
  urn: GAMING_VIEW_URN,
  url: URL,
  items: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        },
        theme: "HIGHLIGHTED",
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
        },
      },
      {
        node: {
          __typename: "ViewZone",
          urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
        },
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
      },
      {
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
      },
      {
        typename: "ViewZone",
        urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/2",
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
  seoMetaData: {
    metaTitle: "Sky Bet Games » Play Casino Games on Sky Bet",
    metaDescription:
      "Play Casino Games on Sky Bet Games. Find your favourite Slots, Blackjack, Roulette Games & more on Sky Bet.",
    __typename: "SeoMetaData",
  },
};

const BFF_RESPONSE_WITH_DUPLICATES = {
  __typename: "GamingView",
  urn: GAMING_VIEW_URN,
  url: URL,
  items: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
        },
      },
      {
        node: {
          __typename: "ViewZone",
          urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
        },
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
      },
      {
        typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
      },
      {
        typename: "ViewZone",
        urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:gaming:masterConfigElement:curated/2",
        },
      },
      null,
    ],
  },
};

describe("normalizeGamingViewFragmentIntoGamingView", () => {
  describe("and edges have valid nodes", () => {
    const { data } = normalizeGamingViewFragmentIntoGamingView(BFF_RESPONSE);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
            theme: "HIGHLIGHTED",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
            theme: undefined,
          },
          {
            typename: "ViewZone",
            urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
            theme: undefined,
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/2",
            theme: undefined,
          },
        ],
        typename: GAMING_VIEW_TYPE,
        url: URL,
        urn: GAMING_VIEW_URN,
        seoMetaData: {
          metaTitle: "Sky Bet Games » Play Casino Games on Sky Bet",
          metaDescription:
            "Play Casino Games on Sky Bet Games. Find your favourite Slots, Blackjack, Roulette Games & more on Sky Bet.",
        },
      });
    });
  });

  describe("and edges have valid nodes with no duplicate items", () => {
    const { data } = normalizeGamingViewFragmentIntoGamingView(BFF_RESPONSE_WITH_DUPLICATES);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/1",
          },
          {
            typename: "ViewZone",
            urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/2",
          },
        ],
        typename: GAMING_VIEW_TYPE,
        url: URL,
        urn: GAMING_VIEW_URN,
      });
    });
  });

  describe("and edges has no valid nodes", () => {
    const { data } = normalizeGamingViewFragmentIntoGamingView({
      ...BFF_RESPONSE,
      items: { edges: [null, null] },
      partialItems: { edges: [null] },
      seoMetaData: {
        metaTitle: "Sky Bet Games » Play Casino Games on Sky Bet",
        metaDescription:
          "Play Casino Games on Sky Bet Games. Find your favourite Slots, Blackjack, Roulette Games & more on Sky Bet.",
      },
    });

    it("should correctly transform and return the data object with an empty array of items", () => {
      expect(data).toEqual({
        items: [],
        typename: GAMING_VIEW_TYPE,
        url: URL,
        urn: GAMING_VIEW_URN,
        seoMetaData: {
          metaTitle: "Sky Bet Games » Play Casino Games on Sky Bet",
          metaDescription:
            "Play Casino Games on Sky Bet Games. Find your favourite Slots, Blackjack, Roulette Games & more on Sky Bet.",
        },
      });
    });
  });
});
