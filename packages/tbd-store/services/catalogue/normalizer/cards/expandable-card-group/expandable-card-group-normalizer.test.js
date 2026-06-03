import normalizeExpandableCardGroupFragmentIntoCardGroup from "./expandable-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "ExpandableCardGroup",
  urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
  expandableCardGroupTitle: "Racing Jockey OddsBoost",
  isExpandable: true,
  isExpanded: true,
  full: {
    edges: [
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.1/1",
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.1/1",
        },
      },
      {
        node: {
          __typename: "HighlightedSelectionCard",
          urn: "ppb:tbd:card:highlightedSelection:924.1/2",
        },
      },
    ],
  },
};

describe("Expandable Card group normalizer", () => {
  describe("normalizeExpandableCardGroupFragmentIntoCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeExpandableCardGroupFragmentIntoCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        title: "Racing Jockey OddsBoost",
        isExpandable: true,
        isExpanded: true,
        items: [
          {
            typename: "HighlightedSelectionCard",
            urn: "ppb:tbd:card:highlightedSelection:924.1/1",
          },
          {
            typename: "HighlightedSelectionCard",
            urn: "ppb:tbd:card:highlightedSelection:924.1/2",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when one of the items is null", () => {
      const BFF_RESPONSE_FIRTS_ITEM_NULL = JSON.parse(JSON.stringify(BFF_RESPONSE));
      BFF_RESPONSE_FIRTS_ITEM_NULL.partials.edges[0] = null;

      const { data } = normalizeExpandableCardGroupFragmentIntoCardGroup(BFF_RESPONSE_FIRTS_ITEM_NULL);

      expect(data).toEqual({
        typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        title: "Racing Jockey OddsBoost",
        isExpandable: true,
        isExpanded: true,
        items: [
          {
            typename: "HighlightedSelectionCard",
            urn: "ppb:tbd:card:highlightedSelection:924.1/2",
          },
        ],
      });
    });

    it("should correctly transform and return the data object when only with mandatory props", () => {
      const BFF_RESPONSE_ONLY_MANDATORY = {
        ...BFF_RESPONSE,
        expandableCardGroupTitle: null,
        isExpandable: null,
        isExpanded: null,
      };

      const { data } = normalizeExpandableCardGroupFragmentIntoCardGroup(BFF_RESPONSE_ONLY_MANDATORY);

      expect(data).toEqual({
        typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:4abeeba8/s/1",
        items: [
          {
            typename: "HighlightedSelectionCard",
            urn: "ppb:tbd:card:highlightedSelection:924.1/1",
          },
          {
            typename: "HighlightedSelectionCard",
            urn: "ppb:tbd:card:highlightedSelection:924.1/2",
          },
        ],
      });
    });
  });
});
