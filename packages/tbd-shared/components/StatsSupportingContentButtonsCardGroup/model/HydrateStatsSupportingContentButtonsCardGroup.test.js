import { getApolloClient } from "../../../apollo-client/client";
import { hydrateItemCards } from "./HydrateStatsSupportingContentButtonsCardGroup";

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

jest.mock("@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/model/StatsMatchStatsCard.graphql", () => ({
  StatsMatchStatsCardQuery: "StatsMatchStatsCardQuery",
}));

jest.mock("@ppb/tbd-components-rich-data/components/IncidentsCard/model/IncidentsCard.graphql", () => ({
  IncidentsCardQuery: "IncidentsCardQuery",
}));

jest.mock("@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/model/StatsBroadcastsCard.graphql", () => ({
  StatsBroadcastsCardQuery: "StatsBroadcastsCardQuery",
}));

jest.mock("../../StatsRaceResultsCard/model/StatsRaceResultsCard.graphql", () => ({
  StatsRaceResultsCardQuery: "StatsRaceResultsCardQuery",
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

  describe("when card is not a StatsSupportingContentButtonsCardGroup", () => {
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

    it("should return false when card is not a StatsSupportingContentButtonsCardGroup", () => {
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

  describe("when card is a StatsSupportingContentButtonsCardGroup", () => {
    const baseData = {
      Cards: [
        {
          __typename: "StatsSupportingContentButtonsCardGroup",
          urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1",
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
                      urn: "ppb:tbd:stats:card:matchStats:1",
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
                urn: "ppb:tbd:stats:card:matchStats:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:matchStats:1",
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

    describe("StatsBroadcastsCard", () => {
      it("should write StatsBroadcastsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsBroadcastsCard",
                      urn: "ppb:tbd:stats:card:broadcasts:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsBroadcastsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsBroadcastsCard",
                urn: "ppb:tbd:stats:card:broadcasts:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:broadcasts:1",
          },
        });
        expect(result).toBe(false);
      });
    });

    describe("StatsRaceResultsCard", () => {
      it("should write StatsRaceResultsCard query to cache", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    node: {
                      __typename: "StatsRaceResultsCard",
                      urn: "ppb:tbd:stats:card:raceResults:1",
                    },
                  },
                ],
              },
            },
          ],
        };

        const result = hydrateItemCards(data);

        expect(mockWriteQuery).toHaveBeenCalledWith({
          query: "StatsRaceResultsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsRaceResultsCard",
                urn: "ppb:tbd:stats:card:raceResults:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:raceResults:1",
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
                      __typename: "StatsMatchStatsCard",
                      urn: "ppb:tbd:stats:card:matchStats:1",
                    },
                  },
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

        expect(mockWriteQuery).toHaveBeenCalledTimes(2);
        expect(mockWriteQuery).toHaveBeenNthCalledWith(1, {
          query: "StatsMatchStatsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsMatchStatsCard",
                urn: "ppb:tbd:stats:card:matchStats:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:matchStats:1",
          },
        });
        expect(mockWriteQuery).toHaveBeenNthCalledWith(2, {
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

      it("should handle mixed valid and invalid nodes", () => {
        const data = {
          ...baseData,
          Cards: [
            {
              ...baseData.Cards[0],
              full: {
                edges: [
                  {
                    // Invalid edge - no node
                    displayName: "Test",
                  },
                  {
                    node: {
                      __typename: "StatsMatchStatsCard",
                      urn: "ppb:tbd:stats:card:matchStats:1",
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

        expect(mockWriteQuery).toHaveBeenCalledTimes(1);
        expect(mockWriteQuery).toHaveBeenNthCalledWith(1, {
          query: "StatsMatchStatsCardQuery",
          data: {
            Cards: [
              {
                __typename: "StatsMatchStatsCard",
                urn: "ppb:tbd:stats:card:matchStats:1",
              },
            ],
          },
          variables: {
            urn: "ppb:tbd:stats:card:matchStats:1",
          },
        });
        expect(result).toBe(false);
      });
    });
  });
});
