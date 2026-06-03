import normalizeVirtualMarketCardFragmentIntoVirtualMarketCard from "./virtual-market-card-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualMarketCard",
  urn: "ppb:tbd:card:virtualMarket:112233",
  title: "card title",
  marketHierarchy: {
    virtualEvent: {
      __typename: "VirtualEvent",
      urn: "ppb:virtualEvent:1",
    },
  },
  displayRunners: {
    market: {
      __typename: "VirtualMarket",
      urn: "ppb:virtualMarket:1",
    },
  },
  gameRulesViewLink: {
    viewUrn: "ppb:tbd:link:0",
    viewUrl: "https://google.com",
    viewDisplayMode: "",
  },
};

describe("Virtual market card normalizer", () => {
  beforeEach(jest.clearAllMocks);

  describe("normalizeVirtualMarketCardFragmentIntoVirtualMarketCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualMarketCardFragmentIntoVirtualMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "VirtualMarketCard",
        urn: "ppb:tbd:card:virtualMarket:112233",
        title: "card title",
        event: "ppb:virtualEvent:1",
        market: "ppb:virtualMarket:1",
        gameRulesViewLink: {
          viewUrn: "ppb:tbd:link:0",
          viewUrl: "https://google.com",
          viewDisplayMode: "",
        },
      });
    });
  });
});
