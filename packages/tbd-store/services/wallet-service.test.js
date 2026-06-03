import { WalletService } from "@flutter-global/uki-channels-http-clients";
import WalletServiceClient from "./wallet-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  WalletService: jest.fn().mockReturnValue({
    wallets: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => WalletService),
}));

function setup(mock) {
  WalletService().wallets.mockReturnValue(Promise.resolve(mock));
}

describe("WalletService", () => {
  describe("getWallets", () => {
    describe("when service returns wallets", () => {
      beforeAll(async () => {
        setup([
          {
            details: { amount: "123" },
            walletName: "MAIN",
            status: "SUCCESS",
          },
          {
            details: { amount: "10" },
            walletName: "POKER",
            status: "SUCCESS",
          },
        ]);
      });

      it("should return wallets when service returns them", async () => {
        const wallet = await WalletServiceClient.getWallets();
        expect(wallet).toEqual([
          {
            walletName: "MAIN",
            status: "SUCCESS",
            amount: 123,
            availabletobet: 0,
            bonus: 0,
            bonuses: 0,
            deposits: 0,
            real: 0,
            winnings: 0,
          },
          {
            walletName: "POKER",
            status: "SUCCESS",
            amount: 10,
            availabletobet: 0,
            bonus: 0,
            bonuses: 0,
            deposits: 0,
            real: 0,
            winnings: 0,
          },
        ]);
      });
    });

    describe("when service request fails", () => {
      beforeAll(async () => {
        setup({ details: "json parse failed" });
      });

      it("should throw an error", async () => {
        try {
          await WalletServiceClient.getWallets();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(error).toEqual(new Error("An error occured while fetching wallets"));
        }
      });
    });

    describe("when service returns known wallets but one of then is not with success", () => {
      beforeAll(async () => {
        setup([
          {
            details: { amount: "123" },
            walletName: "MAIN",
            status: "SUCCESS",
          },
          {
            details: {},
            walletName: "XG",
            status: "DOWNSTREAM_SERVICE_ERROR",
          },
        ]);
      });

      it("should return MAIN wallet when service returns it", async () => {
        const wallet = await WalletServiceClient.getWallets();
        expect(wallet).toEqual([
          {
            walletName: "MAIN",
            status: "SUCCESS",
            amount: 123,
            availabletobet: 0,
            bonus: 0,
            bonuses: 0,
            deposits: 0,
            real: 0,
            winnings: 0,
          },
          { walletName: "XG", status: "DOWNSTREAM_SERVICE_ERROR" },
        ]);
      });
    });

    describe("when service returns known wallets and has extra details besides amount", () => {
      beforeAll(async () => {
        setup([
          {
            details: { amount: "123" },
            walletName: "MAIN",
            status: "SUCCESS",
          },
          {
            details: {},
            walletName: "XG",
            status: "DOWNSTREAM_SERVICE_ERROR",
          },
          {
            details: {
              real: "1",
              winnings: "0",
              bonus: "2",
            },
            walletName: "CASINO_BONUS",
            status: "SUCCESS",
          },
        ]);
      });

      it("should return MAIN wallet when service returns it", async () => {
        const wallet = await WalletServiceClient.getWallets();
        expect(wallet).toEqual([
          {
            walletName: "MAIN",
            status: "SUCCESS",
            amount: 123,
            availabletobet: 0,
            bonus: 0,
            bonuses: 0,
            deposits: 0,
            real: 0,
            winnings: 0,
          },
          { walletName: "XG", status: "DOWNSTREAM_SERVICE_ERROR" },
          {
            walletName: "CASINO_BONUS",
            status: "SUCCESS",
            amount: 0,
            availabletobet: 0,
            bonus: 2,
            bonuses: 0,
            deposits: 0,
            real: 1,
            winnings: 0,
          },
        ]);
      });
    });

    describe("when service returns known wallets and has extra details with default value (0) besides amount", () => {
      beforeAll(async () => {
        setup([
          {
            details: {
              real: "0",
              winnings: "0",
              bonus: "0",
            },
            walletName: "CASINO_BONUS",
            status: "SUCCESS",
          },
        ]);
      });

      it("should return MAIN wallet when service returns it", async () => {
        const wallet = await WalletServiceClient.getWallets();
        expect(wallet).toEqual([
          {
            walletName: "CASINO_BONUS",
            status: "SUCCESS",
            amount: 0,
            availabletobet: 0,
            bonus: 0,
            bonuses: 0,
            deposits: 0,
            real: 0,
            winnings: 0,
          },
        ]);
      });
    });
  });
});
