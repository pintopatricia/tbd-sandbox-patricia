import normalizeCardGroupFragmentIntoCardGroup from "./half-time-specials-swimlane-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "HalfTimeSpecialsSwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
  halfTimeSpecialsCardGroupTitle: "Half Time Specials",
  cardGroupSubtitle: "Subtitle",
  displayName: "translation",
  halfTimeSpecialsFull: {
    edges: [
      {
        node: {
          __typename: "MatchStatSelectionCard",
          urn: "ppb:tbd:card:matchStatSelection:924.458273536",
        },
      },
    ],
  },
  halfTimeSpecialsPartials: {
    edges: [
      {
        node: {
          __typename: "MatchStatSelectionCard",
          urn: "ppb:tbd:card:matchStatSelection:924.458273537",
        },
      },
    ],
  },
  isDecorated: true,
  isIconSupportingTitle: true,
};

describe("Card group normalizer", () => {
  beforeEach(() => {
    BFF_RESPONSE.halfTimeSpecialsPartials = {
      edges: [
        {
          node: {
            __typename: "MatchStatSelectionCard",
            urn: "ppb:tbd:card:matchStatSelection:924.458273537",
          },
        },
      ],
    };
  });

  describe("normalizeCardGroupFragmentIntoCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [
          {
            typename: "MatchStatSelectionCard",
            urn: "ppb:tbd:card:matchStatSelection:924.458273537",
          },
        ],
        title: "Half Time Specials",
        subtitle: "Subtitle",
        displayName: "translation",
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      BFF_RESPONSE.halfTimeSpecialsPartials.edges[0] = null;

      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [],
        title: "Half Time Specials",
        subtitle: "Subtitle",
        displayName: "translation",
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });

    it("should correctly transform and return the data object when no edges are defined", () => {
      const BFF_RESPONSE_NO_EDGES = {
        ...BFF_RESPONSE,
        halfTimeSpecialsPartials: { edges: [] },
      };
      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_EDGES);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [],
        title: "Half Time Specials",
        subtitle: "Subtitle",
        displayName: "translation",
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });

    it("should correctly transform and return the data object when the title is null", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        halfTimeSpecialsCardGroupTitle: null,
      };

      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [
          {
            typename: "MatchStatSelectionCard",
            urn: "ppb:tbd:card:matchStatSelection:924.458273537",
          },
        ],
        title: undefined,
        subtitle: "Subtitle",
        displayName: "translation",
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });

    it("should correctly transform and return the data object when the subtitle is null", () => {
      const BFF_RESPONSE_NO_SUBTITLE = {
        ...BFF_RESPONSE,
        cardGroupSubtitle: null,
      };

      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_SUBTITLE);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [
          {
            typename: "MatchStatSelectionCard",
            urn: "ppb:tbd:card:matchStatSelection:924.458273537",
          },
        ],
        title: "Half Time Specials",
        subtitle: undefined,
        displayName: "translation",
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });

    it("should correctly transform and return the data object when the displayName is null", () => {
      const BFF_RESPONSE_NO_DISPLAY_NAME = {
        ...BFF_RESPONSE,
        displayName: null,
      };

      const { data } = normalizeCardGroupFragmentIntoCardGroup(BFF_RESPONSE_NO_DISPLAY_NAME);

      expect(data).toEqual({
        displayMode: "SCROLLABLE",
        items: [
          {
            typename: "MatchStatSelectionCard",
            urn: "ppb:tbd:card:matchStatSelection:924.458273537",
          },
        ],
        title: "Half Time Specials",
        subtitle: "Subtitle",
        displayName: undefined,
        typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCSxBBEAACMA_YG4/e/34304462",
        isDecorated: true,
        isIconSupportingTitle: true,
      });
    });
  });
});
