import { getApolloClient } from "../../../apollo-client/client";
import { hydrateItemCards } from "./HydratePebbleItemCards";

jest.mock("../../../apollo-client/client", () => {
  const mockCache = {
    writeQuery: jest.fn(),
  };

  return {
    getApolloClient: jest.fn(() => ({
      cache: mockCache,
    })),
  };
});

// Mock all the GraphQL queries
jest.mock("@ppb/tbd-components-rich-data/components/StatsFormCard/model/StatsFormCard.graphql", () => ({
  StatsFormCardQuery: "StatsFormCardQuery",
}));

jest.mock("@ppb/tbd-components-rich-data/components/IncidentsCard/model/IncidentsCard.graphql", () => ({
  IncidentsCardQuery: "IncidentsCardQuery",
}));

jest.mock(
  "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/model/StatsGoalsAndShotsCard.graphql",
  () => ({
    StatsGoalsAndShotsCardQuery: "StatsGoalsAndShotsCardQuery",
  }),
);

jest.mock("@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/model/StatsMatchStatsCard.graphql", () => ({
  StatsMatchStatsCardQuery: "StatsMatchStatsCardQuery",
}));

jest.mock(
  "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/model/StatsPlayersSeasonStatsCard.graphql",
  () => ({
    StatsPlayersSeasonStatsQuery: "StatsPlayersSeasonStatsQuery",
  }),
);

jest.mock("@ppb/tbd-components-rich-data/components/StatsTeamsCard/model/StatsTeamsCard.graphql", () => ({
  StatsTeamsQuery: "StatsTeamsQuery",
}));

jest.mock("@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/model/StatsHeadToHeadCard.graphql", () => ({
  StatsHeadToHeadQuery: "StatsHeadToHeadQuery",
}));

const mockWriteQuery = getApolloClient().cache.writeQuery;

describe("hydrateItemCards", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when data is undefined or null", () => {
    it("should return false when Cards array is empty", () => {
      const data = { Cards: [] };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });

    it("should return false when Cards array is undefined", () => {
      const data = { Cards: undefined };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });
  });

  describe("when card is not a StatsPebbleCardGroup", () => {
    it("should return false when card has no __typename", () => {
      const data = {
        Cards: [
          {
            urn: "test:urn",
            // no __typename
          },
        ],
      };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });

    it("should return false when card is not a StatsPebbleCardGroup", () => {
      const data = {
        Cards: [
          {
            __typename: "OtherCardType",
            urn: "test:urn",
          },
        ],
      };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });
  });

  describe("when card is a StatsPebbleCardGroup", () => {
    const baseData = {
      Cards: [
        {
          __typename: "StatsPebbleCardGroup",
          urn: "ppb:tbd:stats:cardgroup:pebble:1",
          full: {
            edges: [],
          },
        },
      ],
    };

    it("should return false when full.edges is empty", () => {
      const result = hydrateItemCards(baseData);
      expect(result).toBe(false);
    });

    it("should return false when edge has no node", () => {
      const data = {
        ...baseData,
        Cards: [
          {
            ...baseData.Cards[0],
            full: {
              edges: [{ displayName: "Test" }], // no node
            },
          },
        ],
      };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });

    it("should return false when node has no __typename", () => {
      const data = {
        ...baseData,
        Cards: [
          {
            ...baseData.Cards[0],
            full: {
              edges: [
                {
                  node: {
                    urn: "test:urn",
                    // no __typename
                  },
                },
              ],
            },
          },
        ],
      };
      const result = hydrateItemCards(data);
      expect(result).toBe(false);
    });

    describe("StatsFormCard", () => {
      it("should write StatsFormCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsFormCard",
                      urn: "ppb:tbd:stats:card:form:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsFormCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsFormCard",
                urn: "ppb:tbd:stats:card:form:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:form:1",
            isRecent: true,
            isCompetition: true,
          },
        });
        expect(result).toBe(false); // forEach returns undefined, so function returns false
      });
    });

    describe("StatsHeadToHeadCard", () => {
      it("should write StatsHeadToHeadCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsHeadToHeadCard",
                      urn: "ppb:tbd:stats:card:h2h:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsHeadToHeadQuery",
          data: {
            Cards: [
              {
                __typename: "StatsHeadToHeadCard",
                urn: "ppb:tbd:stats:card:h2h:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:h2h:1",
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("StatsTeamsCard", () => {
      it("should write StatsTeamsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsTeamsCard",
                      urn: "ppb:tbd:stats:card:teams:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsTeamsQuery",
          data: {
            Cards: [
              {
                __typename: "StatsTeamsCard",
                urn: "ppb:tbd:stats:card:teams:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:teams:1",
            isPreviousFive: true,
            isAllSeason: true,
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("StatsPlayersSeasonStatsCard", () => {
      it("should write StatsPlayersSeasonStatsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsPlayersSeasonStatsCard",
                      urn: "ppb:tbd:stats:card:players:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsPlayersSeasonStatsQuery",
          data: {
            Cards: [
              {
                __typename: "StatsPlayersSeasonStatsCard",
                urn: "ppb:tbd:stats:card:players:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:players:1",
            isAttacking: true,
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("StatsMatchStatsCard", () => {
      it("should write StatsMatchStatsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsMatchStatsCard",
                      urn: "ppb:tbd:stats:card:match:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsMatchStatsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsMatchStatsCard",
                urn: "ppb:tbd:stats:card:match:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:match:1",
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("StatsGoalsAndShotsCard", () => {
      it("should write StatsGoalsAndShotsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsGoalsAndShotsCard",
                      urn: "ppb:tbd:stats:card:goals:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsGoalsAndShotsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsGoalsAndShotsCard",
                urn: "ppb:tbd:stats:card:goals:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:goals:1",
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("IncidentsCard", () => {
      it("should write IncidentsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "IncidentsCard",
                      urn: "ppb:tbd:stats:card:incidents:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "IncidentsCardQuery",
          data: {
            Cards: [
              {
                __typename: "IncidentsCard",
                urn: "ppb:tbd:stats:card:incidents:1",
              },
            ],
          },
          variables: {
            urn: ["ppb:tbd:stats:card:incidents:1"],
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("unknown card type", () => {
      it("should not write any query to cache for unknown card type", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "UnknownCardType",
                      urn: "ppb:tbd:stats:card:unknown:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).not.toHaveBeenCalled();
        expect(result).toBe(false);
      });
    });

    describe("multiple cards", () => {
      it("should write multiple queries to cache for different card types", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsFormCard",
                      urn: "ppb:tbd:stats:card:form:1",
                    },
                  },
                  {
                    node: {
                      __typename: "StatsHeadToHeadCard",
                      urn: "ppb:tbd:stats:card:h2h:1",
                    },
                  },
                  {
                    node: {
                      __typename: "StatsTeamsCard",
                      urn: "ppb:tbd:stats:card:teams:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledTimes(3);
        expect(mockWriteQuery).toHaveBeenNthCalledWith(1, {
          query: "StatsFormCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsFormCard",
                urn: "ppb:tbd:stats:card:form:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:form:1",
            isRecent: true,
            isCompetition: true,
          },
        });
        expect(mockWriteQuery).toHaveBeenNthCalledWith(2, {
          query: "StatsHeadToHeadQuery",
          data: {
            Cards: [
              {
                __typename: "StatsHeadToHeadCard",
                urn: "ppb:tbd:stats:card:h2h:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:h2h:1",
          },
        });
        expect(mockWriteQuery).toHaveBeenNthCalledWith(3, {
          query: "StatsTeamsQuery",
          data: {
            Cards: [
              {
                __typename: "StatsTeamsCard",
                urn: "ppb:tbd:stats:card:teams:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:teams:1",
            isPreviousFive: true,
            isAllSeason: true,
          },
        });
        expect(result).toBe(false);
      });

      it("should handle mixed valid and invalid nodes", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsFormCard",
                      urn: "ppb:tbd:stats:card:form:1",
                    },
                  },
                  {
                    // Invalid edge - no node
                    displayName: "Test",
                  },
                  {
                    node: {
                      __typename: "StatsHeadToHeadCard",
                      urn: "ppb:tbd:stats:card:h2h:1",
                    },
                  },
                  {
                    node: {
                      // Invalid node - no __typename
                      urn: "ppb:tbd:stats:card:invalid:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledTimes(2);
        expect(mockWriteQuery).toHaveBeenNthCalledWith(1, {
          query: "StatsFormCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsFormCard",
                urn: "ppb:tbd:stats:card:form:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:form:1",
            isRecent: true,
            isCompetition: true,
          },
        });
        expect(mockWriteQuery).toHaveBeenNthCalledWith(2, {
          query: "StatsHeadToHeadQuery",
          data: {
            Cards: [
              {
                __typename: "StatsHeadToHeadCard",
                urn: "ppb:tbd:stats:card:h2h:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:h2h:1",
          },
        });
        expect(result).toBe(false);
      });
    });
  });
});
