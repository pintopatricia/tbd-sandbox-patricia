import { SportsbookMarketStatus } from "../../../../../state/constants";
import normalizeVirtualMarketFragmentIntoVirtualMarket from "./virtual-market-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualMarket",
  urn: "ppb:virtualMarket:112233",
  name: "market name",
  marketType: "market type",
  marketId: "924.1",
  hasEachWay: true,
  eachWayFraction: 4,
  eachWayPlaces: 3,
  event: {
    __typename: "VirtualEvent",
    urn: "ppb:virtualEvent:1",
  },
  sport: {
    __typename: "VirtualSport",
    urn: "ppb:virtualSport:1",
  },
  runners: [
    {
      runnerURN: "ppb:virtualRunner:1",
    },
    {
      runnerURN: "ppb:virtualRunner:2",
    },
  ],
  status: "SUSPENDED",
};

describe("Virtual market normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeVirtualMarketFragmentIntoVirtualMarket", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualMarketFragmentIntoVirtualMarket(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "VirtualMarket",
        urn: "ppb:virtualMarket:112233",
        name: "market name",
        marketType: "market type",
        marketId: "924.1",
        event: "ppb:virtualEvent:1",
        sport: "ppb:virtualSport:1",
        hasEachWay: true,
        eachWayFraction: 4,
        eachWayPlaces: 3,
        runners: ["ppb:virtualRunner:1", "ppb:virtualRunner:2"],
        status: SportsbookMarketStatus.SUSPENDED,
      });
    });

    describe("when market status has an unexpected value", () => {
      it("should default to SportsbookMarketStatus.OPEN", () => {
        const { data } = normalizeVirtualMarketFragmentIntoVirtualMarket({ ...BFF_RESPONSE, status: "WHAAAT" });

        expect(data).toEqual({
          typename: "VirtualMarket",
          urn: "ppb:virtualMarket:112233",
          name: "market name",
          marketType: "market type",
          marketId: "924.1",
          event: "ppb:virtualEvent:1",
          sport: "ppb:virtualSport:1",
          hasEachWay: true,
          eachWayFraction: 4,
          eachWayPlaces: 3,
          runners: ["ppb:virtualRunner:1", "ppb:virtualRunner:2"],
          status: SportsbookMarketStatus.OPEN,
        });
      });
    });
  });
});
