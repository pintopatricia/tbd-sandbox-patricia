import { ExchangeTransactional } from "@flutter-global/uki-channels-http-clients";
import { placeBet, updateBet, cancelBet, replaceBet, implyBet } from "./exchange-bet-service";
import resolveEtxError from "./etx-error-mapper";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  ExchangeTransactional: jest.fn().mockReturnValue({
    place: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    replace: jest.fn(),
    imply: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => ExchangeTransactional),
}));

jest.mock("./etx-error-mapper", () => jest.fn(() => null));

function setup({ method, error, etxResponse, etxError = null }) {
  resolveEtxError.mockReturnValue(etxError);
  ExchangeTransactional()[method].mockReturnValue(error ? Promise.reject(error) : Promise.resolve(etxResponse));
}

afterEach(jest.clearAllMocks);

describe("ExchangeBetService", () => {
  describe("API", () => {
    it("should expose a placeBet method", () => {
      expect(placeBet).toBeDefined();
    });

    it("should expose a updateBet method", () => {
      expect(updateBet).toBeDefined();
    });

    it("should expose a cancelBet method", () => {
      expect(cancelBet).toBeDefined();
    });

    it("should expose a replaceBet method", () => {
      expect(replaceBet).toBeDefined();
    });

    it("should expose a implyBet method", () => {
      expect(implyBet).toBeDefined();
    });
  });

  describe("placeBet", () => {
    it("should use ETX service to place bet", async () => {
      const USE_AVAILABLE_BONUS = false;
      setup({
        method: "place",
        etxResponse: {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }],
        },
      });
      await placeBet(
        "instruction",
        "marketId",
        {
          price: 1.01,
          size: 2,
        },
        {
          useAvailableBonus: USE_AVAILABLE_BONUS,
        },
      );
      expect(ExchangeTransactional().place).toHaveBeenCalledWith(["instruction"], "marketId", {
        useAvailableBonus: USE_AVAILABLE_BONUS,
      });
    });

    describe("when place resolves", () => {
      describe("and it comes without an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "SUCCESS" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "place", etxResponse: responseMock });
          await placeBet("instruction", "marketId", {
            price: 1.01,
            size: 2,
          });

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should return the execution report", async () => {
          setup({ method: "place", etxResponse: responseMock });
          expect(
            await placeBet("instruction", "marketId", {
              price: 1.01,
              size: 2,
            }),
          ).toEqual(responseMock);
        });
      });

      describe("and it comes with an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "FAILURE", errorCode: "some error code" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "place", etxResponse: responseMock });
          await placeBet("instruction", "marketId", {
            price: 1.01,
            size: 2,
          });

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should throw an error with instruction details", async () => {
          setup({ method: "place", etxResponse: responseMock, etxError: "some etx error code" });
          await expect(
            placeBet("instruction", "marketId", {
              price: 1.01,
              size: 2,
            }),
          ).rejects.toEqual({
            errorCode: "some etx error code",
            details: {
              price: 1.01,
              size: 2,
            },
          });
        });
      });
    });

    describe("when place rejects", () => {
      it("should throw default error", async () => {
        setup({ method: "place", error: "some error" });
        await expect(
          placeBet("instruction", "marketId", {
            price: 1.01,
            size: 2,
          }),
        ).rejects.toEqual({ errorCode: "UNABLE_PLACE_BET" });
      });
    });
  });

  describe("updateBet", () => {
    it("should use ETX service to update bet", async () => {
      setup({
        method: "update",
        etxResponse: {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }],
        },
      });
      await updateBet("instruction", "marketId");
      expect(ExchangeTransactional().update).toHaveBeenCalledWith(["instruction"], "marketId", {});
    });

    describe("when update resolves", () => {
      describe("and it comes without an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "SUCCESS" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "update", etxResponse: responseMock });
          await updateBet("instruction", "marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should return the execution report", async () => {
          setup({ method: "update", etxResponse: responseMock });
          expect(await updateBet("instruction", "marketId")).toEqual(responseMock);
        });
      });

      describe("and it comes with an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "FAILURE", errorCode: "some error code" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "update", etxResponse: responseMock });
          await updateBet("instruction", "marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should throw an error", async () => {
          setup({ method: "update", etxResponse: responseMock, etxError: "some etx error code" });
          await expect(updateBet("instruction", "marketId")).rejects.toEqual({ errorCode: "some etx error code" });
        });
      });
    });

    describe("when update rejects", () => {
      it("should throw default error", async () => {
        setup({ method: "update", error: "some error" });
        await expect(updateBet("instruction", "marketId")).rejects.toEqual({ errorCode: "UNABLE_PLACE_BET" });
      });
    });
  });

  describe("implyBet", () => {
    it("should use ETX service", async () => {
      setup({
        method: "imply",
        etxResponse: {
          status: "SUCCESS",
        },
      });
      await implyBet("marketId");
      expect(ExchangeTransactional).toHaveBeenCalledWith("ETX");
    });

    it("should use ETX service to get exchange imply report response", async () => {
      setup({
        method: "imply",
        etxResponse: {
          status: "SUCCESS",
          hasBonusMoney: false,
          wallets: [],
        },
      });
      await implyBet("marketId");
      expect(ExchangeTransactional().imply).toHaveBeenCalledWith("marketId");
    });

    describe("when exchange imply report resolves", () => {
      describe("and it comes without an error", () => {
        const responseMock = {
          status: "SUCCESS",
          hasBonusMoney: false,
          wallets: [],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "imply", etxResponse: responseMock });
          await implyBet("marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should return the execution report", async () => {
          setup({ method: "imply", etxResponse: responseMock });
          expect(await implyBet("marketId")).toEqual(responseMock);
        });
      });

      describe("and it comes with an error", () => {
        const responseMock = {
          status: "SUCCESS",
          errorCode: "BONUS_NOT_AVAILABLE_FOR_BET_CONTEXT",
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "imply", etxResponse: responseMock });
          await implyBet("marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should throw an error", async () => {
          setup({ method: "imply", etxResponse: responseMock, etxError: "some etx error code" });
          await expect(implyBet("marketId")).rejects.toEqual({
            errorCode: "some etx error code",
          });
        });
      });
    });

    describe("when implyReport rejects", () => {
      it("should throw default error", async () => {
        setup({ method: "imply", error: "some error" });
        await expect(implyBet("marketId")).rejects.toEqual({ errorCode: "UNABLE_PLACE_BET" });
      });
    });
  });

  describe("cancelBet", () => {
    it("should use ETX service to update bet", async () => {
      setup({
        method: "cancel",
        etxResponse: {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }],
        },
      });

      await cancelBet(["instruction"], "marketId");

      expect(ExchangeTransactional().cancel).toHaveBeenCalledWith({
        instructions: ["instruction"],
        marketId: "marketId",
      });
    });

    describe("when cancel resolves", () => {
      describe("and it comes without an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "SUCCESS" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "cancel", etxResponse: responseMock });
          await cancelBet(["instruction"], "marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should return the execution report", async () => {
          setup({ method: "cancel", etxResponse: responseMock });
          expect(await cancelBet(["instruction"], "marketId")).toEqual(responseMock);
        });
      });

      describe("and it comes with an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "FAILURE", errorCode: "some error code" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "cancel", etxResponse: responseMock });
          await cancelBet(["instruction"], "marketId");

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should throw an error", async () => {
          setup({ method: "cancel", etxResponse: responseMock, etxError: "some etx error code" });
          await expect(cancelBet(["instruction"], "marketId")).rejects.toEqual({ errorCode: "some etx error code" });
        });
      });
    });

    describe("when cancel rejects", () => {
      it("should throw default error", async () => {
        setup({ method: "cancel", error: "some error" });
        await expect(cancelBet(["instruction"], "marketId")).rejects.toEqual({ errorCode: "UNABLE_PLACE_BET" });
      });
    });
  });

  describe("replaceBet", () => {
    it("should use ETX service to update bet", async () => {
      setup({
        method: "replace",
        etxResponse: {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }],
        },
      });
      await replaceBet("instruction", "marketId", {
        price: 1.01,
        size: 2,
      });
      expect(ExchangeTransactional().replace).toHaveBeenCalledWith(["instruction"], "marketId", {});
    });

    describe("when replace resolves", () => {
      describe("and it comes without an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "SUCCESS" }],
        };

        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "replace", etxResponse: responseMock });
          await replaceBet("instruction", "marketId", {
            price: 1.01,
            size: 2,
          });

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should return the execution report", async () => {
          setup({ method: "replace", etxResponse: responseMock });
          expect(
            await replaceBet("instruction", "marketId", {
              price: 1.01,
              size: 2,
            }),
          ).toEqual(responseMock);
        });
      });

      describe("and it comes with an error", () => {
        const responseMock = {
          status: "SUCCESS",
          instructionReports: [{ status: "SUCCESS" }, { status: "FAILURE", errorCode: "some error code" }],
        };
        it("should check if there was an error using resolveEtxError function", async () => {
          setup({ method: "replace", etxResponse: responseMock });
          await replaceBet("instruction", "marketId", {
            price: 1.01,
            size: 2,
          });

          expect(resolveEtxError).toHaveBeenCalledWith(responseMock);
          expect(resolveEtxError).toHaveBeenCalledTimes(1);
        });

        it("should throw an error", async () => {
          setup({ method: "replace", etxResponse: responseMock, etxError: "some etx error code" });
          await expect(
            replaceBet("instruction", "marketId", {
              price: 1.01,
              size: 2,
            }),
          ).rejects.toEqual({
            errorCode: "some etx error code",
            details: {
              price: 1.01,
              size: 2,
            },
          });
        });
      });
    });

    describe("when replace rejects", () => {
      it("should throw default error", async () => {
        setup({ method: "replace", error: "some error" });
        await expect(replaceBet("instruction", "marketId")).rejects.toEqual({ errorCode: "UNABLE_PLACE_BET" });
      });
    });
  });
});
