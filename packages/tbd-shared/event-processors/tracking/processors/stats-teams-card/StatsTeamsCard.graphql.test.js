import { getApolloClient } from "../../../../apollo-client/client";
import { getStatsTeamsCard } from "./StatsTeamsCard.graphql";
import { fetchApolloQuery } from "../fetch-apollo-query";

const mockReadFragment = jest.fn();
const mockIdentify = jest.fn();
const mockWriteFragment = jest.fn();
const mockApolloClient = {
  cache: {
    identify: mockIdentify,
    readFragment: mockReadFragment,
    writeFragment: mockWriteFragment,
  },
};

jest.mock("../../../../apollo-client/client", () => ({
  getApolloClient: jest.fn(() => mockApolloClient),
}));

jest.mock("../fetch-apollo-query", () => ({
  fetchApolloQuery: jest.fn(),
}));

describe("StatsTeamsCard.graphql", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there is already data in the cache", () => {
    it("should return the data from the cache", async () => {
      const mockCachedData = {
        __typename: "StatsTeamsCard",
        urn: "ppb:tbd:card:stats:teams:1",
        fixture: {
          urn: "ppb:fixture:1",
          sportevent: {
            urn: "ppb:event:1",
            name: "Test Event",
            competition: {
              urn: "ppb:competition:1",
              name: "Test Competition",
            },
          },
        },
      };

      mockIdentify.mockReturnValueOnce("StatsTeamsCard:ppb:tbd:card:stats:teams:1");
      mockReadFragment.mockReturnValueOnce(mockCachedData);

      const result = await getStatsTeamsCard("ppb:tbd:card:stats:teams:1");

      expect(result).toEqual(mockCachedData);
      expect(mockIdentify).toHaveBeenCalledWith({
        __typename: "StatsTeamsCard",
        urn: "ppb:tbd:card:stats:teams:1",
      });
      expect(mockReadFragment).toHaveBeenCalled();
      expect(fetchApolloQuery).not.toHaveBeenCalled();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });
  });

  describe("when there is no data in the cache", () => {
    it("should return undefined if data or Cards are null", async () => {
      mockIdentify.mockReturnValueOnce("StatsTeamsCard:ppb:tbd:card:stats:teams:1");
      mockReadFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({ Cards: null });

      const result = await getStatsTeamsCard("ppb:tbd:card:stats:teams:1");

      expect(result).toBeUndefined();
      expect(fetchApolloQuery).toHaveBeenCalled();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });

    it("should fetch data from the query and write to cache when card is found", async () => {
      const mockCardData = {
        __typename: "StatsTeamsCard",
        urn: "ppb:tbd:card:stats:teams:1",
        fixture: {
          urn: "ppb:fixture:1",
          sportevent: {
            urn: "ppb:event:1",
            name: "Test Event",
            competition: {
              urn: "ppb:competition:1",
              name: "Test Competition",
            },
          },
        },
      };

      mockIdentify.mockReturnValueOnce("StatsTeamsCard:ppb:tbd:card:stats:teams:1");
      mockReadFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({
        Cards: [mockCardData],
      });

      const result = await getStatsTeamsCard("ppb:tbd:card:stats:teams:1");

      expect(result).toEqual(mockCardData);
      expect(fetchApolloQuery).toHaveBeenCalledWith("ppb:tbd:card:stats:teams:1", expect.anything());
      expect(mockWriteFragment).toHaveBeenCalledWith({
        fragment: expect.anything(),
        id: "StatsTeamsCard:ppb:tbd:card:stats:teams:1",
        data: mockCardData,
      });
    });

    it("should return undefined when card is not found in the Cards array", async () => {
      const mockCardData = {
        __typename: "StatsTeamsCard",
        urn: "ppb:tbd:card:stats:teams:2",
        fixture: {
          urn: "ppb:fixture:2",
          sportevent: {
            urn: "ppb:event:2",
            name: "Other Event",
            competition: {
              urn: "ppb:competition:2",
              name: "Other Competition",
            },
          },
        },
      };

      mockIdentify.mockReturnValueOnce("StatsTeamsCard:ppb:tbd:card:stats:teams:1");
      mockReadFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({
        Cards: [mockCardData],
      });

      const result = await getStatsTeamsCard("ppb:tbd:card:stats:teams:1");

      expect(result).toBeUndefined();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });

    it("should return undefined when Cards array is empty", async () => {
      mockIdentify.mockReturnValueOnce("StatsTeamsCard:ppb:tbd:card:stats:teams:1");
      mockReadFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({
        Cards: [],
      });

      const result = await getStatsTeamsCard("ppb:tbd:card:stats:teams:1");

      expect(result).toBeUndefined();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });
  });
});
