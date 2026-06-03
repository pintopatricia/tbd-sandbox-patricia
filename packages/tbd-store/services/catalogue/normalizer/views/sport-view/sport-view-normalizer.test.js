import normalizeSportViewFragmentIntoSportView from "./sport-view-normalizer";

const BFF_RESPONSE = {
  __typename: "SportView",
  urn: "ppb:tbd:view:sport:1",
  url: "soccer/sport:1",
  title: "Soccer",
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Soccer",
    sportId: 1,
  },
  items: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventMarketCard:2888729",
        },
        theme: "THEME",
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventMarketCard:2888729",
        },
        theme: "THEME",
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("Sport view normalizer", () => {
  describe("normalizeSportViewFragmentIntoSportView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSportViewFragmentIntoSportView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "EventMarketCard",
            urn: "ppb:tbd:card:eventMarketCard:2888729",
            theme: "THEME",
          },
        ],
        typename: "SportView",
        url: "soccer/sport:1",
        urn: "ppb:tbd:view:sport:1",
        title: "Soccer",
        sport: "ppb:eventType:1",
      });
    });
  });
});
