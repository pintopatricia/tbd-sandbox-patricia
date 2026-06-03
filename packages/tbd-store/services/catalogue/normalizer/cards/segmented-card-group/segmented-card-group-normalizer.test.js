import normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup from "./segmented-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "SegmentedCardGroup",
  urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
  full: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:curatedGames:gaming-arcade-zone",
          title: "Arcade Games",
          viewAll: null,
          full: {
            edges: [
              {
                node: {
                  __typename: "GameCard",
                  urn: "ppb:tbd:card:game:windfall-abp",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "GameCard",
                  urn: "ppb:tbd:card:game:windfall-abp",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid",
          title: "Megaways",
          viewAll: {
            label: "View more",
            viewLink: {
              viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
              viewUrl: "casino/c/gaming-all-games/gamingCategory:gaming-all-games",
            },
          },
          full: {
            edges: [
              {
                node: {
                  __typename: "GameCard",
                  urn: "ppb:tbd:card:game:raging-rhino-megaways-asg",
                },
              },
            ],
          },
          partials: {
            edges: [
              {
                node: {
                  __typename: "GameCard",
                  urn: "ppb:tbd:card:game:raging-rhino-megaways-asg",
                },
              },
            ],
          },
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:curatedGames:gaming-arcade-zone",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid-test",
        },
      },
    ],
  },
};

const BFF_RESPONSE2 = {
  __typename: "SegmentedCardGroup",
  urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone",
  full: {
    edges: [undefined, undefined],
  },
  partials: {
    edges: [undefined, undefined],
  },
};

describe("Segmented card group normalizer", () => {
  describe("normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:curatedGames:gaming-arcade-zone" },
          { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid" },
          { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid-test" },
        ],
        typename: "SegmentedCardGroup",
        urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
      });
    });

    // eslint-disable-next-line jest/no-identical-title
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeSegmentedCardGroupFragmentIntoSegmentedCardGroup(BFF_RESPONSE2);

      expect(data).toEqual({
        items: [],
        typename: "SegmentedCardGroup",
        urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone",
      });
    });
  });
});
