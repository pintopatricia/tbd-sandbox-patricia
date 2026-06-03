import {
  CashoutReadOnly,
  CashoutTransactional,
  SportsbookCashoutOperation,
  FixedOddsCashoutQuote,
} from "@flutter-global/uki-channels-http-clients";
import CashoutService from "./cashout-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  CashoutReadOnly: jest.fn().mockReturnValue({
    quote: jest.fn(),
  }),
  CashoutTransactional: jest.fn().mockReturnValue({
    cashout: jest.fn(),
  }),
  SportsbookCashoutOperation: jest.fn().mockReturnValue({
    cashoutBet: jest.fn(),
  }),
  FixedOddsCashoutQuote: jest.fn().mockReturnValue({
    getBetQuotes: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn((client) => client),
}));

const cosQuoteMock = [
  {
    marketId: "1.111111111",
    value: 1.96,
    currentLiability: 2,
    profit: -0.04,
    profitPerSelection: {
      10000001: -0.04,
      58805: -0.04,
      10000002: -0.04,
    },
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
  {
    marketId: "1.111111112",
    handicap: 2,
    value: 1.96,
    currentLiability: 2,
    profit: -0.04,
    profitPerSelection: {
      10000003: -0.04,
      58805: -0.04,
      10000004: -0.04,
    },
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
  {
    marketId: "1.111111113",
    value: 1.96,
    currentLiability: 2,
    profit: -0.04,
    profitPerSelection: {
      10000005: -0.04,
      58805: -0.04,
      10000006: -0.04,
    },
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
];

const COSMockSuccess = {
  status: "status",
};

const COSMockError = {
  error: "error",
};

const SCOMockSuccess = {
  status: "status",
};

const SCOMockError = {
  error: "error",
};

const fcqQuoteMock = {
  1036870529: {
    betId: "1036870529",
    stake: 2.0,
    quote: 2.57,
    refreshRate: 10,
    quoteStatus: "AVAILABLE",
  },
  1038945189: {
    betId: "1038945189",
    stake: 2.0,
    quote: 2.0,
    refreshRate: 10,
    quoteStatus: "AVAILABLE",
  },
  1038830786: {
    betId: "1038830786",
    stake: 1.75,
    quote: 1.55,
    refreshRate: 10,
    quoteStatus: "AVAILABLE",
  },
};

let response;

describe("CashoutService", () => {
  describe("API", () => {
    it("should expose a quote method", () => {
      expect(CashoutService.quote).toBeDefined();
    });
    it("should expose a takeEXC method", () => {
      expect(CashoutService.takeEXC).toBeDefined();
    });

    it("should expose a takeSBK method", () => {
      expect(CashoutService.takeSBK).toBeDefined();
    });

    it("should expose a betQuotes method", () => {
      expect(CashoutService.betQuotes).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("quote", () => {
      beforeAll(async () => {
        CashoutReadOnly().quote.mockReturnValue(cosQuoteMock);
        response = await CashoutService.quote("EUR", ["MARKET_IDS"]);
      });

      it("should call cashout service quote with expected data", async () => {
        expect(CashoutReadOnly().quote).toHaveBeenCalledWith("EUR", ["MARKET_IDS"]);
      });

      it("should map the quotes by their URN", async () => {
        expect(response).toEqual({
          "ppb:excCashoutQuote:1.111111111/0": {
            currentLiability: 2,
            typename: "ExchangeCashoutQuote",
            marketURN: "ppb:excMarket:1.111111111",
            marketBetURN: "ppb:marketBet:1.111111111",
            profit: -0.04,
            status: "AVAILABLE",
            urn: "ppb:excCashoutQuote:1.111111111/0",
            value: 1.96,
          },
          "ppb:excCashoutQuote:1.111111112/2": {
            currentLiability: 2,
            typename: "ExchangeCashoutQuote",
            marketURN: "ppb:excMarket:1.111111112",
            marketBetURN: "ppb:marketBet:1.111111112",
            profit: -0.04,
            status: "AVAILABLE",
            urn: "ppb:excCashoutQuote:1.111111112/2",
            value: 1.96,
          },
          "ppb:excCashoutQuote:1.111111113/0": {
            currentLiability: 2,
            typename: "ExchangeCashoutQuote",
            marketURN: "ppb:excMarket:1.111111113",
            marketBetURN: "ppb:marketBet:1.111111113",
            profit: -0.04,
            status: "AVAILABLE",
            urn: "ppb:excCashoutQuote:1.111111113/0",
            value: 1.96,
          },
        });
      });
    });

    describe("takeEXC", () => {
      describe("success scenario", () => {
        beforeAll(async () => {
          CashoutTransactional().cashout.mockReturnValue(COSMockSuccess);
          response = await CashoutService.takeEXC("currencyCode", "marketId", 1, "customerRef", 0, 100, 1123);
        });

        it("should call cashout transactional cashout with expected data", async () => {
          expect(CashoutTransactional().cashout).toHaveBeenCalledWith("currencyCode", "marketId", 1, {
            customerRef: "customerRef",
            handicap: 0,
            quotePercentage: 100,
            selectionId: 1123,
          });
        });

        it("should return the response from COS", async () => {
          expect(response).toEqual(COSMockSuccess);
        });
      });
      describe("failure scenario", () => {
        beforeAll(async () => {
          CashoutTransactional().cashout.mockRejectedValue(COSMockError);
        });

        it("should throw the appropriate error", async () => {
          await expect(CashoutService.takeEXC("currencyCode", "marketId", 1)).rejects.toEqual(COSMockError);
        });
      });
    });

    describe("takeSBK", () => {
      describe("success scenario", () => {
        beforeAll(async () => {
          SportsbookCashoutOperation().cashoutBet.mockReturnValue(SCOMockSuccess);
          response = await CashoutService.takeSBK(1, 12345, "cashOutToken", 2);
        });

        it("should call SportsbookCashoutOperation cashoutBet with expected data", async () => {
          expect(SportsbookCashoutOperation().cashoutBet).toHaveBeenCalledWith(1, {
            betId: 12345,
            cashOutToken: "cashOutToken",
            quote: 2,
          });
        });

        it("should return the response from COS", async () => {
          expect(response).toEqual(COSMockSuccess);
        });
      });
      describe("failure scenario", () => {
        beforeAll(async () => {
          SportsbookCashoutOperation().cashoutBet.mockRejectedValue(SCOMockError);
        });

        it("should throw the appropriate error", async () => {
          await expect(CashoutService.takeSBK(1, 12345, "cashOutToken", 2)).rejects.toEqual(SCOMockError);
        });
      });
    });

    describe("betQuotes", () => {
      beforeAll(async () => {
        FixedOddsCashoutQuote().getBetQuotes.mockReturnValue(fcqQuoteMock);
        response = await CashoutService.betQuotes(["BET_IDS"]);
      });

      it("should call cashout service quote with expected data", async () => {
        expect(FixedOddsCashoutQuote().getBetQuotes).toHaveBeenCalledWith(["BET_IDS"]);
      });

      it("should map the quotes by their URN", async () => {
        expect(response).toEqual({
          "ppb:sbkCashoutQuote:1036870529": {
            typename: "SportsbookCashoutQuote",
            betUrn: "ppb:sbkBet:1036870529",
            quote: 2.57,
            refreshRate: 10,
            stake: 2,
            status: "AVAILABLE",
            urn: "ppb:sbkCashoutQuote:1036870529",
          },
          "ppb:sbkCashoutQuote:1038830786": {
            typename: "SportsbookCashoutQuote",
            betUrn: "ppb:sbkBet:1038830786",
            quote: 1.55,
            refreshRate: 10,
            stake: 1.75,
            status: "AVAILABLE",
            urn: "ppb:sbkCashoutQuote:1038830786",
          },
          "ppb:sbkCashoutQuote:1038945189": {
            typename: "SportsbookCashoutQuote",
            betUrn: "ppb:sbkBet:1038945189",
            quote: 2,
            refreshRate: 10,
            stake: 2,
            status: "AVAILABLE",
            urn: "ppb:sbkCashoutQuote:1038945189",
          },
        });
      });
    });
  });
});
