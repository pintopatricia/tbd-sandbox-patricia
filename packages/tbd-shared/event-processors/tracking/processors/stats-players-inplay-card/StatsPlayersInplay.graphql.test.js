import { getApolloClient } from "../../../../apollo-client/client";
import { getStatsPlayersInPlay } from "./StatsPlayersInplay.graphql";
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

describe("StatsPlayersInplay.graphql", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is already data in the cache", () => {
    it("should return the data from the cache", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce("fragmentValue");

      expect(await getStatsPlayersInPlay("ppb:tbd:card:stats:playersInPlay:1")).toBe("fragmentValue");
    });
  });
  describe("when there is not data in the cache", () => {
    it("should return the data from the cache if data or Cards are null", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({ Cards: null });

      expect(await getStatsPlayersInPlay("ppb:tbd:card:stats:playersInPlay:1")).toBe(undefined);
    });

    it("should return the data from the query", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({
        Cards: [{ urn: "ppb:tbd:card:stats:playersInPlay:1", fixture: "fixture" }],
      });

      expect(await getStatsPlayersInPlay("ppb:tbd:card:stats:playersInPlay:1")).toEqual({
        urn: "ppb:tbd:card:stats:playersInPlay:1",
        fixture: "fixture",
      });
    });
  });
});
