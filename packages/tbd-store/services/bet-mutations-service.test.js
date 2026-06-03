import { SportsbookCashoutOperation } from "@flutter-global/uki-channels-http-clients";
import BetMutationsService from "./bet-mutations-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  SportsbookCashoutOperation: jest.fn().mockReturnValue({
    freezeBet: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn((client) => client),
}));

const SCOFreezeBetMockSuccess = {
  respStatus: "SUCCESS",
  freezeLiveDataDetails: {
    minute: 5,
    homeTeamName: "Manchester United",
    homeTeamScore: 5,
    awayTeamName: "Stockport County",
    awayTeamScore: 2,
  },
};

const SCOMockError = {
  error: "error",
};

let response;

describe("BetMutationsService", () => {
  describe("API", () => {
    it("should expose a freezeBet method", () => {
      expect(BetMutationsService.freezeBet).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("freezeBet", () => {
      describe("success scenario", () => {
        beforeAll(async () => {
          SportsbookCashoutOperation().freezeBet.mockReturnValue(SCOFreezeBetMockSuccess);
          response = await BetMutationsService.freezeBet("123456", ["1"]);
        });

        it("should call SportsbookCashoutOperation freezeBet with expected data", async () => {
          expect(SportsbookCashoutOperation().freezeBet).toHaveBeenCalledWith("123456", ["1"]);
        });

        it("should return the response from SCO", async () => {
          expect(response).toEqual(SCOFreezeBetMockSuccess);
        });
      });
      describe("failure scenario", () => {
        beforeAll(async () => {
          SportsbookCashoutOperation().freezeBet.mockRejectedValue(SCOMockError);
        });

        it("should throw the appropriate error", async () => {
          await expect(BetMutationsService.freezeBet("123456", 1)).rejects.toEqual(SCOMockError);
        });
      });
    });
  });
});
