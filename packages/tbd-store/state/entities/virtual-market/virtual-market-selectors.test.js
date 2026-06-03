import {
  getVirtualMarketByURN,
  createVirtualMarketByURNSelector,
  getVirtualMarketById,
  createVirtualMarketByIdSelector,
} from "./virtual-market-selectors";

const stateMock = {
  "ppb:virtualMarket:22334455": {
    urn: "ppb:virtualMarket:22334455",
    marketId: "22334455",
  },
};

describe("virtual market selectors", () => {
  describe("getVirtualMarketByURN selector", () => {
    it("should return undefined when no virtual market exists", () => {
      const result = getVirtualMarketByURN(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualMarketByURN(stateMock, "ppb:virtualMarket:22334455");
      expect(result).toEqual({
        marketId: "22334455",
        urn: "ppb:virtualMarket:22334455",
      });
    });
  });

  describe("createVirtualMarketByURNSelector selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual market", () => {
      const getVirtualMarketByURNSelector = createVirtualMarketByURNSelector();
      const result = getVirtualMarketByURNSelector(stateMock, "RANDOM_URN");

      expect(result).toBe(undefined);
    });

    it("must return a virtual market when receiving an URN for an existing virtual market", () => {
      const getVirtualMarketByURNSelector = createVirtualMarketByURNSelector();
      const result = getVirtualMarketByURNSelector(stateMock, "ppb:virtualMarket:22334455");

      expect(result).toEqual(stateMock["ppb:virtualMarket:22334455"]);
    });
  });

  describe("getVirtualMarketById selector", () => {
    it("should return undefined when no virtual market exists", () => {
      const result = getVirtualMarketById(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualMarketById(stateMock, "22334455");

      expect(result).toEqual({
        urn: "ppb:virtualMarket:22334455",
        marketId: "22334455",
      });
    });
  });

  describe("createVirtualMarketByIdSelector selector", () => {
    it("must return undefined when receiving an ID for a non-existing virtual market", () => {
      const getVirtualMarketByIdSelector = createVirtualMarketByIdSelector();
      const result = getVirtualMarketByIdSelector(stateMock, "RANDOM_ID");

      expect(result).toBe(undefined);
    });

    it("must return a virtual market when receiving an ID for an existing virtual market", () => {
      const getVirtualMarketByIdSelector = createVirtualMarketByIdSelector();
      const result = getVirtualMarketByIdSelector(stateMock, "22334455");

      expect(result).toEqual(stateMock["ppb:virtualMarket:22334455"]);
    });
  });
});
