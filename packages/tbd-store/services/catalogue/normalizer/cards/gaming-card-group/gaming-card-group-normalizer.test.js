import normalizer from "./gaming-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "GamingCardGroup",
  urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
  cardGroupTitle: "Play it Again",
  displayName: "translation",
  defaultLayout: "CARD_LIST",
  layouts: ["CARD_LIST"],
  viewAll: {
    label: "View more",
    icon: "Slots",
    viewLink: {
      viewUrl: "url",
      viewUrn: "urn",
    },
  },
  type: "RECENTLY_PLAYED",
  full: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:game:card:1",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:game:card:1",
        },
      },
      {
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:game:card:2",
        },
      },
    ],
  },
  decoration: "Black Decoration",
  gameTileSize: "MEDIUM",
};

describe("Gaming card group normalizer", () => {
  describe("normalizeGamingCardGroupFragmentIntoGamingCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [
          {
            typename: "GameCard",
            urn: "ppb:tbd:game:card:1",
          },
          {
            typename: "GameCard",
            urn: "ppb:tbd:game:card:2",
          },
        ],
        layouts: ["CARD_LIST"],
        title: "Play it Again",
        displayName: "translation",
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        decoration: "Black Decoration",
        gameTileSize: "MEDIUM",
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      const response = {
        ...BFF_RESPONSE,
        partials: {
          edges: [null, BFF_RESPONSE.partials.edges[1]],
        },
      };

      const { data } = normalizer(response);

      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [{ urn: "ppb:tbd:game:card:2", typename: "GameCard" }],
        layouts: ["CARD_LIST"],
        title: "Play it Again",
        displayName: "translation",
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        decoration: "Black Decoration",
        gameTileSize: "MEDIUM",
      });
    });

    it("should correctly transform and return the data object when the title is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        cardGroupTitle: null,
      };

      const { data } = normalizer(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [
          { urn: "ppb:tbd:game:card:1", typename: "GameCard" },
          { urn: "ppb:tbd:game:card:2", typename: "GameCard" },
        ],
        layouts: ["CARD_LIST"],
        title: undefined,
        displayName: "translation",
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        decoration: "Black Decoration",
        gameTileSize: "MEDIUM",
      });
    });

    it("should correctly transform and return the data object when the displayName is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        displayName: null,
      };

      const { data } = normalizer(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [
          { urn: "ppb:tbd:game:card:1", typename: "GameCard" },
          { urn: "ppb:tbd:game:card:2", typename: "GameCard" },
        ],
        layouts: ["CARD_LIST"],
        title: "Play it Again",
        displayName: undefined,
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        decoration: "Black Decoration",
        gameTileSize: "MEDIUM",
      });
    });

    it("should correctly transform and return the data object when the decoration is null", () => {
      const BFF_RESPONSE_NO_DECORATION = {
        ...BFF_RESPONSE,
        decoration: null,
      };

      const { data } = normalizer(BFF_RESPONSE_NO_DECORATION);
      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [
          { urn: "ppb:tbd:game:card:1", typename: "GameCard" },
          { urn: "ppb:tbd:game:card:2", typename: "GameCard" },
        ],
        layouts: ["CARD_LIST"],
        title: "Play it Again",
        displayName: "translation",
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        gameTileSize: "MEDIUM",
        decoration: undefined,
      });
    });

    it("should correctly transform and return the data object when the gameTileSize is null", () => {
      const BFF_RESPONSE_NO_DECORATION = {
        ...BFF_RESPONSE,
        gameTileSize: null,
      };

      const { data } = normalizer(BFF_RESPONSE_NO_DECORATION);
      expect(data).toEqual({
        cardGroupType: "RECENTLY_PLAYED",
        defaultLayout: "CARD_LIST",
        displayMode: "SCROLLABLE",
        items: [
          { urn: "ppb:tbd:game:card:1", typename: "GameCard" },
          { urn: "ppb:tbd:game:card:2", typename: "GameCard" },
        ],
        layouts: ["CARD_LIST"],
        title: "Play it Again",
        displayName: "translation",
        typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
        decoration: "Black Decoration",
        gameTileSize: undefined,
      });
    });
  });
});
