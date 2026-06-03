import { getApolloClient } from "../../../../apollo-client/client";
import { getIncidentsCard } from "./IncidentsCard.graphql";
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

describe("IncidentsCard.graphql", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is already data in the cache", () => {
    it("should return the data from the cache", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce("ola");

      expect(await getIncidentsCard("ppb:tbd:card:incidents:1")).toBe("ola");
    });
  });
  describe("when there is not data in the cache", () => {
    it("should return the data from the cache if data or Cards are null", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({ Cards: null });

      expect(await getIncidentsCard("ppb:tbd:card:incidents:1")).toBe(undefined);
    });

    it("should return the data from the query", async () => {
      getApolloClient().cache.readFragment.mockReturnValueOnce(undefined);
      fetchApolloQuery.mockReturnValueOnce({ Cards: [{ urn: "ppb:tbd:card:incidents:1", fixture: "fixture" }] });

      expect(await getIncidentsCard("ppb:tbd:card:incidents:1")).toEqual({
        urn: "ppb:tbd:card:incidents:1",
        fixture: "fixture",
      });
    });
  });
});
