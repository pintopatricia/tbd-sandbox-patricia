import normalizeEventViewFragmentIntoEventView from "./event-view-normalizer";

const BFF_RESPONSE = {
  __typename: "EventView",
  urn: "ppb:tbd:view:event:30136458",
  url: "soccer/venezuelan-segunda-division/yaracuy-fc-v-ucv-fc/e-30136458",
  canonicalUrl: "canonical",
  items: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:30136458",
        },
        theme: "THEME",
      },
    ],
    pageInfo: null,
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:30136458",
        },
        theme: "THEME",
      },
    ],
  },
  sportevent: {
    __typename: "SportEvent",
    urn: "ppb:event:30136458",
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

const WITH_RED7_SCOREBOARD = {
  ...BFF_RESPONSE,
  partialItems: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:30136458",
          red7Scoreboard: {
            fullURL: "https://example.com/scoreboard",
            referrer: "https://example.com/referrer",
          },
        },
        theme: "THEME",
      },
    ],
  },
};

const WITH_NULL_RED7_SCOREBOARD = {
  ...BFF_RESPONSE,
  partialItems: {
    edges: [
      {
        node: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:30136458",
          red7Scoreboard: null,
        },
        theme: "THEME",
      },
    ],
  },
};

describe("Event view normalizer", () => {
  describe("normalizeEventViewFragmentIntoEventView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventViewFragmentIntoEventView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30136458",
            theme: "THEME",
          },
        ],
        sportevent: "ppb:event:30136458",
        typename: "EventView",
        url: "soccer/venezuelan-segunda-division/yaracuy-fc-v-ucv-fc/e-30136458",
        urn: "ppb:tbd:view:event:30136458",
        canonicalUrl: "canonical",
      });
    });

    it("should return an item with red7Scoreboard if it exists on a FixtureCard", () => {
      const { data } = normalizeEventViewFragmentIntoEventView(WITH_RED7_SCOREBOARD);

      expect(data.items[0]).toEqual({
        typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:30136458",
        theme: "THEME",
        red7Scoreboard: {
          fullURL: "https://example.com/scoreboard",
          referrer: "https://example.com/referrer",
        },
      });
    });

    it("should return an item without a red7Scoreboard if it exists on a FixtureCard but is null", () => {
      const { data } = normalizeEventViewFragmentIntoEventView(WITH_NULL_RED7_SCOREBOARD);

      expect(data.items[0]).toEqual({
        typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:30136458",
        theme: "THEME",
      });
    });
  });
});
