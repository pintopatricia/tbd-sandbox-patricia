import {
  createGetUserMainWalletValueSelector,
  createGetUserSpecificWalletSelector,
  getUserWallets,
} from "./user-wallets-selectors";

const stateMock = {
  entities: {
    wallets: {
      MAIN: {
        walletName: "MAIN",
        amount: 123,
        status: "SUCCESS",
      },
      TOKENS: {
        walletName: "TOKENS",
        amount: 4,
        status: "SUCCESS",
      },
      ARCADE_BONUS: {
        walletName: "ARCADE_BONUS",
        amount: 5,
        status: "SUCCESS",
      },
      CASINO_BONUS: {
        walletName: "CASINO_BONUS",
        amount: 0,
        real: 1,
        winnings: 2,
        bonus: 3,
        status: "SUCCESS",
      },
      POKER: {
        walletName: "POKER",
        amount: 0,
        status: "SUCCESS",
      },
      SPORTSBOOK_BONUS: {
        walletName: "SPORTSBOOK_BONUS",
        amount: null,
      },
      EXCHANGE_BONUS_CASH: {
        walletName: "EXCHANGE_BONUS_CASH",
        amount: 2,
        status: "SUCCESS",
      },
      XG: {
        walletName: "XG",
        amount: 0,
        status: "DOWNSTREAM_SERVICE_ERROR",
      },
    },
  },
};

describe('"user-wallets" selector', () => {
  describe("getUserWallets selector", () => {
    it("must return the user wallets from the state", () => {
      const userWallets = getUserWallets(stateMock);
      expect(userWallets).toEqual({
        MAIN: {
          walletName: "MAIN",
          amount: 123,
          status: "SUCCESS",
        },
        TOKENS: {
          walletName: "TOKENS",
          amount: 4,
          status: "SUCCESS",
        },
        ARCADE_BONUS: {
          walletName: "ARCADE_BONUS",
          amount: 5,
          status: "SUCCESS",
        },
        CASINO_BONUS: {
          walletName: "CASINO_BONUS",
          amount: 0,
          real: 1,
          winnings: 2,
          bonus: 3,
          status: "SUCCESS",
        },
        POKER: {
          walletName: "POKER",
          amount: 0,
          status: "SUCCESS",
        },
        SPORTSBOOK_BONUS: {
          walletName: "SPORTSBOOK_BONUS",
          amount: null,
        },
        EXCHANGE_BONUS_CASH: {
          walletName: "EXCHANGE_BONUS_CASH",
          amount: 2,
          status: "SUCCESS",
        },
        XG: {
          walletName: "XG",
          amount: 0,
          status: "DOWNSTREAM_SERVICE_ERROR",
        },
      });
    });

    it("must throw when no user wallets are set in the state", () => {
      const wallets = getUserWallets({});
      expect(wallets).toEqual(null);
    });
  });

  describe("createGetUserMainWalletValueSelector selector", () => {
    it("must return the user's main wallet when it exists", () => {
      const getUserMainWalletValue = createGetUserMainWalletValueSelector();
      const mainWallet = getUserMainWalletValue(stateMock);

      expect(mainWallet).toEqual(123);
    });

    it("must return null when main wallet does not exist", () => {
      const getUserMainWalletValue = createGetUserMainWalletValueSelector();
      const mainWallet = getUserMainWalletValue({});

      expect(mainWallet).toEqual(null);
    });
  });

  describe("createGetUserSpecificWalletSelector selector", () => {
    it("must return the user's specific wallet when it exists", () => {
      const getUserSpecificWallet = createGetUserSpecificWalletSelector("EXCHANGE_BONUS_CASH");
      const wallet = getUserSpecificWallet(stateMock);

      expect(wallet).toEqual({
        walletName: "EXCHANGE_BONUS_CASH",
        amount: 2,
        status: "SUCCESS",
      });
    });

    it("must return null when specific wallet does not exist", () => {
      const getUserSpecificWallet = createGetUserSpecificWalletSelector("SOME_RANDOM_WALLET");
      const wallet = getUserSpecificWallet(stateMock);

      expect(wallet).toEqual(null);
    });

    it("must return null when specific wallet does not exist and the state is empty", () => {
      const getUserSpecificWallet = createGetUserSpecificWalletSelector("SOME_RANDOM_WALLET");
      const wallet = getUserSpecificWallet({});

      expect(wallet).toEqual(null);
    });
  });
});
