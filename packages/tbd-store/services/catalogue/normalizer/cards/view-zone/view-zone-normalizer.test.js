import normalizeViewZoneFragmentIntoViewZone from "./view-zone-normalizer";

const BFF_RESPONSE = {
  __typename: "ViewZone",
  urn: "ppb:tbd:view:zone:multifunctional:module:test-zone",
  title: "Casino",
  viewZoneItems: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:recentlyPlayedGames:gaming-recently-played-zone",
          items: {
            edges: [
              {
                node: {
                  __typename: "GameCard",
                  urn: "ppb:tbd:card:game:betfair-live-roulette-cptl",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SegmentedCardGroup",
          urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
          items: {
            edges: [
              {
                node: {
                  __typename: "SwimlaneCardGroup",
                  urn: "ppb:tbd:card:group:curatedGames:gaming-arcade-zone",
                  items: {
                    edges: [
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:windfall-abp",
                        },
                      },
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:fruit-stack-deluxe-art",
                        },
                      },
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:shaman-spins-art",
                        },
                      },
                    ],
                  },
                  viewAll: {
                    label: "View All Test",
                    viewLink: {
                      viewUrl: "casino/c/gaming-all-games/gamingCategory:gaming-all-games",
                      viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
                    },
                  },
                },
              },
              {
                node: {
                  __typename: "SwimlaneCardGroup",
                  urn: "ppb:tbd:card:group:curatedGames:bfrb-mega-ways-grid",
                  items: {
                    edges: [
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:irish-riches-abp",
                        },
                      },
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:raging-rhino-megaways-asg",
                        },
                      },
                      {
                        node: {
                          __typename: "GameCard",
                          urn: "ppb:tbd:card:game:fishing-frenzy-mw-abp",
                        },
                      },
                    ],
                  },
                  viewAll: {
                    label: "View more",
                    viewLink: {
                      viewUrl: "casino/c/arcade-all-games/gamingCategory:arcade-all-games",
                      viewUrn: "ppb:tbd:view:gamingCategory:arcade-all-games",
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
};

const BFF_RESPONSE2 = {
  __typename: "ViewZone",
  urn: "ppb:tbd:view:zone:multifunctional:module:test-zone",
  title: "Casino",
  viewZoneItems: {
    edges: [undefined, undefined],
  },
};

describe("View zone normalizer", () => {
  describe("normalizeViewZoneFragmentIntoViewZone", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeViewZoneFragmentIntoViewZone(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:recentlyPlayedGames:gaming-recently-played-zone",
          },
          {
            typename: "SegmentedCardGroup",
            urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|gaming-arcade-zone;ppb|tbd|card|group|curatedGames|bfrb-mega-ways-grid",
          },
        ],
        urn: "ppb:tbd:view:zone:multifunctional:module:test-zone",
        title: "Casino",
        typename: "ViewZone",
      });
    });

    // eslint-disable-next-line jest/no-identical-title
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeViewZoneFragmentIntoViewZone(BFF_RESPONSE2);

      expect(data).toEqual({
        items: [],
        urn: "ppb:tbd:view:zone:multifunctional:module:test-zone",
        title: "Casino",
        typename: "ViewZone",
      });
    });
  });
});
