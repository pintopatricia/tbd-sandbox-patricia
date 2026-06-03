import normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup from "./popular-swimlane-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "PopularSwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
  popularSwimlaneCardGroupTitle: "Trending in BuildABet",
  displayName: "translation",
  fullItems: {
    edges: [
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:111",
        },
      },
      {
        node: {
          __typename: "PopularMultiplesBetBuilderCard",
          urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
        },
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:111",
        },
      },
      {
        node: {
          __typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:222",
        },
      },
      {
        node: {
          __typename: "PopularMultiplesBetBuilderCard",
          urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
        },
      },
    ],
  },
};

describe("Popular Swimlane Card group normalizer", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup(BFF_RESPONSE);

    expect(data).toEqual({
      items: [
        {
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:111",
        },
        {
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:222",
        },
        {
          typename: "PopularMultiplesBetBuilderCard",
          urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
        },
      ],
      title: "Trending in BuildABet",
      displayName: "translation",
      typename: "PopularSwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
    });
  });

  describe("when a partial item is null", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NULL_ITEM = {
        ...BFF_RESPONSE,
        partialItems: {
          edges: [
            null,
            {
              node: {
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:222",
              },
            },
            null,
          ],
        },
      };

      const { data } = normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup(BFF_RESPONSE_NULL_ITEM);

      expect(data).toEqual({
        items: [{ urn: "ppb:tbd:card:popularbetbuilder:222", typename: "PopularBetBuilderCard" }],
        title: "Trending in BuildABet",
        displayName: "translation",
        typename: "PopularSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
      });
    });
  });

  describe("when no partial items are defined", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NO_EDGES = {
        ...BFF_RESPONSE,
        partialItems: { edges: [] },
      };
      const { data } = normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup(BFF_RESPONSE_NO_EDGES);

      expect(data).toEqual({
        items: [],
        title: "Trending in BuildABet",
        displayName: "translation",
        typename: "PopularSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
      });
    });
  });

  describe("when the title is null", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        popularSwimlaneCardGroupTitle: null,
      };

      const { data } = normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        items: [
          {
            typename: "PopularBetBuilderCard",
            urn: "ppb:tbd:card:popularbetbuilder:111",
          },
          {
            typename: "PopularBetBuilderCard",
            urn: "ppb:tbd:card:popularbetbuilder:222",
          },
          {
            typename: "PopularMultiplesBetBuilderCard",
            urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
          },
        ],
        title: undefined,
        displayName: "translation",
        typename: "PopularSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
      });
    });
  });

  it("should correctly transform and return the data object when the displayName is null", () => {
    const BFF_RESPONSE_NO_DISPLAY_NAME = {
      ...BFF_RESPONSE,
      displayName: null,
    };

    const { data } =
      normalizePopularSwimlaneCardGroupFragmentIntoPopularSwimlaneCardGroup(BFF_RESPONSE_NO_DISPLAY_NAME);

    expect(data).toEqual({
      items: [
        {
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:111",
        },
        {
          typename: "PopularBetBuilderCard",
          urn: "ppb:tbd:card:popularbetbuilder:222",
        },
        {
          typename: "PopularMultiplesBetBuilderCard",
          urn: "ppb:tbd:card:multiplesBetBuilder:popular:333",
        },
      ],
      title: "Trending in BuildABet",
      displayName: undefined,
      typename: "PopularSwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:popularSwimlane:Zs358RAAACIArpbx/s/1",
    });
  });
});
