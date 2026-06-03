import { LiveBetReporting } from "@flutter-global/uki-channels-http-clients";
import * as LiveBetReportingService from "./live-bet-reporting-service";
import { prefixLBRBetId, sanitizeBetId } from "./betting";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  LiveBetReporting: jest.fn().mockReturnValue({
    searchOrders: jest.fn(),
    getMarketPositionViews: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => LiveBetReporting),
}));

const lbrMock = {
  liveOrders: [
    {
      betId: "1:12345678",
    },
  ],
  currencyCode: "EUR",
};

jest.mock("./betting", () => ({
  sanitizeBetId: jest.fn((betId) => betId.replace(/^(1:)/, "")),
  prefixLBRBetId: jest.fn((betId) => `1:${betId}`),
}));

function setup(mock) {
  LiveBetReporting().searchOrders.mockResolvedValue(mock);
}

function buildOrder({ betId, marketId }) {
  return {
    betId,
    marketId,
    averagePriceMatched: 1.23,
    bspLiability: 10,
    selectionId: 1,
    handicap: 0,
    isFreeBet: false,
    orderType: "LIMIT",
    persistenceType: "MOCK",
    price: 1.01,
    side: "BACK",
    size: 2,
    sizeMatched: 2,
    sizeRemaining: 0,
  };
}

describe("LiveBetReportingService", () => {
  describe("API", () => {
    it("should expose a searchOrders method", () => {
      expect(LiveBetReportingService.searchOrders).toBeInstanceOf(Function);
    });

    it("should expose a getMarketPositionViews method", () => {
      expect(LiveBetReportingService.getMarketPositionViews).toBeInstanceOf(Function);
    });
  });

  describe("Behaviour", () => {
    describe("searchOrders", () => {
      describe("when no betIDs are sent as parameter", () => {
        it("should throw error", async () => {
          await expect(LiveBetReportingService.searchOrders([])).rejects.toThrow("no bet IDs were given");
        });
      });

      describe("when betIDs are sent as parameter", () => {
        it("should use LBR searchOrders with betIds", async () => {
          setup(lbrMock);

          await LiveBetReportingService.searchOrders(["12345678"]);

          expect(prefixLBRBetId).toHaveBeenCalledWith("12345678");
          expect(LiveBetReporting().searchOrders).toHaveBeenCalledWith({ betIds: ["1:12345678"] });
        });

        it("should return LBR search orders data", async () => {
          setup(lbrMock);

          const response = await LiveBetReportingService.searchOrders(["1:12345678"]);

          expect(sanitizeBetId).toHaveBeenCalledWith("1:12345678");
          expect(response).toEqual({
            liveOrders: [
              {
                betId: "12345678",
              },
            ],
            currencyCode: "EUR",
          });
        });
      });
    });

    describe("getMarketPositionViews", () => {
      const order1 = buildOrder({ betId: "order:1", marketId: "1" });
      const order2 = buildOrder({ betId: "order:2", marketId: "1" });

      function setupResolvedPositionViews() {
        LiveBetReporting().getMarketPositionViews.mockResolvedValue([
          {
            marketId: "1",
            selections: [
              {
                selectionId: 1,
                orders: [order1],
              },
              {
                selectionId: 2,
                orders: [order2],
              },
            ],
            settledProfit: 1,
          },
          {
            marketId: "2",
            selections: [
              {
                selectionId: 1,
                orders: [],
              },
            ],
            settledProfit: 2,
          },
        ]);
      }

      it("should call liveBetReporting.getMarketPositionViews with given marketIds and request settledProfit", async () => {
        setupResolvedPositionViews();

        await LiveBetReportingService.getMarketPositionViews(["urn1", "urn2"]);

        expect(LiveBetReporting().getMarketPositionViews).toHaveBeenCalledWith(["urn1", "urn2"], {
          includeSettledProfit: true,
        });
        expect(LiveBetReporting().getMarketPositionViews).toHaveBeenCalledTimes(1);
      });

      describe("when liveBetReporting.getMarketPositionViews resolves", () => {
        it("should aggregate orders and settledProfit by market", async () => {
          setupResolvedPositionViews();

          const response = await LiveBetReportingService.getMarketPositionViews(["urn1", "urn2"]);

          expect(response).toEqual({
            "ppb:excMarket:1": {
              market: "ppb:excMarket:1",
              marketId: "1",
              settledProfit: 1,
              orders: [
                expect.objectContaining({ ...order1, marketId: "1", marketUrn: "ppb:excMarket:1" }),
                expect.objectContaining({ ...order2, marketId: "1", marketUrn: "ppb:excMarket:1" }),
              ],
            },
            "ppb:excMarket:2": {
              market: "ppb:excMarket:2",
              marketId: "2",
              orders: [],
              settledProfit: 2,
            },
          });
        });
      });
      describe("when liveBetReporting.getMarketPositionViews rejects", () => {
        it("should reject with same error", async () => {
          LiveBetReporting().getMarketPositionViews.mockRejectedValue(new Error("some reason"));

          await expect(LiveBetReportingService.getMarketPositionViews([])).rejects.toThrow("some reason");
        });
      });
    });
  });
});
